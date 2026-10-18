import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import asyncHandler from "../utils/asyncHandler.js";

// ------------------- USER -------------------

// @route   POST /api/auth/user/signup
export const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, phone, age, gender, bloodGroup, address, emergencyContact } = req.body;

  if (!fullName || !email || !password || !phone) {
    res.status(400);
    throw new Error("fullName, email, password and phone are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error("An account with this email already exists");
  }

  const hashedPassword = await User.hashPassword(password);

  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
    phone,
    age,
    gender,
    bloodGroup,
    address,
    emergencyContact,
  });

  const token = user.generateAuthToken();

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    token,
    user: {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
  });
});

// @route   POST /api/auth/user/login
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  // password field select("+password") not needed since we never set select:false,
  // but we do want it available here for comparison
  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const token = user.generateAuthToken();

  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    user: {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
  });
});

// ------------------- DOCTOR -------------------

// @route   POST /api/auth/doctor/signup
export const registerDoctor = asyncHandler(async (req, res) => {
  const { name, email, password, phone, specialization, experience, fees, gender, availableTime, image } = req.body;

  if (!name || !email || !password || !phone || !specialization || experience === undefined || fees === undefined) {
    res.status(400);
    throw new Error("name, email, password, phone, specialization, experience and fees are required");
  }

  const existingDoctor = await Doctor.findOne({ email });
  if (existingDoctor) {
    res.status(400);
    throw new Error("A doctor account with this email already exists");
  }

  const hashedPassword = await Doctor.hashPassword(password);

  const doctor = await Doctor.create({
    name,
    email,
    password: hashedPassword,
    phone,
    specialization,
    experience,
    fees,
    gender,
    availableTime,
    image,
  });

  const token = doctor.generateAuthToken();

  res.status(201).json({
    success: true,
    message: "Doctor registered successfully",
    token,
    doctor: {
      _id: doctor._id,
      name: doctor.name,
      email: doctor.email,
      specialization: doctor.specialization,
      role: doctor.role,
    },
  });
});

// @route   POST /api/auth/doctor/login
export const loginDoctor = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const doctor = await Doctor.findOne({ email });

  if (!doctor || !(await doctor.comparePassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const token = doctor.generateAuthToken();

  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    doctor: {
      _id: doctor._id,
      name: doctor.name,
      email: doctor.email,
      specialization: doctor.specialization,
      role: doctor.role,
    },
  });
});