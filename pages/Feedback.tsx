import React, { useState } from 'react';
import Header from '../components/Header';
import { INITIAL_FIELD_REPORTS, CURRENT_USER } from '../constants';
import { FieldReport } from '../types';
import { Send, AlertTriangle, CheckCircle, Clock, ShieldAlert, FileText, Activity } from 'lucide-react';

const Feedback: React.FC = () => {
  const [reports, setReports] = useState<FieldReport[]>(INITIAL_FIELD_REPORTS);
  const [formData, setFormData] = useState({
    category: 'Safety' as FieldReport['category'],
    urgency: 'Low' as FieldReport['urgency'],
    content: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.content.trim()) return;

    setIsSubmitting(true);

    // Simulate network delay
    setTimeout(() => {
      const newReport: FieldReport = {
        id: `rep-${Date.now()}`,
        author: CURRENT_USER,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        category: formData.category,
        urgency: formData.urgency,
        status: formData.urgency === 'Critical' ? 'Escalated' : 'Pending',
        content: formData.content
      };

      setReports(prev => [newReport, ...prev]);
      setFormData({ ...formData, content: '' });
      setIsSubmitting(false);
    }, 800);
  };

  const getUrgencyColor = (urgency: FieldReport['urgency']) => {
    switch (urgency) {
      case 'Critical': return 'text-red-500 border-red-500/50 bg-red-500/10';
      case 'High': return 'text-orange-500 border-orange-500/50 bg-orange-500/10';
      case 'Medium': return 'text-yellow-500 border-yellow-500/50 bg-yellow-500/10';
      case 'Low': return 'text-blue-500 border-blue-500/50 bg-blue-500/10';
      default: return 'text-slate-500 border-slate-500/50 bg-slate-500/10';
    }
  };

  const getUrgencyActiveColor = (urgency: FieldReport['urgency']) => {
    switch (urgency) {
      case 'Critical': return 'bg-red-500 text-white shadow-lg border-transparent';
      case 'High': return 'bg-orange-500 text-white shadow-lg border-transparent';
      case 'Medium': return 'bg-yellow-500 text-white shadow-lg border-transparent';
      case 'Low': return 'bg-blue-500 text-white shadow-lg border-transparent';
      default: return 'bg-slate-500 text-white shadow-lg border-transparent';
    }
  };

  const getStatusIcon = (status: FieldReport['status']) => {
    switch (status) {
      case 'Escalated': return <ShieldAlert className="w-4 h-4 text-red-500 animate-pulse" />;
      case 'Logged': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'Analyzing': return <Activity className="w-4 h-4 text-blue-500 animate-spin" />;
      default: return <Clock className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-auto relative text-gray-900">
      <Header title="Field Report" subtitle="Operative Feedback & Intelligence Collection" />

      <div className="p-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Submission Console */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-xl sticky top-8">
             <div className="flex items-center gap-4 mb-8">
                <div className="bg-blue-600/20 p-3 rounded-2xl border border-blue-600/30">
                    <FileText className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                    <h3 className="text-lg font-black text-white uppercase tracking-tighter">Submission Console</h3>
                    <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Encrypted Channel: Secure</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Report Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Safety', 'Asset', 'Process', 'Morale'].map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat as any })}
                      className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                        formData.category === cat
                          ? 'bg-blue-600 text-white border-blue-500'
                          : 'bg-slate-950 text-slate-500 border-slate-800 hover:border-slate-600'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Urgency Level</label>
                <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                  {['Low', 'Medium', 'High', 'Critical'].map(level => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFormData({ ...formData, urgency: level as any })}
                      className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                        formData.urgency === level
                          ? getUrgencyActiveColor(level as any)
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Observation Detail</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Describe the situation, asset ID, or suggestion in detail..."
                  rows={6}
                  className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none text-white font-mono text-xs placeholder-slate-700 resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#002050] hover:bg-[#003070] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                   <Activity className="w-4 h-4 animate-spin" />
                ) : (
                   <Send className="w-4 h-4" />
                )}
                {isSubmitting ? 'Transmitting...' : 'Submit Report'}
              </button>

            </form>
          </div>
        </div>

        {/* Live Feed */}
        <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-2">
               <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter flex items-center gap-3">
                  <Activity className="w-6 h-6 text-[#ff7a59]" /> Live Intelligence Feed
               </h3>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white px-3 py-1 rounded-full shadow-sm border border-slate-200">
                  Active Nodes: {reports.length}
               </span>
            </div>

            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all group relative overflow-hidden">
                   <div className={`absolute top-0 left-0 w-1 h-full ${
                      report.urgency === 'Critical' ? 'bg-red-500' :
                      report.urgency === 'High' ? 'bg-orange-500' :
                      report.urgency === 'Medium' ? 'bg-yellow-500' : 'bg-blue-500'
                   }`} />

                   <div className="flex items-start justify-between mb-4 pl-4">
                      <div className="flex items-center gap-3">
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                            report.category === 'Safety' ? 'bg-red-50 text-red-600' :
                            report.category === 'Asset' ? 'bg-blue-50 text-blue-600' :
                            report.category === 'Process' ? 'bg-purple-50 text-purple-600' : 'bg-slate-100 text-slate-600'
                         }`}>
                            {report.category[0]}
                         </div>
                         <div>
                            <p className="text-xs font-black text-slate-900 uppercase tracking-wide">{report.author}</p>
                            <p className="text-[10px] text-slate-500 font-mono">ID: {report.id} • {report.timestamp}</p>
                         </div>
                      </div>

                      <div className="flex items-center gap-3">
                         <div className={`px-3 py-1 rounded-lg border text-[10px] font-black uppercase tracking-widest ${getUrgencyColor(report.urgency)}`}>
                            {report.urgency} Priority
                         </div>
                         <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-widest">
                            {getStatusIcon(report.status)}
                            {report.status}
                         </div>
                      </div>
                   </div>

                   <div className="pl-4">
                      <p className="text-sm text-slate-700 leading-relaxed font-medium bg-slate-50 p-4 rounded-xl border border-slate-100">
                         {report.content}
                      </p>
                   </div>
                </div>
              ))}
            </div>
        </div>

      </div>
    </div>
  );
};

export default Feedback;
