import Department from "../models/Department.js";
import asyncHandler from "../utils/asyncHandler.js";

// @route   GET /api/departments
// @desc    List all departments
// @access  Public
export const getDepartments = asyncHandler(async (req, res) => {
  const departments = await Department.find().sort({ name: 1 });

  res.status(200).json({
    success: true,
    count: departments.length,
    data: departments,
  });
});

// @route   GET /api/departments/:id
// @desc    Get a single department
// @access  Public
export const getDepartmentById = asyncHandler(async (req, res) => {
  const department = await Department.findById(req.params.id);

  if (!department) {
    res.status(404);
    throw new Error("Department not found");
  }

  res.status(200).json({
    success: true,
    data: department,
  });
});