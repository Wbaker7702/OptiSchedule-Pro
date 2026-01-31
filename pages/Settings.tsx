
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
  Zap
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
  
  // Conflict Strategy
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
             <button className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-blue-600/20 rounded-xl text-blue-600 font-bold text-xs shadow-sm transition-all text-left uppercase tracking-wider">
                <Shield className="w-4 h-4" /> Security Protocol
             </button>
             <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white text-gray-500 font-bold text-xs rounded-xl transition-all text-left uppercase tracking-wider">
                <Database className="w-4 h-4" /> ERP & CRM Ingress
             </button>
             <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white text-gray-500 font-bold text-xs rounded-xl transition-all text-left uppercase tracking-wider">
                <Scale className="w-4 h-4" /> Conflict Logic
             </button>
             <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white text-gray-500 font-bold text-xs rounded-xl transition-all text-left uppercase tracking-wider">
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
                            Connect HubSpot to synchronize customer loyalty tiers and active marketing campaigns with your workforce deployment schedules.
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
                            <span className="flex items-center gap-2"><Activity className="w-3 h-3" /> Connection Health</span>
                            <span className="text-emerald-600">Excellent (24ms)</span>
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-3 rounded-lg border border-orange-200">
                               <p className="text-[9px] text-gray-400 uppercase font-black mb-1">Last Packet</p>
                               <p className="text-xs font-bold text-gray-900 font-mono">{new Date().toLocaleTimeString()}</p>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-orange-200">
                               <p className="text-[9px] text-gray-400 uppercase font-black mb-1">Data Throughput</p>
                               <p className="text-xs font-bold text-gray-900 font-mono">1.2 MB/s</p>
                            </div>
                         </div>
                      </div>
                   )}
                </div>
             </section>

             {/* ERP Node Section */}
             <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-600 rounded-lg">
                          <Database className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="font-black text-gray-900 text-xs uppercase tracking-[0.1em]">ERP Data Bridge</h3>
                   </div>
                   <div className="flex items-center gap-2">
                      <Globe className="w-3 h-3 text-gray-400" />
                      <span className="text-[10px] font-mono font-bold text-gray-500 uppercase">us-west1-a</span>
                   </div>
                </div>
                
                <div className="p-8 space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                         <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Environment</label>
                         <select 
                           value={environment}
                           onChange={(e) => setEnvironment(e.target.value)}
                           className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-sm text-gray-900"
                         >
                            <option value="Production">Production (Live)</option>
                            <option value="Staging">Staging (Sandbox)</option>
                            <option value="Development">Development (Test)</option>
                         </select>
                      </div>
                      <div>
                         <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Sync Frequency</label>
                         <select 
                           value={syncFrequency}
                           onChange={(e) => setSyncFrequency(e.target.value)}
                           className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-sm text-gray-900"
                         >
                            <option value="Real-time">Real-time (WebSocket)</option>
                            <option value="15min">Every 15 Minutes</option>
                            <option value="Hourly">Hourly Batch</option>
                            <option value="Daily">Daily Close</option>
                         </select>
                      </div>
                   </div>

                   <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                         <div className="flex items-center gap-2">
                             <Server className="w-4 h-4 text-blue-600" />
                             <span className="text-[10px] font-black text-blue-800 uppercase tracking-widest">Bridge Diagnostics</span>
                         </div>
                         <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-100 rounded text-[9px] font-bold text-blue-700 uppercase tracking-wider">
                             <Zap className="w-3 h-3" /> Live
                         </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                         <div className="text-center p-2 bg-white rounded border border-blue-200">
                            <p className="text-[9px] text-gray-400 uppercase font-black">Latency</p>
                            <p className="text-sm font-black text-gray-900 font-mono">18ms</p>
                         </div>
                         <div className="text-center p-2 bg-white rounded border border-blue-200">
                            <p className="text-[9px] text-gray-400 uppercase font-black">Jitter</p>
                            <p className="text-sm font-black text-gray-900 font-mono">0.4ms</p>
                         </div>
                         <div className="text-center p-2 bg-white rounded border border-blue-200">
                            <p className="text-[9px] text-gray-400 uppercase font-black">Packet Loss</p>
                            <p className="text-sm font-black text-emerald-600 font-mono">0.00%</p>
                         </div>
                      </div>
                   </div>
                </div>
             </section>

             {/* Conflict Resolution Strategy */}
             <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm relative">
                <div className="absolute top-0 right-0 w-1 h-full bg-indigo-500"></div>
                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
                   <div className="p-2 bg-indigo-500 rounded-lg">
                       <Scale className="w-4 h-4 text-white" />
                   </div>
                   <h3 className="font-black text-gray-900 text-xs uppercase tracking-[0.1em]">Conflict Resolution Strategy</h3>
                </div>
                
                <div className="p-8">
                   <p className="text-xs text-gray-500 mb-6 font-medium leading-relaxed max-w-2xl">
                      Define the "Master Data Source" when Sentinel detects a variance between ERP requirements (Financial) and CRM forecasts (Traffic). 
                   </p>
                   
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div 
                        onClick={() => setConflictStrategy('ERP')}
                        className={`cursor-pointer p-4 rounded-xl border-2 transition-all relative overflow-hidden group ${
                           conflictStrategy === 'ERP' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-100 hover:border-indigo-200'
                        }`}
                      >
                         <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Strategy A</span>
                            {conflictStrategy === 'ERP' && <Check className="w-4 h-4 text-indigo-600" />}
                         </div>
                         <h4 className="text-sm font-black text-gray-900 mb-1">Financial Hardening</h4>
                         <p className="text-[10px] text-gray-500 leading-snug">ERP Data overrides all signals. Budget compliance is absolute.</p>
                      </div>

                      <div 
                        onClick={() => setConflictStrategy('CRM')}
                        className={`cursor-pointer p-4 rounded-xl border-2 transition-all relative overflow-hidden group ${
                           conflictStrategy === 'CRM' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-100 hover:border-indigo-200'
                        }`}
                      >
                         <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Strategy B</span>
                            {conflictStrategy === 'CRM' && <Check className="w-4 h-4 text-indigo-600" />}
                         </div>
                         <h4 className="text-sm font-black text-gray-900 mb-1">Growth Velocity</h4>
                         <p className="text-[10px] text-gray-500 leading-snug">HubSpot traffic data overrides budget. Prioritize customer experience.</p>
                      </div>

                      <div 
                        onClick={() => setConflictStrategy('Hybrid')}
                        className={`cursor-pointer p-4 rounded-xl border-2 transition-all relative overflow-hidden group ${
                           conflictStrategy === 'Hybrid' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-100 hover:border-indigo-200'
                        }`}
                      >
                         <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Strategy C</span>
                            {conflictStrategy === 'Hybrid' && <Check className="w-4 h-4 text-indigo-600" />}
                         </div>
                         <h4 className="text-sm font-black text-gray-900 mb-1">Sentinel Hybrid</h4>
                         <p className="text-[10px] text-gray-500 leading-snug">AI-weighted decision based on real-time ROI probability.</p>
                      </div>
                   </div>

                   {conflictStrategy === 'Hybrid' && (
                      <div className="mt-4 p-3 bg-indigo-50/50 border border-indigo-100 rounded-lg flex items-start gap-3">
                         <Terminal className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                         <p className="text-[10px] text-indigo-800 font-mono leading-relaxed">
                            <strong>Sentinel AI Logic:</strong> System will calculate the cost of overstaffing vs. the potential revenue loss of understaffing in real-time. Variances under $500/hr are auto-approved.
                         </p>
                      </div>
                   )}
                </div>
             </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
