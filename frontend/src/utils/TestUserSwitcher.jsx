import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

/**
 * TestUserSwitcher Component
 * 
 * Use this component temporarily to test the different role-based pages.
 * Simply add it to any page to simulate user login with different roles.
 * 
 * Example usage in App.tsx or a test page:
 * <TestUserSwitcher />
 */

export function TestUserSwitcher() {
  const { login, logout } = useUser();
  const navigate = useNavigate();

  const handleLogin = (role) => {
    const userData = {
      id: Math.random(),
      name: `${role} User`,
      email: `${role.toLowerCase()}@example.com`,
      role: role,
    };
    login(userData);
    
    // Navigate to the appropriate dashboard
    const routes = {
      CHW: "/chw",
      Supervisor: "/supervisor",
      Facility: "/facility",
    };
    navigate(routes[role]);
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 bg-slate-900 border border-slate-700 rounded-lg shadow-lg p-4">
      <p className="text-white text-sm mb-3 font-semibold">Test User Login:</p>
      <div className="space-y-2">
        <button
          onClick={() => handleLogin("CHW")}
          className="w-full px-3 py-2 text-sm bg-teal-600 hover:bg-teal-700 text-white rounded transition"
        >
          Login as CHW
        </button>
        <button
          onClick={() => handleLogin("Supervisor")}
          className="w-full px-3 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded transition"
        >
          Login as Supervisor
        </button>
        <button
          onClick={() => handleLogin("Facility")}
          className="w-full px-3 py-2 text-sm bg-cyan-600 hover:bg-cyan-700 text-white rounded transition"
        >
          Login as Facility
        </button>
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="w-full px-3 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default TestUserSwitcher;
