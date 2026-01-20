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
  MessageSquare
} from 'lucide-react';
import { APP_VERSION } from '../constants';

const Settings: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // HubSpot Configuration
  const [hubspotConnected, setHubspotConnected] = useState(false);
  const [hubspotLoading, setHubspotLoading] = useState(false);
  
  // Sentinel Configuration
  const [securityLevel, setSecurityLevel] = useState('High');
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [autoRemediate, setAutoRemediate] = useState(true);
  
  // Interface Configuration
  const [highContrast, setHighContrast] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  
  // ERP Configuration
  const [syncFrequency, setSyncFrequency] = useState('Real-time');
  const [environment, setEnvironment] = useState('Production');

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
      setHubspotConnected(!hubspotConnected);
      setHubspotLoading(false);
    }, 2000);
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      <Header title="System Configuration" subtitle={`OptiSchedule Pro ${APP_VERSION} • Sentinel Security Node`} />
      
      <div className="p-8 max-w-5xl mx-auto space-y-8">
        
        {/* Status Bar */}
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
          <div className="flex gap-2">
             <button 
               onClick={handleSave}
               disabled={isSaving}
               className="bg-[#002050] hover:bg-[#003070] text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center gap-2 shadow-lg shadow-blue-900/10"
             >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Persisting...
                  </>
                ) : showSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    Configuration Saved
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Commit Changes
                  </>
                )}
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Nav (Internal) */}
          <div className="lg:col-span-3 space-y-2">
             <button className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-blue-600/20 rounded-xl text-blue-600 font-bold text-xs shadow-sm transition-all text-left">
                <Shield className="w-4 h-4" /> Security Protocol
             </button>
             <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white text-gray-500 font-bold text-xs rounded-xl transition-all text-left">
                <Database className="w-4 h-4" /> ERP & CRM Ingress
             </button>
             <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white text-gray-500 font-bold text-xs rounded-xl transition-all text-left">
                <Eye className="w-4 h-4" /> Visual & UI
             </button>
             <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white text-gray-500 font-bold text-xs rounded-xl transition-all text-left">
                <Bell className="w-4 h-4" /> Policy Alerts
             </button>
          </div>

          {/* Main Form Content */}
          <div className="lg:col-span-9 space-y-8">
             
             {/* HubSpot CRM Integration Section */}
             <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#ff7a59] rounded-lg">
                          <Layers className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="font-black text-gray-900 text-xs uppercase tracking-[0.1em]">HubSpot CRM Integration</h3>
                   </div>
                   <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${hubspotConnected ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'}`}>
                      {hubspotConnected ? 'Online' : 'Disconnected'}
                   </span>
                </div>
                <div className="p-8">
                   <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="max-w-md">
                         <p className="text-sm font-bold text-gray-900 mb-1">Sync Marketing & Loyalty Data</p>
                         <p className="text-xs text-gray-500 leading-relaxed">
                            Connect HubSpot to synchronize customer loyalty tiers and active marketing campaigns with your workforce deployment schedules. Ensure peak staffing during campaign surges.
                         </p>
                      </div>
                      <button 
                        onClick={toggleHubspot}
                        disabled={hubspotLoading}
                        className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${
                           hubspotConnected 
                           ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' 
                           : 'bg-[#ff7a59] text-white shadow-lg shadow-orange-500/20 hover:bg-[#ff8f75]'
                        }`}
                      >
                         {hubspotLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                         ) : hubspotConnected ? (
                            <>Terminate HubSpot Link</>
                         ) : (
                            <><LinkIcon className="w-4 h-4" /> Authorize HubSpot</>
                         )}
                      </button>
                   </div>
                   
                   {hubspotConnected && (
                      <div className="mt-6 p-4 bg-orange-50 border border-orange-100 rounded-xl space-y-3">
                         <div className="flex items-center justify-between text-[10px] font-black text-orange-800 uppercase tracking-widest">
                            <span>Ingress Scopes</span>
                            <span className="text-orange-400">Verified</span>
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-3 rounded-lg border border-orange-200">
                               <p className="text-[9px] text-gray-400 uppercase font-black mb-1">Loyalty Tier Sync</p>
                               <p className="text-xs font-bold text-gray-900">Active (4,250 Contacts)</p>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-orange-200">
                               <p className="text-[9px] text-gray-400 uppercase font-black mb-1">Campaign Ingress</p>
                               <p className="text-xs font-bold text-gray-900">Holiday Surge v4.2</p>
                            </div>
                         </div>
                      </div>
                   )}
                </div>
             </section>

             {/* Security Section */}
             <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
                   <div className="p-2 bg-blue-600 rounded-lg">
                      <Lock className="w-4 h-4 text-white" />
                   </div>
                   <h3 className="font-black text-gray-900 text-xs uppercase tracking-[0.1em]">Sentinel Security Framework</h3>
                </div>
                <div className="p-8 space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                         <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Enforcement Intensity</label>
                         <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
                            {['Standard', 'High', 'Absolute'].map(level => (
                               <button 
                                 key={level}
                                 onClick={() => setSecurityLevel(level)}
                                 className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${securityLevel === level ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                               >
                                  {level}
                               </button>
                            ))}
                         </div>
                      </div>
                      <div>
                         <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Session Hardening (Minutes)</label>
                         <select 
                           value={sessionTimeout}
                           onChange={(e) => setSessionTimeout(e.target.value)}
                           className="w-full p-3 bg-white border border-gray-300 rounded-xl font-bold text-sm text-gray-900 focus:ring-2 focus:ring-blue-600 outline-none"
                         >
                            <option value="15">15 Minutes</option>
                            <option value="30">30 Minutes</option>
                            <option value="60">60 Minutes</option>
                            <option value="120">2 Hours</option>
                         </select>
                      </div>
                   </div>

                   <div className="flex items-center justify-between p-4 bg-blue-50/50 border border-blue-100 rounded-2xl">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-white border border-blue-100 rounded-xl flex items-center justify-center">
                            <RefreshCw className={`w-5 h-5 text-blue-600 ${autoRemediate ? 'animate-spin-slow' : ''}`} />
                         </div>
                         <div>
                            <p className="text-sm font-bold text-gray-900">Auto-Remediate Operational Deviations</p>
                            <p className="text-xs text-gray-500">Sentinel Node will automatically correct D365 & HubSpot sync gaps.</p>
                         </div>
                      </div>
                      <button 
                        onClick={() => setAutoRemediate(!autoRemediate)}
                        className={`w-14 h-8 rounded-full transition-all relative ${autoRemediate ? 'bg-blue-600' : 'bg-gray-300'}`}
                      >
                         <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all ${autoRemediate ? 'right-1' : 'left-1'}`} />
                      </button>
                   </div>
                </div>
             </section>

             {/* Interface Section */}
             <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
                   <div className="p-2 bg-slate-800 rounded-lg">
                      <Eye className="w-4 h-4 text-white" />
                   </div>
                   <h3 className="font-black text-gray-900 text-xs uppercase tracking-[0.1em]">Visual Accessibility & Deployment</h3>
                </div>
                <div className="p-8 space-y-6">
                   <div className="flex items-center justify-between">
                      <div>
                         <p className="text-sm font-bold text-gray-900">High Contrast Input Mode</p>
                         <p className="text-xs text-gray-500">Forces dark text on all white input backgrounds for maximum legibility.</p>
                      </div>
                      <button 
                        onClick={() => setHighContrast(!highContrast)}
                        className={`w-14 h-8 rounded-full transition-all relative ${highContrast ? 'bg-[#002050]' : 'bg-gray-300'}`}
                      >
                         <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all ${highContrast ? 'right-1' : 'left-1'}`} />
                      </button>
                   </div>

                   <div className="flex items-center justify-between">
                      <div>
                         <p className="text-sm font-bold text-gray-900">Sentinel Pulse Animations</p>
                         <p className="text-xs text-gray-500">Enable/Disable real-time scanning visual effects on the dashboard.</p>
                      </div>
                      <button 
                        onClick={() => setAnimationsEnabled(!animationsEnabled)}
                        className={`w-14 h-8 rounded-full transition-all relative ${animationsEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}
                      >
                         <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all ${animationsEnabled ? 'right-1' : 'left-1'}`} />
                      </button>
                   </div>
                </div>
             </section>

             {/* ERP Node Section */}
             <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
                   <div className="p-2 bg-indigo-600 rounded-lg">
                      <Database className="w-4 h-4 text-white" />
                   </div>
                   <h3 className="font-black text-gray-900 text-xs uppercase tracking-[0.1em]">Microsoft Dynamics 365 Core Ingress</h3>
                </div>
                <div className="p-8 space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                         <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Target Environment</label>
                         <select 
                           value={environment}
                           onChange={(e) => setEnvironment(e.target.value)}
                           className="w-full p-3 bg-white border border-gray-300 rounded-xl font-bold text-sm text-gray-900 focus:ring-2 focus:ring-blue-600 outline-none"
                         >
                            <option value="Development">SANDBOX-01 (Development)</option>
                            <option value="Staging">UAT-ENVR (Staging)</option>
                            <option value="Production">SECURE-PROD (Production)</option>
                         </select>
                      </div>
                      <div>
                         <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">D365 Data Fetch Priority</label>
                         <select 
                           value={syncFrequency}
                           onChange={(e) => setSyncFrequency(e.target.value)}
                           className="w-full p-3 bg-white border border-gray-300 rounded-xl font-bold text-sm text-gray-900 focus:ring-2 focus:ring-blue-600 outline-none"
                         >
                            <option value="Real-time">Real-time (Standard)</option>
                            <option value="5-min">5 Minute Batches</option>
                            <option value="Daily">Daily Reconciliation</option>
                         </select>
                      </div>
                   </div>

                   <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                           <Terminal className="w-4 h-4 text-emerald-400" />
                           <span className="text-[10px] font-black text-white uppercase tracking-widest">Active API Endpoint Mapping</span>
                        </div>
                        <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-widest">Bridging Active</span>
                      </div>
                      <div className="space-y-2 font-mono text-[10px]">
                         <div className="flex justify-between text-slate-400 border-b border-slate-800 pb-1">
                            <span>RESOURCE_MAPPING</span>
                            <span className="text-emerald-500">D365_HCM_CORE</span>
                         </div>
                         <div className="flex justify-between text-slate-400 border-b border-slate-800 pb-1">
                            <span>SALES_INGRESS</span>
                            <span className="text-emerald-500">D365_FIN_OPS_PROD</span>
                         </div>
                         <div className="flex justify-between text-slate-400">
                            <span>SENTINEL_TOKEN</span>
                            <span className="text-blue-500">AUTH_JWT_SECURE</span>
                         </div>
                      </div>
                   </div>
                </div>
             </section>

             {/* Danger Zone */}
             <section className="bg-red-50 border border-red-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-red-100 flex items-center gap-3">
                   <div className="p-2 bg-red-600 rounded-lg">
                      <AlertTriangle className="w-4 h-4 text-white" />
                   </div>
                   <h3 className="font-black text-red-900 text-xs uppercase tracking-[0.1em]">Security Vault & Reset</h3>
                </div>
                <div className="p-8">
                   <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                      <div>
                         <p className="text-sm font-bold text-red-900">Factory Reset Sentinel Node</p>
                         <p className="text-xs text-red-700">Clears all Microsoft Dynamics 365 & HubSpot mapping.</p>
                      </div>
                      <button className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-red-900/10 transition-all">
                         Authorize Wipe
                      </button>
                   </div>
                </div>
             </section>
          </div>
        </div>
      </div>

      <style>{`
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Settings;