
import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import { DEPARTMENT_METRICS, OPERATIONAL_AUDITS as INITIAL_AUDITS, VULNERABILITY_DATA as INITIAL_VULNERABILITIES } from '../constants';
import { RefreshCcw, Users, DollarSign, TrendingUp, Clock, ShieldAlert, CheckCircle, Info, Terminal, Search, AlertCircle, Play, Download, Loader2, ChevronRight, Activity, TerminalSquare, Eye, Maximize2, Radio, Shield, Bug, Zap, Fingerprint, Wifi, ShieldCheck, Camera, ScanLine, Box, Aperture, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine, Label, CartesianGrid } from 'recharts';
import { Vulnerability, DepartmentMetric } from '../types';

interface LinterLog {
  id: string;
  timestamp: string;
  code: string;
  message: string;
  status: 'Pass' | 'Fail' | 'Warn';
  fixAction?: string;
}

interface OperationsProps {
  defaultTab?: 'metrics' | 'audit' | 'vision' | 'scanner';
  externalTrigger?: string | null;
  onClearTrigger?: () => void;
}

interface ScannedItem {
  id: string;
  sku: string;
  timestamp: string;
  status: 'Verified' | 'Unknown';
}

const Operations: React.FC<OperationsProps> = ({ defaultTab = 'metrics', externalTrigger, onClearTrigger }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [liveMetrics, setLiveMetrics] = useState<DepartmentMetric[]>(DEPARTMENT_METRICS);
  const [audits, setAudits] = useState(INITIAL_AUDITS);
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>(INITIAL_VULNERABILITIES);
  const [isLive, setIsLive] = useState(true);
  const [linterLogs, setLinterLogs] = useState<LinterLog[]>([]);
  const [scanning, setScanning] = useState(false);
  const [remediatingId, setRemediatingId] = useState<string | null>(null);

  // Vision State
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [detections, setDetections] = useState<{id: number, x: number, y: number, label: string}[]>([]);

  // Scanner State
  const [scannerInput, setScannerInput] = useState('');
  const [scannedItems, setScannedItems] = useState<ScannedItem[]>([]);
  const scannerInputRef = useRef<HTMLInputElement>(null);

  // Update active tab if prop changes
  useEffect(() => {
    if (defaultTab) setActiveTab(defaultTab);
  }, [defaultTab]);

  // Handle External Triggers (e.g. from Team page)
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

  // Live Data Simulation Engine
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setLiveMetrics(currentMetrics => 
        currentMetrics.map(dept => {
          // Parse current sales
          const currentSales = parseInt(dept.sales.replace(/[^0-9]/g, ''));
          const volatility = Math.random() > 0.5 ? 1 : -1;
          const change = Math.floor(Math.random() * 150) * volatility;
          const newSales = Math.max(0, currentSales + change);

          // Parse current wait time
          const [mins, secs] = dept.waitTime.split('m ').map(p => parseInt(p.replace('s', '')));
          let totalSecs = mins * 60 + (secs || 0);
          totalSecs += Math.floor(Math.random() * 10) - 4; // Drift -4 to +6 seconds
          totalSecs = Math.max(0, totalSecs);
          const newMins = Math.floor(totalSecs / 60);
          const newSecs = totalSecs % 60;

          return {
            ...dept,
            sales: `$${newSales.toLocaleString()}`,
            waitTime: `${newMins}m ${newSecs}s`
          };
        })
      );

      // Randomly generate a linter log
      if (Math.random() > 0.6) {
          const statuses: ('Pass' | 'Fail' | 'Warn')[] = ['Pass', 'Pass', 'Pass', 'Warn', 'Fail'];
          const status = statuses[Math.floor(Math.random() * statuses.length)];
          
          let code = 'SYS_OK';
          let message = 'Routine system integrity verified.';
          let fixAction = undefined;

          if (status === 'Fail') {
             const fails = [
                 { c: 'SEC_BREACH', m: 'Unauthorized door access detected (Zone B)', f: 'Dispatch Security Unit' },
                 { c: 'DATA_LOSS', m: 'Packet loss > 15% on D365 uplink', f: 'Switch to Backup Node' },
                 { c: 'SCHED_CONFLICT', m: 'Shift overlap detected: J. Smith / M. Chen', f: 'Auto-Resolve Schedule' },
                 { c: 'POLICY_ERR', m: 'Execution Leakage detected in Grocery', f: 'Rebalance Staffing' }
             ];
             const f = fails[Math.floor(Math.random() * fails.length)];
             code = f.c;
             message = f.m;
             fixAction = f.f;
          } else if (status === 'Warn') {
             const warns = [
                 { c: 'MEM_HIGH', m: 'Sentinel Node memory usage at 85%', f: 'Clear Cache' },
                 { c: 'LATENCY', m: 'Network latency observed (150ms)', f: 'Optimize Route' },
                 { c: 'STOCK_LOW', m: 'Inventory low on SKU: ELEC-001', f: 'Flag Procurement' },
                 { c: 'TEMP_VAR', m: 'Server room temp +2°C above baseline', f: 'Check Cooling' }
             ];
             const w = warns[Math.floor(Math.random() * warns.length)];
             code = w.c;
             message = w.m;
             fixAction = w.f;
          }

          const newLog: LinterLog = {
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date().toLocaleTimeString(),
            code,
            message,
            status,
            fixAction
          };
          setLinterLogs(prev => [newLog, ...prev].slice(0, 50));
      }

    }, 2500);

    return () => clearInterval(interval);
  }, [isLive]);

  // Handle Remediation Logic
  const handleRemediate = (id: string) => {
    setRemediatingId(id);
    
    // Simulate API Network Request
    setTimeout(() => {
      // 1. Remove vulnerability from active list
      setVulnerabilities(prev => prev.filter(v => v.id !== id));
      
      // 2. Add success message to Linter Log
      const successLog: LinterLog = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleTimeString(),
        code: 'SENTINEL_PATCH',
        message: `Vulnerability ${id} successfully remediated via Sentinel Protocol.`,
        status: 'Pass'
      };
      setLinterLogs(prev => [successLog, ...prev]);
      
      // 3. Clear loading state
      setRemediatingId(null);
    }, 2000);
  };

  // Vision Logic
  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
      
      // Start Detection Simulation
      const detectionInterval = setInterval(() => {
        const newDetections = [];
        const count = Math.floor(Math.random() * 3); // 0 to 2 detections
        for(let i=0; i<count; i++) {
          newDetections.push({
            id: Date.now() + i,
            x: Math.random() * 60 + 20, // % position
            y: Math.random() * 60 + 20, // % position
            label: Math.random() > 0.5 ? 'PERSONNEL' : 'INVENTORY'
          });
        }
        setDetections(newDetections);
      }, 2000);

      return () => clearInterval(detectionInterval);

    } catch (err) {
      console.error("Camera Access Error:", err);
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
    setDetections([]);
  };

  // Scanner Logic
  const handleScannerInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && scannerInput.trim()) {
      const newItem: ScannedItem = {
        id: Math.random().toString(36).substr(2, 9),
        sku: scannerInput,
        timestamp: new Date().toLocaleTimeString(),
        status: 'Verified'
      };
      setScannedItems(prev => [newItem, ...prev]);
      setScannerInput('');
    }
  };

  // Prepare chart data
  const chartData = liveMetrics.map(m => ({
    name: m.name,
    sales: parseInt(m.sales.replace(/[^0-9]/g, '')),
    target: 25000 // Arbitrary target for visualization
  }));

  const maxSales = Math.max(...chartData.map(d => d.sales));

  return (
    <div className="flex-1 bg-slate-950 overflow-auto text-slate-200 font-mono">
      <Header title="Operational Hub" subtitle="Real-time Store Operations & Sentinel Linter Log" />

      {/* Live Feed Banner */}
      <div className="bg-blue-900/20 border-b border-blue-900/50 px-8 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
             <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-slate-600'}`}></div>
             <span className="text-[10px] font-black uppercase tracking-widest text-blue-300">
               {isLive ? 'Live Data Feed Ingress' : 'Feed Paused'}
             </span>
          </div>
          <div className="h-4 w-px bg-blue-800/50"></div>
          <div className="text-[10px] text-slate-400 font-bold">
            <span className="text-slate-500">UPLINK:</span> 45ms
          </div>
          <div className="text-[10px] text-slate-400 font-bold">
            <span className="text-slate-500">PACKETS:</span> 12.4kb/s
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsLive(!isLive)}
            className="text-[10px] uppercase font-black tracking-widest text-blue-400 hover:text-white transition-colors"
          >
            {isLive ? 'Pause Stream' : 'Resume Stream'}
          </button>
        </div>
      </div>
      
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 space-x-8">
           {[
             { id: 'metrics', label: 'Floor Metrics', icon: Activity },
             { id: 'audit', label: 'Sentinel Audit', icon: ShieldCheck },
             { id: 'vision', label: 'Computer Vision', icon: Eye },
             { id: 'scanner', label: 'Barcode Stream', icon: Maximize2 }
           ].map(tab => (
             <button
               key={tab.id}
               onClick={() => {
                   setActiveTab(tab.id as any);
                   if (tab.id !== 'vision' && cameraActive) stopCamera();
                   if (tab.id === 'scanner') setTimeout(() => scannerInputRef.current?.focus(), 100);
               }}
               className={`flex items-center gap-2 pb-4 px-2 text-[10px] font-black uppercase tracking-[0.15em] transition-all relative ${
                 activeTab === tab.id 
                 ? 'text-blue-400' 
                 : 'text-slate-500 hover:text-slate-300'
               }`}
             >
               <tab.icon className="w-4 h-4" />
               {tab.label}
               {activeTab === tab.id && (
                 <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
               )}
             </button>
           ))}
        </div>

        {/* Content Area */}
        {activeTab === 'metrics' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
             
             {/* Chart Section */}
             <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl">
                <div className="flex justify-between items-center mb-8">
                   <div>
                     <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                        Sales Velocity By Department
                     </h3>
                     <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-wider">Real-time Transaction Volume vs. Target</p>
                   </div>
                   <div className="flex items-center gap-2 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-[10px] text-slate-400 font-mono">Current Interval</span>
                   </div>
                </div>
                
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#64748b', fontSize: 10, fontWeight: 700, textTransform: 'uppercase'}} 
                        dy={10}
                      />
                      <YAxis 
                        hide 
                      />
                      <Tooltip 
                        cursor={{fill: '#1e293b', opacity: 0.4}}
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          border: '1px solid #1e293b',
                          borderRadius: '8px',
                          color: '#f8fafc',
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                        }}
                      />
                      <ReferenceLine y={25000} stroke="#ef4444" strokeDasharray="3 3">
                        <Label value="TARGET" position="insideTopRight" fill="#ef4444" fontSize={10} fontWeight={900} />
                      </ReferenceLine>
                      <Bar dataKey="sales" radius={[4, 4, 0, 0]} animationDuration={1000}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.sales > 25000 ? '#10b981' : '#3b82f6'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
             </div>

             {/* Metric Cards Grid */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {liveMetrics.map((metric) => (
                  <div key={metric.name} className="bg-slate-900 rounded-xl border border-slate-800 p-5 hover:border-blue-500/30 transition-all group">
                     <div className="flex justify-between items-start mb-4">
                        <h4 className="text-white font-black text-xs uppercase tracking-[0.1em]">{metric.name}</h4>
                        <div className="p-1.5 bg-slate-800 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                           <Activity className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-400" />
                        </div>
                     </div>
                     
                     <div className="space-y-4">
                        <div className="flex justify-between items-end">
                           <div>
                              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Current Sales</p>
                              <p className="text-2xl font-black text-white tracking-tight tabular-nums">{metric.sales}</p>
                           </div>
                           <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                             +{(Math.random() * 2).toFixed(1)}%
                           </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-800/50">
                           <div>
                              <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Wait Time</p>
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-3 h-3 text-blue-400" />
                                <span className="text-xs font-bold text-slate-300 tabular-nums">{metric.waitTime}</span>
                              </div>
                           </div>
                           <div>
                              <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Staffing</p>
                              <div className="flex items-center gap-1.5">
                                <Users className="w-3 h-3 text-purple-400" />
                                <span className="text-xs font-bold text-slate-300 tabular-nums">{metric.activeStaff}</span>
                              </div>
                           </div>
                        </div>

                        <div className="pt-2">
                           <div className="flex justify-between items-center text-[9px] mb-1">
                              <span className="text-slate-500 uppercase font-black">{metric.extraMetricLabel}</span>
                              <span className="text-slate-300 font-mono">{metric.extraMetricValue}</span>
                           </div>
                           <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-600 rounded-full transition-all duration-1000" 
                                style={{ width: metric.extraMetricValue.includes('%') ? metric.extraMetricValue : '50%' }}
                              ></div>
                           </div>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-right-4 duration-500">
             <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col h-[600px]">
                <div className="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
                   <div className="flex items-center gap-2">
                      <TerminalSquare className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs font-black text-white uppercase tracking-[0.2em]">Sentinel Linter Log</span>
                   </div>
                   <div className="flex gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-[9px] text-slate-500 font-mono uppercase">Monitoring Active</span>
                   </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-xs custom-scrollbar bg-[#0c0f16]">
                   {scanning && (
                     <div className="flex items-center gap-2 text-blue-400 p-2 bg-blue-500/5 rounded border border-blue-500/20 animate-pulse">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>SCANNING_ASSET_SIGNATURE...</span>
                     </div>
                   )}
                   
                   {linterLogs.map(log => (
                     <div key={log.id} className="flex flex-col gap-1 p-3 hover:bg-white/5 rounded transition-colors animate-in fade-in slide-in-from-left-2 border-b border-slate-800/40">
                        <div className="flex items-center gap-3">
                            <span className="text-slate-500 shrink-0 font-mono text-[10px]">[{log.timestamp}]</span>
                            <span className={`font-bold shrink-0 w-16 text-[10px] uppercase tracking-wider ${
                              log.status === 'Pass' ? 'text-emerald-500' : 
                              log.status === 'Fail' ? 'text-red-500' : 'text-amber-500'
                            }`}>{log.status}</span>
                            <span className="text-blue-400 shrink-0 w-24 font-mono text-xs">{log.code}</span>
                            <span className="text-slate-300 text-xs">{log.message}</span>
                        </div>
                        {(log.status === 'Fail' || log.status === 'Warn') && log.fixAction && (
                            <div className="pl-[140px] flex items-center gap-2 mt-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                                <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Fix Action:</span>
                                <span className="text-[10px] text-blue-300 font-mono bg-blue-900/20 px-2 py-0.5 rounded border border-blue-500/30 flex items-center gap-1">
                                    {log.fixAction}
                                    <ArrowRight className="w-3 h-3" />
                                </span>
                            </div>
                        )}
                     </div>
                   ))}

                   {audits.map((log) => (
                     <div key={log.id} className="flex flex-col gap-1 p-3 hover:bg-white/5 rounded transition-colors border-l-2 border-transparent hover:border-slate-700 opacity-70 hover:opacity-100">
                        <div className="flex items-center gap-3">
                            <span className="text-slate-600 shrink-0 text-[10px] font-mono">[ARCHIVED]</span>
                            <span className={`font-bold shrink-0 w-16 text-[10px] uppercase tracking-wider ${
                              log.severity === 'error' ? 'text-red-500' : 
                              log.severity === 'warning' ? 'text-amber-500' : 'text-blue-500'
                            }`}>{log.severity === 'error' ? 'FAIL' : log.severity === 'warning' ? 'WARN' : 'PASS'}</span>
                            <span className="text-slate-500 shrink-0 w-24 font-mono text-xs">{log.code}</span>
                            <span className="text-slate-400 text-xs">{log.message}</span>
                        </div>
                        {log.fix && log.fix !== 'No action' && (
                             <div className="pl-[140px] flex items-center gap-2 mt-1">
                                <span className="text-[9px] text-slate-600 uppercase tracking-widest font-bold">Resolution:</span>
                                <span className="text-[10px] text-slate-400 font-mono bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                                    {log.fix}
                                </span>
                            </div>
                        )}
                     </div>
                   ))}
                </div>
             </div>

             <div className="space-y-6">
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                   <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-amber-500" />
                      Active Vulnerabilities
                   </h3>
                   <div className="space-y-3">
                      {vulnerabilities.length === 0 ? (
                        <div className="bg-emerald-500/5 p-8 rounded-xl border border-emerald-500/20 text-center flex flex-col items-center justify-center space-y-3">
                           <div className="p-3 bg-emerald-500/10 rounded-full">
                              <ShieldCheck className="w-8 h-8 text-emerald-500" />
                           </div>
                           <h4 className="text-white font-black text-xs uppercase tracking-widest">System Fully Secured</h4>
                           <p className="text-emerald-400/60 text-[10px] font-mono">No Active Vectors Detected</p>
                        </div>
                      ) : (
                        vulnerabilities.map(vuln => (
                          <div key={vuln.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                             <div className="flex justify-between items-start mb-2">
                                <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded ${
                                  vuln.severity === 'Critical' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                  vuln.severity === 'High' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' :
                                  'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                                }`}>{vuln.severity}</span>
                                <span className="text-[9px] text-slate-600 font-mono">{vuln.id}</span>
                             </div>
                             <h4 className="text-sm font-bold text-slate-200 mb-1">{vuln.title}</h4>
                             <p className="text-[10px] text-slate-500 leading-relaxed mb-3">{vuln.description}</p>
                             <button 
                                onClick={() => handleRemediate(vuln.id)}
                                disabled={remediatingId === vuln.id}
                                className={`w-full py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                                  remediatingId === vuln.id 
                                  ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 cursor-wait' 
                                  : 'bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-300'
                                }`}
                             >
                                {remediatingId === vuln.id ? (
                                  <>
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    Patching Protocol...
                                  </>
                                ) : (
                                  'Apply Remediation'
                                )}
                             </button>
                          </div>
                        ))
                      )}
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* Vision Tab Implementation */}
        {activeTab === 'vision' && (
           <div className="animate-in fade-in duration-500">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Feed */}
                <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden relative min-h-[500px] flex flex-col shadow-2xl">
                   {/* Vision Header */}
                   <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                           <Aperture className={`w-5 h-5 ${cameraActive ? 'text-red-500 animate-spin-slow' : 'text-slate-500'}`} />
                           <h3 className="text-lg font-black text-white uppercase tracking-widest">Sentinel Vision Core</h3>
                        </div>
                        <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                           {cameraActive ? 'Optical Node Active • Processing Frames' : 'Optical Node Offline'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                         {!cameraActive ? (
                           <button 
                              onClick={startCamera}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2"
                           >
                              <Camera className="w-4 h-4" /> Initialize
                           </button>
                         ) : (
                           <button 
                              onClick={stopCamera}
                              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 border border-red-500/50 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] transition-all"
                           >
                              Terminate Feed
                           </button>
                         )}
                      </div>
                   </div>

                   {/* Video Area */}
                   <div className="flex-1 bg-black relative flex items-center justify-center">
                      {!cameraActive ? (
                         <div className="text-center p-8">
                            <div className="w-20 h-20 border-2 border-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                               <div className="absolute inset-0 border-t-2 border-blue-500 rounded-full animate-spin"></div>
                               <Eye className="w-8 h-8 text-slate-700" />
                            </div>
                            <p className="text-slate-500 font-mono text-xs uppercase tracking-widest">Awaiting Hardware Handshake</p>
                            {cameraError && (
                               <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 text-xs font-mono">
                                  {cameraError}
                               </div>
                            )}
                         </div>
                      ) : (
                         <div className="relative w-full h-full">
                            <video 
                               ref={videoRef} 
                               autoPlay 
                               playsInline 
                               muted 
                               className="w-full h-full object-cover opacity-80"
                            />
                            {/* HUD Overlay */}
                            <div className="absolute inset-0 pointer-events-none">
                               <div className="absolute top-8 right-8 text-right">
                                  <p className="text-emerald-500 font-mono text-xs font-bold">FPS: 60</p>
                                  <p className="text-blue-500 font-mono text-xs font-bold">LATENCY: 12ms</p>
                               </div>
                               {/* Scanning Grid Effect */}
                               <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                               
                               {/* Simulated Detections */}
                               {detections.map(d => (
                                  <div 
                                    key={d.id} 
                                    className="absolute border-2 border-emerald-500/70 bg-emerald-500/10 flex flex-col items-start transition-all duration-500"
                                    style={{
                                       left: `${d.x}%`, 
                                       top: `${d.y}%`, 
                                       width: '120px', 
                                       height: '120px'
                                    }}
                                  >
                                     <div className="bg-emerald-500 text-black text-[9px] font-black px-1 uppercase tracking-tighter">
                                        {d.label} {(Math.random() * 0.1 + 0.9).toFixed(2)}
                                     </div>
                                  </div>
                               ))}
                            </div>
                         </div>
                      )}
                   </div>
                </div>

                {/* Analysis Sidebar */}
                <div className="space-y-6">
                   <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
                      <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-4">Detection Log</h3>
                      <div className="space-y-2 h-[300px] overflow-y-auto custom-scrollbar pr-2">
                         {detections.length === 0 && !cameraActive && (
                            <p className="text-[10px] text-slate-500 italic">Feed inactive...</p>
                         )}
                         {cameraActive && detections.map((d, i) => (
                            <div key={i} className="flex justify-between items-center p-2 bg-slate-950 border border-slate-800 rounded">
                               <span className="text-emerald-500 font-black text-[10px] uppercase">{d.label}</span>
                               <span className="text-slate-500 text-[9px] font-mono">{new Date().toLocaleTimeString()}</span>
                            </div>
                         ))}
                         {cameraActive && (
                            <div className="flex items-center gap-2 p-2 opacity-50">
                               <Loader2 className="w-3 h-3 text-blue-500 animate-spin" />
                               <span className="text-[9px] text-blue-500 font-mono uppercase">Analyzing Frame...</span>
                            </div>
                         )}
                      </div>
                   </div>
                   
                   <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-xl">
                      <div className="flex items-start gap-3">
                         <Info className="w-5 h-5 text-blue-400 shrink-0" />
                         <div>
                            <h4 className="text-blue-100 font-bold text-xs uppercase mb-1">Hardware Note</h4>
                            <p className="text-[10px] text-blue-300/70 leading-relaxed">
                               Ensure the dedicated optical node is connected via USB-C or authorized wireless protocol. Browser permissions required.
                            </p>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
           </div>
        )}

        {/* Scanner Tab Implementation */}
        {activeTab === 'scanner' && (
           <div className="animate-in fade-in duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)]"></div>
                    
                    <div className="relative z-10 w-full max-w-md space-y-8 text-center">
                       <div className="w-24 h-24 bg-slate-800 rounded-full mx-auto flex items-center justify-center border-4 border-slate-700 shadow-2xl relative group">
                          <ScanLine className="w-10 h-10 text-blue-500" />
                          <div className="absolute inset-0 border-2 border-blue-500 rounded-full animate-ping opacity-20"></div>
                       </div>
                       
                       <div>
                          <h3 className="text-2xl font-black text-white uppercase tracking-widest mb-2">Scanner Terminal</h3>
                          <p className="text-slate-500 text-xs font-mono uppercase">Ready for HID Input • Keyboard Emulation Active</p>
                       </div>

                       <div className="relative">
                          <input 
                             ref={scannerInputRef}
                             type="text" 
                             value={scannerInput}
                             onChange={(e) => setScannerInput(e.target.value)}
                             onKeyDown={handleScannerInput}
                             className="w-full bg-slate-950 border-2 border-slate-700 focus:border-blue-500 rounded-xl py-4 pl-12 pr-4 text-white font-mono text-lg outline-none transition-all shadow-inner"
                             placeholder="Scan Asset Tag..."
                             autoFocus
                          />
                          <Box className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2">
                             <span className="text-[9px] bg-slate-800 text-slate-400 px-2 py-1 rounded font-black uppercase tracking-widest">Enter</span>
                          </div>
                       </div>
                       
                       <p className="text-[10px] text-slate-600 font-mono">
                          Simulate hardware scan by typing code and pressing Enter.
                       </p>
                    </div>
                 </div>

                 <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-slate-800 bg-slate-950 flex justify-between items-center">
                       <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                          <Terminal className="w-4 h-4 text-emerald-500" />
                          Scan Manifest
                       </h3>
                       <span className="px-2 py-1 bg-slate-800 rounded text-[10px] text-slate-400 font-mono font-bold">{scannedItems.length} ITEMS</span>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-2 h-[400px]">
                       {scannedItems.length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-2 opacity-50">
                             <Box className="w-8 h-8" />
                             <p className="text-xs font-mono uppercase">Manifest Empty</p>
                          </div>
                       ) : (
                          scannedItems.map((item) => (
                             <div key={item.id} className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between animate-in slide-in-from-left-2">
                                <div className="flex items-center gap-3">
                                   <div className="w-8 h-8 bg-blue-900/30 rounded flex items-center justify-center text-blue-400 font-black text-xs">
                                      ID
                                   </div>
                                   <div>
                                      <p className="text-white font-mono text-sm font-bold">{item.sku}</p>
                                      <p className="text-[9px] text-slate-500 font-mono uppercase">{item.timestamp}</p>
                                   </div>
                                </div>
                                <div className="flex items-center gap-2">
                                   <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">{item.status}</span>
                                   <CheckCircle className="w-4 h-4 text-emerald-500" />
                                </div>
                             </div>
                          ))
                       )}
                    </div>
                 </div>
              </div>
           </div>
        )}

      </div>
      
      <style>{`
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Operations;
