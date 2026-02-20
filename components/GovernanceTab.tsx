import React from 'react';
import { FileText, Shield, CheckCircle, AlertCircle } from 'lucide-react';

const GovernanceTab: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Shield className="w-6 h-6 text-emerald-500" />
          Governance & Control Registry
        </h2>
        <p className="text-slate-400 mt-2 text-sm">
          Authoritative cross-reference and regulatory attestation records.
          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Issued 2026-01-31
          </span>
        </p>
      </div>

      {/* Appendix O */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-white">Appendix O — Control & Governance Cross-Reference</h3>
            <p className="text-slate-400 text-sm mt-1">Governance-Only Document</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold uppercase tracking-wider">
            SNT-OPS-5065-GOV-001
          </span>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Primary Control Authority</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Doc ID:</span>
                  <span className="text-white font-mono">SNT-OPS-5065-SOP-001</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Title:</span>
                  <span className="text-white text-right">Microsoft Sentinel × OptiSchedule Pro — Workforce Execution SOP</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Status:</span>
                  <span className="text-emerald-400 font-bold">v1.15 (FINAL)</span>
                </div>
              </div>
            </div>
            <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Linked Governance Record</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Doc ID:</span>
                  <span className="text-white font-mono">SNT-OPS-5065-SOP-002</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Title:</span>
                  <span className="text-white text-right">Regulatory Distribution & Receipt Log</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Status:</span>
                  <span className="text-blue-400 font-bold">ACTIVE</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/30">
            <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              Audit Interpretation Guidance
            </h4>
            <p className="text-slate-300 text-sm leading-relaxed">
              Auditors should evaluate SOP-001 for control design and operation. SOP-002 should be evaluated solely for regulatory notification evidence. Separation is intentional to preserve control immutability.
            </p>
          </div>
        </div>
      </div>

      {/* Appendix P */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-white">Appendix P — Quarterly Register Review Attestation</h3>
            <p className="text-slate-400 text-sm mt-1">Quarterly Document Control Register Review</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold uppercase tracking-wider">
            SNT-OPS-5065-GOV-002
          </span>
        </div>
        <div className="p-6">
          <div className="bg-slate-950/50 p-6 rounded-xl border border-slate-800/50 mb-6">
            <h4 className="text-sm font-bold text-white mb-4">Reviewer Attestation</h4>
            <p className="text-slate-300 text-sm italic mb-4">
              "I attest that the above documents are properly registered, current, and accurately reflected in the master Document Control Register. No unauthorized changes or superseded documents were identified during this review period."
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="border-t border-slate-700 pt-2">
                <p className="text-slate-500 text-xs uppercase">Role</p>
                <p className="text-white">Document Owner (Enterprise Ops Governance)</p>
              </div>
              <div className="border-t border-slate-700 pt-2">
                <p className="text-slate-500 text-xs uppercase">Date</p>
                <p className="text-white">2026-01-31</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Regulatory Packet Index */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h3 className="text-lg font-bold text-white">Regulatory Packet Index</h3>
          <p className="text-slate-400 text-sm mt-1">Workforce Execution Control Addendums</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-950 text-slate-500 font-black uppercase tracking-widest text-[10px]">
              <tr>
                <th className="px-6 py-4">Regulator</th>
                <th className="px-6 py-4">Document ID</th>
                <th className="px-6 py-4">Focus</th>
                <th className="px-6 py-4">Key Assertion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-sm text-slate-300">
              <tr className="hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4 font-bold text-white">SEC</td>
                <td className="px-6 py-4 font-mono text-xs text-slate-400">SNT-REG-SEC-001</td>
                <td className="px-6 py-4 text-xs">Financial Reporting Controls</td>
                <td className="px-6 py-4 text-xs text-slate-400">Prevents unauthorized operational deviations impacting labor expense recognition.</td>
              </tr>
              <tr className="hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4 font-bold text-white">DOJ</td>
                <td className="px-6 py-4 font-mono text-xs text-slate-400">SNT-REG-DOJ-001</td>
                <td className="px-6 py-4 text-xs">Compliance Program</td>
                <td className="px-6 py-4 text-xs text-slate-400">Continuous operation, automatic detection, and non-discretionary corrective action.</td>
              </tr>
              <tr className="hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4 font-bold text-white">FTC</td>
                <td className="px-6 py-4 font-mono text-xs text-slate-400">SNT-REG-FTC-001</td>
                <td className="px-6 py-4 text-xs">Fair Practices</td>
                <td className="px-6 py-4 text-xs text-slate-400">Uniform application across locations with no local discretion.</td>
              </tr>
              <tr className="hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4 font-bold text-white">OCC</td>
                <td className="px-6 py-4 font-mono text-xs text-slate-400">SNT-REG-OCC-001</td>
                <td className="px-6 py-4 text-xs">Operational Risk</td>
                <td className="px-6 py-4 text-xs text-slate-400">Risk reduction through centralized governance and continuous monitoring.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GovernanceTab;
