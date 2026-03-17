import React, { useState } from 'react';
import { 
  User, MapPin, Calendar, ClipboardList, Activity, 
  ChevronRight, AlertCircle, Clock
} from 'lucide-react';

const StatusBadge = ({ status }) => {
  const styles = {
    high: "bg-red-500/10 text-red-500 border-red-500/20",
    medium: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    low: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    default: "bg-slate-500/10 text-slate-500 border-slate-500/20"
  };
  
  const currentStyle = styles[status.toLowerCase()] || styles.default;
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider flex items-center w-fit ${currentStyle}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
        status.toLowerCase() === 'high' ? 'bg-red-500' : 
        status.toLowerCase() === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
      } animate-pulse`} />
      {status}
    </span>
  );
};

const CHW = ({ onAnalyze, patients = [] }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    ward: '',
    age: '',
    history: '',
    symptoms: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAnalyze(formData);
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
              <h2 className="text-2xl font-bold text-white tracking-tight">Patient Diagnostic Form</h2>
              <p className="text-slate-400 text-sm">Input data for AI-powered assessment</p>
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
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
                  <MapPin size={14} className="mr-2 text-teal-400" /> Assigned Ward
                </label>
                <select
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-teal-400/50 focus:ring-4 focus:ring-teal-400/5 transition-all appearance-none cursor-pointer"
                  value={formData.ward}
                  onChange={(e) => setFormData({...formData, ward: e.target.value})}
                  required
                >
                  <option value="">Select Ward Location</option>
                  {[...Array(40)].map((_, i) => (
                    <option key={i+1} value={`Ward ${i+1}`}>Ward {i+1}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
                <Calendar size={14} className="mr-2 text-teal-400" /> Patient Age
              </label>
              <input
                type="number"
                placeholder="Years"
                className="w-24 bg-slate-900/50 border border-slate-700 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-teal-400/50 focus:ring-4 focus:ring-teal-400/5 transition-all"
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
                <AlertCircle size={14} className="mr-2 text-teal-400" /> Medical History
              </label>
              <textarea
                placeholder="Any pre-existing conditions, allergies..."
                rows="3"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-teal-400/50 focus:ring-4 focus:ring-teal-400/5 transition-all resize-none placeholder:text-slate-600"
                value={formData.history}
                onChange={(e) => setFormData({...formData, history: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
                <Clock size={14} className="mr-2 text-teal-400" /> Current Signs & Symptoms
              </label>
              <textarea
                placeholder="Fever, nausea, joint pain..."
                rows="4"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-teal-400/50 focus:ring-4 focus:ring-teal-400/5 transition-all resize-none placeholder:text-slate-600"
                value={formData.symptoms}
                onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:to-emerald-400 text-white font-bold py-5 rounded-2xl shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 transform hover:-translate-y-1 transition-all flex items-center justify-center space-x-3 group active:scale-95"
            >
              <span className="text-lg uppercase tracking-widest">Run AI Diagnostic</span>
              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </section>

        {/* Previous Patients Section */}
        <section>
          {patients.length > 0 ? (
            <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8">
              <h3 className="text-xl font-bold text-white mb-6">Recent Patient Records</h3>
              <div className="space-y-4">
                {patients.map(patient => (
                  <div key={patient.id} className="bg-slate-900/50 border border-slate-700 rounded-xl p-4 hover:border-teal-400/30 transition">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-white font-semibold">{patient.fullName}</h4>
                      <StatusBadge status={patient.status} />
                    </div>
                    <p className="text-teal-400 text-sm mb-2">{patient.diagnosis}</p>
                    <p className="text-slate-400 text-xs">{patient.timestamp}</p>
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
              <p className="text-slate-400 text-center text-sm">Patient diagnoses will appear here after analysis</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default CHW;
