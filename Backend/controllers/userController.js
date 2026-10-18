import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

// @route   GET /api/users/me
// @desc    Get the logged-in user's own profile
// @access  Private (User)
export const getMyProfile = asyncHandler(async (req, res) => {
  // req.user is already set by the `protect` middleware based on the JWT -
  // never trust an id from the request body/params for "my profile" routes,
  // always use the one decoded from the token.
  const user = await User.findById(req.user._id).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @route   PATCH /api/users/me
// @desc    Update the logged-in user's own profile
// @access  Private (User)
export const updateMyProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const allowedFields = [
    "fullName",
    "email",
    "phone",
    "age",
    "gender",
    "bloodGroup",
    "address",
    "emergencyContact",
    "profileImage",
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      user[field] = req.body[field];
    }
  });

  await user.save();

  const { password, ...safeUser } = user.toObject();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: safeUser,
  });
});