import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { Settings, RotateCcw, Sparkles, Save, Check } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    projectConfig,
    updateProjectConfig,
    loadFullDemoProject,
    resetAll,
    setToast,
  } = useProject();

  const [name, setName] = useState(projectConfig.name);
  const [course, setCourse] = useState(projectConfig.course);
  const [desiredTeamSize, setDesiredTeamSize] = useState(projectConfig.desiredTeamSize);
  const [deadline, setDeadline] = useState(projectConfig.deadline);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProjectConfig({
      name: name.trim(),
      course: course.trim(),
      desiredTeamSize: Number(desiredTeamSize),
      deadline,
    });
    setSaved(true);
    setToast('Project settings saved.');
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full space-y-6">
      <div className="pb-4 border-b border-gray-200">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          Project Settings
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage project parameters, deadlines, and application state.
        </p>
      </div>

      {/* Main Settings Card */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200/90 shadow-card">
        <h2 className="text-base font-semibold text-gray-900 mb-4">
          General Parameters
        </h2>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Project Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Course / Subject
            </label>
            <input
              type="text"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Desired Team Size
              </label>
              <input
                type="number"
                min="2"
                max="8"
                value={desiredTeamSize}
                onChange={(e) => setDesiredTeamSize(parseInt(e.target.value) || 2)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Project Deadline
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold transition shadow-subtle"
            >
              {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{saved ? 'Saved!' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Demo & Data Management Card */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200/90 shadow-card space-y-4">
        <h2 className="text-base font-semibold text-gray-900">
          Demo & Data Management
        </h2>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200/80">
          <div>
            <div className="text-xs font-bold text-gray-900">
              Reload Demo State
            </div>
            <div className="text-xs text-gray-500">
              Load 12 sample students, balanced teams, and Team 03 at 65% BUILD stage.
            </div>
          </div>

          <button
            type="button"
            onClick={loadFullDemoProject}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-medium border border-indigo-200 hover:bg-indigo-100 transition shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Demo Project</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-rose-50/50 rounded-xl border border-rose-200/80">
          <div>
            <div className="text-xs font-bold text-rose-900">
              Reset Application
            </div>
            <div className="text-xs text-rose-700/80">
              Clear all students, generated teams, and lifecycle history.
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Are you sure you want to reset all data and return to start?')) {
                resetAll();
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white text-rose-700 text-xs font-semibold border border-rose-300 hover:bg-rose-50 transition shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Everything</span>
          </button>
        </div>
      </div>
    </div>
  );
};
