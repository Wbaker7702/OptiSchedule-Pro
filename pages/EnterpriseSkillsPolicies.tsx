import React, { useMemo, useState } from 'react';
import Header from '../components/Header';
import { ENTERPRISE_SKILL_AUDIT_EVENTS, ENTERPRISE_SKILL_CATALOG, ENTERPRISE_SKILL_POLICIES } from '../constants';
import { EnterpriseSkill, EnterpriseSkillRisk, EnterpriseSkillStatus, PolicyEnforcementMode, SkillAuditOutcome, SkillPolicy } from '../types';
import { Activity, AlertTriangle, Brain, CheckCircle2, Clock, Database, FileText, Lock, Scale, Search, ShieldCheck, Users, XCircle, Zap } from 'lucide-react';

type SkillStatusFilter = EnterpriseSkillStatus | 'All';

const statusFilters: SkillStatusFilter[] = ['All', 'Approved', 'Review Required', 'Blocked'];

const getSkillStatusStyle = (status: EnterpriseSkillStatus) => {
  switch (status) {
    case 'Approved':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'Review Required':
      return 'bg-amber-500/10 text-amber-300 border-amber-500/20';
    case 'Blocked':
      return 'bg-red-500/10 text-red-400 border-red-500/20';
    default: {
      const exhaustiveCheck: never = status;
      return exhaustiveCheck;
    }
  }
};

const getRiskStyle = (risk: EnterpriseSkillRisk) => {
  switch (risk) {
    case 'Low':
      return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    case 'Medium':
      return 'text-amber-300 bg-amber-500/10 border-amber-500/20';
    case 'High':
      return 'text-red-400 bg-red-500/10 border-red-500/20';
    default: {
      const exhaustiveCheck: never = risk;
      return exhaustiveCheck;
    }
  }
};

const getEnforcementStyle = (mode: PolicyEnforcementMode) => {
  switch (mode) {
    case 'Monitor':
      return 'bg-blue-500/10 text-blue-300 border-blue-500/20';
    case 'Warn':
      return 'bg-amber-500/10 text-amber-300 border-amber-500/20';
    case 'Block':
      return 'bg-red-500/10 text-red-300 border-red-500/20';
    default: {
      const exhaustiveCheck: never = mode;
      return exhaustiveCheck;
    }
  }
};

const getAuditOutcomeIcon = (outcome: SkillAuditOutcome) => {
  switch (outcome) {
    case 'Approved':
      return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
    case 'Warned':
      return <AlertTriangle className="w-4 h-4 text-amber-300" />;
    case 'Blocked':
      return <XCircle className="w-4 h-4 text-red-400" />;
    default: {
      const exhaustiveCheck: never = outcome;
      return exhaustiveCheck;
    }
  }
};

