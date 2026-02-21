import React, { useMemo, useState } from 'react';
import Header from '../components/Header';
import {
  Activity,
  Bot,
  CheckCircle2,
  KeyRound,
  Lock,
  RefreshCw,
  ScanLine,
  ServerCog,
  ShieldAlert,
  ShieldCheck,
  TriangleAlert
} from 'lucide-react';

type ControlStatus = 'healthy' | 'warning' | 'critical';

interface SecurityControl {
  id: string;
  domain: string;
  owner: string;
  coverage: number;
  status: ControlStatus;
  lastCheck: string;
}

interface SecurityIncident {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium';
  status: 'open' | 'triaged' | 'resolved';
  detectedAt: string;
}

const SECURITY_CONTROLS: SecurityControl[] = [
  { id: 'SEC-101', domain: 'Identity Hardening', owner: 'Entra ID', coverage: 99, status: 'healthy', lastCheck: '2m ago' },
  { id: 'SEC-204', domain: 'Endpoint Isolation', owner: 'Defender', coverage: 94, status: 'healthy', lastCheck: '5m ago' },
  { id: 'SEC-338', domain: 'D365 Access Guard', owner: 'Dynamics 365', coverage: 89, status: 'warning', lastCheck: '7m ago' },
  { id: 'SEC-412', domain: 'HubSpot API Shield', owner: 'Breeze Agent', coverage: 100, status: 'healthy', lastCheck: '1m ago' },
  { id: 'SEC-509', domain: 'Lateral Movement Watch', owner: 'Sentinel AI', coverage: 76, status: 'critical', lastCheck: '9m ago' }
];

const SECURITY_INCIDENTS: SecurityIncident[] = [
  { id: 'INC-8801', title: 'Abnormal token replay pattern in service account lane', severity: 'critical', status: 'open', detectedAt: '6m ago' },
  { id: 'INC-8797', title: 'Privileged D365 role elevation outside maintenance window', severity: 'high', status: 'triaged', detectedAt: '18m ago' },
  { id: 'INC-8770', title: 'Unusual outbound burst from non-prod analytics node', severity: 'medium', status: 'resolved', detectedAt: '1h ago' }
];

