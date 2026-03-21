
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { AUDIT_LOGS_MOCK } from '../constants';
import { CheckCircle2, AlertTriangle, XCircle, Activity, Shield, FileText, BarChart3 } from 'lucide-react';
import GovernanceTab from '../components/GovernanceTab';

interface OperationsProps {
  defaultTab?: 'metrics' | 'audit' | 'vision' | 'scanner' | 'variance' | 'compliance';
  externalTrigger?: any;
  onClearTrigger?: any;
}

const Operations: React.FC<OperationsProps> = ({ defaultTab = 'metrics', externalTrigger, onClearTrigger }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(() => {
    if (defaultTab) setActiveTab(defaultTab);
  }, [defaultTab]);

  const passedCount = AUDIT_LOGS_MOCK.filter(l => l.status === 'Passed').length;
  const warningCount = AUDIT_LOGS_MOCK.filter(l => l.status === 'Warning').length;
  const failedCount = AUDIT_LOGS_MOCK.filter(l => l.status === 'Failed').length;

  const tabs = [
    { id: 'metrics', label: 'Metrics', icon: BarChart3 },
    { id: 'audit', label: 'Audit Logs', icon: Activity },
    { id: 'compliance', label: 'Governance', icon: Shield },
  ];

  return (
    <div className="flex-1 bg-[#020617] overflow-auto custom-scrollbar font-sans text-slate-200">
      <Header title="Operations" subtitle="Audit tracking & compliance management" />

      <div className="p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-slate-900/50 p-1 rounded-xl border border-slate-800 w-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === 'compliance' ? (
          <GovernanceTab />
        ) : (
          <>
            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-800 flex items-center gap-4 hover:border-emerald-500/30 transition-colors">
                <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                   <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                   <h3 className="text-3xl font-black text-white">{passedCount + 28}</h3>
                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Passed this month</p>
                </div>
              </div>

              <div className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-800 flex items-center gap-4 hover:border-amber-500/30 transition-colors">
                <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                   <AlertTriangle className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                   <h3 className="text-3xl font-black text-white">{warningCount + 6}</h3>
                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Warnings this month</p>
                </div>
              </div>

              <div className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-800 flex items-center gap-4 hover:border-red-500/30 transition-colors">
                <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                   <XCircle className="w-6 h-6 text-red-500" />
                </div>
                <div>
                   <h3 className="text-3xl font-black text-white">{failedCount + 2}</h3>
                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Failed this month</p>
                </div>
              </div>
            </div>

            {/* Audit Log Table */}
            <div className="bg-slate-900 rounded-2xl shadow-lg border border-slate-800 overflow-hidden">
              <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
                 <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                       <Activity className="w-4 h-4 text-blue-500" />
                       Audit & Compliance Log
                    </h3>
                    <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase">Recent inspection results across all stores</p>
                 </div>
                 <div className="flex gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Live Feed</span>
                 </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-950 text-slate-500 font-black uppercase tracking-widest text-[9px]">
                    <tr>
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Store</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-sm font-mono text-slate-300">
                    {AUDIT_LOGS_MOCK.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-800/50 transition-colors group">
                        <td className="px-6 py-4 text-slate-500 text-xs">
                          {log.id}
                        </td>
                        <td className="px-6 py-4 text-slate-400">
                          {log.date}
                        </td>
                        <td className="px-6 py-4 font-bold text-white group-hover:text-blue-400 transition-colors">
                          {log.store}
                        </td>
                        <td className="px-6 py-4 text-slate-400">
                          {log.type}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest border ${
                            log.status === 'Passed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                            log.status === 'Warning' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                            'bg-red-500/10 text-red-400 border-red-500/20'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default Operations;
