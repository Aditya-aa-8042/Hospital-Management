import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  getDoctors,
  getDoctorById,
  getMyDoctorProfile,
  updateMyDoctorProfile,
} from "../controllers/doctorController.js";

const router = express.Router();

// Public routes
router.get("/", getDoctors);

// Protected "me" routes - IMPORTANT: must come before "/:id" or Express
// will try to treat "me" as an :id param and fail the ObjectId cast.
router.get("/me", protect, authorize("doctor"), getMyDoctorProfile);
router.patch("/me", protect, authorize("doctor"), updateMyDoctorProfile);

// Public route with dynamic :id - keep below "/me"
router.get("/:id", getDoctorById);

export default router;