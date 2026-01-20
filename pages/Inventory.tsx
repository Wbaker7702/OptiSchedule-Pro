
import React, { useState } from 'react';
import Header from '../components/Header';
import { INVENTORY_DATA } from '../constants';
import { Plus, Search, Filter, AlertTriangle, CheckCircle, X, Package, Loader2, ShoppingCart, ArrowRight } from 'lucide-react';

const Inventory: React.FC = () => {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(8);
  const [showSuccess, setShowSuccess] = useState(false);
  
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
      setShowSuccess(true);
      setOrderForm({ sku: '', quantity: '1', priority: 'Standard' });
      
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-auto text-gray-900 relative">
      <Header title="Inventory Management" subtitle="Track stock levels, orders, and quality control" />
      
      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 duration-300">
          <div className="bg-emerald-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-emerald-500">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-black uppercase tracking-widest">Order Dispatched to Supply Chain</span>
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
              <p className="text-slate-500 text-xs font-medium leading-relaxed">
                Initialize a new supply chain order. This request will be synced with <span className="text-blue-600 font-bold">Dynamics 365</span> for fulfillment.
              </p>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Target Asset (SKU/Name)</label>
                <select 
                  value={orderForm.sku}
                  onChange={(e) => setOrderForm({...orderForm, sku: e.target.value})}
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-sm"
                  required
                >
                  <option value="">Select an item...</option>
                  {INVENTORY_DATA.map(item => (
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
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
             <p className="text-sm text-gray-500 uppercase tracking-widest font-black text-[9px]">Total Catalog SKUs</p>
             <p className="text-2xl font-bold text-gray-900 mt-1">12,450</p>
           </div>
           <div className="bg-white p-5 rounded-lg border border-red-200 shadow-sm bg-red-50/30">
             <p className="text-sm text-red-600 font-black uppercase tracking-widest text-[9px]">Low Stock Threshold</p>
             <p className="text-2xl font-bold text-red-700 mt-1">23</p>
           </div>
           <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
             <p className="text-sm text-gray-500 uppercase tracking-widest font-black text-[9px]">Active Procurement</p>
             <p className="text-2xl font-bold text-gray-900 mt-1">{pendingOrdersCount}</p>
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
              <h3 className="font-black text-gray-900 uppercase tracking-widest text-xs">Inventory Assets</h3>
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
                   <th className="px-6 py-4">Status</th>
                   <th className="px-6 py-4 text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                 {INVENTORY_DATA.map((item) => (
                   <tr key={item.id} className="hover:bg-gray-50/50">
                     <td className="px-6 py-4 font-bold text-gray-900">{item.name}</td>
                     <td className="px-6 py-4 font-mono text-[10px] font-black text-gray-400">{item.sku}</td>
                     <td className="px-6 py-4">
                       <span className="px-2 py-1 rounded-lg bg-gray-100 text-gray-600 text-[10px] font-black uppercase tracking-widest">{item.category}</span>
                     </td>
                     <td className="px-6 py-4 font-black text-center">{item.stock}</td>
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
