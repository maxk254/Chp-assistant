import React, { useState } from "react";
import {
  Activity,
  Users,
  ArrowDownLeft,
  ClipboardCheck,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";

const metricBase =
  "bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4";

const MetricCard = ({ icon: Icon, label, value, subtext, accent = "teal" }) => {
  const accentMap = {
    teal: "text-teal-400 border-teal-400/20 bg-teal-400/10",
    amber: "text-amber-400 border-amber-400/20 bg-amber-400/10",
    emerald: "text-emerald-400 border-emerald-400/20 bg-emerald-400/10",
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

const PriorityBadge = ({ priority = "normal" }) => {
  const p = String(priority).toLowerCase();
  const styles = {
    urgent: "bg-red-500/10 text-red-400 border-red-500/20",
    high: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    normal: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };

  return (
    <span
      className={
        "px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider " +
        (styles[p] || styles.normal)
      }
    >
      {p}
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

const Facility = ({ patients = [] }) => {
  const [patientStatuses, setPatientStatuses] = useState({});
  const [openDropdown, setOpenDropdown] = useState(null);

  const incoming =
    patients.length > 0
      ? patients.map((p, i) => ({
          id: p.id || i + 1,
          fullName: p.fullName || "Unknown Patient",
          reason: p.diagnosis || "General referral",
          symptoms: p.symptoms || "No symptoms recorded",
          chwName: p.chwName || "CHW",
          referralTime: p.timestamp || "Recently",
          priority: p.status || "normal",
        }))
      : [
          {
            id: 1,
            fullName: "Samuel Karanja",
            reason: "Diabetes complication",
            symptoms: "Fatigue, increased thirst, blurred vision",
            chwName: "Jane Wambui",
            referralTime: "2 days ago",
            priority: "urgent",
          },
          {
            id: 2,
            fullName: "Mercy Njeri",
            reason: "Post-partum follow-up",
            symptoms: "Mild dizziness, normal vitals",
            chwName: "David Kariuki",
            referralTime: "Today",
            priority: "high",
          },
        ];

  const pendingCount = incoming.filter(
    (r) =>
      String(r.priority).toLowerCase() === "urgent" ||
      String(r.priority).toLowerCase() === "high",
  ).length;

  return (
    <div className="max-w-7xl mx-auto py-8 px-8 space-y-8">
      <section className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-400/10 border border-teal-400/20 flex items-center justify-center">
            <Activity className="text-teal-400" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Facility Management
            </h1>
            <p className="text-slate-400 text-sm">
              Githunguri Health Centre . Kiambu County . Level 3 Facility
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          icon={Users}
          label="CHAs Linked"
          value="34"
          subtext="Across 3 sub-counties"
          accent="teal"
        />
        <MetricCard
          icon={ArrowDownLeft}
          label="Referrals Received"
          value="27"
          subtext="This month"
          accent="amber"
        />
        <MetricCard
          icon={ClipboardCheck}
          label="Patients Attended"
          value="19"
          subtext="8 pending appointments"
          accent="emerald"
        />
      </section>

      <section className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Incoming Referrals</h2>
            <p className="text-slate-400 text-sm">
              Review and accept pending referrals
            </p>
          </div>
          <button className="bg-linear-to-r from-emerald-500 to-teal-400 hover:to-emerald-400 text-white font-bold py-3 px-5 rounded-2xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all flex items-center gap-2 w-fit">
            <CheckCircle2 size={18} />
            <span className="uppercase tracking-widest text-xs">
              Accept All Pending
            </span>
          </button>
        </div>

        <div className="space-y-4">
          {incoming.map((referral) => (
            <div
              key={referral.id}
              className="bg-slate-900/50 border border-slate-700 rounded-xl p-4 hover:border-teal-400/30 transition"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-9 h-9 rounded-lg bg-teal-400/10 border border-teal-400/20 text-teal-300 text-sm font-bold flex items-center justify-center shrink-0">
                    {getInitials(referral.fullName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold">
                      {referral.fullName}
                    </p>
                    <p className="text-slate-300 text-xs">{referral.reason}</p>
                    <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <AlertTriangle size={12} className="text-teal-400" />
                        Via CHW {referral.chwName}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock3 size={12} className="text-teal-400" />
                        {referral.referralTime}
                      </span>
                    </div>
                  </div>
                </div>
                <PriorityBadge priority={referral.priority} />
              </div>

              <div className="bg-slate-800/50 rounded-lg p-3 mb-4">
                <p className="text-slate-400 text-xs font-semibold mb-1">
                  SYMPTOMS
                </p>
                <p className="text-slate-300 text-sm">{referral.symptoms}</p>
              </div>

              <div className="relative">
                <button
                  onClick={() =>
                    setOpenDropdown(
                      openDropdown === referral.id ? null : referral.id,
                    )
                  }
                  className="w-full bg-teal-500/10 border border-teal-400/30 text-teal-400 hover:bg-teal-500/20 transition font-semibold py-2 px-3 rounded-lg text-sm flex items-center justify-between"
                >
                  <span>
                    {patientStatuses[referral.id]
                      ? patientStatuses[referral.id].toUpperCase()
                      : "UPDATE STATUS"}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      openDropdown === referral.id ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openDropdown === referral.id && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-10">
                    {["Arrived", "Treated", "Admitted"].map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setPatientStatuses({
                            ...patientStatuses,
                            [referral.id]: status,
                          });
                          setOpenDropdown(null);
                        }}
                        className="w-full px-4 py-2.5 text-left text-white hover:bg-teal-500/20 transition text-sm border-b border-slate-700 last:border-b-0"
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-5 border-t border-slate-700/60 text-sm text-slate-400">
          Pending urgent and high-priority referrals:{" "}
          <span className="text-white font-semibold">{pendingCount}</span>
        </div>
      </section>
    </div>
  );
};

export default Facility;
