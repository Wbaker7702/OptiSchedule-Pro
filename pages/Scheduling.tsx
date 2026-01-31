
import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import { HEATMAP_DATA } from '../constants';
import { Calendar, RefreshCw, Link as LinkIcon, Check, X, ShieldCheck, Settings, Database, Users as UsersIcon, List, ArrowLeftRight, Activity, Globe, Server, Layers, Hexagon, AlertTriangle, ArrowRight, Share2, Loader2, FileText, Terminal, Zap, Sparkles, Fingerprint, Search, Shield } from 'lucide-react';
import { View, ERPProvider, IntegrationStatus } from '../types';

interface SchedulingProps {
  setCurrentView?: (view: View) => void;
  onFinalize?: () => void;
  activeProvider: ERPProvider;
  setActiveProvider: (provider: ERPProvider) => void;
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
  setHubspotStatus: (status: IntegrationStatus) => void;
}

type SyncStatus = 'SYNCED' | 'SYNCING' | 'CONFLICT' | 'OFFLINE';

const syncLogs = [
  { event: 'Personnel Registry Sync', target: 'Azure AD / Sentinel Node', status: 'Success', time: '09:42:11' },
  { event: 'Fiscal Budget Ingress', target: 'SAP S/4HANA', status: 'Success', time: '09:40:05' },
  { event: 'Marketing Attribution Load', target: 'HubSpot CRM', status: 'Success', time: '09:38:50' },
  { event: 'Inventory Level Verification', target: 'Dynamics 365 SCM', status: 'Success', time: '09:35:22' },
  { event: 'Policy Linter Check', target: 'Local Node', status: 'Success', time: '09:30:00' },
];

