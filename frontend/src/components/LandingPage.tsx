import React from 'react';
import { useProject } from '../context/ProjectContext';
import { Users, Compass, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentView, loadFullDemoProject } = useProject();

  return (
    <div className="relative flex-1 flex flex-col justify-between py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
      {/* Subtle ambient background team texture */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none opacity-[0.05] bg-center bg-cover"
        style={{ backgroundImage: `url('/hero-team.jpg')` }}
      />

      {/* Top Hero Section */}
      <div className="text-center pt-6 pb-8 sm:pt-10 sm:pb-12 max-w-3xl mx-auto">
        {/* Subtle pill badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200/80 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
          Academic Group Project Optimizer
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-950 tracking-tight leading-[1.12]">
          Build balanced teams.<br />
          <span className="text-indigo-600">Build better projects.</span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto font-normal">
          TeamSync AI intelligently balances student skills and guides teams through every stage of their academic project.
        </p>

        {/* CTA Buttons */}
        <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={() => setCurrentView('setup')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-700 transition shadow-subtle focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <span>Start a Project</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={loadFullDemoProject}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-gray-800 font-medium text-sm border border-gray-300 hover:bg-gray-50 transition shadow-subtle focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            <span>Try Demo</span>
          </button>
        </div>

        {/* Core problem solved badge */}
        <p className="mt-4 text-xs text-gray-400">
          No sign-up required • Instant student skill-balancing • Local prototype
        </p>
      </div>

      {/* Hero Visual Card with Team Photography */}
      <div className="relative my-4 rounded-2xl overflow-hidden border border-gray-200/90 shadow-card bg-white max-w-3xl mx-auto w-full group">
        <div className="relative h-48 sm:h-64 w-full overflow-hidden">
          <img
            src="/hero-team.jpg"
            alt="Students collaborating hands-together"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-950/30 to-transparent flex items-end p-5 sm:p-6">
            <div className="text-white text-left">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/20 backdrop-blur-md text-[11px] font-medium text-white mb-1.5 border border-white/30">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Balanced Peer Chemistry</span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-gray-200 max-w-lg leading-relaxed">
                Empowering university student groups to collaborate, balance cross-functional skills, and hit every milestone together.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Core Features (Strictly as specified) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
        {/* Feature 1 */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200/90 shadow-card hover:border-gray-300 transition">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
            <Users className="w-5 h-5" />
          </div>
          <h2 className="text-base font-semibold text-gray-900 tracking-tight mb-2">
            Skill-Based Teams
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Create balanced teams from student skills and roles.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200/90 shadow-card hover:border-gray-300 transition">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
            <Compass className="w-5 h-5" />
          </div>
          <h2 className="text-base font-semibold text-gray-900 tracking-tight mb-2">
            Simple Lifecycle
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Move from idea to submission with a clear project flow.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200/90 shadow-card hover:border-gray-300 transition">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-base font-semibold text-gray-900 tracking-tight mb-2">
            AI Project Coach
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Get timely suggestions when your team needs direction.
          </p>
        </div>
      </div>

      {/* Academic Focus Note */}
      <div className="text-center py-6 border-t border-gray-200/70 text-xs text-gray-500">
        Designed strictly for college academic group projects and capstone teams.
      </div>
    </div>
  );
};
