import React from 'react';

const TopBar = () => {
  return (
    <div className="h-20 w-full flex items-center px-8 border-b border-slate-700 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40">
      <h1 className="text-xl font-semibold text-white">
        Welcome, <span className="text-teal-400 font-bold">Community Health Worker</span>
      </h1>
      
      <div className="ml-auto flex items-center space-x-4">
        <div className="px-3 py-1 bg-teal-400/10 text-teal-400 border border-teal-400/20 rounded-full text-xs font-semibold">
          LIVE SESSION ON
        </div>
        <div className="w-10 h-10 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-slate-400">
          CHW
        </div>
      </div>
    </div>
  );
};

export default TopBar;