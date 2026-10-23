import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  PauseCircle,
  PlayCircle,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
  X,
  ExternalLink,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    isGlobalPaused,
    toggleGlobalPause,
    toasts,
    dismissToast,
    showToast,
    refreshMetrics,
  } = useApp();

  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return { title: 'Executive Overview', subtitle: 'Pipeline metrics, target dates, and Polish tech market status' };
      case 'discovery':
        return { title: 'Opportunity & Company Discovery', subtitle: 'Search verified vacancies and speculative targets across Poland' };
      case 'research':
        return { title: 'Company Intelligence & Fit Score', subtitle: 'Deep analysis, tech stacks, degree relevance, and verified contacts' };
      case 'generator':
        return { title: 'Personalized Email AI Generator', subtitle: 'Tailored outreach with 10 templates, 2 variants, and zero hallucinations' };
      case 'tracker':
        return { title: 'Application CRM Tracker', subtitle: 'Full 14-stage lifecycle: Discovered to Offer Received' };
      case 'batch':
        return { title: 'Batch Outreach & Approval Queue', subtitle: 'Review recipients, verify CVs, and safely dispatch with daily limits' };
      case 'followups':
        return { title: 'Follow-Up Pipeline & Automation', subtitle: 'Strict business-day rules (7 business days) with automatic suppression' };
      case 'profile':
        return { title: 'Profile, Skills & Multi-Version CVs', subtitle: 'Configure IPCA student details, dates, skills, and PDF resumes' };
      case 'settings':
        return { title: 'System Settings & Audit Trail', subtitle: 'API keys, daily rate limits, OAuth providers, and tamper-evident logs' };
      default:
        return { title: 'Poland Internship Hunter', subtitle: '2027 University Placement' };
    }
  };

  const { title, subtitle } = getTabTitle();

  const handleQuickSearch = async () => {
    setActiveTab('discovery');
    showToast('Running multi-provider sync across Poland job boards...', 'info');
    if (window.desktopAPI?.runSearch) {
      try {
        const res = await window.desktopAPI.runSearch({ city: 'All', category: 'All' });
        showToast(`Search complete! Found ${res.newOpportunities} new opportunities.`, 'success');
        refreshMetrics();
      } catch (err: any) {
        showToast('Search encountered an error: ' + err.message, 'error');
      }
    }
  };

  return (
    <>
      <header className="h-16 px-6 bg-[#0b101d] border-b border-slate-800 flex items-center justify-between shrink-0 select-none">
        {/* Title & Subtitle */}
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            {title}
          </h2>
          <p className="text-xs text-slate-400 font-normal">{subtitle}</p>
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center gap-3">
          {/* Target Period Pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/40 border border-indigo-800/40 text-indigo-300 text-xs font-medium">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <span>Target: Feb – Jun 2027 (4 Mo.)</span>
          </div>

          {/* Quick Search Action */}
          <button
            onClick={handleQuickSearch}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition shadow-sm"
          >
            <Search className="w-3.5 h-3.5 text-indigo-400" />
            <span>Run Poland Search</span>
          </button>

          {/* Emergency Global Pause Toggle */}
          <button
            onClick={toggleGlobalPause}
            title={isGlobalPaused ? 'Resume outgoing email dispatch' : 'Emergency Stop: Pause all outgoing emails'}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
              isGlobalPaused
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30 animate-pulse'
                : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
            }`}
          >
            {isGlobalPaused ? (
              <>
                <PlayCircle className="w-4 h-4 text-rose-400" />
                <span>Resume Dispatch</span>
              </>
            ) : (
              <>
                <PauseCircle className="w-4 h-4 text-emerald-400" />
                <span>Global Pause: Active</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Floating Toast Notification Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => {
          let Icon = Info;
          let colorStyle = 'bg-slate-900/95 border-slate-700 text-slate-200';
          if (toast.type === 'success') {
            Icon = CheckCircle2;
            colorStyle = 'bg-emerald-950/95 border-emerald-700/60 text-emerald-200';
          } else if (toast.type === 'error') {
            Icon = XCircle;
            colorStyle = 'bg-rose-950/95 border-rose-700/60 text-rose-200';
          } else if (toast.type === 'warning') {
            Icon = AlertTriangle;
            colorStyle = 'bg-amber-950/95 border-amber-700/60 text-amber-200';
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-2.5 p-3 rounded-xl border shadow-xl backdrop-blur-md animate-fade-in ${colorStyle}`}
            >
              <Icon className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1 text-xs font-medium leading-relaxed">{toast.message}</div>
              <button
                onClick={() => dismissToast(toast.id)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
};
