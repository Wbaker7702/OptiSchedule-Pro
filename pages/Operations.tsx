
import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import { DEPARTMENT_METRICS, OPERATIONAL_AUDITS as INITIAL_AUDITS, VULNERABILITY_DATA as INITIAL_VULNERABILITIES } from '../constants';
// Added List to the lucide-react imports to resolve "Cannot find name 'List'" error on line 473
import { RefreshCcw, Users, DollarSign, TrendingUp, Clock, ShieldAlert, CheckCircle, Info, Terminal, Search, AlertCircle, Play, Download, Loader2, ChevronRight, Activity, TerminalSquare, Eye, Maximize2, Radio, Shield, Bug, Zap, Fingerprint, Wifi, ShieldCheck, Camera, ScanLine, Box, Aperture, ArrowRight, Share2, Tag, X, ShieldX, List } from 'lucide-react';
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

  useEffect(() => {
    if (cameraActive) {
        const interval = setInterval(() => {
            const mockDetections = [
                { id: 1, x: 20 + Math.random() * 60, y: 20 + Math.random() * 60, label: 'Entity_Personnel' },
                { id: 2, x: 10 + Math.random() * 80, y: 10 + Math.random() * 80, label: 'Asset_HighValue' }
            ];
            setDetections(mockDetections);
        }, 1000);
        return () => clearInterval(interval);
    }
  }, [cameraActive]);

  const handleRemediate = (id: string) => {
    setRemediatingId(id);
    setTimeout(() => {
      setVulnerabilities(prev => prev.filter(v => v.id !== id));
      setRemediatingId(null);
      setLinterLogs(prev => [{
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString(),
        code: 'VULN_PATCH',
        message: 'Security Variance Resolved by Manager Wesleyan',
        status: 'Pass'
      }, ...prev]);
    }, 1500);
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

  const chartData = liveMetrics.map(m => ({
    name: m.name,
    sales: parseInt(m.sales.replace(/[^0-9]/g, '')),
    target: 25000
  }));

  return (
    <div className="flex-1 bg-slate-950 overflow-auto text-slate-200 font-mono">
      <Header title="Operational Hub" subtitle="Real-time Store Operations & Sentinel Linter Log" />

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
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-800">
                            {linterLogs.map(log => (
                               <tr key={log.id} className="hover:bg-slate-800/50">
                                  <td className="px-6 py-4 text-slate-500">{log.timestamp}</td>
                                  <td className="px-6 py-4 font-bold text-blue-400">{log.code}</td>
                                  <td className="px-6 py-4 text-slate-300">{log.message}</td>
                                  <td className="px-6 py-4">
                                     <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                                        log.status === 'Pass' ? 'bg-emerald-500/10 text-emerald-500' : 
                                        log.status === 'Warn' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'
                                     }`}>{log.status}</span>
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
                         <div key={v.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 group relative">
                            <div className="flex justify-between items-start mb-2">
                               <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                                  v.severity === 'Critical' ? 'bg-red-500 text-white' : 
                                  v.severity === 'High' ? 'bg-orange-500 text-white' : 'bg-blue-500 text-white'
                               }`}>{v.severity}</span>
                               <span className="text-[9px] text-slate-500 font-bold uppercase">{v.category}</span>
                            </div>
                            <p className="text-xs font-bold text-white mb-1">{v.title}</p>
                            <p className="text-[10px] text-slate-400 leading-relaxed mb-4">{v.description}</p>
                            <button 
                               onClick={() => handleRemediate(v.id)}
                               disabled={remediatingId === v.id}
                               className="w-full py-2 bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all disabled:opacity-50"
                            >
                               {remediatingId === v.id ? <><Loader2 className="w-3 h-3 animate-spin mr-2" /> Patching...</> : 'Remediate Variance'}
                            </button>
                         </div>
                      ))}
                      {vulnerabilities.length === 0 && (
                          <div className="py-8 text-center">
                              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3 opacity-20" />
                              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">No Active Vulnerabilities</p>
                          </div>
                      )}
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'vision' && (
          <div className="space-y-6 animate-in fade-in zoom-in duration-500">
             <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl relative min-h-[600px] flex flex-col">
                {/* Camera Feed Container */}
                <div className="flex-1 bg-black relative flex items-center justify-center">
                    {!cameraActive ? (
                        <div className="text-center p-8">
                            <Camera className="w-16 h-16 text-slate-700 mx-auto mb-6" />
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">Vision Node Offline</h3>
                            <p className="text-slate-500 text-sm font-medium mb-8 max-w-sm mx-auto">Authorize hardware access to enable Computer Vision floor tracking and entity identification.</p>
                            {cameraError && <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-2 rounded-lg text-xs font-bold mb-6">{cameraError}</div>}
                            <button onClick={startCamera} className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20 flex items-center gap-3 mx-auto">
                                <Play className="w-4 h-4 fill-white" /> Initialize Hardware
                            </button>
                        </div>
                    ) : (
                        <div className="w-full h-full relative group">
                            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                            
                            {/* Scanning UI Overlays */}
                            <div className="absolute inset-0 pointer-events-none">
                                <div className="absolute top-0 left-0 w-full h-full border-[20px] border-slate-900/40" />
                                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-blue-500/30 animate-[scan_3s_linear_infinite]" />
                                
                                {/* Simulated Detections */}
                                {detections.map(det => (
                                    <div 
                                        key={det.id}
                                        className="absolute border border-blue-500 bg-blue-500/10 transition-all duration-1000"
                                        style={{ top: `${det.y}%`, left: `${det.x}%`, width: '15%', height: '20%' }}
                                    >
                                        <div className="absolute -top-6 left-0 bg-blue-600 text-white text-[9px] font-black px-2 py-0.5 uppercase tracking-widest whitespace-nowrap">
                                            {det.label} • Conf: {(0.95 + Math.random() * 0.04).toFixed(2)}
                                        </div>
                                        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white" />
                                        <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-white" />
                                        <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-white" />
                                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white" />
                                    </div>
                                ))}
                            </div>

                            {/* Camera HUD */}
                            <div className="absolute top-8 left-8 p-4 bg-slate-950/80 backdrop-blur-md rounded-2xl border border-white/10 flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Live Stream Node_CV_5065</span>
                                </div>
                                <div className="flex gap-6">
                                    <div><p className="text-[8px] text-slate-500 uppercase font-black">Latency</p><p className="text-xs font-bold text-emerald-400">14ms</p></div>
                                    <div><p className="text-[8px] text-slate-500 uppercase font-black">FPS</p><p className="text-xs font-bold text-white">60.0</p></div>
                                    <div><p className="text-[8px] text-slate-500 uppercase font-black">Bitrate</p><p className="text-xs font-bold text-white">4.2Mbps</p></div>
                                </div>
                            </div>

                            <div className="absolute bottom-8 right-8 flex gap-4">
                                <button onClick={stopCamera} className="bg-red-600/20 hover:bg-red-600 text-white p-4 rounded-2xl border border-red-600/30 transition-all flex items-center gap-2 font-black text-[10px] uppercase tracking-widest">
                                    <ShieldX className="w-5 h-5" /> Terminate Node
                                </button>
                                <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-4 rounded-2xl border border-white/10 transition-all flex items-center gap-2 font-black text-[10px] uppercase tracking-widest">
                                    <Maximize2 className="w-5 h-5" /> Expand Frame
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Vision Controls Footer */}
                <div className="bg-slate-900 p-6 border-t border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3">
                            <Radio className="w-4 h-4 text-blue-500" />
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">CV Intelligence Model: <span className="text-white">SENTINEL-VISION-X</span></span>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <span className="text-[10px] text-slate-600 font-mono uppercase tracking-widest">ISO 800 • f/1.8 • 1/200s</span>
                    </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'scanner' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
             <div className="lg:col-span-1 space-y-6">
                <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-xl">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="bg-blue-600/20 p-3 rounded-2xl border border-blue-600/30">
                            <Maximize2 className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-white uppercase tracking-tighter">Manual Scanner</h3>
                            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Protocol Override Access</p>
                        </div>
                    </div>

                    <form onSubmit={handleScan} className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Input Asset SKU / ID</label>
                            <input 
                                type="text"
                                value={scannerInput}
                                onChange={(e) => setScannerInput(e.target.value)}
                                placeholder="ELEC-049-SEC"
                                className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none text-white font-mono text-sm placeholder-slate-700"
                            />
                        </div>
                        <button type="submit" className="w-full bg-[#002050] hover:bg-[#003070] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-2">
                            <Fingerprint className="w-4 h-4" /> Identify Asset
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-slate-800 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Node Encryption</span>
                            <span className="text-[10px] text-emerald-500 font-mono font-bold">AES-256 ACTIVE</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Registry Sync</span>
                            <span className="text-[10px] text-emerald-500 font-mono font-bold">STABLE</span>
                        </div>
                    </div>
                </div>
             </div>

             <div className="lg:col-span-2 space-y-6">
                <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
                    <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                        <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-2"><List className="w-4 h-4 text-slate-500" /> Scanned Item Stream</h3>
                    </div>
                    <div className="divide-y divide-slate-800">
                        {scannedItems.length === 0 ? (
                            <div className="p-20 text-center">
                                <Box className="w-16 h-16 text-slate-800 mx-auto mb-4" />
                                <p className="text-[11px] text-slate-600 uppercase font-black tracking-widest">No assets identified in this session</p>
                            </div>
                        ) : (
                            scannedItems.map(item => (
                                <div key={item.id} className="p-6 flex items-center justify-between hover:bg-slate-800/50 transition-colors animate-in slide-in-from-left-4">
                                    <div className="flex items-center gap-6">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                                            item.status === 'Verified' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'
                                        }`}>
                                            <Fingerprint className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-white uppercase tracking-tight">{item.sku}</p>
                                            <p className="text-[10px] text-slate-500 font-mono">{item.timestamp} • NODE_ACCESS_ID_404</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${
                                            item.status === 'Verified' ? 'bg-emerald-500 text-white' : 'bg-red-600 text-white'
                                        }`}>{item.status}</span>
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
      
      {/* Dynamic Keyframes for Scanning Animation */}
      <style>{`
        @keyframes scan {
            from { transform: translateY(-300px); }
            to { transform: translateY(300px); }
        }
        @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default Operations;
