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

const chws = [
  {
    id: 1,
    name: "Jane Wambui",
    zone: "Sub-zone A · Ward 4",
    sessions: 18,
    referrals: 5,
    lastSeen: "2 hrs ago",
    status: "active",
  },
  {
    id: 2,
    name: "David Kariuki",
    zone: "Sub-zone B · Ward 7",
    sessions: 14,
    referrals: 3,
    lastSeen: "4 hrs ago",
    status: "active",
  },
  {
    id: 3,
    name: "Esther Njuguna",
    zone: "Sub-zone C · Ward 12",
    sessions: 9,
    referrals: 2,
    lastSeen: "Yesterday",
    status: "inactive",
  },
  {
    id: 4,
    name: "Peter Mwangi",
    zone: "Sub-zone A · Ward 2",
    sessions: 21,
    referrals: 7,
    lastSeen: "1 hr ago",
    status: "alert",
  },
];

const Supervisor = ({ patients = [] }) => {
  const [selectedChw, setSelectedChw] = useState(null);

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
          value="18"
          subtext="of 24 total"
          accent="teal"
        />
        <MetricCard
          icon={ClipboardCheck}
          label="Sessions Completed"
          value="143"
          subtext="Target: 160"
          accent="emerald"
        />
        <MetricCard
          icon={Home}
          label="Households Visited"
          value="213"
          subtext="Across 6 sub-zones"
          accent="amber"
        />
        <MetricCard
          icon={AlertTriangle}
          label="Referrals Issued"
          value="27"
          subtext="11 urgent · 16 routine"
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
          {chws.map((chw) => (
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
          ))}
        </div>

        <div className="mt-6 pt-5 border-t border-slate-700/60 text-sm text-slate-400">
          Active CHPs right now:{" "}
          <span className="text-white font-semibold">
            {chws.filter((c) => c.status === "active").length}
          </span>
        </div>
      </section>
    </div>
  );
};

export default Supervisor;
