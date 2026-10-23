import React from 'react';
import { useApp, NavTab } from '../../context/AppContext';
import {
  LayoutDashboard,
  Compass,
  Building2,
  Sparkles,
  KanbanSquare,
  Send,
  CalendarClock,
  UserCheck,
  Settings,
  ShieldAlert,
  GraduationCap,
  MapPin,
} from 'lucide-react';

interface NavItem {
  id: NavTab;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, metrics, isGlobalPaused } = useApp();

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'discovery', label: 'Opportunity Search', icon: Compass, badge: metrics?.totalOpportunities },
    { id: 'research', label: 'Company Research', icon: Building2, badge: metrics?.totalCompanies },
    { id: 'generator', label: 'Personalized Email AI', icon: Sparkles },
    { id: 'tracker', label: 'Application CRM', icon: KanbanSquare, badge: metrics?.pipeline?.reduce((acc, p) => acc + p.count, 0) || 0 },
    { id: 'batch', label: 'Batch Outreach Queue', icon: Send, badge: metrics?.draftsCount },
    { id: 'followups', label: 'Follow-Up Pipeline', icon: CalendarClock, badge: metrics?.upcomingFollowUps },
    { id: 'profile', label: 'Profile & Multi-CV', icon: UserCheck },
    { id: 'settings', label: 'Settings & Audit Log', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0d1322] border-r border-slate-800 flex flex-col justify-between shrink-0 select-none">
      {/* App Branding */}
      <div>
        <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-white font-extrabold text-base tracking-wider">PL</span>
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
              Poland Hunter
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                2027
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">Internship & Outreach OS</p>
          </div>
        </div>

        {/* Global Pause Alert Pill if active */}
        {isGlobalPaused && (
          <div className="mx-3 mt-3 px-3 py-2 bg-rose-500/10 border border-rose-500/30 rounded-lg flex items-center gap-2 text-rose-300 text-xs font-semibold animate-pulse">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
            <span>DISPATCH PAUSED</span>
          </div>
        )}

        {/* Navigation list */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600/90 to-purple-600/90 text-white shadow-md shadow-indigo-600/20 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && Number(item.badge) > 0 ? (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Student Profile Card Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/40">
        <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 text-slate-300 space-y-1.5">
          <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-200">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
            <span className="truncate">IPCA • Web Multimedia</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
            <MapPin className="w-3 h-3 text-purple-400" />
            <span>Kraków • Warsaw • Gdańsk</span>
          </div>
          <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-800/60 font-mono">
            <span>Spring 2027</span>
            <span className="text-emerald-400 font-semibold">● SQLite Ready</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
