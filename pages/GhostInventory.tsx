
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
  UserX
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
  const [twoStrikeActive, setTwoStrikeActive] = useState(true);
  const [neighborLogicActive, setNeighborLogicActive] = useState(true);
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
           reportedBy: ['Auto-Sim', 'Sentinel'],
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
    <div className="flex-1 bg-slate-950 overflow-auto custom-scrollbar font-mono text-slate-200">
      <Header title="Ghost Inventory Prevention" subtitle={`Zone B Pilot • Governance Packet Active • Store #${STORE_NUMBER}`} />

      <div className="p-8 max-w-7xl mx-auto space-y-8 pb-24">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800">
           <button 
             onClick={() => setActiveTab('dashboard')}
             className={`px-6 py-4 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'dashboard' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500 hover:text-white'}`}
           >
             Zone B Pilot Dashboard
           </button>
           <button 
             onClick={() => setActiveTab('governance')}
             className={`px-6 py-4 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'governance' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500 hover:text-white'}`}
           >
             Governance Packet (Read-Only)
           </button>
        </div>

        {activeTab === 'dashboard' ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
               <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4">
                     <div>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Inventory Accuracy</p>
                        <h3 className="text-3xl font-black text-white mt-1">{accuracy.toFixed(1)}%</h3>
                     </div>
                     <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                        <Target className="w-6 h-6 text-indigo-500" />
                     </div>
                  </div>
                  <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                     <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${accuracy}%` }}></div>
                  </div>
                  <p className="text-[9px] text-indigo-400 mt-2 font-black uppercase flex items-center gap-2">
                     <ArrowRight className="w-3 h-3" /> Target: 95.0%
                  </p>
               </div>

               <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4">
                     <div>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Recovery Rate</p>
                        <h3 className="text-3xl font-black text-white mt-1">{recoveryRate.toFixed(1)}%</h3>
                     </div>
                     <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                        <RefreshCw className="w-6 h-6 text-emerald-500" />
                     </div>
                  </div>
                  <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                     <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${recoveryRate}%` }}></div>
                  </div>
                  <p className="text-[9px] text-emerald-400 mt-2 font-black uppercase flex items-center gap-2">
                     <CheckCircle2 className="w-3 h-3" /> Success Stories
                  </p>
               </div>

               <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4">
                     <div>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Wasted Labor</p>
                        <h3 className="text-3xl font-black text-white mt-1">{Math.floor(laborWaste)}m</h3>
                     </div>
                     <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                        <UserX className="w-6 h-6 text-red-500" />
                     </div>
                  </div>
                  <p className="text-[9px] text-red-400 mt-2 font-black uppercase flex items-center gap-2">
                     <TrendingDown className="w-3 h-3" /> Inefficiency
                  </p>
               </div>

               <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4">
                     <div>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Freeze Resolve Time</p>
                        <h3 className="text-3xl font-black text-white mt-1">{freezeTime}m</h3>
                     </div>
                     <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                        <Clock className="w-6 h-6 text-blue-500" />
                     </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4 text-[9px] font-black uppercase tracking-widest bg-slate-950 p-2 rounded-lg border border-slate-800 text-slate-400">
                     <Activity className="w-3 h-3 text-blue-500 animate-pulse" /> Zone Lead Active
                  </div>
               </div>
            </div>

            {/* Zone Control Center */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
               <div className="lg:col-span-8 space-y-8">
                  {/* Active Rules Banner */}
                  <div className="bg-indigo-900/10 border border-indigo-500/30 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                        <ShieldCheck className="w-32 h-32 text-indigo-500" />
                     </div>
                     <div className="flex items-center gap-4 relative z-10">
                        <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                           <Ghost className="w-6 h-6 text-white" />
                        </div>
                        <div>
                           <h3 className="text-lg font-black text-white uppercase tracking-tighter">Zone B Logic Core</h3>
                           <p className="text-[10px] text-indigo-300 font-mono mt-1 uppercase tracking-widest">Two-Strike Rule Active • Neighboring Bin Map Loaded</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-3 relative z-10">
                        <button 
                           onClick={triggerPeakFlow}
                           disabled={isSimulating}
                           className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20 flex items-center gap-2 active:scale-95 transition-all disabled:opacity-50"
                        >
                           {isSimulating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                           Trigger Peak Flow
                        </button>
                     </div>
                  </div>

                  {/* Frozen Bin Management */}
                  <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
                     <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                        <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                           <Snowflake className="w-4 h-4 text-blue-500" />
                           Frozen Bin Queue ({frozenBins.filter(b => b.status !== 'Resolved').length})
                        </h3>
                        <span className="text-[9px] font-mono text-slate-500 uppercase">Requires Zone Lead Action</span>
                     </div>
                     <div className="overflow-x-auto">
                        <table className="w-full text-left text-[11px] font-mono">
                           <thead className="bg-slate-950 text-slate-500 uppercase font-black">
                              <tr>
                                 <th className="px-6 py-4">Bin Location</th>
                                 <th className="px-6 py-4">Item (SKU)</th>
                                 <th className="px-6 py-4">Strike Count</th>
                                 <th className="px-6 py-4">Status</th>
                                 <th className="px-6 py-4 text-right">Action</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-800">
                              {frozenBins.filter(b => b.status !== 'Resolved').map(bin => (
                                 <tr key={bin.id} className="hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-6 py-4 text-white font-black">{bin.location}</td>
                                    <td className="px-6 py-4 text-slate-300">
                                       {bin.item} <span className="text-slate-500">({bin.sku})</span>
                                    </td>
                                    <td className="px-6 py-4">
                                       <div className="flex items-center gap-1">
                                          {[...Array(bin.strikes)].map((_, i) => (
                                             <AlertOctagon key={i} className="w-3 h-3 text-red-500 fill-red-500/20" />
                                          ))}
                                       </div>
                                       <span className="text-[9px] text-slate-600 mt-1 block">Reported by: {bin.reportedBy.join(', ')}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                       <span className={`px-2 py-1 rounded text-[9px] font-black uppercase ${
                                          bin.status === 'Frozen' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 
                                          'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                       }`}>
                                          {bin.status}
                                       </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                       <button 
                                          onClick={() => setSelectedBin(bin)}
                                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/20"
                                       >
                                          Investigate
                                       </button>
                                    </td>
                                 </tr>
                              ))}
                              {frozenBins.filter(b => b.status !== 'Resolved').length === 0 && (
                                 <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500 font-bold uppercase tracking-widest">
                                       All Zones Clear • No Frozen Assets
                                    </td>
                                 </tr>
                              )}
                           </tbody>
                        </table>
                     </div>
                  </div>
               </div>

               {/* Live Intelligence Feed */}
               <div className="lg:col-span-4 space-y-6">
                  <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl h-full flex flex-col">
                     <h3 className="text-[10px] font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-emerald-500" /> Sentinel Event Stream
                     </h3>
                     <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 flex-1 overflow-hidden flex flex-col">
                        <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1 pr-2" ref={scrollRef}>
                           {logs.map((log) => (
                              <div key={log.id} className="flex gap-3 animate-in slide-in-from-left-2 fade-in duration-300">
                                 <span className="text-[9px] font-mono text-slate-600 shrink-0 mt-0.5">[{log.time}]</span>
                                 <p className={`text-[10px] font-mono leading-tight ${
                                    log.type === 'alert' ? 'text-red-400' :
                                    log.type === 'success' ? 'text-emerald-400' :
                                    log.type === 'system' ? 'text-blue-400' : 'text-slate-300'
                                 }`}>
                                    {log.message}
                                 </p>
                              </div>
                           ))}
                        </div>
                     </div>
                     
                     <div className="mt-4 pt-4 border-t border-slate-800">
                        <div className="flex items-center justify-between text-[9px] font-black uppercase text-slate-500">
                           <span>Scan Velocity</span>
                           <span className="text-white">142/hr</span>
                        </div>
                        <div className="w-full bg-slate-950 h-1 mt-2 rounded-full overflow-hidden">
                           <div className="h-full bg-blue-500 animate-pulse w-[60%]"></div>
                        </div>
                     </div>
                  </div>

                  {/* Photo Messaging Feed */}
                  <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl">
                     <h3 className="text-[10px] font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Camera className="w-4 h-4 text-indigo-500" /> Direct Photo-Messaging
                     </h3>
                     <div className="space-y-3 mb-4">
                        <div className="flex gap-3">
                           <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[9px] text-white font-black shrink-0">ZL</div>
                           <div className="bg-slate-800 p-2 rounded-lg rounded-tl-none border border-slate-700">
                              <p className="text-[9px] text-slate-300 leading-relaxed">Bin 12-4 cleaned. Item found in neighbor bin 12-6. Performing Digital Transfer.</p>
                              <div className="mt-2 h-16 w-24 bg-slate-700 rounded overflow-hidden relative group cursor-pointer">
                                 <img src="https://images.unsplash.com/photo-1553413077-190dd305871c?w=100&h=100&fit=crop" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" alt="Proof" />
                              </div>
                              <span className="text-[8px] text-slate-500 block mt-1">08:55 AM</span>
                           </div>
                        </div>
                     </div>
                     <button className="w-full py-2 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600/20 transition-all flex items-center justify-center gap-2">
                        <MessageSquare className="w-3 h-3" /> Connect to Zone Lead
                     </button>
                  </div>
               </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto bg-white text-slate-900 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
             <div className="bg-slate-100 p-8 border-b border-slate-200 text-center">
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Ghost Inventory Prevention</h2>
                <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em]">Governance Packet • OptiSchedule Pro</h3>
             </div>
             <div className="p-10 space-y-10 font-serif">
                <section>
                   <h4 className="text-lg font-bold text-slate-900 border-b-2 border-slate-200 pb-2 mb-4 uppercase tracking-widest font-sans">Policy Encoding Summary</h4>
                   <p className="text-sm text-slate-700 leading-relaxed">
                      This document encodes the Stocking, Overflow, Two-Strike, and Smart Audit SOP into machine-enforceable policy controls suitable for enterprise retail environments.
                   </p>
                </section>

                <section>
                   <h4 className="text-lg font-bold text-slate-900 border-b-2 border-slate-200 pb-2 mb-4 uppercase tracking-widest font-sans">Enforcement Model</h4>
                   <p className="text-sm text-slate-700 leading-relaxed">
                      All rules are system-enforced. Manual overrides are logged, time-bound, and auditable. No unassigned inventory placement is permitted.
                   </p>
                </section>

                <section>
                   <h4 className="text-lg font-bold text-slate-900 border-b-2 border-slate-200 pb-2 mb-4 uppercase tracking-widest font-sans">Retail Outcomes</h4>
                   <ul className="list-disc list-inside text-sm text-slate-700 leading-loose space-y-1">
                      <li>Elimination of ghost inventory</li>
                      <li>Reduced picker labor waste</li>
                      <li>Predictable peak-flow readiness</li>
                      <li>Regulator-safe audit trail</li>
                   </ul>
                </section>
             </div>
             <div className="bg-slate-50 p-6 border-t border-slate-200 text-center">
                <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">CONFIDENTIAL – Fortune-50 Internal Use Only | OptiSchedule Pro v1.0</p>
             </div>
          </div>
        )}
      </div>

      {/* Investigation Modal */}
      {selectedBin && (
         <div className="fixed inset-0 bg-slate-950/80 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full border border-slate-800 overflow-hidden">
               <div className="p-6 border-b border-slate-800 bg-slate-950">
                  <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-3">
                     <Search className="w-5 h-5 text-indigo-500" />
                     Investigate Frozen Bin
                  </h3>
                  <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase tracking-widest">Location: {selectedBin.location} • SKU: {selectedBin.sku}</p>
               </div>
               
               <div className="p-8 space-y-6">
                  <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl flex items-start gap-4">
                     <AlertTriangle className="w-6 h-6 text-indigo-500 shrink-0 mt-1" />
                     <div>
                        <h4 className="text-xs font-black text-white uppercase tracking-widest mb-1">Two-Strike Alert</h4>
                        <p className="text-[10px] text-indigo-200 leading-relaxed">
                           Two separate pickers ({selectedBin.reportedBy.join(', ')}) marked this item as SHORT. Bin is currently FROZEN to prevent further labor waste.
                        </p>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Required Zone Lead Action</p>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <button 
                          onClick={() => handleResolve('Transfer')}
                          className="p-4 bg-slate-950 border border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-500/5 rounded-xl text-left group transition-all"
                        >
                           <div className="flex items-center gap-2 mb-2">
                              <RefreshCw className="w-4 h-4 text-slate-400 group-hover:text-emerald-500" />
                              <span className="text-[10px] font-black text-slate-300 group-hover:text-white uppercase">Digital Transfer</span>
                           </div>
                           <p className="text-[9px] text-slate-600 group-hover:text-slate-400">Item found in nearby bin. Relocate & Unfreeze.</p>
                        </button>
                        <button 
                           onClick={() => handleResolve('QC')}
                           className="p-4 bg-slate-950 border border-slate-800 hover:border-blue-500/50 hover:bg-blue-500/5 rounded-xl text-left group transition-all"
                        >
                           <div className="flex items-center gap-2 mb-2">
                              <Activity className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                              <span className="text-[10px] font-black text-slate-300 group-hover:text-white uppercase">Quality Control</span>
                           </div>
                           <p className="text-[9px] text-slate-600 group-hover:text-slate-400">Item damaged or unsellable. Move to QC.</p>
                        </button>
                     </div>

                     <div className="relative group">
                        <button 
                           onClick={simulatePhotoUpload}
                           className="w-full p-4 bg-slate-950 border border-slate-800 hover:border-red-500/50 hover:bg-red-500/5 rounded-xl text-left transition-all"
                        >
                           <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                 <ImageIcon className="w-4 h-4 text-slate-400 group-hover:text-red-500" />
                                 <span className="text-[10px] font-black text-slate-300 group-hover:text-white uppercase">Confirm Zero (Photo Required)</span>
                              </div>
                              {isUploading && <Loader2 className="w-4 h-4 animate-spin text-slate-500" />}
                              {photoProof && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                           </div>
                           <p className="text-[9px] text-slate-600 group-hover:text-slate-400">Permanently zero out stock. Requires visual proof.</p>
                        </button>
                     </div>
                  </div>

                  {photoProof && (
                     <div className="animate-in fade-in slide-in-from-top-2">
                        <div className="h-32 w-full bg-slate-950 rounded-lg overflow-hidden border border-slate-800 relative group">
                           <img src={photoProof} alt="Proof" className="w-full h-full object-cover opacity-80" />
                           <div className="absolute bottom-2 right-2 bg-black/50 px-2 py-1 rounded text-[8px] text-white font-black uppercase backdrop-blur-sm">Proof Uploaded</div>
                        </div>
                        <button 
                           onClick={() => handleResolve('Zero')}
                           className="w-full mt-4 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-red-600/20"
                        >
                           Finalize Zero Stock
                        </button>
                     </div>
                  )}
               </div>
               
               <div className="p-4 bg-slate-950 border-t border-slate-800 text-center">
                  <button onClick={() => setSelectedBin(null)} className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors">Cancel Investigation</button>
               </div>
            </div>
         </div>
      )}

    </div>
  );
};

export default GhostInventory;
