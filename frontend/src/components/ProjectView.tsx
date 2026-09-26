import React from 'react';
import { useProject } from '../context/ProjectContext';
import { ProjectLifecycle } from './ProjectLifecycle';
import { Calendar, BookOpen, Users, Compass, CheckCircle2, Clock } from 'lucide-react';

export const ProjectView: React.FC = () => {
  const { projectConfig, teams, activeTeam, setCurrentView } = useProject();

  if (!activeTeam) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <Compass className="w-12 h-12 text-gray-300 mb-3" />
        <h2 className="text-lg font-bold text-gray-800 mb-1">No Project Configured</h2>
        <button
          onClick={() => setCurrentView('setup')}
          className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700"
        >
          Configure Project
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1">
            <span>Course Project</span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-500">{projectConfig.course}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            {projectConfig.name}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Lifecycle monitoring for {teams.length} teams ending on {projectConfig.deadline}.
          </p>
        </div>
      </div>

      {/* Project Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-card">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Course
          </div>
          <div className="text-base font-bold text-gray-900">
            {projectConfig.course}
          </div>
          <div className="text-xs text-gray-500 mt-1">Academic Department</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-card">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Total Students
          </div>
          <div className="text-base font-bold text-gray-900">
            {teams.reduce((acc, t) => acc + t.members.length, 0)} Active
          </div>
          <div className="text-xs text-gray-500 mt-1">Across {teams.length} teams</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-card">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Team Size Target
          </div>
          <div className="text-base font-bold text-gray-900">
            {projectConfig.desiredTeamSize} Members
          </div>
          <div className="text-xs text-gray-500 mt-1">Balanced skill mix</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-card">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Submission Deadline
          </div>
          <div className="text-base font-bold text-gray-900">
            {projectConfig.deadline}
          </div>
          <div className="text-xs text-indigo-600 font-medium mt-1">Final Submission</div>
        </div>
      </div>

      {/* Focus on Selected Team's Lifecycle */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            Lifecycle Progress for {activeTeam.name}
          </h2>
        </div>
        <ProjectLifecycle team={activeTeam} />
      </div>
    </div>
  );
};
