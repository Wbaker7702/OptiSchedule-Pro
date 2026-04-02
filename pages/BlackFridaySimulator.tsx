
import React, { useState, useMemo } from 'react';
import Header from '../components/Header';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell } from 'recharts';
import { Zap, AlertTriangle, TrendingUp, Users, Clock, DollarSign, Play, RotateCcw, ShieldAlert } from 'lucide-react';

const SCENARIOS = [
  { id: 'doorbuster', name: 'Door Buster (06:00 - 09:00)', trafficMultiplier: 4.5, staffingGap: -12 },
  { id: 'midday', name: 'Mid-Day Surge (11:00 - 14:00)', trafficMultiplier: 2.8, staffingGap: -4 },
  { id: 'evening', name: 'Evening Rush (17:00 - 20:00)', trafficMultiplier: 3.2, staffingGap: -8 },
];

const BlackFridaySimulator: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState(SCENARIOS[0]);
  const [progress, setProgress] = useState(0);

  const simulationData = useMemo(() => {
    const base = [
      { time: '00:00', traffic: 10, capacity: 20 },
      { time: '02:00', traffic: 15, capacity: 20 },
      { time: '04:00', traffic: 40, capacity: 30 },
      { time: '06:00', traffic: 180, capacity: 50 },
      { time: '08:00', traffic: 220, capacity: 60 },
      { time: '10:00', traffic: 150, capacity: 70 },
      { time: '12:00', traffic: 190, capacity: 80 },
      { time: '14:00', traffic: 160, capacity: 80 },
      { time: '16:00', traffic: 140, capacity: 70 },
      { time: '18:00', traffic: 200, capacity: 60 },
      { time: '20:00', traffic: 120, capacity: 50 },
      { time: '22:00', traffic: 60, capacity: 30 },
    ];

    return base.map(d => ({
      ...d,
      traffic: Math.round(d.traffic * (isRunning ? selectedScenario.trafficMultiplier : 1)),
      risk: Math.max(0, Math.round(d.traffic * (isRunning ? selectedScenario.trafficMultiplier : 1)) - d.capacity * 2)
    }));
  }, [isRunning, selectedScenario]);

  const runSimulation = () => {
    setIsRunning(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setProgress(0);
  };

  const stats = isRunning ? {
    salesAtRisk: `$${(selectedScenario.trafficMultiplier * 12450).toLocaleString()}`,
    avgWaitTime: `${Math.round(selectedScenario.trafficMultiplier * 8)} min`,
    staffingDeficit: `${Math.abs(selectedScenario.staffingGap)} FTEs`,
    stressLevel: selectedScenario.trafficMultiplier > 4 ? 'CRITICAL' : 'HIGH'
  } : {
    salesAtRisk: '$0',
    avgWaitTime: '2 min',
    staffingDeficit: '0',
    stressLevel: 'OPTIMAL'
  };

  return (
    <div className="flex-1 bg-[#020617] overflow-auto custom-scrollbar font-sans text-slate-200">
      <Header title="Black Friday Simulator" subtitle="Stress-test workforce capacity against extreme demand spikes" />

      <div className="p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Control Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-wrap gap-3">
              {SCENARIOS.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedScenario(s)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                    selectedScenario.id === s.id 
                      ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400' 
                      : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={resetSimulation}
                className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-500 hover:text-white transition-colors"
                title="Reset"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <button
                onClick={runSimulation}
                disabled={isRunning && progress < 100}
                className={`flex items-center gap-3 px-8 py-3 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg ${
                  isRunning && progress < 100 
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20 active:scale-95'
                }`}
              >
                <Play className="w-4 h-4 fill-white" />
                {isRunning ? 'Re-Run Simulation' : 'Execute Simulation'}
              </button>
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col justify-center">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Simulation Progress</p>
            <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div 
                className="h-full bg-indigo-500 transition-all duration-300" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 font-mono mt-2 uppercase text-right">{progress}% Complete</p>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/20">
                <DollarSign className="w-4 h-4 text-red-500" />
              </div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sales at Risk</p>
            </div>
            <h2 className="text-3xl font-black text-white">{stats.salesAtRisk}</h2>
            <p className="text-[10px] text-slate-600 font-mono mt-1 uppercase">Due to abandonment</p>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Avg Wait Time</p>
            </div>
            <h2 className="text-3xl font-black text-white">{stats.avgWaitTime}</h2>
            <p className="text-[10px] text-slate-600 font-mono mt-1 uppercase">Projected peak</p>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                <Users className="w-4 h-4 text-indigo-500" />
              </div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Staffing Deficit</p>
            </div>
            <h2 className="text-3xl font-black text-white">{stats.staffingDeficit}</h2>
            <p className="text-[10px] text-slate-600 font-mono mt-1 uppercase">Required vs Scheduled</p>
          </div>

          <div className={`bg-slate-900 p-6 rounded-2xl border transition-colors ${
            stats.stressLevel === 'CRITICAL' ? 'border-red-500/50' : 
            stats.stressLevel === 'HIGH' ? 'border-amber-500/50' : 'border-slate-800'
          }`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg border ${
                stats.stressLevel === 'CRITICAL' ? 'bg-red-500/10 border-red-500/20' : 
                stats.stressLevel === 'HIGH' ? 'bg-amber-500/10 border-amber-500/20' : 'bg-emerald-500/10 border-emerald-500/20'
              }`}>
                <ShieldAlert className={`w-4 h-4 ${
                  stats.stressLevel === 'CRITICAL' ? 'text-red-500' : 
                  stats.stressLevel === 'HIGH' ? 'text-amber-500' : 'text-emerald-500'
                }`} />
              </div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Stress Level</p>
            </div>
            <h2 className={`text-3xl font-black ${
              stats.stressLevel === 'CRITICAL' ? 'text-red-500' : 
              stats.stressLevel === 'HIGH' ? 'text-amber-500' : 'text-emerald-500'
            }`}>{stats.stressLevel}</h2>
            <p className="text-[10px] text-slate-600 font-mono mt-1 uppercase">System stability</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-slate-900 p-8 rounded-2xl border border-slate-800">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-400" />
                  Demand vs Capacity Stress Test
                </h3>
                <p className="text-[10px] text-slate-500 font-mono uppercase mt-1">Real-time load balancing projection</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                  <div className="w-2 h-2 rounded-full bg-slate-600"></div> Capacity
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                  <div className="w-2 h-2 rounded-full bg-indigo-500"></div> Demand
                </div>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={simulationData}>
                  <defs>
                    <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 700}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 700}} />
                  <Tooltip 
                    contentStyle={{backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px'}} 
                    itemStyle={{fontSize: '12px', fontWeight: 'bold'}}
                  />
                  <Area type="monotone" dataKey="capacity" stroke="#475569" strokeWidth={2} fill="#1e293b" fillOpacity={0.5} name="Capacity" />
                  <Area type="monotone" dataKey="traffic" stroke="#6366f1" strokeWidth={3} fill="url(#colorDemand)" name="Demand" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800">
            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2 mb-8">
              <Zap className="w-4 h-4 text-amber-400" />
              Risk Distribution
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={simulationData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 700}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 700}} />
                  <Tooltip 
                    contentStyle={{backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px'}} 
                    itemStyle={{fontSize: '12px', fontWeight: 'bold'}}
                  />
                  <Bar dataKey="risk" name="System Risk">
                    {simulationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.risk > 100 ? '#ef4444' : entry.risk > 50 ? '#f59e0b' : '#6366f1'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800">
          <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2 mb-6">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            AI-Generated Mitigation Strategies
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Strategy 01</p>
              <h4 className="text-xs font-bold text-white mb-2 uppercase">Queue Busting Protocol</h4>
              <p className="text-[10px] text-slate-500 leading-relaxed font-mono">Deploy 4 additional mobile checkout units to the electronics department between 06:00 and 10:00.</p>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Strategy 02</p>
              <h4 className="text-xs font-bold text-white mb-2 uppercase">Dynamic Break Scheduling</h4>
              <p className="text-[10px] text-slate-500 leading-relaxed font-mono">Stagger all employee breaks to ensure 100% register uptime during the 11:00 - 14:00 mid-day surge.</p>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Strategy 03</p>
              <h4 className="text-xs font-bold text-white mb-2 uppercase">Inventory Pre-Staging</h4>
              <p className="text-[10px] text-slate-500 leading-relaxed font-mono">Pre-stage high-velocity SKUs in the front-of-store staging area to reduce associate travel time by 40%.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BlackFridaySimulator;
