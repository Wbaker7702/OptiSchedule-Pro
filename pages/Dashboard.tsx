
import React, { useMemo } from 'react';
import Header from '../components/Header';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Line, ComposedChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, Users, AlertTriangle, Clock, Store, Activity, Target, ShieldCheck, DollarSign, AlertOctagon } from 'lucide-react';
import { STORE_PERFORMANCE_DATA, REVENUE_RECOVERY_DATA, WEEKLY_REVENUE_TARGET, TARGET_LABOR_PCT, TARGET_SPLH } from '../constants';
import { View } from '../types';

const Dashboard: React.FC<{ setCurrentView?: (view: View) => void }> = () => {
  
  // Logic Implementation from User Prompt
  const calculateRevenueImpact = (weeklySales: number, actualLaborPct: number, totalHours: number) => {
    // 1. Margin Recapture (Direct Savings)
    const laborVariance = actualLaborPct - TARGET_LABOR_PCT;
    const marginLost = laborVariance > 0 ? weeklySales * laborVariance : 0;
    
    // 2. Sales Velocity Gap (Opportunity Cost)
    const actualSPLH = weeklySales / totalHours;
    const splhGap = TARGET_SPLH - actualSPLH;
    const revenueOpportunity = splhGap > 0 ? splhGap * totalHours : 0;

    return {
      marginLost,
      revenueOpportunity,
      totalValueAtRisk: marginLost + revenueOpportunity,
      marginStatus: laborVariance > 0 ? `CRITICAL: $${marginLost.toLocaleString(undefined, {minimumFractionDigits: 2})} margin leakage` : "Green: Labor cost within target",
      velocityStatus: splhGap > 0 ? `Opportunity: Efficiency gap costing approx $${revenueOpportunity.toLocaleString(undefined, {minimumFractionDigits: 2})}` : "Green: Velocity optimized"
    };
  };

  // Demo Values
  const WEEKLY_SALES_REALIZED = 82450;
  const ACTUAL_LABOR_PCT = 0.185; // 18.5%
  const TOTAL_HOURS = 600; // Demo Hours for calculation

  const impact = useMemo(() => calculateRevenueImpact(WEEKLY_SALES_REALIZED, ACTUAL_LABOR_PCT, TOTAL_HOURS), []);

  return (
    <div className="flex-1 bg-[#020617] overflow-auto custom-scrollbar font-sans text-slate-200">
      <Header title="Dashboard" subtitle="Workforce optimization overview — Feb 15, 2026" />
      
      <div className="p-8 max-w-7xl mx-auto space-y-8 pb-24">
        
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-800 relative overflow-hidden group hover:border-slate-700 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                <Activity className="w-24 h-24 text-emerald-500" />
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Labor Efficiency</p>
            <div className="flex items-center gap-3 relative z-10">
              <h2 className="text-4xl font-black text-white">94.2%</h2>
              <span className="flex items-center text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-full">
                <TrendingUp className="w-3 h-3 mr-1" /> 2.1%
              </span>
            </div>
            <p className="text-[10px] text-slate-600 font-mono mt-2 uppercase tracking-wide">Target: 92.0%</p>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-800 relative overflow-hidden group hover:border-slate-700 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-24 h-24 text-amber-500" />
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Shrink Rate</p>
            <div className="flex items-center gap-3 relative z-10">
              <h2 className="text-4xl font-black text-white">1.8%</h2>
              <span className="flex items-center text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-full">
                <TrendingDown className="w-3 h-3 mr-1" /> 0.3%
              </span>
            </div>
            <p className="text-[10px] text-slate-600 font-mono mt-2 uppercase tracking-wide">Target: &lt; 2.0%</p>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-800 relative overflow-hidden group hover:border-slate-700 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                <Target className="w-24 h-24 text-blue-500" />
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Schedule Adherence</p>
            <div className="flex items-center gap-3 relative z-10">
              <h2 className="text-4xl font-black text-white">91.7%</h2>
              <span className="flex items-center text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-full">
                <TrendingUp className="w-3 h-3 mr-1" /> 1.5%
              </span>
            </div>
             <p className="text-[10px] text-slate-600 font-mono mt-2 uppercase tracking-wide">Deviation: -12m avg</p>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-800 hover:border-slate-700 transition-colors">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Compliance Risk</p>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-black text-white">Low</h2>
              <span className="flex items-center text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-full">
                 <ShieldCheck className="w-3 h-3 mr-1" /> Secure
              </span>
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-800 hover:border-slate-700 transition-colors">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Overtime Hours</p>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-black text-white">342 hrs</h2>
              <span className="flex items-center text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-full">
                <TrendingDown className="w-3 h-3 mr-1" /> 8.2%
              </span>
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-800 hover:border-slate-700 transition-colors">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Active Stores</p>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-black text-white">47</h2>
              <span className="flex items-center text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-full">
                <TrendingUp className="w-3 h-3 mr-1" /> 2%
              </span>
            </div>
          </div>

        </div>

        {/* Revenue Recovery Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-slate-900 p-8 rounded-2xl shadow-lg border border-slate-800">
            <div className="mb-8 flex items-end justify-between">
              <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                      Revenue Recovery "Burn Down"
                  </h3>
                  <p className="text-[10px] text-slate-500 font-mono uppercase mt-1">Weekly Execution Gap Analysis</p>
              </div>
              <div className="flex gap-4">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                      <div className="w-2 h-2 rounded-full bg-slate-600"></div> Perfect Execution ($90k)
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Realized Revenue
                  </div>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={REVENUE_RECOVERY_DATA}>
                  <defs>
                    <linearGradient id="colorRealized" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 700}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 700}} />
                  <Tooltip 
                    contentStyle={{backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)'}} 
                    itemStyle={{fontSize: '12px', fontWeight: 'bold', color: '#e2e8f0'}}
                  />
                  {/* Perfect Execution as a Grey/Ghost Area representing Potential */}
                  <Area type="monotone" dataKey="target" stroke="#475569" strokeDasharray="5 5" fill="#1e293b" fillOpacity={0.5} name="Perfect Execution" />
                  {/* Realized as a vibrant Area */}
                  <Area type="monotone" dataKey="realized" stroke="#10b981" strokeWidth={3} fill="url(#colorRealized)" name="Realized Revenue" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
             {/* AI Insight Card */}
             <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Target className="w-32 h-32 text-indigo-500" />
                </div>
                <div className="relative z-10">
                   <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Activity className="w-4 h-4" /> AI Insight
                   </h3>
                   <div className="text-2xl font-black text-white mb-2">
                      ${impact.totalValueAtRisk.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}
                   </div>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-6">Total Value At Risk</p>
                   
                   <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-[10px] text-slate-300 leading-relaxed font-mono">
                      "We are leaving <span className="text-red-400 font-bold">${Math.round(impact.marginLost)}</span> in direct labor costs and <span className="text-amber-400 font-bold">${Math.round(impact.revenueOpportunity).toLocaleString()}</span> in potential sales velocity on the table this week."
                   </div>
                </div>
             </div>

             {/* Alert Box */}
             {impact.totalValueAtRisk > 1000 && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 shadow-xl flex items-start gap-4">
                   <AlertOctagon className="w-8 h-8 text-red-500 shrink-0" />
                   <div>
                      <h4 className="text-sm font-black text-white uppercase tracking-widest mb-1">High Priority Alert</h4>
                      <p className="text-[10px] text-red-200 font-medium leading-relaxed">
                         Revenue gap exceeds $1,000 threshold. Immediate schedule optimization recommended to recapture velocity.
                      </p>
                      <button 
                        onClick={() => setCurrentView?.(View.SCHEDULING)}
                        className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all shadow-lg shadow-red-600/20"
                      >
                         Trigger Auto-Fix
                      </button>
                   </div>
                </div>
             )}
          </div>
        </div>

        {/* Store Performance Table */}
        <div className="bg-slate-900 rounded-2xl shadow-lg border border-slate-800 overflow-hidden">
          <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
             <div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <Store className="w-4 h-4 text-blue-500" />
                    Store Performance
                </h3>
             </div>
             <button className="text-[10px] font-black text-blue-400 uppercase tracking-widest hover:text-white transition-colors">View All Nodes</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-950 text-slate-500 font-black uppercase tracking-widest text-[9px]">
                <tr>
                  <th className="px-6 py-4">Store Node</th>
                  <th className="px-6 py-4 text-center">Labor Eff.</th>
                  <th className="px-6 py-4 text-center">Shrink</th>
                  <th className="px-6 py-4 text-right">Adherence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-sm font-mono">
                {STORE_PERFORMANCE_DATA.map((store) => (
                  <tr key={store.id} className="hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-4 font-bold text-white group-hover:text-blue-400 transition-colors">
                      {store.name}
                    </td>
                    <td className="px-6 py-4 text-center text-slate-400">
                      <span className={`px-2 py-1 rounded-md ${store.laborEfficiency > 90 ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'}`}>
                         {store.laborEfficiency}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-slate-400">
                      {store.shrinkRate}%
                    </td>
                    <td className="px-6 py-4 text-right text-slate-400">
                      {store.adherence}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
