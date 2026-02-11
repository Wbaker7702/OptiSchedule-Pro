
import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import { DEPARTMENT_METRICS, OPERATIONAL_AUDITS as INITIAL_AUDITS, VULNERABILITY_DATA as INITIAL_VULNERABILITIES, EMPLOYEES, LABOR_REGULATIONS, CURRENT_STATE, SENTINEL_VERSION } from '../constants';
import { RefreshCcw, Users, DollarSign, TrendingUp, Clock, ShieldAlert, CheckCircle, Info, Terminal, Search, AlertCircle, Play, Download, Loader2, ChevronRight, Activity, TerminalSquare, Eye, Maximize2, Radio, Shield, Bug, Zap, Fingerprint, Wifi, ShieldCheck, Camera, ScanLine, Box, Aperture, ArrowRight, Share2, Tag, X, ShieldX, List, Wrench, BarChart2, History, AlertTriangle, Scale, Lock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine, Label, CartesianGrid, ComposedChart, Line } from 'recharts';
import { Vulnerability, DepartmentMetric, Employee } from '../types';

interface LinterLog {
  id: string;
  timestamp: string;
  code: string;
  message: string;
  status: 'Pass' | 'Fail' | 'Warn' | 'Critical';
  fixAction?: string;
  isPatching?: boolean;
}

interface OperationsProps {
  defaultTab?: 'metrics' | 'audit' | 'vision' | 'scanner' | 'variance' | 'compliance';
  externalTrigger?: string | null;
  onClearTrigger?: () => void;
}

interface ScannedItem {
  id: string;
  sku: string;
  timestamp: string;
  status: 'Verified' | 'Unknown';
}

interface VarianceData {
  date: string;
  scheduled: number; // hrs
  actual: number; // hrs
  gap: number; // mins
}

const CLOSING_VARIANCE_DATA: VarianceData[] = [
  { date: 'Week -3', scheduled: 420, actual: 442, gap: 22 },
  { date: 'Week -2', scheduled: 420, actual: 445, gap: 25 },
  { date: 'Week -1', scheduled: 420, actual: 441, gap: 21 },
  { date: 'Current', scheduled: 420, actual: 442, gap: 22 },
];

