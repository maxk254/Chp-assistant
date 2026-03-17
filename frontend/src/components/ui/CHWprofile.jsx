import React from "react";
import { Activity, ChevronLeft } from "lucide-react";

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() || "")
    .join("");

function CHWprofile({ chw, onBack }) {
  const profile = chw || {
    name: "Amara Njoki",
    zone: "Githunguri",
    sessions: 9,
    referrals: 2,
    lastSeen: "2 min ago",
    status: "active",
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-8">
      <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 space-y-8">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 bg-slate-900/50 border border-slate-700 rounded-2xl px-4 py-2 text-teal-400 text-xs font-bold uppercase tracking-widest hover:border-teal-400/30 hover:text-teal-300 transition"
        >
          <ChevronLeft size={14} />
          Back to all Promoters
        </button>

        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-400/10 flex items-center justify-center border border-teal-400/20">
            <Activity className="text-teal-400" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              CHP Profile
            </h2>
            <p className="text-slate-400 text-sm">
              Performance and session activity overview
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-400/10 border border-teal-400/20 text-teal-300 text-lg font-bold flex items-center justify-center">
              {getInitials(profile.name)}
            </div>

            <div>
              <p className="text-white font-semibold text-lg">{profile.name}</p>
              <p className="text-slate-400 text-sm">
                Community Health Promoter . {profile.zone}
              </p>
              <p className="text-slate-500 text-xs">Joined Jan 2022</p>
            </div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 text-right">
            <p className="text-slate-400 text-xs uppercase tracking-wider">
              Today's Completion
            </p>
            <p className="text-2xl font-bold text-emerald-400">90%</p>
            <p className="text-slate-500 text-xs">9 of 10 sessions</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
            <p className="text-slate-400 text-xs uppercase tracking-wider">
              Sessions Today
            </p>
            <p className="text-white font-bold text-xl">{profile.sessions}</p>
          </div>

          <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
            <p className="text-slate-400 text-xs uppercase tracking-wider">
              Referrals
            </p>
            <p className="text-white font-bold text-xl">{profile.referrals}</p>
          </div>

          <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
            <p className="text-slate-400 text-xs uppercase tracking-wider">
              Last Active
            </p>
            <p className="text-white font-bold text-xl">{profile.lastSeen}</p>
          </div>

          <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
            <p className="text-slate-400 text-xs uppercase tracking-wider">
              Status
            </p>
            <p className="text-white font-bold text-xl capitalize">
              {profile.status}
            </p>
          </div>
        </div>

        <div>
          <p className="text-white font-semibold mb-3">
            Today's Session History
          </p>
          <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <p className="text-slate-300 text-sm">10:00 AM</p>
              <p className="text-white text-sm">Child Health</p>
              <div className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">
                Referred
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CHWprofile;
