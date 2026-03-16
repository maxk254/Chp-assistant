import React from 'react';
import { 
  LayoutDashboard, 
  Hospital, 
  UserCheck, 
  Map as MapIcon, 
  Settings as SettingsIcon,
  LogOut,
  Plus,
  Activity
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex flex-col items-center py-4 transition-all duration-500 group relative ${
      active ? 'text-teal-400 bg-teal-500/5' : 'text-slate-500 hover:text-white hover:bg-white/5'
    }`}
  >
    <div className="relative z-10">
      <Icon size={22} strokeWidth={active ? 2.5 : 2} className="transition-transform duration-300 group-hover:scale-110" />
      {active && (
        <span className="absolute -left-4 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-teal-400 rounded-r-full shadow-[0_0_15px_rgba(45,212,191,0.5)] animate-in slide-in-from-left-2 duration-300" />
      )}
    </div>
    <span className={`text-[10px] uppercase tracking-widest mt-2 font-bold transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
      {label}
    </span>
    {active && (
      <div className="absolute inset-0 bg-gradient-to-r from-teal-400/10 to-transparent opacity-50" />
    )}
  </button>
);

const Sidebar = ({ currentTab, setTab }) => {
  const menuItems = [
    { id: 'chw', icon: LayoutDashboard, label: 'Dash' },
    { id: 'facility', icon: Hospital, label: 'Facility' },
    { id: 'supervisor', icon: UserCheck, label: 'Supervise' },
    { id: 'map', icon: MapIcon, label: 'Live Map' },
    { id: 'settings', icon: SettingsIcon, label: 'Settings' },
  ];

  return (
    <div className="w-20 h-screen bg-slate-900 border-r border-slate-700/50 flex flex-col items-center py-8 fixed left-0 top-0 z-50 backdrop-blur-xl">
      <div className="mb-12 group cursor-pointer">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center shadow-[0_0_20px_rgba(45,212,191,0.3)] group-hover:shadow-[0_0_30px_rgba(45,212,191,0.5)] transition-all duration-500 transform group-hover:rotate-12">
          <Activity className="text-white" size={28} />
        </div>
      </div>
      
      <div className="flex-1 w-full space-y-2">
        {menuItems.map((item) => (
          <SidebarItem 
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={currentTab === item.id}
            onClick={() => setTab(item.id)}
          />
        ))}
      </div>

      <div className="mt-auto flex flex-col items-center space-y-6 pb-4">
        <button className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-teal-400 transition-all duration-300 group shadow-lg">
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />
        </button>
        
        <button className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300">
          <LogOut size={20} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
