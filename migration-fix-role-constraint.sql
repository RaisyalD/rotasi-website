-- Fix role constraint to allow 'admin' role
-- This script should be run to update the existing database

-- Drop the existing check constraint
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;

-- Add the new check constraint that includes 'admin'
ALTER TABLE users ADD CONSTRAINT users_role_check 
CHECK (role IN ('peserta', 'mentor', 'acara', 'admin'));

-- Verify the constraint was added correctly
SELECT conname, consrc 
FROM pg_constraint 
WHERE conname = 'users_role_check';
