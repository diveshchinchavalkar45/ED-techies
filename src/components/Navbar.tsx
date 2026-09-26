import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { AppView } from '../types';
import {
  LayoutDashboard,
  Users,
  Compass,
  Settings,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    teams,
    selectedTeamId,
    setSelectedTeamId,
    activeTeam,
    isTeamsLocked,
    isDemoMode,
    resetAll,
    projectConfig,
  } = useProject();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [teamDropdownOpen, setTeamDropdownOpen] = useState(false);

  // If in landing or setup before teams generated, don't show full nav bar tabs
  const showFullNav = teams.length > 0;

  const navItems: { label: string; view: AppView; icon: React.ReactNode }[] = [
    { label: 'Dashboard', view: 'dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Teams', view: 'teams', icon: <Users className="w-4 h-4" /> },
    { label: 'Project', view: 'project', icon: <Compass className="w-4 h-4" /> },
    { label: 'Settings', view: 'settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('landing')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-semibold text-lg shadow-sm group-hover:bg-indigo-700 transition">
                T
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900 tracking-tight text-base sm:text-lg">
                    TeamSync <span className="text-indigo-600 font-extrabold">AI</span>
                  </span>
                  {isDemoMode && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                      Demo
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-500 font-normal hidden sm:block">
                  Smart teams. Better projects.
                </p>
              </div>
            </button>
          </div>

          {/* Navigation Links (Desktop) */}
          {showFullNav && (
            <nav className="hidden md:flex items-center gap-1 bg-gray-100/80 p-1 rounded-xl border border-gray-200/60">
              {navItems.map((item) => {
                const isActive = currentView === item.view;
                return (
                  <button
                    key={item.view}
                    onClick={() => {
                      setCurrentView(item.view);
                    }}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition ${
                      isActive
                        ? 'bg-white text-gray-900 shadow-subtle'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right Action Area */}
          <div className="flex items-center gap-3">
            {/* Team Selector if multiple teams exist */}
            {teams.length > 0 && currentView !== 'landing' && (
              <div className="relative">
                <button
                  onClick={() => setTeamDropdownOpen(!teamDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-gray-50 border border-gray-200 text-gray-800 hover:bg-gray-100 transition"
                >
                  <span className="text-gray-500 hidden sm:inline">Active:</span>
                  <span className="font-semibold text-indigo-700">{activeTeam?.name || 'Select Team'}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                </button>

                {teamDropdownOpen && (
                  <div
                    className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50 animate-in fade-in"
                    onMouseLeave={() => setTeamDropdownOpen(false)}
                  >
                    <div className="px-3 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                      Select Project Team
                    </div>
                    {teams.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setSelectedTeamId(t.id);
                          setTeamDropdownOpen(false);
                          if (currentView !== 'dashboard' && currentView !== 'project') {
                            setCurrentView('dashboard');
                          }
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs sm:text-sm text-left hover:bg-gray-50 transition ${
                          t.id === selectedTeamId
                            ? 'bg-indigo-50/70 text-indigo-700 font-semibold'
                            : 'text-gray-700'
                        }`}
                      >
                        <span>{t.name}</span>
                        <span className="text-[11px] text-gray-500">{t.skillBalanceScore}% Bal</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Quick Flow Jumpers or Reset */}
            {currentView === 'landing' ? (
              <button
                onClick={() => setCurrentView('setup')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-subtle"
              >
                <span>Start Project</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  if (window.confirm('Reset project and return to landing page?')) {
                    resetAll();
                  }
                }}
                title="Reset application"
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}

            {/* Mobile Hamburger */}
            {showFullNav && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && showFullNav && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => {
                setCurrentView(item.view);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${
                currentView === item.view
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-gray-100">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                resetAll();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-gray-800"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Project
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