const EnterpriseSecurity: React.FC = () => {
  const [isZeroTrustEnabled, setIsZeroTrustEnabled] = useState(true);
  const [isAutoRemediationEnabled, setIsAutoRemediationEnabled] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScan, setLastScan] = useState('8m ago');

  const activeIncidents = SECURITY_INCIDENTS.filter((incident) => incident.status !== 'resolved');
  const criticalIncidents = activeIncidents.filter((incident) => incident.severity === 'critical').length;

  const postureScore = useMemo(() => {
    const controlScore = SECURITY_CONTROLS.reduce((sum, control) => {
      if (control.status === 'healthy') return sum + 18;
      if (control.status === 'warning') return sum + 11;
      return sum + 5;
    }, 0);

    const trustBonus = isZeroTrustEnabled ? 6 : 0;
    const remediationBonus = isAutoRemediationEnabled ? 4 : 0;
    return Math.min(100, controlScore + trustBonus + remediationBonus);
  }, [isAutoRemediationEnabled, isZeroTrustEnabled]);

  const runPostureScan = () => {
    if (isScanning) return;
    setIsScanning(true);

    window.setTimeout(() => {
      setIsScanning(false);
      setLastScan('just now');
    }, 1500);
  };

  const controlStatusClass: Record<ControlStatus, string> = {
    healthy: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    warning: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    critical: 'text-red-400 bg-red-500/10 border-red-500/20'
  };

  return (
    <div className="flex-1 bg-[#020617] overflow-auto custom-scrollbar text-slate-200">
      <Header
        title="Microsoft Sentinel AI Enterprise Security"
        subtitle="Zero-trust posture matrix • Azure + Sentinel + Dynamics 365"
      />

      <div className="p-8 max-w-7xl mx-auto space-y-8 pb-24">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <article className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-2">Security Posture Score</p>
            <div className="flex items-end justify-between">
              <h2 className="text-5xl font-black text-white">{postureScore}</h2>
              <span className="text-[10px] text-emerald-400 font-black uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                Hardened
              </span>
            </div>
            <p className="text-[10px] mt-3 text-slate-500 font-mono uppercase">Microsoft Sentinel AI governance active</p>
          </article>

          <article className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-2">Active Incidents</p>
            <div className="flex items-center justify-between">
              <h2 className="text-5xl font-black text-white">{activeIncidents.length}</h2>
              <ShieldAlert className="w-8 h-8 text-amber-400" />
            </div>
            <p className="text-[10px] mt-3 text-slate-500 font-mono uppercase">
              {criticalIncidents} critical • triage queue monitored
            </p>
          </article>

          <article className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-2">Last Posture Scan</p>
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black text-white uppercase">{lastScan}</h2>
              <Activity className="w-8 h-8 text-blue-400" />
            </div>
            <p className="text-[10px] mt-3 text-slate-500 font-mono uppercase">Cross-plane telemetry validated</p>
          </article>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <article className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <header className="p-5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs text-white font-black uppercase tracking-widest">Control Coverage Matrix</h3>
              </div>
              <span className="text-[9px] text-slate-500 font-mono uppercase">5 controls monitored</span>
            </header>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-950 text-slate-500 text-[9px] font-black uppercase tracking-widest">
                  <tr>
                    <th className="px-5 py-3">Domain</th>
                    <th className="px-5 py-3">Owner</th>
                    <th className="px-5 py-3 text-center">Coverage</th>
                    <th className="px-5 py-3 text-center">Status</th>
                    <th className="px-5 py-3 text-right">Last Check</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-sm">
                  {SECURITY_CONTROLS.map((control) => (
                    <tr key={control.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-bold text-white">{control.domain}</p>
                        <p className="text-[10px] text-slate-500 font-mono uppercase">{control.id}</p>
                      </td>
                      <td className="px-5 py-4 text-slate-300">{control.owner}</td>
                      <td className="px-5 py-4 text-center text-slate-200 font-bold">{control.coverage}%</td>
                      <td className="px-5 py-4 text-center">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${controlStatusClass[control.status]}`}
                        >
                          {control.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right text-slate-500 font-mono text-[10px] uppercase">{control.lastCheck}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <div className="space-y-6">
            <article className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-400" />
                Enterprise Security Controls
              </h3>

              <button
                onClick={() => setIsZeroTrustEnabled((value) => !value)}
                className={`w-full p-3 rounded-xl border text-left transition-colors ${
                  isZeroTrustEnabled
                    ? 'bg-blue-500/10 border-blue-500/30 text-blue-200'
                    : 'bg-slate-950 border-slate-700 text-slate-400'
                }`}
              >
                <p className="text-[10px] font-black uppercase tracking-widest">Zero-Trust Routing</p>
                <p className="text-[10px] mt-1 font-mono uppercase">{isZeroTrustEnabled ? 'enabled' : 'disabled'}</p>
              </button>

              <button
                onClick={() => setIsAutoRemediationEnabled((value) => !value)}
                className={`w-full p-3 rounded-xl border text-left transition-colors ${
                  isAutoRemediationEnabled
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                    : 'bg-slate-950 border-slate-700 text-slate-400'
                }`}
              >
                <p className="text-[10px] font-black uppercase tracking-widest">Auto-Remediation</p>
                <p className="text-[10px] mt-1 font-mono uppercase">{isAutoRemediationEnabled ? 'armed' : 'manual only'}</p>
              </button>

              <button
                onClick={runPostureScan}
                disabled={isScanning}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:hover:bg-blue-600 text-white rounded-xl p-3 transition-colors flex items-center justify-center gap-2"
              >
                <ScanLine className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                  {isScanning ? 'Scanning...' : 'Run Sentinel Scan'}
                </span>
              </button>
            </article>

            <article className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-2">
                <Bot className="w-4 h-4 text-indigo-400" />
                AI Security Automation
              </h3>

              <div className="space-y-3 text-[10px] font-mono uppercase">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-2"><ServerCog className="w-3 h-3 text-slate-500" /> Azure Fabric</span>
                  <span className="text-emerald-400 font-bold">Synced</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-2"><KeyRound className="w-3 h-3 text-slate-500" /> Entra Keys</span>
                  <span className="text-emerald-400 font-bold">Rotating</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-2"><RefreshCw className="w-3 h-3 text-slate-500" /> Threat Models</span>
                  <span className="text-emerald-400 font-bold">Current</span>
                </div>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <p className="text-[9px] text-slate-500 font-mono uppercase leading-relaxed">
                  Sentinel AI is actively correlating telemetry from HubSpot, Dynamics 365, and Azure runtime events to block high-risk enterprise actions.
                </p>
              </div>
            </article>
          </div>
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <header className="p-5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
            <h3 className="text-xs text-white font-black uppercase tracking-widest flex items-center gap-2">
              <TriangleAlert className="w-4 h-4 text-amber-400" />
              Incident Queue
            </h3>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </header>

          <div className="divide-y divide-slate-800">
            {SECURITY_INCIDENTS.map((incident) => (
              <article key={incident.id} className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-white font-bold text-sm">{incident.title}</p>
                  <p className="text-[10px] font-mono uppercase text-slate-500 mt-1">
                    {incident.id} • detected {incident.detectedAt}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded border text-[9px] font-black uppercase tracking-widest ${
                      incident.severity === 'critical'
                        ? 'text-red-400 bg-red-500/10 border-red-500/20'
                        : incident.severity === 'high'
                          ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                          : 'text-blue-400 bg-blue-500/10 border-blue-500/20'
                    }`}
                  >
                    {incident.severity}
                  </span>
                  <span className="px-2 py-1 rounded border text-[9px] font-black uppercase tracking-widest text-slate-300 bg-slate-800 border-slate-700">
                    {incident.status}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default EnterpriseSecurity;
