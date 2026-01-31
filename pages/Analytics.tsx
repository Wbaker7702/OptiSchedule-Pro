import React, { useState } from 'react';
import Header from '../components/Header';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, Cell } from 'recharts';
import { Download, FileText, TrendingUp, DollarSign, Users, Scale, Target, ArrowUpRight, Loader2, Database, ShieldCheck, ArrowUp, Megaphone, Heart, BarChart2, Layers } from 'lucide-react';
import { FISCAL_METRICS, HUBSPOT_METRICS } from '../constants';

const laborPivotData = [
  { week: 'W1', leakage: 186, recovered: 0 },
  { week: 'W2', leakage: 160, recovered: 26 },
  { week: 'W3', leakage: 145, recovered: 41 },
  { week: 'W4', leakage: 120, recovered: 66 },
  { week: 'W5', leakage: 80, recovered: 106 },
  { week: 'W6', leakage: 44, recovered: 142 },
];

const scalingData = [
  { year: '2025', value: 4.68 },
  { year: '2026', value: 7.2 },
  { year: '2027', value: 11.5 },
  { year: '2028', value: 16 },
];

const getFormattedDate = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const reports = [
  { id: 'rep-1', name: 'Variance Reduction Strategy (CEO/CFO)', date: getFormattedDate(0), size: '1.2 MB' },
  { id: 'rep-2', name: 'Resource Reallocation Plan (Store Mgr)', date: getFormattedDate(4), size: '845 KB' },
  { id: 'rep-3', name: 'Store 5065 Pilot Proof of Concept', date: getFormattedDate(14), size: '2.4 MB' },
];

