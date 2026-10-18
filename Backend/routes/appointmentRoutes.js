import express from "express";
import {
  bookAppointment,
  getMyAppointments,
  getDoctorAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  postponeAppointment,
  cancelAppointment,
} from "../controllers/appointmentController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// All appointment routes require login
router.use(protect);

// User routes
router.post("/", authorize("patient", "admin"), bookAppointment);
router.get("/my", authorize("patient", "admin"), getMyAppointments);
router.patch("/:id/cancel", authorize("patient", "admin"), cancelAppointment);

// Doctor routes
router.get("/doctor", authorize("doctor"), getDoctorAppointments);
router.patch("/:id/status", authorize("doctor"), updateAppointmentStatus);
router.patch("/:id/postpone", authorize("doctor"), postponeAppointment);

// Shared - accessible by owner or assigned doctor (checked inside controller)
router.get("/:id", getAppointmentById);

export default router;