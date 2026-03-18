const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// OTP
router.post('/request-otp', authController.requestOtp);
router.post('/verify-otp', authController.verifyOtp);

// Supervisor login
router.post('/supervisor-login', authController.supervisorLogin);

module.exports = router;