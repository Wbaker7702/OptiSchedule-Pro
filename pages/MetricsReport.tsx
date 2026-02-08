
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, LineChart, Line } from 'recharts';
import { DollarSign, Clock, Target, TrendingUp, ArrowUpRight, ArrowDownRight, Zap, Cloud, Database, ShieldCheck, Filter, Download, ListChecks, Loader2, CheckCircle, FileText, Calendar, BarChart3, PieChart, Activity, RefreshCw, Layers, ChevronRight, FileDown } from 'lucide-react';
import { FISCAL_METRICS, AZURE_TELEMETRY, ROYALTY_METRICS } from '../constants';

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
];

const MetricsReport: React.FC = () => {
  const [activeReport, setActiveReport] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [generationStep, setGenerationStep] = useState('');
  const [showReport, setShowReport] = useState(false);
  const [pivotComplete, setPivotComplete] = useState(false);

  const handleGenerateReport = (id: string) => {
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
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setGenerationStep(steps[currentStep]);
        currentStep++;
      } else {
        clearInterval(interval);
        setIsGenerating(false);
        setShowReport(true);
      }
    }, 800);
  };

  const downloadReportFile = (id: string) => {
    setIsDownloading(id);
    const template = REPORT_TEMPLATES.find(t => t.id === id);
    const reportName = template?.name || 'Sentinel_Report';
    
    // Simulate generation and download
    setTimeout(() => {
      const content = `Report: ${reportName}\nGenerated: ${new Date().toLocaleString()}\nStore: #5065\nStatus: Verified Triple-Engine Handshake\n\nMetric Summaries:\n- Efficiency Delta: +14.2%\n- Compliance Score: 98.4%\n- Recaptured Value: $12,500\n\n(c) OptiSchedule Sentinel AI Systems`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportName.replace(/\s+/g, '_')}_${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setIsDownloading(null);
    }, 1500);
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
        
        {/* On-Demand Report Generator Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           {/* Report Selector Sidebar */}
           <div className="lg:col-span-4 space-y-4">
              <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl">
                 <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-500" />
                    Available Templates
                 </h3>
                 <div className="space-y-2">
                    {REPORT_TEMPLATES.map((report) => (
                       <div key={report.id} className="relative group">
                          <button 
                             onClick={() => handleGenerateReport(report.id)}
                             disabled={isGenerating}
                             className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-4 ${
                                activeReport === report.id 
                                ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20' 
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-900'
                             }`}
                          >
                             <div className={`p-2 rounded-lg ${activeReport === report.id ? 'bg-white/20' : 'bg-slate-900 border border-slate-800'}`}>
                                <report.icon className={`w-4 h-4 ${activeReport === report.id ? 'text-white' : 'text-slate-500'}`} />
                             </div>
                             <div className="flex-1 overflow-hidden pr-8">
                                <p className="text-[10px] font-black uppercase tracking-widest truncate">{report.name}</p>
                                <p className={`text-[8px] font-mono uppercase mt-1 truncate ${activeReport === report.id ? 'text-blue-100' : 'text-slate-600'}`}>
                                   {report.description}
                                </p>
                             </div>
                             <ChevronRight className={`w-3 h-3 transition-transform ${activeReport === report.id ? 'translate-x-1 text-white' : 'text-slate-800 group-hover:text-slate-600'}`} />
                          </button>
                          
                          {/* Direct Download Icon Button */}
                          <button 
                            onClick={(e) => { e.stopPropagation(); downloadReportFile(report.id); }}
                            disabled={isDownloading === report.id}
                            className={`absolute right-10 top-1/2 -translate-y-1/2 p-2 rounded-xl border transition-all ${
                              activeReport === report.id 
                                ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
                                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-blue-400 hover:border-blue-500/30'
                            }`}
                            title="Direct Download"
                          >
                            {isDownloading === report.id ? (
                               <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                               <FileDown className="w-3.5 h-3.5" />
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
                       <span className="text-emerald-500">14ms</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-black uppercase">
                       <div className="flex items-center gap-2"><Zap className="w-3 h-3 text-[#ff7a59] fill-[#ff7a59]" /> <span className="text-slate-300">Breeze Node</span></div>
                       <span className="text-emerald-500">Ready</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-black uppercase">
                       <div className="flex items-center gap-2"><Database className="w-3 h-3 text-blue-500" /> <span className="text-slate-300">D365 Ledger</span></div>
                       <span className="text-blue-400 font-mono">Syncing</span>
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
                       <h4 className="text-lg font-black text-white uppercase tracking-widest mb-2">Generating Advanced Report</h4>
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
                                Period: {new Date().toLocaleDateString()} - Forecast Node #5065
                             </p>
                          </div>
                          <div className="flex gap-3">
                             <button 
                                onClick={() => activeReport && downloadReportFile(activeReport)}
                                disabled={!!isDownloading}
                                className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-500 hover:text-white transition-colors flex items-center gap-2 group"
                             >
                                {isDownloading === activeReport ? (
                                   <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                   <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                )}
                                <span className="text-[9px] font-black uppercase">Download</span>
                             </button>
                             <button className="px-6 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:bg-blue-500">
                                Export to D365
                             </button>
                          </div>
                       </div>

                       <div className="space-y-8">
                          {/* Top Metric Summary for the report */}
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

                          {/* Dynamic Chart Area */}
                          <div className="h-64 bg-slate-950/50 rounded-2xl border border-slate-800 p-6">
                             <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={otTrendData}>
                                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                                   <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b', fontWeight: 'bold'}} />
                                   <YAxis hide />
                                   <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid #334155'}} />
                                   <Area type="monotone" dataKey="hours" stroke={activeReport === 'variance' ? '#ef4444' : '#3b82f6'} fill={activeReport === 'variance' ? '#ef4444' : '#3b82f6'} fillOpacity={0.1} />
                                </AreaChart>
                             </ResponsiveContainer>
                          </div>

                          {/* Data Table */}
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
                       <p className="text-[10px] text-slate-700 mt-2 uppercase font-mono">Awaiting user authorization for data handshake</p>
                    </div>
                 )}
              </div>
           </div>
        </div>

        {/* Global Strategy Bar */}
        <div className="bg-[#0078d4]/5 border border-[#0078d4]/20 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <Zap className="w-32 h-32 text-[#ff7a59]" />
           </div>
           <div className="flex items-center gap-6 relative z-10">
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl backdrop-blur-md">
                 <ShieldCheck className="w-8 h-8 text-blue-400" />
              </div>
              <div className="max-w-xl">
                 <h4 className="text-sm font-black text-white uppercase tracking-widest mb-2">Sentinel Strategy recalibration</h4>
                 <p className="text-xs text-slate-400 leading-relaxed font-mono uppercase tracking-tight">
                    Every report generated above is cross-referenced with the <span className="text-emerald-400 font-black">Creator Royalty Agreement</span>. Execute a pivot below to align staffing vectors with the current fiscal period's optimized targets.
                 </p>
              </div>
           </div>
           <button 
            onClick={handlePivot}
            disabled={isGenerating}
            className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl relative z-10 flex items-center gap-3 active:scale-95 ${
              isGenerating 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
                : 'bg-white text-slate-900 hover:bg-slate-100 hover:shadow-white/10'
            }`}
           >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing Pivot
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
