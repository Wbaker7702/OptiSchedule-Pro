
import React, { useState } from 'react';
import Header from '../components/Header';
import { PLUGIN_REGISTRY } from '../constants';
import { SystemPlugin } from '../types';
import { Zap, Database, Scale, Eye, Power, Loader2, Server, Globe, Cloud, Cpu, Network } from 'lucide-react';

const Marketplace: React.FC = () => {
  const [plugins, setPlugins] = useState<SystemPlugin[]>(PLUGIN_REGISTRY);
  const [mountingId, setMountingId] = useState<string | null>(null);

  const togglePlugin = (id: string) => {
    setMountingId(id);
    setTimeout(() => {
      setPlugins(prev => prev.map(p => {
        if (p.id === id) {
          return { ...p, status: p.status === 'Mounted' ? 'Available' : 'Mounted' };
        }
        return p;
      }));
      setMountingId(null);
    }, 1500);
  };

  const getIcon = (name: string, color: string) => {
    switch(name) {
      case 'Zap': return <Zap className={`w-6 h-6 ${color}`} />;
      case 'Database': return <Database className={`w-6 h-6 ${color}`} />;
      case 'Scale': return <Scale className={`w-6 h-6 ${color}`} />;
      case 'Eye': return <Eye className={`w-6 h-6 ${color}`} />;
      case 'Cloud': return <Cloud className={`w-6 h-6 ${color}`} />;
      default: return <Cpu className={`w-6 h-6 ${color}`} />;
    }
  };

  return (
    <div className="flex-1 bg-slate-950 overflow-auto custom-scrollbar">
      <Header title="Module Manager" subtitle="Hyperscale Plug-and-Play Hub" />

      <div className="p-8 max-w-7xl mx-auto space-y-8">
        
        {/* System Bus Status */}
        <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-5">
              <Network className="w-64 h-64 text-white" />
           </div>
           <div className="relative z-10 flex items-center gap-6">
              <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                 <Cpu className="w-10 h-10 text-blue-500" />
              </div>
              <div>
                 <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Integration Backbone</h2>
                 <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mt-1">Status: {plugins.filter(p => p.status === 'Mounted').length} Hot-Swappable Engines</p>
              </div>
           </div>
           <div className="relative z-10 flex gap-4">
              {['AZURE', 'D365', 'HS_BZ', 'SENT'].map(sock => (
                <div key={sock} className="px-3 h-12 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center shadow-inner">
                   <span className="text-[9px] font-black text-slate-600 tracking-tighter">{sock}</span>
                </div>
              ))}
           </div>
        </div>

        {/* Plugin Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plugins.map(plugin => {
            const isAzure = plugin.provider.includes('Azure');
            const isHubSpot = plugin.provider.includes('HubSpot');
            
            return (
              <div key={plugin.id} className={`bg-slate-900 rounded-2xl border p-6 transition-all relative overflow-hidden group ${
                plugin.status === 'Mounted' 
                  ? isAzure ? 'border-[#0078d4]/40 shadow-xl shadow-[#0078d4]/10' :
                    isHubSpot ? 'border-[#ff7a59]/40 shadow-xl shadow-[#ff7a59]/10' :
                    'border-blue-500/40 shadow-xl shadow-blue-500/5' 
                  : 'border-slate-800 opacity-80 hover:opacity-100'
              }`}>
                 <div className="flex justify-between items-start mb-6">
                    <div className={`p-3 rounded-xl ${
                        plugin.status === 'Mounted' 
                        ? isAzure ? 'bg-[#0078d4]/20' : isHubSpot ? 'bg-[#ff7a59]/20' : 'bg-blue-600/20' 
                        : 'bg-slate-950'
                    }`}>
                       {getIcon(plugin.iconName, 
                         plugin.status === 'Mounted' 
                         ? isAzure ? 'text-[#0078d4]' : isHubSpot ? 'text-[#ff7a59]' : 'text-blue-500' 
                         : 'text-slate-600'
                       )}
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${
                      plugin.status === 'Mounted' 
                      ? 'bg-emerald-500/10 text-emerald-500' 
                      : 'bg-slate-800 text-slate-500'
                    }`}>
                       {plugin.status}
                    </span>
                 </div>
                 
                 <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2">{plugin.name}</h3>
                 <p className="text-[10px] text-slate-500 font-mono leading-relaxed mb-6 uppercase">
                   {plugin.description}
                 </p>

                 <div className="flex items-center justify-between pt-6 border-t border-slate-800">
                    <div className="text-[9px] font-mono text-slate-600 uppercase">
                      v{plugin.version} • {plugin.provider}
                    </div>
                    <button 
                      onClick={() => togglePlugin(plugin.id)}
                      disabled={mountingId === plugin.id}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                        plugin.status === 'Mounted' 
                        ? 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20' 
                        : isAzure ? 'bg-[#0078d4] text-white' : isHubSpot ? 'bg-[#ff7a59] text-white' : 'bg-blue-600 text-white'
                      }`}
                    >
                      {mountingId === plugin.id ? (
                        <><Loader2 className="w-3 h-3 animate-spin" /> ...</>
                      ) : (
                        plugin.status === 'Mounted' ? <><Power className="w-3 h-3" /> Eject</> : <><Zap className="w-3 h-3" /> Mount</>
                      )}
                    </button>
                 </div>
                 
                 {plugin.status === 'Mounted' && (
                   <div className={`absolute bottom-0 left-0 right-0 h-1 ${
                     isAzure ? 'bg-[#0078d4]' : isHubSpot ? 'bg-[#ff7a59]' : 'bg-blue-600'
                   } shadow-[0_0_10px_rgba(0,0,0,0.5)]`} />
                 )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
