import React, { useState } from 'react';
import Header from '../components/Header';
import { FISCAL_METRICS } from '../constants';
import { View } from '../types';
import { Book, Shield, Scale, Zap, Info, ArrowRight, TrendingUp, Calculator, FileCheck, Users, Terminal, Database, Code, ShieldCheck, Loader2, ExternalLink, BellRing, Download, Lock, AlertCircle } from 'lucide-react';

interface PlaybookProps {
  setCurrentView?: (view: any) => void;
}

const Playbook: React.FC<PlaybookProps> = ({ setCurrentView }) => {
  const [recaptureInput, setRecaptureInput] = useState(FISCAL_METRICS.targetWeeklyHoursRecapture);
  const [activeActions, setActiveActions] = useState<Record<string, boolean>>({});
  const [lastAlert, setLastAlert] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const projectedSavings = recaptureInput * FISCAL_METRICS.avgPayRate * 52;
  const projectedProtection = projectedSavings * FISCAL_METRICS.currentROI;

  const simulateAction = (id: string, duration = 1500) => {
    setActiveActions(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setActiveActions(prev => ({ ...prev, [id]: false }));
      if (id === 'alert') {
        setLastAlert(`SENTINEL PROTOCOL ALERT: High customer density detected. Reallocating resources.`);
        setTimeout(() => setLastAlert(null), 4000);
      }
    }, duration);
  };

  const handleDownloadBriefing = () => {
    setIsDownloading(true);
    
    const briefingContent = `
SENTINEL SECURITY POLICY (SSP) v3.1.0
CLASSIFIED: AUTHORIZED STORE MANAGERS ONLY
=====================================================

1. SENTINEL MISSION
Securing the workforce through absolute operational 
standardization and Sentinel oversight. Variance is a 
breach of system integrity.

2. FISCAL SECURITY FRAMEWORK (STORE 5065)
- Weekly Asset Protection (Leakage): $${FISCAL_METRICS.executionLeakage.toLocaleString()}
- Sentinel Multiplier (ROI): ${FISCAL_METRICS.currentROI}x
- Market Recovery Directive: $${FISCAL_METRICS.annualRecoveryTarget}M
- 2028 Strategic Cap: $${FISCAL_METRICS.vision2028}M

3. CURRENT POLICY SIMULATION
- Targeted Resource Recapture: ${recaptureInput} hours/week
- Projected Annual Savings: $${Math.round(projectedSavings).toLocaleString()}
- EBITDA Value Safeguard: $${Math.round(projectedProtection).toLocaleString()}

4. SECURITY ENGINE (OPERATIONAL INFRASTRUCTURE)
- Framework: Sentinel Secure Node (Hardened)
- Sync Frequency: Real-time Dynamics 365 Ingress
- Audit Engine: Sentinel Linter v3.1 (Enforce Standard)

5. POLICY MANDATE
"Execution Leakage" is a breach of policy. 
Every unallocated labor hour is a digital security failure.
The Sentinel Security Policy must be enforced without variance.

Standardize or Fail.

Document Generated: ${new Date().toLocaleString()}
Validated by: Sentinel Security Auth Node-5065
    `;

    setTimeout(() => {
      const blob = new Blob([briefingContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Sentinel_Security_Policy_5065.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setIsDownloading(false);
    }, 1200);
  };

  const engineRoomCards = [
    {
      id: 'lint',
      title: "Sentinel Linter (Active)",
      desc: "Real-time auditing of staffing patterns against Sentinel Standards.",
      icon: <FileCheck className="w-5 h-5 text-blue-500" />,
      code: "Sentinel::Policy.enforce!",
      actionLabel: "Enforce Policy",
      action: () => simulateAction('lint'),
      isAsync: true
    },
    {
      id: 'sync',
      title: "D365 Ingress Node",
      desc: "Secure link to Microsoft Dynamics 365 and ERP data ingestion.",
      icon: <Database className="w-5 h-5 text-blue-400" />,
      code: "Sentinel.validate_ingress",
      actionLabel: "Monitor Node",
      action: () => setCurrentView?.(View.SCHEDULING),
      isAsync: false
    },
    {
      id: 'audit',
      title: "Oversight Log",
      desc: "Immutable ledger of all operational deviations and corrections.",
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      code: "SentinelLedger.record",
      actionLabel: "Audit Ledger",
      action: () => setCurrentView?.(View.OPERATIONS),
      isAsync: false
    },
    {
      id: 'alert',
      title: "Zone Defense Trigger",
      desc: "Instant broadcast of emergency labor reallocation directives.",
      icon: <Zap className="w-5 h-5 text-amber-500" />,
      code: "Sentinel.broadcast('Surge')",
      actionLabel: "Execute Directive",
      action: () => simulateAction('alert'),
      isAsync: true
    }
  ];

  return (
    <div className="flex-1 bg-slate-950 overflow-auto">
      <Header title="Sentinel Security Policy" subtitle="Authorized Workforce Protocol v3.1.0" />
      
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Interactive Scenario Planner */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
          <div className="bg-slate-950 p-6 flex flex-col md:flex-row justify-between items-center gap-6 border-b border-slate-800">
            <div>
              <h3 className="text-white font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3">
                <Calculator className="w-5 h-5 text-blue-500" />
                Sentinel Resource Simulator
              </h3>
              <p className="text-slate-500 text-[10px] font-mono mt-1 uppercase">Modeling ROI through strict Sentinel Policy compliance.</p>
            </div>
            <div className="flex items-center gap-4 bg-slate-900 p-2 rounded-xl border border-slate-800">
               <span className="text-slate-500 text-[9px] font-black uppercase tracking-widest px-2">Recapture Directive</span>
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
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Annual Asset Protection</p>
              <h4 className="text-3xl font-black text-white tracking-tighter">${Math.round(projectedSavings).toLocaleString()}</h4>
              <p className="text-xs text-slate-500 font-mono">Recovered via Sentinel Policy</p>
            </div>
            <div className="space-y-2 border-x border-slate-800 px-8">
              <p className="text-[10px] text-blue-500 uppercase tracking-widest font-black">Sentinel ROI Multiplier</p>
              <h4 className="text-3xl font-black text-blue-500 tracking-tighter">${Math.round(projectedProtection).toLocaleString()}</h4>
              <p className="text-xs text-slate-500 font-mono">10.3x Growth Multiplier Enabled</p>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] text-emerald-500 uppercase tracking-widest font-black">2028 Strategic Vision</p>
              <h4 className="text-3xl font-black text-emerald-500 tracking-tighter">${FISCAL_METRICS.vision2028}M</h4>
              <p className="text-xs text-slate-500 font-mono">Enterprise Value Safeguard</p>
            </div>
          </div>
        </div>

        {/* Engine Room Section */}
        <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-xl overflow-hidden relative">
           <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
             <Shield className="w-64 h-64 text-blue-500" />
           </div>
           
           <div className="relative z-10 flex flex-col lg:flex-row gap-12">
              <div className="lg:w-1/3 space-y-6">
                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20">
                    <Terminal className="w-3 h-3 text-blue-500" />
                    <span className="text-[9px] text-blue-500 font-black uppercase tracking-widest">Sentinel Protocol</span>
                 </div>
                 <h2 className="text-3xl font-black text-white leading-tight uppercase tracking-tighter">The Sentinel Secure Engine</h2>
                 <p className="text-slate-400 text-xs leading-relaxed font-mono">
                   The Sentinel Security Framework leverages a hardened, transactional architecture to eliminate workforce variance. Operational "leakage" is treated as a security breach, detected by the Sentinel Linter.
                 </p>
                 <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-[9px] font-mono font-bold text-slate-400">HARDENED NODE</span>
                    <span className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-[9px] font-mono font-bold text-slate-400">DYNAMICS INGRESS</span>
                    <span className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-[9px] font-mono font-bold text-slate-400">SHIELD CACHE</span>
                 </div>

                 {lastAlert && (
                   <div className="p-4 bg-red-950/40 border border-red-500/30 rounded-xl animate-in slide-in-from-left-4 fade-in duration-300">
                      <div className="flex items-center gap-3">
                         <AlertCircle className="w-5 h-5 text-red-500 animate-pulse" />
                         <p className="text-[10px] font-mono text-red-100 font-bold uppercase tracking-widest">{lastAlert}</p>
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
                            Executing...
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

        {/* Sentinel Roadmap */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 flex flex-col justify-between shadow-xl">
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                   <TrendingUp className="w-4 h-4 text-emerald-500" />
                   Sentinel Strategic Roadmap
                </h3>
                <div className="space-y-6">
                   {[
                     {year: "2025", goal: "Sentinel Framework Hardening", progress: "100%"},
                     {year: "2026", goal: "Regional Protocol Rollout", progress: "25%"},
                     {year: "2027", goal: "Autonomous Workforce Logic", progress: "0%"},
                     {year: "2028", goal: "Enterprise Compliance State", progress: "0%"}
                   ].map(step => (
                     <div key={step.year} className="relative pl-8 border-l-2 border-slate-800 last:border-0 pb-6">
                        <div className={`absolute -left-[7px] top-0 w-3 h-3 rounded-full border-2 border-slate-900 ${step.progress === '100%' ? 'bg-blue-500' : 'bg-slate-800'}`}></div>
                        <span className="text-[9px] font-black text-blue-500 font-mono uppercase tracking-widest">{step.year}</span>
                        <p className="text-[11px] font-black text-white uppercase tracking-wider">{step.goal}</p>
                        <div className="mt-2 w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                           <div className="bg-blue-600 h-full" style={{width: step.progress}}></div>
                        </div>
                     </div>
                   ))}
                </div>
              </div>
           </div>

           <div className="bg-blue-600 rounded-2xl p-8 text-white relative overflow-hidden flex flex-col justify-center shadow-2xl">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                 <Shield className="w-48 h-48" />
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter leading-tight">Standardize<br/>or Fail</h3>
                <p className="text-blue-100 leading-relaxed mb-8 font-bold text-xs uppercase tracking-wide opacity-80">
                  Workforce variance is the primary enemy of enterprise stability. The Sentinel Security Policy transforms the operational landscape into a strictly enforced protocol. Compliance is the only path to ROI.
                </p>
                <div className="flex gap-4">
                   <button 
                     onClick={handleDownloadBriefing}
                     disabled={isDownloading}
                     className="flex-1 py-4 bg-slate-950 text-blue-400 font-black text-[10px] uppercase tracking-[0.3em] rounded-xl shadow-xl hover:bg-slate-900 transition-all flex items-center justify-center gap-3 disabled:opacity-75 disabled:cursor-wait"
                   >
                     {isDownloading ? (
                       <>
                         <Loader2 className="w-4 h-4 animate-spin" /> Verifying Clearance...
                       </>
                     ) : (
                       <>
                         Download Policy <Download className="w-4 h-4" />
                       </>
                     )}
                   </button>
                </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Playbook;