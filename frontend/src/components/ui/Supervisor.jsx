import React, { useState } from "react";
import {
  Activity,
  Users,
  ClipboardCheck,
  Home,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  MapPin,
  BarChart3,
} from "lucide-react";
import CHWprofile from "./CHWprofile";

const metricBase =
  "bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4";

const MetricCard = ({ icon: Icon, label, value, subtext, accent = "teal" }) => {
  const accentMap = {
    teal: "text-teal-400 border-teal-400/20 bg-teal-400/10",
    amber: "text-amber-400 border-amber-400/20 bg-amber-400/10",
    emerald: "text-emerald-400 border-emerald-400/20 bg-emerald-400/10",
    red: "text-red-400 border-red-400/20 bg-red-400/10",
  };

  return (
    <div className={metricBase}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          {label}
        </p>
        <div
          className={
            "w-9 h-9 rounded-lg border flex items-center justify-center " +
            (accentMap[accent] || accentMap.teal)
          }
        >
          <Icon size={16} />
        </div>
      </div>
      <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
      <p className="text-slate-400 text-xs mt-0.5">{subtext}</p>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const s = String(status).toLowerCase();
  const styles = {
    active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    inactive: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    alert: "bg-red-500/10 text-red-400 border-red-500/20",
  };
  return (
    <span
      className={
        "px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider flex items-center gap-1.5 w-fit " +
        (styles[s] || styles.inactive)
      }
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          s === "active"
            ? "bg-emerald-400 animate-pulse"
            : s === "alert"
              ? "bg-red-400 animate-pulse"
              : "bg-slate-400"
        }`}
      />
      {status}
    </span>
  );
};

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() || "")
    .join("");

const Supervisor = ({ patients = [], chws = [] }) => {
  const [selectedChw, setSelectedChw] = useState(null);

  // Calculate dynamic metrics
  const activeCHWs = chws.filter(c => c.status === 'active').length;
  const sessionsCompleted = chws.reduce((sum, c) => sum + (c.sessions || 0), 0);
  const householdsVisited = chws.reduce((sum, c) => sum + (c.patients || 0), 0);
  const referralsIssued = patients.length;

  // Calculate disease statistics from patient data
  const diseaseStats = {};
  patients.forEach(patient => {
    const disease = patient.diagnosis || patient.symptoms || 'Unknown Condition';
    diseaseStats[disease] = (diseaseStats[disease] || 0) + 1;
  });

  // Convert to array and sort by count (descending)
  const sortedDiseases = Object.entries(diseaseStats)
    .map(([disease, count]) => ({ disease, count }))
    .sort((a, b) => b.count - a.count);

  // Get max count for scaling the bars
  const maxDiseaseCount = sortedDiseases.length > 0 ? Math.max(...sortedDiseases.map(d => d.count)) : 0;

  if (selectedChw) {
    return <CHWprofile chw={selectedChw} onBack={() => setSelectedChw(null)} />;
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-8 space-y-8">
      {/* Header */}
      <section className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-400/10 border border-teal-400/20 flex items-center justify-center">
            <Activity className="text-teal-400" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Supervisor Dashboard
            </h1>
            <p className="text-slate-400 text-sm">
              Githunguri Sub-County · Kiambu County · CHP Oversight
            </p>
          </div>
        </div>
      </section>

      {/* Metric Cards */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          icon={Users}
          label="Active CHPs Today"
          value={activeCHWs.toString()}
          subtext=""
          accent="teal"
        />
        <MetricCard
          icon={ClipboardCheck}
          label="Sessions Completed"
          value={sessionsCompleted.toString()}
          subtext=""
          accent="emerald"
        />
        <MetricCard
          icon={Home}
          label="Households Visited"
          value={householdsVisited.toString()}
          subtext=""
          accent="amber"
        />
        <MetricCard
          icon={AlertTriangle}
          label="Referrals Issued"
          value={referralsIssued.toString()}
          subtext=""
          accent="red"
        />
      </section>

      {/* CHP Activity Table */}
      <section className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">
              CHP Activity Overview
            </h2>
            <p className="text-slate-400 text-sm">
              Real-time status of community health workers
            </p>
          </div>

        </div>

        <div className="space-y-4">
          {chws.length > 0 ? (
            chws.map((chw) => (
            <div
              key={chw.id}
              className="bg-slate-900/50 border border-slate-700 rounded-xl p-4 hover:border-teal-400/30 transition cursor-pointer"
              onClick={() => setSelectedChw(chw)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedChw(chw);
                }
              }}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-teal-400/10 border border-teal-400/20 text-teal-300 text-sm font-bold flex items-center justify-center shrink-0">
                    {getInitials(chw.name)}
                  </div>
                  <div>
                    <p className="text-white font-semibold">{chw.name}</p>
                    <div className="flex items-center gap-1 mt-0.5 text-[11px] text-slate-400">
                      <MapPin size={11} className="text-teal-400" />
                      {chw.zone}
                    </div>
                  </div>
                </div>
                <StatusBadge status={chw.status} />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                  <p className="text-teal-400 text-base font-bold">
                    {chw.sessions}
                  </p>
                  <p className="text-slate-400 text-[11px] uppercase tracking-wider mt-0.5">
                    Sessions
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                  <p className="text-amber-400 text-base font-bold">
                    {chw.referrals}
                  </p>
                  <p className="text-slate-400 text-[11px] uppercase tracking-wider mt-0.5">
                    Referrals
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3 text-center flex flex-col items-center justify-center">
                  <div className="flex items-center gap-1 text-slate-300 text-xs font-semibold">
                    <Clock3 size={11} className="text-teal-400" />
                    {chw.lastSeen}
                  </div>
                  <p className="text-slate-400 text-[11px] uppercase tracking-wider mt-0.5">
                    Last Seen
                  </p>
                </div>
              </div>
            </div>
            ))
          ) : (
            <div className="text-center py-12 text-slate-400">
              <p className="text-sm">No CHW data available yet</p>
            </div>
          )}
        </div>

        <div className="mt-6 pt-5 border-t border-slate-700/60 text-sm text-slate-400">
          Active CHPs right now:{" "}
          <span className="text-white font-semibold">
            {chws.length > 0 ? chws.filter((c) => c.status === "active").length : 0}
          </span>
        </div>
      </section>

      {/* Disease Tracking Section */}
      <section className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8">
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-red-400/10 border border-red-400/20 flex items-center justify-center">
            <BarChart3 className="text-red-400" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Disease Outbreak Tracking</h2>
            <p className="text-slate-400 text-sm">
              Disease cases by diagnosis - {sortedDiseases.length > 0 ? `${patients.length} total cases` : 'No patient data yet'}
            </p>
          </div>
        </div>

        {sortedDiseases.length > 0 ? (
          <div className="space-y-6">
            {sortedDiseases.map((item, index) => {
              const percentage = Math.round((item.count / maxDiseaseCount) * 100);
              const colors = [
                'bg-red-500',
                'bg-orange-500',
                'bg-amber-500',
                'bg-yellow-500',
                'bg-emerald-500',
                'bg-cyan-500',
                'bg-blue-500',
                'bg-purple-500',
              ];
              const color = colors[index % colors.length];
              const textColor = color.replace('bg-', 'text-');

              return (
                <div key={item.disease} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm truncate">{item.disease}</p>
                      <p className="text-slate-400 text-xs">Cases reported</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className={`font-black text-lg ${textColor}`}>{item.count}</p>
                      <p className="text-slate-400 text-xs">{percentage}%</p>
                    </div>
                  </div>
                  
                  <div className="relative w-full h-8 bg-slate-900/50 rounded-lg overflow-hidden border border-slate-700/50">
                    <div
                      className={`h-full ${color} rounded-lg transition-all duration-500 ease-out flex items-center justify-end pr-3`}
                      style={{ width: `${percentage}%` }}
                    >
                      {percentage > 15 && (
                        <span className="text-white text-xs font-bold">{item.count}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Summary Stats */}
            <div className="mt-8 pt-6 border-t border-slate-700/60 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">Total Cases</p>
                <p className="text-white text-2xl font-bold">{patients.length}</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">Conditions</p>
                <p className="text-white text-2xl font-bold">{sortedDiseases.length}</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">Most Common</p>
                <p className="text-emerald-400 text-sm font-semibold truncate">{sortedDiseases[0]?.disease || 'N/A'}</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">Highest Count</p>
                <p className="text-red-400 text-2xl font-bold">{sortedDiseases[0]?.count || 0}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 text-slate-400">
            <div className="w-16 h-16 rounded-full bg-slate-700/50 flex items-center justify-center mx-auto mb-4">
              <BarChart3 size={32} className="text-slate-500" />
            </div>
            <p className="text-sm font-medium">No disease data available yet</p>
            <p className="text-xs mt-1">Patient diagnoses will appear here as CHWs submit patient data</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Supervisor;
