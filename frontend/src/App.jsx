import { Routes, Route } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import CHWPage from "./pages/CHWPage";
import SupervisorPage from "./pages/SupervisorPage";
import FacilityPage from "./pages/FacilityPage";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RoleProtectedRoute from "./components/auth/RoleProtectedRoute";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* CHW Dashboard - only accessible by CHW role users */}
        <Route
          path="/chw"
          element={
            <RoleProtectedRoute allowedRoles={["CHW"]}>
              <CHWPage />
            </RoleProtectedRoute>
          }
        />

        {/* Supervisor Dashboard - only accessible by Supervisor role users */}
        <Route
          path="/supervisor"
          element={
            <RoleProtectedRoute allowedRoles={["Supervisor"]}>
              <SupervisorPage />
            </RoleProtectedRoute>
          }
        />

        {/* Facility Dashboard - only accessible by Facility role users */}
        <Route
          path="/facility"
          element={
            <RoleProtectedRoute allowedRoles={["Facility"]}>
              <FacilityPage />
            </RoleProtectedRoute>
          }
        />
        
        <Route path="/home" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;