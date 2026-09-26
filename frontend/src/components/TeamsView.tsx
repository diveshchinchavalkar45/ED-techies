import React from 'react';
import { useProject } from '../context/ProjectContext';
import { Users, RotateCw, Lock, ArrowRight, CheckCircle2, Clock } from 'lucide-react';

export const TeamsView: React.FC = () => {
  const {
    teams,
    selectedTeamId,
    setSelectedTeamId,
    setCurrentView,
    generateTeamsAction,
    overallBalanceScore,
    projectConfig,
  } = useProject();

  const handleSelectTeam = (id: string) => {
    setSelectedTeamId(id);
    setCurrentView('dashboard');
  };

  return (
    <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Project Teams ({teams.length})
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Overview of all active groups for {projectConfig.name}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => generateTeamsAction(Date.now())}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-gray-300 text-gray-700 text-xs sm:text-sm font-medium hover:bg-gray-50 transition shadow-subtle"
          >
            <RotateCw className="w-3.5 h-3.5 text-gray-500" />
            <span>Re-balance</span>
          </button>
        </div>
      </div>

      {/* Grid of all teams */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => {
          const isSelected = team.id === selectedTeamId;
          const currentStage = team.lifecycle[team.currentStageId];

          return (
            <div
              key={team.id}
              className={`bg-white rounded-2xl border transition shadow-card flex flex-col justify-between ${
                isSelected
                  ? 'border-indigo-400 ring-2 ring-indigo-500/20'
                  : 'border-gray-200/90 hover:border-gray-300'
              }`}
            >
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <div className="text-base font-bold text-gray-900">
                    {team.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {team.members.length} Members
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] uppercase font-semibold text-gray-400">
                    Skill Balance
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {team.skillBalanceScore}%
                  </span>
                </div>
              </div>

              {/* Members */}
              <div className="p-5 space-y-4 flex-1">
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Roster
                  </div>
                  <div className="space-y-1.5">
                    {team.members.map((m) => (
                      <div
                        key={m.id}
                        className="flex items-center justify-between text-xs py-1 border-b border-gray-50"
                      >
                        <span className="font-semibold text-gray-800">{m.name}</span>
                        <span className="text-[11px] px-1.5 py-0.5 rounded bg-gray-50 text-gray-600 border border-gray-100">
                          {m.preferredRole}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Current Stage */}
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200/80">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-500 font-medium">Stage:</span>
                    <span className="font-bold text-indigo-700 uppercase">
                      {currentStage.name} ({currentStage.progress}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-1.5 rounded-full"
                      style={{ width: `${currentStage.progress}%` }}
                    />
                  </div>
                </div>

                <div className="text-xs text-gray-500 italic leading-relaxed">
                  "{team.explanation}"
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 bg-gray-50/70 border-t border-gray-100 rounded-b-2xl">
                <button
                  type="button"
                  onClick={() => handleSelectTeam(team.id)}
                  className={`w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                    isSelected
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-white border border-gray-200 text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <span>{isSelected ? 'Active in Dashboard' : 'Open in Dashboard'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
