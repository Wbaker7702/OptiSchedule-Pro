
import React, { useState } from 'react';
import Header from '../components/Header';
import { FISCAL_METRICS } from '../constants';
import { View } from '../types';
import { Book, Shield, Scale, Zap, Info, ArrowRight, TrendingUp, Calculator, FileCheck, Users, Terminal, Database, Code, ShieldCheck, Loader2, ExternalLink, BellRing, Download, Lock, AlertCircle, PenTool, CheckCircle2, Activity } from 'lucide-react';

interface PlaybookProps {
  setCurrentView?: (view: any) => void;
}

const Playbook: React.FC<PlaybookProps> = ({ setCurrentView }) => {
  const [recaptureInput, setRecaptureInput] = useState(FISCAL_METRICS.targetWeeklyHoursRecapture);
  const [activeActions, setActiveActions] = useState<Record<string, boolean>>({});
  const [lastAlert, setLastAlert] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // SOP State
  const [signature, setSignature] = useState('');
  const [managerTitle, setManagerTitle] = useState('');
  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const [signing, setSigning] = useState(false);
  
  const projectedSavings = recaptureInput * FISCAL_METRICS.avgPayRate * 52;
  const projectedProtection = projectedSavings * FISCAL_METRICS.currentROI;

  const simulateAction = (id: string, duration = 1500) => {
    setActiveActions(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setActiveActions(prev => ({ ...prev, [id]: false }));
      if (id === 'alert') {
        setLastAlert(`OPERATIONAL ALERT: Traffic surge detected at registers. Mitigating unplanned overtime risk.`);
        setTimeout(() => setLastAlert(null), 4000);
      }
    }, duration);
  };

  const handleDownloadBriefing = () => {
    setIsDownloading(true);
    
    const briefingContent = `
SENTINEL OPERATIONAL POLICY (SOP) v3.1.0
RETAIL MANAGEMENT DIRECTIVE: STORE 5065
=====================================================

1. MISSION STATEMENT
Securing store profitability through absolute labor efficiency 
and variance management. Variance represents a plan-to-actual 
gap that impacts EBITDA.

2. LABOR METRICS (STORE 5065)
- Weekly Labor Variance (Gap): $${FISCAL_METRICS.executionLeakage.toLocaleString()}
- Sentinel ROI Guard: ${FISCAL_METRICS.currentROI}x
- Annual Efficiency Recovery: $${FISCAL_METRICS.annualRecoveryTarget}M
- 2028 Strategic Valuation: $${FISCAL_METRICS.vision2028}M

3. LABOR RECAPTURE PROJECTION
- Targeted Overtime Mitigation: ${recaptureInput} hours/week
- Projected Annual Savings: $${Math.round(projectedSavings).toLocaleString()}
- EBITDA Value Safeguard: $${Math.round(projectedProtection).toLocaleString()}

4. OPERATIONAL INFRASTRUCTURE
- Data Ingress: Dynamics 365 / HubSpot Breeze
- Audit Engine: Labor Variance Linter v3.1
- Strategic Priority: Mitigate unplanned overtime through AI forecasting.

5. POLICY MANDATE
Labor variance is an operational inefficiency. Every unallocated 
labor hour or unplanned overtime minute impacts our bottom line. 
The Sentinel Protocol ensures scheduling accuracy is maintained.

Efficiency is Profit.

Document Generated: ${new Date().toLocaleString()}
Validated by: Store Management Node-5065
    `;

    setTimeout(() => {
      const blob = new Blob([briefingContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Store_5065_Labor_Policy.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setIsDownloading(false);
    }, 1200);
  };

  const handleAcknowledgment = (e: React.FormEvent) => {
    e.preventDefault();
    if(!signature || !managerTitle) return;
    
    setSigning(true);
    setTimeout(() => {
        setIsAcknowledged(true);
        setSigning(false);
    }, 1500);
  };

  const engineRoomCards = [
    {
      id: 'lint',
      title: "Labor Linter (Active)",
      desc: "Real-time auditing of planned vs. actual labor spend.",
      icon: <FileCheck className="w-5 h-5 text-blue-500" />,
      code: "Sentinel::Audit.variance",
      actionLabel: "Audit Variance",
      action: () => simulateAction('lint'),
      isAsync: true
    },
    {
      id: 'sync',
      title: "CRM Traffic Ingress",
      desc: "Secure link to HubSpot CRM for traffic surge prediction.",
      icon: <Database className="w-5 h-5 text-blue-400" />,
      code: "Sentinel.forecast_traffic",
      actionLabel: "Forecast Peak",
      action: () => setCurrentView?.(View.SCHEDULING),
      isAsync: false
    },
    {
      id: 'audit',
      title: "Efficiency Log",
      desc: "History of all scheduling corrections and overtime events.",
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      code: "EfficiencyLedger.record",
      actionLabel: "View Efficiency",
      action: () => setCurrentView?.(View.OPERATIONS),
      isAsync: false
    },
    {
      id: 'alert',
      title: "Overtime Mitigator",
      desc: "AI broadcast of resource shifts to prevent late-stay overtime.",
      icon: <Zap className="w-5 h-5 text-amber-500" />,
      code: "Sentinel.mitigate_overtime",
      actionLabel: "Shift Resources",
      action: () => simulateAction('alert'),
      isAsync: true
    }
  ];

  return (
    <div className="flex-1 bg-slate-950 overflow-auto">
      <Header title="Labor Efficiency Policy" subtitle="Retail Operations Protocol v3.1.0" />
      
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Interactive Scenario Planner */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
          <div className="bg-slate-950 p-6 flex flex-col md:flex-row justify-between items-center gap-6 border-b border-slate-800">
            <div>
              <h3 className="text-white font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3">
                <Calculator className="w-5 h-5 text-blue-500" />
                Labor Recapture Simulator
              </h3>
              <p className="text-slate-500 text-[10px] font-mono mt-1 uppercase">Modeling ROI through mitigation of unplanned overtime and scheduling gaps.</p>
            </div>
            <div className="flex items-center gap-4 bg-slate-900 p-2 rounded-xl border border-slate-800">
               <span className="text-slate-500 text-[9px] font-black uppercase tracking-widest px-2">Weekly Overtime Goal (Hrs)</span>
               <input 
                 type="number" 
                 value={recaptureInput}
                 onChange={(e) => setRecaptureInput(parseInt(e.target.value) || 0)}
                 className="w-24 bg-slate-950 text-blue-400 font-mono font-bold text-center py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
               />
            </div>
          </div>
          
          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Annual Labor Savings</p>
              <h4 className="text-3xl font-black text-white tracking-tighter">${Math.round(projectedSavings).toLocaleString()}</h4>
              <p className="text-xs text-slate-500 font-mono">Recovered via Efficiency Guard</p>
            </div>
            <div className="space-y-2 border-x border-slate-800 px-8">
              <p className="text-[10px] text-blue-500 uppercase tracking-widest font-black">Profit Guard ROI</p>
              <h4 className="text-3xl font-black text-blue-500 tracking-tighter">${Math.round(projectedProtection).toLocaleString()}</h4>
              <p className="text-xs text-slate-500 font-mono">EBITDA Growth Multiplier Enabled</p>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] text-emerald-500 uppercase tracking-widest font-black">2028 Store Valuation</p>
              <h4 className="text-3xl font-black text-emerald-500 tracking-tighter">${FISCAL_METRICS.vision2028}M</h4>
              <p className="text-xs text-slate-500 font-mono">Profitability Integrity Safeguard</p>
            </div>
          </div>
        </div>

        {/* Engine Room Section */}
        <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-xl overflow-hidden relative">
           <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
             <Scale className="w-64 h-64 text-blue-500" />
           </div>
           
           <div className="relative z-10 flex flex-col lg:flex-row gap-12">
              <div className="lg:w-1/3 space-y-6">
                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20">
                    {/* Fixed: Added missing Activity icon */}
                    <Activity className="w-3 h-3 text-blue-500" />
                    <span className="text-[9px] text-blue-500 font-black uppercase tracking-widest">Profit Guard Protocol</span>
                 </div>
                 <h2 className="text-3xl font-black text-white leading-tight uppercase tracking-tighter">The Efficiency Engine</h2>
                 <p className="text-slate-400 text-xs leading-relaxed font-mono">
                   Our framework analyzes the labor gap—the variance between planned staffing and actual spend. Unexpected overtime is detected early by the Breeze AI and mitigated through proactive resource shifting.
                 </p>
                 <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-[9px] font-mono font-bold text-slate-400">OT PROTECTION</span>
                    <span className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-[9px] font-mono font-bold text-slate-400">PLAN ACCURACY</span>
                    <span className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-[9px] font-mono font-bold text-slate-400">VARIANCE MAPPING</span>
                 </div>

                 {lastAlert && (
                   <div className="p-4 bg-orange-950/40 border border-orange-500/30 rounded-xl animate-in slide-in-from-left-4 fade-in duration-300">
                      <div className="flex items-center gap-3">
                         <AlertCircle className="w-5 h-5 text-orange-500 animate-pulse" />
                         <p className="text-[10px] font-mono text-orange-100 font-bold uppercase tracking-widest">{lastAlert}</p>
                      </div>
                   </div>
                 )}
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                 {engineRoomCards.map((box, i) => (
                   <div key={i} className="bg-slate-950/50 p-6 rounded-xl border border-slate-800 hover:border-blue-500/30 transition-all group flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">{box.icon}</div>
                        <span className="text-[9px] font-mono text-slate-600 font-bold uppercase tracking-widest">{box.code}</span>
                      </div>
                      <h4 className="text-white font-black text-xs uppercase tracking-widest mb-2">{box.title}</h4>
                      <p className="text-slate-500 text-[10px] leading-relaxed mb-6 font-mono">{box.desc}</p>
                      
                      <button 
                        onClick={box.action}
                        disabled={activeActions[box.id]}
                        className={`mt-auto w-full py-3 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
                          box.isAsync 
                            ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 hover:bg-blue-600 hover:text-white' 
                            : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700 hover:text-white'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {activeActions[box.id] ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            {box.isAsync ? <Terminal className="w-3 h-3" /> : <ExternalLink className="w-3 h-3" />}
                            {box.actionLabel}
                          </>
                        )}
                      </button>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* SOP Digital Acknowledgment Section */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl relative animate-in slide-in-from-bottom-8 duration-700">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
            <div className="p-8 md:p-12">
                <div className="flex flex-col items-center text-center mb-10">
                    <ShieldCheck className="w-12 h-12 text-blue-500 mb-4" />
                    <h2 className="text-2xl font-black text-white uppercase tracking-[0.2em] mb-2">Standard Operating Procedure (SOP): Labor Control</h2>
                    <p className="text-sm font-mono text-slate-500 uppercase tracking-widest">Store 5065 Efficiency Protocol</p>
                </div>

                <div className="max-w-3xl mx-auto space-y-8 text-slate-300">
                    <div className="space-y-4 font-mono text-sm leading-relaxed border-l-2 border-slate-800 pl-6">
                        <p>This SOP establishes the mandatory management of labor variance via OptiSchedule Pro.</p>
                        <p><span className="text-orange-400 font-bold">Unmanaged labor variance impacts store EBITDA directly.</span></p>
                        <p>Managers must review AI-generated traffic alerts to shift resources and prevent unplanned overtime.</p>
                        <p>Variance corrections must be logged to maintain the integrity of the store's fiscal plan.</p>
                        <p>Overtime oversight is a primary KPI for all Store Management staff.</p>
                    </div>

                    <div className="bg-slate-950 p-8 rounded-xl border border-slate-800 mt-8">
                        <h3 className="text-xs font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                            <PenTool className="w-4 h-4 text-blue-500" />
                            Management Acknowledgment
                        </h3>
                        
                        {!isAcknowledged ? (
                            <form onSubmit={handleAcknowledgment} className="space-y-6">
                                <p className="text-sm italic text-slate-400">
                                    "I acknowledge that managing labor variance and overtime is critical to store health. I will use Breeze AI to proactively manage staffing peaks."
                                </p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Signed</label>
                                        <input 
                                            type="text" 
                                            value={signature}
                                            onChange={(e) => setSignature(e.target.value)}
                                            placeholder="Full Name"
                                            className="w-full bg-transparent border-b-2 border-slate-700 py-2 text-white font-serif italic text-xl focus:border-blue-500 focus:outline-none placeholder-slate-700"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Date</label>
                                        <div className="w-full border-b-2 border-slate-700 py-3 text-slate-400 font-mono text-sm">
                                            {new Date().toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Title</label>
                                        <input 
                                            type="text" 
                                            value={managerTitle}
                                            onChange={(e) => setManagerTitle(e.target.value)}
                                            placeholder="Store Manager / Assistant Manager"
                                            className="w-full bg-transparent border-b-2 border-slate-700 py-2 text-white font-mono text-sm focus:border-blue-500 focus:outline-none uppercase placeholder-slate-700"
                                            required
                                        />
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={signing}
                                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-[0.2em] rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {signing ? (
                                        <><Loader2 className="w-4 h-4 animate-spin" /> Submitting Acknowledgment...</>
                                    ) : (
                                        <>Confirm Policy Alignment</>
                                    )}
                                </button>
                            </form>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 space-y-4 animate-in fade-in zoom-in duration-500">
                                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/30">
                                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                                </div>
                                <div className="text-center">
                                    <h4 className="text-xl font-black text-white uppercase tracking-widest mb-1">SOP Signed</h4>
                                    <p className="text-emerald-500 font-mono text-xs uppercase tracking-wider">Audit Ref: {Math.random().toString(36).substr(2, 12).toUpperCase()}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-8 text-center mt-6 w-full max-w-md border-t border-slate-800 pt-6">
                                    <div>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Signed By</p>
                                        <p className="text-white font-serif italic text-lg">{signature}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Timestamp</p>
                                        <p className="text-white font-mono text-sm">{new Date().toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Playbook;
