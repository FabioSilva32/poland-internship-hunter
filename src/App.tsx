import React from 'react';
import { useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './components/dashboard/Dashboard';
import { Discovery } from './components/discovery/Discovery';
import { CompanyResearch } from './components/research/CompanyResearch';
import { EmailGenerator } from './components/generator/EmailGenerator';
import { ApplicationTracker } from './components/tracker/ApplicationTracker';
import { BatchOutreach } from './components/batch/BatchOutreach';
import { FollowUpPipeline } from './components/followups/FollowUpPipeline';
import { ProfileManager } from './components/profile/ProfileManager';
import { SettingsManager } from './components/settings/SettingsManager';

export const App: React.FC = () => {
  const { activeTab } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'discovery':
        return <Discovery />;
      case 'research':
        return <CompanyResearch />;
      case 'generator':
        return <EmailGenerator />;
      case 'tracker':
        return <ApplicationTracker />;
      case 'batch':
        return <BatchOutreach />;
      case 'followups':
        return <FollowUpPipeline />;
      case 'profile':
        return <ProfileManager />;
      case 'settings':
        return <SettingsManager />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#090d16] text-slate-100 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 flex overflow-hidden">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};

export default App;
