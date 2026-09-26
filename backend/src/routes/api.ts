import { Router, Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { generateBalancedTeams } from '../utils/teamBalancer';
import { applyCoachSuggestionToTeam, generateCoachSuggestions } from '../utils/aiCoachEngine';
import { Student, ProjectConfig, Team, LifecycleStageId, CoachSuggestion } from '../types';

export const apiRouter = Router();

// In-memory fallback memory store if Supabase credentials are not yet supplied
const inMemoryStore = {
  projects: new Map<string, ProjectConfig>(),
  students: new Map<string, Student[]>(),
  teams: new Map<string, Team[]>(),
};

// ==========================================
// 1. HEALTH CHECK (Render / Monitoring)
// ==========================================
apiRouter.get('/health', async (_req: Request, res: Response) => {
  let dbStatus = 'disconnected (in-memory mode)';
  if (supabase) {
    try {
      const { error } = await supabase.from('projects').select('id').limit(1);
      dbStatus = error ? `error: ${error.message}` : 'connected';
    } catch (err: any) {
      dbStatus = `error: ${err.message}`;
    }
  }

  res.json({
    status: 'ok',
    service: 'teamsync-ai-backend',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: dbStatus,
  });
});

// ==========================================
// 2. PROJECT ENDPOINTS
// ==========================================

// Get Project Details (with students & teams)
apiRouter.get('/projects/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (supabase) {
    try {
      const { data: project, error: pErr } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (pErr || !project) {
        res.status(404).json({ error: 'Project not found' });
        return;
      }

      const { data: students } = await supabase
        .from('students')
        .select('*')
        .eq('project_id', id);

      const { data: teamsData } = await supabase
        .from('teams')
        .select('*, team_members(student_id)')
        .eq('project_id', id);

      const formattedStudents: Student[] = (students || []).map((s: any) => ({
        id: s.id,
        name: s.name,
        department: s.department,
        technicalSkills: s.technical_skills || [],
        softSkills: s.soft_skills || [],
        preferredRole: s.preferred_role,
      }));

      const studentMap = new Map(formattedStudents.map((s) => [s.id, s]));

      const formattedTeams: Team[] = (teamsData || []).map((t: any) => {
        const memberIds = (t.team_members || []).map((tm: any) => tm.student_id);
        const members = memberIds
          .map((mId: string) => studentMap.get(mId))
          .filter(Boolean) as Student[];

        return {
          id: t.id,
          teamNumber: t.team_number,
          name: t.name,
          members,
          skillBalanceScore: t.skill_balance_score,
          explanation: t.explanation,
          coveredRoles: t.covered_roles || [],
          technicalSkillMix: t.technical_skill_mix || [],
          softSkillMix: t.soft_skill_mix || [],
          currentStageId: t.current_stage_id,
          lifecycle: t.lifecycle,
        };
      });

      res.json({
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
      });
      return;
    } catch (err: any) {
      console.error('Supabase fetch project error:', err);
    }
  }

  // Fallback in-memory
  const project = inMemoryStore.projects.get(id);
  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  res.json({
    project,
    students: inMemoryStore.students.get(id) || [],
    teams: inMemoryStore.teams.get(id) || [],
  });
});

// Create or update project configuration
apiRouter.post('/projects', async (req: Request, res: Response): Promise<void> => {
  const { id, name, course, targetStudentCount, desiredTeamSize, deadline } = req.body;

  const projectConfig: ProjectConfig = {
    id: id || `proj-${Date.now()}`,
    name: name || 'Smart Campus Assistant',
    course: course || 'Engineering Design',
    targetStudentCount: Number(targetStudentCount) || 12,
    desiredTeamSize: Number(desiredTeamSize) || 4,
    deadline: deadline || '2026-10-20',
    createdAt: new Date().toISOString(),
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .upsert(
          {
            id: projectConfig.id,
            name: projectConfig.name,
            course: projectConfig.course,
            target_student_count: projectConfig.targetStudentCount,
            desired_team_size: projectConfig.desiredTeamSize,
            deadline: projectConfig.deadline,
          },
          { onConflict: 'id' }
        )
        .select()
        .single();

      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }

      res.status(201).json({ project: projectConfig });
      return;
    } catch (err: any) {
      console.error('Supabase upsert project error:', err);
    }
  }

  inMemoryStore.projects.set(projectConfig.id, projectConfig);
  res.status(201).json({ project: projectConfig });
});

// ==========================================
// 3. STUDENT ENDPOINTS
// ==========================================

