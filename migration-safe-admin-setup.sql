-- Safe Admin Setup Migration
-- This script safely sets up the admin system without conflicts
-- Run this script to set up the complete admin system safely

-- 1. Fix role constraint to allow 'admin'
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check 
CHECK (role IN ('peserta', 'mentor', 'acara', 'admin'));

-- 2. Update existing komdis users to admin role
UPDATE users 
SET role = 'admin' 
WHERE role = 'komdis';

-- 3. Update division passwords table
UPDATE division_passwords 
SET division_name = 'Admin', uuid_password = 'admin-2024'
WHERE division_name = 'Komdis';

-- 4. Add task_type column to tasks table if it doesn't exist
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS task_type VARCHAR(20) DEFAULT 'individu' 
CHECK (task_type IN ('individu', 'per_sektor', 'angkatan'));

-- 5. Update existing tasks to have task_type
UPDATE tasks 
SET task_type = 'individu' 
WHERE task_type IS NULL;

-- 6. Drop ALL existing policies to avoid conflicts
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

-- 7. Recreate proper RLS policies for all user types
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

-- 8. Verify the setup
SELECT 'Migration completed successfully' as status;
SELECT COUNT(*) as admin_users FROM users WHERE role = 'admin';
SELECT COUNT(*) as admin_division_passwords FROM division_passwords WHERE division_name = 'Admin';

-- 9. Show all policies that were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('users', 'task_submissions')
ORDER BY tablename, policyname;
