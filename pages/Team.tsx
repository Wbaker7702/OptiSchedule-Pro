
import React, { useState } from 'react';
import Header from '../components/Header';
import { EMPLOYEES as INITIAL_EMPLOYEES, LABOR_REGULATIONS, CURRENT_STATE } from '../constants';
import { Mail, MoreHorizontal, Star, ChevronLeft, ChevronRight, UserPlus, X, ShieldCheck, Loader2, CheckCircle, Clock, AlertTriangle, Shield } from 'lucide-react';
import { Employee } from '../types';

const ITEMS_PER_PAGE = 8;

interface TeamProps {
  onEmployeeAdded?: () => void;
}

const Team: React.FC<TeamProps> = ({ onEmployeeAdded }) => {
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const reg = LABOR_REGULATIONS[CURRENT_STATE];

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    email: '',
    department: 'Front End',
    age: '25'
  });

  const totalPages = Math.ceil(employees.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentEmployees = employees.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const ageNum = parseInt(formData.age);
      const newEmployee: Employee = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        role: formData.role,
        email: formData.email,
        department: formData.department,
        status: 'Active',
        performance: 4.0,
        avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 1000000)}?w=100&h=100&fit=crop`,
        age: ageNum,
        isMinor: ageNum < 18
      };

      setEmployees(prev => [newEmployee, ...prev]);
      setIsSubmitting(false);
      setIsModalOpen(false);
      setShowSuccess(true);
      setFormData({ name: '', role: '', email: '', department: 'Front End', age: '25' });
      setCurrentPage(1);

      setTimeout(() => {
         if (onEmployeeAdded) onEmployeeAdded();
      }, 1500);

      setTimeout(() => setShowSuccess(false), 3000);
    }, 1200);
  };

  const getJurisdictionStatus = (emp: Employee) => {
    if (!emp.isMinor) return { label: 'Adult Standard', class: 'text-slate-400', icon: Shield };
    if (emp.age < 16) return { label: `Minor (14-15) • Curfew ${reg.curfewMinor1415}`, class: 'text-orange-500 font-black', icon: AlertTriangle };
    return { label: `Minor (16-17) • Curfew ${reg.curfewMinor1617}`, class: 'text-amber-500 font-black', icon: Clock };
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-auto relative font-mono">
      <Header title="Personnel Registry" subtitle={`Store #5065 • ${reg.state} Labor Framework Active`} />

      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 duration-300">
          <div className="bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-blue-500/30">
            <CheckCircle className="w-5 h-5 text-blue-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Asset Committed to Registry</span>
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

            <form onSubmit={handleAddEmployee} className="p-8 space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl mb-2 text-center">
                 <p className="text-[9px] text-blue-800 font-black uppercase tracking-widest">
                    Sentinel Linter will auto-apply {reg.state} constraints based on Age.
                 </p>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-3">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Full Name</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-2 bg-slate-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-600 outline-none font-bold text-xs" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Age</label>
                  <input type="number" required value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} className="w-full p-2 bg-slate-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-600 outline-none font-bold text-xs" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Position</label>
                <input type="text" required value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full p-2 bg-slate-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-600 outline-none font-bold text-xs" />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Operational Zone</label>
                <select value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} className="w-full p-2 bg-slate-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-600 outline-none font-bold text-xs">
                  <option value="Front End">Front End</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Grocery">Grocery</option>
                  <option value="Pharmacy">Pharmacy</option>
                  <option value="Apparel">Apparel</option>
                </select>
              </div>

              <div className="pt-4">
                <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-[#002050] hover:bg-slate-800 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-75">
                  {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Synchronizing...</> : <>Commit Asset to Registry</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
           <div>
             <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Jurisdictional Labor Roster</h2>
             <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">Watching {employees.length} vectors against {reg.state} P.A. 90</p>
           </div>
           <button onClick={() => setIsModalOpen(true)} className="px-6 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-700 shadow-xl shadow-blue-600/10 transition-all flex items-center gap-2">
             <UserPlus className="w-4 h-4" /> Initialize Personnel
           </button>
        </div>

        <div className="bg-white shadow-2xl rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono">
              <thead className="bg-slate-900 text-slate-400 font-black uppercase tracking-widest text-[9px] border-b border-gray-200">
                <tr>
                  <th className="px-6 py-5">Employee Signature</th>
                  <th className="px-6 py-5">Zone</th>
                  <th className="px-6 py-5 text-center">Age</th>
                  <th className="px-6 py-5">Jurisdiction Guard ({reg.state})</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentEmployees.map((employee) => {
                  const status = getJurisdictionStatus(employee);
                  const StatusIcon = status.icon;
                  
                  return (
                    <tr key={employee.id} className="hover:bg-slate-50 group transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                             <img src={employee.avatar} alt={employee.name} className="w-10 h-10 rounded-xl object-cover border border-gray-200" />
                             {employee.isMinor && <div className="absolute -top-2 -right-2 w-4 h-4 bg-orange-500 rounded-full border-2 border-white flex items-center justify-center text-[7px] font-black text-white">M</div>}
                          </div>
                          <div>
                            <p className="font-black text-gray-900 uppercase text-xs tracking-tight">{employee.name}</p>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{employee.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-500 text-[9px] font-black uppercase tracking-widest border border-slate-200">
                          {employee.department}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`text-sm font-black ${employee.isMinor ? 'text-orange-600' : 'text-slate-900'}`}>
                           {employee.age}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`flex items-center gap-2 text-[10px] uppercase tracking-widest ${status.class}`}>
                           <StatusIcon className="w-3 h-3" />
                           {status.label}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <button className="text-slate-400 hover:text-blue-600 transition-colors">
                           <MoreHorizontal className="w-5 h-5" />
                         </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-8 py-5 border-t border-gray-200 flex items-center justify-between bg-slate-50/50">
             <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Minor Alert Triggered</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Adult Standard</span>
                </div>
             </div>
             <div className="flex gap-2">
               <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-2 border border-gray-200 rounded-xl hover:bg-white disabled:opacity-30 transition-all"><ChevronLeft className="w-4 h-4" /></button>
               <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 border border-gray-200 rounded-xl hover:bg-white disabled:opacity-30 transition-all"><ChevronRight className="w-4 h-4" /></button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;
