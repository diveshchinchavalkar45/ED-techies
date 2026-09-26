import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import {
  POPULAR_TECH_SKILLS,
  POPULAR_SOFT_SKILLS,
  POPULAR_ROLES,
} from '../data/demoData';
import {
  UserPlus,
  Trash2,
  Users,
  Sparkles,
  ArrowRight,
  Plus,
  X,
  RotateCcw,
  Check,
} from 'lucide-react';

export const StudentInput: React.FC = () => {
  const {
    students,
    addStudent,
    removeStudent,
    loadDemoStudents,
    clearStudents,
    generateTeamsAction,
    setCurrentView,
    projectConfig,
  } = useProject();

  // Form states
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [selectedTechSkills, setSelectedTechSkills] = useState<string[]>([
    'Python',
    'Web Development',
  ]);
  const [customTechInput, setCustomTechInput] = useState('');
  const [selectedSoftSkills, setSelectedSoftSkills] = useState<string[]>([
    'Communication',
  ]);
  const [customSoftInput, setCustomSoftInput] = useState('');
  const [preferredRole, setPreferredRole] = useState('Developer');

  // Error feedback
  const [error, setError] = useState<string | null>(null);

  // Toggle skill helpers
  const toggleTechSkill = (skill: string) => {
    setSelectedTechSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const addCustomTech = () => {
    if (customTechInput.trim() && !selectedTechSkills.includes(customTechInput.trim())) {
      setSelectedTechSkills([...selectedTechSkills, customTechInput.trim()]);
      setCustomTechInput('');
    }
  };

  const toggleSoftSkill = (skill: string) => {
    setSelectedSoftSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const addCustomSoft = () => {
    if (customSoftInput.trim() && !selectedSoftSkills.includes(customSoftInput.trim())) {
      setSelectedSoftSkills([...selectedSoftSkills, customSoftInput.trim()]);
      setCustomSoftInput('');
    }
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide the student’s name.');
      return;
    }
    if (selectedTechSkills.length === 0) {
      setError('Select or enter at least one technical skill.');
      return;
    }
    if (selectedSoftSkills.length === 0) {
      setError('Select or enter at least one soft skill.');
      return;
    }

    setError(null);
    addStudent({
      name: name.trim(),
      department: department.trim() || 'General Engineering',
      technicalSkills: selectedTechSkills,
      softSkills: selectedSoftSkills,
      preferredRole,
    });

    // Reset fields for quick successive entries
    setName('');
    // keep department and select smart defaults for next student
    setSelectedTechSkills(['AI/ML']);
    setSelectedSoftSkills(['Problem Solving']);
    setPreferredRole('AI/ML Specialist');
  };

  const handleGenerateTeams = () => {
    if (students.length === 0) {
      setError('Add students before generating teams.');
      return;
    }
    if (students.length < projectConfig.desiredTeamSize) {
      setError(
        `Add at least ${projectConfig.desiredTeamSize} students to create teams (currently ${students.length}).`
      );
      return;
    }

    setError(null);
    const ok = generateTeamsAction(0);
    if (ok) {
      setCurrentView('results');
    }
  };

  const targetTeamsCount = Math.floor(students.length / projectConfig.desiredTeamSize);
  const remainderStudents = students.length % projectConfig.desiredTeamSize;

  return (
    <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
      {/* Header & Step progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1.5">
            <span>Step 2 of 3</span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-500">Student Skill Input</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Collect Student Skills
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Add students with their proficiencies, soft skills, and desired team roles.
          </p>
        </div>

        {/* Quick sample-data buttons */}
        <div className="mt-4 sm:mt-0 flex items-center gap-2">
          <button
            type="button"
            onClick={loadDemoStudents}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-medium border border-indigo-200 hover:bg-indigo-100 transition shadow-subtle"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Demo Students</span>
          </button>

          {students.length > 0 && (
            <button
              type="button"
              onClick={clearStudents}
              className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-gray-100 text-gray-600 text-xs font-medium hover:bg-gray-200 transition"
              title="Clear all students"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Form on Left, Student Roster on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Form (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-200/90 shadow-card">
          <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-indigo-600" />
            <span>Add Student</span>
          </h2>

          {error && (
            <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleAddStudent} className="space-y-4">
            {/* Student Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Student Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Divesh Sen"
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Department / Branch
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Computer Science"
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            {/* Technical Skills Chips */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Technical Skills
                </label>
                <span className="text-[11px] text-gray-400">
                  {selectedTechSkills.length} selected
                </span>
              </div>

              {/* Quick Select Chips */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {POPULAR_TECH_SKILLS.map((skill) => {
                  const isSelected = selectedTechSkills.includes(skill);
                  return (
                    <button
                      type="button"
                      key={skill}
                      onClick={() => toggleTechSkill(skill)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-subtle'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>

              {/* Custom Tech Skill Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customTechInput}
                  onChange={(e) => setCustomTechInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomTech();
                    }
                  }}
                  placeholder="Other tech skill + Enter"
                  className="flex-1 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={addCustomTech}
                  className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs text-gray-700"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Soft Skills Chips */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Soft Skills
                </label>
                <span className="text-[11px] text-gray-400">
                  {selectedSoftSkills.length} selected
                </span>
              </div>

              {/* Quick Select Chips */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {POPULAR_SOFT_SKILLS.map((skill) => {
                  const isSelected = selectedSoftSkills.includes(skill);
                  return (
                    <button
                      type="button"
                      key={skill}
                      onClick={() => toggleSoftSkill(skill)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-subtle'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>

              {/* Custom Soft Skill Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customSoftInput}
                  onChange={(e) => setCustomSoftInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomSoft();
                    }
                  }}
                  placeholder="Other soft skill + Enter"
                  className="flex-1 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={addCustomSoft}
                  className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs text-gray-700"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Preferred Role */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Preferred Role
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {POPULAR_ROLES.map((role) => (
                  <button
                    type="button"
                    key={role}
                    onClick={() => setPreferredRole(role)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-left truncate transition ${
                      preferredRole === role
                        ? 'bg-indigo-50 border border-indigo-300 text-indigo-700 font-semibold'
                        : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 text-white font-medium text-xs sm:text-sm hover:bg-black transition shadow-subtle"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Student</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Student Roster & Balancing Action (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Status Bar */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200/90 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Current Roster
              </div>
              <div className="text-lg font-bold text-gray-900">
                {students.length} Student{students.length === 1 ? '' : 's'} Added
              </div>
              <div className="text-xs text-gray-500">
                Target team size: {projectConfig.desiredTeamSize} students
                {students.length >= projectConfig.desiredTeamSize && (
                  <span className="text-indigo-600 font-medium ml-1">
                    (~{Math.round(students.length / projectConfig.desiredTeamSize)} balanced teams)
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleGenerateTeams}
              disabled={students.length < projectConfig.desiredTeamSize}
              className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition shadow-subtle ${
                students.length >= projectConfig.desiredTeamSize
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <span>Generate Balanced Teams</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Student Cards List */}
          {students.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-300 text-center">
              <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-gray-700 mb-1">
                No students added yet
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
                Enter students manually on the left, or click "Load Demo Students" to populate 12 sample students with realistic skills.
              </p>
              <button
                onClick={loadDemoStudents}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-medium border border-indigo-200 hover:bg-indigo-100 transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Load Demo Students</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
              {students.map((student, idx) => (
                <div
                  key={student.id}
                  className="bg-white p-3.5 rounded-xl border border-gray-200/90 shadow-card hover:border-gray-300 transition flex items-start justify-between gap-3"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-gray-900">
                        {student.name}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                        {student.department}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-medium border border-indigo-100">
                        {student.preferredRole}
                      </span>
                    </div>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-1 text-[11px]">
                      {student.technicalSkills.map((ts) => (
                        <span
                          key={ts}
                          className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100"
                        >
                          {ts}
                        </span>
                      ))}
                      {student.softSkills.map((ss) => (
                        <span
                          key={ss}
                          className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100"
                        >
                          {ss}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => removeStudent(student.id)}
                    className="text-gray-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition"
                    title="Remove student"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
