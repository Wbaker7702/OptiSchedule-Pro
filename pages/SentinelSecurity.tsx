
import React, { useState, useEffect } from 'react';
import {
  Shield, ShieldAlert, ShieldCheck, ShieldX, AlertTriangle, Activity, Eye, Lock,
  Wifi, Server, Database, Globe, Bug, UserX, Mail, Zap, Clock, Target, TrendingUp,
  TrendingDown, CheckCircle2, XCircle, AlertCircle, ArrowUpRight, ArrowDownRight,
  Search, Filter, RefreshCw, Bell, FileWarning, Network, Fingerprint, Radar,
  BarChart3, Cpu, Cloud, Key, Users, Layers, ChevronRight, ExternalLink, Scan
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, RadarChart, Radar as RechartsRadar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  SECURITY_THREATS, SECURITY_INCIDENTS, SECURITY_POLICIES, SECURITY_TIMELINE,
  COMPLIANCE_FRAMEWORKS, NETWORK_SEGMENTS, SENTINEL_SECURITY_STATS, SENTINEL_VERSION
} from '../constants';
import { SecurityThreat, SecurityIncident, ThreatSeverity, ThreatStatus } from '../types';

type SecurityTab = 'overview' | 'threats' | 'incidents' | 'compliance' | 'network' | 'policies';

