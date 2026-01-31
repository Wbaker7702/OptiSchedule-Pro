
import React, { useState } from 'react';
import Header from '../components/Header';
import { HEATMAP_DATA } from '../constants';
import { Calendar, Download, Printer, Filter, RefreshCw, Link as LinkIcon, Check, X, ShieldCheck, Settings, Database, Users as UsersIcon, List, ArrowLeftRight, Activity, Globe, Loader2, Server, Layers, Hexagon, AlertTriangle, Scale, ArrowRight, Zap, FileText } from 'lucide-react';
import { View } from '../types';

interface SchedulingProps {
  setCurrentView?: (view: View) => void;
  onFinalize?: () => void;
}

type ERPProvider = 'Dynamics 365' | 'SAP S/4HANA' | 'FDE';
type SyncStatus = 'SYNCED' | 'SYNCING' | 'CONFLICT' | 'OFFLINE';

const Scheduling: React.FC<SchedulingProps> = ({ setCurrentView, onFinalize }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [activeProvider, setActiveProvider] = useState<ERPProvider>('Dynamics 365'); 
  const [selectedProvider, setSelectedProvider] = useState<ERPProvider>('Dynamics 365'); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [activeTab, setActiveTab] = useState<'heatmap' | 'logs'>('heatmap');
  
  // Conflict State
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('OFFLINE');
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [conflictData, setConflictData] = useState({
      metric: 'Projected Staffing (Fri 6PM)',
      erpValue: 8,
      crmValue: 12,
      variance: '+50%'
  });
  
  // Form State
  const [environmentUrl, setEnvironmentUrl] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [apiKey, setApiKey] = useState('');
  
  const [syncConfig, setSyncConfig] = useState({
    employees: true,
    shifts: true,
    timeOff: true,
    performance: false
  });

  const syncLogs = [
    { event: 'Fetch Personnel Assets', target: activeProvider === 'SAP S/4HANA' ? 'SAP HCM' : activeProvider === 'FDE' ? 'FDE Gateway' : 'Finance & Ops', status: 'Success', time: '06:00 AM' },
    { event: 'Pipeline Sync', target: activeProvider === 'SAP S/4HANA' ? 'SAP Sales Cloud' : activeProvider === 'FDE' ? 'FDE Ledger' : 'Dynamics 365 Sales', status: 'Success', time: '06:05 AM' },
    { event: 'HubSpot Marketing Data', target: 'CRM Ingress Node', status: 'Success', time: '06:08 AM' },
    { event: 'ERP Resource Audit', target: 'Sentinel Node', status: 'Pending', time: 'Now' },
    { event: 'Inventory Allocation', target: 'Supply Chain Hub', status: 'Failed', time: 'Yesterday' }
  ];

  const handleSync = () => {
    setIsSyncing(true);
    setSyncStatus('SYNCING');
    
    // Simulate Sync Process & Conflict Detection
    setTimeout(() => {
        setIsSyncing(false);
        // Randomly trigger conflict for demonstration
        const hasConflict = Math.random() > 0.4;
        
        if (hasConflict) {
            setSyncStatus('CONFLICT');
            setShowConflictModal(true);
        } else {
            setSyncStatus('SYNCED');
        }
    }, 2000);
  };

  const resolveConflict = (strategy: 'ERP' | 'CRM' | 'HYBRID') => {
      setShowConflictModal(false);
      setSyncStatus('SYNCING');
      setTimeout(() => {
          setSyncStatus('SYNCED');
      }, 1000);
  };

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSyncing(true);
    setIsModalOpen(false);
    setActiveProvider(selectedProvider);
    setTimeout(() => {
        isConnected ? null : setIsConnected(true);
        setIsSyncing(false);
        setSyncStatus('SYNCED');
    }, 1500);
  };

  const toggleConfig = (key: keyof typeof syncConfig) => {
    setSyncConfig(prev => ({...prev, [key]: !prev[key]}));
  };

  const renderProviderIcon = (provider: ERPProvider, className = "w-6 h-6") => {
      if (provider === 'SAP S/4HANA') return <Server className={className} />;
      if (provider === 'FDE') return <Layers className={className} />;
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
      <Header title="Scheduling Center" subtitle="Optimize workforce allocation based on customer flow patterns" />
      
      {/* Conflict Resolution Modal */}
      {showConflictModal && (
          <div className="fixed inset-0 bg-slate-900/80 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
             <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-red-500/30">
                 <div className="bg-red-600 p-6 flex items-center justify-between text-white">
                     <div className="flex items-center gap-3">
                         <div className="p-2 bg-white/20 rounded-lg">
                             <AlertTriangle className="w-6 h-6" />
                         </div>
                         <div>
                             <h3 className="font-black text-lg uppercase tracking-wider">Data Conflict Detected</h3>
                             <p className="text-red-100 text-xs font-mono uppercase">Sync Halted • Resolution Required</p>
                         </div>
                     </div>
                     <button onClick={() => setShowConflictModal(false)} className="hover:bg-white/20 p-2 rounded-full transition-colors">
                         <X className="w-5 h-5" />
                     </button>
                 </div>
                 
                 <div className="p-8">
                     <p className="text-sm text-gray-600 mb-6 font-medium">
                         Sentinel has detected a critical variance between your <span className="text-red-600 font-bold">Financial Budget (ERP)</span> and <span className="text-red-600 font-bold">Traffic Forecast (CRM)</span>. Please select a resolution strategy.
                     </p>
                     
                     <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 mb-8 flex items-center justify-between gap-8">
                         <div className="text-center flex-1">
                             <div className="flex items-center justify-center gap-2 mb-2 text-gray-500 font-black text-[10px] uppercase tracking-widest">
                                 <Database className="w-4 h-4" /> {activeProvider}
                             </div>
                             <p className="text-3xl font-black text-slate-800">{conflictData.erpValue}</p>
                             <p className="text-xs text-gray-500 font-bold mt-1">Staff Required</p>
                         </div>
                         
                         <div className="flex flex-col items-center justify-center text-red-500">
                             <ArrowLeftRight className="w-6 h-6" />
                             <span className="text-[10px] font-black uppercase tracking-widest bg-red-100 px-2 py-1 rounded-full mt-2">Variance {conflictData.variance}</span>
                         </div>

                         <div className="text-center flex-1">
                             <div className="flex items-center justify-center gap-2 mb-2 text-gray-500 font-black text-[10px] uppercase tracking-widest">
                                 <Activity className="w-4 h-4" /> HubSpot CRM
                             </div>
                             <p className="text-3xl font-black text-slate-800">{conflictData.crmValue}</p>
                             <p className="text-xs text-gray-500 font-bold mt-1">Staff Required</p>
                         </div>
                     </div>

                     <div className="grid grid-cols-3 gap-4">
                         <button 
                             onClick={() => resolveConflict('ERP')}
                             className="p-4 rounded-xl border-2 border-slate-100 hover:border-slate-800 hover:bg-slate-50 transition-all text-left group"
                         >
                             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-slate-600">Strategy A</span>
                             <p className="font-bold text-slate-800 mt-1">Force ERP Limit</p>
                             <p className="text-[10px] text-gray-500 mt-2 leading-tight">Adhere to budget. Risk customer wait times.</p>
                         </button>

                         <button 
                             onClick={() => resolveConflict('CRM')}
                             className="p-4 rounded-xl border-2 border-slate-100 hover:border-slate-800 hover:bg-slate-50 transition-all text-left group"
                         >
                             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-slate-600">Strategy B</span>
                             <p className="font-bold text-slate-800 mt-1">Force CRM Target</p>
                             <p className="text-[10px] text-gray-500 mt-2 leading-tight">Maximize service. Accept budget variance.</p>
                         </button>

                         <button 
                             onClick={() => resolveConflict('HYBRID')}
                             className="p-4 rounded-xl border-2 border-blue-100 bg-blue-50/50 hover:border-blue-500 hover:bg-blue-50 transition-all text-left group relative overflow-hidden"
                         >
                             <div className="absolute top-0 right-0 p-2 opacity-10">
                                 <ShieldCheck className="w-12 h-12 text-blue-600" />
                             </div>
                             <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest group-hover:text-blue-600">Strategy C</span>
                             <p className="font-bold text-blue-900 mt-1">Sentinel Hybrid</p>
                             <p className="text-[10px] text-blue-700/70 mt-2 leading-tight">AI-optimized balance based on ROI.</p>
                         </button>
                     </div>
                 </div>
             </div>
          </div>
      )}

      {/* Connection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden transform transition-all scale-100 border border-gray-100 text-slate-900">
                <div className="bg-[#002050] p-6 flex items-center justify-between">
                    <h3 className="text-white font-bold text-xl flex items-center gap-2">
                        {renderProviderIcon(selectedProvider, "w-6 h-6 text-blue-400")}
                        {isConnected ? `${activeProvider} Settings` : 'Connect Enterprise ERP'}
                    </h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-full p-1">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="p-8">
                    {!isConnected && (
                        <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                            {(['Dynamics 365', 'SAP S/4HANA', 'FDE'] as ERPProvider[]).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setSelectedProvider(p)}
                                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                                        selectedProvider === p 
                                        ? 'bg-white text-blue-900 shadow-sm' 
                                        : 'text-gray-400 hover:text-gray-600'
                                    }`}
                                >
                                    {p.replace('Dynamics ', 'D').replace('S/4HANA', 'HANA')}
                                </button>
                            ))}
                        </div>
                    )}

                    <p className="text-slate-700 text-sm mb-6 text-center leading-relaxed font-semibold">
                        {isConnected 
                          ? `Modify your ${activeProvider} environment settings below. Changes are enforced via the Sentinel Protocol.`
                          : `Connect your ${selectedProvider} environment to synchronize enterprise resource planning and workforce deployment.`}
                    </p>

                    <form onSubmit={handleConnect} className="space-y-5">
                        {selectedProvider === 'Dynamics 365' && (
                            <>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-800 uppercase tracking-widest mb-2">Environment URL</label>
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            value={environmentUrl}
                                            onChange={(e) => setEnvironmentUrl(e.target.value)}
                                            placeholder="https://org.crm.dynamics.com"
                                            className="w-full pl-4 pr-10 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all placeholder-slate-400 bg-white font-mono text-sm text-slate-900 font-bold"
                                            required={!isConnected}
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                            <Globe className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-800 uppercase tracking-widest mb-2">Tenant ID (Azure AD)</label>
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            value={tenantId}
                                            onChange={(e) => setTenantId(e.target.value)}
                                            placeholder="00000000-0000-0000-0000-000000000000"
                                            className="w-full pl-4 pr-10 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all placeholder-slate-400 bg-white font-mono text-sm text-slate-900 font-bold"
                                            required={!isConnected}
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                            <ShieldCheck className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {selectedProvider === 'SAP S/4HANA' && (
                            <>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-800 uppercase tracking-widest mb-2">S/4HANA API Endpoint</label>
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            value={environmentUrl}
                                            onChange={(e) => setEnvironmentUrl(e.target.value)}
                                            placeholder="https://api.s4hana.ondemand.com"
                                            className="w-full pl-4 pr-10 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all placeholder-slate-400 bg-white font-mono text-sm text-slate-900 font-bold"
                                            required={!isConnected}
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                            <Globe className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-800 uppercase tracking-widest mb-2">Client ID</label>
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            value={apiKey}
                                            onChange={(e) => setApiKey(e.target.value)}
                                            placeholder="sb-clone-..."
                                            className="w-full pl-4 pr-10 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all placeholder-slate-400 bg-white font-mono text-sm text-slate-900 font-bold"
                                            required={!isConnected}
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                            <Hexagon className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {selectedProvider === 'FDE' && (
                             <>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-800 uppercase tracking-widest mb-2">FDE Gateway Host</label>
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            value={environmentUrl}
                                            onChange={(e) => setEnvironmentUrl(e.target.value)}
                                            placeholder="gateway.fde-enterprise.net"
                                            className="w-full pl-4 pr-10 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all placeholder-slate-400 bg-white font-mono text-sm text-slate-900 font-bold"
                                            required={!isConnected}
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                            <Globe className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-800 uppercase tracking-widest mb-2">Access Key</label>
                                    <div className="relative">
                                        <input 
                                            type="password" 
                                            value={apiKey}
                                            onChange={(e) => setApiKey(e.target.value)}
                                            placeholder="••••••••••••••••"
                                            className="w-full pl-4 pr-10 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all placeholder-slate-400 bg-white font-mono text-sm text-slate-900 font-bold"
                                            required={!isConnected}
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                            <ShieldCheck className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="space-y-3 pt-2">
                            <label className="block text-[10px] font-black text-slate-800 uppercase tracking-widest">Enterprise Sync Scopes</label>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { key: 'employees', label: 'HR Profiles', icon: UsersIcon },
                                    { key: 'shifts', label: 'Shift Logic', icon: Calendar },
                                    { key: 'timeOff', label: 'Payroll Data', icon: Calendar },
                                    { key: 'performance', label: 'ERP KPIs', icon: Settings }
                                ].map((item) => (
                                    <div 
                                        key={item.key}
                                        onClick={() => toggleConfig(item.key as keyof typeof syncConfig)}
                                        className={`cursor-pointer p-3 rounded-xl border-2 flex items-center gap-3 transition-all ${
                                            syncConfig[item.key as keyof typeof syncConfig] 
                                            ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-sm' 
                                            : 'border-slate-100 hover:border-slate-200 text-slate-500'
                                        }`}
                                    >
                                        <div className={`w-5 h-5 rounded flex items-center justify-center border-2 ${
                                            syncConfig[item.key as keyof typeof syncConfig]
                                            ? 'bg-blue-600 border-blue-600'
                                            : 'bg-white border-slate-200'
                                        }`}>
                                            {syncConfig[item.key as keyof typeof syncConfig] && <Check className="w-3.5 h-3.5 text-white" />}
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-wider">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4">
                            <button 
                                type="submit"
                                className="w-full py-4 bg-[#002050] hover:bg-[#003070] text-white font-black text-xs uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-blue-900/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                {isConnected ? 'Update ERP Logic' : `Authorize ${selectedProvider} Node`}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
      )}

      <div className="p-8 max-w-7xl mx-auto space-y-8">
        
        {/* ERP Integration Status */}
        {!isConnected ? (
             <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-600/5 to-blue-600/20 rounded-full -mr-16 -mt-16 pointer-events-none transition-transform group-hover:scale-110 duration-700 blur-3xl"></div>
                <div className="flex items-center gap-6 z-10 relative">
                   <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-600/20 shadow-sm shrink-0">
                      <Database className="w-10 h-10 text-blue-600" />
                   </div>
                   <div className="max-w-xl">
                     <h3 className="text-xl font-bold text-gray-900 mb-2 uppercase tracking-tight">Enterprise Resource Planning (ERP)</h3>
                     <p className="text-gray-600 leading-relaxed text-sm font-medium">
                        To enforce the Sentinel "Zone Defense" protocol, integrate a certified ERP environment. Supported protocols include <span className="text-blue-700 font-bold">Dynamics 365</span>, <span className="text-blue-700 font-bold">SAP S/4HANA</span>, and <span className="text-blue-700 font-bold">FDE</span>.
                     </p>
                   </div>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-3 px-8 py-4 bg-[#002050] hover:bg-[#003070] text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl z-10 whitespace-nowrap"
                >
                   <LinkIcon className="w-5 h-5" />
                   Initialize ERP Node
                </button>
             </div>
        ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6 flex flex-col lg:flex-row items-center justify-between bg-gradient-to-r from-white via-blue-50/20 to-blue-50/40 gap-6">
               <div className="flex items-center gap-5 w-full lg:w-auto">
                  <div className="relative shrink-0">
                      <div className="w-14 h-14 bg-[#002050] rounded-xl flex items-center justify-center text-white shadow-lg ring-4 ring-white">
                         {renderProviderIcon(activeProvider, "w-8 h-8")}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 border-[3px] border-white w-6 h-6 rounded-full flex items-center justify-center shadow-sm ${getStatusColor(syncStatus)}`}>
                          {syncStatus === 'SYNCED' && <Check className="w-3.5 h-3.5 text-white" />}
                          {syncStatus === 'SYNCING' && <RefreshCw className="w-3.5 h-3.5 text-white animate-spin" />}
                          {syncStatus === 'CONFLICT' && <AlertTriangle className="w-3.5 h-3.5 text-white" />}
                      </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-gray-900 flex items-center gap-3 uppercase tracking-tight">
                        {activeProvider} Node Online
                    </h3>
                    <div className="flex items-center gap-2">
                        <p className="text-xs text-slate-700 font-mono font-black uppercase tracking-widest">Environment: <span className="text-blue-700">PRODUCTION-SECURE</span></p>
                        <span className="text-gray-300">|</span>
                        <p className={`text-xs font-mono font-black uppercase tracking-widest ${syncStatus === 'CONFLICT' ? 'text-red-600' : 'text-emerald-600'}`}>Status: {syncStatus}</p>
                    </div>
                  </div>
               </div>
               
               <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
                   <button 
                       onClick={() => setIsModalOpen(true)}
                       className="flex items-center gap-2 px-4 py-2.5 text-slate-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg text-xs font-black uppercase tracking-widest transition-all"
                   >
                       <Settings className="w-4 h-4" />
                       Mapping
                   </button>
                   <button 
                       onClick={handleSync}
                       disabled={isSyncing}
                       className={`flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-slate-800 hover:bg-gray-50 rounded-lg text-xs font-black uppercase tracking-widest transition-all shadow-sm ${isSyncing ? 'opacity-70 cursor-wait' : ''}`}
                   >
                      <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-blue-600' : ''}`} />
                      {isSyncing ? 'Syncing...' : `Force ${activeProvider} Refresh`}
                   </button>
               </div>
            </div>
        )}

        {/* Dynamic Content Area */}
        <div className="space-y-6">
           <div className="flex items-center gap-4 border-b border-gray-200 pb-1">
              <button 
                onClick={() => setActiveTab('heatmap')}
                className={`flex items-center gap-2 px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-colors relative ${activeTab === 'heatmap' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Activity className="w-4 h-4" />
                {activeProvider === 'FDE' ? 'FDE Volume Heatmap' : activeProvider === 'SAP S/4HANA' ? 'S/4HANA Resource Map' : 'Dynamics Pulse Heatmap'}
                {activeTab === 'heatmap' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
              </button>
              <button 
                onClick={() => setActiveTab('logs')}
                className={`flex items-center gap-2 px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-colors relative ${activeTab === 'logs' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <List className="w-4 h-4" />
                ERP Transaction Log
                {activeTab === 'logs' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
              </button>
           </div>

           {activeTab === 'heatmap' ? (
              <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                   <div>
                      <h2 className="text-lg font-black text-white uppercase tracking-wider">Resource Allocation Variance</h2>
                      <p className="text-blue-400 text-xs font-mono font-bold mt-1 uppercase tracking-widest">
                          "{activeProvider === 'SAP S/4HANA' ? 'S/4HANA Consumption Analysis' : 'ERP Pipeline Ingress Analysis'}"
                      </p>
                   </div>
                   
                   <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-600 rounded"></div>
                            <span className="text-[9px] text-slate-400 font-black uppercase">Volume</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-900 rounded"></div>
                            <span className="text-[9px] text-slate-400 font-black uppercase">Staffing</span>
                        </div>
                   </div>
                </div>
                
                <div className="p-6 overflow-x-auto">
                  <div className="min-w-[800px]">
                    <div className="grid grid-cols-[150px_repeat(10,1fr)]">
                      <div className="flex flex-col justify-center space-y-16 text-slate-400 font-black text-[10px] uppercase tracking-widest pr-4 border-r border-slate-700">
                        <div className="h-24 flex items-center justify-end">Pipeline Volume</div>
                        <div className="h-24 flex items-center justify-end">Floor Deployment</div>
                      </div>

                      {HEATMAP_DATA.map((point, index) => {
                         let topColorClass = "bg-blue-600";
                         if(point.efficiency > 80) topColorClass = "bg-emerald-500";
                         else if(point.efficiency < 40) topColorClass = "bg-amber-500";
                         
                         return (
                          <div key={index} className="flex flex-col relative group">
                            <div className="h-8 border-b border-slate-700 flex items-center justify-center text-slate-500 text-[9px] font-black uppercase">{point.hour}</div>
                            
                            <div className={`h-24 ${topColorClass} border-r border-slate-800/20 flex items-center justify-center text-white font-black text-lg group-hover:opacity-90 transition-opacity`}>
                               {point.transactionVolume}
                            </div>
                            <div className={`h-24 bg-blue-950 border-r border-slate-800/20 flex items-center justify-center text-blue-200 font-black text-lg relative`}>
                               {point.staffing}
                               <div className="absolute inset-0 bg-blue-400/5 group-hover:bg-blue-400/10 transition-colors"></div>
                            </div>
                            
                            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white text-slate-900 text-[10px] font-bold px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                Eff: {point.efficiency}%
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                
                <div className="p-6 border-t border-slate-800 bg-slate-950 flex justify-between items-center">
                    <p className="text-[10px] text-slate-500 font-mono">
                        DATA SOURCE: <span className="text-emerald-500">VERIFIED</span> • LAST SYNC: <span className="text-white">JUST NOW</span>
                    </p>
                    
                    <button 
                        onClick={() => onFinalize?.()}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20"
                    >
                        Publish Schedule <ArrowRight className="w-3 h-3" />
                    </button>
                </div>
              </div>
           ) : (
             <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
                    <List className="w-5 h-5 text-gray-400" />
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Ingress/Egress Logs</h3>
                </div>
                <div className="divide-y divide-gray-100">
                    {syncLogs.map((log, i) => (
                        <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-lg ${
                                    log.status === 'Success' ? 'bg-emerald-100 text-emerald-600' : 
                                    log.status === 'Pending' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'
                                }`}>
                                    {log.status === 'Success' ? <Check className="w-4 h-4" /> : 
                                     log.status === 'Pending' ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertTriangle className="w-4 h-4" />}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">{log.event}</p>
                                    <p className="text-xs text-gray-500">Target: {log.target}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`text-[10px] font-black uppercase tracking-widest ${
                                    log.status === 'Success' ? 'text-emerald-600' : 
                                    log.status === 'Pending' ? 'text-blue-600' : 'text-red-600'
                                }`}>{log.status}</p>
                                <p className="text-xs text-gray-400 font-mono mt-0.5">{log.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
                    <button className="text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-widest flex items-center justify-center gap-2">
                        <FileText className="w-3 h-3" /> Download Full Audit Log
                    </button>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Scheduling;
