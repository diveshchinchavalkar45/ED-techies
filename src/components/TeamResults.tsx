import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import {
  Users,
  RotateCw,
  Lock,
  ArrowRight,
  Sparkles,
  Info,
  CheckCircle,
  Briefcase,
} from 'lucide-react';

export const TeamResults: React.FC = () => {
  const {
    teams,
    overallBalanceScore,
    teamsSummary,
    selectedTeamId,
    setSelectedTeamId,
    setCurrentView,
    generateTeamsAction,
    lockTeamsAction,
    isTeamsLocked,
  } = useProject();

  const [regenSeed, setRegenSeed] = useState(1);

  const handleRegenerate = () => {
    const nextSeed = regenSeed + 1;
    setRegenSeed(nextSeed);
    generateTeamsAction(nextSeed);
  };

  const handleSelectAndNavigate = (teamId: string) => {
    setSelectedTeamId(teamId);
    setCurrentView('dashboard');
  };

  return (
    <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
      {/* Header & Step progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1.5">
            <span>Step 3 of 3</span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-500">Skill-Balanced Team Formation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Generated Project Teams
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Formed via transparent rule-based balancing of technical domains, soft skills, and roles.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="mt-4 sm:mt-0 flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleRegenerate}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-700 text-xs sm:text-sm font-medium hover:bg-gray-50 transition shadow-subtle"
            title="Generate alternative balanced allocation"
          >
            <RotateCw className="w-3.5 h-3.5 text-gray-500" />
            <span>Regenerate</span>
          </button>

          <button
            type="button"
            onClick={lockTeamsAction}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-medium transition shadow-subtle"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock Teams</span>
          </button>
        </div>
      </div>

      {/* "Why these teams?" Rationale Banner */}
      <div className="mb-8 bg-indigo-50/70 border border-indigo-100 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-900">
              Why these teams?
            </div>
            <p className="text-sm text-indigo-950 mt-0.5 max-w-3xl leading-relaxed">
              {teamsSummary ||
                'Teams were balanced to distribute core development, design, and AI specializations while ensuring each group has dedicated coordination and leadership.'}
            </p>
          </div>
        </div>

        <div className="bg-white px-4 py-2.5 rounded-xl border border-indigo-100/80 shadow-subtle shrink-0">
          <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
            Overall Skill Balance
          </div>
          <div className="text-2xl font-black text-indigo-600">
            {overallBalanceScore}%
          </div>
        </div>
      </div>

      {/* Generated Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => {
          const isSelected = team.id === selectedTeamId;
          return (
            <div
              key={team.id}
              className={`bg-white rounded-2xl border transition shadow-card flex flex-col justify-between ${
                isSelected
                  ? 'border-indigo-400 ring-2 ring-indigo-500/20'
                  : 'border-gray-200/90 hover:border-gray-300'
              }`}
            >
              {/* Card Header */}
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono font-bold tracking-wider text-gray-400 uppercase">
                    {team.name}
                  </div>
                  <div className="text-base font-bold text-gray-900">
                    {team.name}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[11px] font-medium text-gray-400 uppercase">
                    Skill Balance
                  </div>
                  <div className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {team.skillBalanceScore}%
                  </div>
                </div>
              </div>

              {/* Members List */}
              <div className="p-5 space-y-4 flex-1">
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Members ({team.members.length})</span>
                  </div>
                  <div className="space-y-2">
                    {team.members.map((member) => {
                      // Primary highlight skill
                      const primarySkill =
                        member.technicalSkills[0] || member.preferredRole;
                      return (
                        <div
                          key={member.id}
                          className="flex items-center justify-between text-xs py-1 border-b border-gray-50 last:border-0"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400">•</span>
                            <span className="font-semibold text-gray-800">
                              {member.name}
                            </span>
                          </div>
                          <span className="text-gray-500 font-medium bg-gray-50 px-2 py-0.5 rounded text-[11px] border border-gray-100">
                            {primarySkill}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Roles Covered */}
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Roles Covered
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {team.coveredRoles.map((role) => (
                      <span
                        key={role}
                        className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[11px] font-medium"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Team Explanation */}
                <div className="pt-2 text-xs text-gray-500 border-t border-gray-100 leading-relaxed italic">
                  "{team.explanation}"
                </div>
              </div>

              {/* Card Footer: View Team Action */}
              <div className="p-4 bg-gray-50/70 border-t border-gray-100 rounded-b-2xl flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleSelectAndNavigate(team.id)}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-gray-200 text-gray-800 text-xs sm:text-sm font-semibold hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition shadow-subtle"
                >
                  <span>View Team Dashboard</span>
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
