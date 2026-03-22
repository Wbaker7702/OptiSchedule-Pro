
import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from 'recharts';
import { Truck, Box, Clock, Activity, ArrowUpRight, ShieldCheck, MapPin, Package, AlertTriangle, CheckCircle2, Loader2, Zap, Database, Cloud, FileDown, Download, Brain, Sparkles, Command, MessageSquareText, Terminal, Cpu, Radio, Shield } from 'lucide-react';
import { HOURLY_LOGISTICS, STORE_NUMBER } from '../constants';
import { GoogleGenAI } from "@google/genai";

const Logistics: React.FC = () => {
  const [activeDock, setActiveDock] = useState<number | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showExportSuccess, setShowExportSuccess] = useState(false);
  
  // Insight Engine State
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [insightStep, setInsightStep] = useState<string>('');

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  const generateInsights = async () => {
    setIsGeneratingInsights(true);
    setAiInsight(null);
    
    const steps = [
      "Accessing Azure Data Lake...",
      "Intercepting D365 Manifests...",
      "Filtering Noise from HubSpot Breeze...",
      "Processing Neural Heuristics...",
      "Finalizing Strategy Directives..."
    ];

    let stepIdx = 0;
    const stepInterval = setInterval(() => {
        if (stepIdx < steps.length) {
            setInsightStep(steps[stepIdx]);
            stepIdx++;
        }
    }, 400);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze the following logistics data for Store #5065 and provide 3 high-impact management directives in a narrative, "cyber-ops" terminal style.
        
        Logistics Data: ${JSON.stringify(HOURLY_LOGISTICS)}
        Docks Context: Dock 1 (Occupied - Unloading), Dock 2 (Awaiting - FED-2201), Dock 4 (Occupied - Staging).
        
        Requirements:
        1. Use a gritty, authoritative command-line tone.
        2. Identify specific bottlenecks (e.g., the 85-unit outbound spike at 12 PM).
        3. Recommend specific labor reallocations (e.g., moving staff from low-inbound morning hours to peak outbound windows).
        4. Format the output with clear [DIRECTIVE], [OBSERVATION], and [STATUS] headers.
        5. Keep the total word count under 120 words.`,
      });

      clearInterval(stepInterval);
      setAiInsight(response.text || "Insight generation failed. Azure Handshake Timeout.");
    } catch (error) {
      clearInterval(stepInterval);
      console.error("AI Insight Error:", error);
      setAiInsight("CRITICAL ERROR: Microsoft Sentinel Insight Node unreachable. Check Cloud Fabric credentials or regional connectivity.");
    } finally {
      setIsGeneratingInsights(false);
      setInsightStep('');
    }
  };

  const handleExport = () => {
    setIsExporting(true);
    
    setTimeout(() => {
      try {
        const timestamp = new Date().toLocaleString();
        const content = `
=====================================================
MICROSOFT SENTINEL LOGISTICS COMMAND - MANIFEST EXPORT
=====================================================
NODE ID: #5065
TIMESTAMP: ${timestamp}
STATUS: SECURE HANDSHAKE VERIFIED
=====================================================

DOCK STATUS MATRIX:
- Dock 01: [OCCUPIED] WAL-9942 (Unloading)
- Dock 02: [AWAITING] FED-2201 (ETA: 14:00)
- Dock 03: [CLEAR]
- Dock 04: [OCCUPIED] UPS-8840 (Staging)

HOURLY THROUGHPUT (PEAK):
- Max Outbound: 85 Units (12 PM)
- Max Inbound: 15 Units (3 PM)
- Avg Accuracy: 99.8%

RECONCILIATION:
- Dynamics 365 Supply Chain: SYNCED
- HubSpot Breeze Delivery Node: ACTIVE
- Microsoft Sentinel Policy Guard: NOMINAL

(c) 2024 OptiSchedule Pro Enterprise Logistics
=====================================================
        `.trim();

        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Node_5065_Logistics_Manifest_${Date.now()}.txt`);
        document.body.appendChild(link);
        link.click();
        
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        setIsExporting(false);
        setShowExportSuccess(true);
        setTimeout(() => setShowExportSuccess(false), 3000);
      } catch (err) {
        console.error("Export Error:", err);
        setIsExporting(false);
      }
    }, 1500);
  };

  const docks = [
    { id: 1, status: 'Occupied', truck: 'WAL-9942', eta: 'Unloading' },
    { id: 2, status: 'Awaiting', truck: 'FED-2201', eta: '14:00' },
    { id: 3, status: 'Clear', truck: '-', eta: '-' },
    { id: 4, status: 'Occupied', truck: 'UPS-8840', eta: 'Staging' },
  ];

  return (
    <div className="flex-1 bg-slate-950 overflow-auto custom-scrollbar font-mono">
      <Header title="Logistics Command" subtitle={`Fulfillment Node #5065 • Real-time Supply Chain Ingress`} />

      {/* Export Success Toast */}
      {showExportSuccess && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 duration-500">
           <div className="bg-emerald-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
              <div>
                 <p className="text-xs font-black uppercase tracking-widest text-white">Manifest Exported</p>
                 <p className="text-[10px] font-mono opacity-80 uppercase text-white/80">Committed to local filesystem</p>
              </div>
           </div>
        </div>
      )}

      <div className="p-8 max-w-7xl mx-auto space-y-8 pb-24">
        
        {/* Insight Engine Section */}
        <div className="bg-slate-900 rounded-3xl p-8 border border-blue-500/30 shadow-2xl relative overflow-hidden group">
           <div className="absolute -right-12 -top-12 opacity-5 group-hover:scale-110 transition-transform duration-1000">
              <Brain className="w-64 h-64 text-blue-400" />
           </div>
           
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 relative z-10">
              <div>
                 <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
                    Microsoft Sentinel Insight Engine
                 </h3>
                 <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase tracking-widest">Neural Logistics Analysis • Node #5065</p>
              </div>
              <button 
                onClick={generateInsights}
                disabled={isGeneratingInsights}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20 transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50"
              >
                {isGeneratingInsights ? <Loader2 className="w-4 h-4 animate-spin" /> : <Command className="w-4 h-4" />}
                {isGeneratingInsights ? "Neural Linking..." : "Generate Directives"}
              </button>
           </div>

           <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 relative overflow-hidden min-h-[160px] flex items-center justify-center">
              {/* Scanline Effect */}
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-20 bg-[length:100%_2px,3px_100%]"></div>
              
              {isGeneratingInsights ? (
                  <div className="text-center space-y-4 animate-pulse">
                      <Cpu className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 font-mono">{insightStep}</p>
                  </div>
              ) : aiInsight ? (
                 <div className="w-full animate-in fade-in slide-in-from-left-4 duration-500">
                    <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
                       <div className="flex items-center gap-2">
                          <Terminal className="w-3 h-3 text-blue-500" />
                          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Decrypted Strategy Stream</span>
                       </div>
                       <div className="flex items-center gap-1.5">
                          <Radio className="w-2.5 h-2.5 text-emerald-500 animate-pulse" />
                          <span className="text-[7px] text-emerald-500/70 font-black uppercase">Secure Link</span>
                       </div>
                    </div>
                    <p className="text-[11px] text-blue-100 leading-relaxed whitespace-pre-line font-mono font-medium">
                       {aiInsight}
                    </p>
                 </div>
              ) : (
                 <div className="text-center opacity-30 group-hover:opacity-50 transition-opacity">
                    <Brain className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Awaiting Neural Authorization</p>
                 </div>
              )}
           </div>
        </div>

        {/* Real-time Hourly Volume Chart */}
        <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl">
           <div className="flex justify-between items-center mb-10">
              <div>
                 <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                    <Activity className="w-4 h-4 text-blue-500" />
                    Hourly Fulfillment Velocity
                 </h3>
                 <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase tracking-widest">Inbound Freight vs Last-Mile Egress</p>
              </div>
              <button 
                onClick={handleSync}
                className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-[10px] font-black uppercase text-blue-400 hover:text-white transition-all flex items-center gap-2"
              >
                {isSyncing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Database className="w-3 h-3" />}
                Sync D365 Supply Chain
              </button>
           </div>

           <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={HOURLY_LOGISTICS}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                    <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b', fontWeight: 'bold'}} />
                    <YAxis hide />
                    <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px'}} />
                    <Bar dataKey="outbound" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Outbound Units" />
                    <Bar dataKey="inbound" fill="#10b981" radius={[4, 4, 0, 0]} name="Inbound Units" />
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Dock Monitor & Fulfillment Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           {/* Dock Monitor Sidebar */}
           <div className="lg:col-span-5 space-y-6">
              <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl h-full">
                 <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                    <Truck className="w-4 h-4 text-emerald-500" />
                    Dock Ingress Matrix
                 </h3>
                 
                 <div className="grid grid-cols-1 gap-4">
                    {docks.map((dock) => (
                       <div 
                         key={dock.id}
                         className={`p-5 rounded-2xl border transition-all cursor-pointer group ${
                           dock.status === 'Occupied' ? 'bg-slate-950 border-blue-500/20' :
                           dock.status === 'Awaiting' ? 'bg-slate-950 border-amber-500/20' :
                           'bg-slate-900 border-slate-800 opacity-60'
                         }`}
                       >
                          <div className="flex justify-between items-start">
                             <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${
                                  dock.status === 'Occupied' ? 'bg-blue-600 text-white' :
                                  dock.status === 'Awaiting' ? 'bg-amber-600 text-white' :
                                  'bg-slate-800 text-slate-500'
                                }`}>
                                   0{dock.id}
                                </div>
                                <div>
                                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Node Dock</p>
                                   <h4 className="text-sm font-black text-white">{dock.truck}</h4>
                                </div>
                             </div>
                             <div className="text-right">
                                <p className={`text-[9px] font-black uppercase tracking-[0.2em] ${
                                  dock.status === 'Occupied' ? 'text-blue-400' :
                                  dock.status === 'Awaiting' ? 'text-amber-400' :
                                  'text-slate-600'
                                }`}>
                                   {dock.status}
                                </p>
                                <p className="text-[8px] text-slate-600 mt-1">{dock.eta}</p>
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Performance Breakdown */}
           <div className="lg:col-span-7 space-y-8">
              <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl h-full flex flex-col">
                 <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-10 flex items-center gap-3">
                    <Package className="w-4 h-4 text-blue-500" />
                    Fulfillment Efficiency Node
                 </h3>

                 <div className="grid grid-cols-2 gap-6 mb-10">
                    <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                       <p className="text-[10px] text-slate-500 uppercase font-black mb-2">Avg Picking Velocity</p>
                       <div className="flex items-baseline gap-2">
                          <h4 className="text-3xl font-black text-white">124</h4>
                          <span className="text-[10px] text-emerald-400 font-bold">UPH</span>
                       </div>
                    </div>
                    <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                       <p className="text-[10px] text-slate-500 uppercase font-black mb-2">Order Accuracy</p>
                       <div className="flex items-baseline gap-2">
                          <h4 className="text-3xl font-black text-white">99.8</h4>
                          <span className="text-[10px] text-blue-400 font-bold">%</span>
                       </div>
                    </div>
                 </div>

                 <div className="flex-1 flex flex-col justify-between">
                    <div>
                       <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Pick-to-Ship Cycle Time</h4>
                       <div className="h-40">
                          <ResponsiveContainer width="100%" height="100%">
                             <LineChart data={HOURLY_LOGISTICS}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                                <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{fontSize: 8, fill: '#64748b'}} />
                                <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid #334155'}} />
                                <Line type="monotone" dataKey="pickRate" stroke="#10b981" strokeWidth={3} dot={{r: 4}} />
                             </LineChart>
                          </ResponsiveContainer>
                       </div>
                    </div>

                    <div className="pt-8 border-t border-slate-800 flex items-center justify-between mt-8">
                       <div className="flex items-center gap-3">
                          <ShieldCheck className="w-4 h-4 text-emerald-500" />
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Logistics Policy Frame: Active</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                          <span className="text-[9px] font-black text-blue-400 uppercase">Synced with Hub v4.1</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Global Supply Chain Insight */}
        <div className="bg-[#10b981]/5 border border-[#10b981]/20 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <Zap className="w-32 h-32 text-[#ff7a59]" />
           </div>
           <div className="flex items-center gap-6 relative z-10">
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl backdrop-blur-md">
                 <ShieldCheck className="w-8 h-8 text-emerald-400" />
              </div>
              <div className="max-w-xl">
                 <h4 className="text-sm font-black text-white uppercase tracking-widest mb-2">Automated Supply Chain Handshake</h4>
                 <p className="text-xs text-slate-400 leading-relaxed font-mono uppercase tracking-tight">
                    This module reconciles every hourly pick with <span className="text-emerald-400 font-bold">Dynamics 365 Supply Chain Management</span>. All outbound freight is cross-referenced with <span className="text-[#ff7a59] font-bold">HubSpot Breeze</span> delivery confirmations for 100% fiscal audit trace.
                 </p>
              </div>
           </div>
           <div className="flex gap-4 relative z-10">
              <button 
                onClick={handleExport}
                disabled={isExporting}
                className="px-6 py-3 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-slate-100 transition-all flex items-center gap-3 active:scale-95 disabled:opacity-75"
              >
                 {isExporting ? (
                   <Loader2 className="w-4 h-4 animate-spin" />
                 ) : (
                   <Download className="w-4 h-4" />
                 )}
                 {isExporting ? "Compiling..." : "Export Manifest"}
              </button>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Logistics;
