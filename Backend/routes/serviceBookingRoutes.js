import express from "express";
import { createServiceBooking } from "../controllers/serviceBookingController.js";

const router = express.Router();

router.post("/", createServiceBooking);

export default router;
