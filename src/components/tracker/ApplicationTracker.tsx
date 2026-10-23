import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Application, ApplicationStatus } from '../../types';
import {
  KanbanSquare,
  Table,
  Plus,
  Search,
  Filter,
  Download,
  Calendar,
  Building2,
  Mail,
  User,
  ArrowRight,
  MoreVertical,
  CheckCircle,
  Clock,
  Sparkles,
} from 'lucide-react';

const ALL_STATUSES: ApplicationStatus[] = [
  'Discovered',
  'Researching',
  'Ready to contact',
  'Draft prepared',
  'Awaiting approval',
  'Email sent',
  'Follow-up due',
  'Replied',
  'Interview',
  'Offer received',
  'Rejected',
  'Withdrawn',
  'No response',
  'Not suitable',
];

export const ApplicationTracker: React.FC = () => {
  const { showToast, refreshMetrics, setActiveTab, setSelectedCompanyId } = useApp();

  const [applications, setApplications] = useState<Application[]>([]);
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [search, setSearch] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);

  // New Application Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newCompanyId, setNewCompanyId] = useState<string>('comp-cdpr');
  const [newRole, setNewRole] = useState<string>('Web & Frontend Intern');
  const [newCity, setNewCity] = useState<string>('Kraków');
  const [newStatus, setNewStatus] = useState<ApplicationStatus>('Ready to contact');

  const loadApplications = async () => {
    setLoading(true);
    if (window.desktopAPI?.getApplications) {
      try {
        const data = await window.desktopAPI.getApplications({
          status: selectedStatus === 'All' ? undefined : selectedStatus,
          search,
        });
        setApplications(data);
      } catch (err: any) {
        showToast('Error loading applications: ' + err.message, 'error');
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadApplications();
  }, [selectedStatus, search]);

  const handleStatusChange = async (appId: string, status: ApplicationStatus) => {
    if (window.desktopAPI?.updateApplicationStatus) {
      try {
        await window.desktopAPI.updateApplicationStatus(appId, status);
        showToast(`Moved to "${status}"`, 'success');
        await loadApplications();
        await refreshMetrics();
      } catch (err: any) {
        showToast('Failed to update status: ' + err.message, 'error');
      }
    }
  };

  const handleExportCsv = async () => {
    if (window.desktopAPI?.exportCsv) {
      try {
        const res = await window.desktopAPI.exportCsv('applications');
        if (res.success) {
          showToast(`Exported application tracking report to CSV: ${res.filePath}`, 'success');
        }
      } catch (err: any) {
        showToast('CSV export failed: ' + err.message, 'error');
      }
    }
  };

  const handleCreateApplication = async () => {
    if (!newRole.trim()) {
      showToast('Target role is required.', 'warning');
      return;
    }
    if (window.desktopAPI?.createApplication) {
      try {
        await window.desktopAPI.createApplication({
          company_id: newCompanyId,
          target_role: newRole,
          city: newCity,
          status: newStatus,
          priority: 'High',
          notes: 'Manually logged in CRM',
        });
        showToast('New application record created!', 'success');
        setIsModalOpen(false);
        await loadApplications();
        await refreshMetrics();
      } catch (err: any) {
        showToast('Error creating application: ' + err.message, 'error');
      }
    }
  };

  // Main 6 focus stages for the primary Kanban view columns
  const primaryKanbanColumns: ApplicationStatus[] = [
    'Ready to contact',
    'Draft prepared',
    'Email sent',
    'Follow-up due',
    'Replied',
    'Interview',
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#090d16]">
      {/* Top Toolbar */}
      <div className="p-5 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center rounded-lg bg-slate-800 p-0.5 border border-slate-700 text-xs font-semibold">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition ${
                viewMode === 'kanban' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <KanbanSquare className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition ${
                viewMode === 'table' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter applications..."
              className="pl-8 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500 w-52"
            />
          </div>

          {/* Status Filter for Table View */}
          {viewMode === 'table' && (
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All 14 Statuses</option>
              {ALL_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV Report</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Application</span>
          </button>
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' ? (
        <div className="flex-1 overflow-x-auto p-6 flex gap-4 items-start select-none">
          {primaryKanbanColumns.map((colStatus) => {
            const colApps = applications.filter((a) => a.status === colStatus);

            let headerColor = 'text-slate-300';
            let badgeBg = 'bg-slate-800 text-slate-300';
            if (colStatus === 'Ready to contact') {
              headerColor = 'text-indigo-400';
              badgeBg = 'bg-indigo-500/20 text-indigo-300';
            } else if (colStatus === 'Draft prepared') {
              headerColor = 'text-purple-400';
              badgeBg = 'bg-purple-500/20 text-purple-300';
            } else if (colStatus === 'Email sent') {
              headerColor = 'text-blue-400';
              badgeBg = 'bg-blue-500/20 text-blue-300';
            } else if (colStatus === 'Follow-up due') {
              headerColor = 'text-amber-400';
              badgeBg = 'bg-amber-500/20 text-amber-300';
            } else if (colStatus === 'Replied') {
              headerColor = 'text-cyan-400';
              badgeBg = 'bg-cyan-500/20 text-cyan-300';
            } else if (colStatus === 'Interview') {
              headerColor = 'text-emerald-400';
              badgeBg = 'bg-emerald-500/20 text-emerald-300';
            }

            return (
              <div
                key={colStatus}
                className="w-72 shrink-0 bg-slate-900/50 rounded-2xl border border-slate-800 flex flex-col max-h-full"
              >
                {/* Column Header */}
                <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
                  <span className={`text-xs font-bold ${headerColor}`}>{colStatus}</span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${badgeBg}`}>
                    {colApps.length}
                  </span>
                </div>

                {/* Column Cards */}
                <div className="p-2.5 overflow-y-auto space-y-2.5 flex-1">
                  {colApps.length === 0 ? (
                    <div className="py-8 text-center text-[11px] text-slate-500">
                      No applications in this stage
                    </div>
                  ) : (
                    colApps.map((app) => (
                      <div
                        key={app.id}
                        className="p-3.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-indigo-500/50 transition shadow-sm space-y-2 group"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition">
                              {app.company_name}
                            </h4>
                            <span className="text-[10px] text-slate-400">{app.city}, Poland</span>
                          </div>
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-slate-900 text-slate-300">
                            {app.priority}
                          </span>
                        </div>

                        <div className="text-[11px] font-semibold text-indigo-300 truncate">
                          {app.target_role}
                        </div>

                        {app.notes && (
                          <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                            {app.notes}
                          </p>
                        )}

                        <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between text-[10px] text-slate-400">
                          {app.date_contacted ? (
                            <span className="flex items-center gap-1 font-mono text-emerald-400">
                              <CheckCircle className="w-3 h-3" />
                              Contacted
                            </span>
                          ) : (
                            <span className="text-slate-500">Not contacted</span>
                          )}

                          {/* Quick Stage Move Dropdown */}
                          <select
                            value={app.status}
                            onChange={(e) => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                            className="bg-slate-900 text-slate-300 text-[10px] rounded px-1.5 py-0.5 border border-slate-700 focus:outline-none cursor-pointer"
                          >
                            {ALL_STATUSES.map((st) => (
                              <option key={st} value={st}>
                                → {st}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="flex-1 overflow-y-auto p-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold text-[11px]">
                  <th className="p-3.5">Company</th>
                  <th className="p-3.5">Target Role</th>
                  <th className="p-3.5">City</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Date Contacted</th>
                  <th className="p-3.5">Next Follow-Up</th>
                  <th className="p-3.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3.5 font-bold text-white flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                      {app.company_name}
                    </td>
                    <td className="p-3.5 font-medium text-indigo-300">{app.target_role}</td>
                    <td className="p-3.5 text-slate-300">{app.city}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {app.status}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-slate-400">{app.date_contacted || '—'}</td>
                    <td className="p-3.5 font-mono text-amber-300">{app.next_follow_up_date || '—'}</td>
                    <td className="p-3.5">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                        className="bg-slate-800 text-slate-200 text-xs rounded px-2 py-1 border border-slate-700 focus:outline-none"
                      >
                        {ALL_STATUSES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Application Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white">Add Application to Pipeline</h3>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Target Company</label>
                <select
                  value={newCompanyId}
                  onChange={(e) => setNewCompanyId(e.target.value)}
                  className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200"
                >
                  <option value="comp-cdpr">CD Projekt RED (Warsaw)</option>
                  <option value="comp-bloober">Bloober Team (Kraków)</option>
                  <option value="comp-brainly">Brainly (Kraków)</option>
                  <option value="comp-11bit">11 bit studios (Warsaw)</option>
                  <option value="comp-allegro">Allegro (Warsaw)</option>
                  <option value="comp-netguru">Netguru (Gdańsk)</option>
                  <option value="comp-flyingwildhog">Flying Wild Hog (Kraków)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Target Role</label>
                <input
                  type="text"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">City</label>
                  <select
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200"
                  >
                    <option value="Kraków">Kraków</option>
                    <option value="Warsaw">Warsaw</option>
                    <option value="Gdańsk">Gdańsk</option>
                    <option value="Wrocław">Wrocław</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Initial Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as ApplicationStatus)}
                    className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200"
                  >
                    <option value="Ready to contact">Ready to contact</option>
                    <option value="Draft prepared">Draft prepared</option>
                    <option value="Email sent">Email sent</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateApplication}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md shadow-indigo-600/20"
              >
                Create Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
