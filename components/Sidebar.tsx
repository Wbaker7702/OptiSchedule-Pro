
import React from 'react';
import {
  Activity,
  ArrowLeftRight,
  BarChart3,
  CalendarDays,
  Ghost,
  Grid3X3,
  LayoutDashboard,
  LogOut,
  Package,
  Settings as SettingsIcon,
  ShieldCheck,
  Star,
  TrendingUp,
  Truck,
  Users
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { View } from '../types';
import { APP_VERSION } from '../constants';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  onLogout: () => void;
}

interface NavigationSection {
  id: string;
  label: string;
  items: Array<{
    id: View;
    label: string;
    icon: LucideIcon;
  }>;
}

const NAVIGATION_SECTIONS: NavigationSection[] = [
  {
    id: 'core',
    label: 'Core',
    items: [
      { id: View.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
      { id: View.SCHEDULING, label: 'Scheduling', icon: CalendarDays },
      { id: View.OPERATIONS, label: 'Operations', icon: Activity },
      { id: View.ANALYTICS, label: 'Analytics', icon: BarChart3 },
      { id: View.ENTERPRISE_SKILLS, label: 'Skill Policies', icon: ShieldCheck },
      { id: View.SETTINGS, label: 'Settings', icon: SettingsIcon }
    ]
  },
  {
    id: 'workforce',
    label: 'Workforce & Inventory',
    items: [
      { id: View.TEAM, label: 'Team', icon: Users },
      { id: View.INVENTORY, label: 'Inventory', icon: Package },
      { id: View.GHOST_INVENTORY, label: 'Ghost Inventory', icon: Ghost },
      { id: View.LOGISTICS, label: 'Logistics', icon: Truck }
    ]
  },
  {
    id: 'insights',
    label: 'Insights',
    items: [
      { id: View.PLAYBOOK, label: 'Playbook', icon: ShieldCheck },
      { id: View.COMPARISON, label: 'Comparison', icon: ArrowLeftRight },
      { id: View.METRICS_REPORT, label: 'Metrics Report', icon: TrendingUp },
      { id: View.ROYALTY_DASHBOARD, label: 'Royalty Dashboard', icon: Grid3X3 },
      { id: View.STORE_RATINGS, label: 'Store Ratings', icon: Star }
    ]
  }
];

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, onLogout }) => {
  return (
    <div className="w-64 bg-[#0f172a] text-white h-screen fixed left-0 top-0 flex flex-col shadow-xl z-50">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-[#0d9488] rounded-lg p-2 shadow-lg shrink-0">
             <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-sm leading-tight text-white">Microsoft Defender</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Portal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-5 overflow-y-auto pb-4 custom-scrollbar">
        {NAVIGATION_SECTIONS.map((section) => (
          <div key={section.id}>
            <p className="px-4 pb-2 text-[10px] text-slate-500 font-black uppercase tracking-widest">
              {section.label}
            </p>
            <div className="space-y-1">
              {section.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    currentView === item.id
                      ? 'bg-[#1e293b] text-[#2dd4bf]'
                      : 'text-slate-400 hover:bg-[#1e293b] hover:text-white'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${currentView === item.id ? 'text-[#2dd4bf]' : 'text-slate-500'}`} />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
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
        <p className="mt-3 px-4 text-[10px] text-slate-500 font-mono uppercase tracking-wide">
          {APP_VERSION}
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
