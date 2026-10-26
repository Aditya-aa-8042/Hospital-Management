import Appointment from "../models/Appointment.js";
import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";
import asyncHandler from "../utils/asyncHandler.js";
// import { sendAppointmentConfirmationEmail } from "../utils/emailService.js";
import {getSpecializationKeywords, escapeRegex} from "../utils/diseases.js";

// @route   POST /api/appointments
// @desc    Book an appointment. Accepts EITHER:
//            - patientId  -> reuse an existing patient (dropdown flow)
//          OR
//            - name, age, gender, phone -> create a new patient first (Image 2 form flow)
//          Both flows then create the Appointment against the chosen/created patient.
// @access  Private (User)
export const bookAppointment = asyncHandler(async (req, res) => {
  const {
    patientId,
    name,
    age,
    gender,
    phone,
    doctor,
    appointmentDate,
    appointmentTime,
    reason,
  } = req.body;

  if (!doctor || !appointmentDate || !appointmentTime || !reason) {
    res.status(400);
    throw new Error("doctor, appointmentDate, appointmentTime and reason are required");
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
 
    doctorDoc = await Doctor.findOne({ isAvailable: true, $or: matchConditions });
 
    if (!doctorDoc) {
      res.status(404);
      throw new Error(
        `No available doctor found for "${disease}" right now. Please choose a doctor manually.`
      );
    }
  }
 

  let patient;

  if (patientId) {
    // ---- Existing patient flow (dropdown) ----
    // Must belong to the logged-in user - prevents booking with someone else's patient
    patient = await Patient.findOne({ _id: patientId, registeredBy: req.user._id });

    if (!patient) {
      res.status(404);
      throw new Error("Patient not found in your account");
    }
  } else {
    // ---- New patient flow (form) ----
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
// @desc    Doctor updates appointment status (Confirmed / Completed / Cancelled)
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
 
  if (["Completed", "Cancelled"].includes(appointment.status)) {
    res.status(400);
    throw new Error(`Cannot postpone an appointment that is already ${appointment.status}`);
  }
 
  appointment.appointmentDate = appointmentDate;
  appointment.appointmentTime = appointmentTime;
  appointment.status = "Postponed";
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
// @desc    Logged-in user cancels their own appointment (only if still Pending/Confirmed)
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

  if (["Completed", "Cancelled"].includes(appointment.status)) {
    res.status(400);
    throw new Error(`Cannot cancel an appointment that is already ${appointment.status}`);
  }

  appointment.status = "Cancelled";
  await appointment.save();

  res.status(200).json({
    success: true,
    message: "Appointment cancelled",
    data: appointment,
  });
});