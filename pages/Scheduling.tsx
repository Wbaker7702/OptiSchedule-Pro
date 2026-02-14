
import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import { Calendar, RefreshCw, Link as LinkIcon, Check, X, ShieldCheck, Settings, Database, Users as UsersIcon, List, ArrowLeftRight, Activity, Globe, Server, Layers, Hexagon, AlertTriangle, ArrowRight, Share2, Loader2, FileText, Terminal, Zap, Sparkles, Fingerprint, Search, Shield, Info, UserCircle, Clock, Scale, Brain, XCircle, CheckCircle, TrendingUp, AlertOctagon, Truck, Lock, MessageSquare, Megaphone, UserMinus, Construction } from 'lucide-react';
import { View, ERPProvider, IntegrationStatus, HeatmapDataPoint } from '../types';
import { EMPLOYEES, LABOR_REGULATIONS, CURRENT_STATE, HEATMAP_DATA } from '../constants';
import { GoogleGenAI, Type } from "@google/genai";

interface SchedulingProps {
  setCurrentView?: (view: View) => void;
  onFinalize?: () => void;
  activeProvider: ERPProvider;
  setActiveProvider: (provider: ERPProvider) => void;
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
  setHubspotStatus: (status: IntegrationStatus) => void;
  heatmapData: HeatmapDataPoint[];
  onAdjustStaffing: () => void;
}

