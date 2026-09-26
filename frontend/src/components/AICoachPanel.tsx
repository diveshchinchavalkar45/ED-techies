import React from 'react';
import { useProject } from '../context/ProjectContext';
import { Team, CoachSuggestion } from '../types';
import { generateCoachSuggestions } from '../utils/aiCoachEngine';
import { Sparkles, Check, AlertTriangle, ArrowRight, Lightbulb } from 'lucide-react';

interface AICoachPanelProps {
  team: Team;
}

export const AICoachPanel: React.FC<AICoachPanelProps> = ({ team }) => {
  const { applyCoachAction } = useProject();
  const suggestions = generateCoachSuggestions(team);

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 p-5 shadow-card">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 tracking-tight">
              AI Project Coach
            </h3>
            <p className="text-[11px] text-gray-400">
              Autonomous lifecycle guidance for {team.name}
            </p>
          </div>
        </div>

        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          Active Monitor
        </span>
      </div>

      {/* Suggestions List */}
      <div className="space-y-3">
        {suggestions.map((suggestion) => {
          const isWarning = suggestion.priority === 'high';
          return (
            <div
              key={suggestion.id}
              className={`p-3.5 rounded-xl border transition ${
                isWarning
                  ? 'bg-amber-50/50 border-amber-200/80'
                  : 'bg-gray-50/70 border-gray-200/80'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-900">
                  {isWarning ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  ) : (
                    <Lightbulb className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  )}
                  <span>{suggestion.title}</span>
                </div>
                <span className="text-[10px] font-mono text-gray-400 uppercase">
                  {suggestion.stageId}
                </span>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed mb-3">
                {suggestion.description}
              </p>

              {/* Action Button */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-gray-400 italic">
                  Condition: {suggestion.condition}
                </span>
                <button
                  type="button"
                  onClick={() => applyCoachAction(team.id, suggestion)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition shadow-subtle ${
                    isWarning
                      ? 'bg-amber-600 hover:bg-amber-700 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  <span>{suggestion.actionText}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
