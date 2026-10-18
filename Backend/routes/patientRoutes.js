import express from "express";
import {
  createPatient,
  getMyPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} from "../controllers/patientController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All patient routes require a logged-in user
router.use(protect);

router.post("/", createPatient);
router.get("/", getMyPatients);
router.get("/:id", getPatientById);
router.patch("/:id", updatePatient);
router.delete("/:id", deletePatient);

export default router;