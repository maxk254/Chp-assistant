import React, { useState } from "react";
import {
  User,
  MapPin,
  Calendar,
  ClipboardList,
  Activity,
  ChevronRight,
  AlertCircle,
  Clock,
  AlertTriangle,
  Stethoscope,
  History,
} from "lucide-react";
import { KENYAN_WARDS } from "@/data";

const StatusBadge = ({ status }) => {
  const styles = {
    high: "bg-red-500/10 text-red-500 border-red-500/20",
    medium: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    low: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    default: "bg-slate-500/10 text-slate-500 border-slate-500/20",
  };

  const currentStyle = styles[status.toLowerCase()] || styles.default;

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider flex items-center w-fit ${currentStyle}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full mr-2 ${
          status.toLowerCase() === "high"
            ? "bg-red-500"
            : status.toLowerCase() === "medium"
              ? "bg-amber-500"
              : "bg-emerald-500"
        } animate-pulse`}
      />
      {status}
    </span>
  );
};

const CHW = ({ onAnalyze, onSave, patients = [] }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    ward: "",
    age: "",
    history: "",
    symptoms: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAnalyze(formData);
  };

  const handleSavePatient = () => {
    if (onSave) {
      onSave({
        ...formData,
        diagnosis: formData.symptoms,
        chwName: "CHW", // Default, can be updated later
        timestamp: new Date().toLocaleString(),
        id: Date.now(),
      });
      // Reset form after saving
      setFormData({
        fullName: "",
        ward: "",
        age: "",
        history: "",
        symptoms: "",
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Patient Input Form Section */}
        <section className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-teal-400/10 flex items-center justify-center border border-teal-400/20">
              <Activity className="text-teal-400" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Patient Diagnostic Form
              </h2>
              <p className="text-slate-400 text-sm">
                Input data for AI-powered assessment
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
                  <User size={14} className="mr-2 text-teal-400" /> Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter patient name..."
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-teal-400/50 focus:ring-4 focus:ring-teal-400/5 transition-all placeholder:text-slate-600"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
                  <MapPin size={14} className="mr-2 text-teal-400" /> Assigned
                  Ward
                </label>
                <select
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-teal-400/50 focus:ring-4 focus:ring-teal-400/5 transition-all appearance-none cursor-pointer"
                  value={formData.ward}
                  onChange={(e) =>
                    setFormData({ ...formData, ward: e.target.value })
                  }
                  required
                >
                  <option value="">Select Ward Location</option>
                  {KENYAN_WARDS.map((ward) => (
                    <option key={ward.value} value={ward.value}>
                      {ward.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
                <Calendar size={14} className="mr-2 text-teal-400" /> Patient
                Age
              </label>
              <input
                type="number"
                placeholder="Years"
                className="w-24 bg-slate-900/50 border border-slate-700 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-teal-400/50 focus:ring-4 focus:ring-teal-400/5 transition-all"
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
                <AlertCircle size={14} className="mr-2 text-teal-400" /> Medical
                History
              </label>
              <textarea
                placeholder="Any pre-existing conditions, allergies..."
                rows="3"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-teal-400/50 focus:ring-4 focus:ring-teal-400/5 transition-all resize-none placeholder:text-slate-600"
                value={formData.history}
                onChange={(e) =>
                  setFormData({ ...formData, history: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
                <Clock size={14} className="mr-2 text-teal-400" /> Current Signs
                & Symptoms
              </label>
              <textarea
                placeholder="Fever, nausea, joint pain..."
                rows="4"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-teal-400/50 focus:ring-4 focus:ring-teal-400/5 transition-all resize-none placeholder:text-slate-600"
                value={formData.symptoms}
                onChange={(e) =>
                  setFormData({ ...formData, symptoms: e.target.value })
                }
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:to-emerald-400 text-white font-bold py-5 rounded-2xl shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 transform hover:-translate-y-1 transition-all flex items-center justify-center space-x-3 group active:scale-95"
            >
              <span className="text-lg uppercase tracking-widest">
                Run AI Diagnostic
              </span>
              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              type="button"
              onClick={handleSavePatient}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-400 hover:to-teal-400 text-white font-bold py-5 rounded-2xl shadow-xl shadow-teal-500/20 hover:shadow-teal-500/40 transform hover:-translate-y-1 transition-all flex items-center justify-center space-x-3 group active:scale-95"
            >
              <span className="text-lg uppercase tracking-widest">
                Save Patient Record
              </span>
              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </section>

        {/* Previous Patients Section where the history of the CHW is displayed*/}
        <section>
          {patients.length > 0 ? (
            <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <History size={20} className="mr-2 text-teal-400" />
                Recent Patient Records
              </h3>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {patients.map((patient) => (
                  <div
                    key={patient.id}
                    className="bg-slate-900/50 border border-slate-700 rounded-2xl p-5 hover:border-teal-400/50 transition-all hover:bg-slate-900/70"
                  >
                    {/* Header with name and severity */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-teal-400/20 flex items-center justify-center border border-teal-400/30">
                          <User size={18} className="text-teal-400" />
                        </div>
                        <div>
                          <h4 className="text-white font-bold text-base">
                            {patient.fullName}
                          </h4>
                          <p className="text-slate-400 text-xs">
                            Age: {patient.age || "N/A"} years
                          </p>
                        </div>
                      </div>
                      <StatusBadge status={patient.status} />
                    </div>

                    {/* Condition and Diagnosis */}
                    <div className="space-y-3 mb-3">
                      <div className="flex items-start gap-2">
                        <Stethoscope
                          size={14}
                          className="text-amber-400 mt-1 flex-shrink-0"
                        />
                        <div className="flex-1">
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            Condition/Diagnosis
                          </p>
                          <p className="text-teal-400 font-semibold text-sm">
                            {patient.diagnosis || patient.symptoms}
                          </p>
                        </div>
                      </div>

                      {/* Medical History */}
                      {patient.history && (
                        <div className="flex items-start gap-2">
                          <History
                            size={14}
                            className="text-blue-400 mt-1 flex-shrink-0"
                          />
                          <div className="flex-1">
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                              Medical History
                            </p>
                            <p className="text-slate-300 text-xs">
                              {patient.history}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Ward Location */}
                      <div className="flex items-start gap-2">
                        <MapPin
                          size={14}
                          className="text-purple-400 mt-1 flex-shrink-0"
                        />
                        <div className="flex-1">
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            Ward Location
                          </p>
                          <p className="text-purple-300 font-medium text-sm">
                            {patient.ward || "Not Assigned"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Timestamp */}
                    <p className="text-slate-500 text-[11px] pt-2 border-t border-slate-700/50">
                      <span className="font-bold">Recorded:</span>{" "}
                      {patient.timestamp || new Date().toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 flex flex-col items-center justify-center h-full">
              <div className="w-16 h-16 rounded-full bg-slate-700/50 flex items-center justify-center mb-4">
                <ClipboardList size={32} className="text-slate-500" />
              </div>
              <h3 className="text-white font-semibold mb-2">No Records Yet</h3>
              <p className="text-slate-400 text-center text-sm">
                Patient diagnoses will appear here after analysis
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default CHW;
