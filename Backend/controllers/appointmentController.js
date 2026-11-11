import Appointment from "../models/Appointment.js";
import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";
import asyncHandler from "../utils/asyncHandler.js";
import { getSpecializationKeywords, escapeRegex } from "../utils/diseases.js";
import { isAvailableAt } from "../utils/availability.js";
import { cancelPendingPaymentLink } from "./paymentController.js";

const paymentDeadlineForVisit = (appointmentDate, appointmentTime, confirmedAt = new Date()) => {
  const day = new Date(appointmentDate).toISOString().slice(0, 10);
  const match = /^(\d{1,2}):(\d{2})$/.exec(appointmentTime || "");
  if (!match) return null;
  // Appointment dates/times are entered in India local time in this app.
  const visitAt = new Date(`${day}T${match[1].padStart(2, "0")}:${match[2]}:00+05:30`);
  if (Number.isNaN(visitAt.getTime())) return null;
  const proposedDeadline = Math.min(
    confirmedAt.getTime() + 12 * 60 * 60 * 1000,
    visitAt.getTime() - 15 * 60 * 1000
  );
  const deadline = new Date(proposedDeadline);
  return deadline > confirmedAt ? deadline : null;
};

// @route   POST /api/appointments
// @desc    Book an appointment. Accepts EITHER:
//            - patientId  -> reuse an existing patient (dropdown flow)
//          OR
//            - name, age, gender, phone -> create a new patient first (form flow)
//          For the doctor, accepts EITHER:
//            - doctor (an id) -> book with that specific doctor
//          OR
//            - no doctor, but `disease` -> auto-assign the first available
//              doctor whose `treats` field matches the disease
// @access  Private (User)
export const bookAppointment = asyncHandler(async (req, res) => {
  const {
    patientId,
    name,
    age,
    gender,
    phone,
    doctor,
    disease,
    appointmentDate,
    appointmentTime,
    reason,
  } = req.body;

  if (!disease || !appointmentDate || !appointmentTime || !reason) {
    res.status(400);
    throw new Error("disease, appointmentDate, appointmentTime and reason are required");
  }

  // ---- Resolve the doctor: either explicitly chosen, or auto-assigned ----
  let doctorDoc;

  if (doctor) {
    doctorDoc = await Doctor.findById(doctor);
    if (!doctorDoc) {
      res.status(404);
      throw new Error("Selected doctor not found");
    }
  } else {
    // No doctor chosen - auto-assign an available doctor who either lists this disease
    // under `treats`, or whose specialization is the usual specialist for it
    // (e.g. Heart Disease -> Cardiologist).
    const matchConditions = [
      { treats: { $regex: escapeRegex(disease), $options: "i" } },
      ...getSpecializationKeywords(disease).map((keyword) => ({
        specialization: { $regex: escapeRegex(keyword), $options: "i" },
      })),
    ];

    // Availability is calculated from each doctor's days and hours (not stored), so
    // fetch the matching doctors and keep one who works on the requested date and time.
    const candidates = await Doctor.find({ $or: matchConditions });
    doctorDoc = candidates.find((doc) => isAvailableAt(doc, appointmentDate, appointmentTime));

    if (!doctorDoc) {
      res.status(404);
      throw new Error(
        `No doctor for "${disease}" is available on that day and time. Please try another date or time, or choose a doctor manually.`
      );
    }
  }

  // ---- Resolve the patient: either reused, or created from form fields ----
  let patient;

  if (patientId) {
    patient = await Patient.findOne({ _id: patientId, registeredBy: req.user._id });
    if (!patient) {
      res.status(404);
      throw new Error("Patient not found in your account");
    }
  } else {
    if (!name || age === undefined || !gender || !phone) {
      res.status(400);
      throw new Error("name, age, gender and phone are required to register a new patient");
    }

    patient = await Patient.create({
      registeredBy: req.user._id,
      name,
      age,
      gender,
      phone,
    });
  }

  const appointment = await Appointment.create({
    bookedBy: req.user._id,
    patient: patient._id,
    doctor: doctorDoc._id,
    disease,
    appointmentDate,
    appointmentTime,
    reason,
  });

  const populatedAppointment = await appointment.populate([
    { path: "patient" },
    { path: "doctor", select: "-password" },
  ]);

  res.status(201).json({
    success: true,
    message: "Appointment booked successfully",
    data: populatedAppointment,
  });
});

