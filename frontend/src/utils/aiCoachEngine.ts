import { Team, CoachSuggestion, LifecycleStageId, LifecycleTask } from '../types';

/**
 * Autonomous AI Project Coach rules engine.
 * Analyzes team stage, progress, checklist activity, and deadlines.
 * Yields concise, actionable advice (max 2-3 at a time).
 */
export function generateCoachSuggestions(team: Team): CoachSuggestion[] {
  const suggestions: CoachSuggestion[] = [];
  const currentStage = team.lifecycle[team.currentStageId];
  const progress = currentStage.progress;

  // Rule 1: DEFINE stage scope check
  if (team.currentStageId === 'define') {
    const uncompletedTasks = currentStage.checklist.filter((t) => !t.completed);
    if (uncompletedTasks.length > 0) {
      suggestions.push({
        id: `coach-define-scope-${team.id}`,
        stageId: 'define',
        condition: 'Scope and requirements in progress',
        title: 'Lock Core Boundaries',
        description:
          'Agree on 1 essential user journey before writing specs to avoid scope creep.',
        actionText: 'Confirm Core Scope',
        actionType: 'review_scope',
        applied: false,
        priority: 'medium',
      });
    }
  }

  // Rule 2: PLAN stage - Unassigned responsibilities
  if (team.currentStageId === 'plan') {
    const unassignedTasks = currentStage.checklist.filter((t) => !t.assignee);
    if (unassignedTasks.length > 0) {
      suggestions.push({
        id: `coach-plan-owners-${team.id}`,
        stageId: 'plan',
        condition: 'Responsibilities unassigned',
        title: 'Assign Deliverable Owners',
        description:
          'Your team has unassigned tasks in Plan. Assign clear module leads to maintain momentum.',
        actionText: 'Auto-Assign Owners',
        actionType: 'assign_roles',
        applied: false,
        priority: 'high',
      });
    }
  }

  // Rule 3: BUILD stage - Low progress or nearing deadline
  if (team.currentStageId === 'build') {
    if (progress < 70) {
      suggestions.push({
        id: `coach-build-focus-${team.id}`,
        stageId: 'build',
        condition: `Implementation at ${progress}%`,
        title: 'Focus on Core Prototype',
        description:
          'Your deadline is approaching and implementation is in progress. Focus on the core working prototype before adding optional features.',
        actionText: 'Prioritize Core Tasks',
        actionType: 'prioritize_build',
        applied: false,
        priority: 'high',
      });
    } else {
      suggestions.push({
        id: `coach-build-demo-prep-${team.id}`,
        stageId: 'build',
        condition: 'Prototype nearing completion',
        title: 'Prepare Integration Checkpoint',
        description:
          'Core code is mostly built. Run a joint sync to verify that frontend and data models talk to each other.',
        actionText: 'Mark Integration Ready',
        actionType: 'custom',
        applied: false,
        priority: 'low',
      });
    }
  }

  // Rule 4: TEST stage - Testing not started or 0% progress
  if (team.currentStageId === 'test') {
    const completedTests = currentStage.checklist.filter((t) => t.completed).length;
    if (completedTests === 0 || progress === 0) {
      suggestions.push({
        id: `coach-test-cases-${team.id}`,
        stageId: 'test',
        condition: 'Testing has not started',
        title: 'Create 3 Basic Test Cases',
        description:
          'Testing has not started. Create 3 basic test cases to validate primary inputs before final submission.',
        actionText: 'Generate Test Checklist',
        actionType: 'add_tests',
        applied: false,
        priority: 'high',
      });
    }
  }

  // Rule 5: SUBMIT stage - Final checks
  if (team.currentStageId === 'submit') {
    const uncompletedSubmit = currentStage.checklist.filter((t) => !t.completed);
    if (uncompletedSubmit.length > 0) {
      suggestions.push({
        id: `coach-submit-review-${team.id}`,
        stageId: 'submit',
        condition: 'Final package pending',
        title: 'Double-Check Course Rubric',
        description:
          'Verify your slide deck, working repo URL, and author list match the course guidelines.',
        actionText: 'Verify Deliverables',
        actionType: 'prep_submission',
        applied: false,
        priority: 'high',
      });
    }
  }

  // General fallback suggestion if team is doing great
  if (suggestions.length === 0) {
    suggestions.push({
      id: `coach-steady-pace-${team.id}`,
      stageId: team.currentStageId,
      condition: 'Pacing on track',
      title: 'Maintain Delivery Rhythm',
      description:
        `Your ${currentStage.name} phase is moving smoothly at ${progress}%. Keep team syncs brief and documented.`,
      actionText: 'All On Track',
      actionType: 'custom',
      applied: true,
      priority: 'low',
    });
  }

  // Limit to maximum 2-3 suggestions
  return suggestions.slice(0, 2);
}

/**
 * Executes the actionable recommendation when the student clicks "Apply Suggestion".
 */
export function applyCoachSuggestionToTeam(team: Team, suggestion: CoachSuggestion): Team {
  const updated = JSON.parse(JSON.stringify(team)) as Team;
  const stage = updated.lifecycle[suggestion.stageId];

  if (suggestion.actionType === 'assign_roles') {
    // Auto-distribute unassigned tasks to available members
    const members = updated.members;
    stage.checklist.forEach((task: LifecycleTask, i: number) => {
      if (!task.assignee && members.length > 0) {
        task.assignee = members[i % members.length].name;
      }
    });
  } else if (suggestion.actionType === 'prioritize_build') {
    // Advance progress + focus tasks
    stage.progress = Math.min(100, stage.progress + 15);
    const incompleted = stage.checklist.filter((t: LifecycleTask) => !t.completed);
    if (incompleted.length > 0) {
      incompleted[0].completed = true;
    }
  } else if (suggestion.actionType === 'add_tests') {
    // Populate concrete test scenarios
    const testStage = updated.lifecycle['test'];
    testStage.checklist = [
      { id: `test-1-${Date.now()}`, text: 'Test user login & profile loading with edge cases', completed: true, assignee: updated.members[0]?.name },
      { id: `test-2-${Date.now()}`, text: 'Test core data transaction & submission flow', completed: false, assignee: updated.members[1]?.name },
      { id: `test-3-${Date.now()}`, text: 'Cross-browser responsive UI check (Mobile & Laptop)', completed: false, assignee: updated.members[2]?.name },
    ];
    testStage.progress = 33;
    testStage.status = 'in_progress';
  } else if (suggestion.actionType === 'review_scope') {
    stage.progress = Math.min(100, stage.progress + 20);
  } else if (suggestion.actionType === 'prep_submission') {
    stage.progress = Math.min(100, stage.progress + 25);
  }

  return updated;
}
