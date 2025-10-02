-- Migration script to change komdis role to admin
-- Run this script to update existing komdis users to admin role

-- First, fix the role constraint to allow 'admin'
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check 
CHECK (role IN ('peserta', 'mentor', 'acara', 'admin'));

-- Update existing komdis users to admin role
UPDATE users 
SET role = 'admin' 
WHERE role = 'komdis';

-- Update division passwords table
UPDATE division_passwords 
SET division_name = 'Admin', uuid_password = 'admin-2024'
WHERE division_name = 'Komdis';

-- Add task_type column to tasks table if it doesn't exist
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS task_type VARCHAR(20) DEFAULT 'individu' 
CHECK (task_type IN ('individu', 'per_sektor', 'angkatan'));

-- Update existing tasks to have task_type
UPDATE tasks 
SET task_type = 'individu' 
WHERE task_type IS NULL;

-- Update RLS policies to use admin instead of komdis
DROP POLICY IF EXISTS "Komdis can view all data" ON users;
DROP POLICY IF EXISTS "Komdis can view all submissions" ON task_submissions;

-- Create new admin policies
CREATE POLICY "Admin can view all data" ON users
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM users WHERE role = 'admin'
        )
    );

CREATE POLICY "Admin can view all submissions" ON task_submissions
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM users WHERE role = 'admin'
        )
    );