// Add student to project
apiRouter.post('/projects/:id/students', async (req: Request, res: Response): Promise<void> => {
  const { id: projectId } = req.params;
  const { name, department, technicalSkills, softSkills, preferredRole } = req.body;

  const newStudent: Student = {
    id: `std-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name: name || 'Student',
    department: department || 'General Engineering',
    technicalSkills: technicalSkills || [],
    softSkills: softSkills || [],
    preferredRole: preferredRole || 'Developer',
  };

  if (supabase) {
    try {
      const { error } = await supabase.from('students').insert({
        id: newStudent.id,
        project_id: projectId,
        name: newStudent.name,
        department: newStudent.department,
        technical_skills: newStudent.technicalSkills,
        soft_skills: newStudent.softSkills,
        preferred_role: newStudent.preferredRole,
      });

      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }

      res.status(201).json({ student: newStudent });
      return;
    } catch (err: any) {
      console.error('Supabase insert student error:', err);
    }
  }

  const list = inMemoryStore.students.get(projectId) || [];
  list.push(newStudent);
  inMemoryStore.students.set(projectId, list);
  res.status(201).json({ student: newStudent });
});

// Delete student
apiRouter.delete('/students/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (supabase) {
    try {
      const { error } = await supabase.from('students').delete().eq('id', id);
      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }
      res.json({ success: true, id });
      return;
    } catch (err: any) {
      console.error('Supabase delete student error:', err);
    }
  }

  for (const [pId, list] of inMemoryStore.students.entries()) {
    inMemoryStore.students.set(
      pId,
      list.filter((s) => s.id !== id)
    );
  }
  res.json({ success: true, id });
});

// ==========================================
// 4. TEAM BALANCING & GENERATION
// ==========================================
apiRouter.post('/projects/:id/teams/generate', async (req: Request, res: Response): Promise<void> => {
  const { id: projectId } = req.params;
  const { students: incomingStudents, desiredTeamSize, deadline, seedModifier } = req.body;

  let studentsList: Student[] = incomingStudents;

  // If students not in request body, retrieve from DB
  if (!studentsList || studentsList.length === 0) {
    if (supabase) {
      const { data: dbStudents } = await supabase
        .from('students')
        .select('*')
        .eq('project_id', projectId);

      studentsList = (dbStudents || []).map((s: any) => ({
        id: s.id,
        name: s.name,
        department: s.department,
        technicalSkills: s.technical_skills || [],
        softSkills: s.soft_skills || [],
        preferredRole: s.preferred_role,
      }));
    } else {
      studentsList = inMemoryStore.students.get(projectId) || [];
    }
  }

  const result = generateBalancedTeams(
    studentsList,
    Number(desiredTeamSize) || 4,
    deadline || '2026-10-20',
    Number(seedModifier) || 0
  );

  if (supabase && result.teams.length > 0) {
    try {
      // Clean previous generated teams for project
      await supabase.from('teams').delete().eq('project_id', projectId);

      // Insert new teams
      for (const t of result.teams) {
        await supabase.from('teams').insert({
          id: t.id,
          project_id: projectId,
          team_number: t.teamNumber,
          name: t.name,
          skill_balance_score: t.skillBalanceScore,
          explanation: t.explanation,
          covered_roles: t.coveredRoles,
          technical_skill_mix: t.technicalSkillMix,
          soft_skill_mix: t.softSkillMix,
          current_stage_id: t.currentStageId,
          lifecycle: t.lifecycle,
        });

        // Insert team members
        const memberInserts = t.members.map((m) => ({
          team_id: t.id,
          student_id: m.id,
        }));
        if (memberInserts.length > 0) {
          await supabase.from('team_members').insert(memberInserts);
        }
      }
    } catch (err: any) {
      console.error('Supabase team persist error:', err);
    }
  }

  inMemoryStore.teams.set(projectId, result.teams);
  res.json(result);
});

// ==========================================
// 5. LIFECYCLE & AI COACH ACTIONS
// ==========================================

// Update stage or progress
apiRouter.patch('/teams/:id/progress', async (req: Request, res: Response): Promise<void> => {
  const { id: teamId } = req.params;
  const { stageId, progress } = req.body;

  if (supabase) {
    try {
      const { data: team } = await supabase.from('teams').select('lifecycle').eq('id', teamId).single();
      if (team) {
        const lifecycle = team.lifecycle;
        if (lifecycle[stageId]) {
          lifecycle[stageId].progress = Number(progress);
          lifecycle[stageId].status = progress >= 100 ? 'completed' : progress > 0 ? 'in_progress' : 'pending';
          await supabase.from('teams').update({ lifecycle }).eq('id', teamId);
        }
      }
    } catch (err: any) {
      console.error('Supabase update progress error:', err);
    }
  }

  res.json({ success: true, teamId, stageId, progress });
});

// Apply AI Coach Suggestion
apiRouter.post('/teams/:id/coach/apply', async (req: Request, res: Response): Promise<void> => {
  const { id: teamId } = req.params;
  const { team, suggestion } = req.body;

  const updatedTeam = applyCoachSuggestionToTeam(team, suggestion);

  if (supabase) {
    try {
      await supabase.from('teams').update({
        lifecycle: updatedTeam.lifecycle,
        current_stage_id: updatedTeam.currentStageId,
      }).eq('id', teamId);
    } catch (err: any) {
      console.error('Supabase apply coach error:', err);
    }
  }

  res.json({ success: true, team: updatedTeam });
});

