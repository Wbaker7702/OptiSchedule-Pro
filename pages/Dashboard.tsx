
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Cloud, Database, Zap, ShieldCheck, Lock, Server, Activity, Bell, ArrowRight, Calendar, Users, Package, Ghost, TrendingUp } from 'lucide-react';
import { View } from '../types';

interface DashboardProps {
  setCurrentView: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setCurrentView }) => {
  // Real-time state metrics
  const [latency, setLatency] = useState(18);
  const [compute, setCompute] = useState(42);
  const [systemLoad, setSystemLoad] = useState([1, 2, 3, 4, 5].map(i => i < 4)); // Array of booleans for load bars
  const [activeCampaigns, setActiveCampaigns] = useState(4);
  const [loyaltyUplift, setLoyaltyUplift] = useState(12.0);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate network fluctuations
      setLatency(prev => Math.max(5, Math.min(150, prev + Math.floor((Math.random() - 0.5) * 10))));
      
      // Simulate compute usage based on a baseline with random spikes
      setCompute(prev => {
        const target = Math.random() > 0.9 ? 85 : 42; // Occasional spike
        const diff = target - prev;
        return Math.max(10, Math.min(100, Math.floor(prev + diff * 0.2 + (Math.random() - 0.5) * 5)));
      });

      // Update system load bars visually
      setSystemLoad(prev => {
        const loadLevel = Math.floor(Math.random() * 5) + 1;
        return [1, 2, 3, 4, 5].map(i => i <= loadLevel);
      });

      // Occasionally update marketing metrics
      if (Math.random() > 0.8) {
        setLoyaltyUplift(prev => parseFloat((prev + (Math.random() - 0.5) * 0.5).toFixed(1)));
        if (Math.random() > 0.95) {
            setActiveCampaigns(prev => (prev === 4 ? 5 : 4));
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const quickActions = [
    { label: 'Schedule Grid', icon: Calendar, view: View.SCHEDULING, color: 'blue', description: 'Optimize workforce shifts' },
    { label: 'Inventory', icon: Package, view: View.INVENTORY, color: 'emerald', description: 'Monitor asset stock levels' },
    { label: 'Ghost Bins', icon: Ghost, view: View.GHOST_INVENTORY, color: 'indigo', description: 'Resolve frozen locations' },
    { label: 'Team Portal', icon: Users, view: View.TEAM, color: 'amber', description: 'Manage personnel registry' },
  ];

  return (
    <div className="flex-1 bg-[#020617] overflow-auto custom-scrollbar font-sans text-slate-200">
      {/* Dynamic Header */}
      <div className="p-8 flex justify-between items-center bg-slate-900/20 backdrop-blur-md border-b border-slate-800/50 sticky top-0 z-20">
        <div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Command Center</h1>
            <p className="text-[10px] text-blue-400 font-mono mt-1 uppercase tracking-[0.3em] font-bold">Node #5065 • Multi-Cloud Synthesis Active</p>
        </div>
        <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">System Load</span>
                <div className="flex gap-1 mt-1 transition-all duration-300">
                    {systemLoad.map((isActive, i) => (
                        <div key={i} className={`w-1 h-3 rounded-full transition-colors duration-500 ${isActive ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]' : 'bg-slate-800'}`}></div>
                    ))}
                </div>
            </div>
            <button className="p-2.5 bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl border border-slate-700/50 transition-all relative group">
                <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#020617] animate-pulse"></span>
            </button>
            <div className="h-10 w-10 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl border border-slate-600/50 flex items-center justify-center text-xs font-black text-white shadow-xl">
                WB
            </div>
        </div>
      </div>
      
      <div className="p-8 max-w-7xl mx-auto space-y-10 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Hardening Phase Status Banner */}
        <div className="bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent rounded-2xl p-6 border border-emerald-500/20 relative overflow-hidden group">
            <div className="absolute -right-8 -top-8 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <ShieldCheck className="w-40 h-40 text-emerald-500" />
            </div>
            <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                <div className="p-4 bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-500/20">
                    <ShieldCheck className="w-8 h-8 text-[#020617]" />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-lg font-black text-white uppercase tracking-tight">Q1 2026 Hardening Phase Active</h2>
                    <p className="text-xs text-emerald-400/80 font-medium mt-1">
                        Sentinel Secure Node Integration • Linter v3.1 Deployed • <span className="font-mono">ENCRYPTED_LINK_ESTABLISHED</span>
                    </p>
                </div>
                <button 
                  onClick={() => setCurrentView(View.PLAYBOOK)}
                  className="px-6 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                >
                    View Security Ops
                </button>
            </div>
        </div>

        {/* Actionable Quick Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action) => (
                <button
                    key={action.label}
                    onClick={() => setCurrentView(action.view)}
                    className="group bg-slate-900/50 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/30 p-6 rounded-3xl transition-all duration-300 text-left relative overflow-hidden shadow-xl"
                >
                    <div className={`p-3 rounded-2xl bg-${action.color}-500/10 border border-${action.color}-500/20 w-fit mb-4 group-hover:scale-110 transition-transform`}>
                        <action.icon className={`w-6 h-6 text-${action.color}-500`} />
                    </div>
                    <h3 className="text-sm font-black text-white uppercase tracking-wider mb-1">{action.label}</h3>
                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed uppercase">{action.description}</p>
                    <div className="mt-4 flex items-center gap-2 text-[9px] font-black text-blue-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                        Enter Node <ArrowRight className="w-3 h-3" />
                    </div>
                </button>
            ))}
        </div>

        {/* System Ingress Feed & Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Azure Cloud Fabric */}
            <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden group transition-all duration-500 hover:border-blue-500/30">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform pointer-events-none">
                    <Cloud className="w-32 h-32 text-blue-500" />
                </div>
                <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/20">
                            <Cloud className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                            <h3 className="text-xs font-black text-white uppercase tracking-[0.15em]">Azure Cloud Fabric</h3>
                            <p className="text-[10px] text-blue-400 font-mono font-bold uppercase">East US 2 • Nominal</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6 mt-auto">
                        <div className="space-y-1 transition-all duration-300">
                            <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Latency</p>
                            <p className={`text-2xl font-black tracking-tighter ${latency > 80 ? 'text-amber-400' : 'text-white'}`}>{latency}<span className="text-xs text-slate-500 ml-1">MS</span></p>
                        </div>
                        <div className="space-y-1 transition-all duration-300">
                            <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Compute</p>
                            <p className={`text-2xl font-black tracking-tighter ${compute > 80 ? 'text-amber-400' : 'text-white'}`}>{compute}<span className="text-xs text-slate-500 ml-1">%</span></p>
                        </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-slate-800">
                         <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-500 tracking-widest">
                            <span>Ingress Velocity</span>
                            <span className="text-blue-400 font-mono flex items-center gap-2">High <Activity className="w-3 h-3 animate-pulse" /></span>
                         </div>
                         <div className="w-full bg-slate-950 h-1.5 mt-3 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-[78%] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                         </div>
                    </div>
                </div>
            </div>

            {/* Dynamics 365 ERP */}
            <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-500">
                 <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform pointer-events-none">
                    <Database className="w-32 h-32 text-emerald-500" />
                </div>
                <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                            <Lock className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div>
                            <h3 className="text-xs font-black text-white uppercase tracking-[0.15em]">Dynamics 365 ERP</h3>
                            <p className="text-[10px] text-emerald-400 font-mono font-bold uppercase">Secure Node • Encrypted</p>
                        </div>
                    </div>
                    
                    <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 mt-auto">
                        <div className="flex justify-between items-end mb-3">
                            <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Execution Leakage</p>
                            <div className="flex items-center gap-1.5">
                                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                                <p className="text-[9px] text-emerald-500 font-black uppercase tracking-widest">Protected</p>
                            </div>
                        </div>
                        <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 w-[98%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                        </div>
                        <p className="text-[8px] text-slate-600 mt-3 font-mono uppercase tracking-tighter animate-pulse">Last Integrity Sync: Live</p>
                    </div>
                </div>
            </div>

            {/* HubSpot Breeze / Live Stream */}
            <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden group hover:border-[#ff7a59]/30 transition-all duration-500">
                <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2.5 bg-[#ff7a59]/10 rounded-xl border border-[#ff7a59]/20">
                            <Zap className="w-5 h-5 text-[#ff7a59]" />
                        </div>
                        <div>
                            <h3 className="text-xs font-black text-white uppercase tracking-[0.15em]">HubSpot Breeze</h3>
                            <p className="text-[10px] text-[#ff7a59] font-mono font-bold uppercase">Ingress Active • Live</p>
                        </div>
                    </div>
                    
                    <div className="flex-1 space-y-3">
                        <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/50 flex items-center justify-between transition-colors">
                            <span className="text-[9px] text-slate-500 font-black uppercase">Active Campaigns</span>
                            <span className="text-xs font-black text-white transition-all">{activeCampaigns} Active</span>
                        </div>
                        <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/50 flex items-center justify-between transition-colors">
                            <span className="text-[9px] text-slate-500 font-black uppercase">Loyalty Signal</span>
                            <span className={`text-xs font-black transition-colors ${loyaltyUplift > 11.5 ? 'text-emerald-400' : 'text-amber-400'}`}>+{loyaltyUplift}% Uplift</span>
                        </div>
                        <div className="p-3 bg-[#ff7a59]/5 rounded-xl border border-[#ff7a59]/10 flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-[#ff7a59] animate-pulse shadow-[0_0_8px_rgba(255,122,89,0.6)]"></div>
                            <p className="text-[9px] text-[#ff7a59] font-black uppercase tracking-widest">Campaign Delta Sync Enabled</p>
                        </div>
                    </div>

                    <button 
                        onClick={() => setCurrentView(View.ANALYTICS)}
                        className="mt-6 w-full py-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[9px] font-black text-slate-400 hover:text-white uppercase tracking-[0.2em] rounded-xl transition-all"
                    >
                        Detailed Fiscal Stream
                    </button>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
