
import React from 'react';
import { LayoutDashboard, CalendarDays, Activity, Package, BarChart3, Users, Settings as SettingsIcon, LogOut, ShieldCheck, ArrowLeftRight, Grid3X3, TrendingUp, Coins, Star, Truck, Ghost, Globe, Zap, BookOpen, ChevronRight } from 'lucide-react';
import { View } from '../types';
import { APP_VERSION } from '../constants';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, onLogout }) => {
  const categories = [
    {
      label: 'Intelligence',
      items: [
        { id: View.DASHBOARD, label: 'Strategic Command', icon: LayoutDashboard },
        { id: View.ANALYTICS, label: 'Fiscal Performance', icon: TrendingUp },
        { id: View.STORE_RATINGS, label: 'Store Ratings', icon: Star },
        { id: View.COMPARISON, label: 'Market Comparison', icon: ArrowLeftRight },
      ]
    },
    {
      label: 'Operations',
      items: [
        { id: View.LOGISTICS, label: 'Logistics Command', icon: Truck },
        { id: View.GHOST_INVENTORY, label: 'Ghost Inventory', icon: Ghost },
        { id: View.OPERATIONS, label: 'Operational Hub', icon: Activity },
        { id: View.INVENTORY, label: 'Asset Management', icon: Package },
      ]
    },
    {
      label: 'Management',
      items: [
        { id: View.SCHEDULING, label: 'Scheduling Grid', icon: CalendarDays },
        { id: View.TEAM, label: 'Personnel Registry', icon: Users },
        { id: View.ROYALTY_DASHBOARD, label: 'Royalty Node', icon: Coins },
        { id: View.METRICS_REPORT, label: 'Deployment Center', icon: Grid3X3 },
      ]
    },
    {
      label: 'System',
      items: [
        { id: View.PLAYBOOK, label: 'Sentinel Policy', icon: ShieldCheck },
        { id: View.SETTINGS, label: 'Settings', icon: SettingsIcon },
      ]
    }
  ];

  return (
    <div className="w-64 bg-[#020617] text-white h-screen fixed left-0 top-0 flex flex-col shadow-2xl z-50 border-r border-slate-800/50">
      <div className="p-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 border border-blue-400/30 ring-1 ring-white/10">
             <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-black text-sm tracking-tighter text-white leading-none">OPTISCHEDULE</h1>
            <p className="text-[10px] text-blue-400 font-mono font-bold mt-1 tracking-widest uppercase opacity-80">PRO {APP_VERSION}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-8 overflow-y-auto custom-scrollbar pb-10">
        {categories.map((category) => (
          <div key={category.label} className="space-y-2">
            <h3 className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">
              {category.label}
            </h3>
            <div className="space-y-1">
              {category.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full group flex items-center justify-between px-4 py-2.5 rounded-xl text-[11px] font-bold tracking-wide transition-all duration-200 ${
                    currentView === item.id
                      ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-4 h-4 transition-colors ${currentView === item.id ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                    <span className="uppercase tracking-wider">{item.label}</span>
                  </div>
                  {currentView === item.id && (
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-6 bg-slate-900/30 border-t border-slate-800/50">
        <button 
          onClick={onLogout}
          className="group flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 w-full rounded-xl hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
        >
          <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Terminate Session</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
