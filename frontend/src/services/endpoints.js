// ── API Endpoints ──────────────────────────────────────
// All backend route paths in one place.
// The axios instance in api.js already prepends VITE_API_URL,
// so these are relative paths only (no base URL needed here).

export const ENDPOINTS = {
  // ── Auth ─────────────────────────────────────────────
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
    REFRESH: "/auth/refresh",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
  },

  // ── User ──────────────────────────────────────────────
  USER: {
    PROFILE: "/users/me",
    UPDATE_PROFILE: "/users/me",
    CHANGE_PASSWORD: "/users/me/password",
  },
};
