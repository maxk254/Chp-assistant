import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/ui/sidebar";
import TopBar from "../components/topbar";
import CHW from "../components/ui/CHW";
import LiveMap from "../components/LiveMap";
import Settings from "../components/ui/Settings";
import { useUser } from "../context/UserContext";

function CHWPage() {
  const [currentTab, setTab] = useState("chw");
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const renderContent = () => {
    switch (currentTab) {
      case "chw":
        return <CHW />;
      case "map":
        return <LiveMap />;
      case "settings":
        return <Settings user={user} />;
      default:
        return <CHW />;
    }
  };

  const displayName = user?.name || "Community Health Worker";

  return (
    <div className="flex h-screen bg-slate-950">
      {/* Sidebar Navigation */}
      <Sidebar currentTab={currentTab} setTab={setTab} role="CHW" onLogout={handleLogout} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-40 overflow-hidden">
        {/* TopBar */}
        <TopBar role="CHW" userName={displayName} />

        {/* Content */}
        <div className="flex-1 overflow-auto bg-slate-950">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default CHWPage;
