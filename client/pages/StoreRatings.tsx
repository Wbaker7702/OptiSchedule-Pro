
import React, { useState } from 'react';
import Header from '../components/Header';
import { MOCK_STORES, StoreRatingData } from '../constants';
import { ChevronLeft, ChevronRight, Star, ShieldCheck, Activity, Users, Target, TrendingUp, BarChart3, MapPin, Search, Calendar, Award, Loader2 } from 'lucide-react';

const StoreRatings: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentStore = MOCK_STORES[currentIndex];
  const [isDownloading, setIsDownloading] = useState(false);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % MOCK_STORES.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + MOCK_STORES.length) % MOCK_STORES.length);
  };

  const handleDownloadAuditTrail = () => {
    setIsDownloading(true);
    
    setTimeout(() => {
      try {
        const timestamp = new Date().toLocaleString();
        const content = `
=========================================
SENTINEL NETWORK PERFORMANCE AUDIT
=========================================
NODE ID: #${currentStore.id}
LOCATION: ${currentStore.location}, ${currentStore.state}
TIMESTAMP: ${timestamp}
OVERALL RATING: ${currentStore.overallScore}/100
=========================================

OPERATIONAL PERFORMANCE MATRIX:
- Customer Experience: ${currentStore.customerExperience}%
- Operational Efficiency: ${currentStore.operationalEfficiency}%
- Labor Law Compliance: ${currentStore.laborCompliance}%
- Fiscal ROI: ${currentStore.fiscalROI}%
- Safety Score: ${currentStore.safetyScore}%

AUDIT TRAIL:
- Last Physical Audit: ${currentStore.lastAudit}
- Sentinel Sync: Verified
- Dynamics 365 Ledger: Reconciled
- HubSpot Signal Integrity: 98.2%

STATUS: NOMINAL
-----------------------------------------
(c) 2024 OptiSchedule Pro Enterprise Systems
        `.trim();

        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Audit_Trail_Store_${currentStore.id}_${Date.now()}.txt`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (err) {
        console.error("Audit Trail Download Failed:", err);
      } finally {
        setIsDownloading(false);
      }
    }, 1200);
  };

  const MetricBar = ({ label, value, icon: Icon, color }: { label: string, value: number, icon: any, color: string }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
        <div className="flex items-center gap-2 text-slate-400">
          <Icon className={`w-3 h-3 ${color}`} />
          {label}
        </div>
        <span className="text-white font-mono">{value}%</span>
      </div>
      <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800 shadow-inner">
        <div 
          className={`h-full ${color.replace('text-', 'bg-')} transition-all duration-700 ease-out shadow-[0_0_10px_rgba(0,0,0,0.5)]`} 
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="flex-1 bg-slate-950 overflow-auto custom-scrollbar font-mono">
      <Header title="Network Performance Node" subtitle="Store Rating Cycler • Regional Oversight Mode" />

      <div className="p-8 max-w-7xl mx-auto space-y-8 pb-24">
        
        {/* Store Navigator */}
        <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="absolute top-0 right-0 p-8 opacity-5">
              <MapPin className="w-48 h-48 text-white" />
           </div>

           <div className="flex items-center gap-6 relative z-10">
              <button 
                onClick={handlePrev}
                className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-slate-400 hover:text-white hover:border-blue-500/50 transition-all active:scale-90"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <div className="text-center md:text-left min-w-[200px]">
                 <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                    <span className="px-3 py-1 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                       Store ID: {currentStore.id}
                    </span>
                 </div>
                 <h2 className="text-4xl font-black text-white tracking-tighter uppercase">{currentStore.location}</h2>
                 <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Region: {currentStore.state} • Operational Pilot</p>
              </div>

              <button 
                onClick={handleNext}
                className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-slate-400 hover:text-white hover:border-blue-500/50 transition-all active:scale-90"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
           </div>

           <div className="relative z-10 flex flex-col items-center md:items-end">
              <div className="flex items-center gap-2 mb-2">
                 {[1, 2, 3, 4, 5].map((s) => (
                    <Star 
                      key={s} 
                      className={`w-4 h-4 ${s <= Math.round(currentStore.overallScore / 20) ? 'text-amber-400 fill-amber-400' : 'text-slate-800'}`} 
                    />
                 ))}
              </div>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Global Aggregate Rating</p>
           </div>
        </div>

        {/* Ratings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           {/* Left Column: Overall Summary */}
           <div className="lg:col-span-5 space-y-8">
              <div className="bg-slate-900 rounded-3xl p-8 border border-blue-500/30 shadow-2xl relative overflow-hidden group h-full">
                 <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                    <Award className="w-32 h-32 text-blue-400" />
                 </div>
                 
                 <div className="relative z-10 space-y-10">
                    <div>
                       <h3 className="text-xs font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                          <Activity className="w-4 h-4 text-blue-500" />
                          Executive Scorecard
                       </h3>
                       <div className="flex items-baseline gap-4">
                          <h2 className="text-7xl font-black text-white">{currentStore.overallScore}</h2>
                          <div className="flex flex-col">
                             <span className="text-emerald-400 font-black text-sm">/ 100</span>
                             <span className="text-slate-500 text-[10px] font-black uppercase">SENTINEL GRADE</span>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <MetricBar label="Customer Satisfaction" value={currentStore.customerExperience} icon={Users} color="text-amber-400" />
                       <MetricBar label="Operational Efficiency" value={currentStore.operationalEfficiency} icon={TrendingUp} color="text-blue-500" />
                       <MetricBar label="Labor Law Compliance" value={currentStore.laborCompliance} icon={ShieldCheck} color="text-emerald-500" />
                       <MetricBar label="Asset Safety Score" value={currentStore.safetyScore} icon={Target} color="text-red-500" />
                    </div>
                 </div>
              </div>
           </div>

           {/* Right Column: Deep Dive & Comparison */}
           <div className="lg:col-span-7 space-y-8">
              <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl h-full flex flex-col justify-between">
                 <div>
                    <h3 className="text-xs font-black text-white uppercase tracking-widest mb-8 flex items-center gap-2">
                       <BarChart3 className="w-4 h-4 text-[#ff7a59]" />
                       Fiscal Node Deep-Dive
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                       <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                          <p className="text-[9px] text-slate-500 uppercase font-black mb-1">Fiscal ROI Index</p>
                          <div className="flex items-center justify-between">
                             <h4 className="text-2xl font-black text-white">{currentStore.fiscalROI}%</h4>
                             <TrendingUp className="w-5 h-5 text-emerald-400" />
                          </div>
                          <p className="text-[8px] text-slate-600 font-bold uppercase mt-2">D365 Data Handshake: Validated</p>
                       </div>
                       <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                          <p className="text-[9px] text-slate-500 uppercase font-black mb-1">Audit Recency</p>
                          <div className="flex items-center justify-between">
                             <h4 className="text-2xl font-black text-white">{new Date(currentStore.lastAudit).toLocaleDateString()}</h4>
                             <Calendar className="w-5 h-5 text-blue-400" />
                          </div>
                          <p className="text-[8px] text-slate-600 font-bold uppercase mt-2">Cycle Threshold: Secure</p>
                       </div>
                    </div>

                    <div className="bg-[#ff7a59]/5 border border-[#ff7a59]/20 rounded-2xl p-6">
                       <div className="flex items-center gap-3 mb-4">
                          <Users className="w-5 h-5 text-[#ff7a59]" />
                          <h4 className="text-[10px] font-black text-white uppercase tracking-widest">HubSpot Breeze Feedback Feed</h4>
                       </div>
                       <div className="space-y-3">
                          <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/50 flex gap-3">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                             <p className="text-[10px] text-slate-400 leading-relaxed font-mono italic">"Checkout wait times improved by 14% since Sentinel AI schedule integration."</p>
                          </div>
                          <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/50 flex gap-3">
                             <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                             <p className="text-[10px] text-slate-400 leading-relaxed font-mono italic">"Staff availability matches traffic surges perfectly in {currentStore.location} node."</p>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="pt-8 border-t border-slate-800 flex items-center justify-between mt-8">
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                       <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Store Data Synced</span>
                    </div>
                    <button 
                      onClick={handleDownloadAuditTrail}
                      disabled={isDownloading}
                      className="text-[9px] font-black text-blue-400 uppercase tracking-widest hover:text-white transition-colors border-b border-blue-400/20 pb-0.5 flex items-center gap-2 disabled:opacity-50"
                    >
                       {isDownloading && <Loader2 className="w-3 h-3 animate-spin" />}
                       Download Audit Trail
                    </button>
                 </div>
              </div>
           </div>
        </div>

        {/* Global Network Comparison Placeholder */}
        <div className="bg-[#0078d4]/5 border border-[#0078d4]/20 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <ShieldCheck className="w-32 h-32 text-[#0078d4]" />
           </div>
           <div className="flex items-center gap-6 relative z-10">
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl backdrop-blur-md">
                 <Target className="w-8 h-8 text-blue-400" />
              </div>
              <div className="max-w-xl">
                 <h4 className="text-sm font-black text-white uppercase tracking-widest mb-2">Network Benchmarking Mode</h4>
                 <p className="text-xs text-slate-400 leading-relaxed font-mono uppercase tracking-tight">
                    This module allows you to cycle through every store in the <span className="text-blue-400 font-bold">Sentinel Network</span>. Ratings are compiled using real-time ingress from HubSpot and Dynamics 365, ensuring unbiased operational truth.
                 </p>
              </div>
           </div>
           
           <div className="relative z-10 flex gap-2">
              {MOCK_STORES.map((s, idx) => (
                 <button 
                   key={s.id}
                   onClick={() => setCurrentIndex(idx)}
                   className={`w-10 h-10 rounded-xl border font-black text-[10px] transition-all ${
                     currentIndex === idx 
                       ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' 
                       : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                   }`}
                 >
                   {idx + 1}
                 </button>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
};

export default StoreRatings;
