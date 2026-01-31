import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import { DEPARTMENT_METRICS, OPERATIONAL_AUDITS as INITIAL_AUDITS, VULNERABILITY_DATA as INITIAL_VULNERABILITIES } from '../constants';
import { RefreshCcw, Users, DollarSign, TrendingUp, Clock, ShieldAlert, CheckCircle, Info, Terminal, Search, AlertCircle, Play, Download, Loader2, ChevronRight, Activity, TerminalSquare, Eye, Maximize2, Radio, Shield, Bug, Zap, Fingerprint } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine, Label, CartesianGrid } from 'recharts';
import { Vulnerability } from '../types';

interface LinterLog {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface OperationsProps {
  defaultTab?: 'metrics' | 'audit' | 'vision' | 'scanner';
  externalTrigger?: string | null;
  onClearTrigger?: () => void;
}

const Operations: React.FC<OperationsProps> = ({ defaultTab = 'metrics', externalTrigger, onClearTrigger }) => {
  const [activeTab, setActiveTab] = useState<'metrics' | 'audit' | 'vision' | 'scanner'>(defaultTab);
  const [audits, setAudits] = useState(INITIAL_AUDITS);
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>(INITIAL_VULNERABILITIES);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [fixingId, setFixingId] = useState<string | null>(null);
  const [linterLogs, setLinterLogs] = useState<LinterLog[]>([]);
  const [executionCount, setExecutionCount] = useState(1);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Vision state
  const [activeCamera, setActiveCamera] = useState('CAM_01_CHECKOUT');

  // Chart Data Preparation
  const salesData = DEPARTMENT_METRICS.map(dept => ({
    name: dept.name,
    sales: parseInt(dept.sales.replace(/[^0-9]/g, '')),
    originalSales: dept.sales
  }));

  const averageSales = salesData.reduce((acc, curr) => acc + curr.sales, 0) / salesData.length;

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [linterLogs]);

  useEffect(() => {
    if (activeTab === 'audit') {
      if (linterLogs.length === 0) {
        addLog(`[EXECUTION #${executionCount}] Baseline Sentinel diagnostic scan initialized.`, 'info');
        setTimeout(() => {
          addLog(`System check complete. ${audits.length} variances found. Integrity Score: 88%.`, 'warning');
        }, 600);
      }
    }
    if (activeTab === 'scanner') {
        addLog(`Vulnerability Node Online. Initializing deep scan of Store 5065 operational framework...`, 'info');
    }
    if (activeTab === 'vision') {
        addLog(`Sentinel Floor Vision link established. Authenticating stream for ${activeCamera}...`, 'info');
        setTimeout(() => addLog(`Stream secure. Real-time telemetry overlay active.`, 'success'), 1200);
    }
  }, [activeTab]);

  // Handle External Triggers (e.g. from Team page)
  useEffect(() => {
    if (externalTrigger && activeTab === 'audit') {
       if (externalTrigger === 'NEW_ASSET_SCAN') {
           addLog('[TRIGGER] Sentinel Event: New Personnel Asset detected in registry.', 'info');
           setTimeout(() => addLog('Initializing background check & protocol verification...', 'warning'), 600);
           setTimeout(() => addLog('D365 HR Sync: Profile validated. 401(k) & Benefits logic mapped.', 'success'), 1400);
           setTimeout(() => addLog('HubSpot CRM: Access Role Provisioned (Sales/Service).', 'success'), 1800);
           setTimeout(() => addLog('Sentinel Policy: Asset cleared for scheduling.', 'success'), 2200);
       }
       if (onClearTrigger) onClearTrigger();
    }
  }, [externalTrigger, activeTab]);

