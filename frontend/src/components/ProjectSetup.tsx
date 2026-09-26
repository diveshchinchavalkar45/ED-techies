import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { ArrowRight, Calendar, Users, BookOpen, Layers } from 'lucide-react';

export const ProjectSetup: React.FC = () => {
  const { projectConfig, updateProjectConfig, setCurrentView, loadDemoStudents, students } =
    useProject();

  const [name, setName] = useState(projectConfig.name || 'Smart Campus Assistant');
  const [course, setCourse] = useState(projectConfig.course || 'Engineering Design');
  const [targetStudentCount, setTargetStudentCount] = useState<number>(
    projectConfig.targetStudentCount || 12
  );
  const [desiredTeamSize, setDesiredTeamSize] = useState<number>(
    projectConfig.desiredTeamSize || 4
  );
  const [deadline, setDeadline] = useState(projectConfig.deadline || '2026-10-20');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Please provide a project name.');
      return;
    }
    if (!course.trim()) {
      setError('Please enter the course or subject name.');
      return;
    }
    if (desiredTeamSize < 2 || desiredTeamSize > 10) {
      setError('Team size must be between 2 and 10 students.');
      return;
    }
    if (!deadline) {
      setError('Please set a project deadline.');
      return;
    }

    setError(null);
    updateProjectConfig({
      name: name.trim(),
      course: course.trim(),
      targetStudentCount: Number(targetStudentCount),
      desiredTeamSize: Number(desiredTeamSize),
      deadline,
    });

    setCurrentView('students');
  };

  const calculatedTeamsCount = Math.max(1, Math.round(targetStudentCount / desiredTeamSize));

  return (
    <div className="flex-1 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 max-w-xl mx-auto w-full">
      {/* Header & Step progress */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-2">
          <span>Step 1 of 3</span>
          <span className="text-gray-300">•</span>
          <span className="text-gray-500">Project Configuration</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          Create New Project
        </h1>
        <p className="mt-1.5 text-sm text-gray-500">
          Set up project details and group boundaries before adding students.
        </p>
      </div>

      {/* Form Container */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200/90 shadow-card">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
              {error}
            </div>
          )}

          {/* Project Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Project Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Smart Campus Assistant"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Course / Subject */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Course / Subject
            </label>
            <div className="relative">
              <input
                type="text"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                placeholder="e.g. Engineering Design"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Student Count & Team Size */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Expected Students
              </label>
              <input
                type="number"
                min="2"
                max="100"
                value={targetStudentCount}
                onChange={(e) => setTargetStudentCount(parseInt(e.target.value) || 2)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Desired Team Size
              </label>
              <input
                type="number"
                min="2"
                max="8"
                value={desiredTeamSize}
                onChange={(e) => setDesiredTeamSize(parseInt(e.target.value) || 2)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Helper projection pill */}
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/80 flex items-center justify-between text-xs text-gray-600">
            <span>Projected Teams:</span>
            <span className="font-semibold text-indigo-600">
              ~{calculatedTeamsCount} teams ({desiredTeamSize} members each)
            </span>
          </div>

          {/* Project Deadline */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Project Deadline
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>

          {/* Primary Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-700 transition shadow-subtle focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Back to landing */}
      <div className="mt-4 text-center">
        <button
          onClick={() => setCurrentView('landing')}
          className="text-xs text-gray-500 hover:text-gray-800 transition"
        >
          ← Back to Overview
        </button>
      </div>
    </div>
  );
};
