// calls all api calls , Login , register , forgotPassword

import api from "./api";
import { ENDPOINTS } from "./endpoints";
import { setToken, setUser, clearAuth } from "../utils/storage";

// ── Login ──────────────────────────────────────────────
// POST /auth/login
// Returns: { user, token }
export const login = async (email, password) => {
  const { data } = await api.post(ENDPOINTS.AUTH.LOGIN, { email, password });
  setToken(data.token);
  setUser(data.user);
  return data;
};

// ── Register ───────────────────────────────────────────
// POST /auth/register
// Returns: { user, token }
export const register = async (firstName, lastName, email, password) => {
  const { data } = await api.post("/auth/register", {
    firstName,
    lastName,
    email,
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
