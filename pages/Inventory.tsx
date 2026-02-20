
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { INVENTORY_DATA, STORE_NUMBER } from '../constants';
import { Plus, Search, Filter, AlertTriangle, CheckCircle, X, Package, Loader2, ShoppingCart, ArrowRight, TrendingDown, Activity, AlertOctagon, Database, RefreshCw, Truck, ShieldCheck, Zap, Terminal } from 'lucide-react';
import { Product } from '../types';

const Inventory: React.FC = () => {
  const [items, setItems] = useState<Product[]>(INVENTORY_DATA);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(14);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Active Procurement State
  const [isReplenishing, setIsReplenishing] = useState(false);
  const [replenishmentStep, setReplenishmentStep] = useState<string>('');
  const [d365Logs, setD365Logs] = useState<string[]>([]);

  // Form State
  const [orderForm, setOrderForm] = useState({
    sku: '',
    quantity: '1',
    priority: 'Standard'
  });

  const handleNewOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API request to Dynamics 365 Supply Chain Management
    setTimeout(() => {
      setIsSubmitting(false);
      setPendingOrdersCount(prev => prev + 1);
      setIsOrderModalOpen(false);
      setSuccessMessage('Order Dispatched to Dynamics 365 Supply Chain');
      setShowSuccess(true);
      setOrderForm({ sku: '', quantity: '1', priority: 'Standard' });
      
      // Update item status locally if matched
      setItems(prev => prev.map(i => i.sku === orderForm.sku ? { ...i, status: 'Good' } : i)); // Optimistic update simulation

      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  const criticalCount = items.filter(i => i.status === 'Critical').length;
  const lowCount = items.filter(i => i.status === 'Low').length;

  const triggerActiveProcurement = () => {
    const targetItems = items.filter(i => i.status !== 'Good');
    if (targetItems.length === 0) return;

    setIsReplenishing(true);
    setD365Logs([]);
    
    const sequence = [
      "Initializing Dynamics 365 Supply Chain Handshake...",
      "Authenticating Secure Node #5065...",
      `Detected ${targetItems.length} SKUs below threshold...`,
      "Calculating Optimal Reorder Quantities (EOQ Model)...",
      "Checking Regional Warehouse Availability...",
      "Committing Purchase Order Batch #PO-D365-AUTO...",
      "Sync Complete. Logistics Chain Activated."
    ];

    let step = 0;
    const interval = setInterval(() => {
      if (step < sequence.length) {
        setReplenishmentStep(sequence[step]);
        setD365Logs(prev => [sequence[step], ...prev]);
        step++;
      } else {
        clearInterval(interval);
        setIsReplenishing(false);
        setPendingOrdersCount(prev => prev + targetItems.length);
        setSuccessMessage(`Auto-Replenished ${targetItems.length} Items via Dynamics 365`);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 4000);
      }
    }, 800);
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-auto text-gray-900 relative custom-scrollbar">
      <Header title="Inventory Management" subtitle={`Store #${STORE_NUMBER} • Asset Velocity & Stock Levels`} />
      
      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] animate-in slide-in-from-top-4 duration-300">
          <div className="bg-emerald-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-emerald-500">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-black uppercase tracking-widest">{successMessage}</span>
          </div>
        </div>
      )}

      {/* New Order Modal */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 text-slate-900">
            <div className="bg-[#002050] p-6 flex items-center justify-between">
              <h3 className="text-white font-bold text-xl flex items-center gap-3">
                <ShoppingCart className="w-6 h-6 text-blue-400" />
                Procurement Request
              </h3>
              <button onClick={() => setIsOrderModalOpen(false)} className="text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-full p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleNewOrder} className="p-8 space-y-5">
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
                 <Database className="w-5 h-5 text-blue-600 mt-0.5" />
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-800">Dynamics 365 Integration</p>
                    <p className="text-slate-500 text-xs font-medium leading-relaxed mt-1">
                      This request will be instantly synced with the Regional Supply Chain node. Approval is automated based on current OTB budget.
                    </p>
                 </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Target Asset (SKU/Name)</label>
                <select 
                  value={orderForm.sku}
                  onChange={(e) => setOrderForm({...orderForm, sku: e.target.value})}
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-sm"
                  required
                >
                  <option value="">Select an item...</option>
                  {items.map(item => (
                    <option key={item.sku} value={item.sku}>{item.name} ({item.sku})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Quantity</label>
                  <input 
                    type="number"
                    min="1"
                    value={orderForm.quantity}
                    onChange={(e) => setOrderForm({...orderForm, quantity: e.target.value})}
                    className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Order Priority</label>
                  <select 
                    value={orderForm.priority}
                    onChange={(e) => setOrderForm({...orderForm, priority: e.target.value})}
                    className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-sm"
                  >
                    <option value="Standard">Standard</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#002050] hover:bg-[#003070] text-white font-black text-xs uppercase tracking-[0.2em] rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Syncing with ERP...
                    </>
                  ) : (
                    <>
                      Execute Order <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="p-8 max-w-7xl mx-auto space-y-6">
        
        {/* Active Procurement Engine Banner */}
        <div className="bg-[#002050] rounded-3xl p-8 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-blue-500/30">
           <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Truck className="w-64 h-64 text-white" />
           </div>
           
           <div className="relative z-10 flex items-center gap-6">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                 <RefreshCw className={`w-8 h-8 text-white ${isReplenishing ? 'animate-spin' : ''}`} />
              </div>
              <div className="max-w-xl">
                 <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-black text-white uppercase tracking-widest">Active Procurement Engine</h2>
                    <span className="px-2 py-0.5 bg-blue-600 rounded text-[9px] font-black text-white uppercase tracking-widest border border-blue-400/30">D365 Linked</span>
                 </div>
                 <p className="text-xs text-blue-200 leading-relaxed font-mono uppercase tracking-widest">
                    Automated Supply Chain Logic. Triggering this node will scan current inventory levels against the Dynamics 365 replenishment algorithm AND <span className="text-[#ff7a59] font-bold">HubSpot Breeze</span> demand signals to instantly place orders for Critical/Low stock.
                 </p>
              </div>
           </div>

           <div className="relative z-10 w-full md:w-auto flex flex-col gap-4">
              <button 
                onClick={triggerActiveProcurement}
                disabled={isReplenishing || (criticalCount === 0 && lowCount === 0)}
                className={`px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                   isReplenishing ? 'bg-slate-800 text-white cursor-wait' : 'bg-white text-[#002050] hover:bg-blue-50'
                }`}
              >
                 {isReplenishing ? (
                    <>
                       <Loader2 className="w-4 h-4 animate-spin" />
                       Processing...
                    </>
                 ) : (
                    <>
                       <Zap className="w-4 h-4 fill-[#002050]" />
                       Auto-Replenish ({criticalCount + lowCount})
                    </>
                 )}
              </button>
           </div>
        </div>

        {/* D365 Live Logs */}
        {isReplenishing && (
           <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2 mb-2">
                 <Terminal className="w-4 h-4 text-emerald-500" />
                 <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Dynamics 365 Secure Stream</span>
              </div>
              <div className="font-mono text-[10px] text-slate-300 space-y-1 h-24 overflow-y-auto custom-scrollbar">
                 {d365Logs.map((log, i) => (
                    <div key={i} className="flex items-center gap-2">
                       <span className="text-slate-600">[{new Date().toLocaleTimeString()}]</span>
                       <span>{log}</span>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {/* Alerts Section */}
        {(criticalCount > 0 || lowCount > 0) && !isReplenishing && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
            <div className="p-2 bg-red-500 rounded-lg shadow-lg shadow-red-500/20">
                <AlertOctagon className="w-6 h-6 text-white" />
            </div>
            <div>
                <h3 className="text-sm font-black text-red-600 uppercase tracking-widest">Inventory Health Crash</h3>
                <p className="text-xs text-red-800 font-medium mt-1">
                    Variance detected: <span className="font-bold">-17.89%</span> vs Target. CSAT decline correlated with high stockout rate. Immediate supply chain intervention recommended.
                </p>
            </div>
            </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
             <div className="flex justify-between items-start mb-2">
                <p className="text-sm text-gray-500 uppercase tracking-widest font-black text-[9px]">Inventory Health</p>
                <TrendingDown className="w-4 h-4 text-red-500" />
             </div>
             <p className="text-2xl font-bold text-gray-900">72%</p>
             <p className="text-[10px] font-bold text-red-500 mt-1 uppercase tracking-wider">-11.36% Trend</p>
           </div>
           
           <div className="bg-white p-5 rounded-lg border border-red-200 shadow-sm bg-red-50/30">
             <div className="flex justify-between items-start mb-2">
                <p className="text-sm text-red-600 font-black uppercase tracking-widest text-[9px]">Critical Stockouts</p>
                <AlertTriangle className="w-4 h-4 text-red-600" />
             </div>
             <p className="text-2xl font-bold text-red-700">{criticalCount + 10}</p> 
             {/* Artificial inflation for 'dashboard' impact based on prompt context */}
             <p className="text-[10px] font-bold text-red-600 mt-1 uppercase tracking-wider">+4.5% Since Wk-1</p>
           </div>

           <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
             <div className="flex justify-between items-start mb-2">
                <p className="text-sm text-gray-500 uppercase tracking-widest font-black text-[9px]">Active Procurement</p>
                <Activity className="w-4 h-4 text-blue-500" />
             </div>
             <p className="text-2xl font-bold text-gray-900">{pendingOrdersCount}</p>
             <p className="text-[10px] font-bold text-blue-500 mt-1 uppercase tracking-wider">Syncing D365...</p>
           </div>
           
           <button 
             onClick={() => setIsOrderModalOpen(true)}
             className="bg-blue-600 p-5 rounded-lg border border-blue-700 shadow-lg text-white flex flex-col justify-center items-center cursor-pointer hover:bg-blue-700 transition-all active:scale-[0.98] group"
           >
              <div className="bg-white/20 p-2 rounded-lg mb-1 group-hover:bg-white/30 transition-colors">
                <Plus className="w-5 h-5" />
              </div>
              <span className="font-black uppercase tracking-[0.2em] text-[10px]">New Order</span>
           </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
           <div className="p-5 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h3 className="font-black text-gray-900 uppercase tracking-widest text-xs">Inventory Assets • Store 5065</h3>
              <div className="flex items-center gap-3">
                 <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input type="text" placeholder="Search products..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400 font-medium" />
                 </div>
                 <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 font-bold uppercase tracking-widest text-[10px]">
                    <Filter className="w-4 h-4" /> Filter
                 </button>
              </div>
           </div>
           
           <div className="overflow-x-auto">
             <table className="w-full text-sm text-left">
               <thead className="bg-gray-50 text-gray-500 font-black uppercase tracking-widest text-[10px] border-b border-gray-200">
                 <tr>
                   <th className="px-6 py-4">Product Name</th>
                   <th className="px-6 py-4">SKU</th>
                   <th className="px-6 py-4">Category</th>
                   <th className="px-6 py-4 text-center">Stock</th>
                   <th className="px-6 py-4 text-center">Reorder Pt</th>
                   <th className="px-6 py-4">Status</th>
                   <th className="px-6 py-4 text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                 {items.map((item) => (
                   <tr key={item.id} className="hover:bg-gray-50/50">
                     <td className="px-6 py-4 font-bold text-gray-900">{item.name}</td>
                     <td className="px-6 py-4 font-mono text-[10px] font-black text-gray-400">{item.sku}</td>
                     <td className="px-6 py-4">
                       <span className="px-2 py-1 rounded-lg bg-gray-100 text-gray-600 text-[10px] font-black uppercase tracking-widest">{item.category}</span>
                     </td>
                     <td className={`px-6 py-4 font-black text-center ${item.stock === 0 ? 'text-red-600' : 'text-gray-900'}`}>{item.stock}</td>
                     <td className="px-6 py-4 font-mono text-center text-gray-400 text-xs">{item.reorderPoint}</td>
                     <td className="px-6 py-4">
                       <div className="flex items-center gap-1.5">
                         {item.status === 'Good' && <CheckCircle className="w-4 h-4 text-green-500" />}
                         {item.status === 'Low' && <AlertTriangle className="w-4 h-4 text-orange-500" />}
                         {item.status === 'Critical' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                         <span className={`text-[10px] font-black uppercase tracking-widest
                           ${item.status === 'Good' ? 'text-green-700' : ''}
                           ${item.status === 'Low' ? 'text-orange-700' : ''}
                           ${item.status === 'Critical' ? 'text-red-700' : ''}
                         `}>{item.status}</span>
                       </div>
                     </td>
                     <td className="px-6 py-4 text-right">
                        <button className="text-blue-600 hover:text-blue-800 font-black text-[10px] uppercase tracking-widest">Edit</button>
                        <span className="mx-2 text-gray-300">|</span>
                        <button className="text-gray-500 hover:text-gray-700 font-black text-[10px] uppercase tracking-widest">History</button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
