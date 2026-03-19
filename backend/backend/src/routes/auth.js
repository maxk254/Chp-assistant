import express from "express";
import * as authController from "../controllers/auth.controllers.js";

const router = express.Router();

// ---------------- SIGNUP ----------------
router.post("/signup", authController.signup);

// ---------------- REQUEST OTP ----------------
router.post("/request-otp", authController.requestOtp);

// ---------------- VERIFY OTP ----------------
router.post("/verify-otp", authController.verifyOtp);

// ---------------- LOGIN (Supervisor only) ----------------
router.post("/login", authController.supervisorLogin);

export default router;
