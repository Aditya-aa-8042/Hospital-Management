import Doctor from "../models/Doctor.js";
import asyncHandler from "../utils/asyncHandler.js";

// @route   GET /api/doctors
// @desc    Public listing of doctors with optional filters (matches "Doctor Suggestions" page)
//          Supports: ?specialization=Cardiologist&gender=Male&search=ananya
// @access  Public
export const getDoctors = asyncHandler(async (req, res) => {
  const { specialization, gender, search } = req.query;

  const filter = {};

  if (specialization) {
    filter.specialization = { $regex: specialization, $options: "i" };
  }

  if (gender) {
    filter.gender = gender;
  }

  if (search) {
    // Search by name or specialization
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { specialization: { $regex: search, $options: "i" } },
    ];
  }

  const doctors = await Doctor.find(filter).select("-password");

  res.status(200).json({
    success: true,
    count: doctors.length,
    data: doctors,
  });
});

// @route   GET /api/doctors/:id
// @desc    Get a single doctor's public profile
// @access  Public
export const getDoctorById = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id).select("-password");

  if (!doctor) {
    res.status(404);
    throw new Error("Doctor not found");
  }

  res.status(200).json({
    success: true,
    data: doctor,
  });
});

// @route   PATCH /api/doctors/me
// @desc    Logged-in doctor updates their own profile
// @access  Private (Doctor)
export const updateMyDoctorProfile = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.doctor._id);

  if (!doctor) {
    res.status(404);
    throw new Error("Doctor not found");
  }

  const allowedFields = [
    "name",
    "phone",
    "specialization",
    "experience",
    "fees",
    "gender",
    "availableTime",
    "image",
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      doctor[field] = req.body[field];
    }
  });

  await doctor.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: doctor,
  });
});

// @route   GET /api/doctors/me
// @desc    Logged-in doctor views their own full profile
// @access  Private (Doctor)
export const getMyDoctorProfile = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.doctor,
  });
});