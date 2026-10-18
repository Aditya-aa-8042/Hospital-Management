import express from "express";
import {
  sendOtpController,
  register,
  login,
  forgotPasswordSendOtp,
  forgotPasswordReset,
} from "../controllers/Otpauthcontroller.js";


const router = express.Router();

router.post("/send-otp", sendOtpController);
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password/send-otp", forgotPasswordSendOtp);
router.post("/forgot-password/reset", forgotPasswordReset);

export default router;
 
