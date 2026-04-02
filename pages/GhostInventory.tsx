
import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import { 
  Ghost, 
  ShieldCheck, 
  Target, 
  AlertTriangle, 
  RefreshCw, 
  CheckCircle2, 
  Camera, 
  Search, 
  FileText, 
  Activity, 
  Clock, 
  MapPin, 
  ArrowRight,
  Snowflake,
  Scan,
  MessageSquare,
  History,
  AlertOctagon,
  Image as ImageIcon,
  Loader2,
  Terminal,
  Zap,
  TrendingDown,
  UserX,
  ChevronRight,
  Info
} from 'lucide-react';
import { STORE_NUMBER } from '../constants';

interface FrozenBin {
  id: string;
  location: string;
  item: string;
  sku: string;
  strikes: number;
  reportedBy: string[];
  timestamp: string;
  status: 'Frozen' | 'Investigating' | 'Resolved';
}

interface LogEntry {
  id: string;
  time: string;
  message: string;
  type: 'info' | 'alert' | 'success' | 'system';
}

const GhostInventory: React.FC = () => {
  const [accuracy, setAccuracy] = useState(78.4);
  const [recoveryRate, setRecoveryRate] = useState(64);
  const [freezeTime, setFreezeTime] = useState(14); // minutes
  const [laborWaste, setLaborWaste] = useState(42); // minutes lost
  const [activeTab, setActiveTab] = useState<'dashboard' | 'governance'>('dashboard');
  
  // Pilot Logic States
  const [isSimulating, setIsSimulating] = useState(false);
  
  // Frozen Bins Data
  const [frozenBins, setFrozenBins] = useState<FrozenBin[]>([
    { id: 'FB-101', location: 'Zone B-12-4', item: 'Premium ANC Headphones', sku: 'AUD-550', strikes: 2, reportedBy: ['M. Chen', 'J. Wilson'], timestamp: '08:42 AM', status: 'Frozen' },
    { id: 'FB-102', location: 'Zone B-08-1', item: '4K OLED Display', sku: 'TV-4K-55', strikes: 2, reportedBy: ['S. Jenkins', 'L. Thompson'], timestamp: '09:15 AM', status: 'Frozen' },
    { id: 'FB-103', location: 'Zone B-15-3', item: 'Smart Home Hub v2', sku: 'IOT-HUB', strikes: 2, reportedBy: ['M. Chen', 'C. Miller'], timestamp: '10:05 AM', status: 'Investigating' },
  ]);

  const [logs, setLogs] = useState<LogEntry[]>([
    { id: '1', time: '08:42:05', message: 'Bin Zone B-12-4 FROZEN (2 Strikes)', type: 'alert' },
    { id: '2', time: '08:45:12', message: 'Zone Lead dispatched to Row 12', type: 'info' },
    { id: '3', time: '09:15:00', message: 'Picker S. Jenkins marked TV-4K-55 SHORT', type: 'info' },
  ]);

  const [selectedBin, setSelectedBin] = useState<FrozenBin | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [photoProof, setPhotoProof] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Simulate Live Metrics & Logs
  useEffect(() => {
    const interval = setInterval(() => {
      // Metric Drift
      setAccuracy(prev => Math.min(99.9, Math.max(70, prev + (Math.random() - 0.4) * 0.1)));
      setRecoveryRate(prev => Math.min(100, Math.max(50, prev + (Math.random() - 0.4) * 0.2)));
      
      // Labor Waste Accumulation if bins are frozen
      const frozenCount = frozenBins.filter(b => b.status === 'Frozen').length;
      if (frozenCount > 0) {
         setLaborWaste(prev => prev + (frozenCount * 0.1));
      }

      // Random Event Injection
      if (Math.random() > 0.8) {
        const events = [
           { msg: "Picker scan at Zone B-04 verified", type: 'system' },
           { msg: "Neighbor Logic: Redirecting to Overflow Bin C-01", type: 'success' },
           { msg: "Latency detected in Zone C scanner mesh", type: 'info' },
           { msg: "Audit complete: Row 4 cleared", type: 'success' }
        ];
        const evt = events[Math.floor(Math.random() * events.length)];
        addLog(evt.msg, evt.type as any);
      }
    }, 2500);
    return () => clearInterval(interval);
  }, [frozenBins]);

  const addLog = (message: string, type: 'info' | 'alert' | 'success' | 'system') => {
    const newLog = {
      id: Date.now().toString(),
      time: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      message,
      type
    };
    setLogs(prev => [newLog, ...prev].slice(0, 50));
  };

  const handleResolve = (resolution: 'Transfer' | 'QC' | 'Zero') => {
    if (!selectedBin) return;
    
    const updatedBin = { ...selectedBin, status: 'Resolved' as const };
    
    setFrozenBins(prev => prev.map(b => b.id === selectedBin.id ? updatedBin : b));
    setSelectedBin(null);
    setPhotoProof(null);
    
    addLog(`Bin ${selectedBin.location} RESOLVED via ${resolution}`, 'success');
    
    // Simulate Metric Impact
    if (resolution === 'Transfer') {
       setRecoveryRate(prev => Math.min(100, prev + 2.5));
       setLaborWaste(prev => Math.max(0, prev - 5)); // Saved time
    }
    if (resolution === 'Zero') {
       setAccuracy(prev => Math.max(0, prev - 0.5)); // Accuracy hit
    }
  };

  const simulatePhotoUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setPhotoProof("https://images.unsplash.com/photo-1553413077-190dd305871c?w=400&h=300&fit=crop");
    }, 1500);
  };

  const triggerPeakFlow = () => {
     setIsSimulating(true);
     addLog("SIMULATION STARTED: Peak Flow Injection", 'alert');
     
     let steps = 0;
     const simInterval = setInterval(() => {
        steps++;
        if (steps > 5) {
           clearInterval(simInterval);
           setIsSimulating(false);
           addLog("SIMULATION ENDED: Normalizing data streams", 'system');
           return;
        }
        
        // Inject a new frozen bin
        const newBin: FrozenBin = {
           id: `FB-SIM-${Date.now()}`,
           location: `Zone B-${10 + steps}-2`,
           item: 'Simulated Asset',
           sku: `SIM-${1000 + steps}`,
           strikes: 2,
           reportedBy: ['Auto-Sim', 'Microsoft Sentinel'],
           timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
           status: 'Frozen'
        };
        setFrozenBins(prev => [newBin, ...prev]);
        addLog(`High Velocity Error: ${newBin.location} FROZEN`, 'alert');
        setAccuracy(prev => prev - 0.2);
        setLaborWaste(prev => prev + 2);

     }, 1000);
  };

  return (
    <div className="flex-1 bg-[#020617] overflow-auto custom-scrollbar font-mono text-slate-200">
      <div className="p-8 flex justify-between items-center bg-slate-900/20 backdrop-blur-md border-b border-slate-800/50 sticky top-0 z-20">
        <div>
            <h1 className="text-2xl font-black text-white tracking-tighter uppercase">Ghost Inventory Control</h1>
            <p className="text-[10px] text-blue-400 font-mono mt-1 uppercase tracking-[0.2em] font-bold">Zone B Pilot • Governance Packet Active • Store #{STORE_NUMBER}</p>
        </div>
        <div className="flex border border-slate-800 rounded-xl overflow-hidden p-1 bg-slate-950/50">
           <button 
             onClick={() => setActiveTab('dashboard')}
             className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest transition-all rounded-lg ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
           >
             Live Monitoring
           </button>
           <button 
             onClick={() => setActiveTab('governance')}
             className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest transition-all rounded-lg ${activeTab === 'governance' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
           >
             Governance
           </button>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto space-y-8 pb-24">
        
        {activeTab === 'dashboard' ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
               {[
                 { label: 'Inventory Accuracy', value: `${accuracy.toFixed(1)}%`, icon: Target, color: 'blue', progress: accuracy, target: '95.0%' },
                 { label: 'Recovery Rate', value: `${recoveryRate.toFixed(1)}%`, icon: RefreshCw, color: 'emerald', progress: recoveryRate, sub: 'Success Stories' },
                 { label: 'Wasted Labor', value: `${Math.floor(laborWaste)}m`, icon: UserX, color: 'red', sub: 'Efficiency Leak' },
                 { label: 'Freeze Resolve Time', value: `${freezeTime}m`, icon: Clock, color: 'amber', sub: 'Zone Lead Active' },
               ].map((kpi) => (
                 <div key={kpi.label} className="bg-slate-900/50 rounded-3xl p-6 border border-slate-800 shadow-xl relative overflow-hidden group hover:border-slate-700 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                       <div>
                          <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{kpi.label}</p>
                          <h3 className="text-2xl font-black text-white mt-1">{kpi.value}</h3>
                       </div>
                       <div className={`p-3 bg-${kpi.color}-500/10 rounded-xl border border-${kpi.color}-500/20 group-hover:scale-110 transition-transform`}>
                          <kpi.icon className={`w-5 h-5 text-${kpi.color}-500`} />
                       </div>
                    </div>
                    {kpi.progress !== undefined ? (
                      <>
                        <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                           <div className={`h-full bg-${kpi.color}-500 transition-all duration-1000`} style={{ width: `${kpi.progress}%` }}></div>
                        </div>
                        <p className={`text-[8px] text-${kpi.color}-400 mt-2 font-black uppercase flex items-center gap-2`}>
                           <ArrowRight className="w-3 h-3" /> Target: {kpi.target}
                        </p>
                      </>
                    ) : (
                      <p className={`text-[8px] text-${kpi.color}-400 font-black uppercase flex items-center gap-2`}>
                         <Info className="w-3 h-3" /> {kpi.sub}
                      </p>
                    )}
                 </div>
               ))}
            </div>

            {/* Zone Control Center */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
               <div className="lg:col-span-8 space-y-8">
                  {/* Active Rules Banner */}
                  <div className="bg-blue-600/5 border border-blue-500/20 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                        <ShieldCheck className="w-40 h-40 text-blue-500" />
                     </div>
                     <div className="flex items-center gap-6 relative z-10">
                        <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30 ring-4 ring-blue-600/10">
                           <Ghost className="w-7 h-7 text-white" />
                        </div>
                        <div>
                           <h3 className="text-xl font-black text-white uppercase tracking-tighter">Zone B Logic Core</h3>
                           <p className="text-[10px] text-blue-400 font-mono mt-1 uppercase tracking-[0.2em] font-bold">Two-Strike Rule Active • Neighboring Map Synchronized</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-3 relative z-10">
                        <button 
                           onClick={triggerPeakFlow}
                           disabled={isSimulating}
                           className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 flex items-center gap-3 active:scale-95 transition-all disabled:opacity-50"
                        >
                           {isSimulating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                           Trigger Peak Flow
                        </button>
                     </div>
                  </div>

                  {/* Frozen Bin Management */}
                  <div className="bg-slate-900/50 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl backdrop-blur-sm">
                     <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/30">
                        <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                           <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                           Frozen Bin Queue ({frozenBins.filter(b => b.status !== 'Resolved').length})
                        </h3>
                        <span className="text-[9px] font-bold text-slate-500 uppercase px-3 py-1 bg-slate-950 rounded-full border border-slate-800">Requires Zone Lead</span>
                     </div>
                     <div className="overflow-x-auto">
                        <table className="w-full text-left text-[11px]">
                           <thead className="bg-slate-950/50 text-slate-500 uppercase font-black tracking-widest border-b border-slate-800">
                              <tr>
                                 <th className="px-8 py-5">Bin Location</th>
                                 <th className="px-8 py-5">Item Details</th>
                                 <th className="px-8 py-5 text-center">Strikes</th>
                                 <th className="px-8 py-5">Status</th>
                                 <th className="px-8 py-5 text-right">Action</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-800/50">
                              {frozenBins.filter(b => b.status !== 'Resolved').map(bin => (
                                 <tr key={bin.id} className="hover:bg-blue-600/5 transition-colors group">
                                    <td className="px-8 py-6">
                                       <div className="flex items-center gap-3">
                                          <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse"></div>
                                          <span className="text-white font-black tracking-wider uppercase">{bin.location}</span>
                                       </div>
                                    </td>
                                    <td className="px-8 py-6">
                                       <p className="text-slate-200 font-bold uppercase">{bin.item}</p>
                                       <p className="text-[9px] text-slate-500 font-mono mt-1">SKU: {bin.sku}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                       <div className="flex items-center justify-center gap-1.5">
                                          {[...Array(bin.strikes)].map((_, i) => (
                                             <AlertOctagon key={i} className="w-4 h-4 text-red-500 fill-red-500/10" />
                                          ))}
                                       </div>
                                    </td>
                                    <td className="px-8 py-6">
                                       <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                                          bin.status === 'Frozen' ? 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 
                                          'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                       }`}>
                                          {bin.status}
                                       </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                       <button 
                                          onClick={() => setSelectedBin(bin)}
                                          className="group/btn relative px-5 py-2.5 bg-slate-950 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all overflow-hidden shadow-lg"
                                       >
                                          <span className="relative z-10 flex items-center gap-2">
                                             Investigate <ChevronRight className="w-3 h-3" />
                                          </span>
                                       </button>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
               </div>

               {/* Live Intelligence Feed */}
               <div className="lg:col-span-4 space-y-6">
                  <div className="bg-slate-900/50 rounded-3xl p-8 border border-slate-800 shadow-xl h-full flex flex-col backdrop-blur-sm">
                     <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                        <Terminal className="w-5 h-5 text-emerald-500" /> Sentinel Event Stream
                     </h3>
                     <div className="bg-slate-950 rounded-2xl border border-slate-800/50 p-5 flex-1 overflow-hidden flex flex-col shadow-inner">
                        <div className="space-y-4 overflow-y-auto custom-scrollbar flex-1 pr-2" ref={scrollRef}>
                           {logs.map((log) => (
                              <div key={log.id} className="flex gap-4 animate-in slide-in-from-left-2 fade-in duration-300">
                                 <span className="text-[9px] font-mono text-slate-600 shrink-0 mt-1">[{log.time}]</span>
                                 <p className={`text-[10px] font-mono leading-relaxed ${
                                    log.type === 'alert' ? 'text-red-400 font-bold' :
                                    log.type === 'success' ? 'text-emerald-400' :
                                    log.type === 'system' ? 'text-blue-400' : 'text-slate-400'
                                 }`}>
                                    {log.message}
                                 </p>
                              </div>
                           ))}
                        </div>
                     </div>
                     
                     <div className="mt-6 pt-6 border-t border-slate-800">
                        <div className="flex items-center justify-between text-[9px] font-black uppercase text-slate-500 tracking-widest">
                           <span>Scan Velocity</span>
                           <span className="text-white font-mono">142 PKTS/HR</span>
                        </div>
                        <div className="w-full bg-slate-950 h-1.5 mt-3 rounded-full overflow-hidden border border-slate-800/50">
                           <div className="h-full bg-blue-500 animate-pulse w-[60%] shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                        </div>
                     </div>
                  </div>

                  {/* Photo Messaging Feed */}
                  <div className="bg-slate-900/50 rounded-3xl p-8 border border-slate-800 shadow-xl backdrop-blur-sm">
                     <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                        <Camera className="w-5 h-5 text-blue-500" /> Lead Uplink
                     </h3>
                     <div className="space-y-4 mb-6">
                        <div className="flex gap-4">
                           <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-[10px] text-white font-black shrink-0 shadow-lg shadow-blue-500/20 border border-blue-400/30">ZL</div>
                           <div className="bg-slate-950 p-4 rounded-2xl rounded-tl-none border border-slate-800 shadow-lg">
                              <p className="text-[10px] text-slate-300 leading-relaxed font-bold uppercase tracking-tight">Bin 12-4 cleaned. Item found in neighbor bin 12-6. Performing Digital Transfer.</p>
                              <div className="mt-3 h-24 w-full bg-slate-900 rounded-xl overflow-hidden relative group cursor-pointer border border-slate-800">
                                 <img src="https://images.unsplash.com/photo-1553413077-190dd305871c?w=400&h=300&fit=crop" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110" alt="Proof" />
                                 <div className="absolute inset-0 bg-blue-600/10 group-hover:bg-transparent transition-colors"></div>
                              </div>
                              <span className="text-[8px] text-slate-600 font-black mt-2 block uppercase tracking-widest">08:55 AM • SECURE_IMAGE_TX</span>
                           </div>
                        </div>
                     </div>
                     <button className="w-full py-4 bg-slate-950 hover:bg-slate-800 text-blue-400 hover:text-white border border-slate-800 hover:border-blue-500/30 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg group">
                        <MessageSquare className="w-4 h-4 group-hover:scale-110 transition-transform" /> Connect to Zone Lead
                     </button>
                  </div>
               </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
             <div className="bg-slate-50 p-12 border-b border-slate-200 text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-600/20">
                    <ShieldCheck className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-2">Governance Protocol</h2>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">OptiSchedule Pro • Node Enforcement Frame</h3>
             </div>
             <div className="p-12 space-y-12 font-serif">
                <section>
                   <h4 className="text-sm font-black text-slate-900 border-b-2 border-slate-900 pb-2 mb-6 uppercase tracking-widest font-sans">01. Policy Encoding Summary</h4>
                   <p className="text-base text-slate-700 leading-relaxed">
                      This document encodes the Stocking, Overflow, Two-Strike, and Smart Audit SOP into machine-enforceable policy controls suitable for enterprise retail environments.
                   </p>
                </section>

                <section>
                   <h4 className="text-sm font-black text-slate-900 border-b-2 border-slate-900 pb-2 mb-6 uppercase tracking-widest font-sans">02. Enforcement Model</h4>
                   <p className="text-base text-slate-700 leading-relaxed">
                      All rules are system-enforced. Manual overrides are logged, time-bound, and auditable. No unassigned inventory placement is permitted within the secure node.
                   </p>
                </section>

                <section>
                   <h4 className="text-sm font-black text-slate-900 border-b-2 border-slate-900 pb-2 mb-6 uppercase tracking-widest font-sans">03. Target Retail Outcomes</h4>
                   <ul className="space-y-4">
                      {[
                        'Elimination of ghost inventory through deterministic bin-locking',
                        '94.2% reduction in picker labor waste via Neighbor-Logic routing',
                        'Predictable peak-flow readiness through automated delta-injection',
                        'Regulator-safe audit trail with zero-knowledge proof verification'
                      ].map((item, i) => (
                        <li key={i} className="flex gap-4 text-base text-slate-700 items-start">
                           <span className="font-sans font-black text-blue-600 mt-1">[{i+1}]</span>
                           <span>{item}</span>
                        </li>
                      ))}
                   </ul>
                </section>
             </div>
             <div className="bg-slate-950 p-8 text-center">
                <p className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.4em] font-bold">CONFIDENTIAL // FORTUNE-50 INTERNAL // NODAL_VER_4.2</p>
             </div>
          </div>
        )}
      </div>

      {/* Investigation Modal */}
      {selectedBin && (
         <div className="fixed inset-0 bg-[#020617]/90 z-[60] flex items-center justify-center p-6 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="bg-slate-900 rounded-[2.5rem] shadow-2xl max-w-2xl w-full border border-slate-800 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
               <div className="p-8 border-b border-slate-800 bg-slate-950 flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
                        <div className="p-2 bg-blue-600 rounded-lg">
                            <Search className="w-5 h-5 text-white" />
                        </div>
                        Investigate Bin
                    </h3>
                    <p className="text-[9px] text-slate-500 font-mono mt-2 uppercase tracking-[0.2em] font-bold">Location: {selectedBin.location} • ID: {selectedBin.id}</p>
                  </div>
                  <button onClick={() => setSelectedBin(null)} className="text-slate-500 hover:text-white transition-colors uppercase text-[9px] font-black tracking-widest">Close</button>
               </div>
               
               <div className="p-10 space-y-8">
                  <div className="bg-red-500/5 border border-red-500/20 p-6 rounded-3xl flex items-start gap-6 relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-4 opacity-5">
                        <AlertTriangle className="w-20 h-20 text-red-500" />
                     </div>
                     <div className="p-3 bg-red-500 rounded-2xl shadow-lg shadow-red-500/20 shrink-0">
                        <AlertTriangle className="w-6 h-6 text-slate-900" />
                     </div>
                     <div className="relative z-10">
                        <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-2">Critical: Two-Strike Alert</h4>
                        <p className="text-xs text-slate-400 leading-relaxed uppercase font-bold tracking-tight">
                           Pickers <span className="text-red-400">{selectedBin.reportedBy.join(' & ')}</span> reported stock-out. Local node has frozen this asset to prevent further labor drift.
                        </p>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] text-center mb-4 italic">Resolve Protocol Required</p>
                     
                     <div className="grid grid-cols-2 gap-6">
                        <button 
                          onClick={() => handleResolve('Transfer')}
                          className="p-6 bg-slate-950 border border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-500/5 rounded-[2rem] text-left group transition-all shadow-xl"
                        >
                           <div className="flex items-center gap-3 mb-3">
                              <div className="p-2 bg-slate-900 rounded-xl group-hover:bg-emerald-500 transition-colors">
                                <RefreshCw className="w-5 h-5 text-slate-500 group-hover:text-white" />
                              </div>
                              <span className="text-[10px] font-black text-slate-300 group-hover:text-white uppercase tracking-wider">Digital Transfer</span>
                           </div>
                           <p className="text-[9px] text-slate-600 group-hover:text-slate-400 font-bold uppercase leading-relaxed">Asset found in neighboring bin. Relocate & restore stream.</p>
                        </button>
                        <button 
                           onClick={() => handleResolve('QC')}
                           className="p-6 bg-slate-950 border border-slate-800 hover:border-blue-500/50 hover:bg-blue-500/5 rounded-[2rem] text-left group transition-all shadow-xl"
                        >
                           <div className="flex items-center gap-3 mb-3">
                              <div className="p-2 bg-slate-900 rounded-xl group-hover:bg-blue-500 transition-colors">
                                <Activity className="w-5 h-5 text-slate-500 group-hover:text-white" />
                              </div>
                              <span className="text-[10px] font-black text-slate-300 group-hover:text-white uppercase tracking-wider">Quality Control</span>
                           </div>
                           <p className="text-[9px] text-slate-600 group-hover:text-slate-400 font-bold uppercase leading-relaxed">Asset damaged or unsellable. Route to inspection bin.</p>
                        </button>
                     </div>

                     <div className="relative group">
                        <button 
                           onClick={simulatePhotoUpload}
                           className="w-full p-6 bg-slate-950 border border-slate-800 hover:border-red-500/50 hover:bg-red-500/5 rounded-[2rem] text-left transition-all shadow-xl"
                        >
                           <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                 <div className="p-2 bg-slate-900 rounded-xl group-hover:bg-red-500 transition-colors">
                                    <ImageIcon className="w-5 h-5 text-slate-500 group-hover:text-white" />
                                 </div>
                                 <span className="text-[10px] font-black text-slate-300 group-hover:text-white uppercase tracking-wider">Confirm Zero (VISUAL REQUIRED)</span>
                              </div>
                              {isUploading && <Loader2 className="w-5 h-5 animate-spin text-slate-500" />}
                              {photoProof && <CheckCircle2 className="w-5 h-5 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />}
                           </div>
                           <p className="text-[9px] text-slate-600 group-hover:text-slate-400 font-bold uppercase leading-relaxed">Finalize permanent stock-out. Requires high-resolution proof.</p>
                        </button>
                     </div>
                  </div>

                  {photoProof && (
                     <div className="animate-in fade-in slide-in-from-top-4 duration-500 pt-4">
                        <div className="h-48 w-full bg-slate-950 rounded-[2rem] overflow-hidden border border-slate-800 relative group shadow-2xl">
                           <img src={photoProof} alt="Proof" className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-110" />
                           <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>
                           <div className="absolute bottom-6 right-6 bg-blue-600 px-4 py-2 rounded-xl text-[9px] text-white font-black uppercase tracking-widest shadow-xl">Proof Verified</div>
                        </div>
                        <button 
                           onClick={() => handleResolve('Zero')}
                           className="w-full mt-8 py-5 bg-red-600 hover:bg-red-500 text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-red-600/20 active:scale-[0.98] transition-all"
                        >
                           Finalize Asset Zero-Out
                        </button>
                     </div>
                  )}
               </div>
            </div>
         </div>
      )}

    </div>
  );
};

export default GhostInventory;
