import React from 'react';
import { useProject } from '../context/ProjectContext';
import { ProjectLifecycle } from './ProjectLifecycle';
import { AICoachPanel } from './AICoachPanel';
import {
  Calendar,
  Users,
  Compass,
  Award,
  ArrowUpRight,
  Sparkles,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const {
    activeTeam,
    teams,
    selectedTeamId,
    setSelectedTeamId,
    projectConfig,
    setCurrentView,
  } = useProject();

  if (!activeTeam) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <Users className="w-12 h-12 text-gray-300 mb-3" />
        <h2 className="text-lg font-bold text-gray-800 mb-1">No Active Team Selected</h2>
        <p className="text-sm text-gray-500 mb-4">
          Generate teams or load the demo project to view the dashboard.
        </p>
        <button
          onClick={() => setCurrentView('setup')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700"
        >
          Create Project
        </button>
      </div>
    );
  }

  const currentStage = activeTeam.lifecycle[activeTeam.currentStageId];

  return (
    <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Top Main Section Header with Team Backdrop */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-200/90 p-5 sm:p-6 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Subtle background team watermark */}
        <div
          className="absolute right-0 top-0 bottom-0 w-2/5 sm:w-1/3 opacity-15 pointer-events-none bg-cover bg-center [mask-image:linear-gradient(to_left,white,transparent)]"
          style={{ backgroundImage: `url('/hero-team.jpg')` }}
        />

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1">
            <span>Project Dashboard</span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-500">{projectConfig.course}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {projectConfig.name}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            TeamSync AI: Smart teams. Better projects.
          </p>
        </div>

        {/* Quick Team Switcher tabs */}
        {teams.length > 1 && (
          <div className="relative z-10 flex items-center gap-1.5 bg-gray-100/90 p-1 rounded-xl border border-gray-200/80 self-start sm:self-auto">
            {teams.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTeamId(t.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  t.id === selectedTeamId
                    ? 'bg-white text-indigo-700 shadow-subtle'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/40'
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* High-level KPI Cards: Exact Section 10 fields */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* 1. Project */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200/90 shadow-card">
          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Project
          </div>
          <div className="text-sm font-bold text-gray-900 truncate mt-1">
            {projectConfig.name}
          </div>
          <div className="text-[11px] text-gray-500 truncate mt-0.5">
            {projectConfig.course}
          </div>
        </div>

        {/* 2. Team */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200/90 shadow-card">
          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Team
          </div>
          <div className="text-sm font-bold text-indigo-700 truncate mt-1">
            {activeTeam.name}
          </div>
          <div className="text-[11px] text-gray-500 mt-0.5">
            {activeTeam.members.length} Members
          </div>
        </div>

        {/* 3. Current Stage */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200/90 shadow-card">
          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Current Stage
          </div>
          <div className="text-sm font-bold text-gray-900 truncate mt-1 uppercase">
            {currentStage.name}
          </div>
          <div className="text-[11px] text-indigo-600 font-medium capitalize mt-0.5">
            {currentStage.status.replace('_', ' ')}
          </div>
        </div>

        {/* 4. Progress */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200/90 shadow-card">
          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Progress
          </div>
          <div className="text-sm font-bold text-gray-900 mt-1">
            {currentStage.progress}%
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${currentStage.progress}%` }}
            />
          </div>
        </div>

        {/* 5. Deadline */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200/90 shadow-card">
          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Deadline
          </div>
          <div className="text-sm font-bold text-gray-900 truncate mt-1">
            {projectConfig.deadline}
          </div>
          <div className="text-[11px] text-gray-500 mt-0.5">
            Final Submission
          </div>
        </div>

        {/* 6. Skill Balance */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200/90 shadow-card">
          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Skill Balance
          </div>
          <div className="text-sm font-bold text-emerald-700 mt-1">
            {activeTeam.skillBalanceScore}%
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-0.5">
            Equilibrium High
          </div>
        </div>
      </div>

      {/* Main Content: Lifecycle on Left, Coach & Members on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Lifecycle Tracker (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <ProjectLifecycle team={activeTeam} />
        </div>

        {/* Right Column: AI Project Coach & Team Members (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* AI Project Coach */}
          <AICoachPanel team={activeTeam} />

          {/* Team Members List */}
          <div className="bg-white rounded-2xl border border-gray-200/90 p-5 shadow-card">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 tracking-tight flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-500" />
                <span>Team Members ({activeTeam.members.length})</span>
              </h3>
              <span className="text-[11px] text-gray-400">
                {activeTeam.coveredRoles.length} Roles Assigned
              </span>
            </div>

            <div className="space-y-3">
              {activeTeam.members.map((member) => (
                <div
                  key={member.id}
                  className="p-3 rounded-xl bg-gray-50/70 border border-gray-200/80 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-gray-900">
                        {member.name}
                      </span>
                      <span className="text-[11px] text-gray-500 ml-2">
                        {member.department}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {member.preferredRole}
                    </span>
                  </div>

                  {/* Skills badges */}
                  <div className="flex flex-wrap gap-1 text-[10px]">
                    {member.technicalSkills.map((ts) => (
                      <span
                        key={ts}
                        className="px-1.5 py-0.5 rounded bg-white text-gray-700 border border-gray-200 font-medium"
                      >
                        {ts}
                      </span>
                    ))}
                    {member.softSkills.map((ss) => (
                      <span
                        key={ss}
                        className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 font-medium"
                      >
                        {ss}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Team Skill Rationale */}
            <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500 leading-relaxed italic">
              "{activeTeam.explanation}"
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
