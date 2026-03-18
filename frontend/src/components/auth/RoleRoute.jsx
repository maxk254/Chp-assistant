import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/UseAuth";

export default function RoleRoute({ allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.user_kind)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
