import { createContext, useState, useEffect, useCallback } from "react";
import {
  login as loginService,
  logout as logoutService,
  getMe,
} from "../services/authService";
import { getToken, getUser, setUser, clearAuth } from "../utils/storage";

// ── Context ────────────────────────────────────────────
export const AuthContext = createContext(null);

// ── Provider ───────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Rehydrate session on app boot ──────────────────
  // Runs once on mount. If a token exists, verify it with
  // the server and restore the user object into state.
  useEffect(() => {
    const rehydrate = async () => {
      const token = getToken();

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Show cached user instantly while server call is in-flight
        const cached = getUser();
        if (cached) setUserState(cached);

        // Verify token is still valid and get fresh user data
        const freshUser = await getMe();
        setUserState(freshUser);
        setUser(freshUser);
      } catch {
        // Token expired or revoked — clear session silently
        clearAuth();
        setUserState(null);
      } finally {
        setLoading(false);
      }
    };

    rehydrate();
  }, []);

  // ── Login ──────────────────────────────────────────
  // Two modes:
  //   1. login(email, password)          — normal login form
  //   2. login(null, null, { user, token }) — after register,
  //      credentials already fetched, skip the extra API call
  const login = useCallback(async (email, password, prefetched = null) => {
    if (prefetched) {
      setUserState(prefetched.user);
      return prefetched;
    }

    const data = await loginService(email, password);
    setUserState(data.user);
    return data;
  }, []);

  // ── Logout ─────────────────────────────────────────
  // Calls server to invalidate token, then clears local state.
  // logoutService() catches its own errors so this never throws.
  const logout = useCallback(async () => {
    await logoutService();
    setUserState(null);
  }, []);

  // ── Update user ────────────────────────────────────
  // Merge a partial patch into the current user object and
  // keep localStorage in sync. Use after profile edits.
  // Example: updateUser({ firstName: 'Ada', avatar: url })
  const updateUser = useCallback((patch) => {
    setUserState((prev) => {
      const updated = { ...prev, ...patch };
      setUser(updated);
      return updated;
    });
  }, []);

  // ── Context value ──────────────────────────────────
  const value = {
    user, // full user object or null
    loading, // true until boot rehydration finishes
    isAuthenticated: Boolean(user), // shorthand boolean
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
