
import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import { HEATMAP_DATA } from '../constants';
import { Calendar, RefreshCw, Link as LinkIcon, Check, X, ShieldCheck, Settings, Database, Users as UsersIcon, List, ArrowLeftRight, Activity, Globe, Server, Layers, Hexagon, AlertTriangle, ArrowRight, Share2, Loader2, FileText, Terminal, Zap, Sparkles, Fingerprint } from 'lucide-react';
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
  const [syncProgress, setSyncProgress] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'heatmap' | 'logs'>('heatmap');
  const [isBreezeMode, setIsBreezeMode] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);
  
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(isConnected ? 'SYNCED' : 'OFFLINE');
  const [showConflictModal, setShowConflictModal] = useState(false);
  
  const [environmentUrl, setEnvironmentUrl] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [apiKey, setApiKey] = useState('');
  
  const [syncConfig, setSyncConfig] = useState({
    employees: true,
    shifts: true,
    timeOff: false,
    performance: false
  });

  const breezeLogPool = [
    "BREEZE_AGENT: Scanning local network for active Portal sessions...",
    "BREEZE_AGENT: Found HubSpot Session (Store_5065_Prod)",
    "BREEZE_AGENT: Authorizing via Smart-Handshake...",
    "BREEZE_AGENT: Mapping Sales Hub Velocity to Labor Matrix",
    "BREEZE_AGENT: CRM -> Sentinel Bridge established successfully.",
    "BREEZE_AGENT: Deploying Real-time Deal-Staffing Correlation.",
    "BREEZE_AGENT: Breeze Intelligence Node Online."
  ];

  const erpLogPool = [
    "POST /api/v1/auth/token [HANDSHAKE_OK]",
    "GET /financial/ledger/v2/workforce_budget",
    "VERIFYING: S/4HANA Schema integrity...",
    "MAPPING: 'gl_code_8801' -> 'Labor_Allocation_FrontEnd'",
    "ENFORCING: Sentinel Security Policy v3.1",
    "SYNC_COMPLETE: Ledger entries synchronized."
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

  const handleBreezeConnect = () => {
    setIsBreezeMode(true);
    setIsSyncing(true);
    setTerminalLogs(["BREEZE AGENT: INITIATING AUTO-INTEGRATION..."]);
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 12) + 5;
        if (progress > 100) progress = 100;
        setSyncProgress(progress);
        
        const log = breezeLogPool[Math.floor(progress / 15)] || breezeLogPool[breezeLogPool.length - 1];
        setTerminalLogs(prev => [...new Set([...prev, `[${new Date().toLocaleTimeString()}] ${log}`])].slice(-8));

        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                setIsModalOpen(false);
                setActiveProvider('HubSpot');
                setIsConnected(true);
                setIsSyncing(false);
                setSyncStatus('SYNCED');
                setSyncProgress(0);
                setTerminalLogs([]);
                setHubspotStatus('connected');
                setIsBreezeMode(false);
            }, 800);
        }
    }, 300);
  };

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSyncing(true);
    setTerminalLogs([`INITIALIZING ${selectedProvider.toUpperCase()} NODE...`]);
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 8) + 2;
        if (progress > 100) progress = 100;
        setSyncProgress(progress);
        
        const pool = erpLogPool;
        const randomLog = pool[Math.floor(Math.random() * pool.length)];
        setTerminalLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${randomLog}`].slice(-8));

        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                setIsModalOpen(false);
                setActiveProvider(selectedProvider);
                setIsConnected(true);
                setIsSyncing(false);
                setSyncStatus('SYNCED');
                setSyncProgress(0);
                setTerminalLogs([]);
            }, 600);
        }
    }, 250);
  };

  const renderProviderIcon = (provider: ERPProvider, className = "w-6 h-6") => {
      if (provider === 'SAP S/4HANA') return <Server className={className} />;
      if (provider === 'FDE') return <Layers className={className} />;
      if (provider === 'HubSpot') return <Share2 className={className} />;
      return <Database className={className} />;
  };

  const getStatusColor = (status: SyncStatus) => {
      switch(status) {
          case 'SYNCED': return 'bg-emerald-500';
          case 'SYNCING': return 'bg-blue-500 animate-pulse';
          case 'CONFLICT': return 'bg-red-500 animate-pulse';
          default: return 'bg-gray-400';
      }
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-auto relative text-gray-900">
      <Header title="Scheduling Center" subtitle="Enterprise Edition v3.0.0 • Workforce Allocation Protocol" />
      
      {/* Connection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className={`bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden transform transition-all scale-100 border text-slate-900 ${
                selectedProvider === 'HubSpot' ? 'border-orange-100 shadow-orange-500/10' : 'border-gray-100'
            }`}>
                <div className={`p-6 flex items-center justify-between transition-colors duration-500 ${
                    selectedProvider === 'HubSpot' ? 'bg-[#ff7a59]' : 'bg-[#002050]'
                }`}>
                    <h3 className="text-white font-bold text-xl flex items-center gap-2">
                        {renderProviderIcon(selectedProvider, "w-6 h-6 text-white")}
                        {isConnected ? `${activeProvider} Settings` : 'Connect Enterprise Node'}
                    </h3>
                    {!isSyncing && (
                        <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-full p-1">
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
                
                <div className="p-8">
                    {!isSyncing ? (
                        <>
                            {!isConnected && (
                                <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                                    {(['Dynamics 365', 'SAP S/4HANA', 'FDE', 'HubSpot'] as ERPProvider[]).map((p) => (
                                        <button key={p} onClick={() => setSelectedProvider(p)} className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${selectedProvider === p ? 'bg-white text-slate-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                                            {p === 'HubSpot' ? 'HubSpot' : p.replace('Dynamics ', 'D').replace('S/4HANA', 'HANA')}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {selectedProvider === 'HubSpot' ? (
                                <div className="space-y-6">
                                    <div className="text-center space-y-2">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 rounded-full text-[10px] font-black text-[#ff7a59] uppercase tracking-widest mb-2">
                                            <Sparkles className="w-3 h-3" /> New: Breeze Agent Active
                                        </div>
                                        <h4 className="text-lg font-black text-slate-900">Effortless HubSpot Integration</h4>
                                        <p className="text-sm text-slate-500 leading-relaxed px-4">
                                            Connect in seconds with the <strong>Breeze Agent</strong>. We'll auto-discover your Portal and sync marketing velocity with your labor matrix.
                                        </p>
                                    </div>

                                    <button 
                                        onClick={handleBreezeConnect}
                                        className="w-full py-5 bg-[#ff7a59] hover:bg-[#ff8f75] text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-orange-500/30 transition-all transform hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-3 relative overflow-hidden group"
                                    >
                                        <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 skew-x-12"></div>
                                        <Zap className="w-5 h-5 fill-white" />
                                        One-Click Breeze Connect
                                    </button>

                                    <div className="relative py-4">
                                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                                        <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest text-gray-400"><span className="bg-white px-4">Or Manual Entry</span></div>
                                    </div>

                                    <form onSubmit={handleConnect} className="space-y-4">
                                        <div className="grid grid-cols-1 gap-4">
                                            <input type="text" placeholder="Portal ID (Hub ID)" className="w-full px-4 py-3 border-2 border-slate-100 rounded-xl focus:ring-2 focus:ring-[#ff7a59] focus:border-[#ff7a59] outline-none transition-all placeholder-slate-400 font-mono text-sm font-bold" />
                                            <input type="password" placeholder="Private App Token" className="w-full px-4 py-3 border-2 border-slate-100 rounded-xl focus:ring-2 focus:ring-[#ff7a59] focus:border-[#ff7a59] outline-none transition-all placeholder-slate-400 font-mono text-sm font-bold" />
                                        </div>
                                        <button type="submit" className="w-full py-3 text-slate-400 font-black text-[10px] uppercase tracking-widest border-2 border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">Authorize Manual Node</button>
                                    </form>
                                </div>
                            ) : (
                                <form onSubmit={handleConnect} className="space-y-5">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-800 uppercase tracking-widest mb-2">Endpoint URL</label>
                                        <input type="text" value={environmentUrl} onChange={(e) => setEnvironmentUrl(e.target.value)} placeholder="https://..." className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder-slate-400 bg-white font-mono text-sm font-bold" required />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-800 uppercase tracking-widest mb-2">Environment Token</label>
                                        <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder-slate-400 bg-white font-mono text-sm font-bold" required />
                                    </div>
                                    <div className="pt-4">
                                        <button type="submit" className="w-full py-4 bg-[#002050] hover:bg-[#003070] text-white font-black text-xs uppercase tracking-[0.2em] rounded-xl shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2">
                                            Authorize {selectedProvider} Node
                                        </button>
                                    </div>
                                </form>
                            )}
                        </>
                    ) : (
                        <div className="py-4 space-y-6 flex flex-col items-center justify-center min-h-[350px]">
                            <div className="relative">
                                <div className={`w-20 h-20 rounded-full flex items-center justify-center animate-pulse ${selectedProvider === 'HubSpot' ? 'bg-orange-50 ring-4 ring-orange-100' : 'bg-blue-50'}`}>
                                    {isBreezeMode ? (
                                        <Sparkles className="w-10 h-10 text-[#ff7a59]" />
                                    ) : (
                                        renderProviderIcon(selectedProvider, `w-8 h-8 ${selectedProvider === 'HubSpot' ? 'text-[#ff7a59]' : 'text-blue-600'}`)
                                    )}
                                </div>
                                <div className="absolute -top-1 -right-1">
                                    <div className="flex h-6 w-6 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                        <div className="relative inline-flex rounded-full h-6 w-6 bg-orange-500 border-2 border-white flex items-center justify-center">
                                            <Zap className="w-3 h-3 text-white fill-white" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="w-full space-y-4">
                                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                                    <span className="text-slate-500">{isBreezeMode ? 'Breeze Agent Active' : 'Synchronizing...'}</span>
                                    <span className={selectedProvider === 'HubSpot' ? 'text-[#ff7a59]' : 'text-blue-600'}>{syncProgress}%</span>
                                </div>
                                
                                <div className={`bg-slate-950 rounded-xl p-4 font-mono text-[9px] h-32 overflow-hidden border shadow-inner ${isBreezeMode ? 'text-orange-400 border-orange-500/20' : 'text-emerald-400 border-slate-800'}`}>
                                    <div className="space-y-1">
                                      {terminalLogs.map((log, i) => (
                                        <div key={i} className="animate-in fade-in slide-in-from-bottom-1 duration-200 truncate flex gap-2">
                                          <span className="opacity-40">{isBreezeMode ? 'BZ>>' : '>>>'}</span> {log}
                                        </div>
                                      ))}
                                      <div ref={logEndRef} />
                                    </div>
                                </div>

                                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden border border-gray-200">
                                    <div className={`h-full transition-all duration-300 ease-out ${selectedProvider === 'HubSpot' ? 'bg-[#ff7a59]' : 'bg-blue-600'}`} style={{ width: `${syncProgress}%` }}>
                                        <div className="absolute inset-0 bg-white/30 animate-[shimmer_1s_infinite]"></div>
                                    </div>
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
             <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#ff7a59]/5 to-[#ff7a59]/15 rounded-full -mr-16 -mt-16 pointer-events-none transition-transform group-hover:scale-110 duration-700 blur-3xl"></div>
                <div className="flex items-center gap-6 z-10 relative">
                   <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center border border-orange-100 shadow-sm shrink-0">
                      <Sparkles className="w-10 h-10 text-[#ff7a59]" />
                   </div>
                   <div className="max-w-xl">
                     <h3 className="text-xl font-black text-gray-900 mb-2 uppercase tracking-tight">Enterprise Ingress Architecture</h3>
                     <p className="text-gray-600 leading-relaxed text-sm font-medium">
                        Integrate HubSpot <strong>Breeze Agent</strong> to effortlessly synchronize marketing velocity with your workforce deployment matrix. 
                     </p>
                   </div>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-3 px-8 py-4 bg-[#ff7a59] hover:bg-[#ff8f75] text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-orange-500/20 z-10 whitespace-nowrap">
                   <Zap className="w-5 h-5 fill-white" /> Launch Breeze Agent
                </button>
             </div>
        ) : (
            <div className={`bg-white rounded-2xl shadow-sm border p-6 flex flex-col lg:flex-row items-center justify-between bg-gradient-to-r gap-6 ${activeProvider === 'HubSpot' ? 'border-orange-100 from-white via-orange-50/20 to-orange-50/40' : 'border-blue-100 from-white via-blue-50/20 to-blue-50/40'}`}>
               <div className="flex items-center gap-5 w-full lg:w-auto">
                  <div className="relative shrink-0">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-lg ring-4 ring-white ${activeProvider === 'HubSpot' ? 'bg-[#ff7a59]' : 'bg-[#002050]'}`}>
                         {activeProvider === 'HubSpot' ? <Sparkles className="w-8 h-8" /> : renderProviderIcon(activeProvider, "w-8 h-8")}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 border-[3px] border-white w-6 h-6 rounded-full flex items-center justify-center shadow-sm ${getStatusColor(syncStatus)}`}>
                          {syncStatus === 'SYNCED' && <Check className="w-3.5 h-3.5 text-white" />}
                          {syncStatus === 'SYNCING' && <RefreshCw className="w-3.5 h-3.5 text-white animate-spin" />}
                      </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-gray-900 flex items-center gap-3 uppercase tracking-tight">{activeProvider === 'HubSpot' ? 'Breeze Node Online' : `${activeProvider} Node Online`}</h3>
                    <p className="text-xs text-slate-700 font-mono font-black uppercase tracking-widest">Protocol: <span className={activeProvider === 'HubSpot' ? 'text-[#ff7a59]' : 'text-blue-700'}>{activeProvider === 'HubSpot' ? 'BREEZE_SMART_SYNC' : 'SECURE_ERP_INGRESS'}</span></p>
                  </div>
               </div>
               
               <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
                   <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2.5 text-slate-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg text-xs font-black uppercase tracking-widest transition-all">
                       <Settings className="w-4 h-4" /> Node Mapping
                   </button>
                   <button onClick={handleSync} disabled={isSyncing} className={`flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-slate-800 hover:bg-gray-50 rounded-lg text-xs font-black uppercase tracking-widest transition-all shadow-sm ${isSyncing ? 'opacity-70 cursor-wait' : ''}`}>
                      <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} /> {isSyncing ? 'Syncing...' : `Force Refresh`}
                   </button>
               </div>
            </div>
        )}

        {/* Heatmap Section */}
        <div className="space-y-6">
           <div className="flex items-center gap-4 border-b border-gray-200 pb-1">
              <button onClick={() => setActiveTab('heatmap')} className={`flex items-center gap-2 px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-colors relative ${activeTab === 'heatmap' ? 'text-[#ff7a59]' : 'text-gray-500 hover:text-gray-700'}`}>
                <Activity className="w-4 h-4" /> Resource Allocation Matrix
                {activeTab === 'heatmap' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ff7a59]" />}
              </button>
              <button onClick={() => setActiveTab('logs')} className={`flex items-center gap-2 px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-colors relative ${activeTab === 'logs' ? 'text-[#ff7a59]' : 'text-gray-500 hover:text-gray-700'}`}>
                <List className="w-4 h-4" /> Transaction Registry
                {activeTab === 'logs' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ff7a59]" />}
              </button>
           </div>

           {activeTab === 'heatmap' ? (
              <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Database className="w-32 h-32 text-white" /></div>
                <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-950/50">
                   <h2 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-3">
                     <Layers className="w-5 h-5 text-[#ff7a59]" />
                     Labor Capacity Heatmap
                   </h2>
                   <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-600 rounded"></div><span className="text-[9px] text-slate-400 font-black uppercase">Traffic</span></div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-900 rounded"></div><span className="text-[9px] text-slate-400 font-black uppercase">Allocation</span></div>
                   </div>
                </div>
                <div className="p-6 overflow-x-auto">
                  <div className="min-w-[800px] grid grid-cols-[150px_repeat(10,1fr)]">
                      <div className="flex flex-col justify-center space-y-16 text-slate-400 font-black text-[10px] uppercase tracking-widest pr-4 border-r border-slate-700">
                        <div className="h-24 flex items-center justify-end">Pipeline Volume</div>
                        <div className="h-24 flex items-center justify-end">Floor Deployment</div>
                      </div>
                      {HEATMAP_DATA.map((point, index) => (
                          <div key={index} className="flex flex-col relative group">
                            <div className="h-8 border-b border-slate-700 flex items-center justify-center text-slate-500 text-[9px] font-black uppercase">{point.hour}</div>
                            <div className={`h-24 bg-blue-600/80 border-r border-slate-800/20 flex items-center justify-center text-white font-black text-lg group-hover:bg-[#ff7a59]/80 transition-colors`}>{activeProvider === 'HubSpot' ? Math.round(point.transactionVolume * 1.2) : point.transactionVolume}</div>
                            <div className={`h-24 bg-blue-950 border-r border-slate-800/20 flex items-center justify-center text-blue-200 font-black text-lg relative`}>{point.staffing}</div>
                          </div>
                        ))}
                    </div>
                </div>
              </div>
           ) : (
             <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="divide-y divide-gray-100">
                    {syncLogs.map((log, i) => (
                        <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50">
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-lg ${log.status === 'Success' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                                    {log.status === 'Success' ? <Check className="w-4 h-4" /> : <Loader2 className="w-4 h-4 animate-spin" />}
                                </div>
                                <div><p className="text-sm font-bold text-gray-900">{log.event}</p><p className="text-xs text-gray-500">Target: {log.target}</p></div>
                            </div>
                            <div className="text-right"><p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">{log.status}</p><p className="text-xs text-gray-400 font-mono mt-0.5">{log.time}</p></div>
                        </div>
                    ))}
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Scheduling;
