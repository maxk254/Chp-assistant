// ── ProtectedRoute ─────────────────────────────────────
// Wraps any route that requires authentication.
//
// Behaviour:
//   1. While session is rehydrating on boot → show a spinner
//      (prevents wrongly redirecting a logged-in user to /login)
//   2. No user after rehydration → redirect to /login,
//      passing the attempted URL in location.state so the user
//      lands back here after a successful login
//   3. User is authenticated → render the child route normally
//
// Usage in router/index.jsx:
//   <Route element={<ProtectedRoute />}>
//     <Route path="/dashboard" element={<DashboardPage />} />
//     <Route path="/settings"  element={<SettingsPage />} />
//   </Route>

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/UseAuth";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 1. Session still rehydrating — hold render until we know auth state
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // 2. Not authenticated — redirect to /login, remember where they came from
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Authenticated — render the matched child route
  return <Outlet />;
}
