import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// ── useAuth ────────────────────────────────────────────
// A thin wrapper around useContext(AuthContext).
// Consume auth state from any component in the tree.
//
// Returns:
//   user            — logged-in user object, or null
//   loading         — true while session rehydrates on boot
//   isAuthenticated — boolean shorthand for !!user
//   login(email, password)        — call on login form submit
//   logout()                      — call on logout button
//   updateUser(patch)             — merge partial update into user
//
// Usage:
//   const { user, isAuthenticated, login, logout } = useAuth();
//
// Example — show user name in a navbar:
//   const { user, logout } = useAuth();
//   return <button onClick={logout}>{user?.firstName}</button>

export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      "useAuth() was called outside of <AuthProvider>.\n" +
        "Make sure <AuthProvider> wraps your app in main.jsx or App.jsx.",
    );
  }

  return ctx;
};
