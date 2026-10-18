import Patient from "../models/Patient.js";
import asyncHandler from "../utils/asyncHandler.js";

// @route   POST /api/patients
// @desc    Add a new patient under the logged-in user's account
// @access  Private (User)
export const createPatient = asyncHandler(async (req, res) => {
  const { name, age, gender, phone, bloodGroup, address, relationToAccountHolder } = req.body;

  if (!name || age === undefined || !gender || !phone) {
    res.status(400);
    throw new Error("name, age, gender and phone are required");
  }

  const patient = await Patient.create({
    registeredBy: req.user._id,
    name,
    age,
    gender,
    phone,
    bloodGroup,
    address,
    relationToAccountHolder,
  });

  res.status(201).json({
    success: true,
    message: "Patient added successfully",
    data: patient,
  });
});

// @route   GET /api/patients
// @desc    List all patients registered by the logged-in user (for the booking dropdown)
// @access  Private (User)
export const getMyPatients = asyncHandler(async (req, res) => {
  const patients = await Patient.find({ registeredBy: req.user._id }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: patients.length,
    data: patients,
  });
});

// @route   GET /api/patients/:id
// @desc    Get a single patient (must belong to logged-in user)
// @access  Private (User)
export const getPatientById = asyncHandler(async (req, res) => {
  const patient = await Patient.findOne({
    _id: req.params.id,
    registeredBy: req.user._id,
  });

  if (!patient) {
    res.status(404);
    throw new Error("Patient not found");
  }

  res.status(200).json({
    success: true,
    data: patient,
  });
});

// @route   PATCH /api/patients/:id
// @desc    Update a patient (must belong to logged-in user)
// @access  Private (User)
export const updatePatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findOne({
    _id: req.params.id,
    registeredBy: req.user._id,
  });

  if (!patient) {
    res.status(404);
    throw new Error("Patient not found");
  }

  const allowedFields = ["name", "age", "gender", "phone", "bloodGroup", "address", "relationToAccountHolder"];
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      patient[field] = req.body[field];
    }
  });

  await patient.save();

  res.status(200).json({
    success: true,
    message: "Patient updated successfully",
    data: patient,
  });
});

// @route   DELETE /api/patients/:id
// @desc    Remove a patient (must belong to logged-in user)
// @access  Private (User)
export const deletePatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findOneAndDelete({
    _id: req.params.id,
    registeredBy: req.user._id,
  });

  if (!patient) {
    res.status(404);
    throw new Error("Patient not found");
  }

  res.status(200).json({
    success: true,
    message: "Patient removed successfully",
  });
});