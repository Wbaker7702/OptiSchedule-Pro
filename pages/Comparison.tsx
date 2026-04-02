
import React, { useState } from 'react';
import Header from '../components/Header';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Globe, Activity, Scale, CheckCircle2, RefreshCw, ShieldCheck, AlertCircle } from 'lucide-react';
import { STORE_NUMBER, COMPARISON_STORE, LABOR_REGULATIONS, CURRENT_STATE } from '../constants';

const initialChartData = [
  { hour: '8 AM', store5065: 45, store2080: 38 },
  { hour: '10 AM', store5065: 65, store2080: 72 },
  { hour: '12 PM', store5065: 95, store2080: 88 },
  { hour: '2 PM', store5065: 80, store2080: 95 },
  { hour: '4 PM', store5065: 110, store2080: 105 },
  { hour: '6 PM', store5065: 70, store2080: 82 },
  { hour: '8 PM', store5065: 45, store2080: 50 },
  { hour: '10 PM', store5065: 30, store2080: 40 },
];

const strategyComparison = [
  { sector: 'Front End', s5065: 'Fixed Shift (8hr)', s2080: 'Dynamic Flex (4-6hr)', recommendation: 'Deploy Flex Model' },
  { sector: 'Inventory', s5065: 'Daily Audit', s2080: 'Microsoft Sentinel Real-time', recommendation: 'Upgrade Node Ingress' },
  { sector: 'Overtime', s5065: 'Manager Override', s2080: 'Breeze Predictive', recommendation: 'Automate OT Mitigation' },
  { sector: 'Minor Compliance', s5065: 'Manual Tracking', s2080: 'Automated Curfew Guard', recommendation: 'Apply MI Policy 432' },
];