const Scheduling: React.FC<SchedulingProps> = ({ 
  setCurrentView, 
  onFinalize,
  activeProvider,
  setActiveProvider,
  isConnected,
  setIsConnected,
  setHubspotStatus,
  heatmapData,
  onAdjustStaffing
}) => {
  const [selectedProvider, setSelectedProvider] = useState<ERPProvider>('HubSpot'); 
  const [isModalOpen, setIsModalOpen] = useState(!isConnected);
  const [activeTab, setActiveTab] = useState<'heatmap' | 'logs'>('heatmap');
  const [syncProgress, setSyncProgress] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Finite Scheduling State
  const [localHeatmap, setLocalHeatmap] = useState<HeatmapDataPoint[]>(heatmapData);
  const [optimizing, setOptimizing] = useState(false);
  const [optimizationStep, setOptimizationStep] = useState('');
  const [activeDisruption, setActiveDisruption] = useState<{id: string, type: 'callout' | 'surge', title: string, desc: string} | null>(null);
  const [laborBudgetUsage, setLaborBudgetUsage] = useState(84); // %
  const [efficiencyScore, setEfficiencyScore] = useState(78); // %
  const [lastOptimized, setLastOptimized] = useState<string | null>(null);

  // Constraint & Knowledge Bridge State
  const [customRule, setCustomRule] = useState('');
  const [activeRule, setActiveRule] = useState<string | null>(null);
  const [conflictLogs, setConflictLogs] = useState<{id: string, msg: string, type: 'alert' | 'success'}[]>([]);
  const [isInjectingRule, setIsInjectingRule] = useState(false);
  
  // Backend Constraints Mock Status
  const [constraintStatus, setConstraintStatus] = useState({
      transport: 'Pending' as 'Pending' | 'Checking' | 'Enforced',
      separation: 'Pending' as 'Pending' | 'Checking' | 'Enforced',
      laborLaw: 'Pending' as 'Pending' | 'Checking' | 'Enforced'
  });

  const reg = LABOR_REGULATIONS[CURRENT_STATE];

  const handleBreezeDiscovery = () => {
    setIsScanning(true);
    setSyncProgress(0);
    const steps = ["Auth Handshake...", "Parsing HS Deals...", "Validating MI Labor Laws...", "Mapping Personas..."];
    let stepIdx = 0;
    
    const interval = setInterval(() => {
        if (stepIdx < steps.length) {
            setTerminalLogs(prev => [...prev, `[BZ] ${steps[stepIdx]}`]);
            setSyncProgress(prev => prev + 25);
            stepIdx++;
        } else {
            clearInterval(interval);
            setIsModalOpen(false);
            setIsConnected(true);
            setActiveProvider('HubSpot');
            setHubspotStatus('connected');
            setIsScanning(false);
        }
    }, 600);
  };

  const handleRunFiniteOptimization = async () => {
    setOptimizing(true);
    setConflictLogs([]); // Clear previous logs
    setConstraintStatus({ transport: 'Checking', separation: 'Checking', laborLaw: 'Checking' });
    
    // Simulate initial checks for UI feedback
    setOptimizationStep("Ingesting Forecast Data (HubSpot Breeze)...");
    await new Promise(r => setTimeout(r, 600));

    setOptimizationStep("Checking Hard Constraints (Transport Cap)...");
    setConstraintStatus(prev => ({ ...prev, transport: 'Enforced' }));
    await new Promise(r => setTimeout(r, 600));

    setOptimizationStep("Verifying Personnel Separation Protocols...");
    setConstraintStatus(prev => ({ ...prev, separation: 'Enforced' }));
    await new Promise(r => setTimeout(r, 600));

    setOptimizationStep(activeRule ? "Applying 'Rule of the Week' Override..." : "Standard Heuristics...");
    setConstraintStatus(prev => ({ ...prev, laborLaw: 'Enforced' }));

    setOptimizationStep("Optimizing for Peak Efficiency via Gemini...");

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
        
        const prompt = `
            Act as a Retail Scheduling Optimization Engine for Walmart Store #5065 in ${reg.state}.
            
            Current Constraints:
            1. Transport Cap: 300 Personnel.
            2. Personnel Separation: Smith != Jones.
            3. Labor Laws: ${reg.state} P.A. 90 (Minor Curfews).
            
            Active Manager Override Rule: "${activeRule || 'None'}".
            
            Task:
            Generate 3-4 short, technical "Conflict Resolution Logic" log messages that explain how the schedule was optimized. 
            One log MUST explicitly reference the Active Rule if it exists.
            
            Return ONLY a JSON array of objects with 'msg' (string) and 'type' (string: 'alert' or 'success').
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            msg: { type: Type.STRING },
                            type: { type: Type.STRING, enum: ['alert', 'success'] }
                        }
                    }
                }
            }
        });

        // Robust JSON parsing: sometimes models wrap JSON in markdown blocks despite config
        let cleanText = response.text || '[]';
        cleanText = cleanText.replace(/```json/g, '').replace(/```/g, '').trim();
        
        const generatedLogs = JSON.parse(cleanText);
        const formattedLogs = generatedLogs.map((l: any, i: number) => ({
            id: `gen-${i}`,
            msg: l.msg,
            type: l.type
        }));

        setConflictLogs(formattedLogs.length > 0 ? formattedLogs : [
            { id: '1', msg: "Conflict Resolved: Tuesday Roster capped at 298/300 to preserve Transport Capacity limit.", type: 'alert' },
            { id: '2', msg: "Protocol Enforced: Smith & Jones shifts separated by 4 hours per HR directive.", type: 'success' },
            { id: '3', msg: `Jurisdiction Guard: Zero minor curfew violations detected (${reg.state} P.A. 90).`, type: 'success' }
        ]);

    } catch (error) {
        console.error("Generative Optimization Failed:", error);
        // Fallback logs if API fails
        const fallbackLogs = [
            { id: '1', msg: "Conflict Resolved: Tuesday Roster capped at 298/300 to preserve Transport Capacity limit.", type: 'alert' as const },
            { id: '2', msg: "Protocol Enforced: Smith & Jones shifts separated by 4 hours per HR directive.", type: 'success' as const },
            { id: '3', msg: `Jurisdiction Guard: Zero minor curfew violations detected (${reg.state} P.A. 90).`, type: 'success' as const }
        ];
        if (activeRule) {
            fallbackLogs.push({ id: '4', msg: `Human Bridge Override: "${activeRule}" successfully prioritized in logic stack.`, type: 'success' as const });
        }
        setConflictLogs(fallbackLogs);
    } finally {
        setOptimizing(false);
        setEfficiencyScore(96);
        setLaborBudgetUsage(98); 
        setLastOptimized(new Date().toLocaleTimeString());
        
        // Update heatmap to show "perfect" alignment (Simulated effect of optimization)
        setLocalHeatmap(prev => prev.map(p => ({
            ...p,
            staffing: Math.ceil(p.transactionVolume / 12), 
            efficiency: 98
        })));
    }
  };

  const handleInjectRule = (e: React.FormEvent) => {
      e.preventDefault();
      if(!customRule) return;
      setIsInjectingRule(true);
      setTimeout(() => {
          setActiveRule(customRule);
          setCustomRule('');
          setIsInjectingRule(false);
      }, 1000);
  };

  const simulateDisruption = (type: 'callout' | 'surge') => {
    if (type === 'callout') {
        setActiveDisruption({
            id: 'd-01',
            type: 'callout',
            title: 'Unexpected Absence',
            desc: 'Staff Member: James Wilson (Stock Assoc). Shift: 2 PM - 10 PM.'
        });
        setEfficiencyScore(65);
        setLocalHeatmap(prev => prev.map(p => p.hour === '2 PM' || p.hour === '4 PM' ? {...p, staffing: Math.max(1, p.staffing - 1), efficiency: 55} : p));
    } else {
        setActiveDisruption({
            id: 'd-02',
            type: 'surge',
            title: 'Demand Spike Detected',
            desc: 'Breeze Signal: +45% Foot Traffic predicted at 4 PM due to local event.'
        });
        setEfficiencyScore(72);
        setLocalHeatmap(prev => prev.map(p => p.hour === '4 PM' ? {...p, transactionVolume: Math.floor(p.transactionVolume * 1.45), efficiency: 60} : p));
    }
  };

  const getHeatmapColorClass = (efficiency: number): string => {
    if (efficiency >= 85) return 'bg-emerald-500/5 border-emerald-500/20';
    if (efficiency >= 70) return 'bg-emerald-500/10 border-emerald-500/30';
    if (efficiency >= 50) return 'bg-amber-500/10 border-amber-500/30';
    if (efficiency >= 30) return 'bg-orange-500/10 border-orange-500/30';
    return 'bg-red-500/10 border-red-500/30';
  };

  const getEfficiencyBadgeClass = (efficiency: number): string => {
      if (efficiency >= 85) return 'bg-emerald-100 text-emerald-700';
      if (efficiency >= 70) return 'bg-emerald-100/80 text-emerald-600';
      if (efficiency >= 50) return 'bg-amber-100 text-amber-700';
      if (efficiency >= 30) return 'bg-orange-100 text-orange-700';
      return 'bg-red-100 text-red-700';
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-auto relative text-gray-900 custom-scrollbar">
      <Header title="Deployment Center" subtitle={`Scheduling Node Store #5065 • ${reg.state} Jurisdiction • Finite Logic Active`} />

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4 backdrop-blur-md">
            <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200">
                <div className={`p-8 flex items-center justify-between transition-colors duration-500 ${selectedProvider === 'HubSpot' ? 'bg-[#ff7a59]' : 'bg-[#002050]'}`}>
                    <div className="flex items-center gap-4">
                        <ShieldCheck className="w-8 h-8 text-white" />
                        <div>
                            <h3 className="text-white font-black text-2xl uppercase tracking-tighter">Breeze Protocol</h3>
                            <p className="text-white/70 text-[10px] font-mono uppercase tracking-widest">{reg.state} Labor Compliant Node</p>
                        </div>
                    </div>
                </div>
                
                <div className="p-10 text-center">
                    {!isScanning ? (
                        <>
                            <div className="mb-8">
                                <Sparkles className="w-12 h-12 text-[#ff7a59] mx-auto mb-4" />
                                <h4 className="text-xl font-black text-slate-900">Authorize HubSpot Sync</h4>
                                <p className="text-sm text-slate-500 mt-2">Discovering portal 'Walmart_MI_Ops_Sec'...</p>
                            </div>
                            <button 
                                onClick={handleBreezeDiscovery}
                                className="w-full py-5 bg-[#ff7a59] hover:bg-[#ff8f75] text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl shadow-xl transition-all flex items-center justify-center gap-4"
                            >
                                <Zap className="w-5 h-5 fill-white" /> Launch Breeze Discovery
                            </button>
                        </>
                    ) : (
                        <div className="space-y-6">
                            <div className="bg-slate-900 rounded-2xl p-6 font-mono text-[10px] text-orange-400 h-40 overflow-hidden text-left border border-orange-500/20 shadow-inner">
                                {terminalLogs.map((log, i) => (
                                    <div key={i} className="animate-in fade-in slide-in-from-bottom-1 truncate">
                                        <span className="opacity-30">BZ>></span> {log}
                                    </div>
                                ))}
                                <div ref={logEndRef} />
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                <div className="h-full bg-[#ff7a59] transition-all duration-300" style={{ width: `${syncProgress}%` }}></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}

      <div className="p-8 max-w-7xl mx-auto space-y-8 pb-24">
        
        {/* Top Control Panel */}
        <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="absolute top-0 left-0 p-8 opacity-5">
              <Brain className="w-64 h-64 text-white" />
           </div>
           
           <div className="relative z-10 flex items-center gap-6">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30">
                 {optimizing ? <Loader2 className="w-8 h-8 text-white animate-spin" /> : <Layers className="w-8 h-8 text-white" />}
              </div>
              <div>
                 <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
                    AI-Finite Schedule Logic
                    {activeDisruption && <span className="px-2 py-0.5 bg-red-500 text-white text-[9px] rounded animate-pulse">Action Required</span>}
                 </h2>
                 <p className="text-xs text-blue-200 font-mono mt-1 uppercase tracking-widest">
                    {optimizing ? optimizationStep : lastOptimized ? `Optimization Secure • Last Run: ${lastOptimized}` : "Ready to align labor vectors"}
                 </p>
              </div>
           </div>

           <div className="relative z-10 flex gap-6 text-center">
              <div>
                 <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Labor Budget</p>
                 <p className={`text-2xl font-black ${laborBudgetUsage > 100 ? 'text-red-500' : 'text-white'}`}>{laborBudgetUsage}%</p>
              </div>
              <div className="w-px bg-slate-800"></div>
              <div>
                 <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Efficiency</p>
                 <p className={`text-2xl font-black ${efficiencyScore < 70 ? 'text-orange-500' : 'text-emerald-500'}`}>{efficiencyScore}%</p>
              </div>
           </div>

           <button 
             onClick={handleRunFiniteOptimization}
             disabled={optimizing}
             className={`relative z-10 px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl transition-all flex items-center gap-3 active:scale-95 ${
                optimizing 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
                : activeDisruption ? 'bg-red-600 text-white animate-pulse' : 'bg-white text-slate-900 hover:bg-slate-100'
             }`}
           >
              {optimizing ? (
                 <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Calculating...
                 </>
              ) : (
                 <>
                    <Zap className="w-4 h-4 fill-current" />
                    {activeDisruption ? 'Resolve Conflict' : 'Auto-Optimize'}
                 </>
              )}
           </button>
        </div>

        {/* Hard Constraints & Human Knowledge Bridge */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Hard Constraint Engine */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b border-gray-100 bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-slate-600" />
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Hard Constraint Engine</h3>
                    </div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Backend Logic</span>
                </div>
                <div className="p-6 space-y-4 flex-1">
                    {/* Constraint 1: Transport Cap */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-4">
                            <Truck className="w-5 h-5 text-slate-500" />
                            <div>
                                <p className="text-xs font-bold text-gray-900">Transport Capacity Protocol</p>
                                <p className="text-[10px] text-gray-500 font-medium">Limit: 300 Personnel (Tuesday)</p>
                            </div>
                        </div>
                        <div className={`px-3 py-1 rounded text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${
                            constraintStatus.transport === 'Enforced' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'
                        }`}>
                            {constraintStatus.transport === 'Enforced' ? <CheckCircle className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                            {constraintStatus.transport}
                        </div>
                    </div>

                    {/* Constraint 2: Personnel Separation */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-4">
                            <UserMinus className="w-5 h-5 text-slate-500" />
                            <div>
                                <p className="text-xs font-bold text-gray-900">Personnel Separation</p>
                                <p className="text-[10px] text-gray-500 font-medium">Rule: Smith != Jones (Same Shift)</p>
                            </div>
                        </div>
                        <div className={`px-3 py-1 rounded text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${
                            constraintStatus.separation === 'Enforced' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'
                        }`}>
                            {constraintStatus.separation === 'Enforced' ? <CheckCircle className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                            {constraintStatus.separation}
                        </div>
                    </div>

                    {/* Constraint 3: Labor Laws */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-4">
                            <Scale className="w-5 h-5 text-slate-500" />
                            <div>
                                <p className="text-xs font-bold text-gray-900">Jurisdiction Compliance</p>
                                <p className="text-[10px] text-gray-500 font-medium">State: {reg.state} (P.A. 90)</p>
                            </div>
                        </div>
                        <div className={`px-3 py-1 rounded text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${
                            constraintStatus.laborLaw === 'Enforced' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'
                        }`}>
                            {constraintStatus.laborLaw === 'Enforced' ? <CheckCircle className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                            {constraintStatus.laborLaw}
                        </div>
                    </div>
                </div>
            </div>

            {/* Human Knowledge Bridge */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b border-gray-100 bg-indigo-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Brain className="w-5 h-5 text-indigo-600" />
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Human Knowledge Bridge</h3>
                    </div>
                    <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Manager Override</span>
                </div>
                
                <div className="p-6 flex-1 flex flex-col justify-between">
                    {activeRule ? (
                        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 mb-4 animate-in fade-in slide-in-from-bottom-2">
                            <div className="flex items-start justify-between mb-2">
                                <h4 className="text-xs font-black text-indigo-900 uppercase tracking-widest flex items-center gap-2">
                                    <Zap className="w-3 h-3 text-indigo-500" /> Active Rule
                                </h4>
                                <button onClick={() => setActiveRule(null)} className="text-[9px] font-bold text-slate-400 hover:text-red-500 transition-colors">REMOVE</button>
                            </div>
                            <p className="text-sm font-medium text-indigo-800">"{activeRule}"</p>
                            <p className="text-[10px] text-indigo-400 mt-2 font-mono uppercase">Injected into logic stack</p>
                        </div>
                    ) : (
                        <div className="mb-4">
                            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                                Enter a <span className="font-bold text-slate-700">"Rule of the Week"</span> to guide the AI. This injects human context into the optimization vector (e.g., "No overtime for Maintenance Team A this month").
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleInjectRule} className="relative">
                        <input 
                            type="text" 
                            disabled={!!activeRule}
                            value={customRule}
                            onChange={(e) => setCustomRule(e.target.value)}
                            placeholder={activeRule ? "Rule active..." : "Type rule here..."}
                            className="w-full bg-white border border-gray-200 rounded-xl py-4 pl-4 pr-32 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-50 disabled:text-gray-400"
                        />
                        <button 
                            type="submit"
                            disabled={!customRule || isInjectingRule || !!activeRule}
                            className="absolute right-2 top-2 bottom-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isInjectingRule ? <Loader2 className="w-3 h-3 animate-spin" /> : <Construction className="w-3 h-3" />}
                            Inject
                        </button>
                    </form>
                </div>
            </div>
        </div>

        {/* Conflict Alert System (Conditional Display) */}
        {conflictLogs.length > 0 && (
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl animate-in fade-in slide-in-from-top-4">
                <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center gap-2">
                    <AlertOctagon className="w-4 h-4 text-orange-500" />
                    <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Conflict Resolution Logic</h3>
                </div>
                <div className="p-6 space-y-3">
                    {conflictLogs.map((log) => (
                        <div key={log.id} className={`flex items-start gap-3 p-3 rounded-lg border ${
                            log.type === 'alert' ? 'bg-orange-500/10 border-orange-500/20' : 'bg-emerald-500/10 border-emerald-500/20'
                        }`}>
                            {log.type === 'alert' ? <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5" /> : <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5" />}
                            <p className={`text-xs font-mono font-medium ${
                                log.type === 'alert' ? 'text-orange-200' : 'text-emerald-200'
                            }`}>{log.msg}</p>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Heatmap Section */}
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
           <div className="flex justify-between items-center mb-8">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-3">
                 <Activity className="w-5 h-5 text-blue-600" />
                 Optimized Labor Heatmap
              </h3>
              <div className="flex gap-2">
                 <button onClick={() => simulateDisruption('callout')} className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded-lg text-[9px] font-black uppercase hover:bg-red-100 transition-colors">Simulate Call-out</button>
                 <button onClick={() => simulateDisruption('surge')} className="px-3 py-1.5 bg-orange-50 text-orange-600 border border-orange-100 rounded-lg text-[9px] font-black uppercase hover:bg-orange-100 transition-colors">Simulate Surge</button>
              </div>
           </div>

           <div className="overflow-x-auto">
              <div className="grid grid-cols-5 gap-4 min-w-[800px]">
                 {localHeatmap.map((point, i) => (
                    <div key={i} className={`rounded-xl p-4 border relative group hover:shadow-md transition-all ${getHeatmapColorClass(point.efficiency)}`}>
                       <div className="flex justify-between items-center mb-3">
                          <span className="text-xs font-bold text-gray-500">{point.hour}</span>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded ${getEfficiencyBadgeClass(point.efficiency)}`}>
                             {point.efficiency}% Eff
                          </span>
                       </div>
                       
                       <div className="space-y-3">
                          <div>
                             <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase mb-1">
                                <span>Traffic</span>
                                <span>{point.transactionVolume}</span>
                             </div>
                             <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500" style={{ width: `${Math.min(100, (point.transactionVolume/250)*100)}%` }}></div>
                             </div>
                          </div>
                          <div>
                             <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase mb-1">
                                <span>Staffing</span>
                                <span className={point.staffing < 5 ? 'text-red-500' : 'text-gray-600'}>{point.staffing} Active</span>
                             </div>
                             <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-slate-600" style={{ width: `${Math.min(100, (point.staffing/20)*100)}%` }}></div>
                             </div>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="flex justify-end pt-8">
           <button 
             onClick={onFinalize}
             className="px-8 py-4 bg-[#002050] hover:bg-slate-800 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl transition-all flex items-center gap-3 active:scale-95"
           >
              Finalize & Publish Schedule <ArrowRight className="w-4 h-4" />
           </button>
        </div>

      </div>
    </div>
  );
};

export default Scheduling;