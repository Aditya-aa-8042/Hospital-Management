import express from "express";
import { createAmbulanceRequest, getAmbulanceRequests } from "../controllers/ambulanceRequestController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Staff dashboard/API access is restricted to authenticated admins.
router.get("/", protect, authorize("admin"), getAmbulanceRequests);
// Anyone may send a non-emergency transport request; staff must confirm it.
router.post("/", createAmbulanceRequest);

export default router;