  const addLog = (message: string, type: LinterLog['type']) => {
    const newLog: LinterLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      message,
      type
    };
    setLinterLogs(prev => [...prev, newLog]);
  };

  const handleQuickFix = (id: string) => {
    const audit = audits.find(a => a.id === id);
    setFixingId(id);
    addLog(`Protocol Trigger: Enforcing standard for variance ${audit?.code}.`, 'info');
    
    setTimeout(() => {
      setAudits(prev => prev.filter(a => a.id !== id));
      setFixingId(null);
      addLog(`REMEDIATION SUCCESS: ${audit?.code} cleared in real-time.`, 'success');
    }, 800);
  };

  const handlePatchVulnerability = (id: string) => {
    setFixingId(id);
    const vul = vulnerabilities.find(v => v.id === id);
    addLog(`SENTINEL_PATCH: Hardening vulnerability [${vul?.title}]...`, 'info');
    
    setTimeout(() => {
      setVulnerabilities(prev => prev.map(v => v.id === id ? {...v, status: 'Patched'} : v));
      setFixingId(null);
      addLog(`HARDENING SUCCESS: Vector ${id} mitigated and locked.`, 'success');
    }, 1500);
  };

  const initiateDeepScan = () => {
    setIsScanning(true);
    addLog(`[SECURITY_SCAN] Initiating Deep Operational Audit of Sentinel Nodes...`, 'info');
    setTimeout(() => {
      setIsScanning(false);
      addLog(`Scan complete. ${vulnerabilities.filter(v => v.status === 'Detected').length} vectors identified requiring intervention.`, 'warning');
    }, 3000);
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      <Header title="Operations Hub" subtitle="Enterprise Edition 3.3.0 • Sentinel Hardened Infrastructure" />

      <div className="p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Sub Navigation */}
        <div className="flex items-center gap-4 border-b border-gray-200">
           <button 
             onClick={() => setActiveTab('metrics')}
             className={`px-4 py-3 text-sm font-bold transition-all relative ${activeTab === 'metrics' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
           >
             Department Performance
             {activeTab === 'metrics' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />}
           </button>
           <button 
             onClick={() => setActiveTab('vision')}
             className={`px-4 py-3 text-sm font-bold transition-all relative flex items-center gap-2 ${activeTab === 'vision' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
           >
             <Eye className="w-4 h-4" />
             Floor Vision
             {activeTab === 'vision' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />}
           </button>
           <button 
             onClick={() => setActiveTab('scanner')}
             className={`px-4 py-3 text-sm font-bold transition-all relative flex items-center gap-2 ${activeTab === 'scanner' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
           >
             <Shield className="w-4 h-4" />
             Vulnerability Scanner
             {vulnerabilities.filter(v => v.status === 'Detected').length > 0 && (
                <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {vulnerabilities.filter(v => v.status === 'Detected').length}
                </span>
             )}
             {activeTab === 'scanner' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />}
           </button>
           <button 
             onClick={() => setActiveTab('audit')}
             className={`px-4 py-3 text-sm font-bold transition-all relative flex items-center gap-2 ${activeTab === 'audit' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
           >
             <Terminal className="w-4 h-4" />
             Operational Linter
             {activeTab === 'audit' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />}
           </button>
        </div>

        {activeTab === 'metrics' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {DEPARTMENT_METRICS.map((dept, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden group">
                   <div className="p-5">
                       <div className="flex justify-between items-center mb-5">
                          <div className="flex items-center gap-3">
                             <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                                 index % 3 === 0 ? 'bg-blue-50 text-blue-600' : 
                                 index % 3 === 1 ? 'bg-purple-50 text-purple-600' : 
                                 'bg-emerald-50 text-emerald-600'
                             }`}>
                                 {dept.name.substring(0, 2).toUpperCase()}
                             </div>
                             <div>
                                 <h3 className="font-bold text-gray-900">{dept.name}</h3>
                                 <p className="text-xs text-gray-500">Floor Section {index + 1}</p>
                             </div>
                          </div>
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-50/80 p-3 rounded-lg border border-gray-100">
                            <div className="flex items-center gap-1.5 mb-2 text-gray-500">
                                <Users className="w-3.5 h-3.5" />
                                <span className="text-xs font-medium uppercase tracking-wide">Staff</span>
                            </div>
                            <p className="font-bold text-gray-900 text-lg">{dept.activeStaff}</p>
                          </div>
                           <div className="bg-gray-50/80 p-3 rounded-lg border border-gray-100">
                            <div className="flex items-center gap-1.5 mb-2 text-gray-500">
                                <DollarSign className="w-3.5 h-3.5" />
                                <span className="text-xs font-medium uppercase tracking-wide">Sales</span>
                            </div>
                            <p className="font-bold text-gray-900 text-lg">{dept.sales}</p>
                          </div>
                       </div>
                   </div>
                </div>
              ))}
            </div>

            {/* Sales by Department Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="font-black text-gray-900 uppercase tracking-widest text-sm">Sales Distribution Analysis</h3>
                        <p className="text-xs text-gray-500 mt-1">Departmental revenue vs. Store Average</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold">
                        <div className="w-3 h-3 bg-emerald-500 rounded-sm"></div>
                        <span className="text-gray-600">Above Avg</span>
                        <div className="w-3 h-3 bg-blue-500 rounded-sm ml-2"></div>
                        <span className="text-gray-600">Below Avg</span>
                    </div>
                </div>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b', fontWeight: 'bold'}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b', fontWeight: 'bold'}} tickFormatter={(value) => `$${value/1000}k`} />
                            <Tooltip
                                cursor={{fill: '#f8fafc'}}
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const data = payload[0].payload;
                                        return (
                                            <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl border border-slate-800">
                                                <p className="font-bold text-xs uppercase tracking-wider mb-1 text-slate-400">{data.name}</p>
                                                <p className="font-black text-lg">{data.originalSales}</p>
                                                <p className={`text-[10px] font-bold mt-1 ${data.sales > averageSales ? 'text-emerald-400' : 'text-blue-400'}`}>
                                                    {data.sales > averageSales ? `+${Math.round(((data.sales - averageSales) / averageSales) * 100)}% vs Avg` : `${Math.round(((data.sales - averageSales) / averageSales) * 100)}% vs Avg`}
                                                </p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <ReferenceLine y={averageSales} stroke="#fbbf24" strokeDasharray="3 3">
                                <Label value="AVG" position="insideTopLeft" fill="#fbbf24" fontSize={10} fontWeight="bold" />
                            </ReferenceLine>
                            <Bar dataKey="sales" radius={[4, 4, 0, 0]}>
                                {salesData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.sales > averageSales ? '#10b981' : '#3b82f6'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'scanner' && (
          <div className="space-y-6 animate-in fade-in duration-500">
             <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                    <Fingerprint className="w-64 h-64 text-blue-500" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                   <div className="max-w-xl">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                            <Bug className="w-6 h-6 text-red-500" />
                        </div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Sentinel Vulnerability Scanner</h2>
                      </div>
                      <p className="text-slate-400 text-sm leading-relaxed font-mono">
                        Analyzing operational vectors for potential ROI leakage and protocol deviations. Patching identified vulnerabilities reinforces the <span className="text-blue-400">Sentinel Security Policy</span>.
                      </p>
                   </div>
                   <button 
                     onClick={initiateDeepScan}
                     disabled={isScanning}
                     className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-600/20 flex items-center gap-3 disabled:opacity-50"
                   >
                     {isScanning ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                     {isScanning ? 'Deep Scanning...' : 'Initiate Deep Scan'}
                   </button>
                </div>
             </div>

             <div className="grid grid-cols-1 gap-4">
                {vulnerabilities.map((vul) => (
                  <div key={vul.id} className={`bg-white rounded-xl border p-6 shadow-sm transition-all flex flex-col md:flex-row items-center justify-between gap-6 ${vul.status === 'Patched' ? 'opacity-60 border-emerald-100 bg-emerald-50/10' : 'border-gray-200'}`}>
                     <div className="flex items-start gap-5 flex-1">
                        <div className={`p-4 rounded-xl shrink-0 ${
                            vul.status === 'Patched' ? 'bg-emerald-100 text-emerald-600' :
                            vul.severity === 'Critical' ? 'bg-red-100 text-red-600' :
                            vul.severity === 'High' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                           {vul.status === 'Patched' ? <CheckCircle className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                        </div>
                        <div>
                           <div className="flex items-center gap-3 mb-1">
                              <h4 className="font-black text-gray-900 uppercase tracking-tight">{vul.title}</h4>
                              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                                 vul.status === 'Patched' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'
                              }`}>{vul.status}</span>
                              <span className="text-[10px] text-gray-400 font-mono font-bold uppercase tracking-widest">{vul.category} Vector</span>
                           </div>
                           <p className="text-xs text-gray-600 leading-relaxed max-w-2xl">{vul.description}</p>
                           {vul.status === 'Detected' && (
                             <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mt-2">Remediation: {vul.remediation}</p>
                           )}
                        </div>
                     </div>
                     <button 
                       onClick={() => handlePatchVulnerability(vul.id)}
                       disabled={vul.status === 'Patched' || fixingId === vul.id}
                       className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap min-w-[160px] flex items-center justify-center gap-2 ${
                          vul.status === 'Patched' 
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-default' 
                          : 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg'
                       }`}
                     >
                        {fixingId === vul.id ? <Loader2 className="w-3 h-3 animate-spin" /> : vul.status === 'Patched' ? <CheckCircle className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                        {fixingId === vul.id ? 'Patching...' : vul.status === 'Patched' ? 'Vector Secure' : 'Patch & Harden'}
                     </button>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* Existing tabs (audit, vision) continue below... */}
        {activeTab === 'audit' && (
          <div className="space-y-6 animate-in fade-in duration-500">
             <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                    <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-600 rounded-lg">
                        <Terminal className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold">Operational Linter v3.1</h3>
                        <p className="text-slate-400 text-xs mt-0.5 font-mono">Dynamics & HubSpot telemetry analysis...</p>
                    </div>
                    </div>
                </div>
                <div className="p-0 min-h-[300px] relative">
                    <table className="w-full text-left font-mono">
                    <thead className="bg-slate-800/30 text-slate-500 text-[10px] uppercase tracking-widest border-b border-slate-800">
                        <tr>
                            <th className="px-6 py-3">Severity</th>
                            <th className="px-6 py-3">Audit Code</th>
                            <th className="px-6 py-3">Diagnostic Message</th>
                            <th className="px-6 py-3">Entity</th>
                            <th className="px-6 py-3 text-right">Fix Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {audits.map((audit) => (
                            <tr key={audit.id} className="hover:bg-slate-800/20 group transition-colors">
                            <td className="px-6 py-4">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                    audit.severity === 'error' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                    audit.severity === 'warning' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                                    'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                }`}>
                                    {audit.severity}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-slate-300 text-xs">{audit.code}</td>
                            <td className="px-6 py-4 text-white text-xs font-medium">{audit.message}</td>
                            <td className="px-6 py-4 text-slate-500 text-xs italic">{audit.file}</td>
                            <td className="px-6 py-4 text-right">
                                {audit.fix !== 'No action' && (
                                    <button 
                                        onClick={() => handleQuickFix(audit.id)}
                                        className="text-blue-400 hover:text-white flex items-center gap-1.5 text-[10px] font-bold ml-auto bg-blue-500/10 px-3 py-1 rounded-md border border-blue-500/20 hover:bg-blue-500/30 transition-all uppercase"
                                    >
                                        <Play className="w-3 h-3" /> {audit.fix}
                                    </button>
                                )}
                                {audit.fix === 'No action' && (
                                   <span className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">Logged</span>
                                )}
                            </td>
                            </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'vision' && (
          <div className="animate-in fade-in zoom-in-95 duration-500 space-y-6">
             <div className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative aspect-video group">
                <div className="absolute inset-0 z-10 pointer-events-none p-6 flex flex-col justify-between">
                   <div className="flex justify-between items-start">
                      <div className="bg-red-600 text-white px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest flex items-center gap-2 animate-pulse">
                         <Radio className="w-3 h-3" /> REC
                      </div>
                      <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 text-white">
                         <p className="text-[10px] font-mono font-bold tracking-widest">{activeCamera}</p>
                         <p className="text-[9px] font-mono text-slate-400 mt-0.5">LATENCY: 42ms • AI_OVERLAY: ACTIVE</p>
                      </div>
                   </div>
                </div>
                <div className="absolute inset-0 bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full bg-slate-900/50 relative">
                        <div className="absolute inset-0" style={{backgroundImage: 'linear-gradient(#ffffff05 1px, transparent 1px), linear-gradient(90deg, #ffffff05 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                            <Activity className="w-12 h-12 text-slate-800 mx-auto mb-4 animate-pulse" />
                            <p className="text-slate-700 font-mono text-[10px] font-bold uppercase tracking-[0.4em]">Floor Vision Stream active</p>
                        </div>
                    </div>
                </div>
             </div>
          </div>
        )}

        {/* Unified Activity Feed */}
        <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
          <div className="px-6 py-3 border-b border-slate-800 bg-slate-900/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TerminalSquare className="w-4 h-4 text-emerald-500" />
                <h4 className="text-white text-[10px] font-black uppercase tracking-widest">Sentinel Operational Logs</h4>
              </div>
          </div>
          <div className="h-44 overflow-y-auto p-4 font-mono text-[11px] custom-scrollbar bg-[#020617] selection:bg-blue-500/30">
              <div className="space-y-1.5">
                {linterLogs.map((log) => (
                  <div key={log.id} className="flex gap-3 animate-in fade-in slide-in-from-bottom-1 duration-300 group">
                      <span className="text-slate-600 shrink-0 font-bold">[{log.timestamp}]</span>
                      <div className="flex items-start gap-2">
                        <ChevronRight className={`w-3 h-3 mt-0.5 ${
                            log.type === 'error' ? 'text-red-500' :
                            log.type === 'warning' ? 'text-orange-500' :
                            log.type === 'success' ? 'text-emerald-500' : 'text-blue-500'
                        }`} />
                        <span className={`leading-relaxed ${
                            log.type === 'error' ? 'text-red-400 font-bold' :
                            log.type === 'warning' ? 'text-orange-300' :
                            log.type === 'success' ? 'text-emerald-400' : 'text-slate-300'
                        }`}>
                            {log.message}
                        </span>
                      </div>
                  </div>
                ))}
                <div ref={logEndRef} />
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Operations;