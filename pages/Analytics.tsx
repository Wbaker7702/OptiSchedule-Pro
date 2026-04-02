
import React, { useState } from 'react';
import Header from '../components/Header';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, LineChart, Line } from 'recharts';
import { Download, FileText, Scale, Loader2, Megaphone, Heart, BarChart2, Layers, Sparkles } from 'lucide-react';
import { FISCAL_METRICS, HUBSPOT_METRICS } from '../constants';

const correlationData = [
  { time: '08:00', crmLeads: 45, footTraffic: 220 },
  { time: '10:00', crmLeads: 52, footTraffic: 380 },
  { time: '12:00', crmLeads: 88, footTraffic: 420 },
  { time: '14:00', crmLeads: 65, footTraffic: 310 },
  { time: '16:00', crmLeads: 120, footTraffic: 580 },
  { time: '18:00', crmLeads: 95, footTraffic: 490 },
  { time: '20:00', crmLeads: 30, footTraffic: 210 },
];

const laborPivotData = [
  { week: 'W1', leakage: 186, recovered: 0 },
  { week: 'W2', leakage: 160, recovered: 26 },
  { week: 'W3', leakage: 145, recovered: 41 },
  { week: 'W4', leakage: 120, recovered: 66 },
  { week: 'W5', leakage: 80, recovered: 106 },
  { week: 'W6', leakage: 44, recovered: 142 },
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
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Execution Leakage</p>
                <h3 className="text-2xl font-black text-gray-900">${FISCAL_METRICS.executionLeakage.toLocaleString()}</h3>
                <p className="text-xs text-red-500 font-bold mt-1">Weekly Exposure</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ROI Multiplier</p>
                <h3 className="text-2xl font-black text-gray-900">{FISCAL_METRICS.currentROI}x</h3>
                <p className="text-xs text-emerald-500 font-bold mt-1">Sentinel Efficiency</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Annual Recovery</p>
                <h3 className="text-2xl font-black text-gray-900">${FISCAL_METRICS.annualRecoveryTarget}M</h3>
                <p className="text-xs text-blue-500 font-bold mt-1">Target</p>
            </div>
             <div className="bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-800">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">2028 Vision</p>
                <h3 className="text-2xl font-black text-white">${FISCAL_METRICS.vision2028}M</h3>
                <p className="text-xs text-slate-400 font-bold mt-1">Enterprise Value</p>
            </div>
        </div>

        {/* HubSpot Integration Card */}
        <div className={`bg-white rounded-xl shadow-sm border overflow-hidden ${hubspotStatus === 'connected' ? 'border-orange-100' : 'border-gray-200 opacity-80'}`}>
             <div className={`p-6 border-b flex flex-col md:flex-row md:items-center justify-between gap-4 ${hubspotStatus === 'connected' ? 'border-orange-100 bg-orange-50/30' : 'border-gray-100 bg-gray-50'}`}>
                 <div className="flex items-center gap-4">
                     <div className={`p-3 rounded-xl shadow-lg ${hubspotStatus === 'connected' ? 'bg-[#ff7a59] shadow-orange-500/20' : 'bg-gray-400 shadow-gray-400/20'}`}>
                         <Layers className="w-6 h-6 text-white" />
                     </div>
                     <div>
                         <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">HubSpot Marketing Velocity</h3>
                         <p className="text-xs text-gray-500 font-medium">CRM Ingress Node • Validating Campaign ROI against Staffing Deployment</p>
                     </div>
                 </div>
                 <div className={`px-3 py-1 bg-white border rounded-lg flex items-center gap-2 ${hubspotStatus === 'connected' ? 'border-orange-200' : 'border-gray-200'}`}>
                     <div className={`w-2 h-2 rounded-full ${hubspotStatus === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                     <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">
                         {hubspotStatus === 'connected' ? 'Live Sync Active' : 'Node Disconnected'}
                     </span>
                 </div>
             </div>
             
             <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                 <div className="flex items-center gap-4">
                     <div className={`p-3 rounded-lg ${hubspotStatus === 'connected' ? 'bg-orange-100 text-[#ff7a59]' : 'bg-gray-100 text-gray-400'}`}><Megaphone className="w-5 h-5" /></div>
                     <div><p className="text-2xl font-black text-gray-900">{hubspotStatus === 'connected' ? HUBSPOT_METRICS.activeCampaigns : '-'}</p><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Campaigns</p></div>
                 </div>
                 <div className={`flex items-center gap-4 border-l pl-8 ${hubspotStatus === 'connected' ? 'border-orange-100' : 'border-gray-100'}`}>
                     <div className={`p-3 rounded-lg ${hubspotStatus === 'connected' ? 'bg-orange-100 text-[#ff7a59]' : 'bg-gray-100 text-gray-400'}`}><Heart className="w-5 h-5" /></div>
                     <div><p className="text-2xl font-black text-gray-900">{hubspotStatus === 'connected' ? HUBSPOT_METRICS.loyaltySignups.toLocaleString() : '-'}</p><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Loyalty Signups</p></div>
                 </div>
                 <div className={`flex items-center gap-4 border-l pl-8 ${hubspotStatus === 'connected' ? 'border-orange-100' : 'border-gray-100'}`}>
                     <div className={`p-3 rounded-lg ${hubspotStatus === 'connected' ? 'bg-orange-100 text-[#ff7a59]' : 'bg-gray-100 text-gray-400'}`}><BarChart2 className="w-5 h-5" /></div>
                     <div><p className="text-2xl font-black text-gray-900">{hubspotStatus === 'connected' ? `$${(HUBSPOT_METRICS.attributedRevenue / 1000).toFixed(1)}k` : '-'}</p><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Attributed Rev</p></div>
                 </div>
             </div>
        </div>

        {/* Dual Chart Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                    <div><h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Marketing vs. Foot Traffic</h3><p className="text-xs text-gray-500 mt-1">Correlation: HubSpot Engagement vs. Entrance Volume</p></div>
                    <Sparkles className="w-5 h-5 text-orange-400" />
                </div>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={correlationData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 'bold'}} />
                            <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 'bold'}} />
                            <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 'bold'}} />
                            <Tooltip contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0'}} />
                            <Legend wrapperStyle={{fontSize: '10px', fontWeight: '900', textTransform: 'uppercase'}} />
                            <Line yAxisId="left" type="monotone" dataKey="crmLeads" stroke="#ff7a59" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} name="HubSpot Deals" />
                            <Line yAxisId="right" type="monotone" dataKey="footTraffic" stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} name="Foot Traffic" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                    <div><h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Labor Pivot Analysis</h3><p className="text-xs text-gray-500 mt-1">Leakage vs. Recapture (Weekly)</p></div>
                    <Scale className="w-5 h-5 text-gray-300" />
                </div>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={laborPivotData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 'bold'}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 'bold'}} />
                            <Tooltip contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0'}} />
                            <Area type="monotone" dataKey="leakage" stroke="#ef4444" strokeWidth={2} fill="#ef4444" fillOpacity={0.1} />
                            <Area type="monotone" dataKey="recovered" stroke="#10b981" strokeWidth={2} fill="#10b981" fillOpacity={0.1} />
                        </AreaChart>
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
                             <div className="p-2 bg-gray-100 rounded text-gray-500"><FileText className="w-4 h-4" /></div>
                             <div><p className="text-sm font-bold text-gray-900">{report.name}</p><p className="text-xs text-gray-500">{report.date} • {report.size}</p></div>
                         </div>
                         <button onClick={() => handleDownloadReport(report)} className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                            {downloadingId === report.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} Download
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
