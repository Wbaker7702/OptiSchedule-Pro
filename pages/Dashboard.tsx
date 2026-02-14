
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CheckCircle2, ShieldCheck, Activity, Terminal, Server, Globe, Lock, Loader2, Shield, Cloud, Database, Zap, Cpu, Network, Target, Flag, TrendingUp, ChevronRight, Binary, Rocket, Brain, Layers, Milestone } from 'lucide-react';
import { DATE_STRING, FISCAL_METRICS, APP_VERSION, SYSTEM_HEALTH, CURRENT_STATE, LABOR_REGULATIONS, AZURE_TELEMETRY } from '../constants';
import { View } from '../types';

const data = [
  { time: '8 AM', value: 40 },
  { time: '10 AM', value: 65 },
  { time: '12 PM', value: 95 },
  { time: '2 PM', value: 80 },
  { time: '4 PM', value: 110 },
  { time: '6 PM', value: 70 },
  { time: '8 PM', value: 45 },
];

const Dashboard: React.FC<{ setCurrentView?: (view: View) => void }> = () => {
  const [pulseLogs, setPulseLogs] = useState<{id: number, msg: string, time: string}[]>([]);
  
  useEffect(() => {
    const messages = [
      "AZURE_COMPUTE: East US 2 Node Nominal",
      "D365_INGRESS: ERP Handshake Secure",
      "BREEZE_SYNC: HubSpot Campaign Delta Processed",
      "SENTINEL: Edge Vision Latency 14ms",
      "CLOUD_FABRIC: High Availability Mode Active",
      "SECURE_NODE: Execution Leakage Audit - Clean",
      "HARDENING: Q1 2026 Protocols Active"
    ];
    
    const interval = setInterval(() => {
      const newLog = {
        id: Date.now(),
        msg: messages[Math.floor(Math.random() * messages.length)],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };
      setPulseLogs(prev => [newLog, ...prev].slice(0, 5));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 bg-slate-950 overflow-auto custom-scrollbar font-mono">
      <Header title="Strategic Command" subtitle={`Node #5065 • Triple-Engine Integration Active`} />
      
      <div className="p-8 max-w-7xl mx-auto space-y-8 pb-24">

        {/* Hardening Phase Banner */}
        <div className="bg-slate-900 border-l-4 border-emerald-500 p-4 rounded-r-xl flex items-center justify-between shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none animate-pulse"></div>
            <div className="flex items-center gap-4 relative z-10">
                <div className="p-2 bg-slate-950 rounded-lg border border-emerald-500/30">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                    <h3 className="text-xs font-black text-white uppercase tracking-widest">Q1 2026 Hardening Phase Active</h3>
                    <p className="text-[10px] text-emerald-400 font-mono">Sentinel Secure Node Integration • Linter v3.1 Deployed</p>
                </div>
            </div>
            <div className="flex items-center gap-2 relative z-10 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                <Lock className="w-3 h-3 text-slate-400" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Infrastructure Hardened</span>
            </div>
        </div>
        
        {/* Triple Node Status Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           {/* Azure Cloud Fabric Card */}
           <div className="bg-slate-900 rounded-2xl p-6 border border-[#0078d4]/30 shadow-2xl relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
                 <Cloud className="w-24 h-24 text-[#0078d4]" />
              </div>
              <div className="flex items-center gap-4 mb-4">
                 <div className="p-2 bg-[#0078d4]/10 rounded-lg border border-[#0078d4]/20">
                    <Cloud className="w-5 h-5 text-[#0078d4]" />
                 </div>
                 <div>
                    <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Azure Cloud Fabric</h3>
                    <p className="text-xs font-mono text-[#0078d4] font-bold">East US 2 • Nominal</p>
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                 <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                    <p className="text-[8px] text-slate-500 uppercase font-black">Latency</p>
                    <p className="text-xs font-bold text-white">{AZURE_TELEMETRY.latency}</p>
                 </div>
                 <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                    <p className="text-[8px] text-slate-500 uppercase font-black">Compute</p>
                    <p className="text-xs font-bold text-white">{AZURE_TELEMETRY.computeUsage}</p>
                 </div>
              </div>
           </div>

           {/* Dynamics 365 ERP Card */}
           <div className="bg-slate-900 rounded-2xl p-6 border border-emerald-500/30 shadow-2xl relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
                 <Database className="w-24 h-24 text-emerald-500" />
              </div>
              <div className="flex items-center gap-4 mb-4">
                 <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                    <Lock className="w-5 h-5 text-emerald-500" />
                 </div>
                 <div>
                    <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Dynamics 365 ERP</h3>
                    <p className="text-xs font-mono text-emerald-500 font-bold">Secure Node • Encrypted</p>
                 </div>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                 <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-500">Execution Leakage</span>
                    <span className="text-emerald-500">Protected</span>
                 </div>
                 <div className="w-full bg-slate-900 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[98%] shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                 </div>
              </div>
           </div>

           {/* HubSpot Breeze Card */}
           <div className="bg-slate-900 rounded-2xl p-6 border border-[#ff7a59]/30 shadow-2xl relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
                 <Zap className="w-24 h-24 text-[#ff7a59]" />
              </div>
              <div className="flex items-center gap-4 mb-4">
                 <div className="p-2 bg-[#ff7a59]/10 rounded-lg border border-[#ff7a59]/20">
                    <Zap className="w-5 h-5 text-[#ff7a59]" />
                 </div>
                 <div>
                    <h3 className="text-[10px] font-black text-white uppercase tracking-widest">HubSpot Breeze</h3>
                    <p className="text-xs font-mono text-[#ff7a59] font-bold">Ingress Active • Live</p>
                 </div>
              </div>
              <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                 <span className="text-[9px] font-black text-white uppercase tracking-widest">Campaign Delta Stream Enabled</span>
              </div>
           </div>
        </div>

        {/* Sentinel Strategic Roadmap Section */}
        <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
           <div className="flex justify-between items-center mb-12">
              <div>
                 <h2 className="text-xl font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                    <Milestone className="w-5 h-5 text-blue-400" />
                    Sentinel Strategic Roadmap
                 </h2>
                 <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase tracking-widest">Platform Evolution Framework • 2025–2028</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full">
                 <Target className="w-4 h-4 text-blue-400" />
                 <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Vision Aligned</span>
              </div>
           </div>

           <div className="relative">
              {/* Timeline Connector Line */}
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2 hidden lg:block" />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
                 {/* 2025 Milestone */}
                 <div className="space-y-6 group">
                    <div className="flex flex-col items-center lg:items-start">
                       <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-600/30 group-hover:scale-110 transition-transform">25</div>
                       <div className="mt-4 text-center lg:text-left">
                          <h4 className="text-sm font-black text-white uppercase tracking-widest">Operational Genesis</h4>
                          <p className="text-[9px] text-blue-400 font-mono uppercase font-black mt-1">Triple-Engine Stabilization</p>
                       </div>
                    </div>
                    <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 group-hover:border-blue-500/50 transition-colors">
                       <ul className="space-y-3 text-[10px] text-slate-400 font-mono uppercase tracking-tight">
                          <li className="flex gap-2"><div className="w-1 h-1 rounded-full bg-blue-500 mt-1.5" /> Full MI Labor Linter integration</li>
                          <li className="flex gap-2"><div className="w-1 h-1 rounded-full bg-blue-500 mt-1.5" /> HubSpot Breeze Signal sync</li>
                          <li className="flex gap-2"><div className="w-1 h-1 rounded-full bg-blue-500 mt-1.5" /> D365 Fiscal Ledger handshake</li>
                       </ul>
                    </div>
                 </div>

                 {/* 2028 Milestone */}
                 <div className="space-y-6 group">
                    <div className="flex flex-col items-center lg:items-start">
                       <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-emerald-600/30 group-hover:scale-110 transition-transform">28</div>
                       <div className="mt-4 text-center lg:text-left">
                          <h4 className="text-sm font-black text-white uppercase tracking-widest">Vision 2028</h4>
                          <p className="text-[9px] text-emerald-400 font-mono uppercase font-black mt-1">Predictive Autonomy</p>
                       </div>
                    </div>
                    <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 group-hover:border-emerald-500/50 transition-colors">
                       <ul className="space-y-3 text-[10px] text-slate-400 font-mono uppercase tracking-tight">
                          <li className="flex gap-2"><div className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5" /> $491M Enterprise Value Recapture</li>
                          <li className="flex gap-2"><div className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5" /> Edge-to-Edge Store Syncing</li>
                          <li className="flex gap-2"><div className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5" /> Autonomous Labor Redirection</li>
                       </ul>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Efficiency Chart & Live Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           <div className="lg:col-span-8 bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                 <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    Real-time Efficiency Velocity
                 </h3>
                 <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Breeze Stream Active</span>
                 </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 700}} />
                    <YAxis hide />
                    <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px'}} />
                    <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </div>

           <div className="lg:col-span-4 space-y-4">
              <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 h-full">
                 <h3 className="text-[10px] font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Binary className="w-4 h-4 text-blue-500" />
                    Sentinel Trace Logs
                 </h3>
                 <div className="space-y-4">
                    {pulseLogs.map(log => (
                       <div key={log.id} className="group flex items-start gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors cursor-default">
                          <Terminal className="w-3 h-3 text-blue-500 mt-1 shrink-0" />
                          <div className="flex-1 overflow-hidden">
                             <p className="text-[9px] text-slate-300 font-mono leading-tight truncate uppercase">{log.msg}</p>
                             <p className="text-[8px] text-slate-600 mt-1 font-mono">{log.time}</p>
                          </div>
                       </div>
                    ))}
                    {pulseLogs.length === 0 && <p className="text-[10px] text-slate-700 italic">Initializing Trace Handshake...</p>}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
