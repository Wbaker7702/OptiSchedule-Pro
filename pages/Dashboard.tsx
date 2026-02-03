
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CheckCircle2, Clock, ShieldAlert, ShieldCheck, Scale, TrendingUp, Zap, Database, Activity, Terminal, Server, Globe, Lock, RefreshCw, AlertTriangle, Loader2, Fingerprint, Shield, Sparkles, Share2, Tag, Check, Info } from 'lucide-react';
import { DATE_STRING, FISCAL_METRICS, APP_VERSION, DYNAMICS_365_ROI_DATA, VULNERABILITY_DATA, SYSTEM_HEALTH } from '../constants';
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

interface DashboardProps {
  setCurrentView?: (view: View) => void;
  onAdjustStaffing?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setCurrentView, onAdjustStaffing }) => {
  const [pulseLogs, setPulseLogs] = useState<{id: number, msg: string, time: string}[]>([]);
  const [complianceScore, setComplianceScore] = useState(98);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isBreezeAdjusting, setIsBreezeAdjusting] = useState(false);
  const [lastOptimized, setLastOptimized] = useState<string | null>(null);
  const [showBreezeSuccess, setShowBreezeSuccess] = useState(false);
  
  useEffect(() => {
    const messages = [
      "SYSTEM_HEALTH: All Nodes Operational",
      "SENTINEL_AUTH: Verification Front End Success",
      "D365_INGRESS: Data Packet Validated (12ms)",
      "LINTER: Labor variance check passed 100%",
      "SYNC: Real-time link established",
      "SSP: Operational Integrity Frame active",
      "BREEZE_SYNC: HubSpot Deal Flow Map Active",
      "OPTIMIZER: Overtime Target Reached"
    ];
    
    const interval = setInterval(() => {
      const newLog = {
        id: Date.now(),
        msg: messages[Math.floor(Math.random() * messages.length)],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };
      setPulseLogs(prev => [newLog, ...prev].slice(0, 5));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleOptimizeProtocol = () => {
    setIsOptimizing(true);
    const startTime = new Date().toLocaleTimeString();
    setPulseLogs(prev => [{
      id: Date.now(),
      msg: "SENTINEL_OPTIMIZE: Mitigating labor variance vectors...",
      time: startTime
    }, ...prev].slice(0, 5));

    setTimeout(() => {
      const newScore = 100;
      setComplianceScore(newScore);
      setLastOptimized(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setIsOptimizing(false);
      
      setPulseLogs(prev => [{
        id: Date.now() + 1,
        msg: `SENTINEL_SUCCESS: Operational efficiency restored to ${newScore}%`,
        time: new Date().toLocaleTimeString()
      }, ...prev].slice(0, 5));
    }, 2000);
  };

  const handleBreezeAdjustment = () => {
    setIsBreezeAdjusting(true);
    setPulseLogs(prev => [{
      id: Date.now(),
      msg: "BREEZE_AI: Correlating CRM deal velocity with floor traffic...",
      time: new Date().toLocaleTimeString()
    }, ...prev].slice(0, 5));

    setTimeout(() => {
      if (onAdjustStaffing) onAdjustStaffing();
      setIsBreezeAdjusting(false);
      setShowBreezeSuccess(true);
      setPulseLogs(prev => [{
        id: Date.now() + 1,
        msg: "BREEZE_AI: Labor allocation adjusted to prevent overtime spikes.",
        time: new Date().toLocaleTimeString()
      }, ...prev].slice(0, 5));
      
      setTimeout(() => setShowBreezeSuccess(false), 3000);
    }, 2000);
  };

  return (
    <div className="flex-1 bg-slate-950 overflow-auto">
      <Header title="Strategic Command Oversight" subtitle={`OptiSchedule Pro ${APP_VERSION} • Sentinel Hardened`} />
      
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        
        {/* Sentinel Fiscal Protocol Section */}
        <div className="bg-slate-900 rounded-2xl p-8 flex flex-col xl:flex-row items-center justify-between shadow-2xl border border-slate-800 gap-8 relative overflow-hidden group">
           <div className="absolute -top-12 -right-12 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-700">
              <ShieldCheck className="w-80 h-80 text-white" />
           </div>

           <div className="flex items-center gap-6 w-full xl:w-auto relative z-10">
              <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 shadow-inner group-hover:bg-emerald-500/20 transition-all">
                 <ShieldCheck className="w-10 h-10 text-emerald-500" />
              </div>
              <div>
                 <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-white font-black text-xl tracking-[0.1em] uppercase">Labor Efficiency Mandate</h2>
                    <span className="bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-[0.2em] animate-pulse">Efficiency Active</span>
                 </div>
                 <p className="text-slate-400 text-xs font-mono max-w-lg leading-relaxed uppercase">
                    Labor variance represents the gap between planned and actual spend. Unmanaged overtime is an operational leakage risk.
                 </p>
              </div>
           </div>

           <div className="flex gap-4 w-full xl:w-auto z-10 items-center">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center min-w-[130px]">
                 <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Weekly Variance</p>
                 <p className="text-xl font-black text-white">${Math.round(FISCAL_METRICS.executionLeakage / 1000)}k</p>
              </div>
              <button 
                onClick={handleOptimizeProtocol}
                disabled={isOptimizing}
                className="bg-emerald-600 hover:bg-emerald-500 text-white p-4 rounded-xl border border-emerald-500/30 shadow-lg transition-all flex flex-col items-center min-w-[130px] active:scale-[0.98] disabled:opacity-50"
              >
                 <p className="text-[9px] text-emerald-100 uppercase font-black tracking-widest mb-1">
                   {isOptimizing ? 'Optimizing...' : 'ROI Guard'}
                 </p>
                 <div className="flex items-center gap-2">
                    {isOptimizing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Shield className="w-5 h-5" />}
                    <p className="text-xl font-black">{FISCAL_METRICS.currentROI}x</p>
                 </div>
              </button>
           </div>
        </div>

        {/* System Pulse & Active Vulnerabilities */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard 
              title="System Health" 
              value={SYSTEM_HEALTH.status}
              trend="Region: us-west1" 
              trendDirection="up" 
              subtitle={`Latency: ${SYSTEM_HEALTH.latency}`}
              icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}
            />
            <StatCard 
              title="Efficiency Index" 
              value={`${complianceScore}%`} 
              subtitle="Target: 100%"
              icon={<Fingerprint className="w-5 h-5 text-emerald-500" />}
            />
             <div className="bg-slate-900 p-6 rounded-xl shadow-sm border border-[#ff7a59]/30 relative overflow-hidden group hover:border-[#ff7a59] transition-all">
                <div className="absolute top-0 right-0 p-2 opacity-5">
                    <Sparkles className="w-12 h-12 text-[#ff7a59]" />
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Breeze Forecast</p>
                  <div className="group/info relative cursor-help">
                    <Info className="w-3 h-3 text-slate-600" />
                    <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-slate-800 text-white text-[8px] rounded-lg opacity-0 group-hover/info:opacity-100 transition-opacity z-50 pointer-events-none border border-slate-700 font-mono">
                      BREEZE_INSIGHT: Correlating 4 active HubSpot campaigns with local CRM check-ins. High conversion probability in Zone B. Mitigating unplanned overtime spikes.
                    </div>
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                    <h3 className="text-2xl font-black text-white">+12%</h3>
                    <span className="text-[10px] font-bold text-orange-400 uppercase">Traffic Surge</span>
                </div>
                <p className="text-[9px] text-slate-500 mt-2 font-mono">Deal Volume: HIGH (HubSpot Sync)</p>
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-sm overflow-hidden flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="w-4 h-4 text-emerald-500" />
              <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Operational Pulse</h3>
            </div>
            <div className="space-y-3 flex-1 overflow-hidden">
               {pulseLogs.map(log => (
                 <div key={log.id} className="animate-in slide-in-from-bottom-1 fade-in duration-300">
                    <p className="text-[9px] font-mono text-slate-400 leading-tight uppercase">
                        <span className="text-emerald-500/50">[{log.time}]</span> {log.msg}
                    </p>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Breeze Insight Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 bg-slate-900 rounded-2xl shadow-xl border border-slate-800 p-6">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                 <Activity className="w-4 h-4 text-blue-500" />
                 Workforce Integrity Matrix
               </h3>
               <div className="flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full">
                  <Sparkles className="w-3 h-3 text-orange-400" />
                  <span className="text-[9px] font-black text-orange-400 uppercase tracking-widest">Breeze Enhanced</span>
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
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b', fontWeight: 'bold'}} />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #334155'}}
                    />
                    <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
           </div>

           {/* Breeze Smart-Traffic Card */}
           <div className="bg-[#1c120f] rounded-2xl shadow-xl border border-[#ff7a59]/20 p-8 space-y-6 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Share2 className="w-24 h-24 text-[#ff7a59]" />
              </div>
              <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                     <div className="p-2 bg-[#ff7a59]/20 rounded-lg border border-[#ff7a59]/30">
                        <Sparkles className="w-4 h-4 text-[#ff7a59]" />
                     </div>
                     <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Breeze Intelligence</h3>
                  </div>
                  
                  <div className="space-y-4">
                      <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Deal Surge Probability</p>
                          <div className="flex justify-between items-center">
                              <span className="text-xl font-black text-orange-400">88%</span>
                              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" /> Overtime Protection
                              </span>
                          </div>
                      </div>

                      <div className="space-y-3">
                         <div className="flex items-center justify-between border-b border-white/5 pb-2">
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">CRM Signal Feed</p>
                           <div className="group relative cursor-help">
                              <Info className="w-2.5 h-2.5 text-slate-600" />
                              <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-slate-800 text-white text-[8px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none border border-slate-700 font-mono">
                                HubSpot CRM attributes this surge to 'Spring Surge' leads. Reallocating staff helps avoid unplanned overtime during the 4PM peak.
                              </div>
                           </div>
                         </div>
                         {[
                           { event: "Coupon Code 'S5065' Redemptions (+15)", time: "Just Now" },
                           { event: "Cart Abandonment Re-engagement Win", time: "2m ago" },
                           { event: "Loyalty Platinum: 3 in proximity", time: "5m ago" }
                         ].map((sig, i) => (
                            <div key={i} className="flex gap-3">
                               <Tag className="w-3 h-3 text-[#ff7a59] shrink-0 mt-0.5" />
                               <div>
                                  <p className="text-[10px] font-bold text-orange-100/80 leading-snug">{sig.event}</p>
                                  <p className="text-[8px] font-mono text-[#ff7a59]/60 mt-0.5 uppercase tracking-widest">{sig.time}</p>
                               </div>
                            </div>
                         ))}
                      </div>
                  </div>
              </div>

              <div className="mt-auto pt-6 border-t border-white/5">
                 <button 
                   onClick={handleBreezeAdjustment}
                   disabled={isBreezeAdjusting}
                   className={`w-full py-3 bg-[#ff7a59] text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-orange-500/20 hover:bg-[#ff8f75] transition-all flex items-center justify-center gap-2 disabled:opacity-75 ${showBreezeSuccess ? 'bg-emerald-600' : ''}`}
                 >
                    {isBreezeAdjusting ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : showBreezeSuccess ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <Zap className="w-3 h-3 fill-white" />
                    )}
                    {isBreezeAdjusting ? 'Re-aligning...' : showBreezeSuccess ? 'Overtime Prevented' : 'Adjust Staffing Now'}
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
