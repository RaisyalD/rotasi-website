-- Check user data and structure
-- This script helps diagnose login issues by checking user data

-- Check if users table has the expected structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- Check user data
SELECT 
    id,
    nama_lengkap,
    email,
    role,
    sektor,
    is_active,
    created_at
FROM users 
ORDER BY role, created_at;

-- Check if there are any users with is_active = false
SELECT 
    role,
    COUNT(*) as total,
    COUNT(CASE WHEN is_active = true THEN 1 END) as active,
    COUNT(CASE WHEN is_active = false THEN 1 END) as inactive
FROM users 
GROUP BY role;

-- Check sector passwords
SELECT * FROM sector_passwords ORDER BY sector_number;

-- Check division passwords
SELECT * FROM division_passwords;

-- Check if there are any NULL values in critical fields
SELECT 
    'email' as field,
    COUNT(*) as total,
    COUNT(email) as non_null,
    COUNT(*) - COUNT(email) as null_count
FROM users
UNION ALL
SELECT 
    'password_hash' as field,
    COUNT(*) as total,
    COUNT(password_hash) as non_null,
    COUNT(*) - COUNT(password_hash) as null_count
FROM users
UNION ALL
SELECT 
    'login_password_hash' as field,
    COUNT(*) as total,
    COUNT(login_password_hash) as non_null,
    COUNT(*) - COUNT(login_password_hash) as null_count
FROM users;
