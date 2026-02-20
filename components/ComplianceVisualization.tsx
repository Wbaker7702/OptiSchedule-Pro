import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AUDIT_LOGS_MOCK } from '../constants';

const ComplianceVisualization: React.FC = () => {
  // Process data
  const categories = Array.from(new Set(AUDIT_LOGS_MOCK.map(log => log.type)));
  
  const data = categories.map(category => {
    const logs = AUDIT_LOGS_MOCK.filter(log => log.type === category);
    const total = logs.length;
    const passed = logs.filter(log => log.status === 'Passed').length;
    
    return {
      name: category,
      score: total > 0 ? Math.round((passed / total) * 100) : 0,
      passed,
      total
    };
  });

  return (
    <div className="bg-slate-900 rounded-2xl shadow-lg border border-slate-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-black text-white uppercase tracking-widest">Compliance Velocity</h3>
          <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase">Real-time regulatory adherence by category</p>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={true} stroke="#1e293b" />
            <XAxis type="number" domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} />
            <YAxis dataKey="name" type="category" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} width={100} />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
              itemStyle={{ color: '#e2e8f0', fontSize: '12px' }}
              formatter={(value: number) => [`${value}%`, 'Compliance Score']}
            />
            <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={24}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.score >= 90 ? '#10b981' : entry.score >= 70 ? '#f59e0b' : '#ef4444'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800">
        {data.map((cat) => (
            <div key={cat.name} className="text-center">
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">{cat.name}</p>
                <div className={`text-xl font-black ${cat.score >= 90 ? 'text-emerald-400' : cat.score >= 70 ? 'text-amber-400' : 'text-red-400'}`}>
                    {cat.score}%
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default ComplianceVisualization;
