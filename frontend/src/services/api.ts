import { Student, ProjectConfig, Team, CoachSuggestion } from '../types';
import { supabase } from './supabase';

const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

export const api = {
  // 1. Health check (tests Render backend)
  async checkHealth(): Promise<{ status: string; database?: string } | null> {
    if (!API_BASE_URL) return null;
    try {
      const res = await fetch(`${API_BASE_URL}/api/health`, { method: 'GET' });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  // 2. Fetch Project (via Render backend or Supabase fallback)
  async getProject(projectId: string): Promise<{ project: ProjectConfig; students: Student[]; teams: Team[] } | null> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/projects/${projectId}`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend API request failed, falling back to direct Supabase/Local:', err);
      }
    }

    // Direct Supabase query if backend is not yet spun up
    if (supabase) {
      try {
        const { data: project } = await supabase.from('projects').select('*').eq('id', projectId).single();
        const { data: students } = await supabase.from('students').select('*').eq('project_id', projectId);
        const { data: teams } = await supabase.from('teams').select('*, team_members(student_id)').eq('project_id', projectId);

        if (project) {
          const formattedStudents: Student[] = (students || []).map((s: any) => ({
            id: s.id,
            name: s.name,
            department: s.department,
            technicalSkills: s.technical_skills || [],
            softSkills: s.soft_skills || [],
            preferredRole: s.preferred_role,
          }));

          const sMap = new Map(formattedStudents.map((s) => [s.id, s]));
          const formattedTeams: Team[] = (teams || []).map((t: any) => ({
            id: t.id,
            teamNumber: t.team_number,
            name: t.name,
            members: (t.team_members || []).map((tm: any) => sMap.get(tm.student_id)).filter(Boolean) as Student[],
            skillBalanceScore: t.skill_balance_score,
            explanation: t.explanation,
            coveredRoles: t.covered_roles || [],
            technicalSkillMix: t.technical_skill_mix || [],
            softSkillMix: t.soft_skill_mix || [],
            currentStageId: t.current_stage_id,
            lifecycle: t.lifecycle,
          }));

          return {
            project: {
              id: project.id,
              name: project.name,
              course: project.course,
              targetStudentCount: project.target_student_count,
              desiredTeamSize: project.desired_team_size,
              deadline: project.deadline,
              createdAt: project.created_at,
            },
            students: formattedStudents,
            teams: formattedTeams,
          };
        }
      } catch (err) {
        console.warn('Direct Supabase fetch error:', err);
      }
    }

    return null;
  },

  // 3. Save Project Config
  async saveProject(config: ProjectConfig): Promise<boolean> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/projects`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(config),
        });
        if (res.ok) return true;
      } catch (err) {
        console.warn('Backend API save failed:', err);
      }
    }

    if (supabase) {
      try {
        await supabase.from('projects').upsert({
          id: config.id,
          name: config.name,
          course: config.course,
          target_student_count: config.targetStudentCount,
          desired_team_size: config.desiredTeamSize,
          deadline: config.deadline,
        });
        return true;
      } catch (err) {
        console.warn('Direct Supabase upsert failed:', err);
      }
    }

    return false;
  },

  // 4. Save Student
  async addStudent(projectId: string, student: Student): Promise<boolean> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/projects/${projectId}/students`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(student),
        });
        if (res.ok) return true;
      } catch (err) {
        console.warn('Backend API add student failed:', err);
      }
    }

    if (supabase) {
      try {
        await supabase.from('students').insert({
          id: student.id,
          project_id: projectId,
          name: student.name,
          department: student.department,
          technical_skills: student.technicalSkills,
          soft_skills: student.softSkills,
          preferred_role: student.preferredRole,
        });
        return true;
      } catch (err) {
        console.warn('Direct Supabase add student failed:', err);
      }
    }

    return false;
  },

  // 5. Delete Student
  async deleteStudent(studentId: string): Promise<boolean> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/students/${studentId}`, { method: 'DELETE' });
        if (res.ok) return true;
      } catch (err) {
        console.warn('Backend API delete student failed:', err);
      }
    }

    if (supabase) {
      try {
        await supabase.from('students').delete().eq('id', studentId);
        return true;
      } catch (err) {
        console.warn('Direct Supabase delete student failed:', err);
      }
    }

    return false;
  },

  // 6. Generate Balanced Teams via Backend
  async generateTeams(
    projectId: string,
    students: Student[],
    desiredTeamSize: number,
    deadline: string,
    seedModifier = 0
  ): Promise<{ teams: Team[]; overallBalanceScore: number; summaryExplanation: string } | null> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/projects/${projectId}/teams/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            students,
            desiredTeamSize,
            deadline,
            seedModifier,
          }),
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend API generate teams failed:', err);
      }
    }

    return null;
  },

  // 7. Update Team Stage Progress
  async updateStageProgress(teamId: string, stageId: string, progress: number): Promise<void> {
    if (API_BASE_URL) {
      try {
        await fetch(`${API_BASE_URL}/api/teams/${teamId}/progress`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stageId, progress }),
        });
        return;
      } catch (err) {
        console.warn('Backend update progress failed:', err);
      }
    }
  },

  // 8. Apply Coach Suggestion
  async applyCoachAction(team: Team, suggestion: CoachSuggestion): Promise<Team | null> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/teams/${team.id}/coach/apply`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ team, suggestion }),
        });
        if (res.ok) {
          const data = await res.json();
          return data.team;
        }
      } catch (err) {
        console.warn('Backend apply coach action failed:', err);
      }
    }

    return null;
  },
};
