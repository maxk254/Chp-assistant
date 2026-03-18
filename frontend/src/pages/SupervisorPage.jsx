import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/ui/sidebar";
import TopBar from "../components/topbar";
import SupervisorDashboard from "../components/SupervisorDashboard";
import LiveMap from "../components/LiveMap";
import Settings from "../components/ui/Settings";
import { useUser } from "../context/UserContext";

function SupervisorPage() {
  const [currentTab, setTab] = useState("supervisor");
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const renderContent = () => {
    switch (currentTab) {
      case "supervisor":
        return <SupervisorDashboard />;
      case "map":
        return <LiveMap />;
      case "settings":
        return <Settings />;
      default:
        return <SupervisorDashboard />;
    }
  };

  const displayName = user?.name || "Supervisor";

  return (
    <div className="flex h-screen bg-slate-950">
      {/* Sidebar Navigation */}
      <Sidebar currentTab={currentTab} setTab={setTab} role="Supervisor" onLogout={handleLogout} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-40 overflow-hidden">
        {/* TopBar */}
        <TopBar role="Supervisor" userName={displayName} />

        {/* Content */}
        <div className="flex-1 overflow-auto bg-slate-950">
          {currentTab === "supervisor" ? (
            <SupervisorDashboard supervisorName={displayName} />
          ) : currentTab === "map" ? (
            <LiveMap />
          ) : (
            <Settings user={user} />
          )}
        </div>
      </div>
    </div>
  );
}

export default SupervisorPage;
