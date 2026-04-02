
import React, { useState } from 'react';
import Header from '../components/Header';
import { 
  Database, 
  Save, 
  Check, 
  Loader2, 
  Terminal, 
  Scale, 
  Activity, 
  Zap, 
  ShieldCheck, 
  Cpu
} from 'lucide-react';
import { APP_VERSION } from '../constants';
import { IntegrationStatus } from '../types';

type SettingTab = 'breeze' | 'erp' | 'conflict';

const Settings: React.FC = () => {
  const [hubspotStatus, setHubspotStatus] = useState<IntegrationStatus>('connected');
  const [activeTab, setActiveTab] = useState<SettingTab>('breeze');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [hubspotLoading, setHubspotLoading] = useState(false);
  
  // States for ERP
  const [syncFrequency, setSyncFrequency] = useState('5m');
  const [isHardened, setIsHardened] = useState(true);

  // States for Conflict Logic
  const [conflictStrategy, setConflictStrategy] = useState<'ERP' | 'CRM' | 'Hybrid'>('Hybrid');
  const [aiWeight, setAiWeight] = useState(75);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1200);
  };

  const toggleHubspot = () => {
    setHubspotLoading(true);
    setTimeout(() => {
      setHubspotStatus(hubspotStatus === 'connected' ? 'disconnected' : 'connected');
      setHubspotLoading(false);
    }, 1500);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'breeze':
        return (
          <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm animate-in fade-in slide-in-from-right-2 duration-300">
            <div className={`p-6 border-b flex items-center justify-between transition-colors duration-500 ${hubspotStatus === 'connected' ? 'bg-orange-50 border-orange-100' : 'bg-gray-50 border-gray-100'}`}>
               <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${hubspotStatus === 'connected' ? 'bg-[#ff7a59]' : 'bg-slate-200'}`}>
                      <Zap className={`w-4 h-4 ${hubspotStatus === 'connected' ? 'text-white fill-white' : 'text-slate-500'}`} />
                  </div>
                  <h3 className="font-black text-gray-900 text-xs uppercase tracking-[0.1em]">HubSpot Breeze Agent</h3>
               </div>
               <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${hubspotStatus === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`}></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">
                    {hubspotStatus === 'connected' ? 'Smart Ingress Active' : 'Idle'}
                  </span>
               </div>
            </div>
            <div className="p-8">
               <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="max-w-md">
                     <div className="flex items-center gap-2 mb-2">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 bg-orange-100 text-[#ff7a59] rounded">Breeze Core v2.4</span>
                     </div>
                     <p className="text-sm font-bold text-gray-900 mb-1">HubSpot Marketing Velocity Engine</p>
                     <p className="text-xs text-gray-500 leading-relaxed font-medium">
                        Automated CRM discovery. Synchronizes real-time loyalty signals and campaign performance directly into the labor forecasting model.
                     </p>
                  </div>
                  <button 
                    onClick={toggleHubspot}
                    disabled={hubspotLoading}
                    className={`min-w-[200px] px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 active:scale-95 ${
                       hubspotStatus === 'connected' 
                       ? 'bg-white text-red-500 border border-red-200 hover:bg-red-50' 
                       : 'bg-[#ff7a59] text-white shadow-xl shadow-orange-500/20 hover:bg-[#ff8f75]'
                    }`}
                  >
                     {hubspotLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                     ) : hubspotStatus === 'connected' ? (
                        <>Terminate Breeze</>
                     ) : (
                        <><Zap className="w-4 h-4 fill-white" /> Activate Breeze</>
                     )}
                  </button>
               </div>
               
               {hubspotStatus === 'connected' && (
                  <div className="mt-8 p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-4 animate-in fade-in slide-in-from-top-2">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <Terminal className="w-3 h-3 text-orange-400" />
                           <span className="text-[9px] font-black text-orange-400 uppercase tracking-widest">Breeze Node Diagnostics</span>
                        </div>
                        <span className="text-[9px] font-mono text-slate-500">PID: 88402 / HS_SYNC_ACTIVE</span>
                     </div>
                     <div className="grid grid-cols-3 gap-4">
                        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                           <p className="text-[8px] text-slate-500 uppercase font-black mb-1">Sync Latency</p>
                           <p className="text-xs font-bold text-white font-mono">12ms</p>
                        </div>
                        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                           <p className="text-[8px] text-slate-500 uppercase font-black mb-1">Signal Pairs</p>
                           <p className="text-xs font-bold text-white font-mono">1,240</p>
                        </div>
                        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                           <p className="text-[8px] text-slate-500 uppercase font-black mb-1">Security</p>
                           <p className="text-xs font-bold text-emerald-400 font-mono">VERIFIED</p>
                        </div>
                     </div>
                  </div>
               )}
            </div>
          </section>
        );
      case 'erp':
        return (
          <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm animate-in fade-in slide-in-from-right-2 duration-300">
            <div className="p-6 border-b border-gray-100 bg-[#002050]/5 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#002050] rounded-lg shadow-lg">
                      <Database className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-black text-gray-900 text-xs uppercase tracking-[0.1em]">Dynamics 365 ERP Ingress</h3>
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-1 rounded">Financial Core</span>
            </div>
            <div className="p-8 space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                     <div>
                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 font-mono">Sync Frequency</label>
                        <select 
                          value={syncFrequency}
                          onChange={(e) => setSyncFrequency(e.target.value)}
                          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-xs"
                        >
                           <option value="1m">Real-time (1 min)</option>
                           <option value="5m">High (5 min)</option>
                           <option value="15m">Balanced (15 min)</option>
                           <option value="hourly">Daily (60 min)</option>
                        </select>
                     </div>
                     <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div>
                           <p className="text-[10px] font-black text-gray-900 uppercase">Data Hardening</p>
                           <p className="text-[9px] text-gray-500 font-medium">Verify checksums for every fiscal block</p>
                        </div>
                        <button 
                          onClick={() => setIsHardened(!isHardened)}
                          className={`w-10 h-6 rounded-full transition-all relative ${isHardened ? 'bg-blue-600' : 'bg-gray-300'}`}
                        >
                           <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isHardened ? 'left-5' : 'left-1'}`} />
                        </button>
                     </div>
                     
                     {/* Sentinel Secure Node Integration */}
                     <div className="p-4 bg-[#002050]/5 rounded-xl border border-[#002050]/10 mt-4">
                        <div className="flex items-center justify-between mb-2">
                           <div className="flex items-center gap-2">
                              <ShieldCheck className="w-4 h-4 text-blue-600" />
                              <span className="text-[10px] font-black text-blue-900 uppercase tracking-widest">Microsoft Sentinel Secure Node</span>
                           </div>
                           <span className="text-[9px] font-black text-white bg-blue-600 px-2 py-0.5 rounded uppercase tracking-wider">Active</span>
                        </div>
                        <p className="text-[10px] text-blue-800 leading-relaxed font-medium">
                           Q1 2026 Hardening Phase active. All ingress traffic from Dynamics 365 is currently routed through an encrypted Azure service tunnel for zero-trust verification.
                        </p>
                     </div>
                  </div>
                  <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 text-slate-300 font-mono text-[10px]">
                     <div className="flex items-center gap-2 mb-4 text-blue-400">
                        <Activity className="w-3 h-3" />
                        <span className="uppercase font-black tracking-widest">Ingress Tunnel</span>
                     </div>
                     <p className="opacity-50">TUNNEL_ID: AZ-D365-W5065</p>
                     <p className="mt-2 text-emerald-400 font-bold">STATUS: CHANNEL_ESTABLISHED</p>
                     <p className="mt-4 text-slate-500">
                        RECEIVE: ledger_summary.json (42kb)<br/>
                        VERIFY: SHA-256 Validated<br/>
                        UPDATING: budget_threshold_v4
                     </p>
                  </div>
               </div>
            </div>
          </section>
        );
      case 'conflict':
        return (
          <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm animate-in fade-in slide-in-from-right-2 duration-300">
            <div className="p-6 border-b border-gray-100 bg-indigo-50/30 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-600 rounded-lg shadow-lg">
                      <Scale className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-black text-gray-900 text-xs uppercase tracking-[0.1em]">Conflict Arbitration Logic</h3>
               </div>
               <div className="flex items-center gap-2 bg-white px-2 py-1 rounded border border-indigo-100">
                  <Cpu className="w-3 h-3 text-indigo-500" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-indigo-600">AI Weighted</span>
               </div>
            </div>
            <div className="p-8 space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: 'ERP', label: 'ERP Strict', desc: 'Financial compliance above all else.' },
                    { id: 'CRM', label: 'Breeze Priority', desc: 'Staff for traffic signals first.' },
                    { id: 'Hybrid', label: 'Microsoft Sentinel Hybrid', desc: 'AI-balanced weighted resolution.' }
                  ].map((strategy) => (
                    <div 
                      key={strategy.id}
                      onClick={() => setConflictStrategy(strategy.id as 'ERP' | 'CRM' | 'Hybrid')}
                      className={`cursor-pointer p-5 rounded-2xl border-2 transition-all group ${
                         conflictStrategy === strategy.id ? 'border-indigo-500 bg-indigo-50/50' : 'border-gray-100 hover:border-indigo-100 bg-gray-50/50'
                      }`}
                    >
                       <h4 className={`text-xs font-black uppercase tracking-widest mb-2 transition-colors ${conflictStrategy === strategy.id ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'}`}>{strategy.label}</h4>
                       <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
                         {strategy.desc}
                       </p>
                    </div>
                  ))}
               </div>

               {conflictStrategy === 'Hybrid' && (
                  <div className="p-6 bg-slate-50 border border-indigo-100 rounded-2xl space-y-6 animate-in zoom-in-95 duration-200">
                     <div className="flex justify-between items-center">
                        <h4 className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">AI Arbitration Weight</h4>
                        <span className="text-[10px] font-mono font-bold text-indigo-600 bg-white px-2 py-1 rounded shadow-sm">{aiWeight}% Adaptive</span>
                     </div>
                     <input 
                       type="range"
                       min="0"
                       max="100"
                       value={aiWeight}
                       onChange={(e) => setAiWeight(parseInt(e.target.value))}
                       className="w-full h-1 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                     />
                     <div className="flex justify-between text-[9px] font-black text-gray-400 uppercase font-mono">
                        <span>Low (Deterministic)</span>
                        <span>Mid (Heuristic)</span>
                        <span>High (Neural)</span>
                     </div>
                     <div className="flex items-start gap-4 p-4 bg-white border border-indigo-50 rounded-xl">
                        <ShieldCheck className="w-5 h-5 text-indigo-500 shrink-0" />
                        <p className="text-[10px] text-slate-600 leading-relaxed font-medium italic">
                          "Hybrid strategy leverages the **Breeze Ingress** to predict spikes while ensuring **Dynamics 365** budget constraints are not violated by more than 2% in any 24h window."
                        </p>
                     </div>
                  </div>
               )}
            </div>
          </section>
        );
    }
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-auto custom-scrollbar">
      <Header title="System Configuration" subtitle={`Triple-Engine Node ${APP_VERSION} • Microsoft Sentinel Secured`} />
      
      <div className="p-8 max-w-6xl mx-auto space-y-8 pb-24">
        
        {/* Global Save Bar */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-4">
             <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-500 ${showSuccess ? 'bg-emerald-500 text-white' : 'bg-blue-600/10 text-blue-600'}`}>
                {showSuccess ? <Check className="w-6 h-6 animate-in zoom-in" /> : <ShieldCheck className="w-6 h-6" />}
             </div>
             <div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Configuration Matrix</p>
                <p className="text-sm font-bold text-gray-900">{showSuccess ? 'Changes persisted to Cloud Fabric' : 'Strategic Engine Oversight Active'}</p>
             </div>
          </div>
          <button 
             onClick={handleSave}
             disabled={isSaving}
             className="bg-[#002050] hover:bg-slate-800 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center gap-3 shadow-xl shadow-blue-900/10 active:scale-95 disabled:opacity-50"
          >
             {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
             {isSaving ? 'Synchronizing...' : 'Save Configuration'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Settings Sidebar Nav */}
          <div className="lg:col-span-3 space-y-3">
             <button 
               onClick={() => setActiveTab('breeze')}
               className={`w-full flex items-center justify-between gap-3 px-5 py-4 rounded-2xl font-black text-[10px] shadow-sm transition-all text-left uppercase tracking-[0.1em] border-2 ${
                 activeTab === 'breeze' ? 'border-[#ff7a59] bg-white text-[#ff7a59] shadow-orange-500/5' : 'border-transparent text-gray-400 hover:bg-white hover:text-gray-600'
               }`}
             >
                <div className="flex items-center gap-3">
                  <Zap className={`w-4 h-4 ${activeTab === 'breeze' ? 'fill-[#ff7a59]' : ''}`} /> 
                  Breeze Agent
                </div>
                {hubspotStatus === 'connected' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
             </button>
             <button 
               onClick={() => setActiveTab('erp')}
               className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-black text-[10px] shadow-sm transition-all text-left uppercase tracking-[0.1em] border-2 ${
                 activeTab === 'erp' ? 'border-blue-600 bg-white text-blue-600 shadow-blue-500/5' : 'border-transparent text-gray-400 hover:bg-white hover:text-gray-600'
               }`}
             >
                <Database className="w-4 h-4" /> ERP Ingress
             </button>
             <button 
               onClick={() => setActiveTab('conflict')}
               className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-black text-[10px] shadow-sm transition-all text-left uppercase tracking-[0.1em] border-2 ${
                 activeTab === 'conflict' ? 'border-indigo-600 bg-white text-indigo-600 shadow-indigo-500/5' : 'border-transparent text-gray-400 hover:bg-white hover:text-gray-600'
               }`}
             >
                <Scale className="w-4 h-4" /> Conflict Logic
             </button>

             <div className="mt-10 p-5 bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <Activity className="w-24 h-24 text-white" />
                </div>
                <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">System Health</h4>
                <div className="space-y-3">
                   <div className="flex justify-between items-center">
                      <span className="text-[8px] text-slate-500 uppercase font-mono">Uptime</span>
                      <span className="text-[10px] text-emerald-400 font-bold font-mono">99.99%</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-[8px] text-slate-500 uppercase font-mono">Version</span>
                      <span className="text-[10px] text-blue-400 font-bold font-mono">{APP_VERSION}</span>
                   </div>
                </div>
             </div>
          </div>

          {/* Main Settings Content */}
          <div className="lg:col-span-9">
             {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
