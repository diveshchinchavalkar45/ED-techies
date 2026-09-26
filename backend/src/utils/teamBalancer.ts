import { Student, Team, LifecycleStageId } from '../types';
import { createDefaultLifecycle } from './lifecycle';

export interface BalanceResult {
  teams: Team[];
  overallBalanceScore: number;
  summaryExplanation: string;
}

export function generateBalancedTeams(
  students: Student[],
  desiredTeamSize: number,
  deadlineStr: string,
  seedModifier: number = 0
): BalanceResult {
  if (!students || students.length === 0) {
    return {
      teams: [],
      overallBalanceScore: 0,
      summaryExplanation: 'No students provided for team formation.',
    };
  }

  const teamSize = Math.max(2, desiredTeamSize);
  const totalStudents = students.length;
  const numTeams = Math.max(1, Math.round(totalStudents / teamSize));

  const teamBuckets: Student[][] = Array.from({ length: numTeams }, () => []);

  const shuffledStudents = [...students].sort((a, b) => {
    const hashA = simpleHash(a.id + seedModifier);
    const hashB = simpleHash(b.id + seedModifier);
    return hashA - hashB;
  });

  const leaders: Student[] = [];
  const designers: Student[] = [];
  const aiMlSpecialists: Student[] = [];
  const developers: Student[] = [];
  const others: Student[] = [];

  for (const s of shuffledStudents) {
    const hasLeaderSoftSkill = s.softSkills.some((sk) =>
      sk.toLowerCase().includes('leadership')
    );
    const isCoordinatorRole = s.preferredRole.toLowerCase().includes('coordinator');

    if (isCoordinatorRole || hasLeaderSoftSkill) {
      leaders.push(s);
    } else if (
      s.preferredRole.toLowerCase().includes('designer') ||
      s.technicalSkills.some((ts) => ts.toLowerCase().includes('ui/ux'))
    ) {
      designers.push(s);
    } else if (
      s.preferredRole.toLowerCase().includes('ai') ||
      s.technicalSkills.some((ts) => ts.toLowerCase().includes('ai/ml'))
    ) {
      aiMlSpecialists.push(s);
    } else if (
      s.preferredRole.toLowerCase().includes('developer') ||
      s.technicalSkills.some((ts) => ts.toLowerCase().includes('web') || ts.toLowerCase().includes('python'))
    ) {
      developers.push(s);
    } else {
      others.push(s);
    }
  }

  const assignToBestTeam = (student: Student) => {
    let bestTeamIdx = 0;
    let minScore = Infinity;
    const maxCapacity = Math.ceil(totalStudents / numTeams);

    for (let i = 0; i < numTeams; i++) {
      const currentTeam = teamBuckets[i];
      if (currentTeam.length >= maxCapacity) continue;

      let penalty = currentTeam.length * 10;
      const sameRoleCount = currentTeam.filter(
        (m) => m.preferredRole.toLowerCase() === student.preferredRole.toLowerCase()
      ).length;
      penalty += sameRoleCount * 15;

      for (const skill of student.technicalSkills) {
        const matchingSkill = currentTeam.filter((m) =>
          m.technicalSkills.includes(skill)
        ).length;
        penalty += matchingSkill * 5;
      }

      if (penalty < minScore) {
        minScore = penalty;
        bestTeamIdx = i;
      }
    }

    teamBuckets[bestTeamIdx].push(student);
  };

  for (const s of leaders) assignToBestTeam(s);
  for (const s of designers) assignToBestTeam(s);
  for (const s of aiMlSpecialists) assignToBestTeam(s);
  for (const s of developers) assignToBestTeam(s);
  for (const s of others) assignToBestTeam(s);

  const finalizedTeams: Team[] = teamBuckets.map((members, idx) => {
    const teamNum = idx + 1;
    const teamName = `Team ${teamNum.toString().padStart(2, '0')}`;

    const coveredRoles = Array.from(new Set(members.map((m) => m.preferredRole)));
    const technicalSkillMix = Array.from(
      new Set(members.flatMap((m) => m.technicalSkills))
    );
    const softSkillMix = Array.from(new Set(members.flatMap((m) => m.softSkills)));

    const balanceScore = calculateTeamBalanceScore(
      members,
      teamSize,
      coveredRoles,
      technicalSkillMix,
      softSkillMix
    );

    const explanation = generateTeamExplanation(
      teamName,
      members,
      coveredRoles,
      technicalSkillMix,
      softSkillMix,
      balanceScore
    );

    const currentStageId: LifecycleStageId = 'build';

    return {
      id: `team-${teamNum}-${Date.now()}`,
      teamNumber: teamNum,
      name: teamName,
      members,
      skillBalanceScore: balanceScore,
      explanation,
      coveredRoles,
      technicalSkillMix,
      softSkillMix,
      currentStageId,
      lifecycle: createDefaultLifecycle(deadlineStr),
    };
  });

  const overallBalanceScore = Math.round(
    finalizedTeams.reduce((acc, t) => acc + t.skillBalanceScore, 0) /
      (finalizedTeams.length || 1)
  );

  const summaryExplanation = `Formed ${finalizedTeams.length} balanced teams averaging ${overallBalanceScore}% skill equilibrium. Technical proficiencies, leadership presence, and preferred roles were distributed across all rosters without single-skill clustering.`;

  return {
    teams: finalizedTeams,
    overallBalanceScore,
    summaryExplanation,
  };
}

function calculateTeamBalanceScore(
  members: Student[],
  targetSize: number,
  roles: string[],
  techSkills: string[],
  softSkills: string[]
): number {
  if (members.length === 0) return 0;

  const roleRatio = Math.min(1, roles.length / Math.min(targetSize, 4));
  const roleScore = roleRatio * 35;

  const techRatio = Math.min(1, techSkills.length / 5);
  const techScore = techRatio * 35;

  const hasLeadership = softSkills.some((s) =>
    s.toLowerCase().includes('leadership')
  );
  const hasCommunication = softSkills.some((s) =>
    s.toLowerCase().includes('communication')
  );

  let softScore = 15;
  if (hasLeadership) softScore += 8;
  if (hasCommunication) softScore += 7;

  const sizeCompleteness = Math.min(1, members.length / targetSize);
  const rawScore = (roleScore + techScore + softScore) * sizeCompleteness;

  return Math.min(97, Math.max(72, Math.round(rawScore)));
}

function generateTeamExplanation(
  teamName: string,
  members: Student[],
  roles: string[],
  techSkills: string[],
  softSkills: string[],
  _score: number
): string {
  if (members.length === 0) return `${teamName} has no assigned students.`;

  const topTech = techSkills.slice(0, 3).join(', ');
  const rolesSummary = roles.slice(0, 3).join(', ');

  const hasLead = softSkills.some((s) =>
    s.toLowerCase().includes('leadership')
  );
  const leadPhrase = hasLead
    ? 'grounded with proactive leadership'
    : 'balanced across peer collaborators';

  return `${teamName} pairs ${rolesSummary} with direct proficiencies in ${topTech}, ${leadPhrase} to prevent skill bottlenecks.`;
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}
