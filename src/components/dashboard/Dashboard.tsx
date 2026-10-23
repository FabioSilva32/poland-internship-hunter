import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Compass,
  Calendar,
  Send,
  MailCheck,
  MessageSquare,
  Users,
  Clock,
  MapPin,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { metrics, setActiveTab, setSelectedCompanyId } = useApp();

  const kpis = [
    {
      title: 'Companies Discovered',
      value: metrics?.totalCompanies || 0,
      sub: `${metrics?.worthContacting || 0} worth contacting`,
      icon: Building2,
      color: 'from-blue-500/20 to-indigo-500/10 border-blue-500/30 text-blue-400',
    },
    {
      title: 'Internship Vacancies',
      value: metrics?.totalOpportunities || 0,
      sub: `${metrics?.dateMatches || 0} match Spring 2027`,
      icon: Compass,
      color: 'from-indigo-500/20 to-purple-500/10 border-indigo-500/30 text-indigo-400',
    },
    {
      title: 'Date-Compatible (2027)',
      value: metrics?.dateMatches || 0,
      sub: 'Feb–June 2027 window',
      icon: Calendar,
      color: 'from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-400',
    },
    {
      title: 'Emails Sent',
      value: metrics?.sentCount || 0,
      sub: `${metrics?.draftsCount || 0} drafts prepared`,
      icon: Send,
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
    },
    {
      title: 'Replies Received',
      value: metrics?.repliesCount || 0,
      sub: `${metrics?.awaitingResponse || 0} awaiting reply`,
      icon: MessageSquare,
      color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-400',
    },
    {
      title: 'Interviews Scheduled',
      value: metrics?.interviewsCount || 0,
      sub: `${metrics?.rejectionsCount || 0} rejections processed`,
      icon: Users,
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400',
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Hero Action Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-purple-950/40 border border-indigo-500/20 p-6 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>IPCA Curricular Internship Campaign 2027</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Poland Tech & Gaming Internship Pipeline
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Targeting top engineering hubs and game studios across <strong className="text-indigo-200">Kraków, Warsaw, and Gdańsk</strong> for a 4-month placement (February – June/July 2027) in Software Development, Web/Frontend, UI/UX, and Game QA.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('discovery')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Opportunities</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveTab('generator')}
              className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition"
            >
              <MailCheck className="w-4 h-4 text-purple-400" />
              <span>Draft Outreach</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className={`p-4 rounded-xl bg-gradient-to-br ${kpi.color} bg-slate-900/60 border backdrop-blur-sm transition-all hover:scale-[1.02] shadow-sm space-y-2`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-400">{kpi.title}</span>
                <Icon className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-white tracking-tight">{kpi.value}</div>
              <div className="text-[10px] text-slate-400 font-medium truncate">{kpi.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Main Charts & Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Application Pipeline Stages */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                Application Pipeline Progress
              </h3>
              <p className="text-xs text-slate-400">Current status distribution across companies and positions</p>
            </div>
            <button
              onClick={() => setActiveTab('tracker')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              <span>Open CRM</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            {[
              { stage: 'Discovered', count: metrics?.totalCompanies || 0, color: 'text-slate-300', bg: 'bg-slate-800' },
              { stage: 'Draft Prepared', count: metrics?.draftsCount || 0, color: 'text-indigo-400', bg: 'bg-indigo-950/60 border border-indigo-800/40' },
              { stage: 'Email Sent', count: metrics?.sentCount || 0, color: 'text-blue-400', bg: 'bg-blue-950/60 border border-blue-800/40' },
              { stage: 'Follow-Up Due', count: metrics?.upcomingFollowUps || 0, color: 'text-amber-400', bg: 'bg-amber-950/60 border border-amber-800/40' },
              { stage: 'Replied', count: metrics?.repliesCount || 0, color: 'text-cyan-400', bg: 'bg-cyan-950/60 border border-cyan-800/40' },
              { stage: 'Interview', count: metrics?.interviewsCount || 0, color: 'text-emerald-400', bg: 'bg-emerald-950/60 border border-emerald-800/40' },
              { stage: 'Rejections', count: metrics?.rejectionsCount || 0, color: 'text-rose-400', bg: 'bg-rose-950/60 border border-rose-800/40' },
              { stage: 'Spring 2027 Matches', count: metrics?.dateMatches || 0, color: 'text-purple-400', bg: 'bg-purple-950/60 border border-purple-800/40' },
            ].map((st, i) => (
              <div key={i} className={`p-3 rounded-xl ${st.bg} space-y-1`}>
                <span className="text-[11px] font-medium text-slate-400 block">{st.stage}</span>
                <span className={`text-xl font-bold ${st.color}`}>{st.count}</span>
              </div>
            ))}
          </div>

          {/* Safety & Responsible Automation Guarantee Box */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-3 text-xs text-slate-300">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-slate-200">Responsible Automation Safeguards Active</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Manual approval required for all outgoing drafts. Daily send limit enforced (max 20 emails/day). Duplicate contact prevention and opt-out compliance enabled.
              </p>
            </div>
          </div>
        </div>

        {/* Opportunities by Polish City */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="border-b border-slate-800/80 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-purple-400" />
              Target Polish Cities
            </h3>
            <p className="text-xs text-slate-400">Opportunity density by geographic hub</p>
          </div>

          <div className="space-y-3 pt-1">
            {[
              { city: 'Kraków', count: 3, percentage: 50, tag: 'Top Preference (#1)' },
              { city: 'Warsaw', count: 2, percentage: 33, tag: 'Capital Tech Hub' },
              { city: 'Gdańsk', count: 1, percentage: 17, tag: 'Tricity Innovation' },
              { city: 'Wrocław / Other', count: 1, percentage: 17, tag: 'Secondary Hub' },
            ].map((loc, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                    <span>{loc.city}</span>
                    <span className="text-[10px] font-normal text-indigo-400">({loc.tag})</span>
                  </div>
                  <span className="text-slate-400 font-mono font-medium">{loc.count} leads</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    style={{ width: `${loc.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-800/30 text-purple-300 text-[11px] leading-relaxed">
            💡 <strong>Kraków Insight:</strong> Hosts the largest concentration of international game studios (Bloober Team, CDPR Kraków) and global tech centers (Brainly, Cisco, Sabre).
          </div>
        </div>
      </div>

      {/* Featured Companies Ready for Contact */}
      <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Top Rated Companies for Your Degree (IPCA Web Multimedia)
            </h3>
            <p className="text-xs text-slate-400">Ranked by transparent 0–100 fit score</p>
          </div>
          <button
            onClick={() => setActiveTab('discovery')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
          >
            View all companies →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              id: 'comp-bloober',
              name: 'Bloober Team',
              city: 'Kraków',
              fit: 98,
              role: 'Game QA & Functionality Testing Intern',
              tech: ['Unreal Engine 5', 'Jira', 'Bug Reporting', 'PC/Console'],
              reason: 'Headquartered in Kraków. High alignment with multimedia and game testing interests.',
            },
            {
              id: 'comp-brainly',
              name: 'Brainly',
              city: 'Kraków',
              fit: 97,
              role: 'Frontend / Web Engineering Intern',
              tech: ['React', 'TypeScript', 'Next.js', 'Figma'],
              reason: 'Global HQ in Kraków. Direct match for modern web development & UI/UX.',
            },
            {
              id: 'comp-cdpr',
              name: 'CD Projekt RED',
              city: 'Warsaw & Kraków',
              fit: 96,
              role: 'Junior Game Dev / Tech Art / QA',
              tech: ['Unreal Engine 5', 'C++', 'C#', 'Web Tools'],
              reason: 'Premier Polish studio. English-first culture with structured internship programs.',
            },
          ].map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setSelectedCompanyId(item.id);
                setActiveTab('research');
              }}
              className="p-4 rounded-xl bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/60 hover:border-indigo-500/50 cursor-pointer transition shadow-sm space-y-3 group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition">
                    {item.name}
                  </h4>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-purple-400" />
                    {item.city}
                  </span>
                </div>
                <div className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  {item.fit}% Fit
                </div>
              </div>

              <div className="text-xs font-semibold text-indigo-300 bg-indigo-950/40 px-2.5 py-1 rounded-lg border border-indigo-900/40 truncate">
                {item.role}
              </div>

              <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">{item.reason}</p>

              <div className="flex flex-wrap gap-1">
                {item.tech.map((t, idx) => (
                  <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 font-mono">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
