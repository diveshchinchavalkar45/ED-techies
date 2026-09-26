-- ==============================================================================
-- TeamSync AI - Supabase Demo Seed Data
-- Run this after running schema.sql to populate initial demo data
-- ==============================================================================

-- 1. Insert Demo Project
INSERT INTO projects (id, name, course, target_student_count, desired_team_size, deadline)
VALUES (
    'demo-proj-01',
    'Smart Campus Assistant',
    'Engineering Design',
    12,
    4,
    '2026-10-20'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    course = EXCLUDED.course,
    target_student_count = EXCLUDED.target_student_count,
    desired_team_size = EXCLUDED.desired_team_size,
    deadline = EXCLUDED.deadline;

-- 2. Insert 12 Sample Students
INSERT INTO students (id, project_id, name, department, technical_skills, soft_skills, preferred_role)
VALUES
    ('s-1', 'demo-proj-01', 'Aarav Sharma', 'Computer Science', ARRAY['Python', 'AI/ML', 'Data Analysis'], ARRAY['Research', 'Critical Thinking', 'Problem Solving'], 'AI/ML Specialist'),
    ('s-2', 'demo-proj-01', 'Riya Patel', 'Design & Computing', ARRAY['UI/UX', 'Web Development'], ARRAY['Communication', 'Presentation'], 'UI/UX Designer'),
    ('s-3', 'demo-proj-01', 'Divesh Sen', 'Software Engineering', ARRAY['Web Development', 'Python', 'React'], ARRAY['Problem Solving', 'Organization'], 'Developer'),
    ('s-4', 'demo-proj-01', 'Om Verma', 'Information Technology', ARRAY['Cloud', 'Database/SQL', 'DevOps'], ARRAY['Communication', 'Leadership', 'Time Management'], 'Coordinator'),
    ('s-5', 'demo-proj-01', 'Ananya Iyer', 'Computer Science', ARRAY['Web Development', 'React', 'Database/SQL'], ARRAY['Teamwork', 'Communication'], 'Developer'),
    ('s-6', 'demo-proj-01', 'Rohan Mehta', 'Data Science', ARRAY['AI/ML', 'Python', 'Data Analysis'], ARRAY['Research', 'Presentation'], 'AI/ML Specialist'),
    ('s-7', 'demo-proj-01', 'Priya Nair', 'Human-Computer Interaction', ARRAY['UI/UX', 'Web Development'], ARRAY['Communication', 'Leadership'], 'UI/UX Designer'),
    ('s-8', 'demo-proj-01', 'Kabir Das', 'Information Systems', ARRAY['Java', 'Cloud', 'Testing/QA'], ARRAY['Leadership', 'Time Management', 'Organization'], 'Coordinator'),
    ('s-9', 'demo-proj-01', 'Sneha Kulkarni', 'Software Engineering', ARRAY['Web Development', 'Python', 'Testing/QA'], ARRAY['Problem Solving', 'Teamwork'], 'Developer'),
    ('s-10', 'demo-proj-01', 'Vikram Malhotra', 'Data Science', ARRAY['Data Analysis', 'Python', 'AI/ML'], ARRAY['Research', 'Critical Thinking'], 'Researcher'),
    ('s-11', 'demo-proj-01', 'Tanvi Joshi', 'Design & Media', ARRAY['UI/UX', 'Web Development'], ARRAY['Presentation', 'Communication'], 'UI/UX Designer'),
    ('s-12', 'demo-proj-01', 'Siddharth Roy', 'Computer Engineering', ARRAY['Java', 'Testing/QA', 'Database/SQL'], ARRAY['Leadership', 'Organization', 'Communication'], 'QA / Tester')
ON CONFLICT (id) DO NOTHING;
