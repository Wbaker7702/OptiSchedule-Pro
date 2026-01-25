import React, { useState } from 'react';
import Header from '../components/Header';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, Cell } from 'recharts';
import { Download, FileText, TrendingUp, DollarSign, Users, Scale, Target, ArrowUpRight, Loader2, Database, ShieldCheck, ArrowUp } from 'lucide-react';
import { FISCAL_METRICS, ENTERPRISE_INGRESS_HISTORY } from '../constants';

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
    
    // Simulate generation/fetch delay
    setTimeout(() => {
      const content = `STRATEGIC REPORT: ${report.name}\nGenerated on: ${new Date().toLocaleString()}\nFile Size: ${report.size}\n\nKey Strategic Insights:\n- Current ROI Multiplier: ${FISCAL_METRICS.currentROI}x\n- Target EBITDA Protection: $${FISCAL_METRICS.vision2028}M\n- Status: VERIFIED AND APPROVED`;
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${report.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setDownloadingId(null);
    }, 1500);
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-auto text-slate-900">
      <Header title="Analytics & Reports" subtitle="The Fiscal Foundation: Efficiency vs. Leakage" />

      <div className="p-8 max-w-7xl mx-auto space-y-8">
        
        {/* The Scaling Formula Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-xl shadow-lg text-white relative overflow-hidden">
             <div className="relative z-10">
               <p className="text-blue-200 font-medium text-sm uppercase tracking-wider mb-1">Business Logic</p>
               <h3 className="text-2xl font-bold text-white">The ROI Formula</h3>
               <div className="mt-4 flex items-baseline gap-2">
                 <span className="text-4xl font-bold">{FISCAL_METRICS.currentROI}x</span>
                 <span className="text-blue-200 text-sm">Return</span>
               </div>
               <p className="mt-2 text-sm text-blue-100 opacity-90">"For every $1 invested, we protect ${FISCAL_METRICS.currentROI}."</p>
             </div>
             <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
               <Scale className="w-32 h-32" />
             </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <div className="flex justify-between items-start">
               <div>
                 <p className="text-sm font-medium text-gray-500">Annual Recovery Target</p>
                 <h3 className="text-3xl font-bold text-gray-900 mt-2">${FISCAL_METRICS.annualRecoveryTarget}M</h3>
               </div>
               <div className="p-2 bg-green-50 rounded-lg">
                 <Target className="w-6 h-6 text-green-600" />
               </div>
             </div>
             <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
               <span className="font-semibold text-gray-900">Goal:</span> "Leakage" Stopped across 12-store market.
             </div>
          </div>

           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <div className="flex justify-between items-start">
               <div>
                 <p className="text-sm font-medium text-gray-500">2028 Vision</p>
                 <h3 className="text-3xl font-bold text-gray-900 mt-2">${FISCAL_METRICS.vision2028}M</h3>
               </div>
               <div className="p-2 bg-purple-50 rounded-lg">
                 <TrendingUp className="w-6 h-6 text-purple-600" />
               </div>
             </div>
             <div className="mt-4 flex items-center text-sm text-purple-600 font-medium">
               <ArrowUpRight className="w-4 h-4 mr-1" />
               Cumulative ROI through Scale
             </div>
          </div>
        </div>

        {/* Enterprise Ingress History Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
           <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-blue-100 rounded-lg">
                    <Database className="w-5 h-5 text-blue-600" />
                 </div>
                 <div>
                    <h3 className="font-bold text-gray-900">Enterprise Ingress History</h3>
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-black">Sentinel Data Flow Analytics</p>
                 </div>
              </div>
              <div className="flex items-center gap-2 text-emerald-600 text-xs font-black uppercase tracking-widest">
                 <TrendingUp className="w-4 h-4" />
                 Total Surge: +46% (5 Day Window)
              </div>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                 <thead className="bg-gray-50 text-gray-500 font-black uppercase tracking-widest text-[10px] border-b border-gray-200">
                    <tr>
                       <th className="px-6 py-4">Verification Date</th>
                       <th className="px-6 py-4">Ingress Volume</th>
                       <th className="px-6 py-4">Data Source Node</th>
                       <th className="px-6 py-4">Day/Day Growth</th>
                       <th className="px-6 py-4">Integrity Status</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100 font-medium">
                    {ENTERPRISE_INGRESS_HISTORY.map((point, idx) => (
                       <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-mono text-xs">{point.date}</td>
                          <td className="px-6 py-4 font-black">{point.volume.toLocaleString()} <span className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">Leads</span></td>
                          <td className="px-6 py-4">
                             <span className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-[10px] uppercase tracking-widest font-black text-slate-600">
                                {point.source}
                             </span>
                          </td>
                          <td className="px-6 py-4">
                             <div className="flex items-center gap-1.5 text-emerald-600">
                                <ArrowUp className="w-3.5 h-3.5" />
                                <span className="font-black">+{point.growth}%</span>
                             </div>
                          </td>
                          <td className="px-6 py-4">
                             <div className="flex items-center gap-2">
                                <ShieldCheck className={`w-4 h-4 ${point.status === 'Verified' ? 'text-blue-500' : 'text-emerald-500'}`} />
                                <span className={`text-[10px] font-black uppercase tracking-widest ${point.status === 'Verified' ? 'text-blue-600' : 'text-emerald-600'}`}>
                                   {point.status}
                                </span>
                             </div>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Main Chart: The Pivot */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="mb-6">
                <h3 className="font-semibold text-gray-900">Labor Hour Recapture</h3>
                <p className="text-xs text-gray-500">Pivoting {FISCAL_METRICS.targetWeeklyHoursRecapture} hours from "Leakage" to "Revenue"</p>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={laborPivotData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="leakage" name="Unaccounted (Leakage)" stackId="1" stroke="#ef4444" fill="#fca5a5" />
                  <Area type="monotone" dataKey="recovered" name="Recaptured (Revenue)" stackId="1" stroke="#22c55e" fill="#86efac" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Secondary Chart: The Vision */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="mb-6">
                <h3 className="font-semibold text-gray-900">Projected Cumulative Impact (2025-2028)</h3>
                <p className="text-xs text-gray-500">Standardized scale across the market</p>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scalingData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} tickFormatter={(value) => `$${value}M`} />
                  <Tooltip 
                     cursor={{fill: '#f8fafc'}}
                     contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                     formatter={(value) => [`$${value} Million`, 'Cumulative ROI']}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={50}>
                     {scalingData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 3 ? '#1e40af' : '#3b82f6'} />
                     ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Unified Takeaway Section */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Unified Takeaway</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <DollarSign className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900">For the CEO / CFO</h4>
                        <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                            "This is a variance reduction strategy that protects the P&L and boosts EBITDA."
                        </p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                        <Users className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900">For the Store Manager</h4>
                        <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                            "This is a resource reallocation strategy. It gives you back the hours you need to keep your store 'Grand Opening Ready' <span className="font-semibold text-slate-800">without asking for more budget.</span>"
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* Downloadable Reports */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
           <div className="p-6 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Strategic Documentation</h3>
           </div>
           <div className="divide-y divide-gray-100">
              {reports.map((report) => (
                <div key={report.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-indigo-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{report.name}</p>
                        <p className="text-xs text-gray-500">{report.date} • {report.size}</p>
                      </div>
                   </div>
                   <button 
                     onClick={() => handleDownloadReport(report)}
                     disabled={downloadingId === report.id}
                     className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-wait"
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