import React, { useState } from "react";
import Sidebar from "../components/ui/sidebar";
import TopBar from "../components/topbar";
import CHW from "../components/ui/CHW";
import Supervisor from "../components/ui/Supervisor";
import Facility from "../components/ui/Facility";
import LiveMap from "../components/ui/livemap";
import Settings from "../components/ui/Settings";

function Home() {
  const [currentTab, setCurrentTab] = useState("chw");
  const [patients, setPatients] = useState([]);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [formData, setFormData] = useState(null);

  const handleAnalyze = (data) => {
    setFormData(data);
    const mockResults = {
      diagnosis: "Suspected Malaria",
      confidence: "92%",
      recommendedFacility: "Central Hospital, Ward 3",
      emergencyLevel: "HIGH",
      ambulanceNeeded: true,
      recommendations: [
        "Immediate blood test for malaria parasites",
        "Antimalarial medication (Artemether IM)",
        "Fluid replacement therapy",
        "Monitor for cerebral malaria complications",
      ],
    };
    setAnalysisResults(mockResults);
    setShowResults(true);
  };

  const handleSavePatient = () => {
    const newPatient = {
      fullName: formData?.fullName || "Unknown",
      age: formData?.age || "N/A",
      ward: formData?.ward || "Not assigned",
      symptoms: formData?.symptoms || "Not recorded",
      history: formData?.history || "No history",
      id: Date.now(),
      diagnosis: analysisResults?.diagnosis || "Pending",
      facility: analysisResults?.recommendedFacility || "Not assigned",
      status: analysisResults?.emergencyLevel || "MEDIUM",
      timestamp: new Date().toLocaleString(),
    };
    setPatients([newPatient, ...patients]);
    setShowResults(false);
    setAnalysisResults(null);
    setFormData(null);
  };

  const handleBack = () => {
    setShowResults(false);
    setAnalysisResults(null);
  };

  const renderContent = () => {
    if (showResults && analysisResults) {
      return (
        <div className="max-w-7xl mx-auto py-8 px-8">
          <button
            onClick={handleBack}
            className="mb-6 px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition"
          >
            ← Back
          </button>
          <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8">
            <h2 className="text-3xl font-bold text-white mb-6">
              AI Diagnosis Results
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700">
                <p className="text-slate-400 text-sm mb-2">Diagnosis</p>
                <p className="text-2xl font-bold text-white">
                  {analysisResults.diagnosis}
                </p>
                <p className="text-emerald-400 text-sm mt-2">
                  Confidence: {analysisResults.confidence}
                </p>
              </div>

              <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700">
                <p className="text-slate-400 text-sm mb-2">
                  Recommended Medical Facility
                </p>
                <p className="text-xl font-bold text-teal-400">
                  {analysisResults.recommendedFacility}
                </p>
                <p
                  className={`text-sm mt-2 ${
                    analysisResults.emergencyLevel === "HIGH"
                      ? "text-red-400"
                      : "text-amber-400"
                  }`}
                >
                  Emergency Level: {analysisResults.emergencyLevel}
                </p>
              </div>
            </div>

            {analysisResults.ambulanceNeeded && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-8">
                <p className="text-red-400 font-bold flex items-center">
                  🚑 Emergency Ambulance Required
                </p>
              </div>
            )}

            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 mb-8">
              <p className="text-slate-400 text-sm mb-4">
                Clinical Recommendations
              </p>
              <ul className="space-y-2">
                {analysisResults.recommendations.map((rec, idx) => (
                  <li key={idx} className="text-white flex items-start">
                    <span className="text-teal-400 mr-3">✓</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleSavePatient()}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 text-white font-bold py-3 rounded-xl hover:shadow-lg transition"
            >
              Save Patient Record & Refer
            </button>
          </div>
        </div>
      );
    }

    switch (currentTab) {
      case "chw":
        return <CHW onAnalyze={handleAnalyze} patients={patients} />;
      case "supervisor":
        return <Supervisor patients={patients} />;
      case "facility":
        return <Facility patients={patients} />;
      case "map":
        return <LiveMap />;
      case "settings":
        return <Settings />;
      default:
        return <CHW onAnalyze={handleAnalyze} patients={patients} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar currentTab={currentTab} setTab={setCurrentTab} />
      <main className="flex-1 ml-40 flex flex-col">
        <TopBar />
        <div className="flex-1 overflow-auto">{renderContent()}</div>
      </main>
    </div>
  );
}

export default Home;
