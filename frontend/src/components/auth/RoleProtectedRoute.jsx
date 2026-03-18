import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../../context/UserContext";

export default function RoleProtectedRoute({ allowedRoles, children }) {
  const { user, loading } = useUser();
  const location = useLocation();

  // While loading, show a spinner
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-teal-400 border-t-transparent" />
      </div>
    );
  }

  // Not authenticated — redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has an allowed role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on their role
    const roleRoutes = {
      CHW: "/chw",
      Supervisor: "/supervisor",
      Facility: "/facility",
    };
    return <Navigate to={roleRoutes[user.role] || "/login"} replace />;
  }

  // User has correct role — render the component
  return children;
}
