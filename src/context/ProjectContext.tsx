import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ProjectConfig,
  Student,
  Team,
  AppView,
  LifecycleStageId,
  CoachSuggestion,
} from '../types';
import {
  DEMO_PROJECT_CONFIG,
  DEMO_STUDENTS,
} from '../data/demoData';
import { generateBalancedTeams } from '../utils/teamBalancer';
import { applyCoachSuggestionToTeam } from '../utils/aiCoachEngine';

interface ProjectContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  projectConfig: ProjectConfig;
  updateProjectConfig: (config: Partial<ProjectConfig>) => void;
  students: Student[];
  addStudent: (student: Omit<Student, 'id'>) => void;
  removeStudent: (id: string) => void;
  loadDemoStudents: () => void;
  clearStudents: () => void;
  teams: Team[];
  selectedTeamId: string;
  setSelectedTeamId: (id: string) => void;
  activeTeam: Team | null;
  overallBalanceScore: number;
  teamsSummary: string;
  isTeamsLocked: boolean;
  isDemoMode: boolean;
  generateTeamsAction: (seedModifier?: number) => boolean;
  lockTeamsAction: () => void;
  updateTeamStage: (teamId: string, stageId: LifecycleStageId) => void;
  updateStageProgress: (
    teamId: string,
    stageId: LifecycleStageId,
    progress: number
  ) => void;
  toggleStageTask: (
    teamId: string,
    stageId: LifecycleStageId,
    taskId: string
  ) => void;
  markStageComplete: (teamId: string, stageId: LifecycleStageId) => void;
  applyCoachAction: (teamId: string, suggestion: CoachSuggestion) => void;
  loadFullDemoProject: () => void;
  resetAll: () => void;
  toast: string | null;
  setToast: (msg: string | null) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'teamsync_ai_state_v1';

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [projectConfig, setProjectConfig] = useState<ProjectConfig>({
    id: 'proj-' + Date.now(),
    name: 'Smart Campus Assistant',
    course: 'Engineering Design',
    targetStudentCount: 12,
    desiredTeamSize: 4,
    deadline: '2026-10-20',
    createdAt: new Date().toISOString(),
  });

  const [students, setStudents] = useState<Student[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [overallBalanceScore, setOverallBalanceScore] = useState<number>(0);
  const [teamsSummary, setTeamsSummary] = useState<string>('');
  const [isTeamsLocked, setIsTeamsLocked] = useState<boolean>(false);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);

  // Auto clear toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Load from localStorage on initial render
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.projectConfig) setProjectConfig(parsed.projectConfig);
        if (parsed.students) setStudents(parsed.students);
        if (parsed.teams) setTeams(parsed.teams);
        if (parsed.selectedTeamId) setSelectedTeamId(parsed.selectedTeamId);
        if (parsed.overallBalanceScore) setOverallBalanceScore(parsed.overallBalanceScore);
        if (parsed.teamsSummary) setTeamsSummary(parsed.teamsSummary);
        if (parsed.isTeamsLocked !== undefined) setIsTeamsLocked(parsed.isTeamsLocked);
        if (parsed.isDemoMode !== undefined) setIsDemoMode(parsed.isDemoMode);
        if (parsed.currentView && parsed.currentView !== 'landing') {
          setCurrentView(parsed.currentView);
        }
      }
    } catch {
      // Ignore parsing errors and keep initial state
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      const stateToSave = {
        projectConfig,
        students,
        teams,
        selectedTeamId,
        overallBalanceScore,
        teamsSummary,
        isTeamsLocked,
        isDemoMode,
        currentView,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch {
      // LocalStorage quota or access error handled silently
    }
  }, [
    projectConfig,
    students,
    teams,
    selectedTeamId,
    overallBalanceScore,
    teamsSummary,
    isTeamsLocked,
    isDemoMode,
    currentView,
  ]);

  const updateProjectConfig = (patch: Partial<ProjectConfig>) => {
    setProjectConfig((prev) => ({ ...prev, ...patch }));
  };

  const addStudent = (studentData: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...studentData,
      id: `std-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    setStudents((prev) => [...prev, newStudent]);
    setToast(`Added student: ${newStudent.name}`);
  };

  const removeStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  const loadDemoStudents = () => {
    setStudents([...DEMO_STUDENTS]);
    setToast('Loaded 12 diverse sample students');
  };

  const clearStudents = () => {
    setStudents([]);
    setTeams([]);
    setSelectedTeamId('');
    setIsTeamsLocked(false);
    setToast('Student roster cleared');
  };

  const generateTeamsAction = (seedModifier = 0): boolean => {
    if (students.length === 0) {
      setToast('Please add students first.');
      return false;
    }
    if (students.length < projectConfig.desiredTeamSize) {
      setToast(`Add at least ${projectConfig.desiredTeamSize} students to form teams.`);
      return false;
    }

    const result = generateBalancedTeams(
      students,
      projectConfig.desiredTeamSize,
      projectConfig.deadline,
      seedModifier
    );

    setTeams(result.teams);
    setOverallBalanceScore(result.overallBalanceScore);
    setTeamsSummary(result.summaryExplanation);

    if (result.teams.length > 0) {
      setSelectedTeamId(result.teams[0].id);
    }
    return true;
  };

  const lockTeamsAction = () => {
    setIsTeamsLocked(true);
    setToast('Teams locked! Proceeding to Dashboard.');
    setCurrentView('dashboard');
  };

  const updateTeamStage = (teamId: string, stageId: LifecycleStageId) => {
    setTeams((prev) =>
      prev.map((t) => {
        if (t.id !== teamId) return t;
        return {
          ...t,
          currentStageId: stageId,
        };
      })
    );
  };

  const updateStageProgress = (
    teamId: string,
    stageId: LifecycleStageId,
    progress: number
  ) => {
    setTeams((prev) =>
      prev.map((t) => {
        if (t.id !== teamId) return t;
        const currentStage = t.lifecycle[stageId];
        const status = progress >= 100 ? 'completed' : progress > 0 ? 'in_progress' : 'pending';
        return {
          ...t,
          lifecycle: {
            ...t.lifecycle,
            [stageId]: {
              ...currentStage,
              progress,
              status,
            },
          },
        };
      })
    );
  };

  const toggleStageTask = (
    teamId: string,
    stageId: LifecycleStageId,
    taskId: string
  ) => {
    setTeams((prev) =>
      prev.map((t) => {
        if (t.id !== teamId) return t;
        const currentStage = t.lifecycle[stageId];
        const updatedChecklist = currentStage.checklist.map((task) => {
          if (task.id !== taskId) return task;
          return { ...task, completed: !task.completed };
        });

        // Recalculate progress based on checked tasks
        const total = updatedChecklist.length;
        const completed = updatedChecklist.filter((x) => x.completed).length;
        const newProgress = total > 0 ? Math.round((completed / total) * 100) : currentStage.progress;
        const status = newProgress >= 100 ? 'completed' : newProgress > 0 ? 'in_progress' : 'pending';

        return {
          ...t,
          lifecycle: {
            ...t.lifecycle,
            [stageId]: {
              ...currentStage,
              checklist: updatedChecklist,
              progress: newProgress,
              status,
            },
          },
        };
      })
    );
  };

  const markStageComplete = (teamId: string, stageId: LifecycleStageId) => {
    setTeams((prev) =>
      prev.map((t) => {
        if (t.id !== teamId) return t;
        const currentStage = t.lifecycle[stageId];
        const completedTasks = currentStage.checklist.map((tsk) => ({
          ...tsk,
          completed: true,
        }));

        // Determine next stage
        const stageOrder: LifecycleStageId[] = ['define', 'plan', 'build', 'test', 'submit'];
        const currentIndex = stageOrder.indexOf(stageId);
        let nextStageId = t.currentStageId;
        if (currentIndex < stageOrder.length - 1) {
          nextStageId = stageOrder[currentIndex + 1];
        }

        const nextStageObj = t.lifecycle[nextStageId];

        return {
          ...t,
          currentStageId: nextStageId,
          lifecycle: {
            ...t.lifecycle,
            [stageId]: {
              ...currentStage,
              progress: 100,
              status: 'completed',
              checklist: completedTasks,
            },
            ...(nextStageId !== stageId
              ? {
                  [nextStageId]: {
                    ...nextStageObj,
                    status: 'in_progress',
                    progress: Math.max(10, nextStageObj.progress),
                  },
                }
              : {}),
          },
        };
      })
    );
    setToast(`Marked ${stageId.toUpperCase()} stage complete!`);
  };

  const applyCoachAction = (teamId: string, suggestion: CoachSuggestion) => {
    setTeams((prev) =>
      prev.map((t) => {
        if (t.id !== teamId) return t;
        return applyCoachSuggestionToTeam(t, suggestion);
      })
    );
    setToast(`Applied suggestion: "${suggestion.title}"`);
  };

  const loadFullDemoProject = () => {
    setProjectConfig({ ...DEMO_PROJECT_CONFIG });
    setStudents([...DEMO_STUDENTS]);
    const result = generateBalancedTeams(
      DEMO_STUDENTS,
      DEMO_PROJECT_CONFIG.desiredTeamSize,
      DEMO_PROJECT_CONFIG.deadline,
      42
    );

    // Make Team 03 the active team as highlighted in user prompt example
    // In section 10:
    // Project: Smart Campus Assistant
    // Team: Team 03
    // Current Stage: BUILD
    // Progress: 65%
    // Deadline: 20 Oct 2026
    // Skill Balance: 87%
    if (result.teams.length >= 3) {
      result.teams[2].name = 'Team 03';
      result.teams[2].skillBalanceScore = 87;
      result.teams[2].currentStageId = 'build';
      result.teams[2].lifecycle.build.progress = 65;
      result.teams[2].lifecycle.build.status = 'in_progress';
      setSelectedTeamId(result.teams[2].id);
    } else if (result.teams.length > 0) {
      setSelectedTeamId(result.teams[0].id);
    }

    setTeams(result.teams);
    setOverallBalanceScore(87);
    setTeamsSummary(
      'Formed 3 balanced teams averaging 87% skill equilibrium. Technical skills, leadership presence, and preferred roles were distributed without single-skill clustering.'
    );
    setIsTeamsLocked(true);
    setIsDemoMode(true);
    setCurrentView('dashboard');
    setToast('Demo project loaded: Smart Campus Assistant');
  };

  const resetAll = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setProjectConfig({
      id: 'proj-' + Date.now(),
      name: 'Smart Campus Assistant',
      course: 'Engineering Design',
      targetStudentCount: 12,
      desiredTeamSize: 4,
      deadline: '2026-10-20',
      createdAt: new Date().toISOString(),
    });
    setStudents([]);
    setTeams([]);
    setSelectedTeamId('');
    setOverallBalanceScore(0);
    setTeamsSummary('');
    setIsTeamsLocked(false);
    setIsDemoMode(false);
    setCurrentView('landing');
    setToast('Application reset to initial state');
  };

  const activeTeam = teams.find((t) => t.id === selectedTeamId) || teams[0] || null;

  return (
    <ProjectContext.Provider
      value={{
        currentView,
        setCurrentView,
        projectConfig,
        updateProjectConfig,
        students,
        addStudent,
        removeStudent,
        loadDemoStudents,
        clearStudents,
        teams,
        selectedTeamId,
        setSelectedTeamId,
        activeTeam,
        overallBalanceScore,
        teamsSummary,
        isTeamsLocked,
        isDemoMode,
        generateTeamsAction,
        lockTeamsAction,
        updateTeamStage,
        updateStageProgress,
        toggleStageTask,
        markStageComplete,
        applyCoachAction,
        loadFullDemoProject,
        resetAll,
        toast,
        setToast,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
