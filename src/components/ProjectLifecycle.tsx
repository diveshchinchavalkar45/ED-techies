import React from 'react';
import { useProject } from '../context/ProjectContext';
import { Team, LifecycleStageId, LifecycleStage } from '../types';
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  Circle,
  Calendar,
  Check,
  Lightbulb,
} from 'lucide-react';

interface ProjectLifecycleProps {
  team: Team;
}

export const ProjectLifecycle: React.FC<ProjectLifecycleProps> = ({ team }) => {
  const {
    updateTeamStage,
    updateStageProgress,
    toggleStageTask,
    markStageComplete,
  } = useProject();

  const stagesOrder: LifecycleStageId[] = ['define', 'plan', 'build', 'test', 'submit'];
  const activeStage = team.lifecycle[team.currentStageId];

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 p-5 shadow-card space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-100">
        <div>
          <h3 className="text-base font-bold text-gray-900 tracking-tight">
            Project Lifecycle
          </h3>
          <p className="text-xs text-gray-500">
            Linear 5-stage progression from definition to course submission.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Current Phase:</span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
            {activeStage.name}
          </span>
        </div>
      </div>

      {/* Linear Stepper Navigation */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {stagesOrder.map((stageId, index) => {
          const stage = team.lifecycle[stageId];
          const isCurrent = team.currentStageId === stageId;
          const isDone = stage.status === 'completed';

          return (
            <button
              key={stageId}
              type="button"
              onClick={() => updateTeamStage(team.id, stageId)}
              className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                isCurrent
                  ? 'border-indigo-600 bg-indigo-50/50 shadow-subtle ring-1 ring-indigo-500/20'
                  : isDone
                  ? 'border-emerald-200 bg-emerald-50/30 hover:bg-emerald-50/60'
                  : 'border-gray-200 bg-gray-50/50 hover:bg-gray-100/70'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono font-bold text-gray-400">
                  0{index + 1}
                </span>
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : isCurrent ? (
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                ) : (
                  <Circle className="w-3 h-3 text-gray-300" />
                )}
              </div>

              <div>
                <div
                  className={`text-xs font-semibold truncate ${
                    isCurrent
                      ? 'text-indigo-950 font-bold'
                      : isDone
                      ? 'text-emerald-900'
                      : 'text-gray-700'
                  }`}
                >
                  {stage.name}
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5">
                  {stage.progress}%
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Stage Detailed Card */}
      <div className="bg-gray-50/70 rounded-xl p-5 border border-gray-200/80 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-200/60">
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Active Stage Focus
            </div>
            <div className="text-lg font-bold text-gray-900">
              {activeStage.name.toUpperCase()}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[11px] text-gray-400">Status</div>
              <div className="text-xs font-semibold capitalize text-gray-800">
                {activeStage.status.replace('_', ' ')}
              </div>
            </div>

            <div className="text-right">
              <div className="text-[11px] text-gray-400">Target Date</div>
              <div className="text-xs font-semibold text-gray-800">
                {activeStage.targetDate}
              </div>
            </div>
          </div>
        </div>

        {/* Concrete Task */}
        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Task
          </div>
          <div className="text-sm font-medium text-gray-900 bg-white p-3 rounded-lg border border-gray-200">
            "{activeStage.task}"
          </div>
        </div>

        {/* Progress Slider & Value */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Stage Progress
            </label>
            <span className="text-xs font-bold text-indigo-600 font-mono">
              {activeStage.progress}%
            </span>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="100"
              value={activeStage.progress}
              onChange={(e) =>
                updateStageProgress(team.id, activeStage.id, parseInt(e.target.value))
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
        </div>

        {/* Checklist */}
        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Stage Deliverables & Verification
          </div>
          <div className="space-y-1.5">
            {activeStage.checklist.map((task) => (
              <label
                key={task.id}
                className="flex items-center gap-3 p-2.5 rounded-lg bg-white border border-gray-200 hover:border-gray-300 transition cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleStageTask(team.id, activeStage.id, task.id)}
                  className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 cursor-pointer"
                />
                <span
                  className={`text-xs flex-1 ${
                    task.completed
                      ? 'line-through text-gray-400'
                      : 'text-gray-800 font-medium'
                  }`}
                >
                  {task.text}
                </span>
                {task.assignee && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-medium">
                    {task.assignee}
                  </span>
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Stage Suggestions / Tips */}
        {activeStage.tips && activeStage.tips.length > 0 && (
          <div className="bg-white p-3 rounded-lg border border-gray-200/90 text-xs text-gray-600 space-y-1">
            <div className="font-semibold text-gray-700 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Stage Tips:</span>
            </div>
            {activeStage.tips.map((tip, idx) => (
              <div key={idx} className="text-gray-600 pl-5 relative">
                <span className="absolute left-1.5 text-gray-400">•</span>
                {tip}
              </div>
            ))}
          </div>
        )}

        {/* Mark Complete Action Button */}
        <div className="pt-2 flex items-center justify-end">
          <button
            type="button"
            onClick={() => markStageComplete(team.id, activeStage.id)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs sm:text-sm font-semibold transition shadow-subtle"
          >
            <Check className="w-4 h-4" />
            <span>Mark Complete & Advance</span>
          </button>
        </div>
      </div>
    </div>
  );
};
