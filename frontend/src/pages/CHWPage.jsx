import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/ui/sidebar";
import TopBar from "../components/topbar";
import CHW from "../components/ui/CHW";
import LiveMap from "../components/LiveMap";
import Settings from "../components/ui/Settings";
import { useUser } from "../context/UserContext";
import { usePatientData } from "../context/PatientDataContext";
import { runDiagnostic } from "../services/diagnosticService";

function CHWPage() {
  const [currentTab, setTab] = useState("chw");
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState("");
  const [lastAnalyzedInput, setLastAnalyzedInput] = useState(null);
  const { user, logout } = useUser();
  const { patients, addPatient } = usePatientData();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handleAnalyze = async (payload) => {
    if (!payload) {
      return;
    }

    setAnalyzeError("");
    setIsAnalyzing(true);

    try {
      const result = await runDiagnostic(payload);
      setLastAnalyzedInput(payload);
      setAnalysisResults(result);
    } catch (error) {
      console.error("Failed to run diagnostic", error);
      setAnalyzeError(
        "Unable to run AI diagnostic right now. Please try again.",
      );
      setAnalysisResults(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSavePatient = async (currentFormData) => {
    const sourceData = lastAnalyzedInput || currentFormData;

    if (!sourceData || !analysisResults) {
      return false;
    }

    const normalizedStatus = String(
      analysisResults.emergencyLevel || "MEDIUM",
    ).toLowerCase();

    addPatient({
      id: Date.now(),
      fullName: sourceData.fullName,
      ward: sourceData.ward,
      age: sourceData.age,
      history: sourceData.history,
      symptoms: sourceData.symptoms,
      diagnosis: analysisResults.diagnosis || sourceData.symptoms || "Pending",
      facility: analysisResults.recommendedFacility || "Not assigned",
      status: normalizedStatus,
      confidence: analysisResults.confidence || "N/A",
      recommendations: analysisResults.recommendations || [],
      ambulanceNeeded: Boolean(analysisResults.ambulanceNeeded),
      chwName: user?.name || "CHW",
      timestamp: new Date().toLocaleString(),
    });

    setAnalysisResults(null);
    setLastAnalyzedInput(null);
    setAnalyzeError("");
    return true;
  };

  const renderContent = () => {
    switch (currentTab) {
      case "chw":
        return (
          <CHW
            onAnalyze={handleAnalyze}
            onSave={handleSavePatient}
            patients={patients}
            analysisResults={analysisResults}
            isAnalyzing={isAnalyzing}
            analyzeError={analyzeError}
            canSave={Boolean(analysisResults && lastAnalyzedInput)}
          />
        );
      case "map":
        return <LiveMap patients={patients} />;
      case "settings":
        return <Settings user={user} />;
      default:
        return (
          <CHW
            onAnalyze={handleAnalyze}
            onSave={handleSavePatient}
            patients={patients}
            analysisResults={analysisResults}
            isAnalyzing={isAnalyzing}
            analyzeError={analyzeError}
            canSave={Boolean(analysisResults && lastAnalyzedInput)}
          />
        );
    }
  };

  const displayName = user?.name || "Community Health Worker";

  return (
    <div className="flex h-screen bg-slate-950">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        setTab={setTab}
        role="CHW"
        onLogout={handleLogout}
      />

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