const severityColor = (s: ThreatSeverity) => {
  switch (s) {
    case 'Critical': return { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30', dot: 'bg-red-500' };
    case 'High': return { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30', dot: 'bg-orange-500' };
    case 'Medium': return { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30', dot: 'bg-yellow-500' };
    case 'Low': return { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', dot: 'bg-blue-500' };
    case 'Info': return { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/30', dot: 'bg-slate-500' };
  }
};

const statusColor = (s: ThreatStatus) => {
  switch (s) {
    case 'Active': return { bg: 'bg-red-500/10', text: 'text-red-400', icon: AlertCircle };
    case 'Investigating': return { bg: 'bg-amber-500/10', text: 'text-amber-400', icon: Search };
    case 'Contained': return { bg: 'bg-blue-500/10', text: 'text-blue-400', icon: ShieldCheck };
    case 'Resolved': return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', icon: CheckCircle2 };
  }
};

const SentinelSecurity: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SecurityTab>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<ThreatSeverity | 'All'>('All');
  const [liveTime, setLiveTime] = useState(new Date());
  const [selectedThreat, setSelectedThreat] = useState<SecurityThreat | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setLiveTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const stats = SENTINEL_SECURITY_STATS;

  const filteredThreats = SECURITY_THREATS.filter(t => {
    const matchesSearch = searchQuery === '' ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === 'All' || t.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const filteredIncidents = SECURITY_INCIDENTS.filter(i => {
    const matchesSearch = searchQuery === '' ||
      i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const threatsBySeverity = [
    { name: 'Critical', value: SECURITY_THREATS.filter(t => t.severity === 'Critical').length, color: '#ef4444' },
    { name: 'High', value: SECURITY_THREATS.filter(t => t.severity === 'High').length, color: '#f97316' },
    { name: 'Medium', value: SECURITY_THREATS.filter(t => t.severity === 'Medium').length, color: '#eab308' },
    { name: 'Low', value: SECURITY_THREATS.filter(t => t.severity === 'Low').length, color: '#3b82f6' },
  ];

  const complianceRadarData = COMPLIANCE_FRAMEWORKS.map(f => ({
    subject: f.name.split(' ')[0],
    score: f.score,
    fullMark: 100,
  }));

  const tabs: { id: SecurityTab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Security Overview', icon: Shield },
    { id: 'threats', label: 'Threat Intelligence', icon: Radar },
    { id: 'incidents', label: 'Incidents', icon: AlertTriangle },
    { id: 'compliance', label: 'Compliance', icon: ShieldCheck },
    { id: 'network', label: 'Network Security', icon: Network },
    { id: 'policies', label: 'Security Policies', icon: Lock },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Top Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <StatCard icon={ShieldAlert} label="Threats Today" value={stats.totalThreatsToday} accent="text-red-400" bgAccent="bg-red-500/10" />
        <StatCard icon={ShieldCheck} label="Blocked" value={stats.threatsBlocked} accent="text-emerald-400" bgAccent="bg-emerald-500/10" />
        <StatCard icon={AlertTriangle} label="Active Incidents" value={stats.activeIncidents} accent="text-amber-400" bgAccent="bg-amber-500/10" />
        <StatCard icon={Clock} label="MTTD" value={stats.meanTimeToDetect} accent="text-blue-400" bgAccent="bg-blue-500/10" />
        <StatCard icon={Zap} label="Auto-Response" value={`${stats.automatedResponseRate}%`} accent="text-purple-400" bgAccent="bg-purple-500/10" />
        <StatCard icon={Target} label="Security Score" value={`${stats.securityScore}/100`} accent="text-cyan-400" bgAccent="bg-cyan-500/10" />
      </div>

      {/* Threat Timeline + Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900/80 rounded-xl border border-slate-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" /> Threat Activity Timeline (24h)
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">LIVE TELEMETRY</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={SECURITY_TIMELINE}>
              <defs>
                <linearGradient id="threatGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="blockedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#475569" fontSize={10} />
              <YAxis stroke="#475569" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '11px' }} />
              <Area type="monotone" dataKey="blocked" stroke="#10b981" fill="url(#blockedGradient)" strokeWidth={2} name="Blocked" />
              <Area type="monotone" dataKey="threats" stroke="#ef4444" fill="url(#threatGradient)" strokeWidth={2} name="Threats" />
              <Area type="monotone" dataKey="incidents" stroke="#f59e0b" fill="none" strokeWidth={2} strokeDasharray="5 5" name="Incidents" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-orange-400" /> Threat Distribution
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={threatsBySeverity} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                {threatsBySeverity.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '11px' }} />
              <Legend iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Active Incidents + Network Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> Active Incidents
            </h3>
            <button onClick={() => setActiveTab('incidents')} className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1">
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {SECURITY_INCIDENTS.filter(i => i.status === 'Active' || i.status === 'Investigating').slice(0, 4).map(incident => {
              const sc = statusColor(incident.status);
              const sv = severityColor(incident.severity);
              return (
                <div key={incident.id} className="bg-slate-950/60 rounded-lg p-3 border border-slate-800 hover:border-slate-700 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${sv.dot} animate-pulse`}></div>
                      <span className="text-xs font-bold text-white">{incident.title}</span>
                    </div>
                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${sv.bg} ${sv.text} border ${sv.border}`}>{incident.severity}</span>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] text-slate-500">
                    <span className="font-mono">{incident.id}</span>
                    <span>{incident.alertCount} alerts</span>
                    <span>{incident.affectedAssets} assets</span>
                    <span className={`${sc.text} font-bold`}>{incident.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Network className="w-4 h-4 text-cyan-400" /> Network Segments
            </h3>
            <button onClick={() => setActiveTab('network')} className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1">
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {NETWORK_SEGMENTS.map(seg => (
              <div key={seg.id} className="flex items-center justify-between bg-slate-950/60 rounded-lg p-3 border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${seg.status === 'Secure' ? 'bg-emerald-500' : seg.status === 'Warning' ? 'bg-amber-500 animate-pulse' : 'bg-red-500 animate-pulse'}`}></div>
                  <div>
                    <span className="text-xs font-semibold text-white">{seg.name}</span>
                    <div className="text-[10px] text-slate-500">{seg.firewallRules} rules active</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-bold uppercase ${seg.status === 'Secure' ? 'text-emerald-400' : seg.status === 'Warning' ? 'text-amber-400' : 'text-red-400'}`}>{seg.status}</span>
                  {seg.anomalies > 0 && <div className="text-[9px] text-red-400">{seg.anomalies} anomalies</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Compliance Quick View */}
      <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Compliance Posture
          </h3>
          <button onClick={() => setActiveTab('compliance')} className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1">
            Full Report <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {COMPLIANCE_FRAMEWORKS.map(fw => (
            <div key={fw.id} className="bg-slate-950/60 rounded-lg p-4 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-500 font-bold uppercase mb-2">{fw.name}</div>
              <div className={`text-2xl font-black ${fw.score >= 95 ? 'text-emerald-400' : fw.score >= 90 ? 'text-blue-400' : fw.score >= 85 ? 'text-amber-400' : 'text-red-400'}`}>{fw.score}%</div>
              <div className="text-[9px] text-slate-600 mt-1">{fw.passing}/{fw.controls} controls</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderThreats = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search threats by ID, title, or indicator..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:border-blue-500 transition-colors font-mono"
          />
        </div>
        <div className="flex items-center gap-2">
          {(['All', 'Critical', 'High', 'Medium', 'Low'] as const).map(s => (
            <button
              key={s}
              onClick={() => setSeverityFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-colors ${severityFilter === s ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {selectedThreat && (
        <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-5 animate-in slide-in-from-top-2">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${severityColor(selectedThreat.severity).bg} ${severityColor(selectedThreat.severity).text} border ${severityColor(selectedThreat.severity).border}`}>{selectedThreat.severity}</span>
                <span className="text-[10px] text-slate-500 font-mono">{selectedThreat.id}</span>
              </div>
              <h3 className="text-sm font-bold text-white">{selectedThreat.title}</h3>
            </div>
            <button onClick={() => setSelectedThreat(null)} className="text-slate-500 hover:text-white transition-colors">
              <XCircle className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-slate-400 mb-4 leading-relaxed">{selectedThreat.description}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-950/60 rounded-lg p-3 border border-slate-800">
              <div className="text-[9px] text-slate-500 uppercase font-bold mb-1">MITRE ATT&CK</div>
              <div className="text-[10px] text-orange-400 font-mono">{selectedThreat.mitreTactic}</div>
            </div>
            <div className="bg-slate-950/60 rounded-lg p-3 border border-slate-800">
              <div className="text-[9px] text-slate-500 uppercase font-bold mb-1">Source</div>
              <div className="text-[10px] text-white font-mono">{selectedThreat.source}</div>
            </div>
            <div className="bg-slate-950/60 rounded-lg p-3 border border-slate-800">
              <div className="text-[9px] text-slate-500 uppercase font-bold mb-1">Target</div>
              <div className="text-[10px] text-white font-mono">{selectedThreat.target}</div>
            </div>
            <div className="bg-slate-950/60 rounded-lg p-3 border border-slate-800">
              <div className="text-[9px] text-slate-500 uppercase font-bold mb-1">Confidence</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-slate-800 rounded-full h-1.5">
                  <div className={`h-1.5 rounded-full ${selectedThreat.confidenceScore >= 90 ? 'bg-red-500' : selectedThreat.confidenceScore >= 70 ? 'bg-amber-500' : 'bg-blue-500'}`} style={{ width: `${selectedThreat.confidenceScore}%` }}></div>
                </div>
                <span className="text-[10px] text-white font-bold">{selectedThreat.confidenceScore}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {filteredThreats.map(threat => {
          const sv = severityColor(threat.severity);
          const sc = statusColor(threat.status);
          const StatusIcon = sc.icon;
          return (
            <div
              key={threat.id}
              onClick={() => setSelectedThreat(threat)}
              className={`bg-slate-900/80 rounded-xl border ${selectedThreat?.id === threat.id ? 'border-blue-500' : 'border-slate-800 hover:border-slate-700'} p-4 cursor-pointer transition-all`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${sv.bg} mt-0.5`}>
                    <ShieldAlert className={`w-4 h-4 ${sv.text}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-white">{threat.title}</span>
                      <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${sv.bg} ${sv.text}`}>{threat.severity}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-slate-500">
                      <span className="font-mono">{threat.id}</span>
                      <span>{threat.category}</span>
                      <span>{threat.detectedAt}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusIcon className={`w-3.5 h-3.5 ${sc.text}`} />
                  <span className={`text-[10px] font-bold ${sc.text}`}>{threat.status}</span>
                </div>
              </div>
            </div>
          );
        })}
        {filteredThreats.length === 0 && (
          <div className="text-center py-12 text-slate-500 text-sm">No threats match the current filters.</div>
        )}
      </div>
    </div>
  );

  const renderIncidents = () => (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search incidents..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:border-blue-500 transition-colors font-mono"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon={AlertCircle} label="Active" value={SECURITY_INCIDENTS.filter(i => i.status === 'Active').length} accent="text-red-400" bgAccent="bg-red-500/10" />
        <StatCard icon={Search} label="Investigating" value={SECURITY_INCIDENTS.filter(i => i.status === 'Investigating').length} accent="text-amber-400" bgAccent="bg-amber-500/10" />
        <StatCard icon={ShieldCheck} label="Contained" value={SECURITY_INCIDENTS.filter(i => i.status === 'Contained').length} accent="text-blue-400" bgAccent="bg-blue-500/10" />
        <StatCard icon={CheckCircle2} label="Resolved" value={SECURITY_INCIDENTS.filter(i => i.status === 'Resolved').length} accent="text-emerald-400" bgAccent="bg-emerald-500/10" />
      </div>

      <div className="space-y-3">
        {filteredIncidents.map(incident => {
          const sv = severityColor(incident.severity);
          const sc = statusColor(incident.status);
          const StatusIcon = sc.icon;
          return (
            <div key={incident.id} className="bg-slate-900/80 rounded-xl border border-slate-800 hover:border-slate-700 p-5 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${sv.bg} ${sv.text} border ${sv.border}`}>{incident.severity}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{incident.id}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{incident.title}</h4>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${sc.bg}`}>
                  <StatusIcon className={`w-3.5 h-3.5 ${sc.text}`} />
                  <span className={`text-[10px] font-bold ${sc.text}`}>{incident.status}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div>
                  <div className="text-[9px] text-slate-500 uppercase font-bold">Category</div>
                  <div className="text-[11px] text-white">{incident.category}</div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-500 uppercase font-bold">Assignee</div>
                  <div className="text-[11px] text-white">{incident.assignee}</div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-500 uppercase font-bold">Alerts</div>
                  <div className="text-[11px] text-white">{incident.alertCount}</div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-500 uppercase font-bold">Assets</div>
                  <div className="text-[11px] text-white">{incident.affectedAssets}</div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-500 uppercase font-bold">Last Update</div>
                  <div className="text-[11px] text-white font-mono">{incident.updatedAt}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderCompliance = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Framework Compliance Scores
            </h3>
            <div className="space-y-4">
              {COMPLIANCE_FRAMEWORKS.map(fw => (
                <div key={fw.id} className="bg-slate-950/60 rounded-lg p-4 border border-slate-800">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-xs font-bold text-white">{fw.name}</h4>
                      <span className="text-[10px] text-slate-500">Last assessed: {fw.lastAssessment}</span>
                    </div>
                    <span className={`text-lg font-black ${fw.score >= 95 ? 'text-emerald-400' : fw.score >= 90 ? 'text-blue-400' : fw.score >= 85 ? 'text-amber-400' : 'text-red-400'}`}>{fw.score}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 mb-2">
                    <div
                      className={`h-2 rounded-full transition-all ${fw.score >= 95 ? 'bg-emerald-500' : fw.score >= 90 ? 'bg-blue-500' : fw.score >= 85 ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${fw.score}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center gap-4 text-[10px]">
                    <span className="text-emerald-400">{fw.passing} passing</span>
                    <span className="text-red-400">{fw.failing} failing</span>
                    <span className="text-slate-500">{fw.controls} total controls</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
            <Radar className="w-4 h-4 text-purple-400" /> Compliance Radar
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={complianceRadarData}>
              <PolarGrid stroke="#1e293b" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#475569', fontSize: 9 }} />
              <RechartsRadar name="Score" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderNetwork = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={Server} label="Endpoints Protected" value={stats.endpointsProtected} accent="text-blue-400" bgAccent="bg-blue-500/10" />
        <StatCard icon={Database} label="Data Sources" value={stats.dataSourcesIngested} accent="text-cyan-400" bgAccent="bg-cyan-500/10" />
        <StatCard icon={Eye} label="Assets Monitored" value={stats.assetsMonitored.toLocaleString()} accent="text-purple-400" bgAccent="bg-purple-500/10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {NETWORK_SEGMENTS.map(seg => (
          <div key={seg.id} className={`bg-slate-900/80 rounded-xl border ${seg.status === 'Warning' ? 'border-amber-500/30' : seg.status === 'Breached' ? 'border-red-500/30' : 'border-slate-800'} p-5 transition-colors`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${seg.status === 'Secure' ? 'bg-emerald-500/10' : seg.status === 'Warning' ? 'bg-amber-500/10' : 'bg-red-500/10'}`}>
                  <Wifi className={`w-4 h-4 ${seg.status === 'Secure' ? 'text-emerald-400' : seg.status === 'Warning' ? 'text-amber-400' : 'text-red-400'}`} />
                </div>
                <h4 className="text-xs font-bold text-white">{seg.name}</h4>
              </div>
              <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${seg.status === 'Secure' ? 'bg-emerald-500/10 text-emerald-400' : seg.status === 'Warning' ? 'bg-amber-500/10 text-amber-400 animate-pulse' : 'bg-red-500/10 text-red-400 animate-pulse'}`}>{seg.status}</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="text-[9px] text-slate-500 uppercase font-bold mb-1">Traffic</div>
                <div className="text-sm font-bold text-white">{seg.traffic.toLocaleString()}</div>
                <div className="text-[9px] text-slate-600">req/min</div>
              </div>
              <div className="text-center">
                <div className="text-[9px] text-slate-500 uppercase font-bold mb-1">Anomalies</div>
                <div className={`text-sm font-bold ${seg.anomalies > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>{seg.anomalies}</div>
                <div className="text-[9px] text-slate-600">detected</div>
              </div>
              <div className="text-center">
                <div className="text-[9px] text-slate-500 uppercase font-bold mb-1">FW Rules</div>
                <div className="text-sm font-bold text-white">{seg.firewallRules}</div>
                <div className="text-[9px] text-slate-600">active</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-5">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-blue-400" /> Network Traffic Analysis (24h)
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={SECURITY_TIMELINE}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="time" stroke="#475569" fontSize={10} />
            <YAxis stroke="#475569" fontSize={10} />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '11px' }} />
            <Bar dataKey="blocked" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Blocked Traffic" />
            <Bar dataKey="threats" fill="#ef4444" radius={[4, 4, 0, 0]} name="Threat Events" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderPolicies = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={ShieldCheck} label="Enforced" value={SECURITY_POLICIES.filter(p => p.status === 'Enforced').length} accent="text-emerald-400" bgAccent="bg-emerald-500/10" />
        <StatCard icon={Eye} label="Monitoring" value={SECURITY_POLICIES.filter(p => p.status === 'Monitoring').length} accent="text-amber-400" bgAccent="bg-amber-500/10" />
        <StatCard icon={XCircle} label="Disabled" value={SECURITY_POLICIES.filter(p => p.status === 'Disabled').length} accent="text-slate-400" bgAccent="bg-slate-500/10" />
      </div>

      <div className="space-y-3">
        {SECURITY_POLICIES.map(policy => (
          <div key={policy.id} className="bg-slate-900/80 rounded-xl border border-slate-800 hover:border-slate-700 p-5 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${policy.status === 'Enforced' ? 'bg-emerald-500/10' : policy.status === 'Monitoring' ? 'bg-amber-500/10' : 'bg-slate-500/10'}`}>
                  {policy.status === 'Enforced' ? <Lock className="w-4 h-4 text-emerald-400" /> :
                   policy.status === 'Monitoring' ? <Eye className="w-4 h-4 text-amber-400" /> :
                   <XCircle className="w-4 h-4 text-slate-400" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{policy.name}</h4>
                  <span className="text-[10px] text-slate-500">{policy.category} / {policy.scope}</span>
                </div>
              </div>
              <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${policy.status === 'Enforced' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : policy.status === 'Monitoring' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'bg-slate-500/10 text-slate-400 border border-slate-500/30'}`}>{policy.status}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-500">Compliance Rate</span>
                  <span className={`text-[10px] font-bold ${policy.complianceRate >= 95 ? 'text-emerald-400' : policy.complianceRate >= 90 ? 'text-blue-400' : policy.complianceRate >= 85 ? 'text-amber-400' : 'text-red-400'}`}>{policy.complianceRate}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all ${policy.complianceRate >= 95 ? 'bg-emerald-500' : policy.complianceRate >= 90 ? 'bg-blue-500' : policy.complianceRate >= 85 ? 'bg-amber-500' : 'bg-red-500'}`}
                    style={{ width: `${policy.complianceRate}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[9px] text-slate-500">Last Evaluated</div>
                <div className="text-[10px] text-white font-mono">{policy.lastEvaluated}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'threats': return renderThreats();
      case 'incidents': return renderIncidents();
      case 'compliance': return renderCompliance();
      case 'network': return renderNetwork();
      case 'policies': return renderPolicies();
    }
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-950">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border-b border-slate-800">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600/20 rounded-xl border border-blue-500/30 shadow-lg shadow-blue-500/10">
                <Shield className="w-7 h-7 text-blue-400" />
              </div>
              <div>
                <h1 className="text-lg font-black text-white tracking-tight">Microsoft Sentinel AI</h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Enterprise Security Operations Center</span>
                  <span className="text-[9px] bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded-full font-bold border border-blue-500/20">{SENTINEL_VERSION}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-[9px] text-slate-500 uppercase font-bold">Live Clock</div>
                <div className="text-sm text-white font-mono font-bold">{liveTime.toLocaleTimeString()}</div>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] text-emerald-400 font-bold uppercase">SOC Online</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <Cloud className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-[10px] text-blue-400 font-bold uppercase">Azure Connected</span>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1 mt-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSearchQuery(''); setSelectedThreat(null); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        {renderContent()}
      </div>

      {/* Footer */}
      <div className="px-8 py-4 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-[9px] text-slate-500 uppercase font-mono">
            <span className="flex items-center gap-1"><Fingerprint className="w-3 h-3" /> Session Encrypted (TLS 1.3)</span>
            <span className="flex items-center gap-1"><Cpu className="w-3 h-3" /> Azure East US 2</span>
            <span className="flex items-center gap-1"><Layers className="w-3 h-3" /> {stats.dataSourcesIngested} Data Sources Ingested</span>
          </div>
          <div className="flex items-center gap-3 text-[9px] text-slate-500 uppercase font-mono">
            <span>MTTR: {stats.meanTimeToRespond}</span>
            <span>False Positive Rate: {stats.falsePositiveRate}%</span>
            <span className="text-blue-400">Powered by Microsoft Sentinel AI</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{
  icon: React.ElementType;
  label: string;
  value: string | number;
  accent: string;
  bgAccent: string;
}> = ({ icon: Icon, label, value, accent, bgAccent }) => (
  <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-4">
    <div className="flex items-center gap-2 mb-2">
      <div className={`p-1.5 rounded-lg ${bgAccent}`}>
        <Icon className={`w-3.5 h-3.5 ${accent}`} />
      </div>
      <span className="text-[9px] text-slate-500 uppercase font-bold">{label}</span>
    </div>
    <div className={`text-xl font-black ${accent}`}>{value}</div>
  </div>
);

export default SentinelSecurity;
