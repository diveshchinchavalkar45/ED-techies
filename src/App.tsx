import React from 'react';
import { ProjectProvider, useProject } from './context/ProjectContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { ProjectSetup } from './components/ProjectSetup';
import { StudentInput } from './components/StudentInput';
import { TeamResults } from './components/TeamResults';
import { Dashboard } from './components/Dashboard';
import { TeamsView } from './components/TeamsView';
import { ProjectView } from './components/ProjectView';
import { SettingsView } from './components/SettingsView';
import { CheckCircle2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentView, toast } = useProject();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage />;
      case 'setup':
        return <ProjectSetup />;
      case 'students':
        return <StudentInput />;
      case 'results':
        return <TeamResults />;
      case 'dashboard':
        return <Dashboard />;
      case 'teams':
        return <TeamsView />;
      case 'project':
        return <ProjectView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col font-sans text-gray-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Viewport */}
      <main className="flex-1 flex flex-col">
        {renderCurrentView()}
      </main>

      {/* Inline non-intrusive Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-gray-900 text-white text-xs font-medium shadow-lg border border-gray-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toast}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <ProjectProvider>
      <AppContent />
    </ProjectProvider>
  );
}
