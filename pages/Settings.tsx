
import React, { useState } from 'react';
import Header from '../components/Header';
import { 
  Shield, 
  Database, 
  Eye, 
  Bell, 
  RefreshCw, 
  Lock, 
  Globe, 
  Save, 
  Check, 
  AlertTriangle,
  Loader2,
  Terminal,
  Layers,
  Link as LinkIcon,
  MessageSquare,
  Scale,
  Activity,
  ArrowRightLeft,
  Server,
  Zap,
  Sparkles
} from 'lucide-react';
import { APP_VERSION } from '../constants';
import { IntegrationStatus } from '../types';

interface SettingsProps {
  hubspotStatus: IntegrationStatus;
  setHubspotStatus: (status: IntegrationStatus) => void;
}

const Settings: React.FC<SettingsProps> = ({ hubspotStatus, setHubspotStatus }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [hubspotLoading, setHubspotLoading] = useState(false);
  
  const [securityLevel, setSecurityLevel] = useState('High');
  const [environment, setEnvironment] = useState('Production');
  const [conflictStrategy, setConflictStrategy] = useState<'ERP' | 'CRM' | 'Hybrid'>('Hybrid');

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  const toggleHubspot = () => {
    setHubspotLoading(true);
    setTimeout(() => {
      setHubspotStatus(hubspotStatus === 'connected' ? 'disconnected' : 'connected');
      setHubspotLoading(false);
    }, 2000);
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      <Header title="System Configuration" subtitle={`OptiSchedule Pro ${APP_VERSION} • Sentinel Security Node`} />
      
      <div className="p-8 max-w-5xl mx-auto space-y-8">
        
        <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                <Check className="w-6 h-6" />
             </div>
             <div>
                <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Global Node Status</p>
                <p className="text-sm font-bold text-gray-900">Sentinel Secured • All Protocols Validated</p>
             </div>
          </div>
          <button 
             onClick={handleSave}
             disabled={isSaving}
             className="bg-[#002050] hover:bg-[#003070] text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center gap-2 shadow-lg shadow-blue-900/10"
          >
             {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : showSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
             {isSaving ? 'Persisting...' : showSuccess ? 'Saved' : 'Commit Changes'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3 space-y-2">
             <button className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-orange-500/20 rounded-xl text-orange-600 font-bold text-xs shadow-sm transition-all text-left uppercase tracking-wider">
                <Sparkles className="w-4 h-4" /> Breeze Agent
             </button>
             <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white text-gray-500 font-bold text-xs rounded-xl transition-all text-left uppercase tracking-wider">
                <Database className="w-4 h-4" /> ERP Ingress
             </button>
             <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white text-gray-500 font-bold text-xs rounded-xl transition-all text-left uppercase tracking-wider">
                <Scale className="w-4 h-4" /> Conflict Logic
             </button>
          </div>

          <div className="lg:col-span-9 space-y-8">
             {/* Breeze Agent / HubSpot Section */}
             <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <div className={`p-6 border-b flex items-center justify-between transition-colors duration-500 ${hubspotStatus === 'connected' ? 'bg-orange-50 border-orange-100' : 'bg-gray-50 border-gray-100'}`}>
                   <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${hubspotStatus === 'connected' ? 'bg-[#ff7a59]' : 'bg-slate-200'}`}>
                          <Zap className={`w-4 h-4 ${hubspotStatus === 'connected' ? 'text-white fill-white' : 'text-slate-500'}`} />
                      </div>
                      <h3 className="font-black text-gray-900 text-xs uppercase tracking-[0.1em]">HubSpot Breeze Agent</h3>
                   </div>
                   <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${hubspotStatus === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`}></div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                        {hubspotStatus === 'connected' ? 'Smart Ingress Active' : 'Idle'}
                      </span>
                   </div>
                </div>
                <div className="p-8">
                   <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                      <div className="max-w-md">
                         <div className="flex items-center gap-2 mb-2">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 bg-orange-100 text-[#ff7a59] rounded">New Release</span>
                         </div>
                         <p className="text-sm font-bold text-gray-900 mb-1">One-Click Breeze Integration</p>
                         <p className="text-xs text-gray-500 leading-relaxed font-medium">
                            The Breeze Agent automates your HubSpot connection by discovering active sessions and mapping properties to your labor matrix. No complex API keys required.
                         </p>
                      </div>
                      <button 
                        onClick={toggleHubspot}
                        disabled={hubspotLoading}
                        className={`min-w-[200px] px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
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
                               <p className="text-[8px] text-slate-500 uppercase font-black mb-1">Objects Mapped</p>
                               <p className="text-xs font-bold text-white font-mono">1,240</p>
                            </div>
                            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                               <p className="text-[8px] text-slate-500 uppercase font-black mb-1">Handshake</p>
                               <p className="text-xs font-bold text-emerald-400 font-mono">VERIFIED</p>
                            </div>
                         </div>
                      </div>
                   )}
                </div>
             </section>

             {/* Conflict Resolution */}
             <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-gray-100 bg-gray-50/5 flex items-center gap-3">
                   <div className="p-2 bg-indigo-500 rounded-lg">
                       <Scale className="w-4 h-4 text-white" />
                   </div>
                   <h3 className="font-black text-gray-900 text-xs uppercase tracking-[0.1em]">Conflict Arbitration</h3>
                </div>
                <div className="p-8">
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {['ERP', 'CRM', 'Hybrid'].map((strategy) => (
                        <div 
                          key={strategy}
                          onClick={() => setConflictStrategy(strategy as any)}
                          className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                             conflictStrategy === strategy ? 'border-indigo-500 bg-indigo-50' : 'border-gray-50 hover:border-indigo-100'
                          }`}
                        >
                           <h4 className="text-sm font-black text-gray-900 mb-1">{strategy === 'Hybrid' ? 'Breeze Hybrid' : strategy}</h4>
                           <p className="text-[10px] text-gray-500 leading-snug">
                             {strategy === 'ERP' && 'Adhere to strict financial budget limits.'}
                             {strategy === 'CRM' && 'Prioritize traffic forecasts over budget.'}
                             {strategy === 'Hybrid' && 'AI-weighted balance of both data nodes.'}
                           </p>
                        </div>
                      ))}
                   </div>
                </div>
             </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
