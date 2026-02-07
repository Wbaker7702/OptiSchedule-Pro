
import React, { useState } from 'react';
import Header from '../components/Header';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { DollarSign, Clock, Target, TrendingUp, ArrowUpRight, ArrowDownRight, Zap, Cloud, Database, ShieldCheck, Filter, Download, ListChecks, Loader2, CheckCircle } from 'lucide-react';
import { FISCAL_METRICS, AZURE_TELEMETRY } from '../constants';

const otTrendData = [
  { day: 'Mon', hours: 14 },
  { day: 'Tue', hours: 12 },
  { day: 'Wed', hours: 18 },
  { day: 'Thu', hours: 9 },
  { day: 'Fri', hours: 6 },
  { day: 'Sat', hours: 4 },
  { day: 'Sun', hours: 2 },
];

const savingsByDept = [
  { name: 'Front End', value: 4200 },
  { name: 'Grocery', value: 3800 },
  { name: 'Electronics', value: 2100 },
  { name: 'Apparel', value: 1500 },
  { name: 'Oversight', value: 900 },
];

const recoveryEvents = [
  { id: 'REC-001', type: 'Overtime Prevention', dept: 'Grocery', savings: '$1,240', time: '2h ago', status: 'Secured' },
  { id: 'REC-002', type: 'HubSpot Loyalty Recapture', dept: 'Front End', savings: '$850', time: '5h ago', status: 'Secured' },
  { id: 'REC-003', type: 'Azure Edge Optimization', dept: 'Inventory', savings: '$2,100', time: '1d ago', status: 'Secured' },
  { id: 'REC-004', type: 'Shift Gap Reconciliation', dept: 'Apparel', savings: '$420', time: '2d ago', status: 'Secured' },
];