const Scheduling: React.FC<SchedulingProps> = ({ 
  setCurrentView, 
  onFinalize,
  activeProvider,
  setActiveProvider,
  isConnected,
  setIsConnected,
  setHubspotStatus
}) => {
  const [selectedProvider, setSelectedProvider] = useState<ERPProvider>('HubSpot'); 
  const [isModalOpen, setIsModalOpen] = useState(!isConnected);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'heatmap' | 'logs'>('heatmap');
  const [isBreezeMode, setIsBreezeMode] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [showAdjustmentSuccess, setShowAdjustmentSuccess] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);
  
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(isConnected ? 'SYNCED' : 'OFFLINE');
  const [showConflictModal, setShowConflictModal] = useState(false);
  
  const [environmentUrl, setEnvironmentUrl] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [apiKey, setApiKey] = useState('');

  const breezeSteps = [
    "BREEZE_AGENT: Initiating Smart-Discovery for Store 5065...",
    "BREEZE_AGENT: Located portal 'Walmart_Operations_Secure'...",
    "BREEZE_AGENT: Validating OAuth handshake protocols...",
    "BREEZE_AGENT: Mapping Deals -> Floor Traffic Correlation...",
    "BREEZE_AGENT: Synchronizing 12,400 Contact Records...",
    "BREEZE_AGENT: Intelligence Node established (HubSpot Cloud).",
    "BREEZE_AGENT: Ready for Proactive Resource Allocation."
  ];

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs]);

  const handleSync = () => {
    setIsSyncing(true);
    setSyncStatus('SYNCING');
    setTimeout(() => {
        setIsSyncing(false);
        const hasConflict = Math.random() > 0.4;
        if (hasConflict) {
            setSyncStatus('CONFLICT');
            setShowConflictModal(true);
        } else {
            setSyncStatus('SYNCED');
        }
    }, 2000);
  };

  const handleAdjustStaffing = () => {
    setIsAdjusting(true);
    setTimeout(() => {
      setIsAdjusting(false);
      setShowAdjustmentSuccess(true);
      setSyncStatus('SYNCED');
      setTimeout(() => setShowAdjustmentSuccess(false), 3000);
    }, 1500);
  };

  const handleBreezeDiscovery = () => {
    setIsScanning(true);
    setTerminalLogs(["BREEZE AGENT: STARTING PORTAL DISCOVERY..."]);
    
    let step = 0;
    const interval = setInterval(() => {
        if (step < breezeSteps.length) {
            setTerminalLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${breezeSteps[step]}`]);
            setSyncProgress(Math.min(100, Math.floor(((step + 1) / breezeSteps.length) * 100)));
            step++;
        } else {
            clearInterval(interval);
            setTimeout(() => {
                setIsModalOpen(false);
                setActiveProvider('HubSpot');
                setIsConnected(true);
                setIsSyncing(false);
                setSyncStatus('SYNCED');
                setHubspotStatus('connected');
                setIsScanning(false);
                setTerminalLogs([]);
            }, 800);
        }
    }, 400);
  };

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSyncing(true);
    setTerminalLogs([`INITIALIZING ${selectedProvider.toUpperCase()} NODE...`]);
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        setSyncProgress(progress);
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                setIsModalOpen(false);
                setActiveProvider(selectedProvider);
                setIsConnected(true);
                setIsSyncing(false);
                setSyncStatus('SYNCED');
            }, 500);
        }
    }, 200);
  };

  const renderProviderIcon = (provider: ERPProvider, className = "w-6 h-6") => {
      if (provider === 'SAP S/4HANA') return <Server className={className} />;
      if (provider === 'FDE') return <Layers className={className} />;
      if (provider === 'HubSpot') return <Share2 className={className} />;
      return <Database className={className} />;
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-auto relative text-gray-900">
      <Header title="Scheduling Center" subtitle="Workforce Allocation & CRM Ingress" />
      
      {/* Breeze Connection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-300">
            <div className={`bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 transition-all duration-500 ${selectedProvider === 'HubSpot' ? 'shadow-orange-500/10 border-orange-100' : ''}`}>
                <div className={`p-8 flex items-center justify-between transition-colors duration-500 ${
                    selectedProvider === 'HubSpot' ? 'bg-[#ff7a59]' : 'bg-[#002050]'
                }`}>
                    <div className="flex items-center gap-4">
                        <div className="bg-white/20 p-2 rounded-xl border border-white/30">
                            {renderProviderIcon(selectedProvider, "w-8 h-8 text-white")}
                        </div>
                        <div>
                            <h3 className="text-white font-black text-2xl uppercase tracking-tighter">
                                {selectedProvider === 'HubSpot' ? 'Breeze Agent' : 'Enterprise Node'}
                            </h3>
                            <p className="text-white/70 text-[10px] font-mono uppercase tracking-[0.2em]">{selectedProvider === 'HubSpot' ? 'CRM Intelligence Sync' : 'ERP Protocol Auth'}</p>
                        </div>
                    </div>
                    {!isScanning && (
                        <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-full p-2">
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
                
                <div className="p-10">
                    {!isScanning ? (
                        <>
                            <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8">
                                {(['Dynamics 365', 'SAP S/4HANA', 'HubSpot'] as ERPProvider[]).map((p) => (
                                    <button 
                                      key={p} 
                                      onClick={() => setSelectedProvider(p)} 
                                      className={`flex-1 py-3 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all ${selectedProvider === p ? 'bg-white text-slate-900 shadow-md scale-100' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>

                            {selectedProvider === 'HubSpot' ? (
                                <div className="space-y-8">
                                    <div className="flex flex-col items-center text-center space-y-4">
                                        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center relative">
                                            <Sparkles className="w-10 h-10 text-[#ff7a59]" />
                                            <div className="absolute inset-0 bg-orange-400/20 rounded-full animate-ping"></div>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="text-xl font-black text-slate-900">Sign in with HubSpot Breeze</h4>
                                            <p className="text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
                                                Our AI agent will automatically discover your portal and sync CRM deals to your floor traffic predictions.
                                            </p>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={handleBreezeDiscovery}
                                        className="w-full py-6 bg-[#ff7a59] hover:bg-[#ff8f75] text-white font-black text-sm uppercase tracking-[0.3em] rounded-2xl shadow-2xl shadow-orange-500/30 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-4 group"
                                    >
                                        <Zap className="w-6 h-6 fill-white group-hover:rotate-12 transition-transform" />
                                        Launch Breeze Discovery
                                    </button>

                                    <div className="text-center">
                                        <button className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-[#ff7a59] transition-colors underline underline-offset-8 decoration-slate-200">
                                            Enter Portal ID Manually
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleConnect} className="space-y-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Service Endpoint</label>
                                            <input type="text" placeholder="https://..." className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all font-mono font-bold" required />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Auth Token</label>
                                            <input type="password" placeholder="••••••••" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all font-mono font-bold" required />
                                        </div>
                                    </div>
                                    <button type="submit" className="w-full py-5 bg-[#002050] hover:bg-[#003070] text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl transition-all">
                                        Authorize Enterprise Node
                                    </button>
                                </form>
                            )}
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
                                      <span className="opacity-30">BZ>></span> {log}
                                    </div>
                                  ))}
                                  <div ref={logEndRef} />
                                </div>
                            </div>

                            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-1 border border-slate-200">
                                <div className="h-full bg-[#ff7a59] rounded-full transition-all duration-300 relative" style={{ width: `${syncProgress}%` }}>
                                    <div className="absolute inset-0 bg-white/30 animate-[shimmer_1s_infinite]"></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}

      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {!isConnected ? (
             <div className="bg-white rounded-3xl shadow-xl border border-orange-100 p-10 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#ff7a59]/10 to-[#ff7a59]/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
                <div className="flex items-center gap-8 z-10 relative">
                   <div className="w-24 h-24 bg-orange-50 rounded-3xl flex items-center justify-center border border-orange-100 shadow-sm shrink-0">
                      <Sparkles className="w-12 h-12 text-[#ff7a59]" />
                   </div>
                   <div className="max-w-xl">
                     <h3 className="text-2xl font-black text-slate-900 mb-3 uppercase tracking-tighter">Breeze Intelligence Node</h3>
                     <p className="text-slate-600 leading-relaxed text-sm font-medium">
                        Leverage the <strong>HubSpot Breeze Agent</strong> to bridge the gap between digital marketing velocity and physical workforce deployment. 
                     </p>
                   </div>
                </div>
                <button 
                  onClick={() => setIsModalOpen(true)} 
                  className="flex items-center gap-4 px-10 py-5 bg-[#ff7a59] hover:bg-[#ff8f75] text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all shadow-2xl shadow-orange-500/20 z-10 whitespace-nowrap"
                >
                   <Zap className="w-5 h-5 fill-white" /> Connect Breeze
                </button>
             </div>
        ) : (
            <div className={`bg-white rounded-3xl shadow-lg border p-8 flex flex-col lg:flex-row items-center justify-between bg-gradient-to-r gap-8 ${activeProvider === 'HubSpot' ? 'border-orange-100 from-white via-orange-50/20 to-orange-50/40' : 'border-blue-100 from-white via-blue-50/20 to-blue-50/40'}`}>
               <div className="flex items-center gap-6 w-full lg:w-auto">
                  <div className="relative shrink-0">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-2xl ring-4 ring-white ${activeProvider === 'HubSpot' ? 'bg-[#ff7a59]' : 'bg-[#002050]'}`}>
                         {activeProvider === 'HubSpot' ? <Sparkles className="w-10 h-10" /> : renderProviderIcon(activeProvider, "w-10 h-10")}
                      </div>
                      <div className={`absolute -bottom-2 -right-2 border-[4px] border-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${syncStatus === 'SYNCED' ? 'bg-emerald-500' : 'bg-orange-500 animate-pulse'}`}>
                          {syncStatus === 'SYNCED' ? <Check className="w-4 h-4 text-white" /> : <RefreshCw className="w-4 h-4 text-white animate-spin" />}
                      </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-3 uppercase tracking-tighter">
                        {activeProvider === 'HubSpot' ? 'Breeze Copilot Online' : `${activeProvider} Node Validated`}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono font-black uppercase tracking-widest flex items-center gap-2">
                        <Fingerprint className="w-3 h-3" /> Node: STORE-5065-INGRESS-01
                    </p>
                  </div>
               </div>
               
               <div className="flex items-center gap-4 w-full lg:w-auto justify-end">
                   <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-3 px-6 py-3 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                       <Settings className="w-4 h-4" /> Environment Configuration
                   </button>
                   <button onClick={handleSync} disabled={isSyncing} className={`flex items-center gap-3 px-8 py-3 bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm ${isSyncing ? 'opacity-70 cursor-wait' : ''}`}>
                      <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-[#ff7a59]' : ''}`} /> Force {activeProvider} Sync
                   </button>
               </div>
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
               <div className="flex items-center gap-4 border-b border-slate-200 pb-1">
                  <button onClick={() => setActiveTab('heatmap')} className={`flex items-center gap-3 px-6 py-4 text-[11px] font-black uppercase tracking-widest transition-all relative ${activeTab === 'heatmap' ? 'text-[#ff7a59]' : 'text-slate-400 hover:text-slate-600'}`}>
                    <Activity className="w-4 h-4" /> Labor Capacity Matrix
                    {activeTab === 'heatmap' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#ff7a59] rounded-t-full shadow-[0_-4px_10px_rgba(255,122,89,0.3)]" />}
                  </button>
                  <button onClick={() => setActiveTab('logs')} className={`flex items-center gap-3 px-6 py-4 text-[11px] font-black uppercase tracking-widest transition-all relative ${activeTab === 'logs' ? 'text-[#ff7a59]' : 'text-slate-400 hover:text-slate-600'}`}>
                    <List className="w-4 h-4" /> Enterprise Audit Trail
                    {activeTab === 'logs' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#ff7a59] rounded-t-full shadow-[0_-4px_10px_rgba(255,122,89,0.3)]" />}
                  </button>
               </div>

               {activeTab === 'heatmap' ? (
                  <div className="bg-slate-950 rounded-3xl shadow-2xl border border-slate-800 overflow-hidden relative">
                    <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                       <div>
                           <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                             <Layers className="w-5 h-5 text-[#ff7a59]" />
                             Predictive Capacity Model
                           </h2>
                           <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase tracking-widest">Powered by Breeze Intelligence Engine</p>
                       </div>
                       <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-full"></div><span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Real Volume</span></div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div><span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Breeze Forecast</span></div>
                       </div>
                    </div>
                    <div className="p-8 overflow-x-auto">
                      <div className="min-w-[800px] grid grid-cols-[160px_repeat(10,1fr)]">
                          <div className="flex flex-col justify-center space-y-16 text-slate-500 font-black text-[10px] uppercase tracking-widest pr-6 border-r border-slate-800">
                            <div className="h-24 flex items-center justify-end">Predicted Traffic</div>
                            <div className="h-24 flex items-center justify-end">Capacity Goal</div>
                          </div>
                          {HEATMAP_DATA.map((point, index) => (
                              <div key={index} className="flex flex-col relative group">
                                <div className="h-10 border-b border-slate-800 flex items-center justify-center text-slate-500 text-[10px] font-mono">{point.hour}</div>
                                <div className={`h-24 transition-all duration-500 border-r border-slate-800/50 flex items-center justify-center text-white font-black text-xl ${activeProvider === 'HubSpot' ? 'bg-[#ff7a59]/20 group-hover:bg-[#ff7a59]/30' : 'bg-blue-600/20'}`}>
                                    {activeProvider === 'HubSpot' ? Math.round(point.transactionVolume * 1.2) : point.transactionVolume}
                                </div>
                                <div className={`h-24 bg-slate-900 border-r border-slate-800/50 flex items-center justify-center text-slate-400 font-black text-xl relative group-hover:bg-slate-800 transition-colors`}>
                                    {point.staffing}
                                </div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                                    <span className="bg-white text-slate-950 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-2xl whitespace-nowrap">
                                        Efficiency: {point.efficiency}%
                                    </span>
                                </div>
                              </div>
                            ))}
                        </div>
                    </div>
                  </div>
               ) : (
                 <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="divide-y divide-slate-100">
                        {syncLogs.map((log, i) => (
                            <div key={i} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                                <div className="flex items-center gap-5">
                                    <div className={`p-3 rounded-xl transition-transform group-hover:scale-110 ${log.status === 'Success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                                        {log.status === 'Success' ? <Check className="w-4 h-4" /> : <Loader2 className="w-4 h-4 animate-spin" />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{log.event}</p>
                                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">Destination: {log.target}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded inline-block">{log.status}</p>
                                    <p className="text-[10px] text-slate-400 font-mono mt-1.5">{log.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                 </div>
               )}
            </div>

            {/* Breeze Copilot Inline Action */}
            <div className="bg-[#1c120f] rounded-3xl shadow-2xl border border-[#ff7a59]/20 p-8 flex flex-col relative overflow-hidden h-fit sticky top-24">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                    <Sparkles className="w-32 h-32 text-[#ff7a59]" />
                </div>
                <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-[#ff7a59]/20 rounded-2xl border border-[#ff7a59]/30">
                            <Zap className="w-6 h-6 text-[#ff7a59]" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-white uppercase tracking-tighter">Breeze Copilot</h3>
                            <p className="text-[10px] text-[#ff7a59]/60 font-mono uppercase tracking-widest">Active Intelligence</p>
                        </div>
                    </div>

                    <div className="p-6 bg-slate-900/50 rounded-2xl border border-white/5 space-y-4">
                        <p className="text-sm font-bold text-white/90 leading-relaxed">
                            HubSpot signals indicate a <span className="text-orange-400">12% increase</span> in regional traffic probability due to the 'Spring Surge' campaign.
                        </p>
                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
                            <Check className="w-4 h-4 text-emerald-500" />
                            Policy Alignment Verified
                        </div>
                    </div>

                    <div className="pt-4 border-t border-white/5">
                        <button 
                          onClick={handleAdjustStaffing}
                          disabled={isAdjusting}
                          className={`w-full py-5 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center justify-center gap-4 active:scale-[0.98] disabled:opacity-50 ${showAdjustmentSuccess ? 'bg-emerald-600' : 'bg-[#ff7a59] hover:bg-[#ff8f75] shadow-orange-500/20'}`}
                        >
                            {isAdjusting ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : showAdjustmentSuccess ? (
                              <Check className="w-5 h-5" />
                            ) : (
                              <Zap className="w-5 h-5 fill-white" />
                            )}
                            {isAdjusting ? 'Reallocating...' : showAdjustmentSuccess ? 'Deployment Adjusted' : 'Adjust Staffing Now'}
                        </button>
                        <p className="text-center text-[9px] text-slate-600 mt-4 uppercase font-black tracking-widest">Action will be logged in Sentinel Audit Trail</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Scheduling;
