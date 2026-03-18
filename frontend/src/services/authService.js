// calls all api calls , Login , register , forgotPassword

import api from "./api";
import { ENDPOINTS } from "./endpoints";
import { setToken, setUser, clearAuth } from "../utils/storage";

// this is mock up data used for demo purposes only
const MOCK_LOGIN_EMAIL = "john@example.com";
const MOCK_LOGIN_RESPONSE = {
  success: true,
  message: "Login successful",
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  user: {
    id: "64f1a2b3c4d5e6f7a8b9c0d1",
    name: "John Doe",
    user_kind: "facility",
    email: "john@example.com",
    phone: "+254712345678",
    createdAt: "2026-03-18T10:00:00.000Z",
  },
};

// ── Login ──────────────────────────────────────────────
// POST /auth/login
// Returns: { user, token }
export const login = async (email, password) => {
  // Testing-only mock login path until backend auth is ready.
  if ((email || "").trim().toLowerCase() === MOCK_LOGIN_EMAIL && password) {
    setToken(MOCK_LOGIN_RESPONSE.token);
    setUser(MOCK_LOGIN_RESPONSE.user);
    return MOCK_LOGIN_RESPONSE;
  }

  const { data } = await api.post(ENDPOINTS.AUTH.LOGIN, { email, password });
  setToken(data.token);
  setUser(data.user);
  return data;
};

// ── Register ───────────────────────────────────────────
// POST /auth/register
// Returns: { user, token }
export const register = async (name, userType, email, phone, password) => {
  const { data } = await api.post("/auth/register", {
    name,
    user_kind: userType,
    email,
    phone,
    password,
  });
  setToken(data.token);
  setUser(data.user);
  return data;
};

// ── Logout ─────────────────────────────────────────────
// POST /auth/logout  (optional server-side call to invalidate token)
export const logout = async () => {
  try {
    await api.post("/auth/logout");
  } catch {
    // Silently ignore — we always clear local state regardless
  } finally {
    clearAuth();
  }
};

// ── Get current user ───────────────────────────────────
// GET /auth/me  — used on app boot to rehydrate session
// Returns: { user }
export const getMe = async () => {
  const { data } = await api.get(ENDPOINTS.AUTH.ME);
  return data.user;
};

// ── Forgot password ────────────────────────────────────
// POST /auth/forgot-password
export const forgotPassword = async (email) => {
  const { data } = await api.post("/auth/forgot-password", { email });
  return data;
};

// ── Reset password ─────────────────────────────────────
// POST /auth/reset-password
// token: the reset token from the email link
export const resetPassword = async (token, newPassword) => {
  const { data } = await api.post("/auth/reset-password", {
    token,
    password: newPassword,
  });
  return data;
};

// ── Refresh token ──────────────────────────────────────
// POST /auth/refresh  — call this when access token is close to expiry
// Returns: { token }
export const refreshToken = async () => {
  const { data } = await api.post("/auth/refresh");
  setToken(data.token);
  return data.token;
};
