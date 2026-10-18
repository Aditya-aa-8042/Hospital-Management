import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendOtp, verifyOtp } from "../utils/Msg91.js";

// Picks the right model based on role from the request body
const getModel = (role) => {
  if (role === "doctor") return Doctor;
  if (role === "user") return User;
  return null;
};

// @route   POST /api/auth/send-otp
// @desc    Send an OTP to a phone number via MSG91 (used for both registration and forgot-password)
// @access  Public
export const sendOtpController = asyncHandler(async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    res.status(400);
    throw new Error("Phone number is required");
  }

  await sendOtp(phone);

  res.status(200).json({
    success: true,
    message: "OTP sent successfully",
  });
});

// @route   POST /api/auth/register
// @desc    Verify OTP, then create a User or Doctor account
// @access  Public
export const register = asyncHandler(async (req, res) => {
  const { role, otp, phone, password, ...rest } = req.body;

  const Model = getModel(role);
  if (!Model) {
    res.status(400);
    throw new Error('role must be "user" or "doctor"');
  }

  if (!phone || !otp || !password) {
    res.status(400);
    throw new Error("phone, otp and password are required");
  }

  // Verify the OTP with MSG91 before creating anything
  const isValidOtp = await verifyOtp(phone, otp);
  if (!isValidOtp) {
    res.status(400);
    throw new Error("Invalid or expired OTP");
  }

  const existingAccount = await Model.findOne({ phone });
  if (existingAccount) {
    res.status(400);
    throw new Error("An account with this phone number already exists");
  }

  const hashedPassword = await Model.hashPassword(password);

  const account = await Model.create({
    ...rest, // fullName/email/etc for User, name/specialization/etc for Doctor
    phone,
    password: hashedPassword,
  });

  const token = account.generateAuthToken();

  res.status(201).json({
    success: true,
    message: "Account created successfully",
    token,
    [role]: account,
  });
});

// @route   POST /api/auth/login
// @desc    Login with phone + password (no OTP)
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { role, phone, password } = req.body;

  const Model = getModel(role);
  if (!Model) {
    res.status(400);
    throw new Error('role must be "user" or "doctor"');
  }

  if (!phone || !password) {
    res.status(400);
    throw new Error("phone and password are required");
  }

  const account = await Model.findOne({ phone });

  if (!account || !(await account.comparePassword(password))) {
    res.status(401);
    throw new Error("Invalid phone number or password");
  }

  const token = account.generateAuthToken();

  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    [role]: account,
  });
});

// @route   POST /api/auth/forgot-password/send-otp
// @desc    Send OTP to reset password - confirms the account exists first
// @access  Public
export const forgotPasswordSendOtp = asyncHandler(async (req, res) => {
  const { role, phone } = req.body;

  const Model = getModel(role);
  if (!Model) {
    res.status(400);
    throw new Error('role must be "user" or "doctor"');
  }

  if (!phone) {
    res.status(400);
    throw new Error("Phone number is required");
  }

  const account = await Model.findOne({ phone });
  if (!account) {
    res.status(404);
    throw new Error("No account found with this phone number");
  }

  await sendOtp(phone);

  res.status(200).json({
    success: true,
    message: "OTP sent successfully",
  });
});

// @route   POST /api/auth/forgot-password/reset
// @desc    Verify OTP, set new password, and log the user in
// @access  Public
export const forgotPasswordReset = asyncHandler(async (req, res) => {
  const { role, phone, otp, newPassword } = req.body;

  const Model = getModel(role);
  if (!Model) {
    res.status(400);
    throw new Error('role must be "user" or "doctor"');
  }

  if (!phone || !otp || !newPassword) {
    res.status(400);
    throw new Error("phone, otp and newPassword are required");
  }

  const isValidOtp = await verifyOtp(phone, otp);
  if (!isValidOtp) {
    res.status(400);
    throw new Error("Invalid or expired OTP");
  }

  const account = await Model.findOne({ phone });
  if (!account) {
    res.status(404);
    throw new Error("No account found with this phone number");
  }

  account.password = await Model.hashPassword(newPassword);
  await account.save();

  const token = account.generateAuthToken();

  res.status(200).json({
    success: true,
    message: "Password reset successfully",
    token,
    [role]: account,
  });
});