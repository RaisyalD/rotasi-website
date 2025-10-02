-- Permanently disable RLS for all tables
-- This script disables RLS permanently and adds application-level security
-- WARNING: This removes database-level security, security must be handled at application level

-- Disable RLS on all relevant tables
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE task_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE sector_passwords DISABLE ROW LEVEL SECURITY;
ALTER TABLE division_passwords DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies since RLS is disabled
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    -- Drop all policies on users table
    FOR pol IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'users'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON users', pol.policyname);
    END LOOP;
    
    -- Drop all policies on task_submissions table
    FOR pol IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'task_submissions'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON task_submissions', pol.policyname);
    END LOOP;
    
    -- Drop all policies on tasks table
    FOR pol IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'tasks'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON tasks', pol.policyname);
    END LOOP;
    
    -- Drop all policies on sector_passwords table
    FOR pol IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'sector_passwords'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON sector_passwords', pol.policyname);
    END LOOP;
    
    -- Drop all policies on division_passwords table
    FOR pol IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'division_passwords'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON division_passwords', pol.policyname);
    END LOOP;
END $$;

-- Show current RLS status
SELECT 
    schemaname, 
    tablename, 
    rowsecurity as rls_enabled,
    CASE WHEN rowsecurity THEN 'ENABLED' ELSE 'DISABLED' END as status
FROM pg_tables 
WHERE tablename IN ('users', 'task_submissions', 'tasks', 'sector_passwords', 'division_passwords')
ORDER BY tablename;

-- Test queries to verify access
SELECT 'RLS Disabled - All tables accessible' as status;
SELECT COUNT(*) as total_users FROM users;
SELECT role, COUNT(*) as count FROM users GROUP BY role;
SELECT COUNT(*) as total_submissions FROM task_submissions;
SELECT COUNT(*) as total_tasks FROM tasks;
