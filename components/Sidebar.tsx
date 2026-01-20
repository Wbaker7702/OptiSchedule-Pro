
import React from 'react';
import { LayoutDashboard, CalendarDays, Activity, Package, BarChart3, Users, Settings as SettingsIcon, LogOut, ShieldCheck, Lock } from 'lucide-react';
import { View } from '../types';
import { APP_VERSION, BRAND_NAME } from '../constants';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, onLogout }) => {
  const menuItems = [
    { id: View.DASHBOARD, label: 'Strategic Command', icon: LayoutDashboard },
    { id: View.SCHEDULING, label: 'Deployment Center', icon: CalendarDays },
    { id: View.OPERATIONS, label: 'Operational Hub', icon: Activity },
    { id: View.INVENTORY, label: 'Asset Management', icon: Package },
    { id: View.ANALYTICS, label: 'Fiscal Oversight', icon: BarChart3 },
    { id: View.TEAM, label: 'Personnel Registry', icon: Users },
    { id: View.PLAYBOOK, label: 'Sentinel Policy', icon: ShieldCheck },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 flex flex-col shadow-2xl z-50 border-r border-slate-800">
      <div className="p-6 border-b border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 rounded-lg p-2 shadow-lg shadow-blue-500/10 shrink-0">
             <Activity className="w-6 h-6 text-white" />
          </div>
          <div className="overflow-hidden">
            <h1 className="font-black text-sm uppercase tracking-[0.1em] leading-tight text-white truncate">OptiSchedule</h1>
            <p className="text-[10px] text-blue-400 font-mono font-bold uppercase tracking-widest truncate">Pro v3.1</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] uppercase tracking-widest font-black transition-all group ${
              currentView === item.id
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon className={`w-4 h-4 ${currentView === item.id ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 bg-slate-900/80">
        <div className="flex items-center gap-2 px-4 py-2 mb-3 bg-slate-800/50 rounded-lg border border-slate-700">
           <ShieldCheck className="w-3 h-3 text-blue-400" />
           <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{APP_VERSION}</span>
        </div>
        <button 
          onClick={() => setCurrentView(View.SETTINGS)}
          className={`flex items-center gap-3 px-4 py-2 w-full rounded-lg transition-all group ${
            currentView === View.SETTINGS 
              ? 'bg-slate-800 text-white border border-slate-700' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <SettingsIcon className={`w-4 h-4 ${currentView === View.SETTINGS ? 'text-blue-500' : ''}`} />
          <span className="text-xs font-bold uppercase tracking-widest">Settings</span>
        </button>
        <button 
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-2 text-red-400 hover:text-red-300 w-full rounded-lg hover:bg-slate-800 transition-colors mt-1"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-widest">Terminate Session</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
