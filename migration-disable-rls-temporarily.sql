-- Temporarily disable RLS for testing login issues
-- This script disables RLS temporarily to test if login works
-- WARNING: This reduces security, only use for testing

-- Disable RLS on users table temporarily
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Disable RLS on task_submissions table temporarily
ALTER TABLE task_submissions DISABLE ROW LEVEL SECURITY;

-- Show current RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('users', 'task_submissions');

-- Test query to see if we can access users data
SELECT COUNT(*) as total_users FROM users;
SELECT role, COUNT(*) as count FROM users GROUP BY role;