const MetricsReport: React.FC = () => {
  const [weeklyRecapture, setWeeklyRecapture] = useState(12500);
  const [totalOT, setTotalOT] = useState(65);
  const [isPivoting, setIsPivoting] = useState(false);
  const [pivotComplete, setPivotComplete] = useState(false);

  const handlePivot = () => {
    setIsPivoting(true);
    setPivotComplete(false);

    // Simulate AI strategy recalibration across Triple-Engine stack
    setTimeout(() => {
      setIsPivoting(false);
      setPivotComplete(true);
      // Show simulated improvement after pivot
      setWeeklyRecapture(prev => prev + 1450);
      setTotalOT(prev => Math.max(0, prev - 4));

      // Reset success state after a few seconds
      setTimeout(() => setPivotComplete(false), 5000);
    }, 2500);
  };

  return (
    <div className="flex-1 bg-slate-950 overflow-auto custom-scrollbar">
      <Header title="Fiscal Performance" subtitle="Recovery Tracking & Recapture Deep-Dive" />

      <div className="p-8 max-w-7xl mx-auto space-y-8 pb-20">
        
        {/* Success Toast */}
        {pivotComplete && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 duration-500">
             <div className="bg-emerald-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-emerald-400">
                <div className="bg-white/20 p-1.5 rounded-full">
                   <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                   <p className="text-xs font-black uppercase tracking-widest">Strategy Pivot Successful</p>
                   <p className="text-[10px] font-mono opacity-80 uppercase">Staffing vectors aligned to traffic surge</p>
                </div>
             </div>
          </div>
        )}
        
        {/* Triple Hero Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {/* Weekly Savings */}
           <div className={`bg-slate-900 rounded-3xl p-8 border border-emerald-500/20 shadow-2xl relative overflow-hidden group transition-all duration-700 ${pivotComplete ? 'scale-[1.02] border-emerald-500/40' : ''}`}>
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                 <DollarSign className="w-32 h-32 text-emerald-500" />
              </div>
              <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                       <TrendingUp className="w-6 h-6 text-emerald-500" />
                    </div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Weekly Recapture</span>
                 </div>
                 <div className="flex items-baseline gap-2">
                    <h2 className="text-4xl font-black text-white transition-all duration-500">${weeklyRecapture.toLocaleString()}</h2>
                    <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                       <ArrowUpRight className="w-3 h-3" /> +12.4%
                    </span>
                 </div>
                 <p className="text-[10px] text-slate-500 font-mono mt-4 uppercase tracking-widest">Mitigated execution leakage</p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
           </div>

           {/* Overtime Hours */}
           <div className={`bg-slate-900 rounded-3xl p-8 border border-amber-500/20 shadow-2xl relative overflow-hidden group transition-all duration-700 ${pivotComplete ? 'scale-[1.02] border-amber-500/40' : ''}`}>
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                 <Clock className="w-32 h-32 text-amber-500" />
              </div>
              <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                       <Clock className="w-6 h-6 text-amber-500" />
                    </div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Overtime Burn</span>
                 </div>
                 <div className="flex items-baseline gap-2">
                    <h2 className="text-4xl font-black text-white transition-all duration-500">{totalOT}h</h2>
                    <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                       <ArrowDownRight className="w-3 h-3" /> -8.2%
                    </span>
                 </div>
                 <p className="text-[10px] text-slate-500 font-mono mt-4 uppercase tracking-widest">Projected total across floor</p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
           </div>

           {/* Annual Recovery Target */}
           <div className="bg-slate-900 rounded-3xl p-8 border border-blue-500/20 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                 <Target className="w-32 h-32 text-blue-500" />
              </div>
              <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                       <Target className="w-6 h-6 text-blue-500" />
                    </div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Recovery Target</span>
                 </div>
                 <div className="flex items-baseline gap-2">
                    <h2 className="text-4xl font-black text-white">${FISCAL_METRICS.annualRecoveryTarget}M</h2>
                    <span className="text-[10px] text-blue-400 font-black ml-2 uppercase">Annual Goal</span>
                 </div>
                 <p className="text-[10px] text-slate-500 font-mono mt-4 uppercase tracking-widest">Projected enterprise recovery</p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
           </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           {/* OT Trend */}
           <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-xl">
              <div className="flex justify-between items-center mb-10">
                 <div>
                    <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                       <TrendingUp className="w-4 h-4 text-amber-500" />
                       Overtime Mitigation Curve
                    </h3>
                    <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase">Post-Sentinel Deployment (Weekly View)</p>
                 </div>
                 <div className="flex gap-2">
                    <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors"><Filter className="w-4 h-4 text-slate-500" /></button>
                 </div>
              </div>
              <div className="h-64">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={otTrendData}>
                       <defs>
                          <linearGradient id="otGradient" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                             <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                       <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b', fontWeight: 'bold'}} />
                       <YAxis hide />
                       <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px'}} />
                       <Area type="monotone" dataKey="hours" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#otGradient)" />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </div>

           {/* Savings Breakdown */}
           <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-xl">
              <div className="flex justify-between items-center mb-10">
                 <div>
                    <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                       <Database className="w-4 h-4 text-emerald-500" />
                       Recapture by Operational Node
                    </h3>
                    <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase">Departmental Fiscal Contribution</p>
                 </div>
                 <button className="text-[9px] font-black text-blue-400 uppercase tracking-widest hover:text-blue-300 transition-colors flex items-center gap-2">
                    Export D365 <Download className="w-3 h-3" />
                 </button>
              </div>
              <div className="h-64">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={savingsByDept} layout="vertical">
                       <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1e293b" />
                       <XAxis type="number" hide />
                       <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#f8fafc', fontWeight: 'bold'}} width={80} />
                       <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{backgroundColor: '#0f172a', border: '1px solid #334155'}} />
                       <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                          {savingsByDept.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#3b82f6'} />
                          ))}
                       </Bar>
                    </BarChart>
                 </ResponsiveContainer>
              </div>
           </div>
        </div>

        {/* Recovery Events Ledger */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
           <div className="p-8 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-blue-600/10 rounded-2xl border border-blue-500/20">
                    <ListChecks className="w-6 h-6 text-blue-500" />
                 </div>
                 <div>
                    <h3 className="text-lg font-black text-white uppercase tracking-tighter">Recapture Ledger</h3>
                    <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mt-1">Audit trail of automated fiscal corrections</p>
                 </div>
              </div>
              <div className="flex gap-4">
                 <div className="flex items-center gap-2 px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl">
                    <Zap className="w-3 h-3 text-[#ff7a59] fill-[#ff7a59]" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Breeze Validated</span>
                 </div>
              </div>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                 <thead>
                    <tr className="bg-slate-950 text-slate-500 uppercase font-black text-[10px] tracking-widest">
                       <th className="px-8 py-5">Event ID</th>
                       <th className="px-8 py-5">Correction Type</th>
                       <th className="px-8 py-5">Node</th>
                       <th className="px-8 py-5">Recaptured Value</th>
                       <th className="px-8 py-5">Status</th>
                       <th className="px-8 py-5 text-right">Handshake</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-800">
                    {recoveryEvents.map((event) => (
                       <tr key={event.id} className="hover:bg-slate-800/40 transition-colors group">
                          <td className="px-8 py-5 text-slate-500">{event.id}</td>
                          <td className="px-8 py-5 text-white font-black">{event.type}</td>
                          <td className="px-8 py-5 text-slate-400">{event.dept}</td>
                          <td className="px-8 py-5 text-emerald-400 font-black">{event.savings}</td>
                          <td className="px-8 py-5">
                             <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500/80">{event.status}</span>
                             </div>
                          </td>
                          <td className="px-8 py-5 text-right">
                             <div className="flex justify-end gap-2">
                                <Cloud className="w-3.5 h-3.5 text-[#0078d4]" />
                                <Zap className="w-3.5 h-3.5 text-[#ff7a59]" />
                                <Database className="w-3.5 h-3.5 text-blue-500" />
                             </div>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

        {/* Intelligence Summary */}
        <div className="bg-[#0078d4]/5 border border-[#0078d4]/20 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <Zap className="w-32 h-32 text-[#ff7a59]" />
           </div>
           <div className="flex items-center gap-6 relative z-10">
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl backdrop-blur-md">
                 <ShieldCheck className="w-8 h-8 text-blue-400" />
              </div>
              <div className="max-w-xl">
                 <h4 className="text-sm font-black text-white uppercase tracking-widest mb-2">Breeze Intelligence Note</h4>
                 <p className="text-xs text-slate-400 leading-relaxed font-mono uppercase tracking-tight">
                    Current trajectory suggests a <span className="text-emerald-400 font-black">15% reduction</span> in unplanned overtime for the next cycle. Azure Edge Vision has stabilized high-volume ingress patterns, decreasing leakage volatility.
                 </p>
              </div>
           </div>
           <button 
            onClick={handlePivot}
            disabled={isPivoting}
            className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl relative z-10 flex items-center gap-3 active:scale-95 ${
              isPivoting 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
                : 'bg-white text-slate-900 hover:bg-slate-100 hover:shadow-white/10'
            }`}
           >
              {isPivoting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Recalibrating Stack
                </>
              ) : (
                <>Execute Strategy Pivot</>
              )}
           </button>
        </div>
      </div>
    </div>
  );
};

export default MetricsReport;
