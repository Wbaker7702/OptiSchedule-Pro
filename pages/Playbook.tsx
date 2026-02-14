
import React, { useState } from 'react';
import Header from '../components/Header';
import { FISCAL_METRICS, LABOR_REGULATIONS, CURRENT_STATE } from '../constants';
import { 
  ShieldCheck, 
  MapPin, 
  Globe, 
  AlertCircle, 
  Terminal, 
  Activity, 
  Clock, 
  Scale, 
  CheckCircle2, 
  Lock, 
  FileText, 
  Users, 
  Zap, 
  ChevronRight, 
  BookOpen,
  Loader2
} from 'lucide-react';

const Playbook: React.FC = () => {
  const reg = LABOR_REGULATIONS[CURRENT_STATE];
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPolicy = () => {
    setIsDownloading(true);
    
    setTimeout(() => {
      try {
        const timestamp = new Date().toLocaleString();
        const content = `
=========================================
SENTINEL POLICY FRAME - ${reg.state.toUpperCase()}
=========================================
GENERATED: ${timestamp}
JURISDICTION: ${reg.state}
STATUS: ACTIVE & ENFORCED
=========================================

MINOR (UNDER 18) CONSTRAINTS:
- Max Shift (16-17): ${reg.maxShiftMinor1617} Hours
- Curfew (16-17): ${reg.curfewMinor1617}
- Max Shift (14-15): ${reg.maxShiftMinor1415} Hours
- Curfew (14-15): ${reg.curfewMinor1415}

ADULT (18+) CONSTRAINTS:
- Max Shift: ${reg.maxShiftAdult} Hours
- OT Threshold: 40 Hours / Week
- Min Recovery Gap: 8.0 Hours

BREAK PROTOCOLS:
- Threshold: ${reg.mandatoryBreakThreshold} Hours
- Duration: ${reg.mandatoryBreakDuration} Minutes (Unpaid)

SENTINEL LINTER OVERRIDE:
[ENABLED] All schedules are automatically gated by 
these parameters to ensure zero-breach compliance.

(c) 2024 OptiSchedule Pro Enterprise Systems
        `.trim();

        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Sentinel_Policy_${reg.state}_${Date.now()}.txt`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (err) {
        console.error("Policy Download Failed:", err);
      } finally {
        setIsDownloading(false);
      }
    }, 1000);
  };

  return (
    <div className="flex-1 bg-slate-950 overflow-auto custom-scrollbar">
      <Header title="Sentinel Policy Playbook" subtitle={`Jurisdictional Compliance Matrix • Region: ${reg.state}`} />
      
      <div className="p-8 max-w-7xl mx-auto space-y-8 pb-24">
        {/* Active Jurisdiction Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-slate-900 rounded-2xl border-l-4 border-blue-600 p-8 shadow-2xl relative overflow-hidden group">
             <div className="absolute -right-8 -top-8 opacity-5 group-hover:scale-110 transition-transform duration-1000">
                <MapPin className="w-48 h-48 text-white" />
             </div>
             <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                   <div className="p-3 bg-blue-600 rounded-2xl shadow-xl shadow-blue-600/20">
                      <ShieldCheck className="w-8 h-8 text-white" />
                   </div>
                   <div>
                      <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Active Jurisdiction: {reg.state}</h2>
                      <p className="text-[10px] text-blue-400 font-mono font-black uppercase tracking-[0.2em] mt-1">Status: Fully Compliant Node</p>
                   </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-8 font-mono">
                   <div className="space-y-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-orange-500" />
                        <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Minor (Under 18) Protocol</h4>
                      </div>
                      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                         <div className="flex justify-between border-b border-slate-800/50 pb-3">
                            <span className="text-[10px] text-slate-500 uppercase font-black">Daily Limit (16-17)</span>
                            <span className="text-xs text-white font-black">{reg.maxShiftMinor1617} Hours</span>
                         </div>
                         <div className="flex justify-between border-b border-slate-800/50 pb-3">
                            <span className="text-[10px] text-slate-500 uppercase font-black">Curfew (Sun-Thu)</span>
                            <span className="text-xs text-orange-400 font-black">{reg.curfewMinor1617}</span>
                         </div>
                         <div className="flex justify-between border-b border-slate-800/50 pb-3">
                            <span className="text-[10px] text-slate-500 uppercase font-black">Daily Limit (14-15)</span>
                            <span className="text-xs text-white font-black">{reg.maxShiftMinor1415} Hours</span>
                         </div>
                         <div className="flex justify-between">
                            <span className="text-[10px] text-slate-500 uppercase font-black">Curfew (14-15)</span>
                            <span className="text-xs text-orange-400 font-black">{reg.curfewMinor1415}</span>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Scale className="w-4 h-4 text-emerald-500" />
                        <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Adult (18+) Protocol</h4>
                      </div>
                      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                         <div className="flex justify-between border-b border-slate-800/50 pb-3">
                            <span className="text-[10px] text-slate-500 uppercase font-black">Daily Max Shift</span>
                            <span className="text-xs text-white font-black">{reg.maxShiftAdult} Hours</span>
                         </div>
                         <div className="flex justify-between border-b border-slate-800/50 pb-3">
                            <span className="text-[10px] text-slate-500 uppercase font-black">OT Threshold</span>
                            <span className="text-xs text-blue-400 font-black">40 Hrs / Week</span>
                         </div>
                         <div className="flex justify-between border-b border-slate-800/50 pb-3">
                            <span className="text-[10px] text-slate-500 uppercase font-black">Min Recovery Gap</span>
                            <span className="text-xs text-white font-black">8.0 Hours</span>
                         </div>
                         <div className="flex justify-between">
                            <span className="text-[10px] text-slate-500 uppercase font-black">Break Policy</span>
                            <span className="text-xs text-emerald-400 font-black">30m / 5h Work</span>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Regional Expansion Placeholder - THE WHITE SPACE */}
          <div className="bg-slate-900 rounded-2xl border-2 border-dashed border-slate-800 p-8 flex flex-col items-center justify-center text-center relative group hover:border-blue-500/20 transition-all">
             <div className="w-16 h-16 rounded-full bg-slate-950 flex items-center justify-center mb-6 border border-slate-800">
                <Globe className="w-8 h-8 text-slate-700 group-hover:text-blue-500 transition-colors" />
             </div>
             <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Future Jurisdictions</h3>
             <p className="text-[10px] text-slate-600 font-mono mt-2 uppercase max-w-[180px] leading-relaxed">
                Expansion modules for neighboring nodes (OH, IN, IL) awaiting fiscal verification.
             </p>
             <div className="mt-8 flex flex-wrap justify-center gap-2">
                {["OH", "IN", "IL", "WI"].map(state => (
                   <div key={state} className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-[9px] font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                      <Lock className="w-2.5 h-2.5" /> {state}
                   </div>
                ))}
             </div>
             <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl" />
          </div>
        </div>

        {/* Math & Allocation Rules */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
           <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                 <Terminal className="w-5 h-5 text-blue-500" />
                 <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Compliance Allocation Algorithm</h3>
              </div>
              <div className="space-y-6">
                 <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] leading-relaxed">
                    <p className="text-blue-400"># Michigan Youth Employment Standards Act (P.A. 90)</p>
                    <p className="text-slate-500 mt-2">def validate_minor_shift(minor_age, start_time, end_time, total_weekly_hours):</p>
                    <p className="text-slate-400 ml-4">if minor_age &lt; 16:</p>
                    <p className="text-slate-300 ml-8">curfew = "19:00"  # 7:00 PM</p>
                    <p className="text-slate-300 ml-8">weekly_max = 18 if school_in_session else 40</p>
                    <p className="text-slate-400 ml-4">elif minor_age &lt; 18:</p>
                    <p className="text-slate-300 ml-8">curfew = "22:30"  # 10:30 PM (Sun-Thu)</p>
                    <p className="text-slate-300 ml-8">weekly_max = 24 if school_in_session else 48</p>
                    <p className="text-slate-400 ml-4"># Check Break Logic</p>
                    <p className="text-slate-300 ml-4">if shift_duration &gt; 5.0 and not has_30m_break:</p>
                    <p className="text-red-400 ml-8">return COMPLIANCE_ERROR("Mandatory Lunch Required")</p>
                 </div>
                 <div className="flex items-center gap-4 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                    <Zap className="w-5 h-5 text-blue-400 shrink-0" />
                    <p className="text-[10px] text-slate-300 font-mono leading-relaxed">
                       Sentinel's scheduler automatically injects a <span className="text-blue-400 font-black">30-minute unpaid lunch</span> at exactly the 4.5-hour mark for all minor associates to ensure zero breach of MI state labor standards.
                    </p>
                 </div>
              </div>
           </div>

           <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                   <FileText className="w-5 h-5 text-emerald-500" />
                   <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Operational Constraints</h3>
                </div>
                <div className="space-y-4">
                   <div className="flex items-start gap-4 p-4 hover:bg-slate-800/40 transition-colors rounded-xl group cursor-help">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                         <Clock className="w-4 h-4" />
                      </div>
                      <div>
                         <p className="text-[11px] font-black text-white uppercase tracking-widest">Restoration Gap</p>
                         <p className="text-[10px] text-slate-500 mt-1 font-mono uppercase">Sentinel enforces 8 hours between shifts for adult associates to prevent fatigue leakage.</p>
                      </div>
                   </div>
                   <div className="flex items-start gap-4 p-4 hover:bg-slate-800/40 transition-colors rounded-xl group cursor-help">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20 group-hover:scale-110 transition-transform">
                         <AlertCircle className="w-4 h-4" />
                      </div>
                      <div>
                         <p className="text-[11px] font-black text-white uppercase tracking-widest">Overtime Mitigation</p>
                         <p className="text-[10px] text-slate-500 mt-1 font-mono uppercase">Predictive OT alerts trigger at 36.5 hours to allow 3.5 hour buffer for end-of-week reconciliation.</p>
                      </div>
                   </div>
                   <div className="flex items-start gap-4 p-4 hover:bg-slate-800/40 transition-colors rounded-xl group cursor-help">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20 group-hover:scale-110 transition-transform">
                         <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                         <p className="text-[11px] font-black text-white uppercase tracking-widest">Audit Readiness</p>
                         <p className="text-[10px] text-slate-500 mt-1 font-mono uppercase">Full digital trail maintained for 7 years per federal retention policy. Exportable via Sentinel D365 Bridge.</p>
                      </div>
                   </div>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between mt-8">
                 <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Linter State: NOMINAL</span>
                 </div>
                 <button 
                  onClick={handleDownloadPolicy}
                  disabled={isDownloading}
                  className="text-[9px] font-black text-blue-400 uppercase tracking-widest hover:text-blue-300 transition-colors flex items-center gap-2 disabled:opacity-50"
                 >
                    {isDownloading ? <Loader2 className="w-3 h-3 animate-spin" /> : <ChevronRight className="w-3 h-3" />}
                    Download Policy Frame
                 </button>
              </div>
           </div>
        </div>

        {/* Expansion Map Visualization */}
        <div className="bg-slate-900 rounded-3xl p-12 border border-slate-800 relative overflow-hidden text-center">
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            <div className="relative z-10 max-w-2xl mx-auto">
               <Globe className="w-12 h-12 text-slate-800 mx-auto mb-6" />
               <h2 className="text-xl font-black text-white uppercase tracking-[0.2em] mb-4">Enterprise Rollout Architecture</h2>
               <p className="text-xs text-slate-500 font-mono leading-relaxed uppercase tracking-widest mb-10">
                  Node 5065 is the first jurisdictional anchor. Modular policy frames allow rapid sync with neighboring state regulations without system downtime.
               </p>
               <div className="flex items-center justify-center gap-6">
                  <div className="flex flex-col items-center gap-3">
                     <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-600/20 border border-blue-400/30">MI</div>
                     <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Deployed</span>
                  </div>
                  <div className="w-12 h-px bg-slate-800 relative">
                     <div className="absolute top-1/2 left-0 w-full h-px bg-blue-500/30 animate-pulse" />
                  </div>
                  <div className="flex flex-col items-center gap-3 opacity-30 grayscale">
                     <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500 font-black border border-slate-700">OH</div>
                     <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Phase 2</span>
                  </div>
                  <div className="w-12 h-px bg-slate-800" />
                  <div className="flex flex-col items-center gap-3 opacity-30 grayscale">
                     <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500 font-black border border-slate-700">IN</div>
                     <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Phase 3</span>
                  </div>
               </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Playbook;
