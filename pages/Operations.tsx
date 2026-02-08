
import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import { DEPARTMENT_METRICS, OPERATIONAL_AUDITS as INITIAL_AUDITS, VULNERABILITY_DATA as INITIAL_VULNERABILITIES, EMPLOYEES, LABOR_REGULATIONS, CURRENT_STATE } from '../constants';
import { RefreshCcw, Users, DollarSign, TrendingUp, Clock, ShieldAlert, CheckCircle, Info, Terminal, Search, AlertCircle, Play, Download, Loader2, ChevronRight, Activity, TerminalSquare, Eye, Maximize2, Radio, Shield, Bug, Zap, Fingerprint, Wifi, ShieldCheck, Camera, ScanLine, Box, Aperture, ArrowRight, Share2, Tag, X, ShieldX, List, Wrench, BarChart2, History, AlertTriangle, Scale } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine, Label, CartesianGrid, ComposedChart, Line } from 'recharts';
import { Vulnerability, DepartmentMetric, Employee } from '../types';

interface LinterLog {
  id: string;
  timestamp: string;
  code: string;
  message: string;
  status: 'Pass' | 'Fail' | 'Warn';
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
    { id: '1', timestamp: '09:00:01', code: 'SYS_INIT', message: 'Sentinel Core v3.4.1 Handshake Successful', status: 'Pass' },
    { id: '2', timestamp: '09:05:22', code: 'POL_VALID', message: 'Front End Staffing Adheres to Policy Frame', status: 'Pass' },
    { id: '3', timestamp: '09:12:45', code: 'VULN_DET', message: 'Minor Labor Leakage Detected in Zone C', status: 'Warn', fixAction: 'Optimize' }
  ]);
  const [crmSignals, setCrmSignals] = useState<{id: string, text: string, time: string}[]>([]);
  const [scanning, setScanning] = useState(false);
  const [remediatingId, setRemediatingId] = useState<string | null>(null);

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

        {activeTab === 'compliance' && (
          <div className="space-y-8 animate-in fade-in duration-500">
             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden group">
                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Registry Adults</p>
                   <h2 className="text-4xl font-black text-white">{adultEmployees.length}</h2>
                   <p className="text-[10px] text-blue-400 font-bold mt-2 uppercase">Standard Capacity</p>
                </div>
                <div className="bg-slate-900 rounded-2xl p-6 border border-orange-500/30 shadow-xl relative overflow-hidden group">
                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Registry Minors</p>
                   <h2 className="text-4xl font-black text-orange-500">{minorEmployees.length}</h2>
                   <p className="text-[10px] text-orange-400 font-bold mt-2 uppercase">P.A. 90 Watch-list</p>
                </div>
                <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden group col-span-2">
                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">MI Jurisdiction Active</p>
                   <div className="flex gap-4 items-center">
                      <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                        <span className="text-[9px] font-black uppercase text-slate-500">14-15 Curfew</span>
                        <p className="text-xs font-black text-orange-400">{reg.curfewMinor1415}</p>
                      </div>
                      <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                        <span className="text-[9px] font-black uppercase text-slate-500">16-17 Curfew</span>
                        <p className="text-xs font-black text-amber-500">{reg.curfewMinor1617}</p>
                      </div>
                   </div>
                </div>
             </div>

             <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                   <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                      <Users className="w-4 h-4 text-orange-500" />
                      Personnel Watch-list: Minor Compliance
                   </h3>
                   <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Auto-Guard Active</span>
                   </div>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left text-[11px] font-mono">
                      <thead className="bg-slate-950 text-slate-500 uppercase font-black">
                         <tr>
                            <th className="px-6 py-4">Employee Signature</th>
                            <th className="px-6 py-4 text-center">Age</th>
                            <th className="px-6 py-4">Constraint Framework ({reg.state})</th>
                            <th className="px-6 py-4">Curfew Guard</th>
                            <th className="px-6 py-4 text-right">Sentinel Status</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                         {minorEmployees.map(emp => (
                            <tr key={emp.id} className="hover:bg-slate-800/30 transition-colors">
                               <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                     <img src={emp.avatar} className="w-8 h-8 rounded-lg border border-slate-700" />
                                     <div>
                                        <p className="text-white font-black uppercase text-xs">{emp.name}</p>
                                        <p className="text-[9px] text-slate-500 font-bold uppercase">{emp.role}</p>
                                     </div>
                                  </div>
                               </td>
                               <td className="px-6 py-4 text-center font-black text-orange-400">{emp.age}</td>
                               <td className="px-6 py-4">
                                  <div className="flex flex-col gap-1">
                                     <span className="text-[10px] text-slate-300 font-bold uppercase">Max Shift: {emp.age < 16 ? reg.maxShiftMinor1415 : reg.maxShiftMinor1617}h</span>
                                     <span className="text-[9px] text-slate-500 font-black uppercase">Mandatory Break: {reg.mandatoryBreakDuration}m @ {reg.mandatoryBreakThreshold}h</span>
                                  </div>
                               </td>
                               <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                     <Clock className="w-3 h-3 text-amber-500" />
                                     <span className="text-[10px] text-amber-500 font-black uppercase">
                                        {emp.age < 16 ? reg.curfewMinor1415 : reg.curfewMinor1617}
                                     </span>
                                  </div>
                               </td>
                               <td className="px-6 py-4 text-right">
                                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded text-[9px] font-black uppercase tracking-widest">Secured</span>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
                <div className="p-4 bg-slate-950 border-t border-slate-800 text-[9px] text-slate-500 flex justify-between items-center uppercase font-black">
                   <span>Syncing with {reg.state} P.A. 90 Frame v1.0.4</span>
                   <span className="text-blue-400">Total Minors: {minorEmployees.length}</span>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'variance' && (
          <div className="space-y-8 animate-in fade-in duration-500">
             {/* Hero Cards for Variance */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 rounded-2xl p-6 border border-red-500/20 shadow-xl relative overflow-hidden group">
                   <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform">
                      <Clock className="w-24 h-24 text-red-500" />
                   </div>
                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Avg. Closing Gap</p>
                   <h2 className="text-4xl font-black text-white">22m</h2>
                   <p className="text-[10px] text-red-400 font-bold mt-2 uppercase">Unscheduled Labor (Daily)</p>
                </div>
                <div className="bg-slate-900 rounded-2xl p-6 border border-blue-500/20 shadow-xl relative overflow-hidden group">
                   <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform">
                      <DollarSign className="w-24 h-24 text-blue-500" />
                   </div>
                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Weekly Leakage</p>
                   <h2 className="text-4xl font-black text-white">$420.50</h2>
                   <p className="text-[10px] text-blue-400 font-bold mt-2 uppercase">Fiscal Extraction Potential</p>
                </div>
                <div className="bg-slate-900 rounded-2xl p-6 border border-emerald-500/20 shadow-xl relative overflow-hidden group">
                   <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform">
                      <ShieldCheck className="w-24 h-24 text-emerald-500" />
                   </div>
                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">OT Trigger Risk</p>
                   <h2 className="text-4xl font-black text-white">High</h2>
                   <p className="text-[10px] text-emerald-400 font-bold mt-2 uppercase">Sentinel Alert Threshold</p>
                </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Variance Chart */}
                <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 p-8 shadow-2xl">
                   <div className="flex justify-between items-center mb-8">
                      <div>
                         <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                            <History className="w-4 h-4 text-blue-500" />
                            3-Week Closing Lookback
                         </h3>
                         <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase">Actual Out-Time vs Policy Target</p>
                      </div>
                   </div>
                   <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                         <ComposedChart data={CLOSING_VARIANCE_DATA}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b', fontWeight: 'bold'}} />
                            <YAxis hide />
                            <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px'}} />
                            <Bar dataKey="gap" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={40} name="Gap (Minutes)" />
                            <Line type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} name="Actual Hours" />
                         </ComposedChart>
                      </ResponsiveContainer>
                   </div>
                </div>

                {/* Recommendations */}
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 shadow-2xl flex flex-col justify-between">
                   <div className="space-y-6">
                      <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-3 border-b border-slate-800 pb-4">
                         <Zap className="w-4 h-4 text-amber-500" />
                         Strategy Insight
                      </h3>
                      <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl space-y-3">
                         <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-400" />
                            <span className="text-[10px] font-black text-red-400 uppercase">Unscheduled Gap Detected</span>
                         </div>
                         <p className="text-[11px] text-slate-400 leading-relaxed italic">
                            Closers average <span className="text-white font-bold">22 minutes</span> of cleaning post-lock. This unscheduled block triggers weekly OT alerts.
                         </p>
                      </div>
                      <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl space-y-3">
                         <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                            <span className="text-[10px] font-black text-emerald-400 uppercase">Proposed Recalibration</span>
                         </div>
                         <p className="text-[11px] text-slate-400 leading-relaxed">
                            Shift scheduled end time from <span className="text-white">9:00 PM</span> to <span className="text-emerald-400">9:30 PM</span> to absorb the gap and prevent emergency OT alerts.
                         </p>
                      </div>
                   </div>
                   
                   <button 
                      onClick={handleRecalibrateClosing}
                      disabled={isRecalibrating}
                      className={`w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 mt-8 shadow-2xl ${
                         recalibrateComplete 
                         ? 'bg-emerald-500 text-white' 
                         : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20 active:scale-95'
                      }`}
                   >
                      {isRecalibrating ? (
                         <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Processing Synapses...
                         </>
                      ) : recalibrateComplete ? (
                         <>
                            <CheckCircle className="w-4 h-4" />
                            Protocol Hardened
                         </>
                      ) : (
                         <>
                            <Wrench className="w-4 h-4" />
                            Recalibrate Protocols
                         </>
                      )}
                   </button>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'metrics' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
             <div className="lg:col-span-2 space-y-6">
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl">
                   <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-2 mb-8"><TrendingUp className="w-4 h-4 text-emerald-400" /> Sales Velocity</h3>
                   <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 700}} />
                          <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b'}} />
                          <Bar dataKey="sales">
                             {chartData.map((e, i) => <Cell key={i} fill={e.sales > 25000 ? '#10b981' : '#3b82f6'} />)}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {liveMetrics.slice(0, 4).map(m => (
                       <div key={m.name} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex justify-between items-center group hover:border-blue-500/30 transition-all">
                          <div><p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{m.name}</p><p className="text-xl font-black text-white">{m.sales}</p></div>
                          <div className="text-right"><p className="text-[9px] text-slate-500 uppercase font-black">Wait Time</p><p className="text-xs font-bold text-blue-400">{m.waitTime}</p></div>
                       </div>
                    ))}
                </div>
             </div>

             <div className="space-y-6">
                <div className="bg-orange-500/5 rounded-xl border border-orange-500/20 p-5">
                   <h4 className="text-[10px] font-black text-orange-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
                      <Share2 className="w-4 h-4" /> HubSpot CRM Signals
                   </h4>
                   <div className="space-y-4">
                      {crmSignals.length === 0 ? (
                        <p className="text-[9px] text-slate-600 italic">Awaiting Hub Handshake...</p>
                      ) : (
                        crmSignals.map(sig => (
                           <div key={sig.id} className="flex gap-3 border-l-2 border-orange-500/30 pl-3 py-1">
                              <div className="mt-1"><Tag className="w-3 h-3 text-orange-400" /></div>
                              <div>
                                 <p className="text-[10px] text-orange-200 font-bold leading-relaxed">{sig.text}</p>
                                 <p className="text-[9px] text-orange-500 font-mono mt-0.5">{sig.time}</p>
                              </div>
                           </div>
                        ))
                      )}
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
             <div className="lg:col-span-2 space-y-6">
                <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
                   <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                      <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-blue-500" /> Sentinel Linter Log</h3>
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
                                      {log.message}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4">
                                     <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                                        log.status === 'Pass' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
                                        log.status === 'Warn' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
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

        {activeTab === 'vision' && (
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl animate-in fade-in duration-500">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
               <div>
                  <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-2"><Eye className="w-4 h-4 text-blue-400" /> Sentinel Vision Core</h3>
                  <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase">Computer Vision Entity Tracking</p>
               </div>
               <div className="flex items-center gap-4">
                  {cameraActive && <div className="flex items-center gap-2"><Radio className="w-3 h-3 text-red-500 animate-pulse" /><span className="text-[10px] text-slate-400 font-black uppercase">Live Analytics Stream</span></div>}
                  <button onClick={cameraActive ? stopCamera : startCamera} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${cameraActive ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'}`}>
                     {cameraActive ? <><X className="w-3 h-3" /> Terminate Feed</> : <><Camera className="w-3 h-3" /> Initialize Lens</>}
                  </button>
               </div>
            </div>
            <div className="p-8 flex flex-col items-center">
               <div className="relative w-full max-w-2xl aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
                  {cameraActive ? (
                    <>
                      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                      <div className="absolute inset-0 pointer-events-none">
                         {detections.map(det => (
                            <div key={det.id} className="absolute border-2 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-300" style={{ left: `${det.x}%`, top: `${det.y}%`, width: '10%', height: '10%' }}>
                               <span className="absolute -top-6 left-0 bg-blue-600 text-white text-[8px] px-1.5 py-0.5 font-bold uppercase whitespace-nowrap">{det.label}</span>
                            </div>
                         ))}
                         <div className="absolute top-0 left-0 w-full h-full border-[20px] border-transparent border-t-blue-500/20 border-l-blue-500/20 opacity-30 animate-pulse"></div>
                         <div className="absolute bottom-0 right-0 w-full h-full border-[20px] border-transparent border-b-blue-500/20 border-r-blue-500/20 opacity-30 animate-pulse"></div>
                         <div className="absolute top-1/2 left-0 w-full h-px bg-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.3)]"></div>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-700 space-y-4">
                       <Aperture className="w-16 h-16 opacity-20" />
                       <div className="text-center">
                          <p className="text-[10px] font-black uppercase tracking-[0.3em]">Lens Offline</p>
                          <p className="text-[9px] mt-1 font-mono uppercase">Sentinel Authorization Required</p>
                       </div>
                       {cameraError && <p className="text-[10px] text-red-500 font-black uppercase mt-4 bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20">{cameraError}</p>}
                    </div>
                  )}
               </div>
            </div>
          </div>
        )}

        {activeTab === 'scanner' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
            <div className="lg:col-span-2 space-y-6">
               <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 shadow-xl">
                  <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-2 mb-6"><Maximize2 className="w-4 h-4 text-emerald-400" /> Barcode Ingress Stream</h3>
                  <form onSubmit={handleScan} className="relative mb-8">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                     <input 
                       type="text" 
                       value={scannerInput}
                       onChange={(e) => setScannerInput(e.target.value)}
                       placeholder="SCAN SKU OR SERIAL..." 
                       className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 pl-12 pr-4 text-emerald-400 font-mono font-bold text-sm focus:border-emerald-500 outline-none transition-all placeholder:text-slate-700"
                       autoFocus
                     />
                  </form>
                  <div className="space-y-4">
                     <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Recent Scans</h4>
                     <div className="space-y-2">
                        {scannedItems.length === 0 ? (
                           <div className="p-8 border-2 border-dashed border-slate-800 rounded-xl flex flex-col items-center text-slate-700 space-y-2">
                              <ScanLine className="w-8 h-8 opacity-20" />
                              <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Buffer Ingress</p>
                           </div>
                        ) : (
                           scannedItems.map(item => (
                              <div key={item.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between group hover:border-emerald-500/30 transition-all">
                                 <div className="flex items-center gap-4">
                                    <div className="p-2 bg-slate-900 rounded-lg"><Box className="w-4 h-4 text-emerald-500" /></div>
                                    <div><p className="text-sm font-bold text-white">{item.sku}</p><p className="text-[9px] text-slate-500 font-mono">{item.timestamp}</p></div>
                                 </div>
                                 <div className="flex items-center gap-2">
                                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${item.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>{item.status}</span>
                                    <ArrowRight className="w-3 h-3 text-slate-700 group-hover:text-emerald-500 transition-colors" />
                                 </div>
                              </div>
                           ))
                        )}
                     </div>
                  </div>
               </div>
            </div>
            <div className="space-y-6">
               <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                  <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2 mb-6"><Aperture className="w-4 h-4 text-blue-500" /> Ingress Policy</h4>
                  <div className="space-y-4">
                     <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                        <p className="text-[10px] text-slate-400 leading-relaxed font-mono uppercase">All physical assets must be scanned through the Sentinel Barcode Node to ensure registry integrity.</p>
                     </div>
                     <div className="space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">
                           <span>Node Status</span>
                           <span className="text-emerald-500">Online</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">
                           <span>Buffer Load</span>
                           <span className="text-blue-500">12%</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Operations;
