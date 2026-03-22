import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, LineChart, Line } from 'recharts';
import { DollarSign, Clock, Target, TrendingUp, ArrowUpRight, ArrowDownRight, Zap, Cloud, Database, ShieldCheck, Filter, Download, ListChecks, Loader2, CheckCircle, FileText, Calendar, BarChart3, PieChart, Activity, RefreshCw, Layers, ChevronRight, FileDown, ShieldAlert, Brain } from 'lucide-react';
import { FISCAL_METRICS, AZURE_TELEMETRY, ROYALTY_METRICS } from '../constants';
import { budgetGuardian, checkFatigue } from '../validators';

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

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  category: 'Labor' | 'Financial' | 'Compliance';
}

const REPORT_TEMPLATES: ReportTemplate[] = [
  { id: 'variance', name: 'Variance Analytics Report', description: 'Scheduled vs Actual punch-out delta analysis.', icon: Activity, category: 'Labor' },
  { id: 'weekly_hours', name: 'Weekly Hours Audit', description: 'Total hour distribution per department node.', icon: Clock, category: 'Labor' },
  { id: 'overtime', name: 'OT Vector Report', description: 'Identify employees approaching 40h threshold.', icon: Zap, category: 'Compliance' },
  { id: 'labor_pct', name: 'Labor vs Sales Ratio', description: 'Real-time efficiency gain vs baseline targets.', icon: BarChart3, category: 'Financial' },
  { id: 'efficiency', name: 'Efficiency Gain Summary', description: 'Recaptured fiscal value from Sentinel optimization.', icon: TrendingUp, category: 'Financial' },
  { id: 'weekly_audit', name: 'Weekly Audit Log (IT/AJ Hoka)', description: 'Full system trace and security events.', icon: ShieldAlert, category: 'Compliance' },
];

