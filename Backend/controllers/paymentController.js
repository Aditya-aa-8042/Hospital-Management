import Payment from "../models/Payment.js";
import Appointment from "../models/Appointment.js";
import asyncHandler from "../utils/asyncHandler.js";
import { razorpayRequest, verifyRazorpayWebhookSignature } from "../utils/razorpay.js";

const frontendUrl = () => (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");
const normalizePaymentMethod = (method) => ({
  upi: "UPI",
  card: "Card",
  netbanking: "Net Banking",
  wallet: "Wallet",
  emi: "Other",
  paylater: "Other",
}[String(method || "").toLowerCase()] || "Gateway");

const markPaymentPaid = async ({ linkId, paymentId, method, amount, currency }) => {
  const payment = await Payment.findOne({ provider: "razorpay", providerPaymentLinkId: linkId });
  if (!payment) return null;
  if (Number(amount) !== payment.amountPaise || currency !== payment.currency) {
    throw new Error("Razorpay payment amount or currency does not match the saved payment");
  }

  if (payment.status !== "Success") {
    payment.status = "Success";
    payment.providerPaymentId = paymentId || payment.providerPaymentId;
    payment.transactionId = paymentId || payment.transactionId;
    payment.paymentMethod = normalizePaymentMethod(method);
    payment.paidAt = new Date();
    await payment.save();
  }

  await Appointment.updateOne(
    { _id: payment.appointment, status: { $in: ["Confirmed", "Postponed"] }, paymentStatus: "Pending" },
    { $set: { paymentStatus: "Paid" } }
  );
  return payment;
};

export const createRazorpayPaymentLink = asyncHandler(async (req, res) => {
  const { appointmentId } = req.body;
  if (!appointmentId) {
    res.status(400);
    throw new Error("appointmentId is required");
  }

  const appointment = await Appointment.findOne({ _id: appointmentId, bookedBy: req.user._id })
    .populate("patient")
    .populate("doctor", "name fees")
    .populate("bookedBy", "email fullName");

  if (!appointment) {
    res.status(404);
    throw new Error("Appointment not found in your account");
  }
  if (!["Confirmed", "Postponed"].includes(appointment.status) || appointment.paymentStatus !== "Pending") {
    res.status(400);
    throw new Error("A payment link is available only for a doctor-confirmed appointment awaiting payment");
  }
  if (!appointment.paymentDeadlineAt || appointment.paymentDeadlineAt <= new Date()) {
    res.status(410);
    throw new Error("The 12-hour payment window has expired");
  }

  const amount = Number(appointment.doctor?.fees);
  const amountPaise = Math.round(amount * 100);
  if (!Number.isFinite(amountPaise) || amountPaise < 100) {
    res.status(400);
    throw new Error("The doctor fee is not configured as a valid payment amount");
  }

  const existingPayment = await Payment.findOne({
    appointment: appointment._id,
    provider: "razorpay",
    status: "Pending",
    providerPaymentLinkId: { $exists: true, $ne: "" },
  }).sort({ createdAt: -1 });

  if (existingPayment?.providerPaymentLinkId) {
    const link = await razorpayRequest(`/payment_links/${encodeURIComponent(existingPayment.providerPaymentLinkId)}`);
    if (link.status === "paid" && Number(link.amount_paid) === existingPayment.amountPaise) {
      await markPaymentPaid({ linkId: link.id, amount: link.amount_paid, currency: link.currency, method: "Gateway" });
      return res.status(200).json({ success: true, paid: true, message: "This appointment is already paid." });
    }
    if (["issued", "partially_paid"].includes(link.status)) {
      return res.status(200).json({
        success: true,
        shortUrl: link.short_url,
        amount: existingPayment.amount,
        deadline: appointment.paymentDeadlineAt,
      });
    }
    existingPayment.status = "Expired";
    await existingPayment.save();
  }

  const customer = {
    name: appointment.patient?.name || appointment.bookedBy?.fullName || "Patient",
    ...(appointment.patient?.phone ? { contact: appointment.patient.phone } : {}),
    ...(appointment.bookedBy?.email ? { email: appointment.bookedBy.email } : {}),
  };
  const link = await razorpayRequest("/payment_links", {
    method: "POST",
    body: {
      amount: amountPaise,
      currency: "INR",
      accept_partial: false,
      // Razorpay reference IDs must be unique for each payment-link attempt.
      reference_id: `${appointment._id}-${Date.now()}`,
      description: `Appointment with Dr. ${appointment.doctor.name}`.slice(0, 255),
      customer,
      notify: { sms: false, email: false },
      reminder_enable: false,
      expire_by: Math.floor(appointment.paymentDeadlineAt.getTime() / 1000),
      callback_url: `${frontendUrl()}/appointments?payment=returned`,
      callback_method: "get",
      notes: { appointmentId: String(appointment._id) },
    },
  });

  await Payment.create({
    user: req.user._id,
    patient: appointment.patient._id,
    appointment: appointment._id,
    phone: appointment.patient?.phone || "Not provided",
    amount,
    amountPaise,
    currency: "INR",
    paymentMethod: "Gateway",
    provider: "razorpay",
    providerPaymentLinkId: link.id,
    paymentDeadlineAt: appointment.paymentDeadlineAt,
    status: "Pending",
  });

  res.status(201).json({ success: true, shortUrl: link.short_url, amount, deadline: appointment.paymentDeadlineAt });
});

export const handleRazorpayWebhook = asyncHandler(async (req, res) => {
  const signature = req.get("X-Razorpay-Signature");
  if (!verifyRazorpayWebhookSignature(req.body, signature)) {
    return res.status(400).json({ success: false, message: "Invalid Razorpay webhook signature" });
  }

  let event;
  try { event = JSON.parse(req.body.toString("utf8")); } catch {
    return res.status(400).json({ success: false, message: "Invalid webhook body" });
  }

  const link = event.payload?.payment_link?.entity;
  const gatewayPayment = event.payload?.payment?.entity;
  if (event.event === "payment_link.paid" && link?.id && gatewayPayment) {
    await markPaymentPaid({
      linkId: link.id,
      paymentId: gatewayPayment.id,
      method: gatewayPayment.method,
      amount: gatewayPayment.amount,
      currency: gatewayPayment.currency,
    });
  } else if (["payment_link.expired", "payment_link.cancelled"].includes(event.event) && link?.id) {
    await Payment.updateOne({ providerPaymentLinkId: link.id, status: "Pending" }, { $set: { status: "Expired" } });
  }

  res.status(200).json({ success: true, received: true });
});

export const expireUnpaidAppointments = async () => {
  const dueAppointments = await Appointment.find({
    status: { $in: ["Confirmed", "Postponed"] },
    paymentStatus: "Pending",
    paymentDeadlineAt: { $lte: new Date() },
  }).select("_id");

  for (const appointment of dueAppointments) {
    const payment = await Payment.findOne({
      appointment: appointment._id,
      provider: "razorpay",
      status: "Pending",
      providerPaymentLinkId: { $exists: true, $ne: "" },
    }).sort({ createdAt: -1 });

    if (payment?.providerPaymentLinkId) {
      try {
        let link = await razorpayRequest(`/payment_links/${encodeURIComponent(payment.providerPaymentLinkId)}`);
        if (link.status === "paid" && Number(link.amount_paid) === payment.amountPaise) {
          await markPaymentPaid({ linkId: link.id, amount: link.amount_paid, currency: link.currency, method: "Gateway" });
          continue;
        }
        if (["issued", "partially_paid"].includes(link.status)) {
          link = await razorpayRequest(`/payment_links/${encodeURIComponent(link.id)}/cancel`, { method: "POST", body: {} });
          if (link.status === "paid") {
            const checked = await razorpayRequest(`/payment_links/${encodeURIComponent(payment.providerPaymentLinkId)}`);
            if (Number(checked.amount_paid) === payment.amountPaise) {
              await markPaymentPaid({ linkId: checked.id, amount: checked.amount_paid, currency: checked.currency, method: "Gateway" });
              continue;
            }
          }
        }
      } catch (error) {
        console.error(`Could not reconcile expired payment link for appointment ${appointment._id}:`, error.message);
        continue;
      }
    }

    const cancelled = await Appointment.findOneAndUpdate(
      { _id: appointment._id, status: { $in: ["Confirmed", "Postponed"] }, paymentStatus: "Pending", paymentDeadlineAt: { $lte: new Date() } },
      { $set: { status: "Cancelled", paymentStatus: "Expired", cancellationReason: "Payment window expired" } },
      { new: true }
    );
    if (cancelled) {
      await Payment.updateMany({ appointment: appointment._id, provider: "razorpay", status: "Pending" }, { $set: { status: "Expired" } });
    }
  }
};

export const startPaymentExpiryWorker = () => {
  const run = () => expireUnpaidAppointments().catch((error) => console.error("Payment expiry worker failed:", error.message));
  run();
  const timer = setInterval(run, 30_000);
  timer.unref?.();
};

export const cancelPendingPaymentLink = async (appointmentId) => {
  const payment = await Payment.findOne({ appointment: appointmentId, provider: "razorpay", status: "Pending" })
    .sort({ createdAt: -1 });
  if (!payment?.providerPaymentLinkId) return;

  const link = await razorpayRequest(`/payment_links/${encodeURIComponent(payment.providerPaymentLinkId)}`);
  if (link.status === "paid" && Number(link.amount_paid) === payment.amountPaise) {
    await markPaymentPaid({ linkId: link.id, amount: link.amount_paid, currency: link.currency, method: "Gateway" });
    return true;
  }
  if (["issued", "partially_paid"].includes(link.status)) {
    await razorpayRequest(`/payment_links/${encodeURIComponent(link.id)}/cancel`, { method: "POST", body: {} });
  }
  payment.status = "Expired";
  await payment.save();
  return false;
};

export const getMyPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ user: req.user._id })
    .populate("patient", "name age gender")
    .populate({ path: "appointment", populate: { path: "doctor", select: "name specialization fees" } })
    .sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: payments.length, data: payments });
});

export const getPaymentById = asyncHandler(async (req, res) => {
  const payment = await Payment.findOne({ _id: req.params.id, user: req.user._id })
    .populate("patient", "name age gender")
    .populate({ path: "appointment", populate: { path: "doctor", select: "name specialization fees" } });
  if (!payment) {
    res.status(404);
    throw new Error("Payment not found");
  }
  res.status(200).json({ success: true, data: payment });
});
