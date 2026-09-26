export type LifecycleStageId = 'define' | 'plan' | 'build' | 'test' | 'submit';

export interface Student {
  id: string;
  name: string;
  department: string;
  technicalSkills: string[];
  softSkills: string[];
  preferredRole: string;
}

export interface LifecycleTask {
  id: string;
  text: string;
  completed: boolean;
  assignee?: string;
}

export interface LifecycleStage {
  id: LifecycleStageId;
  name: string;
  order: number;
  status: 'pending' | 'in_progress' | 'completed';
  task: string;
  progress: number; // 0 to 100
  targetDate: string;
  checklist: LifecycleTask[];
  tips: string[];
}

export interface CoachSuggestion {
  id: string;
  stageId: LifecycleStageId;
  condition: string;
  title: string;
  description: string;
  actionText: string;
  actionType: 'assign_roles' | 'prioritize_build' | 'add_tests' | 'review_scope' | 'prep_submission' | 'custom';
  applied: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface Team {
  id: string;
  teamNumber: number;
  name: string;
  members: Student[];
  skillBalanceScore: number; // e.g. 87%
  explanation: string; // "Why these teams?" explanation
  coveredRoles: string[];
  technicalSkillMix: string[];
  softSkillMix: string[];
  currentStageId: LifecycleStageId;
  lifecycle: Record<LifecycleStageId, LifecycleStage>;
  customNotes?: string;
}

export interface ProjectConfig {
  id: string;
  name: string;
  course: string;
  targetStudentCount: number;
  desiredTeamSize: number;
  deadline: string;
  createdAt: string;
}

export type AppView = 
  | 'landing'
  | 'setup'
  | 'students'
  | 'results'
  | 'dashboard'
  | 'teams'
  | 'project'
  | 'settings';
