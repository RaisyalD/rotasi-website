-- Complete Admin Setup Migration
-- This script combines all necessary changes for admin system
-- Run this script to set up the complete admin system

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

-- 6. Drop old RLS policies and any conflicting policies
DROP POLICY IF EXISTS "Komdis can view all data" ON users;
DROP POLICY IF EXISTS "Komdis can view all submissions" ON task_submissions;

-- Drop any existing policies that might conflict
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Acara can view all data" ON users;
DROP POLICY IF EXISTS "Admin can view all data" ON users;
DROP POLICY IF EXISTS "Users can view their own submissions" ON task_submissions;
DROP POLICY IF EXISTS "Mentor can view submissions from their sector" ON task_submissions;
DROP POLICY IF EXISTS "Acara can view all submissions" ON task_submissions;
DROP POLICY IF EXISTS "Admin can view all submissions" ON task_submissions;
DROP POLICY IF EXISTS "Admin can insert users" ON users;
DROP POLICY IF EXISTS "Admin can select all users" ON users;
DROP POLICY IF EXISTS "Admin can update users" ON users;
DROP POLICY IF EXISTS "Admin can delete users" ON users;
DROP POLICY IF EXISTS "Admin can manage all submissions" ON task_submissions;

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