const Analytics: React.FC = () => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownloadReport = (report: typeof reports[0]) => {
    setDownloadingId(report.id);
    
    setTimeout(() => {
      setDownloadingId(null);
    }, 1500);
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      <Header title="Fiscal Oversight" subtitle="ROI Analysis & Labor Recapture Analytics" />

      <div className="p-8 max-w-7xl mx-auto space-y-8">
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Execution Leakage</p>
                    <div className="p-1.5 bg-red-50 text-red-600 rounded-lg"><ArrowUp className="w-3 h-3" /></div>
                </div>
                <h3 className="text-2xl font-black text-gray-900">${FISCAL_METRICS.executionLeakage.toLocaleString()}</h3>
                <p className="text-xs text-red-500 font-bold mt-1">Weekly Exposure</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ROI Multiplier</p>
                    <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg"><TrendingUp className="w-3 h-3" /></div>
                </div>
                <h3 className="text-2xl font-black text-gray-900">{FISCAL_METRICS.currentROI}x</h3>
                <p className="text-xs text-emerald-500 font-bold mt-1">Sentinel Efficiency</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Annual Recovery</p>
                    <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><Target className="w-3 h-3" /></div>
                </div>
                <h3 className="text-2xl font-black text-gray-900">${FISCAL_METRICS.annualRecoveryTarget}M</h3>
                <p className="text-xs text-blue-500 font-bold mt-1">Target</p>
            </div>

             <div className="bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-800">
                <div className="flex justify-between items-start mb-2">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">2028 Vision</p>
                    <div className="p-1.5 bg-slate-800 text-white rounded-lg"><ShieldCheck className="w-3 h-3" /></div>
                </div>
                <h3 className="text-2xl font-black text-white">${FISCAL_METRICS.vision2028}M</h3>
                <p className="text-xs text-slate-400 font-bold mt-1">Enterprise Value</p>
            </div>
        </div>

        {/* HubSpot Integration Card */}
        <div className="bg-white rounded-xl shadow-sm border border-orange-100 overflow-hidden">
             <div className="p-6 border-b border-orange-100 bg-orange-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                 <div className="flex items-center gap-4">
                     <div className="p-3 bg-[#ff7a59] rounded-xl shadow-lg shadow-orange-500/20">
                         <Layers className="w-6 h-6 text-white" />
                     </div>
                     <div>
                         <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">HubSpot Marketing Velocity</h3>
                         <p className="text-xs text-gray-500 font-medium">CRM Ingress Node • Validating Campaign ROI against Staffing Deployment</p>
                     </div>
                 </div>
                 <div className="flex items-center gap-3">
                     <div className="px-3 py-1 bg-white border border-orange-200 rounded-lg flex items-center gap-2">
                         <div className={`w-2 h-2 rounded-full ${HUBSPOT_METRICS.syncStatus === 'Disconnected' ? 'bg-slate-300' : 'bg-emerald-500 animate-pulse'}`} />
                         <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">{HUBSPOT_METRICS.syncStatus === 'Disconnected' ? 'Connect HubSpot' : 'Live Sync Active'}</span>
                     </div>
                 </div>
             </div>
             
             <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                 <div className="flex items-center gap-4">
                     <div className="p-3 bg-orange-100 rounded-lg text-[#ff7a59]">
                         <Megaphone className="w-5 h-5" />
                     </div>
                     <div>
                         <p className="text-2xl font-black text-gray-900">{HUBSPOT_METRICS.activeCampaigns}</p>
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Campaigns</p>
                     </div>
                 </div>

                 <div className="flex items-center gap-4 border-l border-orange-100 pl-8">
                     <div className="p-3 bg-orange-100 rounded-lg text-[#ff7a59]">
                         <Heart className="w-5 h-5" />
                     </div>
                     <div>
                         <p className="text-2xl font-black text-gray-900">{HUBSPOT_METRICS.loyaltySignups.toLocaleString()}</p>
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Loyalty Signups</p>
                     </div>
                 </div>

                 <div className="flex items-center gap-4 border-l border-orange-100 pl-8">
                     <div className="p-3 bg-orange-100 rounded-lg text-[#ff7a59]">
                         <BarChart2 className="w-5 h-5" />
                     </div>
                     <div>
                         <p className="text-2xl font-black text-gray-900">${(HUBSPOT_METRICS.attributedRevenue / 1000).toFixed(1)}k</p>
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Attributed Rev</p>
                     </div>
                 </div>
             </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Labor Pivot Analysis</h3>
                        <p className="text-xs text-gray-500 mt-1">Leakage vs. Recapture (Weekly)</p>
                    </div>
                    <Scale className="w-5 h-5 text-gray-300" />
                </div>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={laborPivotData}>
                            <defs>
                                <linearGradient id="colorLeakage" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorRecovered" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 'bold'}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 'bold'}} />
                            <Tooltip contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0'}} />
                            <Area type="monotone" dataKey="leakage" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorLeakage)" />
                            <Area type="monotone" dataKey="recovered" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRecovered)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Fiscal Scaling Model</h3>
                        <p className="text-xs text-gray-500 mt-1">Projected EBITDA Recovery (Millions)</p>
                    </div>
                    <TrendingUp className="w-5 h-5 text-gray-300" />
                </div>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={scalingData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 'bold'}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 'bold'}} />
                            <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0'}} />
                            <Bar dataKey="value" fill="#002050" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* Reports Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
             <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                 <FileText className="w-5 h-5 text-blue-600" />
                 <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Strategic Reporting Archive</h3>
             </div>
             <div className="divide-y divide-gray-100">
                 {reports.map(report => (
                     <div key={report.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                         <div className="flex items-center gap-4">
                             <div className="p-2 bg-gray-100 rounded text-gray-500">
                                 <FileText className="w-4 h-4" />
                             </div>
                             <div>
                                 <p className="text-sm font-bold text-gray-900">{report.name}</p>
                                 <p className="text-xs text-gray-500">{report.date} • {report.size}</p>
                             </div>
                         </div>
                         <button 
                            onClick={() => handleDownloadReport(report)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                         >
                            {downloadingId === report.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                            Download
                         </button>
                     </div>
                 ))}
             </div>
        </div>

      </div>
    </div>
  );
};

export default Analytics;