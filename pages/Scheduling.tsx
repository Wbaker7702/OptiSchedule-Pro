
import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
// Fixed: Added Scale to the lucide-react import
import { Calendar, RefreshCw, Link as LinkIcon, Check, X, ShieldCheck, Settings, Database, Users as UsersIcon, List, ArrowLeftRight, Activity, Globe, Server, Layers, Hexagon, AlertTriangle, ArrowRight, Share2, Loader2, FileText, Terminal, Zap, Sparkles, Fingerprint, Search, Shield, Info, UserCircle, Clock, Scale } from 'lucide-react';
import { View, ERPProvider, IntegrationStatus, HeatmapDataPoint } from '../types';
import { EMPLOYEES, LABOR_REGULATIONS, CURRENT_STATE } from '../constants';

interface SchedulingProps {
  setCurrentView?: (view: View) => void;
  onFinalize?: () => void;
  activeProvider: ERPProvider;
  setActiveProvider: (provider: ERPProvider) => void;
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
  setHubspotStatus: (status: IntegrationStatus) => void;
  heatmapData: HeatmapDataPoint[];
  onAdjustStaffing: () => void;
}

const Scheduling: React.FC<SchedulingProps> = ({ 
  setCurrentView, 
  onFinalize,
  activeProvider,
  setActiveProvider,
  isConnected,
  setIsConnected,
  setHubspotStatus,
  heatmapData,
  onAdjustStaffing
}) => {
  const [selectedProvider, setSelectedProvider] = useState<ERPProvider>('HubSpot'); 
  const [isModalOpen, setIsModalOpen] = useState(!isConnected);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState<'heatmap' | 'logs'>('heatmap');
  const [syncProgress, setSyncProgress] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  const reg = LABOR_REGULATIONS[CURRENT_STATE];

  useEffect(() => {
    setIsModalOpen(!isConnected);
  }, [isConnected]);

  const handleBreezeDiscovery = () => {
    setIsScanning(true);
    setSyncProgress(0);
    const steps = ["Auth Handshake...", "Parsing HS Deals...", "Validating MI Labor Laws...", "Mapping Personas..."];
    let stepIdx = 0;
    
    const interval = setInterval(() => {
        if (stepIdx < steps.length) {
            setTerminalLogs(prev => [...prev, `[BZ] ${steps[stepIdx]}`]);
            setSyncProgress(prev => prev + 25);
            stepIdx++;
        } else {
            clearInterval(interval);
            setIsModalOpen(false);
            setIsConnected(true);
            setActiveProvider('HubSpot');
            setHubspotStatus('connected');
            setIsScanning(false);
        }
    }, 600);
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-auto relative text-gray-900 custom-scrollbar">
      <Header title="Deployment Center" subtitle={`Scheduling Node Store #5065 • ${reg.state} Jurisdiction`} />

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4 backdrop-blur-md">
            <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200">
                <div className={`p-8 flex items-center justify-between transition-colors duration-500 ${selectedProvider === 'HubSpot' ? 'bg-[#ff7a59]' : 'bg-[#002050]'}`}>
                    <div className="flex items-center gap-4">
                        <ShieldCheck className="w-8 h-8 text-white" />
                        <div>
                            <h3 className="text-white font-black text-2xl uppercase tracking-tighter">Breeze Protocol</h3>
                            <p className="text-white/70 text-[10px] font-mono uppercase tracking-widest">{reg.state} Labor Compliant Node</p>
                        </div>
                    </div>
                </div>
                
                <div className="p-10 text-center">
                    {!isScanning ? (
                        <>
                            <div className="mb-8">
                                <Sparkles className="w-12 h-12 text-[#ff7a59] mx-auto mb-4" />
                                <h4 className="text-xl font-black text-slate-900">Authorize HubSpot Sync</h4>
                                <p className="text-sm text-slate-500 mt-2">Discovering portal 'Walmart_MI_Ops_Sec'...</p>
                            </div>
                            <button 
                                onClick={handleBreezeDiscovery}
                                className="w-full py-5 bg-[#ff7a59] hover:bg-[#ff8f75] text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl shadow-xl transition-all flex items-center justify-center gap-4"
                            >
                                <Zap className="w-5 h-5 fill-white" /> Launch Breeze Discovery
                            </button>
                        </>
                    ) : (
                        <div className="py-10 space-y-8">
                            <div className="flex flex-col items-center justify-center gap-6">
                                <div className="relative">
                                    <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center border-2 border-orange-100">
                                        <Search className="w-10 h-10 text-[#ff7a59] animate-pulse" />
                                    </div>
                                    <div className="absolute -top-2 -right-2">
                                        <div className="h-8 w-8 bg-white rounded-full shadow-lg border border-orange-100 flex items-center justify-center">
                                            <Loader2 className="w-4 h-4 text-[#ff7a59] animate-spin" />
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-black text-slate-900">{syncProgress}% Discovery Complete</p>
                                    <p className="text-sm text-slate-500">Breeze is mapping your operational schema...</p>
                                </div>
                            </div>
                            
                            <div className="bg-slate-950 rounded-2xl p-6 font-mono text-[10px] text-orange-400 h-40 overflow-hidden border border-orange-500/20 shadow-inner">
                                <div className="space-y-2">
                                  {terminalLogs.map((log, i) => (
                                    <div key={i} className="animate-in fade-in slide-in-from-bottom-1 duration-200 truncate flex gap-3">
                                      <span className="opacity-30">{'BZ>>'}</span> {log}
                        <div className="space-y-6">
                            <div className="bg-slate-950 rounded-2xl p-6 font-mono text-[10px] text-orange-400 h-40 overflow-hidden text-left border border-orange-500/20 shadow-inner">
                                {terminalLogs.map((log, i) => (
                                    <div key={i} className="animate-in fade-in slide-in-from-bottom-1 truncate">
                                        <span className="opacity-30">{'BZ>>'}</span> {log}
                                    </div>
                                ))}
                                <div ref={logEndRef} />
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                <div className="h-full bg-[#ff7a59] transition-all duration-300" style={{ width: `${syncProgress}%` }}></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}

      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 space-y-6">
                <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
                            <ShieldCheck className="w-10 h-10 text-emerald-500" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Compliance Guard: {reg.state}</h3>
                            <p className="text-xs text-slate-500 font-mono font-black uppercase tracking-widest flex items-center gap-2 mt-1">
                                <Clock className="w-3 h-3 text-orange-400" /> Curfew: {reg.curfewMinor1617} (Minor 16-17)
                            </p>
                        </div>
                    </div>
                    <div className="bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 text-center">
                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Minor Break Protocol</p>
                        <p className="text-sm font-black text-slate-900 font-mono">{reg.mandatoryBreakDuration}m every {reg.mandatoryBreakThreshold}h</p>
                    </div>
                </div>

                <div className="bg-slate-950 rounded-3xl shadow-2xl border border-slate-800 overflow-hidden relative">
                    <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                       <div>
                           <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                             <Layers className="w-5 h-5 text-[#ff7a59]" />
                             Predictive Capacity Model
                           </h2>
                           <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase tracking-widest">Powered by Breeze Intelligence Node</p>
                       </div>
                    </div>
                    <div className="p-8 overflow-x-auto">
                        <div className="min-w-[800px] grid grid-cols-[160px_repeat(8,1fr)]">
                            <div className="flex flex-col justify-center space-y-16 text-slate-500 font-black text-[10px] uppercase tracking-widest pr-6 border-r border-slate-800">
                                <div className="h-24 flex items-center justify-end">Projected Traffic</div>
                                <div className="h-24 flex items-center justify-end">Staff Goal</div>
                            </div>
                            {heatmapData.map((point, index) => (
                                <div key={index} className="flex flex-col relative group">
                                    <div className="h-10 border-b border-slate-800 flex items-center justify-center text-slate-500 text-[10px] font-mono">{point.hour}</div>
                                    <div className="h-24 bg-blue-500/10 border-r border-slate-800/50 flex items-center justify-center text-white font-black text-xl">
                                        {point.transactionVolume}
                                    </div>
                                    <div className="h-24 bg-slate-900 border-r border-slate-800/50 flex items-center justify-center text-slate-400 font-black text-xl">
                                        {point.staffing}
                                    </div>
                                    {/* Compliance Warning for Minors after 10 PM */}
                                    {point.hour === '10 PM' && (
                                        <div className="absolute inset-0 bg-orange-500/10 border-2 border-orange-500/40 pointer-events-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="bg-orange-500 text-white text-[8px] font-black uppercase px-2 py-1 rounded">Minor Curfew</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <UsersIcon className="w-4 h-4 text-blue-600" />
                        Staffing Roster ({reg.state})
                    </h3>
                    <div className="space-y-3">
                        {EMPLOYEES.map((emp) => (
                            <div key={emp.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-3 hover:border-blue-500/20 transition-all cursor-pointer group">
                                <div className="relative">
                                    <img src={emp.avatar} alt={emp.name} className="w-8 h-8 rounded-full border border-white shadow-sm" />
                                    {emp.isMinor && <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border border-white flex items-center justify-center text-[6px] font-black text-white">M</div>}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-[10px] font-black text-slate-900 uppercase truncate">{emp.name}</p>
                                    <p className="text-[8px] text-slate-500 font-mono uppercase truncate">{emp.role} {emp.isMinor ? `(Age ${emp.age})` : ''}</p>
                                </div>
                                <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest transition-colors ${emp.isMinor ? 'bg-orange-500/10 text-orange-600' : 'bg-blue-500/10 text-blue-600'}`}>
                                    {emp.isMinor ? 'Guard' : 'Deploy'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-[#1c120f] rounded-3xl shadow-2xl border border-[#ff7a59]/20 p-8 flex flex-col relative overflow-hidden h-fit">
                    <div className="absolute top-0 right-0 p-6 opacity-10">
                        <Scale className="w-32 h-32 text-[#ff7a59]" />
                    </div>
                    <div className="relative z-10 space-y-6">
                        <h3 className="text-lg font-black text-white uppercase tracking-tighter">Compliance Node</h3>
                        <div className="p-4 bg-slate-900/50 rounded-xl border border-white/5">
                            <p className="text-[10px] text-slate-400 font-mono mb-2 uppercase tracking-widest">White Space: Ohio Rollout</p>
                            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden opacity-20">
                                <div className="bg-slate-600 h-full w-[0%]"></div>
                            </div>
                            <p className="text-[8px] text-slate-600 font-mono mt-1 uppercase">Region OH Module: Locked</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Scheduling;
