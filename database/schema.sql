-- ==============================================================================
-- TeamSync AI - Supabase Database Schema
-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    name TEXT NOT NULL,
    course TEXT NOT NULL,
    target_student_count INTEGER NOT NULL DEFAULT 12,
    desired_team_size INTEGER NOT NULL DEFAULT 4,
    deadline TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Students Table
CREATE TABLE IF NOT EXISTS students (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    technical_skills TEXT[] NOT NULL DEFAULT '{}',
    soft_skills TEXT[] NOT NULL DEFAULT '{}',
    preferred_role TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Teams Table
CREATE TABLE IF NOT EXISTS teams (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    team_number INTEGER NOT NULL,
    name TEXT NOT NULL,
    skill_balance_score INTEGER NOT NULL DEFAULT 0,
    explanation TEXT DEFAULT '',
    covered_roles TEXT[] NOT NULL DEFAULT '{}',
    technical_skill_mix TEXT[] NOT NULL DEFAULT '{}',
    soft_skill_mix TEXT[] NOT NULL DEFAULT '{}',
    current_stage_id TEXT NOT NULL DEFAULT 'build',
    lifecycle JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Team Members (Many-to-Many join table)
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(team_id, student_id)
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_students_project_id ON students(project_id);
CREATE INDEX IF NOT EXISTS idx_teams_project_id ON teams(project_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_student_id ON team_members(student_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Allow public (anon) and authenticated backend (service_role) to select, insert, update, and delete
-- This matches student collaboration environments while keeping standard security layers intact.

DROP POLICY IF EXISTS "Public access for projects" ON projects;
CREATE POLICY "Public access for projects" ON projects
    FOR ALL
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Public access for students" ON students;
CREATE POLICY "Public access for students" ON students
    FOR ALL
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Public access for teams" ON teams;
CREATE POLICY "Public access for teams" ON teams
    FOR ALL
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Public access for team_members" ON team_members;
CREATE POLICY "Public access for team_members" ON team_members
    FOR ALL
    USING (true)
    WITH CHECK (true);
