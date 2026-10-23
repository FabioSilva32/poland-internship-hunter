import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, DashboardMetrics } from '../types';

export type NavTab = 
  | 'dashboard'
  | 'discovery'
  | 'research'
  | 'generator'
  | 'tracker'
  | 'batch'
  | 'followups'
  | 'profile'
  | 'settings';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

interface AppContextType {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  selectedCompanyId: string | null;
  setSelectedCompanyId: (id: string | null) => void;
  selectedOpportunityId: string | null;
  setSelectedOpportunityId: (id: string | null) => void;
  profile: UserProfile | null;
  metrics: DashboardMetrics | null;
  refreshMetrics: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  isGlobalPaused: boolean;
  toggleGlobalPause: () => Promise<void>;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  dismissToast: (id: string) => void;
  openExternal: (url: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>('comp-bloober');
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isGlobalPaused, setIsGlobalPaused] = useState<boolean>(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = 'toast-' + Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const openExternal = (url: string) => {
    if (window.desktopAPI?.openExternal) {
      window.desktopAPI.openExternal(url);
    } else {
      window.open(url, '_blank');
    }
  };

  const refreshMetrics = async () => {
    if (window.desktopAPI?.getDashboardMetrics) {
      try {
        const data = await window.desktopAPI.getDashboardMetrics();
        setMetrics(data);
      } catch (err: any) {
        console.error('Failed to load dashboard metrics:', err);
      }
    }
  };

  const refreshProfile = async () => {
    if (window.desktopAPI?.getUserProfile) {
      try {
        const data = await window.desktopAPI.getUserProfile();
        setProfile(data);
      } catch (err: any) {
        console.error('Failed to load profile:', err);
      }
    }
  };

  const toggleGlobalPause = async () => {
    if (window.desktopAPI?.setGlobalPause) {
      try {
        const nextState = !isGlobalPaused;
        const res = await window.desktopAPI.setGlobalPause(nextState);
        setIsGlobalPaused(res.isPaused);
        showToast(
          res.isPaused ? 'EMERGENCY PAUSE ACTIVE: Outgoing email dispatch is halted.' : 'Dispatch resumed: Email sending is operational.',
          res.isPaused ? 'warning' : 'success'
        );
      } catch (err: any) {
        showToast('Error changing pause status: ' + err.message, 'error');
      }
    }
  };

  useEffect(() => {
    refreshMetrics();
    refreshProfile();

    if (window.desktopAPI?.getGlobalPause) {
      window.desktopAPI.getGlobalPause().then((res: any) => {
        setIsGlobalPaused(res.isPaused);
      });
    }

    let unsubAutoSync: any = null;
    if (window.desktopAPI?.onAutoUpdateCompleted) {
      unsubAutoSync = window.desktopAPI.onAutoUpdateCompleted((data: any) => {
        refreshMetrics();
        if (data.newOpportunities > 0 || data.newCompanies > 0) {
          showToast(`Scheduled Sync: Found ${data.newOpportunities} new opportunities & ${data.newCompanies} new companies!`, 'success');
        } else {
          showToast('Scheduled Background Sync completed: Database up to date.', 'info');
        }
      });
    }

    return () => {
      if (unsubAutoSync) unsubAutoSync();
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedCompanyId,
        setSelectedCompanyId,
        selectedOpportunityId,
        setSelectedOpportunityId,
        profile,
        metrics,
        refreshMetrics,
        refreshProfile,
        isGlobalPaused,
        toggleGlobalPause,
        toasts,
        showToast,
        dismissToast,
        openExternal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
