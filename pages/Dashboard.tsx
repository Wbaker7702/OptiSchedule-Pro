import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CheckCircle2, Clock, ShieldAlert, ShieldCheck, Scale, TrendingUp, Zap, Database, Activity, Terminal, Server, Globe, Lock, RefreshCw, AlertTriangle, Loader2, Fingerprint, Shield } from 'lucide-react';
import { DATE_STRING, FISCAL_METRICS, APP_VERSION, DYNAMICS_365_ROI_DATA, VULNERABILITY_DATA, SYSTEM_HEALTH } from '../constants';

const data = [
  { time: '8 AM', value: 40 },
  { time: '10 AM', value: 65 },
  { time: '12 PM', value: 95 },
  { time: '2 PM', value: 80 },
  { time: '4 PM', value: 110 },
  { time: '6 PM', value: 70 },
  { time: '8 PM', value: 45 },
];

const Dashboard: React.FC = () => {
  const [pulseLogs, setPulseLogs] = useState<{id: number, msg: string, time: string}[]>([]);
  const [complianceScore, setComplianceScore] = useState(90);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [lastOptimized, setLastOptimized] = useState<string | null>(null);
  
  const [subMetrics, setSubMetrics] = useState({
    enforcement: 94,
    sync: 99.8,
    audit: 100
  });

  useEffect(() => {
    const messages = [
      "CRITICAL: Quota Exceeded us-west1",
      "ERROR: RoutesReady=False for optischedule-pro",
      "SENTINEL_AUTH: Verification Front End",
      "D365_INGRESS: Data Packet Validated",
      "LINTER: Breach remediated Pharmacy",
      "SYNC: Sub-millisecond latency locked",
      "SSP: Sentinel Security Frame active",
      "SCAN: 0 Operational Breaches Detected"
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
      msg: "SENTINEL_OPTIMIZE: Hardening all floor protocols...",
      time: startTime
    }, ...prev].slice(0, 5));

    setTimeout(() => {
      const newScore = 99;
      setComplianceScore(newScore);
      setSubMetrics({
        enforcement: 99,
        sync: 100,
        audit: 100
      });
      setLastOptimized(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setIsOptimizing(false);
      
      setPulseLogs(prev => [{
        id: Date.now() + 1,
        msg: `SENTINEL_SUCCESS: Compliance score restored to ${newScore}%`,
        time: new Date().toLocaleTimeString()
      }, ...prev].slice(0, 5));
    }, 2000);
  };

  const circumference = 364.4;
  const offset = circumference - (complianceScore / 100) * circumference;

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
              <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20 shadow-inner group-hover:bg-blue-500/20 transition-all">
                 <ShieldAlert className="w-10 h-10 text-blue-500" />
              </div>
              <div>
                 <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-white font-black text-xl tracking-[0.1em] uppercase">Sentinel Security Mandate</h2>
                    <span className="bg-blue-500 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-[0.2em] animate-pulse">Monitoring</span>
                 </div>
                 <p className="text-slate-400 text-xs font-mono max-w-lg leading-relaxed uppercase">
                    "Execution Leakage" is a breach of policy. Every unallocated labor hour is a digital security failure. The Sentinel Security Policy must be enforced without variance.
                 </p>
              </div>
           </div>

           <div className="flex gap-4 w-full xl:w-auto z-10">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center min-w-[130px]">
                 <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Weekly Leakage</p>
                 <p className="text-xl font-black text-white">${Math.round(FISCAL_METRICS.executionLeakage / 1000)}k</p>
              </div>
              <div className="bg-blue-500/5 p-4 rounded-xl border border-blue-500/20 flex flex-col items-center min-w-[130px]">
                 <p className="text-[9px] text-blue-400 uppercase font-black tracking-widest mb-1">Policy ROI</p>
                 <p className="text-xl font-black text-blue-400">{FISCAL_METRICS.currentROI}x</p>
              </div>
           </div>
        </div>

        {/* System Pulse & Active Vulnerabilities */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard 
              title="Sentinel Health" 
              value={SYSTEM_HEALTH.status}
              trend="Region: us-west1" 
              trendDirection="down" 
              subtitle={`Error: ${SYSTEM_HEALTH.latency}`}
              icon={<ShieldAlert className="w-5 h-5 text-red-500 animate-pulse" />}
            />
            <StatCard 
              title="Compliance Index" 
              value={`${complianceScore}%`} 
              subtitle="Target: 100%"
              icon={<Fingerprint className="w-5 h-5 text-emerald-500" />}
            />
            <StatCard 
              title="Active Vectors" 
              value={VULNERABILITY_DATA.length.toString()} 
              subtitle="Monitoring for Drift"
              icon={<Activity className="w-5 h-5 text-orange-500" />}
            />
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-sm overflow-hidden flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="w-4 h-4 text-blue-500" />
              <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Sentinel Pulse</h3>
            </div>
            <div className="space-y-3 flex-1 overflow-hidden">
               {pulseLogs.map(log => (
                 <div key={log.id} className="animate-in slide-in-from-bottom-1 fade-in duration-300">
                    <p className="text-[9px] font-mono text-slate-400 leading-tight uppercase">
                        <span className="text-blue-500/50">[{log.time}]</span> {log.msg}
                    </p>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Compliance Circle and Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           {/* Charts Section */}
           <div className="lg:col-span-2 bg-slate-900 rounded-2xl shadow-xl border border-slate-800 p-6">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                 <Activity className="w-4 h-4 text-blue-500" />
                 Workforce Integrity Matrix
               </h3>
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

           {/* Sentinel Compliance Card */}
           <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 p-6 space-y-4 flex flex-col">
              <div className="flex justify-between items-start">
                 <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                    <ShieldCheck className={`w-4 h-4 ${complianceScore >= 97 ? 'text-emerald-500' : 'text-amber-500'}`} />
                    Sentinel Status
                 </h3>
              </div>
              
              <div className="flex items-center justify-center py-4 relative">
                 <div className="relative">
                    <svg className="w-32 h-32 transform -rotate-90 transition-all duration-1000">
                       <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-800" />
                       <circle 
                        cx="64" 
                        cy="64" 
                        r="58" 
                        stroke="currentColor" 
                        strokeWidth="10" 
                        fill="transparent" 
                        strokeDasharray={circumference} 
                        strokeDashoffset={offset} 
                        className={`transition-all duration-1000 rounded-full ${complianceScore >= 97 ? 'text-emerald-500' : 'text-blue-500'}`} 
                       />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <span className={`text-2xl font-black tracking-tighter transition-colors duration-1000 ${complianceScore >= 97 ? 'text-white' : 'text-blue-400'}`}>
                          {isOptimizing ? '---' : `${complianceScore}%`}
                       </span>
                       <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Hardened</span>
                    </div>
                 </div>
              </div>

              <div className="space-y-3 pt-2 flex-1">
                 {[
                   {label: "Policy Strength", val: `${subMetrics.enforcement}%`},
                   {label: "Vulnerability Mitigation", val: `100%`},
                   {label: "Audit Integrity", val: `${subMetrics.audit}%`}
                 ].map(item => (
                    <div key={item.label} className="flex justify-between items-center bg-slate-950 p-2 rounded-lg border border-slate-800">
                       <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{item.label}</span>
                       <span className="text-[10px] font-black text-white font-mono">{item.val}</span>
                    </div>
                 ))}
              </div>

              <div className="pt-4 border-t border-slate-800">
                 <button 
                  onClick={handleOptimizeProtocol}
                  disabled={isOptimizing || complianceScore >= 99}
                  className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
                    complianceScore >= 97 
                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 cursor-default' 
                    : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20'
                  }`}
                 >
                   {isOptimizing ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                   {isOptimizing ? 'Hardening Protocol...' : 'Patch Vulnerabilities'}
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;