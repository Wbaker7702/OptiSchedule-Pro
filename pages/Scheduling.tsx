
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { RefreshCw, Download, Zap, Edit2, AlertCircle, CheckCircle, X, History, User, CalendarDays, Loader2, CheckCircle2, TrendingUp, TrendingDown, Info, ShieldCheck, ChevronRight, BarChart3 } from 'lucide-react';
import { WEEKLY_HEATMAP, MOCK_SCHEDULE_LOGS, CURRENT_USER } from '../constants';
import { ScheduleLogEntry } from '../types';
import { GoogleGenAI, Type } from "@google/genai";

interface SchedulingProps {
  setCurrentView?: any;
  onFinalize?: any;
}

const Scheduling: React.FC<SchedulingProps> = () => {
  const [scheduleData, setScheduleData] = useState(WEEKLY_HEATMAP);
  const [logs, setLogs] = useState<ScheduleLogEntry[]>(MOCK_SCHEDULE_LOGS);
  
  // Live Simulation State
  const [demandOverlay, setDemandOverlay] = useState<number[][]>([]);
  const [activeHour, setActiveHour] = useState<number | null>(null);

  // Loading States
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isForecasting, setIsForecasting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showExportSuccess, setShowExportSuccess] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{day: string, hourIndex: number, hourLabel: string, currentValue: number} | null>(null);
  const [modificationType, setModificationType] = useState<'increase' | 'decrease'>('increase');
  const [modificationReason, setModificationReason] = useState('Call-Out Coverage');
  const [modificationNote, setModificationNote] = useState('');

  const hourLabels = ['6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00'];

  // Initialize and simulate live demand
  useEffect(() => {
    const initialDemand = WEEKLY_HEATMAP.map(row => 
      row.hours.map(h => Math.max(2, h + Math.floor((Math.random() - 0.5) * 4)))
    );
    setDemandOverlay(initialDemand);

    const interval = setInterval(() => {
      setDemandOverlay(prev => prev.map(row => 
        row.map(d => Math.max(1, Math.min(15, d + (Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0))))
      ));
      
      // Cycle "Active Hour" for visual effect
      const now = new Date();
      const currentH = now.getHours();
      if (currentH >= 6 && currentH <= 13) {
        setActiveHour(currentH - 6);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getCellStatus = (staff: number, demand: number) => {
    const diff = staff - demand;
    if (diff < -2) return 'critical';
    if (diff < 0) return 'under';
    if (diff > 3) return 'over';
    return 'optimal';
  };

  const getHeatmapColor = (staff: number, demand: number) => {
    const status = getCellStatus(staff, demand);
    switch (status) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/40 shadow-[inset_0_0_10px_rgba(239,68,68,0.1)]';
      case 'under': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'over': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'optimal': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[inset_0_0_10px_rgba(16,185,129,0.05)]';
      default: return 'bg-slate-800/50 text-slate-400 border-slate-700';
    }
  };

  const handleCellClick = (day: string, hourIndex: number, currentValue: number) => {
    setSelectedSlot({
      day,
      hourIndex,
      hourLabel: hourLabels[hourIndex],
      currentValue
    });
    setModificationType('increase');
    setModificationReason('Call-Out Coverage');
    setModificationNote('');
    setIsModalOpen(true);
  };

  const handleSaveModification = () => {
    if (!selectedSlot) return;

    const newValue = modificationType === 'increase' ? selectedSlot.currentValue + 1 : Math.max(0, selectedSlot.currentValue - 1);
    
    setScheduleData(prev => prev.map(row => {
      if (row.day === selectedSlot.day) {
        const newHours = [...row.hours];
        newHours[selectedSlot.hourIndex] = newValue;
        return { ...row, hours: newHours };
      }
      return row;
    }));

    const newLog: ScheduleLogEntry = {
      id: `SL-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      manager: CURRENT_USER,
      action: `${modificationType === 'increase' ? 'UP' : 'DOWN'} Staff @ ${selectedSlot.day} ${selectedSlot.hourLabel}`,
      reason: modificationReason,
      impact: modificationType === 'increase' ? 'Coverage +1' : 'Efficiency +2%'
    };

    setLogs(prev => [newLog, ...prev].slice(0, 10));
    setIsModalOpen(false);
  };

  const handleOptimize = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setScheduleData(prev => prev.map((row, rIdx) => {
        const optimizedHours = row.hours.map((h, cIdx) => {
          const demand = demandOverlay[rIdx]?.[cIdx] || h;
          if (h < demand) return demand;
          if (h > demand + 3) return demand + 2;
          return h;
        });
        return { ...row, hours: optimizedHours };
      }));

      const newLog: ScheduleLogEntry = {
        id: `SL-OPT-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        manager: 'Sentinel Optimizer',
        action: 'Synthetic Alignment',
        reason: 'Demand-Staff Equilibrium',
        impact: 'Zero Risk'
      };
      setLogs(prev => [newLog, ...prev]);
      setIsOptimizing(false);
    }, 1500);
  };

  const handleAIForecast = async () => {
    setIsForecasting(true);
    // Simulation of AI Forecast impact
    setTimeout(() => {
        addLog('AI Demand Model Loaded', 'system');
        setIsForecasting(false);
    }, 2000);
  };

  const addLog = (message: string, type: any) => {
     // Helper for quick logging
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setShowExportSuccess(true);
      setTimeout(() => setShowExportSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="flex-1 bg-[#020617] overflow-auto custom-scrollbar font-sans text-slate-200">
      
      <div className="p-8 flex justify-between items-center bg-slate-900/20 backdrop-blur-md border-b border-slate-800/50 sticky top-0 z-30">
        <div>
            <h1 className="text-2xl font-black text-white tracking-tighter uppercase">Scheduling Grid</h1>
            <p className="text-[10px] text-blue-400 font-mono mt-1 uppercase tracking-[0.2em] font-bold">Node #5065 • Live Demand Synthesis</p>
        </div>
        <div className="flex items-center gap-3">
            <button 
                onClick={handleOptimize}
                disabled={isOptimizing}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
            >
                {isOptimizing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />} 
                {isOptimizing ? 'Synthesizing...' : 'Run Optimizer'}
            </button>
            <button 
                onClick={handleAIForecast}
                disabled={isForecasting}
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
            >
                {isForecasting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5 fill-emerald-400/20" />}
                AI Demand Forecast
            </button>
        </div>
      </div>

      {showExportSuccess && (
        <div className="fixed top-28 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 duration-500">
           <div className="bg-emerald-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
              <div>
                 <p className="text-xs font-black uppercase tracking-widest text-white">Grid Exported</p>
                 <p className="text-[10px] font-mono opacity-80 uppercase text-white/80">Local File Synchronized</p>
              </div>
           </div>
        </div>
      )}

      {/* Adjustment Modal */}
      {isModalOpen && selectedSlot && (
        <div className="fixed inset-0 bg-[#020617]/90 z-[100] flex items-center justify-center p-6 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-slate-900 rounded-[2.5rem] shadow-2xl max-w-md w-full overflow-hidden border border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <div className="bg-slate-950 p-8 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/20">
                  <Edit2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-black text-sm uppercase tracking-[0.2em]">Adjust Staffing</h3>
                  <p className="text-slate-500 text-[10px] font-mono uppercase mt-1 font-bold">{selectedSlot.day} Node • {selectedSlot.hourLabel} Block</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white transition-colors bg-slate-900 p-2.5 rounded-xl hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-10 space-y-8">
              <div className="flex items-center justify-center gap-10 py-8 bg-slate-950/50 rounded-3xl border border-slate-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none"></div>
                <div className="text-center relative z-10">
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Current</p>
                  <div className="text-5xl font-black text-slate-600 tracking-tighter">{selectedSlot.currentValue}</div>
                </div>
                <div className="text-slate-700 animate-pulse"><ChevronRight className="w-8 h-8" /></div>
                <div className="text-center relative z-10">
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Adjusted</p>
                  <div className={`text-5xl font-black tracking-tighter ${modificationType === 'increase' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {modificationType === 'increase' ? selectedSlot.currentValue + 1 : Math.max(0, selectedSlot.currentValue - 1)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setModificationType('increase')}
                  className={`py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${modificationType === 'increase' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.15)]' : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'}`}
                >
                  Increment (+1)
                </button>
                <button 
                  onClick={() => setModificationType('decrease')}
                  className={`py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${modificationType === 'decrease' ? 'bg-red-500/10 border-red-500 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.15)]' : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'}`}
                >
                  Decrement (-1)
                </button>
              </div>

              <div className="space-y-4">
                <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 px-1">Audit Protocol Reason</label>
                    <select 
                    value={modificationReason}
                    onChange={(e) => setModificationReason(e.target.value)}
                    className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl focus:border-blue-500 outline-none font-bold text-xs text-white uppercase tracking-wider appearance-none shadow-inner"
                    >
                    <option value="Call-Out Coverage">Call-Out Coverage</option>
                    <option value="Demand Surge">Demand Surge</option>
                    <option value="Manager Discretion">Manager Discretion</option>
                    <option value="Training/Shadowing">Training Mode</option>
                    </select>
                </div>

                <input 
                  type="text"
                  value={modificationNote}
                  onChange={(e) => setModificationNote(e.target.value)}
                  placeholder="Verification ID or optional notes..."
                  className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl focus:border-blue-500 outline-none text-xs text-white placeholder-slate-700 font-mono shadow-inner"
                />
              </div>

              <button 
                onClick={handleSaveModification}
                className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black text-[11px] uppercase tracking-[0.3em] rounded-2xl shadow-2xl shadow-blue-600/30 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                Finalize Local Change
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-8 max-w-7xl mx-auto space-y-10 pb-24">
        
        {/* Main Heatmap Visualization */}
        <div className="bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-800 p-10 relative overflow-hidden backdrop-blur-sm">
           <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
              <CalendarDays className="w-64 h-64 text-white" />
           </div>
           
           <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-[0.2em] flex items-center gap-4">
                   <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                        <BarChart3 className="w-5 h-5 text-emerald-500" />
                   </div>
                   Staffing vs. Live Demand
                </h3>
                <p className="text-[10px] text-slate-500 font-mono mt-2 uppercase font-bold tracking-wider">Top Value: Assigned Staff • <span className="text-blue-400">Bottom Value: Forecast Demand</span></p>
              </div>
              <div className="flex bg-slate-950 p-4 rounded-[1.5rem] border border-slate-800 gap-6">
                 {[
                    { label: 'Critical', color: 'bg-red-500' },
                    { label: 'Under', color: 'bg-amber-500' },
                    { label: 'Optimal', color: 'bg-emerald-500' },
                    { label: 'Surplus', color: 'bg-blue-500' },
                 ].map(legend => (
                    <div key={legend.label} className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${legend.color} shadow-[0_0_8px_rgba(0,0,0,0.5)]`}></div> 
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{legend.label}</span>
                    </div>
                 ))}
              </div>
           </div>

           <div className="overflow-x-auto pb-4">
             <div className="min-w-[800px]">
               <div className="flex mb-6">
                 <div className="w-24"></div>
                 {hourLabels.map((h, i) => (
                   <div key={h} className={`flex-1 text-center text-[10px] font-black uppercase tracking-widest transition-colors ${activeHour === i ? 'text-blue-400' : 'text-slate-600'}`}>
                        {h}
                        {activeHour === i && <div className="w-1 h-1 bg-blue-500 rounded-full mx-auto mt-1 animate-pulse"></div>}
                   </div>
                 ))}
               </div>
               
               <div className="space-y-4">
                  {scheduleData.map((row, rIdx) => (
                    <div key={row.day} className="flex items-center gap-4 group">
                       <div className="w-24 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] group-hover:text-white transition-colors">{row.day}</div>
                       {row.hours.map((h, cIdx) => {
                          const demand = demandOverlay[rIdx]?.[cIdx] || h;
                          return (
                            <button 
                                key={cIdx} 
                                onClick={() => handleCellClick(row.day, cIdx, h)}
                                className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 rounded-[1.2rem] border transition-all duration-300 hover:scale-[1.05] active:scale-95 group/cell relative ${getHeatmapColor(h, demand)}`}
                            >
                                <span className="text-[13px] font-black tracking-tighter">{h}</span>
                                <div className="w-6 h-[1px] bg-white/10 my-0.5"></div>
                                <span className="text-[9px] font-mono font-bold opacity-60 group-hover/cell:opacity-100">{demand}</span>
                                
                                {h < demand && (
                                    <div className="absolute -top-1.5 -right-1.5 bg-red-500 w-4 h-4 rounded-full flex items-center justify-center shadow-lg border border-slate-900 animate-bounce">
                                        <AlertCircle className="w-2.5 h-2.5 text-white" />
                                    </div>
                                )}
                            </button>
                          );
                       })}
                    </div>
                  ))}
               </div>
             </div>
           </div>
        </div>

        {/* Audit & Intelligence Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Audit Trail */}
            <div className="lg:col-span-8 bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-800 overflow-hidden">
                <div className="p-8 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/20">
                            <History className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-white uppercase tracking-widest">Protocol Override Log</h3>
                            <p className="text-[9px] text-slate-500 font-mono mt-1 uppercase font-bold tracking-tighter">Manual adjustments recorded for node audit</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleExport}
                        disabled={isExporting}
                        className="px-5 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-[9px] font-black text-slate-400 hover:text-white uppercase tracking-widest transition-all flex items-center gap-2"
                    >
                        {isExporting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
                        Sync Data
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-950 text-slate-600 font-black uppercase tracking-widest text-[9px] border-b border-slate-800">
                        <tr>
                            <th className="px-8 py-5">Node Context</th>
                            <th className="px-8 py-5">Operator</th>
                            <th className="px-8 py-5">Override Action</th>
                            <th className="px-8 py-5 text-right">System Impact</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50 text-[10px] font-mono">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-blue-600/5 transition-colors group">
                            <td className="px-8 py-6 text-slate-500 group-hover:text-slate-300">
                                {log.timestamp}
                            </td>
                            <td className="px-8 py-6">
                                <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                                    <User className="w-3 h-3 text-slate-500 group-hover:text-white" />
                                </div>
                                <span className="font-bold text-slate-300 group-hover:text-blue-400 uppercase tracking-tighter">{log.manager}</span>
                                </div>
                            </td>
                            <td className="px-8 py-6">
                                <div className="flex flex-col gap-1">
                                    <span className="text-white font-bold uppercase tracking-tight">{log.action}</span>
                                    <span className="text-[8px] text-slate-600 font-black uppercase tracking-widest">{log.reason}</span>
                                </div>
                            </td>
                            <td className="px-8 py-6 text-right">
                                <div className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg inline-block font-black uppercase tracking-widest group-hover:bg-blue-500 group-hover:text-white transition-all">
                                    {log.impact}
                                </div>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Live Analytics Dashboard Sidebar */}
            <div className="lg:col-span-4 space-y-8">
                <div className="bg-slate-900 rounded-[2rem] p-8 border border-slate-800 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                        <TrendingUp className="w-32 h-32 text-blue-500" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-blue-500" /> Node Efficiency
                        </p>
                        
                        <div className="space-y-6">
                            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
                                <div className="flex justify-between items-end mb-3">
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Coverage Ratio</span>
                                    <span className="text-xs font-black text-emerald-400">94.2%</span>
                                </div>
                                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-[94.2%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                </div>
                            </div>

                            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
                                <div className="flex justify-between items-end mb-3">
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Labor Drift</span>
                                    <span className="text-xs font-black text-amber-400">+2.4h</span>
                                </div>
                                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-500 w-[15%] rounded-full"></div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-slate-800 grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-[9px] font-black text-slate-600 uppercase mb-1">Gaps Found</p>
                                <p className="text-2xl font-black text-white">12</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-slate-600 uppercase mb-1">OT Risk</p>
                                <p className="text-2xl font-black text-red-500">68h</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                        <Zap className="w-48 h-48 text-white fill-white" />
                    </div>
                    <div className="relative z-10">
                        <h4 className="text-lg font-black uppercase tracking-tighter mb-2">Demand Intelligence</h4>
                        <p className="text-[10px] text-blue-100 font-bold uppercase tracking-widest opacity-80 leading-relaxed">
                            HubSpot Breeze Ingress is projecting 14% higher traffic for Friday node.
                        </p>
                        <button 
                            onClick={handleOptimize}
                            className="mt-6 w-full py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all backdrop-blur-sm"
                        >
                            Sync Forecast
                        </button>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Scheduling;
