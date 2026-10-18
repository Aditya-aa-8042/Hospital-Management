import Payment from "../models/Payment.js";
import Appointment from "../models/Appointment.js";
import crypto from "crypto";
import asyncHandler from "../utils/asyncHandler.js";

// @route   POST /api/payments
// @desc    Create a payment for an appointment (mock/manual flow - no real gateway yet)
// @access  Private (User)
export const createPayment = asyncHandler(async (req, res) => {
  const { appointmentId, phone, amount, paymentMethod, accountNumber, upiId } = req.body;

  if (!appointmentId || !phone || !amount || !paymentMethod) {
    res.status(400);
    throw new Error("appointmentId, phone, amount and paymentMethod are required");
  }

  // Confirm the appointment exists and belongs to the logged-in user
  const appointment = await Appointment.findOne({
    _id: appointmentId,
    bookedBy: req.user._id,
  });

  if (!appointment) {
    res.status(404);
    throw new Error("Appointment not found in your account");
  }

  // Prevent duplicate successful payments for the same appointment
  const existingPayment = await Payment.findOne({
    appointment: appointmentId,
    status: "Success",
  });

  if (existingPayment) {
    res.status(400);
    throw new Error("This appointment has already been paid for");
  }

  // Generate a unique transaction ID (placeholder until a real payment gateway is integrated)
  const transactionId = `TXN-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;

  const payment = await Payment.create({
    user: req.user._id,
    patient: appointment.patient,
    appointment: appointmentId,
    phone,
    amount,
    paymentMethod,
    accountNumber,
    upiId,
    transactionId,
    status: "Success", // simplified for now - see note below on real gateway integration
    paidAt: new Date(),
  });

  res.status(201).json({
    success: true,
    message: "Payment recorded successfully",
    data: payment,
  });
});

// @route   GET /api/payments/my
// @desc    Logged-in user's payment history
// @access  Private (User)
export const getMyPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ user: req.user._id })
    .populate("patient", "name age gender")
    .populate({
      path: "appointment",
      populate: { path: "doctor", select: "name specialization" },
    })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: payments.length,
    data: payments,
  });
});

// @route   GET /api/payments/:id
// @desc    Get a single payment (must belong to logged-in user)
// @access  Private (User)
export const getPaymentById = asyncHandler(async (req, res) => {
  const payment = await Payment.findOne({
    _id: req.params.id,
    user: req.user._id,
  })
    .populate("patient", "name age gender")
    .populate({
      path: "appointment",
      populate: { path: "doctor", select: "name specialization" },
    });

  if (!payment) {
    res.status(404);
    throw new Error("Payment not found");
  }

  res.status(200).json({
    success: true,
    data: payment,
  });
});