// @route   GET /api/appointments/my
// @desc    Logged-in user's own appointments (across all their patients)
// @access  Private (User)
export const getMyAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ bookedBy: req.user._id })
    .populate("patient")
    .populate("doctor", "-password")
    .sort({ appointmentDate: -1 });

  res.status(200).json({
    success: true,
    count: appointments.length,
    data: appointments,
  });
});

// @route   GET /api/appointments/doctor
// @desc    Logged-in doctor's appointments
// @access  Private (Doctor)
export const getDoctorAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ doctor: req.doctor._id })
    .populate("patient")
    .populate("bookedBy", "fullName email phone")
    .sort({ appointmentDate: 1 });

  res.status(200).json({
    success: true,
    count: appointments.length,
    data: appointments,
  });
});

// @route   GET /api/appointments/:id
// @desc    Get a single appointment - accessible by the user who booked it OR the assigned doctor
// @access  Private
export const getAppointmentById = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate("patient")
    .populate("doctor", "-password")
    .populate("bookedBy", "fullName email phone");

  if (!appointment) {
    res.status(404);
    throw new Error("Appointment not found");
  }

  const isOwner = req.userRole !== "doctor" && appointment.bookedBy._id.toString() === req.user._id.toString();
  const isAssignedDoctor = req.userRole === "doctor" && appointment.doctor._id.toString() === req.doctor._id.toString();

  if (!isOwner && !isAssignedDoctor) {
    res.status(403);
    throw new Error("Not authorized to view this appointment");
  }

  res.status(200).json({
    success: true,
    data: appointment,
  });
});

// @route   PATCH /api/appointments/:id/status
// @desc    Doctor updates appointment status (Confirmed / Completed / Cancelled / Postponed)
// @access  Private (Doctor - must be the assigned doctor)
export const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ["Pending", "Confirmed", "Completed", "Cancelled", "Postponed"];

  if (!status || !validStatuses.includes(status)) {
    res.status(400);
    throw new Error(`Status must be one of: ${validStatuses.join(", ")}`);
  }

  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error("Appointment not found");
  }

  if (appointment.doctor.toString() !== req.doctor._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to update this appointment");
  }

  const wasConfirmed = appointment.status === "Confirmed";
  if (status === "Cancelled" && appointment.paymentStatus === "Pending") {
    const alreadyPaid = await cancelPendingPaymentLink(appointment._id);
    if (alreadyPaid) {
      res.status(409);
      throw new Error("This appointment has already been paid. Contact the hospital to cancel and request a refund.");
    }
    appointment.paymentStatus = "Cancelled";
    appointment.paymentDeadlineAt = null;
  }
  if (status === "Confirmed" && !wasConfirmed) {
    const confirmedAt = new Date();
    const paymentDeadlineAt = paymentDeadlineForVisit(appointment.appointmentDate, appointment.appointmentTime, confirmedAt);
    if (!paymentDeadlineAt) {
      res.status(400);
      throw new Error("This appointment is too soon for online prepayment. Please choose a time at least 15 minutes from now or arrange payment directly.");
    }
    appointment.confirmedAt = confirmedAt;
    appointment.paymentDeadlineAt = paymentDeadlineAt;
    appointment.paymentStatus = "Pending";
    appointment.cancellationReason = "";
  }
  appointment.status = status;
  await appointment.save();

  res.status(200).json({
    success: true,
    message: "Appointment status updated",
    data: appointment,
  });
});

