import React, { useState } from 'react';
import Header from '../components/Header';
import { EMPLOYEES as INITIAL_EMPLOYEES } from '../constants';
import { Mail, MoreHorizontal, Star, ChevronLeft, ChevronRight, UserPlus, X, ShieldCheck, Loader2, CheckCircle } from 'lucide-react';
import { Employee } from '../types';

const ITEMS_PER_PAGE = 5;

const Team: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    email: '',
    department: 'Front End'
  });

  const totalPages = Math.ceil(employees.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentEmployees = employees.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate Sentinel Personnel Handshake
    setTimeout(() => {
      const newEmployee: Employee = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        role: formData.role,
        email: formData.email,
        department: formData.department,
        status: 'Active',
        performance: 4.0,
        avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 1000000)}?w=100&h=100&fit=crop`
      };

      setEmployees([newEmployee, ...employees]);
      setIsSubmitting(false);
      setIsModalOpen(false);
      setShowSuccess(true);
      setFormData({ name: '', role: '', email: '', department: 'Front End' });
      setCurrentPage(1);

      setTimeout(() => setShowSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-auto relative">
      <Header title="Team Management" subtitle="Manage staff profiles, performance, and training" />

      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 duration-300">
          <div className="bg-[#002050] text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-blue-500/30">
            <CheckCircle className="w-5 h-5 text-blue-400" />
            <span className="text-xs font-black uppercase tracking-[0.2em]">Personnel Asset Initialized</span>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100">
            <div className="bg-slate-900 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <UserPlus className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-white font-black text-xs uppercase tracking-[0.2em]">Initialize Personnel</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEmployee} className="p-8 space-y-5">
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl mb-4">
                 <div className="flex gap-3">
                    <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                    <p className="text-[10px] text-blue-800 font-bold uppercase tracking-wide leading-relaxed">
                       Adding a new asset requires Sentinel authorization. Personnel will be added to the active registry with a baseline 4.0 rating.
                    </p>
                 </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 font-mono">Full Legal Name</label>
                <input 
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-sm text-gray-900"
                  placeholder="e.g. Michael Scott"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 font-mono">Corporate Position</label>
                <input 
                  type="text"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-sm text-gray-900"
                  placeholder="e.g. Lead Resource Agent"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 font-mono">Email Vector</label>
                <input 
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-sm text-gray-900"
                  placeholder="id@optischedule.com"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 font-mono">Operational Zone</label>
                <select 
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-sm text-gray-900"
                >
                  <option value="Front End">Front End</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Grocery">Grocery</option>
                  <option value="Apparel">Apparel</option>
                  <option value="Home Goods">Home Goods</option>
                  <option value="Pharmacy">Pharmacy</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#002050] hover:bg-slate-800 text-white font-black text-xs uppercase tracking-[0.2em] rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Syncing Registry...
                    </>
                  ) : (
                    <>Authorize & Add Asset</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <div className="p-8 max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
           <div>
             <h2 className="text-lg font-bold text-gray-900 uppercase tracking-tight">Staff Directory</h2>
             <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{employees.length} Active Personnel Assets</p>
           </div>
           <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-700 shadow-xl shadow-blue-600/10 transition-all flex items-center gap-2"
           >
             <UserPlus className="w-4 h-4" /> Initialize Personnel
           </button>
        </div>

        <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 font-black uppercase tracking-widest text-[10px] border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Position</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Performance</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50/50 group transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={employee.avatar} alt={employee.name} className="w-9 h-9 rounded-full object-cover bg-gray-200 border border-gray-100" />
                        <div>
                          <p className="font-bold text-gray-900">{employee.name}</p>
                          <p className="text-[10px] text-gray-500 font-medium">{employee.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-medium text-xs">{employee.role}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-600 border border-gray-200">
                        {employee.department}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border
                        ${employee.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : ''}
                        ${employee.status === 'On Leave' ? 'bg-amber-50 text-amber-700 border-amber-100' : ''}
                        ${employee.status === 'Training' ? 'bg-blue-50 text-blue-700 border-blue-100' : ''}
                      `}>
                        {employee.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-gray-900 font-black">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        {employee.performance}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button className="text-gray-400 hover:text-blue-600 p-1 rounded-full hover:bg-blue-50 transition-all">
                         <MoreHorizontal className="w-5 h-5" />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50/30">
             <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
                Displaying {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, employees.length)} of {employees.length} vectors
             </span>
             <div className="flex gap-2">
               <button 
                 onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                 disabled={currentPage === 1}
                 className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
               >
                 <ChevronLeft className="w-4 h-4" /> Prev
               </button>
               <button 
                 onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                 disabled={currentPage === totalPages}
                 className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
               >
                 Next <ChevronRight className="w-4 h-4" />
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;