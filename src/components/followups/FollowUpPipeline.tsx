import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { FollowUp } from '../../types';
import {
  CalendarClock,
  Clock,
  CheckCircle2,
  MailPlus,
  Building2,
  Calendar,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

export const FollowUpPipeline: React.FC = () => {
  const { showToast, refreshMetrics, setActiveTab, setSelectedCompanyId } = useApp();

  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadFollowUps = async () => {
    setLoading(true);
    if (window.desktopAPI?.getFollowUps) {
      try {
        const data = await window.desktopAPI.getFollowUps();
        setFollowUps(data);
      } catch (err: any) {
        showToast('Error loading follow-ups: ' + err.message, 'error');
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadFollowUps();
  }, []);

  const handleDismiss = async (id: string) => {
    if (window.desktopAPI?.updateFollowUpStatus) {
      try {
        await window.desktopAPI.updateFollowUpStatus(id, 'skipped');
        showToast('Follow-up marked as skipped.', 'info');
        await loadFollowUps();
        await refreshMetrics();
      } catch (err: any) {
        showToast('Error: ' + err.message, 'error');
      }
    }
  };

  const handleCreateDraft = (fu: FollowUp) => {
    // Navigate to generator with follow-up template
    setActiveTab('generator');
    showToast(`Prepared follow-up template for ${fu.company_name}`, 'info');
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#090d16]">
      {/* Top Banner & Rules Overview */}
      <div className="p-5 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CalendarClock className="w-4 h-4 text-amber-400" />
              Automated Follow-Up Pipeline
            </h3>
            <p className="text-xs text-slate-400">
              Strict business-day cadence (7 business days) with intelligent auto-suppression
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
              Max 2 Follow-Ups / Company
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
              Auto-Suppressed on Reply
            </span>
          </div>
        </div>

        {/* Safeguard summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-0.5">
            <span className="font-semibold text-slate-300">1st Follow-Up Cadence</span>
            <p className="text-[11px] text-slate-400">Scheduled exactly 7 business days after initial dispatch.</p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-0.5">
            <span className="font-semibold text-slate-300">2nd Follow-Up Final</span>
            <p className="text-[11px] text-slate-400">Scheduled another 7 business days later. Ceases afterward.</p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-0.5">
            <span className="font-semibold text-slate-300">Responsible Discontinuation</span>
            <p className="text-[11px] text-slate-400">Instantly halted if company replies, rejects, or requests opt-out.</p>
          </div>
        </div>
      </div>

      {/* Follow-up Queue */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-amber-400" />
            <span>Checking follow-up schedules...</span>
          </div>
        ) : followUps.length === 0 ? (
          <div className="py-16 text-center rounded-2xl border border-dashed border-slate-800 p-8 space-y-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h4 className="text-sm font-semibold text-slate-300">No follow-ups due right now</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Follow-ups appear here automatically 7 business days after you send an initial email.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {followUps.map((fu) => {
              const isDue = new Date(fu.due_date) <= new Date();
              return (
                <div
                  key={fu.id}
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition flex items-center justify-between gap-4 shadow-sm"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{fu.company_name}</span>
                      <span className="text-[10px] text-slate-400">({fu.city})</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        Follow-Up #{fu.follow_up_number}
                      </span>
                      {isDue && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
                          DUE NOW
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-semibold text-indigo-300">
                      {fu.target_role}
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1 font-mono text-amber-300">
                        <Calendar className="w-3.5 h-3.5" />
                        Due Date: {fu.due_date}
                      </span>
                      <span>Trigger: {fu.rule_trigger}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDismiss(fu.id)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-medium transition"
                    >
                      Dismiss / Skip
                    </button>
                    <button
                      onClick={() => handleCreateDraft(fu)}
                      className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-bold shadow-md shadow-amber-600/20 flex items-center gap-1.5 transition"
                    >
                      <MailPlus className="w-3.5 h-3.5" />
                      <span>Prepare Follow-Up</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
