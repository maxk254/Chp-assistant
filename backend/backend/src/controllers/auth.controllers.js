import authService from "../services/auth.service.js";

export const requestOtp = async (req, res) => {
  const { phone } = req.body;
  const response = await authService.requestOtp(phone);
  res.status(response.status).json(response);
};

export const verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;
  const response = await authService.verifyOtp(phone, otp);
  res.status(response.status).json(response);
};

export const supervisorLogin = async (req, res) => {
  const { email, password } = req.body;
  const response = await authService.supervisorLogin(email, password);
  res.status(response.status).json(response);
};

export const signup = async (req, res) => {
  const response = await authService.signup(req.body);
  res.status(response.status).json(response);
};