// @route   PATCH /api/appointments/:id/postpone
// @desc    Doctor reschedules an appointment to a new date/time
// @access  Private (Doctor - must be the assigned doctor)
export const postponeAppointment = asyncHandler(async (req, res) => {
  const { appointmentDate, appointmentTime } = req.body;

  if (!appointmentDate || !appointmentTime) {
    res.status(400);
    throw new Error("appointmentDate and appointmentTime are required");
  }

  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error("Appointment not found");
  }

  if (appointment.doctor.toString() !== req.doctor._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to update this appointment");
  }

  if (["Completed", "Cancelled", "Cancelled by patient"].includes(appointment.status)) {
    res.status(400);
    throw new Error(`Cannot postpone an appointment that is already ${appointment.status}`);
  }

  let nextPaymentDeadline = null;
  if (appointment.paymentStatus === "Pending") {
    nextPaymentDeadline = paymentDeadlineForVisit(appointmentDate, appointmentTime);
    if (!nextPaymentDeadline) {
      res.status(400);
      throw new Error("The new appointment time is too soon for online prepayment. Please choose a later time.");
    }
    await cancelPendingPaymentLink(appointment._id);
  }

  appointment.appointmentDate = appointmentDate;
  appointment.appointmentTime = appointmentTime;
  appointment.status = "Postponed";
  if (nextPaymentDeadline) {
    appointment.confirmedAt = new Date();
    appointment.paymentDeadlineAt = nextPaymentDeadline;
  }
  await appointment.save();

  const populated = await appointment.populate([
    { path: "patient" },
    { path: "bookedBy", select: "fullName email phone" },
  ]);

  res.status(200).json({
    success: true,
    message: "Appointment postponed successfully",
    data: populated,
  });
});

// @route   PATCH /api/appointments/:id/cancel
// @desc    Logged-in user cancels their own appointment (only before it is finished)
// @access  Private (User)
export const cancelAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findOne({
    _id: req.params.id,
    bookedBy: req.user._id,
  });

  if (!appointment) {
    res.status(404);
    throw new Error("Appointment not found");
  }

  if (["Completed", "Cancelled", "Cancelled by patient"].includes(appointment.status)) {
    res.status(400);
    throw new Error(`Cannot cancel an appointment that is already ${appointment.status}`);
  }

  if (appointment.paymentStatus === "Pending") {
    const alreadyPaid = await cancelPendingPaymentLink(appointment._id);
    if (alreadyPaid) {
      res.status(409);
      throw new Error("This appointment has already been paid. Contact the hospital to cancel and request a refund.");
    }
    appointment.paymentStatus = "Cancelled";
    appointment.paymentDeadlineAt = null;
  }
  // Saved as its own status, so it isn't mistaken for the doctor rejecting it
  appointment.status = "Cancelled by patient";
  appointment.reminderMinutesBefore = null;
  await appointment.save();

  const populated = await appointment.populate([
    { path: "patient" },
    { path: "doctor", select: "-password" },
  ]);

  res.status(200).json({
    success: true,
    message: "Appointment cancelled",
    data: populated,
  });
});

// Reminder choices, in minutes before the appointment: 30 min, 1 hour, 2 hours, 1 day
const ALLOWED_REMINDER_MINUTES = [30, 60, 120, 1440];

// @route   PATCH /api/appointments/:id/reminder
// @desc    Patient sets (or removes) a reminder for an appointment the doctor has confirmed.
//          Body: { minutesBefore: 30 | 60 | 120 | 1440 }, or { minutesBefore: null } to remove it.
// @access  Private (User)
export const setAppointmentReminder = asyncHandler(async (req, res) => {
  const { minutesBefore } = req.body;
  const isRemoving = minutesBefore === null;

  if (!isRemoving && !ALLOWED_REMINDER_MINUTES.includes(minutesBefore)) {
    res.status(400);
    throw new Error(
      `minutesBefore must be one of ${ALLOWED_REMINDER_MINUTES.join(", ")}, or null to remove the reminder`
    );
  }

  const appointment = await Appointment.findOne({
    _id: req.params.id,
    bookedBy: req.user._id,
  });

  if (!appointment) {
    res.status(404);
    throw new Error("Appointment not found");
  }

  if (!isRemoving && appointment.status !== "Confirmed") {
    res.status(400);
    throw new Error("A reminder can only be set after the doctor has confirmed the appointment");
  }

  appointment.reminderMinutesBefore = minutesBefore;
  await appointment.save();

  const populated = await appointment.populate([
    { path: "patient" },
    { path: "doctor", select: "-password" },
  ]);

  res.status(200).json({
    success: true,
    message: isRemoving ? "Reminder removed" : "Reminder set",
    data: populated,
  });
});
