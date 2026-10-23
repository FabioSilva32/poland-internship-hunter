import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Company, Priority } from '../../types';
import {
  Building2,
  MapPin,
  Globe,
  Briefcase,
  Gamepad2,
  Sparkles,
  ExternalLink,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  Send,
  UserCheck,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export const CompanyResearch: React.FC = () => {
  const {
    selectedCompanyId,
    setSelectedCompanyId,
    setActiveTab,
    showToast,
    openExternal,
    refreshMetrics,
  } = useApp();

  const [companyList, setCompanyList] = useState<Company[]>([]);
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Load all companies for sidebar selection
  useEffect(() => {
    if (window.desktopAPI?.getCompanies) {
      window.desktopAPI.getCompanies({}).then((data: Company[]) => {
        setCompanyList(data);
      });
    }
  }, []);

  // Load active company details
  const loadDetails = async () => {
    if (!selectedCompanyId) return;
    setLoading(true);
    if (window.desktopAPI?.getCompanyDetails) {
      try {
        const data = await window.desktopAPI.getCompanyDetails(selectedCompanyId);
        setCompany(data);
      } catch (err: any) {
        showToast('Error loading company: ' + err.message, 'error');
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadDetails();
  }, [selectedCompanyId]);

  const handlePriorityChange = async (priority: Priority) => {
    if (!company) return;
    if (window.desktopAPI?.updateCompanyPriority) {
      try {
        await window.desktopAPI.updateCompanyPriority(company.id, priority);
        setCompany({ ...company, priority });
        showToast(`Priority updated to ${priority}`, 'success');
        refreshMetrics();
      } catch (err: any) {
        showToast('Failed to update priority: ' + err.message, 'error');
      }
    }
  };

  const handleDraftForCompany = () => {
    setActiveTab('generator');
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-[#090d16]">
      {/* Left Company List Selector */}
      <div className="w-72 border-r border-slate-800 bg-slate-900/40 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
            Polish Companies ({companyList.length})
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {companyList.map((c) => {
            const isSelected = c.id === selectedCompanyId;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCompanyId(c.id)}
                className={`w-full p-2.5 rounded-xl text-left transition-all space-y-1 ${
                  isSelected
                    ? 'bg-indigo-600/20 border border-indigo-500/40 shadow-sm'
                    : 'hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                    {c.name}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      c.fit_score >= 90
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-indigo-500/20 text-indigo-300'
                    }`}
                  >
                    {c.fit_score}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-purple-400" />
                    {c.city}
                  </span>
                  <span className={`text-[10px] font-medium ${c.priority === 'High' ? 'text-rose-400' : 'text-slate-400'}`}>
                    {c.priority}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Company Deep-Dive View */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
          Loading company details...
        </div>
      ) : !company ? (
        <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
          Select a company to inspect details.
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Header Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-xl font-black text-white tracking-tight">{company.name}</h2>
                  {company.is_gaming === 1 && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-pink-500/10 text-pink-400 border border-pink-500/20 flex items-center gap-1">
                      <Gamepad2 className="w-3 h-3" />
                      Game Dev Studio
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                    {company.industry}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-400 pt-0.5">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-purple-400" />
                    {company.city}, Poland
                  </span>
                  {company.website && (
                    <button
                      onClick={() => openExternal(company.website)}
                      className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      Website
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                  {company.careers_url && (
                    <button
                      onClick={() => openExternal(company.careers_url)}
                      className="flex items-center gap-1 text-purple-400 hover:text-purple-300 font-medium"
                    >
                      <Briefcase className="w-3.5 h-3.5" />
                      Careers Portal
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Priority & Draft Action */}
              <div className="flex items-center gap-3 self-stretch md:self-auto justify-between md:justify-end">
                {/* Priority Selector */}
                <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
                  <span className="text-[11px] text-slate-400 px-2 font-medium">Priority:</span>
                  {(['High', 'Medium', 'Low'] as Priority[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => handlePriorityChange(p)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                        company.priority === p
                          ? p === 'High'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : p === 'Medium'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-slate-700 text-slate-200'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleDraftForCompany}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Draft Email</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed border-t border-slate-800/80 pt-3">
              {company.description}
            </p>
          </div>

          {/* Explainable Fit Score Breakdown (Section 5) */}
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Transparent Fit Score Breakdown: {company.fit_score}/100
                </h3>
                <p className="text-xs text-slate-400">
                  Objective calculation based on your IPCA Web Multimedia profile & 2027 timeline
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                {company.fit_score >= 88 ? 'HIGH PRIORITY MATCH' : 'STRONG CANDIDATE'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {(company.fit_reasons || []).map((reason: any, idx: number) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-200">{reason.factor}</span>
                    <span className="text-emerald-400 font-mono">
                      {reason.score}/{reason.max} pts
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-full"
                      style={{ width: `${(reason.score / reason.max) * 100}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed pt-0.5">{reason.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Why Your Degree is Relevant (Auto Pitch) */}
          <div className="p-5 rounded-2xl bg-indigo-950/20 border border-indigo-900/40 space-y-2">
            <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Tailored Outreach Angle: Why IPCA Web Multimedia Fits {company.name}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your degree in <strong>Desenvolvimento Web Multimédia at IPCA</strong> specifically combines <em>software engineering fundamentals</em>, <em>modern component-driven frontend architecture</em>, and <em>interactive multimedia/UI systems</em>. For {company.name}, you bring both the ability to code functional features in TypeScript/React/C# and the visual discernment required for clean UX design systems or rigorous bug verification.
            </p>
          </div>

          {/* Products & Tech Stack */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Products & Games */}
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                Featured Products & Projects
              </h3>
              <div className="flex flex-wrap gap-2">
                {(company.products || []).map((p: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs font-semibold text-purple-300"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Tech Stack */}
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-400" />
                Engineering Stack & Tools
              </h3>
              <div className="flex flex-wrap gap-2">
                {(company.technologies || []).map((t: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700/80 text-xs font-mono text-slate-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Verified Contacts & Careers Inboxes (Section 12) */}
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-blue-400" />
                  Verified Recruiting & Career Inboxes
                </h3>
                <p className="text-xs text-slate-400">
                  Strictly verified from official website or public corporate registries
                </p>
              </div>
            </div>

            {company.contacts && company.contacts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {company.contacts.map((ct: any) => (
                  <div
                    key={ct.id}
                    className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{ct.name}</span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {ct.source_type === 'verified_website' ? 'Verified Website' : 'Public Source'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">{ct.role}</div>
                      <div className="text-xs text-indigo-400 font-mono flex items-center gap-1.5 pt-1">
                        <Mail className="w-3.5 h-3.5" />
                        <span>{ct.email}</span>
                      </div>
                    </div>

                    <button
                      onClick={handleDraftForCompany}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 text-xs font-medium border border-indigo-500/30 transition shrink-0"
                    >
                      Email
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-400 p-3 bg-slate-800/30 rounded-xl">
                No direct recruiter listed yet. Official contact point is the careers page or web form.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
