import React from "react";

const TopBar = () => {
  return (
    <div className="min-h-16 sm:h-20 w-full flex items-center gap-3 px-3 sm:px-8 py-3 sm:py-0 border-b border-slate-700 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40">
      <h1 className="text-sm sm:text-base lg:text-lg font-semibold text-white leading-tight">
        Welcome,{" "}
        <span className="text-teal-400 font-bold">Community Health Worker</span>
      </h1>

      <div className="ml-auto flex items-center gap-2 sm:gap-4 shrink-0">
        <div className="hidden sm:inline-flex px-2.5 py-1 bg-teal-400/10 text-teal-400 border border-teal-400/20 rounded-full text-[10px] sm:text-xs font-semibold">
          LIVE SESSION ON
        </div>
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-[10px] sm:text-xs text-slate-400 font-semibold">
          CHW
        </div>
      </div>
    </div>
  );
};

export default TopBar;
