
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Scheduling from './pages/Scheduling';
import Operations from './pages/Operations';
import Inventory from './pages/Inventory';
import Team from './pages/Team';
import Analytics from './pages/Analytics';
import Playbook from './pages/Playbook';
import Settings from './pages/Settings';
import Login from './components/Login';
import SentinelAI from './components/SentinelAI';
import { View, ERPProvider, IntegrationStatus, HeatmapDataPoint } from './types';
import { HEATMAP_DATA } from './constants';
import { ShieldAlert, Lock, AlertTriangle, RefreshCw, Power, Terminal, Zap, Clock, ShieldX, Ban, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [operationsTab, setOperationsTab] = useState<'metrics' | 'audit' | 'vision' | 'scanner'>('metrics');
  const [linterTrigger, setLinterTrigger] = useState<string | null>(null);

  // Global Suspension State
  const [isSuspended, setIsSuspended] = useState(true);
  const [timeLeft, setTimeLeft] = useState(36000); // 10 hours in seconds

  useEffect(() => {
    let timer: number;
    if (isSuspended && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsSuspended(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isSuspended, timeLeft]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Global Schedule State
  const [heatmapData, setHeatmapData] = useState<HeatmapDataPoint[]>(HEATMAP_DATA);

  // Global Integration State
  const [activeERPProvider, setActiveERPProvider] = useState<ERPProvider>('Dynamics 365');
  const [isERPConnected, setIsERPConnected] = useState(false);
  const [hubspotStatus, setHubspotStatus] = useState<IntegrationStatus>('disconnected');

  const handleLogin = () => {
    if (isSuspended) return;
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView(View.DASHBOARD);
  };

  const navigateToOperations = (tab: 'metrics' | 'audit' | 'vision' | 'scanner' = 'metrics') => {
    setOperationsTab(tab);
    setCurrentView(View.OPERATIONS);
  };

  const handleEmployeeAdded = () => {
    setLinterTrigger('NEW_ASSET_SCAN');
    navigateToOperations('audit');
  };

  const handleStaffingAdjustment = () => {
    if (isSuspended) return;
    setHeatmapData(prev => prev.map(point => {
      if (point.efficiency < 80) {
        const newStaff = point.staffing + 2;
        const newEfficiency = Math.min(100, point.efficiency + 15);
        return { ...point, staffing: newStaff, efficiency: newEfficiency };
      }
      return point;
    }));
  };

  const renderView = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return (
          <Dashboard 
            setCurrentView={setCurrentView} 
            onAdjustStaffing={handleStaffingAdjustment} 
          />
        );
      case View.SCHEDULING:
        return (
          <Scheduling 
            setCurrentView={setCurrentView} 
            onFinalize={() => navigateToOperations('audit')}
            activeProvider={activeERPProvider}
            setActiveProvider={setActiveERPProvider}
            isConnected={isERPConnected}
            setIsConnected={setIsERPConnected}
            setHubspotStatus={setHubspotStatus}
            heatmapData={heatmapData}
            onAdjustStaffing={handleStaffingAdjustment}
          />
        );
      case View.OPERATIONS:
        return (
          <Operations 
            defaultTab={operationsTab} 
            externalTrigger={linterTrigger}
            onClearTrigger={() => setLinterTrigger(null)}
          />
        );
      case View.INVENTORY:
        return <Inventory />;
      case View.ANALYTICS:
        return <Analytics hubspotStatus={hubspotStatus} />;
      case View.TEAM:
        return <Team onEmployeeAdded={handleEmployeeAdded} />;
      case View.PLAYBOOK:
        return <Playbook setCurrentView={setCurrentView} />;
      case View.SETTINGS:
        return <Settings hubspotStatus={hubspotStatus} setHubspotStatus={setHubspotStatus} />;
      default:
        return <Dashboard setCurrentView={setCurrentView} onAdjustStaffing={handleStaffingAdjustment} />;
    }
  };

  // Suspension Screen Component
  const SuspensionScreen = () => (
    <div className="fixed inset-0 bg-slate-950 z-[9999] flex flex-col items-center justify-center p-6 font-mono text-slate-400 overflow-hidden select-none">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="h-full w-full bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px]"></div>
      </div>
      
      <div className="max-w-2xl w-full bg-slate-900 border border-amber-500/30 rounded-3xl p-12 shadow-[0_0_100px_rgba(245,158,11,0.05)] relative animate-in fade-in zoom-in duration-500">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="bg-amber-600 p-6 rounded-3xl shadow-2xl shadow-amber-600/30 border-4 border-slate-950 flex items-center justify-center">
            <Ban className="w-12 h-12 text-white" />
          </div>
        </div>

        <div className="text-center space-y-8 mt-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter">OPERATIONS SUSPENDED</h1>
            <p className="text-amber-500 text-[10px] font-black uppercase tracking-[0.4em]">Store 5065 Access Restricted</p>
          </div>

          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-left space-y-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-amber-500/20 animate-pulse"></div>
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <Terminal className="w-4 h-4 text-slate-600" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Node Status: Restricted Access</span>
            </div>
            <div className="space-y-2 text-[11px] font-mono leading-relaxed">
              <p><span className="text-amber-500/70">>></span> AUTH_SERVICE: <span className="text-amber-600 font-bold uppercase">Restricted</span></p>
              <p><span className="text-amber-500/70">>></span> SYNC_PIPELINE: <span className="text-amber-600 font-bold uppercase">Paused</span></p>
              <p><span className="text-amber-500/70">>></span> BREEZE_INGRESS: <span className="text-amber-600 font-bold uppercase">Standby</span></p>
              <p className="text-white pt-2 opacity-80 border-t border-slate-800 mt-2 italic">
                "Operational protocol hold active. System services will resume automatically once the restoration sequence completes."
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 relative group overflow-hidden">
               <div className="absolute top-0 right-0 p-1 opacity-20">
                  <Clock className="w-12 h-12 text-amber-500 rotate-12" />
               </div>
               <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1 flex items-center gap-2">
                 Restoration T-Minus
               </p>
               <p className="text-2xl font-black text-white tracking-[0.2em] font-mono">{formatTime(timeLeft)}</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
               <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Authorization</p>
               <p className="text-xl font-black text-amber-500 uppercase">Manager Hold</p>
            </div>
          </div>

          <div className="pt-4 flex flex-col items-center gap-4">
             <div className="flex items-center gap-3 px-6 py-3 bg-amber-950/20 border border-amber-900/30 rounded-xl text-amber-500/80 text-[10px] font-black uppercase tracking-widest">
                <Loader2 className="w-4 h-4 animate-spin" /> System Recalibrating
             </div>
             <button 
              onClick={() => setIsSuspended(false)}
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all border border-slate-700 hover:border-slate-600"
            >
              <Power className="w-4 h-4" /> 
              Admin Bypass
              <div className="absolute inset-0 rounded-2xl bg-white/5 opacity-0 group-active:opacity-100 transition-opacity"></div>
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-12 flex items-center gap-4 text-slate-700">
        <ShieldAlert className="w-5 h-5" />
        <span className="text-xs font-black uppercase tracking-[0.3em]">Sentinel Operational Integrity Frame v3.4.1</span>
      </div>
    </div>
  );

  if (isSuspended) {
    return <SuspensionScreen />;
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} isSuspended={isSuspended} />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={(view) => {
          if (view !== View.OPERATIONS) setOperationsTab('metrics');
          setCurrentView(view);
        }} 
        onLogout={handleLogout}
      />
      <main className="flex-1 ml-64 flex flex-col h-screen relative">
        {renderView()}
        <SentinelAI hubspotStatus={hubspotStatus} />
      </main>
    </div>
  );
};

export default App;
