// handles the JWT token and the user

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

// ── Token ──────────────────────────────────────────────
export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);

export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

// ── User ───────────────────────────────────────────────
export const getUser = () => {
  const raw = localStorage.getItem(USER_KEY);
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setUser = (user) =>
  localStorage.setItem(USER_KEY, JSON.stringify(user));

export const clearUser = () => localStorage.removeItem(USER_KEY);

// ── Clear everything (on logout) ───────────────────────
export const clearAuth = () => {
  clearToken();
  clearUser();
};
