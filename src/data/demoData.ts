import { Student, ProjectConfig, LifecycleStageId, LifecycleStage } from '../types';

export const POPULAR_TECH_SKILLS = [
  'Python',
  'Web Development',
  'AI/ML',
  'UI/UX',
  'Data Analysis',
  'React',
  'Java',
  'Cloud',
  'Database/SQL',
  'Testing/QA',
  'Mobile Dev',
  'DevOps',
];

export const POPULAR_SOFT_SKILLS = [
  'Communication',
  'Leadership',
  'Research',
  'Presentation',
  'Problem Solving',
  'Time Management',
  'Organization',
  'Teamwork',
];

export const POPULAR_ROLES = [
  'Developer',
  'AI/ML Specialist',
  'UI/UX Designer',
  'Coordinator',
  'Researcher',
  'QA / Tester',
];

export const DEMO_PROJECT_CONFIG: ProjectConfig = {
  id: 'demo-proj-01',
  name: 'Smart Campus Assistant',
  course: 'Engineering Design',
  targetStudentCount: 12,
  desiredTeamSize: 4,
  deadline: '2026-10-20',
  createdAt: '2026-09-20',
};

export const DEMO_STUDENTS: Student[] = [
  {
    id: 's-1',
    name: 'Aarav Sharma',
    department: 'Computer Science',
    technicalSkills: ['Python', 'AI/ML', 'Data Analysis'],
    softSkills: ['Research', 'Critical Thinking', 'Problem Solving'],
    preferredRole: 'AI/ML Specialist',
  },
  {
    id: 's-2',
    name: 'Riya Patel',
    department: 'Design & Computing',
    technicalSkills: ['UI/UX', 'Web Development'],
    softSkills: ['Communication', 'Presentation'],
    preferredRole: 'UI/UX Designer',
  },
  {
    id: 's-3',
    name: 'Divesh Sen',
    department: 'Software Engineering',
    technicalSkills: ['Web Development', 'Python', 'React'],
    softSkills: ['Problem Solving', 'Organization'],
    preferredRole: 'Developer',
  },
  {
    id: 's-4',
    name: 'Om Verma',
    department: 'Information Technology',
    technicalSkills: ['Cloud', 'Database/SQL', 'DevOps'],
    softSkills: ['Communication', 'Leadership', 'Time Management'],
    preferredRole: 'Coordinator',
  },
  {
    id: 's-5',
    name: 'Ananya Iyer',
    department: 'Computer Science',
    technicalSkills: ['Web Development', 'React', 'Database/SQL'],
    softSkills: ['Teamwork', 'Communication'],
    preferredRole: 'Developer',
  },
  {
    id: 's-6',
    name: 'Rohan Mehta',
    department: 'Data Science',
    technicalSkills: ['AI/ML', 'Python', 'Data Analysis'],
    softSkills: ['Research', 'Presentation'],
    preferredRole: 'AI/ML Specialist',
  },
  {
    id: 's-7',
    name: 'Priya Nair',
    department: 'Human-Computer Interaction',
    technicalSkills: ['UI/UX', 'Web Development'],
    softSkills: ['Communication', 'Leadership'],
    preferredRole: 'UI/UX Designer',
  },
  {
    id: 's-8',
    name: 'Kabir Das',
    department: 'Information Systems',
    technicalSkills: ['Java', 'Cloud', 'Testing/QA'],
    softSkills: ['Leadership', 'Time Management', 'Organization'],
    preferredRole: 'Coordinator',
  },
  {
    id: 's-9',
    name: 'Sneha Kulkarni',
    department: 'Software Engineering',
    technicalSkills: ['Web Development', 'Python', 'Testing/QA'],
    softSkills: ['Problem Solving', 'Teamwork'],
    preferredRole: 'Developer',
  },
  {
    id: 's-10',
    name: 'Vikram Malhotra',
    department: 'Data Science',
    technicalSkills: ['Data Analysis', 'Python', 'AI/ML'],
    softSkills: ['Research', 'Critical Thinking'],
    preferredRole: 'Researcher',
  },
  {
    id: 's-11',
    name: 'Tanvi Joshi',
    department: 'Design & Media',
    technicalSkills: ['UI/UX', 'Web Development'],
    softSkills: ['Presentation', 'Communication'],
    preferredRole: 'UI/UX Designer',
  },
  {
    id: 's-12',
    name: 'Siddharth Roy',
    department: 'Computer Engineering',
    technicalSkills: ['Java', 'Testing/QA', 'Database/SQL'],
    softSkills: ['Leadership', 'Organization', 'Communication'],
    preferredRole: 'QA / Tester',
  },
];

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
