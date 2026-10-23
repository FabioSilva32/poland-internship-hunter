import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { EmailDraft } from '../../types';
import {
  Send,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Paperclip,
  Clock,
  Building2,
  Mail,
  Eye,
  RefreshCw,
  PauseCircle,
  PlayCircle,
  Sparkles,
} from 'lucide-react';

export const BatchOutreach: React.FC = () => {
  const {
    showToast,
    refreshMetrics,
    isGlobalPaused,
    toggleGlobalPause,
    metrics,
    setActiveTab,
  } = useApp();

  const [drafts, setDrafts] = useState<EmailDraft[]>([]);
  const [selectedDraftIds, setSelectedDraftIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sending, setSending] = useState<boolean>(false);
  const [previewDraft, setPreviewDraft] = useState<EmailDraft | null>(null);

  const loadDrafts = async () => {
    setLoading(true);
    if (window.desktopAPI?.getDrafts) {
      try {
        const data = await window.desktopAPI.getDrafts('draft');
        setDrafts(data);
        // Do not auto-select: default to manual approval!
        setSelectedDraftIds([]);
      } catch (err: any) {
        showToast('Error loading drafts: ' + err.message, 'error');
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadDrafts();
  }, []);

  const handleToggleSelect = (id: string) => {
    if (selectedDraftIds.includes(id)) {
      setSelectedDraftIds(selectedDraftIds.filter((dId) => dId !== id));
    } else {
      setSelectedDraftIds([...selectedDraftIds, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedDraftIds.length === drafts.length) {
      setSelectedDraftIds([]);
    } else {
      setSelectedDraftIds(drafts.map((d) => d.id));
    }
  };

  const handleDispatchBatch = async () => {
    if (selectedDraftIds.length === 0) {
      showToast('Please select at least one approved draft to dispatch.', 'warning');
      return;
    }

    if (isGlobalPaused) {
      showToast('Dispatch is currently PAUSED. Unpause global switch first.', 'error');
      return;
    }

    setSending(true);
    showToast(`Dispatching batch of ${selectedDraftIds.length} personalized emails...`, 'info');

    if (window.desktopAPI?.batchSend) {
      try {
        const results = await window.desktopAPI.batchSend(selectedDraftIds);
        const successes = results.filter((r: any) => r.success).length;
        const failures = results.length - successes;

        if (successes > 0) {
          showToast(`Successfully dispatched ${successes} emails. Next follow-ups scheduled in 7 business days.`, 'success');
        }
        if (failures > 0) {
          showToast(`${failures} emails could not be sent (daily limits or verification errors).`, 'error');
        }

        await loadDrafts();
        await refreshMetrics();
      } catch (err: any) {
        showToast('Batch error: ' + err.message, 'error');
      }
    }
    setSending(false);
  };

  const dailySent = metrics?.sentCount || 0;
  const dailyLimit = 20;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#090d16]">
      {/* Top Controls & Daily Limit Gauge */}
      <div className="p-5 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Send className="w-4 h-4 text-emerald-400" />
            Batch Outreach Review & Approval Screen
          </h3>
          <p className="text-xs text-slate-400">
            Manual approval mandatory for every company. Each recipient is sent an individual message.
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Daily Limit Gauge */}
          <div className="bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-xl flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] text-slate-400 font-medium">Daily Outgoing Limit</div>
              <div className="text-xs font-bold text-slate-200">
                <span className="text-emerald-400">{dailySent}</span> / {dailyLimit} sent today
              </div>
            </div>
            <div className="w-16 h-2 rounded-full bg-slate-700 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${Math.min(100, (dailySent / dailyLimit) * 100)}%` }}
              />
            </div>
          </div>

          {/* Emergency Global Pause Switch */}
          <button
            onClick={toggleGlobalPause}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition ${
              isGlobalPaused
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            {isGlobalPaused ? <PlayCircle className="w-4 h-4 text-rose-400" /> : <PauseCircle className="w-4 h-4 text-emerald-400" />}
            <span>{isGlobalPaused ? 'Paused' : 'Active'}</span>
          </button>

          {/* Dispatch Button */}
          <button
            onClick={handleDispatchBatch}
            disabled={sending || selectedDraftIds.length === 0}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition disabled:opacity-50"
          >
            <Send className={`w-3.5 h-3.5 ${sending ? 'animate-spin' : ''}`} />
            <span>{sending ? 'Dispatching...' : `Dispatch Approved (${selectedDraftIds.length})`}</span>
          </button>
        </div>
      </div>

      {/* Main Review Table */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-indigo-400" />
            <span>Loading pending drafts...</span>
          </div>
        ) : drafts.length === 0 ? (
          <div className="py-16 text-center rounded-2xl border border-dashed border-slate-800 p-8 space-y-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h4 className="text-sm font-semibold text-slate-300">All drafts reviewed or dispatched!</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You can generate new personalized drafts for companies in the "Personalized Email AI" tab.
            </p>
            <button
              onClick={() => setActiveTab('generator')}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold shadow"
            >
              Go to Email Generator
            </button>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-sm">
            <div className="p-3 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-300 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedDraftIds.length === drafts.length && drafts.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-slate-700 text-indigo-600 focus:ring-0 cursor-pointer"
                />
                <span>Approve All ({drafts.length} drafts)</span>
              </label>
              <span className="text-slate-400 text-[11px]">
                {selectedDraftIds.length} approved for immediate dispatch
              </span>
            </div>

            <div className="divide-y divide-slate-800/80">
              {drafts.map((draft) => {
                const isSelected = selectedDraftIds.includes(draft.id);
                return (
                  <div
                    key={draft.id}
                    className={`p-4 flex items-center justify-between gap-4 transition ${
                      isSelected ? 'bg-indigo-950/20' : 'hover:bg-slate-800/40'
                    }`}
                  >
                    {/* Selection Checkbox */}
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(draft.id)}
                        className="rounded border-slate-700 text-indigo-600 focus:ring-0 cursor-pointer w-4 h-4"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{draft.company_name}</span>
                          <span className="text-[10px] text-slate-400">({draft.company_city})</span>
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                            {draft.template_type}
                          </span>
                        </div>
                        <div className="text-xs font-medium text-slate-200 truncate max-w-md">
                          {draft.subject}
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                          <span className="flex items-center gap-1 text-slate-300">
                            <Mail className="w-3 h-3 text-indigo-400" />
                            {draft.recipient_email}
                          </span>
                          {draft.cv_document_id && (
                            <span className="flex items-center gap-1 text-emerald-400">
                              <Paperclip className="w-3 h-3" />
                              CV Attached
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Preview Button */}
                    <button
                      onClick={() => setPreviewDraft(draft)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition border border-slate-700 shrink-0"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      <span>Review Content</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Draft Review Modal */}
      {previewDraft && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">{previewDraft.company_name}</h3>
                <span className="text-xs text-indigo-400 font-mono">{previewDraft.recipient_email}</span>
              </div>
              <button
                onClick={() => setPreviewDraft(null)}
                className="text-slate-400 hover:text-white text-xs font-semibold px-2 py-1 rounded bg-slate-800"
              >
                Close
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="font-semibold text-slate-300">Subject: {previewDraft.subject}</div>
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 font-mono text-[11px] leading-relaxed whitespace-pre-wrap overflow-y-auto max-h-96">
                {previewDraft.body_text}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  if (!selectedDraftIds.includes(previewDraft.id)) {
                    setSelectedDraftIds([...selectedDraftIds, previewDraft.id]);
                  }
                  setPreviewDraft(null);
                  showToast('Draft approved for sending.', 'success');
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-md shadow-emerald-600/20"
              >
                Approve for Dispatch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
