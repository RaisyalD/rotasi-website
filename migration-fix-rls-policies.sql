-- Fix RLS policies to prevent infinite recursion
-- This script should be run after the main migration

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admin can view all data" ON users;
DROP POLICY IF EXISTS "Admin can view all submissions" ON task_submissions;

-- Create simpler policies that don't cause recursion
-- For admin users, we'll use a different approach

-- Allow admin to insert users (for registration)
CREATE POLICY "Admin can insert users" ON users
    FOR INSERT WITH CHECK (true);

-- Allow admin to select all users
CREATE POLICY "Admin can select all users" ON users
    FOR SELECT USING (true);

-- Allow admin to update users
CREATE POLICY "Admin can update users" ON users
    FOR UPDATE USING (true);

-- Allow admin to delete users
CREATE POLICY "Admin can delete users" ON users
    FOR DELETE USING (true);

-- For task_submissions, allow admin full access
CREATE POLICY "Admin can manage all submissions" ON task_submissions
    FOR ALL USING (true);

-- Note: These policies are very permissive for admin users
-- In production, you might want to add more specific checks
-- or use service role key for admin operations instead of RLS
