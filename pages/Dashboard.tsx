
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CheckCircle2, Clock, ShieldAlert, ShieldCheck, Scale, TrendingUp, Zap, Database, Activity, Terminal, Server, Globe, Lock, RefreshCw, AlertTriangle, Loader2, Fingerprint, Shield, Sparkles, Share2, Tag, Check, Info, MapPin } from 'lucide-react';
// Fixed: Removed DYNAMICS_365_ROI_DATA which is not exported from constants.ts
import { DATE_STRING, FISCAL_METRICS, APP_VERSION, VULNERABILITY_DATA, SYSTEM_HEALTH, CURRENT_STATE, LABOR_REGULATIONS } from '../constants';
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

  const reg = LABOR_REGULATIONS[CURRENT_STATE];
  
  useEffect(() => {
    const messages = [
      "SYSTEM_HEALTH: All Nodes Operational",
      `COMPLIANCE: ${reg.state} Labor Rules Active`,
      "D365_INGRESS: Data Packet Validated",
      "BREEZE_SYNC: HubSpot Deal Flow Map Active",
      "SENTINEL: Minor Curfew Guard Active"
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
  }, [reg.state]);

  const handleOptimizeProtocol = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setComplianceScore(100);
      setIsOptimizing(false);
    }, 2000);
  };

  return (
    <div className="flex-1 bg-slate-950 overflow-auto">
      <Header title="Strategic Command Oversight" subtitle={`OptiSchedule Pro ${APP_VERSION} • ${reg.state} Node Active`} />
      
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        
        {/* Sentinel Fiscal & Compliance Section */}
        <div className="bg-slate-900 rounded-2xl p-8 flex flex-col xl:flex-row items-center justify-between shadow-2xl border border-slate-800 gap-8 relative overflow-hidden group">
           <div className="absolute -top-12 -right-12 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-700">
              <ShieldCheck className="w-80 h-80 text-white" />
           </div>

           <div className="flex items-center gap-6 w-full xl:w-auto relative z-10">
              <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 shadow-inner">
                 <MapPin className="w-10 h-10 text-emerald-500" />
              </div>
              <div>
                 <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-white font-black text-xl tracking-[0.1em] uppercase">Jurisdiction: {reg.state}</h2>
                    <span className="bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-[0.2em]">Compliance Verified</span>
                 </div>
                 <p className="text-slate-400 text-xs font-mono max-w-lg leading-relaxed uppercase">
                    Monitoring labor limits for minors (under 18) and adult overtime thresholds per {reg.state} state law.
                 </p>
              </div>
           </div>

           <div className="flex gap-4 w-full xl:w-auto z-10 items-center">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center min-w-[130px]">
                 <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">State Linter</p>
                 <p className="text-xl font-black text-emerald-400">ACTIVE</p>
              </div>
              <button 
                onClick={handleOptimizeProtocol}
                disabled={isOptimizing}
                className="bg-emerald-600 hover:bg-emerald-500 text-white p-4 rounded-xl border border-emerald-500/30 shadow-lg transition-all flex flex-col items-center min-w-[130px] active:scale-[0.98] disabled:opacity-50"
              >
                 <p className="text-[9px] text-emerald-100 uppercase font-black tracking-widest mb-1">
                   Audit Score
                 </p>
                 <div className="flex items-center gap-2">
                    {isOptimizing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Shield className="w-5 h-5" />}
                    <p className="text-xl font-black">{complianceScore}%</p>
                 </div>
              </button>
           </div>
        </div>

        {/* Chart Row */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 bg-slate-900 rounded-2xl shadow-xl border border-slate-800 p-6">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                 <Activity className="w-4 h-4 text-blue-500" />
                 Workforce Integrity Matrix
               </h3>
               <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
                  <ShieldCheck className="w-3 h-3 text-blue-400" />
                  <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">{reg.state} Guard Active</span>
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
                    <Tooltip contentStyle={{backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #334155'}} />
                    <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
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
      </div>
    </div>
  );
};

export default Dashboard;
