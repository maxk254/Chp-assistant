const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

// Temporary OTP storage
let otpStore = {};

// ---------------- SIGNUP ----------------
router.post("/signup", async (req, res) => {
  const { name, role, phone, email, password } = req.body;

  try {
    let existingUser;
    if (role === "supervisor") existingUser = await User.findOne({ email });
    else existingUser = await User.findOne({ phone });

    if (existingUser) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const user = new User({ name, role, phone, email, password: hashedPassword });
    await user.save();

    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ---------------- REQUEST OTP ----------------
router.post("/request-otp", async (req, res) => {
  const { phone } = req.body;

  if (!phone) return res.status(400).json({ error: "Phone is required" });

  const user = await User.findOne({ phone });
  if (!user) return res.status(400).json({ error: "Phone not registered" });

  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  otpStore[phone] = otp;

  console.log(`OTP for ${phone}: ${otp}`); // For testing; replace with SMS in production
  res.json({ message: "OTP sent" });
});

// ---------------- VERIFY OTP ----------------
router.post("/verify-otp", async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) return res.status(400).json({ error: "Phone and OTP required" });

  const realOtp = otpStore[phone];
  if (!realOtp || realOtp !== otp) return res.status(400).json({ error: "Invalid OTP" });

  const user = await User.findOne({ phone });
  if (!user) return res.status(400).json({ error: "User not found" });

  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });

  delete otpStore[phone]; // Remove OTP after verification
  res.json({ token, role: user.role });
});

// ---------------- LOGIN (Supervisor only) ----------------
router.post("/login", async (req, res) => {
  const { role, email, password } = req.body;

  if (role !== "supervisor") return res.status(400).json({ error: "Use OTP login for CHW/Facility" });

  try {
    const user = await User.findOne({ email, role });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;