const Comparison: React.FC = () => {
  const [chartData, setChartData] = useState(initialChartData);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncPhase, setSyncPhase] = useState('Initializing');
  const [isApplied, setIsApplied] = useState(false);

  const reg = LABOR_REGULATIONS[CURRENT_STATE];

  const handleApplyBaseline = () => {
    setIsSyncing(true);
    setSyncProgress(0);
    setSyncPhase('Initializing Handshake...');
    
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev < 30) setSyncPhase('Mapping Fiscal Data...');
        else if (prev < 60) setSyncPhase(`Applying ${reg.state} Labor Linter...`);
        else if (prev < 90) setSyncPhase('Validating Minor Curfew Frames...');
        else setSyncPhase('Finalizing Optimization...');

        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    setTimeout(() => {
      const optimizedData = chartData.map(d => ({
        ...d,
        store5065: Math.round((d.store5065 + d.store2080) / 2)
      }));
      setChartData(optimizedData);
      setIsSyncing(false);
      setIsApplied(true);
    }, 3000);
  };

  return (
    <div className="flex-1 bg-slate-950 overflow-auto custom-scrollbar">
      <Header 
        title="Market Comparison Analysis" 
        subtitle={`Benchmarking: Store #${STORE_NUMBER} (${reg.state}) vs Store #${COMPARISON_STORE}`} 
      />

      {isSyncing && (
        <div className="fixed inset-0 z-[60] bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center text-center p-8">
           <div className="w-24 h-24 mb-6 relative">
             <RefreshCw className="w-24 h-24 text-blue-500 animate-spin opacity-20" />
             <div className="absolute inset-0 flex items-center justify-center">
               <ShieldCheck className="w-10 h-10 text-emerald-400 animate-pulse" />
             </div>
           </div>
           <h3 className="text-xl font-black text-white uppercase tracking-[0.2em] mb-2">Syncing Global Compliance</h3>
           <p className="text-xs text-slate-500 font-mono mb-8 uppercase tracking-widest">{syncPhase}</p>
           <div className="w-full max-w-md bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
             <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${syncProgress}%` }}></div>
           </div>
           <p className="text-[10px] text-blue-400 font-mono mt-4 font-black uppercase tracking-widest">{syncProgress}% SECURE</p>
        </div>
      )}

      <div className="p-8 max-w-7xl mx-auto space-y-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group">
            <div className="flex justify-between items-start">
               <div>
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded">Baseline: {reg.state}</span>
                  <h3 className="text-2xl font-black text-white mt-2">Store #{STORE_NUMBER}</h3>
               </div>
               <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-500">
                  <Activity className="w-5 h-5" />
               </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
               <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Minor Curfew</p>
                  <p className="text-sm font-black text-orange-400">{reg.curfewMinor1617}</p>
               </div>
               <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Max Minor Shift</p>
                  <p className="text-sm font-black text-emerald-400">{reg.maxShiftMinor1617}h</p>
               </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group border-orange-500/20">
            <div className="flex justify-between items-start">
               <div>
                  <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest bg-orange-500/10 px-2 py-0.5 rounded">Benchmark Node</span>
                  <h3 className="text-2xl font-black text-white mt-2">Store #{COMPARISON_STORE}</h3>
               </div>
               <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-orange-500">
                  <Globe className="w-5 h-5" />
               </div>
            </div>
            <div className="mt-6 flex items-center gap-3 p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl">
               <AlertCircle className="w-5 h-5 text-orange-400 shrink-0" />
               <p className="text-[10px] text-slate-300 font-mono leading-relaxed">
                  Store 2080 currently utilizes <span className="text-orange-400 font-bold">Automated Curfew Triggers</span> for 16-17 year old associates, reducing legal exposure by 94%.
               </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-8">
             <div>
                <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                  <Activity className="w-4 h-4 text-blue-500" />
                  Staffing Compliance Divergence
                </h4>
                <p className="text-[10px] text-slate-500 font-mono mt-1">Mirroring Store 2080 efficiency within {reg.state} regulations.</p>
             </div>
             <button 
                onClick={handleApplyBaseline}
                disabled={isApplied}
                className={`text-[10px] font-black uppercase tracking-widest transition-all py-3 px-6 rounded-xl flex items-center gap-3 ${isApplied ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-xl shadow-blue-600/20'}`}
              >
                {isApplied ? <><CheckCircle2 className="w-4 h-4" /> Policy Mirrored</> : <><RefreshCw className="w-4 h-4" /> Apply Global Baseline</>}
              </button>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="color5065" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 700}} />
                <YAxis hide />
                <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px'}} />
                <Area type="monotone" dataKey="store5065" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#color5065)" name="Store 5065 (Compliance Mode)" />
                <Area type="monotone" dataKey="store2080" stroke="#f97316" strokeDasharray="5 5" strokeWidth={1} fill="none" name="Store 2080 Baseline" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
           <div className="p-6 border-b border-slate-800 bg-slate-900/50">
              <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                 <Scale className="w-4 h-4 text-blue-500" />
                 Jurisdictional Policy Mapping
              </h4>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] font-mono">
                 <thead className="bg-slate-950 text-slate-500 uppercase font-black">
                    <tr>
                       <th className="px-8 py-4">Operational Sector</th>
                       <th className="px-8 py-4">#5065 Protocol</th>
                       <th className="px-8 py-4">#2080 Frame</th>
                       <th className="px-8 py-4 text-right">Legal Risk</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-800">
                    {strategyComparison.map((row, i) => (
                       <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                          <td className="px-8 py-4 text-white font-black">{row.sector}</td>
                          <td className="px-8 py-4 text-slate-400">{isApplied ? row.s2080 : row.s5065}</td>
                          <td className="px-8 py-4 text-orange-400 font-bold">{row.s2080}</td>
                          <td className="px-8 py-4 text-right">
                             <span className={`px-2 py-1 rounded text-[9px] font-black uppercase ${isApplied ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                {isApplied ? 'Nominal' : 'Elevated'}
                             </span>
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

export default Comparison;
