const authService = require('../services/auth.service');

exports.requestOtp = async (req, res) => {
  const { phone } = req.body;
  const response = await authService.requestOtp(phone);
  res.json(response);
};

exports.verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;
  const response = await authService.verifyOtp(phone, otp);
  res.json(response);
};

exports.supervisorLogin = async (req, res) => {
  const { email, password } = req.body;
  const response = await authService.supervisorLogin(email, password);
  res.json(response);
};