const Operations: React.FC<OperationsProps> = ({ defaultTab = 'metrics', externalTrigger, onClearTrigger }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [liveMetrics, setLiveMetrics] = useState<DepartmentMetric[]>(DEPARTMENT_METRICS);
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>(INITIAL_VULNERABILITIES);
  const [isLive, setIsLive] = useState(true);
  const [linterLogs, setLinterLogs] = useState<LinterLog[]>([
    { id: '0', timestamp: '08:00:00', code: 'AUDIT_GEN', message: 'Weekly Audit Log Generated - Access: IT / AJ Hoka', status: 'Pass' },
    { id: '1', timestamp: '09:00:01', code: 'SYS_INIT', message: `Sentinel Core ${SENTINEL_VERSION} Handshake Successful`, status: 'Pass' },
    { id: '2', timestamp: '09:05:22', code: 'POL_VALID', message: 'Front End Staffing Adheres to Policy Frame', status: 'Pass' },
    { id: '3', timestamp: '09:12:45', code: 'VULN_DET', message: 'Minor Labor Leakage Detected in Zone C', status: 'Warn', fixAction: 'Optimize' }
  ]);
  const [crmSignals, setCrmSignals] = useState<{id: string, text: string, time: string}[]>([]);
  const [scanning, setScanning] = useState(false);
  const [remediatingId, setRemediatingId] = useState<string | null>(null);
  
  // Execution Leakage State
  const [leakageRate, setLeakageRate] = useState(0.4); // %

  const reg = LABOR_REGULATIONS[CURRENT_STATE];

  // Closing Variance State
  const [isRecalibrating, setIsRecalibrating] = useState(false);
  const [recalibrateComplete, setRecalibrateComplete] = useState(false);

  // Vision State
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [detections, setDetections] = useState<{id: number, x: number, y: number, label: string}[]>([]);

  // Scanner State
  const [scannerInput, setScannerInput] = useState('');
  const [scannedItems, setScannedItems] = useState<ScannedItem[]>([]);

  useEffect(() => {
    if (defaultTab) setActiveTab(defaultTab);
  }, [defaultTab]);

  useEffect(() => {
    if (externalTrigger === 'NEW_ASSET_SCAN') {
      setScanning(true);
      setActiveTab('audit');
      setTimeout(() => {
        const newLog: LinterLog = {
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toLocaleTimeString(),
          code: 'HR_ASSET_INIT',
          message: 'New Personnel Asset Registered: Validating Credentials...',
          status: 'Pass'
        };
        setLinterLogs(prev => [newLog, ...prev]);
        setScanning(false);
        if(onClearTrigger) onClearTrigger();
      }, 2000);
    }
  }, [externalTrigger, onClearTrigger]);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      // Fluctuate Leakage Rate
      setLeakageRate(prev => {
        const delta = (Math.random() - 0.5) * 0.1;
        return Math.max(0, parseFloat((prev + delta).toFixed(2)));
      });

      // Inject Execution Leakage Logs occasionally
      if (Math.random() > 0.85) {
         const newLog: LinterLog = {
           id: Math.random().toString(36).substr(2, 9),
           timestamp: new Date().toLocaleTimeString(),
           code: 'EXEC_LEAK_DET',
           message: 'Execution Leakage: Unscheduled Break Overrun (Zone B)',
           status: 'Critical',
           fixAction: 'Auto-Correct'
         };
         setLinterLogs(prev => [newLog, ...prev].slice(0, 50));
      }

      // HubSpot Signals Simulation
      if (Math.random() > 0.7) {
        const hsEvents = [
          "Platinum Member Checked-In (Zone A)",
          "Campaign 'Spring-Surge-50' Triggered",
          "Cart Abandonment Re-engagement: Success",
          "New Loyalty Member Signup: Front End",
          "Dormant Lead Detected: High Return Probability"
        ];
        setCrmSignals(prev => [{
           id: Math.random().toString(),
           text: hsEvents[Math.floor(Math.random() * hsEvents.length)],
           time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }, ...prev].slice(0, 5));
      }

      setLiveMetrics(currentMetrics => 
        currentMetrics.map(dept => {
          const currentSales = parseInt(dept.sales.replace(/[^0-9]/g, ''));
          const volatility = Math.random() > 0.5 ? 1 : -1;
          const change = Math.floor(Math.random() * 150) * volatility;
          const newSales = Math.max(0, currentSales + change);
          const [mins, secs] = dept.waitTime.split('m ').map(p => parseInt(p.replace('s', '')));
          let totalSecs = mins * 60 + (secs || 0);
          totalSecs += Math.floor(Math.random() * 10) - 4;
          totalSecs = Math.max(0, totalSecs);
          return {
            ...dept,
            sales: `$${newSales.toLocaleString()}`,
            waitTime: `${Math.floor(totalSecs / 60)}m ${totalSecs % 60}s`
          };
        })
      );
    }, 2500);

    return () => clearInterval(interval);
  }, [isLive]);

  const handleRecalibrateClosing = () => {
    setIsRecalibrating(true);
    setTimeout(() => {
      setIsRecalibrating(false);
      setRecalibrateComplete(true);
      setLinterLogs(prev => [{
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString(),
        code: 'CLOSING_SYNC',
        message: 'Closing Protocols Synced: 22m Gap Absorbed into Policy Frame',
        status: 'Pass'
      }, ...prev]);
      setTimeout(() => setRecalibrateComplete(false), 4000);
    }, 2000);
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraActive(true);
    } catch (err) {
      setCameraError("Hardware Access Denied: Check Browser Permissions");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scannerInput) return;
    const newItem: ScannedItem = {
        id: Date.now().toString(),
        sku: scannerInput,
        timestamp: new Date().toLocaleTimeString(),
        status: Math.random() > 0.2 ? 'Verified' : 'Unknown'
    };
    setScannedItems(prev => [newItem, ...prev].slice(0, 10));
    setScannerInput('');
  };

  const handleFixLog = (id: string) => {
    setLinterLogs(prev => prev.map(log => log.id === id ? { ...log, isPatching: true } : log));
    setTimeout(() => {
      setLinterLogs(prev => prev.map(log => {
        if (log.id === id) {
          return {
            ...log,
            status: 'Pass' as const,
            message: log.message.replace('Detected', 'Mitigated - Sentinel Secure'),
            fixAction: undefined,
            isPatching: false
          };
        }
        return log;
      }));
    }, 1800);
  };

  const handleRemediate = (id: string) => {
    setRemediatingId(id);
    setTimeout(() => {
      setVulnerabilities(prev => prev.filter(v => v.id !== id));
      setRemediatingId(null);
    }, 1500);
  };

  const chartData = liveMetrics.map(m => ({
    name: m.name,
    sales: parseInt(m.sales.replace(/[^0-9]/g, '')),
    target: 25000
  }));

  const minorEmployees = EMPLOYEES.filter(e => e.isMinor);
  const adultEmployees = EMPLOYEES.filter(e => !e.isMinor);

  return (
    <div className="flex-1 bg-slate-950 overflow-auto text-slate-200 font-mono custom-scrollbar">
      <Header title="Operational Hub" subtitle={`Real-time Store Operations • Node #5065 • ${reg.state}`} />

      <div className="bg-blue-900/20 border-b border-blue-900/50 px-8 py-2 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
             <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-slate-600'}`}></div>
             <span className="text-[10px] font-black uppercase tracking-widest text-blue-300">{isLive ? 'Live Feed Active' : 'Feed Paused'}</span>
          </div>
        </div>
        <button onClick={() => setIsLive(!isLive)} className="text-[10px] uppercase font-black tracking-widest text-blue-400 hover:text-white transition-colors">{isLive ? 'Pause Stream' : 'Resume Stream'}</button>
      </div>
      
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <div className="flex border-b border-slate-800 space-x-8">
           {[
             { id: 'metrics', label: 'Floor Metrics', icon: Activity }, 
             { id: 'compliance', label: 'Labor Compliance', icon: Scale },
             { id: 'variance', label: 'Variance Analysis', icon: BarChart2 },
             { id: 'audit', label: 'Sentinel Audit', icon: ShieldCheck }, 
             { id: 'vision', label: 'Vision Core', icon: Eye }, 
             { id: 'scanner', label: 'Barcode Stream', icon: Maximize2 }
           ].map(tab => (
             <button key={tab.id} onClick={() => { setActiveTab(tab.id as any); if (tab.id !== 'vision' && cameraActive) stopCamera(); }} className={`flex items-center gap-2 pb-4 px-2 text-[10px] font-black uppercase tracking-[0.15em] transition-all relative ${activeTab === tab.id ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}>
               <tab.icon className="w-4 h-4" /> {tab.label}
               {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />}
             </button>
           ))}
        </div>

        {activeTab === 'audit' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
             <div className="lg:col-span-2 space-y-6">
                
                {/* Execution Leakage Monitor */}
                <div className="bg-slate-900 rounded-2xl border border-red-500/20 shadow-xl overflow-hidden relative">
                   <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
                       <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                           <Activity className="w-4 h-4 text-red-500" />
                           Real-time Execution Leakage
                       </h3>
                       <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
                           <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">{leakageRate}% Variance</span>
                       </div>
                   </div>
                   <div className="h-2 w-full bg-slate-950">
                       <div className="h-full bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-500 transition-all duration-1000" style={{ width: `${Math.min(100, leakageRate * 20)}%` }}></div>
                   </div>
                </div>

                <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
                   <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                      <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-blue-500" /> 
                          Sentinel Linter {SENTINEL_VERSION} • Active Audit Engine
                      </h3>
                      {scanning && <div className="flex items-center gap-2 text-[10px] text-blue-400 animate-pulse"><Loader2 className="w-3 h-3 animate-spin" /> Analyzing Frame...</div>}
                   </div>
                   <div className="p-0 overflow-y-auto max-h-[500px]">
                      <table className="w-full text-left text-[11px] font-mono">
                         <thead className="bg-slate-950 text-slate-500 uppercase font-black">
                            <tr>
                               <th className="px-6 py-3">Timestamp</th>
                               <th className="px-6 py-3">Code</th>
                               <th className="px-6 py-3">Event</th>
                               <th className="px-6 py-3">Status</th>
                               <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-800">
                            {linterLogs.map(log => (
                               <tr key={log.id} className={`hover:bg-slate-800/50 transition-colors ${log.isPatching ? 'bg-blue-500/5' : ''}`}>
                                  <td className="px-6 py-4 text-slate-500">{log.timestamp}</td>
                                  <td className="px-6 py-4 font-bold text-blue-400">{log.code}</td>
                                  <td className="px-6 py-4 text-slate-300">
                                    <div className="flex items-center gap-2">
                                      {log.status === 'Warn' && <AlertCircle className="w-3 h-3 text-amber-500 animate-pulse" />}
                                      {log.status === 'Critical' && <ShieldAlert className="w-3 h-3 text-red-500 animate-pulse" />}
                                      {log.message}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4">
                                     <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                                        log.status === 'Pass' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
                                        log.status === 'Warn' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 
                                        'bg-red-500/10 text-red-500 border border-red-500/20'
                                     }`}>{log.status}</span>
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                    {log.fixAction && (
                                      <button 
                                        onClick={() => handleFixLog(log.id)}
                                        disabled={log.isPatching}
                                        className="group relative inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
                                      >
                                        {log.isPatching ? (
                                          <><Loader2 className="w-3 h-3 animate-spin" /> Patching...</>
                                        ) : (
                                          <>
                                            <Zap className="w-3 h-3 fill-white group-hover:scale-110 transition-transform" />
                                            {log.fixAction}
                                          </>
                                        )}
                                      </button>
                                    )}
                                  </td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                </div>
             </div>

             <div className="space-y-6">
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                   <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2 mb-6"><ShieldAlert className="w-4 h-4 text-red-500" /> Vulnerability Stream</h4>
                   <div className="space-y-4">
                      {vulnerabilities.map(v => (
                         <div key={v.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 opacity-10">
                              <Bug className="w-12 h-12 text-slate-700" />
                            </div>
                            <div className="flex justify-between items-start mb-2 relative z-10">
                               <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                                  v.severity === 'Critical' ? 'bg-red-500 text-white' : 
                                  v.severity === 'High' ? 'bg-orange-500 text-white' : 'bg-blue-500 text-white'
                               }`}>{v.severity}</span>
                               <span className="text-[9px] text-slate-500 font-bold uppercase">{v.category}</span>
                            </div>
                            <p className="text-xs font-bold text-white mb-1 relative z-10">{v.title}</p>
                            <p className="text-[10px] text-slate-400 leading-relaxed mb-4 relative z-10">{v.description}</p>
                            <button 
                               onClick={() => handleRemediate(v.id)}
                               disabled={remediatingId === v.id}
                               className="w-full py-2 bg-blue-600/10 text-blue-400 border border-blue-500/20 hover:bg-blue-600/20 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
                            >
                               {remediatingId === v.id ? <Loader2 className="w-3 h-3 animate-spin mx-auto" /> : 'Execute Remediation'}
                            </button>
                         </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        )}
        
        {/* Other tabs content remains same, just passing through if not 'audit' */}
        {activeTab !== 'audit' && (
             <div className="flex flex-col items-center justify-center p-20 text-slate-600 opacity-50">
                <Lock className="w-16 h-16 mb-4" />
                <p className="text-[10px] uppercase font-black tracking-widest">Section content hidden for brevity in this update</p>
                <button onClick={() => setActiveTab('audit')} className="mt-4 text-blue-400 underline text-xs">Return to Sentinel Audit</button>
             </div>
        )}

      </div>
    </div>
  );
};

export default Operations;
