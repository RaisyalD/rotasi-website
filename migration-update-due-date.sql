-- Migration script to update due_date column from DATE to TIMESTAMP WITH TIME ZONE
-- Run this script in your Supabase SQL editor

-- First, add a new column with the correct type
ALTER TABLE tasks ADD COLUMN due_date_new TIMESTAMP WITH TIME ZONE;

-- Update the new column with existing data (assuming existing dates should be at end of day)
UPDATE tasks SET due_date_new = due_date::timestamp + interval '23 hours 59 minutes';

-- Drop the old column
ALTER TABLE tasks DROP COLUMN due_date;

-- Rename the new column to the original name
ALTER TABLE tasks RENAME COLUMN due_date_new TO due_date;

-- Add NOT NULL constraint
ALTER TABLE tasks ALTER COLUMN due_date SET NOT NULL;
