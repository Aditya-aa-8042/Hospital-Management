import express from "express";
import {
  createRazorpayPaymentLink,
  getMyPayments,
  getPaymentById,
} from "../controllers/paymentController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(authorize("patient", "admin"));

router.post("/link", createRazorpayPaymentLink);
router.get("/my", getMyPayments);
router.get("/:id", getPaymentById);

export default router;
