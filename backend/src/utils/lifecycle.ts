import { LifecycleStageId, LifecycleStage } from '../types';

export const createDefaultLifecycle = (projectDeadlineStr: string): Record<LifecycleStageId, LifecycleStage> => {
  return {
    define: {
      id: 'define',
      name: 'Define',
      order: 1,
      status: 'completed',
      task: 'Finalize problem statement, user personas and project scope specification.',
      progress: 100,
      targetDate: '25 Sep 2026',
      checklist: [
        { id: 't1', text: 'Document target user pain points and needs', completed: true, assignee: 'UI/UX Designer' },
        { id: 't2', text: 'Agree on core deliverables and scope boundaries', completed: true, assignee: 'Coordinator' },
        { id: 't3', text: 'Validate requirements with faculty advisor', completed: true, assignee: 'Coordinator' },
      ],
      tips: [
        'Keep scope small and focused on one core user workflow.',
        'Record assumptions early so tests can validate them later.',
      ],
    },
    plan: {
      id: 'plan',
      name: 'Plan',
      order: 2,
      status: 'completed',
      task: 'Draft system architecture, milestone breakdown, and assign role responsibilities.',
      progress: 100,
      targetDate: '02 Oct 2026',
      checklist: [
        { id: 't4', text: 'Draw system component diagram and tech stack choices', completed: true, assignee: 'Developer' },
        { id: 't5', text: 'Set milestone target dates and work breakdown', completed: true, assignee: 'Coordinator' },
        { id: 't6', text: 'Define API interface contracts and data models', completed: true, assignee: 'AI/ML Specialist' },
      ],
      tips: [
        'Ensure each member owns at least one primary module.',
        'Schedule a 15-minute weekly checkpoint to detect blockers.',
      ],
    },
    build: {
      id: 'build',
      name: 'Build',
      order: 3,
      status: 'in_progress',
      task: 'Complete the first working prototype and integrate core modules.',
      progress: 65,
      targetDate: '12 Oct 2026',
      checklist: [
        { id: 't7', text: 'Scaffold core app architecture and repo structure', completed: true, assignee: 'Developer' },
        { id: 't8', text: 'Implement key user flow and data pipeline', completed: true, assignee: 'Developer' },
        { id: 't9', text: 'Connect frontend screens to backend services', completed: false, assignee: 'Developer' },
        { id: 't10', text: 'Prepare baseline UI components and styles', completed: true, assignee: 'UI/UX Designer' },
      ],
      tips: [
        'Prioritize end-to-end functionality over visual perfection.',
        'Merge work daily to avoid integration nightmares before deadlines.',
      ],
    },
    test: {
      id: 'test',
      name: 'Test',
      order: 4,
      status: 'pending',
      task: 'Execute test cases, user feedback reviews, and fix critical regressions.',
      progress: 0,
      targetDate: '17 Oct 2026',
      checklist: [
        { id: 't11', text: 'Run sanity test on all primary user scenarios', completed: false },
        { id: 't12', text: 'Conduct peer review with 2 classmate test users', completed: false },
        { id: 't13', text: 'Verify edge cases and input validation', completed: false },
      ],
      tips: [
        'Test on real devices or browsers, not just development servers.',
        'Document bugs immediately and triage by severity.',
      ],
    },
    submit: {
      id: 'submit',
      name: 'Submit',
      order: 5,
      status: 'pending',
      task: 'Assemble final documentation, slide deck, repository link, and project submission.',
      progress: 0,
      targetDate: projectDeadlineStr || '20 Oct 2026',
      checklist: [
        { id: 't14', text: 'Produce final project report and architecture overview', completed: false },
        { id: 't15', text: 'Record 2-minute product video walkthrough', completed: false },
        { id: 't16', text: 'Package clean repository with README setup guide', completed: false },
        { id: 't17', text: 'Submit final deliverables to course portal', completed: false },
      ],
      tips: [
        'Verify submission portal requirements early to avoid last-minute panic.',
        'Ensure the README has exact reproduction steps for graders.',
      ],
    },
  };
};