const MetricsReport: React.FC = () => {
  const [activeReport, setActiveReport] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [generationStep, setGenerationStep] = useState('');
  const [showReport, setShowReport] = useState(false);
  const [pivotComplete, setPivotComplete] = useState(false);

  // State for Scenario Forecaster ("Battle Creek Test")
  const [scenario, setScenario] = useState({
    sales: 10000,
    hours: 120,
    rate: 15,
    target: 15,
    fatigueHours: 12,
  });

  const budgetResult = budgetGuardian(scenario.hours, scenario.rate, scenario.sales, scenario.target);
  const fatigueResult = checkFatigue(scenario.fatigueHours);

  // Hardened download function to ensure file is actually saved
  const downloadReportFile = (id: string) => {
    setIsDownloading(id);
    const template = REPORT_TEMPLATES.find(t => t.id === id);
    const reportName = template?.name || 'Sentinel_Report';
    
    // Simulate engine work
    setTimeout(() => {
      try {
        const timestamp = new Date().toLocaleString();
        const content = `
=========================================
OPTISCHEDULE SENTINEL AI - EXPORT
=========================================
REPORT TYPE: ${reportName}
GENERATED: ${timestamp}
STORE ID: #5065
ENGINE: TRIPLE-NODE (AZURE, BREEZE, D365)
=========================================

EXECUTIVE SUMMARY:
- Operational Variance: 2.4% (Within Threshold)
- Compliance Standing: 98.4% Secure
- Estimated Recapture: $12,500.00
- Baseline Efficiency Gain: +14.2%

DEPARTMENTAL BREAKDOWN:
- Front End: 12/15 Staffing Capacity
- Grocery: 94% Resource Efficiency
- Electronics: Zero Compliance Violations

SENTINEL STATUS: NOMINAL
-----------------------------------------
(c) 2024 OptiSchedule Pro Enterprise Systems
        `.trim();

        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${reportName.replace(/\s+/g, '_')}_${Date.now()}.txt`);
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (err) {
        console.error("Report Export Failed:", err);
      } finally {
        setIsDownloading(null);
      }
    }, 1200);
  };

  const handleGenerateAndDownload = (id: string) => {
    setActiveReport(id);
    setIsGenerating(true);
    setShowReport(false);

    const steps = [
      "Quarrying Azure Cloud Data Lake...",
      "Syncing HubSpot Breeze Ingress...",
      "Validating Dynamics 365 Ledger...",
      "Synthesizing Operational Delta...",
      "Finalizing Visual Matrix..."
    ];

    let currentStep = 0;
    let isMounted = true;
    const interval = setInterval(() => {
      if (currentStep < steps.length && isMounted) {
        setGenerationStep(steps[currentStep]);
        currentStep++;
      } else if (currentStep >= steps.length && isMounted) {
        clearInterval(interval);
        setIsGenerating(false);
        setShowReport(true);
        // Automatically trigger the download after generation to satisfy the "should download" requirement
        downloadReportFile(id);
      }
    }, 600);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  };

  const handlePivot = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setPivotComplete(true);
      setTimeout(() => setPivotComplete(false), 5000);
    }, 2000);
  };

  return (
    <div className="flex-1 bg-slate-950 overflow-auto custom-scrollbar font-mono">
      <Header title="Advanced Report Center" subtitle="Triple-Engine Fiscal & Operational Deep-Dive" />

      <div className="p-8 max-w-7xl mx-auto space-y-8 pb-24">
        
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

        {/* New Scenario Forecaster */}
        <div className="bg-slate-900 rounded-3xl p-8 border border-indigo-500/30 shadow-2xl relative overflow-hidden">
           <div className="absolute -right-12 -top-12 opacity-5 pointer-events-none">
              <Brain className="w-64 h-64 text-indigo-400" />
           </div>
           <div className="relative z-10">
              <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3 mb-8">
                 <ShieldCheck className="w-5 h-5 text-indigo-400" />
                 Sentinel Scenario Forecaster
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 {/* Money Rule Tester */}
                 <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-300">"Money Rule" - Budget Guardian</h4>
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Projected Sales ($)</label>
                          <input type="number" value={scenario.sales} onChange={e => setScenario(s => ({...s, sales: +e.target.value}))} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white" />
                       </div>
                       <div>
                          <label className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Labor Hours</label>
                          <input type="number" value={scenario.hours} onChange={e => setScenario(s => ({...s, hours: +e.target.value}))} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white" />
                       </div>
                    </div>
                    <div>
                       <label className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Manager Target - "Golden Zone" ({scenario.target}%)</label>
                       <input type="range" min="10" max="25" value={scenario.target} onChange={e => setScenario(s => ({...s, target: +e.target.value}))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                    </div>
                    <div className={`p-4 rounded-lg text-xs font-mono font-bold text-center ${budgetResult.startsWith('🚨') ? 'bg-red-500/10 text-red-400 border border-red-500/20' : budgetResult.startsWith('🟠') ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                       {budgetResult}
                    </div>
                 </div>
                 {/* Fatigue Check Tester */}
                 <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-300">14-Hour Fatigue Check</h4>
                        <div>
                           <label className="block text-[8px] font-black text-slate-500 uppercase tracking-widest my-2">Longest Planned Shift (Hours)</label>
                           <input type="number" value={scenario.fatigueHours} onChange={e => setScenario(s => ({...s, fatigueHours: +e.target.value}))} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white" />
                        </div>
                    </div>
                    <div className={`p-4 rounded-lg text-xs font-mono font-bold text-center ${fatigueResult.startsWith('🚨') ? 'bg-red-500/10 text-red-400 border border-red-500/20' : fatigueResult.startsWith('🟠') ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                       {fatigueResult}
                    </div>
                 </div>
              </div>
           </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           {/* Report Selector Sidebar */}
           <div className="lg:col-span-4 space-y-4">
              <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl">
                 <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-500" />
                    Available Templates
                 </h3>
                 <div className="space-y-3">
                    {REPORT_TEMPLATES.map((report) => (
                       <div key={report.id} className="group relative">
                          <button 
                             onClick={() => handleGenerateAndDownload(report.id)}
                             disabled={isGenerating || !!isDownloading}
                             className={`w-full text-left p-4 pr-16 rounded-2xl border transition-all flex items-center gap-4 ${
                                activeReport === report.id 
                                ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20' 
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-900'
                             }`}
                          >
                             <div className={`p-2 rounded-lg ${activeReport === report.id ? 'bg-white/20' : 'bg-slate-900 border border-slate-800'}`}>
                                <report.icon className={`w-4 h-4 ${activeReport === report.id ? 'text-white' : 'text-slate-500'}`} />
                             </div>
                             <div className="flex-1 overflow-hidden">
                                <p className="text-[10px] font-black uppercase tracking-widest truncate">{report.name}</p>
                                <p className={`text-[8px] font-mono uppercase mt-1 truncate ${activeReport === report.id ? 'text-blue-100' : 'text-slate-600'}`}>
                                   {isDownloading === report.id ? 'Compiling File...' : isGenerating && activeReport === report.id ? 'Generating...' : report.description}
                                </p>
                             </div>
                          </button>
                          
                          {/* Explicit Download Icon Button */}
                          <button 
                            onClick={(e) => { e.stopPropagation(); downloadReportFile(report.id); }}
                            disabled={isDownloading === report.id}
                            className={`absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-xl border transition-all z-10 ${
                              activeReport === report.id 
                                ? 'bg-white/10 border-white/20 text-white hover:bg-white/30' 
                                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-blue-400 hover:border-blue-500/40 hover:bg-slate-800'
                            }`}
                            title="Direct Download"
                          >
                            {isDownloading === report.id ? (
                               <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                            ) : (
                               <FileDown className="w-4 h-4" />
                            )}
                          </button>
                       </div>
                    ))}
                 </div>
              </div>

              {/* Engine Status Board */}
              <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl">
                 <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">Ingress Health</h3>
                 <div className="space-y-3">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase">
                       <div className="flex items-center gap-2"><Cloud className="w-3 h-3 text-[#0078d4]" /> <span className="text-slate-300">Azure Compute</span></div>
                       <span className="text-emerald-500 font-mono">14ms</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-black uppercase">
                       <div className="flex items-center gap-2"><Zap className="w-3 h-3 text-[#ff7a59] fill-[#ff7a59]" /> <span className="text-slate-300">Breeze Node</span></div>
                       <span className="text-emerald-500">Ready</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-black uppercase">
                       <div className="flex items-center gap-2"><Database className="w-3 h-3 text-blue-500" /> <span className="text-slate-300">D365 Ledger</span></div>
                       <span className="text-blue-400 font-mono">Sync</span>
                    </div>
                 </div>
              </div>
           </div>

           {/* Report Output Area */}
           <div className="lg:col-span-8">
              <div className="bg-slate-900 rounded-3xl border border-slate-800 h-full min-h-[500px] flex flex-col relative overflow-hidden shadow-2xl">
                 {isGenerating ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                       <div className="relative mb-8">
                          <RefreshCw className="w-16 h-16 text-blue-500 animate-spin opacity-20" />
                          <div className="absolute inset-0 flex items-center justify-center">
                             <ShieldCheck className="w-8 h-8 text-blue-500 animate-pulse" />
                          </div>
                       </div>
                       <h4 className="text-lg font-black text-white uppercase tracking-widest mb-2">Compiling Report</h4>
                       <p className="text-[10px] text-blue-400 animate-pulse uppercase tracking-[0.2em]">{generationStep}</p>
                    </div>
                 ) : showReport ? (
                    <div className="flex-1 p-8 animate-in fade-in duration-500">
                       <div className="flex justify-between items-start mb-10 pb-6 border-b border-slate-800">
                          <div>
                             <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                                {REPORT_TEMPLATES.find(t => t.id === activeReport)?.name}
                             </h2>
                             <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase">
                                Cycle: {new Date().toLocaleDateString()} • Node #5065
                             </p>
                          </div>
                          <div className="flex gap-3">
                             <button 
                                onClick={() => activeReport && downloadReportFile(activeReport)}
                                disabled={!!isDownloading}
                                className="px-5 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 hover:text-white hover:border-slate-600 transition-all flex items-center gap-3 group"
                             >
                                {isDownloading === activeReport ? (
                                   <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                   <Download className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                )}
                                <span className="text-[10px] font-black uppercase tracking-widest">Download .TXT</span>
                             </button>
                             <button className="px-6 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:bg-blue-500 transition-all active:scale-95">
                                Export to D365
                             </button>
                          </div>
                       </div>

                       <div className="space-y-8">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                             <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                                <p className="text-[9px] text-slate-500 uppercase font-black mb-1">Current Delta</p>
                                <p className="text-2xl font-black text-white">
                                   {activeReport === 'overtime' ? '65h' : activeReport === 'labor_pct' ? '21.8%' : '$12.5k'}
                                </p>
                             </div>
                             <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                                <p className="text-[9px] text-slate-500 uppercase font-black mb-1">Compliance Status</p>
                                <p className="text-2xl font-black text-emerald-500">Nominal</p>
                             </div>
                             <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                                <p className="text-[9px] text-slate-500 uppercase font-black mb-1">Sentinel Rating</p>
                                <p className="text-2xl font-black text-blue-400">98.4</p>
                             </div>
                          </div>

                          <div className="h-64 bg-slate-950/50 rounded-2xl border border-slate-800 p-6">
                             <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={otTrendData}>
                                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                                   <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b', fontWeight: 'bold'}} />
                                   <YAxis hide />
                                   <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid #334155'}} />
                                   <Area type="monotone" dataKey="hours" stroke={activeReport === 'variance' ? '#ef4444' : '#3b82f6'} fill={activeReport === 'variance' ? '#ef4444' : '#3b82f6'} fillOpacity={0.1} strokeWidth={3} />
                                </AreaChart>
                             </ResponsiveContainer>
                          </div>

                          <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
                             <table className="w-full text-left font-mono text-[10px]">
                                <thead className="bg-slate-900 text-slate-500 uppercase font-black tracking-widest">
                                   <tr>
                                      <th className="px-6 py-4">Department</th>
                                      <th className="px-6 py-4">Node Capacity</th>
                                      <th className="px-6 py-4">Variance (%)</th>
                                      <th className="px-6 py-4 text-right">Status</th>
                                   </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-900">
                                   {savingsByDept.map((dept, i) => (
                                      <tr key={i} className="hover:bg-white/5 transition-colors">
                                         <td className="px-6 py-4 text-white font-bold">{dept.name}</td>
                                         <td className="px-6 py-4 text-slate-400">12/15 Staff</td>
                                         <td className="px-6 py-4 text-emerald-400">-{((i+1)*2.4).toFixed(1)}%</td>
                                         <td className="px-6 py-4 text-right"><span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded">SECURE</span></td>
                                      </tr>
                                   ))}
                                </tbody>
                             </table>
                          </div>
                       </div>
                    </div>
                 ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-40">
                       <FileText className="w-16 h-16 text-slate-800 mb-6" />
                       <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Select Template to Initialize Ingress</h4>
                       <p className="text-[10px] text-slate-700 mt-2 uppercase font-mono tracking-widest">Awaiting user authorization for data handshake</p>
                    </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsReport;
