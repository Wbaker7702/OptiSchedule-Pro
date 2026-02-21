
import React from 'react';
import { LayoutDashboard, CalendarDays, Activity, Package, BarChart3, Users, Settings as SettingsIcon, LogOut, ShieldCheck, ArrowLeftRight, Grid3X3, TrendingUp, Coins, Star, Truck, Ghost } from 'lucide-react';
import { View } from '../types';
import { APP_VERSION } from '../constants';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, onLogout }) => {
  const menuItems = [
    { id: View.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: View.SCHEDULING, label: 'Scheduling', icon: CalendarDays },
    { id: View.OPERATIONS, label: 'Operations', icon: Activity },
    { id: View.ENTERPRISE_SECURITY, label: 'Enterprise Security', icon: ShieldCheck },
    { id: View.ANALYTICS, label: 'Analytics', icon: BarChart3 },
    { id: View.SETTINGS, label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="w-64 bg-[#0f172a] text-white h-screen fixed left-0 top-0 flex flex-col shadow-xl z-50">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-[#0d9488] rounded-lg p-2 shadow-lg shrink-0">
             <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-sm leading-tight text-white">OptiSchedule</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Enterprise</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              currentView === item.id
                ? 'bg-[#1e293b] text-[#2dd4bf]'
                : 'text-slate-400 hover:bg-[#1e293b] hover:text-white'
            }`}
          >
            <item.icon className={`w-4 h-4 ${currentView === item.id ? 'text-[#2dd4bf]' : 'text-slate-500'}`} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-white w-full rounded-lg hover:bg-[#1e293b] transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-xs font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
