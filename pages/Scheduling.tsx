
import React, { useState } from 'react';
import Header from '../components/Header';
import { RefreshCw, Download, Zap, Edit2, AlertCircle, CheckCircle, X, History, User, CalendarDays, Loader2, CheckCircle2, BarChart3, Info, TrendingUp, TrendingDown, Target } from 'lucide-react';
import { WEEKLY_HEATMAP, WEEKLY_SALES_HEATMAP, MOCK_SCHEDULE_LOGS, CURRENT_USER, WEEKLY_STAFFING_REVIEWS } from '../constants';
import { ScheduleLogEntry, StaffingReviewItem } from '../types';
import { GoogleGenAI, Type } from "@google/genai";

interface SchedulingProps {
  setCurrentView?: any;
  onFinalize?: any;
  activeProvider?: any;
  setActiveProvider?: any;
  isConnected?: any;
  setIsConnected?: any;
  setHubspotStatus?: any;
  heatmapData?: any;
  onAdjustStaffing?: any;
}

const Scheduling: React.FC<SchedulingProps> = () => {
  const [scheduleData, setScheduleData] = useState(WEEKLY_HEATMAP);
  const [salesData] = useState(WEEKLY_SALES_HEATMAP);
  const [logs, setLogs] = useState<ScheduleLogEntry[]>(MOCK_SCHEDULE_LOGS);
  
  // View States
  const [viewMode, setViewMode] = useState<'staffing' | 'variance'>('staffing');
  const [hoveredSlot, setHoveredSlot] = useState<{day: string, hourIndex: number} | null>(null);

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

  const reviewStatusClass: Record<StaffingReviewItem['status'], string> = {
    'Queued': 'bg-slate-800 text-slate-400 border-slate-700',
    'In Review': 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    'Rule Updated': 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  };

  const getHeatmapColor = (value: number) => {
    if (value >= 10) return 'bg-[#0d9488] text-white hover:bg-[#0f766e] ring-1 ring-white/10'; // Dark Teal
    if (value >= 8) return 'bg-[#14b8a6] text-white hover:bg-[#0d9488] ring-1 ring-white/10'; // Teal
    if (value >= 6) return 'bg-[#2dd4bf] text-teal-950 hover:bg-[#14b8a6]'; // Light Teal
    if (value >= 4) return 'bg-[#99f6e4] text-teal-900 hover:bg-[#5eead4]'; // Very Light Teal
    return 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'; // Understaffed
  };

  const getSalesColor = (value: number) => {
    if (value >= 7000) return 'bg-red-600 text-white'; // Peak Sales
    if (value >= 5000) return 'bg-orange-500 text-white';
    if (value >= 3000) return 'bg-yellow-500 text-slate-900';
    if (value >= 1500) return 'bg-blue-400 text-white';
    return 'bg-blue-200 text-blue-900'; // Low Sales
  };

  const getGapMetric = (staff: number, sales: number) => {
    const demand = Math.ceil(sales / 500);
    const diff = staff - demand;
    if (diff < -2) return { label: 'CRITICAL UNDERSTAFFED', color: 'text-red-500', score: 20, icon: <TrendingUp className="w-3 h-3" /> };
    if (diff < 0) return { label: 'UNDERSTAFFED', color: 'text-orange-400', score: 60, icon: <TrendingUp className="w-3 h-3" /> };
    if (diff > 3) return { label: 'OVERSTAFFED', color: 'text-blue-400', score: 40, icon: <TrendingDown className="w-3 h-3" /> };
    return { label: 'OPTIMIZED', color: 'text-emerald-400', score: 95, icon: <CheckCircle className="w-3 h-3" /> };
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
      timestamp: new Date().toLocaleString(),
      manager: CURRENT_USER,
      action: `${modificationType === 'increase' ? 'Added' : 'Removed'} staff for ${selectedSlot.day} @ ${selectedSlot.hourLabel}`,
      reason: modificationReason + (modificationNote ? ` - ${modificationNote}` : ''),
      impact: modificationType === 'increase' ? 'Coverage +1' : 'Efficiency +2%'
    };

    setLogs(prev => [newLog, ...prev]);
    setIsModalOpen(false);
  };

  const handleOptimize = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setScheduleData(prev => prev.map(row => {
        const optimizedHours = row.hours.map((h, i) => {
          if (i >= 2 && i <= 6 && h < 5) return 5;
          if (h < 3) return 3;
          return h;
        });
        return { ...row, hours: optimizedHours };
      }));

      const newLog: ScheduleLogEntry = {
        id: `SL-OPT-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        manager: 'Defender Optimizer',
        action: 'Auto-Balanced Staffing Levels',
        reason: 'Coverage Compliance Check',
        impact: 'Risk Eliminated'
      };
      setLogs(prev => [newLog, ...prev]);
      setIsOptimizing(false);
    }, 1500);
  };

  const handleAIForecast = async () => {
    setIsForecasting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Generate a weekly staffing schedule heatmap for a retail store (Mon-Sun, 8 time slots from 6am to 1pm). 
        Traffic is projected to be heavy on Friday and Saturday. 
        Staffing levels per slot should range between 4 and 14. 
        Output strictly valid JSON matching this schema.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              heatmap: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    day: { type: Type.STRING },
                    hours: { 
                      type: Type.ARRAY,
                      items: { type: Type.INTEGER }
                    }
                  },
                  required: ["day", "hours"]
                }
              }
            }
          }
        }
      });

      const text = response.text;
      if (text) {
        const data = JSON.parse(text);
        if (data.heatmap && Array.isArray(data.heatmap)) {
          setScheduleData(data.heatmap);
          
          const newLog: ScheduleLogEntry = {
            id: `SL-AI-${Date.now()}`,
            timestamp: new Date().toLocaleString(),
            manager: 'Defender Assistant',
            action: 'Generated Demand Forecast',
            reason: 'High Traffic Probability',
            impact: 'Efficiency +14%'
          };
          setLogs(prev => [newLog, ...prev]);
        }
      }
    } catch (error) {
      console.error("Forecast Error:", error);
    } finally {
      setIsForecasting(false);
    }
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
      <Header title="Scheduling" subtitle="Workforce scheduling engine & coverage analysis" />

      {/* Export Success Toast */}
      {showExportSuccess && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 duration-500">
           <div className="bg-emerald-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
              <div>
                 <p className="text-xs font-black uppercase tracking-widest text-white">Schedule Exported</p>
                 <p className="text-[10px] font-mono opacity-80 uppercase text-white/80">Committed to local filesystem</p>
              </div>
           </div>
        </div>
      )}

      {/* Adjustment Modal */}
      {isModalOpen && selectedSlot && (
        <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-800">
            <div className="bg-slate-950 p-6 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-600/20">
                  <Edit2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-black text-sm uppercase tracking-widest">Modify Schedule</h3>
                  <p className="text-slate-500 text-[10px] font-mono uppercase">{selectedSlot.day} @ {selectedSlot.hourLabel}</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white transition-colors bg-slate-900 p-2 rounded-lg hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-center gap-8 py-4 bg-slate-950/50 rounded-xl border border-slate-800">
                <div className="text-center">
                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Current</p>
                  <div className="text-4xl font-black text-slate-400">{selectedSlot.currentValue}</div>
                </div>
                <div className="text-slate-600">→</div>
                <div className="text-center">
                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">New Level</p>
                  <div className={`text-4xl font-black ${modificationType === 'increase' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {modificationType === 'increase' ? selectedSlot.currentValue + 1 : Math.max(0, selectedSlot.currentValue - 1)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setModificationType('increase')}
                  className={`p-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${modificationType === 'increase' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'}`}
                >
                  Increase (+1)
                </button>
                <button 
                  onClick={() => setModificationType('decrease')}
                  className={`p-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${modificationType === 'decrease' ? 'bg-red-500/10 border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'}`}
                >
                  Decrease (-1)
                </button>
              </div>

              <div>
                <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Audit Reason Code</label>
                <select 
                  value={modificationReason}
                  onChange={(e) => setModificationReason(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl focus:border-blue-500 outline-none font-bold text-xs text-white uppercase tracking-wide appearance-none"
                >
                  <option value="Call-Out Coverage">Call-Out Coverage (Sick/Emergency)</option>
                  <option value="Demand Surge">Unplanned Demand Surge</option>
                  <option value="Manager Discretion">Manager Discretion</option>
                  <option value="Low Volume Cut">Low Volume Labor Cut</option>
                  <option value="Training/Shadowing">Training / Shadowing</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Additional Notes (Optional)</label>
                <input 
                  type="text"
                  value={modificationNote}
                  onChange={(e) => setModificationNote(e.target.value)}
                  placeholder="E.g., Approved by Regional..."
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl focus:border-blue-500 outline-none text-xs text-white placeholder-slate-600 font-mono"
                />
              </div>

              <button 
                onClick={handleSaveModification}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                Confirm Adjustment
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-8 max-w-7xl mx-auto space-y-8">
        
        <div className="flex justify-between items-center">
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button 
              onClick={() => setViewMode('staffing')}
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'staffing' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Staffing View
            </button>
            <button 
              onClick={() => setViewMode('variance')}
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'variance' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Variance Analysis
            </button>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={handleOptimize}
              disabled={isOptimizing}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white hover:border-slate-600 transition-all disabled:opacity-50"
            >
              {isOptimizing ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />} 
              {isOptimizing ? 'Optimizing...' : 'Optimize'}
            </button>
            <button 
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white hover:border-slate-600 transition-all disabled:opacity-50"
            >
               {isExporting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
               Export
            </button>
            <button 
              onClick={handleAIForecast}
              disabled={isForecasting}
              className="flex items-center gap-2 px-6 py-2 bg-[#0d9488] text-white rounded-lg text-xs font-black uppercase tracking-widest hover:bg-[#0f766e] shadow-lg shadow-teal-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
               {isForecasting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3 fill-white" />}
               {isForecasting ? 'Forecasting...' : 'AI Forecast'}
            </button>
          </div>
        </div>

        {/* Heatmap Section */}
        <div className="bg-slate-900 rounded-2xl shadow-lg border border-slate-800 p-8 relative overflow-hidden">
           <div className="mb-8 flex justify-between items-end">
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
                   {viewMode === 'staffing' ? <CalendarDays className="w-4 h-4 text-teal-400" /> : <BarChart3 className="w-4 h-4 text-blue-400" />}
                   {viewMode === 'staffing' ? 'Staffing Heatmap' : 'Variance Analysis: Staff vs. Sales'}
                </h3>
                <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase">
                  {viewMode === 'staffing' 
                    ? 'Staff coverage vs. projected demand. Click any cell to adjust.' 
                    : 'Overlaying labor allocation against peak revenue periods to identify leakage.'}
                </p>
              </div>
              <div className="flex gap-4">
                 {viewMode === 'staffing' ? (
                   <>
                     <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-sm bg-red-500/50 border border-red-500"></div> <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Under</span></div>
                     <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-sm bg-[#99f6e4]"></div> <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Light</span></div>
                     <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-sm bg-[#2dd4bf]"></div> <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Balanced</span></div>
                     <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-sm bg-[#0d9488] border border-white/20"></div> <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Heavy</span></div>
                   </>
                 ) : (
                   <>
                     <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-sm bg-blue-200"></div> <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Low Sales</span></div>
                     <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-sm bg-red-600"></div> <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Peak Sales</span></div>
                   </>
                 )}
              </div>
           </div>

           <div className="overflow-x-auto">
             <div className="min-w-[800px]">
               <div className="flex mb-3">
                 <div className="w-20"></div>
                 {hourLabels.map(h => (
                   <div key={h} className="flex-1 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">{h}</div>
                 ))}
               </div>
               
               <div className="space-y-4">
                  {scheduleData.map((row, rowIndex) => {
                    const salesRow = salesData[rowIndex];
                    return (
                      <div key={row.day} className="space-y-1">
                        <div className="flex items-center gap-3">
                          <div className="w-20 text-[10px] font-black text-slate-400 uppercase tracking-widest">{row.day}</div>
                          {row.hours.map((h, i) => {
                            const isHovered = hoveredSlot?.day === row.day && hoveredSlot?.hourIndex === i;
                            const salesValue = salesRow.sales[i];
                            const gap = getGapMetric(h, salesValue);

                            return (
                              <div 
                                key={i} 
                                className="flex-1 relative"
                                onMouseEnter={() => setHoveredSlot({day: row.day, hourIndex: i})}
                                onMouseLeave={() => setHoveredSlot(null)}
                              >
                                {viewMode === 'staffing' ? (
                                  <button 
                                    onClick={() => handleCellClick(row.day, i, h)}
                                    className={`w-full h-10 rounded-lg flex items-center justify-center text-xs font-black transition-all active:scale-95 cursor-pointer shadow-sm ${getHeatmapColor(h)} ${isHovered ? 'ring-2 ring-white z-10 scale-105' : ''}`}
                                  >
                                    {h}
                                  </button>
                                ) : (
                                  <div className="flex flex-col gap-1">
                                    <div className={`w-full h-6 rounded-t-lg flex items-center justify-center text-[9px] font-black transition-all ${getHeatmapColor(h)} ${isHovered ? 'ring-x-2 ring-t-2 ring-white z-10' : ''}`}>
                                      {h}
                                    </div>
                                    <div className={`w-full h-6 rounded-b-lg flex items-center justify-center text-[9px] font-black transition-all ${getSalesColor(salesValue)} ${isHovered ? 'ring-x-2 ring-b-2 ring-white z-10' : ''}`}>
                                      ${(salesValue/1000).toFixed(1)}k
                                    </div>
                                  </div>
                                )}

                                {isHovered && (
                                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-slate-950 border border-slate-800 rounded-xl p-3 shadow-2xl z-[100] animate-in fade-in slide-in-from-bottom-2 duration-200">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{row.day} @ {hourLabels[i]}</span>
                                      <div className={`flex items-center gap-1 text-[8px] font-black uppercase ${gap.color}`}>
                                        {gap.icon}
                                        {gap.label}
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <div className="flex justify-between items-center">
                                        <span className="text-[10px] text-slate-400">Staffing Level</span>
                                        <span className="text-xs font-black text-white">{h} Workers</span>
                                      </div>
                                      <div className="flex justify-between items-center">
                                        <span className="text-[10px] text-slate-400">Peak Sales</span>
                                        <span className="text-xs font-black text-emerald-400">${salesValue.toLocaleString()}/hr</span>
                                      </div>
                                      <div className="pt-2 border-t border-slate-800">
                                        <div className="flex justify-between items-center mb-1">
                                          <span className="text-[9px] font-black text-slate-500 uppercase">Optimization Score</span>
                                          <span className={`text-[10px] font-black ${gap.color}`}>{gap.score}%</span>
                                        </div>
                                        <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                                          <div className={`h-full transition-all duration-500 ${gap.score > 80 ? 'bg-emerald-500' : gap.score > 50 ? 'bg-orange-500' : 'bg-red-500'}`} style={{width: `${gap.score}%`}}></div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
               </div>
             </div>
           </div>
        </div>

        {/* Weekly Feedback Loop */}
        <div className="bg-slate-900 rounded-2xl shadow-lg border border-blue-500/20 overflow-hidden">
           <div className="p-6 border-b border-slate-800 bg-blue-500/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-600/10 border border-blue-500/20 rounded-xl">
                  <RefreshCw className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">Weekly System vs. Actual Review</h3>
                  <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase">
                    Compares generated schedules to final staffing, isolates manual adjustments, and feeds approved deltas back into automation rules.
                  </p>
                </div>
              </div>
              <div className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-[9px] font-black uppercase tracking-widest text-blue-300">
                Review cadence: Monday closeout
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
             {WEEKLY_STAFFING_REVIEWS.map((review) => (
               <div key={review.id} className="p-6 space-y-5">
                 <div className="flex items-start justify-between gap-4">
                   <div>
                     <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{review.id}</p>
                     <h4 className="text-sm font-black text-white mt-1">{review.week}</h4>
                   </div>
                   <span className={`px-2 py-1 rounded-lg border text-[8px] font-black uppercase tracking-widest whitespace-nowrap ${reviewStatusClass[review.status]}`}>
                     {review.status}
                   </span>
                 </div>

                 <div className="space-y-3 text-[10px] font-mono">
                   <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                     <p className="text-slate-500 uppercase font-black mb-1">System vs. Actual</p>
                     <p className="text-slate-300 leading-relaxed">{review.varianceSummary}</p>
                   </div>
                   <div className="grid grid-cols-2 gap-3">
                     <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                       <p className="text-slate-500 uppercase font-black mb-1">Overrides</p>
                       <p className="text-xl font-black text-white">{review.manualAdjustments}</p>
                     </div>
                     <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                       <p className="text-slate-500 uppercase font-black mb-1">Owner</p>
                       <p className="text-slate-300 font-bold">{review.owner}</p>
                     </div>
                   </div>
                   <div className="flex items-start gap-3">
                     <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                     <div>
                       <p className="text-slate-500 uppercase font-black">Manual Adjustment Driver</p>
                       <p className="text-slate-300 leading-relaxed mt-1">{review.primaryDriver}</p>
                     </div>
                   </div>
                   <div className="flex items-start gap-3">
                     <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                     <div>
                       <p className="text-slate-500 uppercase font-black">Rule Refinement Candidate</p>
                       <p className="text-slate-300 leading-relaxed mt-1">{review.automationRefinement}</p>
                     </div>
                   </div>
                 </div>
               </div>
             ))}
           </div>
        </div>

        {/* Audit Trail Section */}
        <div className="bg-slate-900 rounded-2xl shadow-lg border border-slate-800 overflow-hidden">
           <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex items-center gap-3">
              <History className="w-4 h-4 text-blue-500" />
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Schedule Audit Trail</h3>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5 uppercase">Log of recent manual overrides and adjustments</p>
              </div>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-950 text-slate-500 font-black uppercase tracking-widest text-[9px]">
                  <tr>
                    <th className="px-6 py-4">Timestamp</th>
                    <th className="px-6 py-4">Manager</th>
                    <th className="px-6 py-4">Action</th>
                    <th className="px-6 py-4">Reason Code</th>
                    <th className="px-6 py-4 text-right">Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-xs font-mono">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/50 transition-colors group">
                      <td className="px-6 py-4 text-slate-400 whitespace-nowrap">
                        {log.timestamp}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <User className="w-3 h-3 text-slate-500" />
                          <span className="font-bold text-white group-hover:text-blue-400 transition-colors">{log.manager}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-300">
                        {log.action}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded bg-slate-800 text-slate-400 text-[9px] font-black uppercase tracking-wide border border-slate-700">
                          {log.reason}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-blue-400 font-bold">
                        {log.impact}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           <div className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-800">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Total Scheduled Hours</p>
              <h2 className="text-3xl font-black text-white">2,847</h2>
              <p className="text-[10px] text-slate-600 font-mono mt-1 uppercase">This week</p>
           </div>
           
           <div className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-800">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Coverage Gaps</p>
              <h2 className="text-3xl font-black text-red-400">12</h2>
              <p className="text-[10px] text-slate-600 font-mono mt-1 uppercase">Critical understaffed slots</p>
           </div>

           <div className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-800">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Wasted Labor Hours</p>
              <h2 className="text-3xl font-black text-orange-400">42 hrs</h2>
              <p className="text-[10px] text-slate-600 font-mono mt-1 uppercase">Overstaffed periods</p>
           </div>

           <div className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-10">
                <Target className="w-12 h-12 text-emerald-500" />
              </div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Efficiency Ratio</p>
              <h2 className="text-3xl font-black text-emerald-400">92.4%</h2>
              <p className="text-[10px] text-slate-600 font-mono mt-1 uppercase">Labor vs. Revenue alignment</p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Scheduling;