const EnterpriseSkillsPolicies: React.FC = () => {
  const [activeStatus, setActiveStatus] = useState<SkillStatusFilter>('All');
  const [selectedSkillId, setSelectedSkillId] = useState(ENTERPRISE_SKILL_CATALOG[0]?.id ?? '');
  const [selectedPolicyId, setSelectedPolicyId] = useState(ENTERPRISE_SKILL_POLICIES[0]?.id ?? '');

  const filteredSkills = useMemo(() => {
    if (activeStatus === 'All') {
      return ENTERPRISE_SKILL_CATALOG;
    }

    return ENTERPRISE_SKILL_CATALOG.filter(skill => skill.status === activeStatus);
  }, [activeStatus]);

  const selectedSkill = ENTERPRISE_SKILL_CATALOG.find(skill => skill.id === selectedSkillId) ?? ENTERPRISE_SKILL_CATALOG[0];
  const selectedPolicy = ENTERPRISE_SKILL_POLICIES.find(policy => policy.id === selectedPolicyId) ?? ENTERPRISE_SKILL_POLICIES[0];
  const approvedSkills = ENTERPRISE_SKILL_CATALOG.filter(skill => skill.status === 'Approved').length;
  const blockedSkills = ENTERPRISE_SKILL_CATALOG.filter(skill => skill.status === 'Blocked').length;
  const reviewSkills = ENTERPRISE_SKILL_CATALOG.filter(skill => skill.status === 'Review Required').length;
  const averagePolicyCoverage = Math.round(
    ENTERPRISE_SKILL_POLICIES.reduce((total, policy) => total + policy.coverage, 0) / ENTERPRISE_SKILL_POLICIES.length
  );

  const renderSkillCard = (skill: EnterpriseSkill) => {
    const isSelected = skill.id === selectedSkill.id;

    return (
      <button
        key={skill.id}
        onClick={() => setSelectedSkillId(skill.id)}
        className={`w-full text-left rounded-2xl border p-5 transition-all ${
          isSelected
            ? 'bg-slate-800 border-teal-400/50 shadow-lg shadow-teal-500/10'
            : 'bg-slate-900 border-slate-800 hover:border-slate-700'
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{skill.category}</p>
            <h3 className="text-sm font-black text-white uppercase tracking-tight">{skill.name}</h3>
          </div>
          <span className={`px-2 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${getSkillStatusStyle(skill.status)}`}>
            {skill.status}
          </span>
        </div>
        <p className="text-[10px] text-slate-400 font-medium leading-relaxed mt-3">{skill.description}</p>
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-800">
          <span className={`px-2 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${getRiskStyle(skill.risk)}`}>
            {skill.risk} Risk
          </span>
          <span className="text-[9px] text-slate-500 font-mono uppercase">{skill.usageCount.toLocaleString()} runs</span>
        </div>
      </button>
    );
  };

  const renderPolicyCard = (policy: SkillPolicy) => {
    const isSelected = policy.id === selectedPolicy.id;

    return (
      <button
        key={policy.id}
        onClick={() => setSelectedPolicyId(policy.id)}
        className={`text-left rounded-2xl border p-5 transition-all ${
          isSelected
            ? 'bg-blue-500/10 border-blue-400/50 shadow-lg shadow-blue-500/10'
            : 'bg-slate-900 border-slate-800 hover:border-slate-700'
        }`}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-tight">{policy.name}</h3>
            <p className="text-[9px] text-slate-500 font-mono uppercase tracking-widest mt-1">{policy.scope}</p>
          </div>
          <span className={`px-2 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${getEnforcementStyle(policy.enforcement)}`}>
            {policy.enforcement}
          </span>
        </div>
        <p className="text-[10px] text-slate-400 font-medium leading-relaxed min-h-10">{policy.description}</p>
        <div className="mt-5">
          <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2">
            <span>Coverage</span>
            <span>{policy.coverage}%</span>
          </div>
          <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div className="h-full bg-gradient-to-r from-blue-500 to-teal-400 rounded-full" style={{ width: `${policy.coverage}%` }} />
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="flex-1 bg-[#020617] overflow-auto custom-scrollbar font-sans text-slate-200">
      <Header title="Enterprise Skills Policies" subtitle="Governed AI skill catalog, approvals, and enforcement" />

      <div className="p-8 max-w-7xl mx-auto space-y-8 pb-24">
        <section className="relative overflow-hidden bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-2xl">
          <div className="absolute -right-12 -top-12 opacity-10">
            <Brain className="w-72 h-72 text-teal-300" />
          </div>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-[9px] font-black uppercase tracking-[0.2em] mb-5">
                <ShieldCheck className="w-3 h-3" />
                Enterprise Control Plane
              </div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight max-w-3xl">
                Approve, restrict, and audit every AI skill before it can touch store operations.
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed mt-4 max-w-2xl">
                Policy enforcement connects the skill catalog to data-scope boundaries, human approvals, model provenance, and jurisdiction locks for Store #5065 pilots.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Approved</p>
                <p className="text-3xl font-black text-emerald-400 mt-2">{approvedSkills}</p>
              </div>
              <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">In Review</p>
                <p className="text-3xl font-black text-amber-300 mt-2">{reviewSkills}</p>
              </div>
              <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Blocked</p>
                <p className="text-3xl font-black text-red-400 mt-2">{blockedSkills}</p>
              </div>
              <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Coverage</p>
                <p className="text-3xl font-black text-blue-300 mt-2">{averagePolicyCoverage}%</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                  <Zap className="w-4 h-4 text-teal-300" />
                  Skill Catalog
                </h2>
                <p className="text-[10px] text-slate-500 font-mono uppercase mt-1">Approval posture by enterprise skill</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {statusFilters.map(status => (
                  <button
                    key={status}
                    onClick={() => setActiveStatus(status)}
                    className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-colors ${
                      activeStatus === status
                        ? 'bg-teal-500 text-slate-950 border-teal-400'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredSkills.map(skill => renderSkillCard(skill))}
            </div>
          </div>

          <aside className="bg-slate-900 rounded-3xl border border-slate-800 p-6 h-fit sticky top-28">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Selected Skill</p>
                <h3 className="text-lg font-black text-white uppercase tracking-tight mt-1">{selectedSkill.name}</h3>
              </div>
              <span className={`px-2 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${getRiskStyle(selectedSkill.risk)}`}>
                {selectedSkill.risk}
              </span>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">
                  <Users className="w-3 h-3" />
                  Approval Group
                </div>
                <p className="text-sm font-bold text-white">{selectedSkill.approvalGroup}</p>
                <p className="text-[10px] text-slate-500 font-mono mt-1">Owner: {selectedSkill.owner}</p>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-black uppercase tracking-widest mb-3">
                  <Database className="w-3 h-3" />
                  Approved Data Scopes
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedSkill.dataScopes.map(scope => (
                    <span key={scope} className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[9px] font-mono text-slate-300">
                      {scope}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Last Review</p>
                  <p className="text-sm font-mono font-bold text-white mt-2">{selectedSkill.lastReviewed}</p>
                </div>
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Executions</p>
                  <p className="text-sm font-mono font-bold text-white mt-2">{selectedSkill.usageCount.toLocaleString()}</p>
                </div>
              </div>

              <button className="w-full px-4 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-[10px] font-black uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2">
                <Lock className="w-4 h-4" />
                Review Skill Policy
              </button>
            </div>
          </aside>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-5">
            <div>
              <h2 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                <Scale className="w-4 h-4 text-blue-300" />
                Policy Library
              </h2>
              <p className="text-[10px] text-slate-500 font-mono uppercase mt-1">Reusable controls applied across enterprise skills</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ENTERPRISE_SKILL_POLICIES.map(policy => renderPolicyCard(policy))}
            </div>
          </div>

          <aside className="bg-slate-900 rounded-3xl border border-slate-800 p-6 h-fit">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <FileText className="w-5 h-5 text-blue-300" />
              </div>
              <div>
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em]">Policy Detail</p>
                <h3 className="text-sm font-black text-white uppercase">{selectedPolicy.name}</h3>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 font-medium leading-relaxed mb-5">{selectedPolicy.description}</p>
            <div className="space-y-3">
              {selectedPolicy.controls.map(control => (
                <div key={control} className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <p className="text-[10px] text-slate-300 font-bold leading-relaxed">{control}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <p className="text-[9px] text-slate-500 font-black uppercase">Exceptions</p>
                <p className="text-xl font-black text-white mt-1">{selectedPolicy.exceptions}</p>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <p className="text-[9px] text-slate-500 font-black uppercase">Updated</p>
                <p className="text-xs font-mono font-bold text-white mt-2">{selectedPolicy.lastUpdated}</p>
              </div>
            </div>
          </aside>
        </section>

        <section className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden">
          <div className="p-6 border-b border-slate-800 bg-slate-900/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-300" />
                Enforcement Audit Stream
              </h2>
              <p className="text-[10px] text-slate-500 font-mono uppercase mt-1">Policy decisions recorded for review and export</p>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="FILTER AUDIT EVENTS"
                className="pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-[10px] font-mono text-slate-300 placeholder-slate-600 outline-none focus:ring-1 focus:ring-purple-400"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-950 text-slate-500 font-black uppercase tracking-widest text-[9px]">
                <tr>
                  <th className="px-6 py-4">Event</th>
                  <th className="px-6 py-4">Skill</th>
                  <th className="px-6 py-4">Policy</th>
                  <th className="px-6 py-4">Actor</th>
                  <th className="px-6 py-4">Outcome</th>
                  <th className="px-6 py-4">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-[11px]">
                {ENTERPRISE_SKILL_AUDIT_EVENTS.map(event => (
                  <tr key={event.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-white font-black">{event.id}</p>
                      <p className="text-slate-500 font-mono mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {event.timestamp}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-slate-300 font-bold">{event.skill}</td>
                    <td className="px-6 py-4 text-slate-400">{event.policy}</td>
                    <td className="px-6 py-4 text-slate-400">{event.actor}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 font-black uppercase tracking-widest text-[9px] text-slate-300">
                        {getAuditOutcomeIcon(event.outcome)}
                        {event.outcome}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 max-w-sm leading-relaxed">{event.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default EnterpriseSkillsPolicies;
