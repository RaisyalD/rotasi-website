-- Fix RLS policies for all user types
-- This script restores proper RLS policies for mentor, acara, and peserta

-- Drop all existing policies that might be causing issues
DROP POLICY IF EXISTS "Admin can insert users" ON users;
DROP POLICY IF EXISTS "Admin can select all users" ON users;
DROP POLICY IF EXISTS "Admin can update users" ON users;
DROP POLICY IF EXISTS "Admin can delete users" ON users;
DROP POLICY IF EXISTS "Admin can manage all submissions" ON task_submissions;

-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Acara can view all data" ON users;
DROP POLICY IF EXISTS "Admin can view all data" ON users;
DROP POLICY IF EXISTS "Users can view their own submissions" ON task_submissions;
DROP POLICY IF EXISTS "Mentor can view submissions from their sector" ON task_submissions;
DROP POLICY IF EXISTS "Acara can view all submissions" ON task_submissions;
DROP POLICY IF EXISTS "Admin can view all submissions" ON task_submissions;

-- Recreate proper policies for users table
-- Users can view their own data
CREATE POLICY "Users can view their own data" ON users
    FOR SELECT USING (auth.uid() = id);

-- Acara can view all data
CREATE POLICY "Acara can view all data" ON users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = auth.uid() 
            AND u.role = 'acara'
        )
    );

-- Admin can view all data (using service role, so this is just for completeness)
CREATE POLICY "Admin can view all data" ON users
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM users WHERE role = 'admin'
        )
    );

-- Recreate proper policies for task_submissions table
-- Users can view their own submissions
CREATE POLICY "Users can view their own submissions" ON task_submissions
    FOR SELECT USING (participant_id = auth.uid());

-- Mentor can view submissions from their sector
CREATE POLICY "Mentor can view submissions from their sector" ON task_submissions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users u, tasks t
            WHERE u.id = auth.uid() 
            AND u.role = 'mentor'
            AND t.id = task_submissions.task_id
            AND t.sector = u.sektor
        )
    );

-- Acara can view all submissions
CREATE POLICY "Acara can view all submissions" ON task_submissions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = auth.uid() 
            AND u.role = 'acara'
        )
    );

-- Admin can view all submissions (using service role, so this is just for completeness)
CREATE POLICY "Admin can view all submissions" ON task_submissions
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM users WHERE role = 'admin'
        )
    );

-- Verify policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('users', 'task_submissions')
ORDER BY tablename, policyname;
