-- Enable RLS with simple policies for testing
-- This script enables RLS with very simple policies to test login

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Enable RLS on task_submissions table
ALTER TABLE task_submissions ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
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
END $$;

-- Create very simple policies for testing
-- Allow all authenticated users to read users table
CREATE POLICY "Allow all authenticated users to read users" ON users
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- Allow all authenticated users to read task_submissions table
CREATE POLICY "Allow all authenticated users to read task_submissions" ON task_submissions
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- Show current RLS status and policies
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('users', 'task_submissions');

SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('users', 'task_submissions')
ORDER BY tablename, policyname;
