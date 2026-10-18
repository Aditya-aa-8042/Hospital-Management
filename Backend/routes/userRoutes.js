import express from "express";
import { getMyProfile, updateMyProfile } from "../controllers/userController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(authorize("patient", "admin"));

router.get("/me", getMyProfile);
router.patch("/me", updateMyProfile);

export default router;