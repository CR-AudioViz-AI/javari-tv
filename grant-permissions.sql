-- GRANT PERMISSIONS TO ANON ROLE
-- Roy Henderson - CR AudioViz AI
-- Feb 16, 2026 3:36 PM EST
-- Fix: anon role needs explicit SELECT grants

-- Grant SELECT on all tables to anon and authenticated roles
GRANT SELECT ON countries TO anon, authenticated;
GRANT SELECT ON regions TO anon, authenticated;
GRANT SELECT ON cities TO anon, authenticated;
GRANT SELECT ON channels TO anon, authenticated;

-- Grant full access on user tables
GRANT ALL ON user_favorites TO anon, authenticated;
GRANT ALL ON recently_watched TO anon, authenticated;

-- Grant usage on sequences if any exist
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Verify grants
SELECT 
    grantee, 
    table_name, 
    privilege_type
FROM information_schema.table_privileges
WHERE table_schema = 'public' 
  AND table_name IN ('countries', 'regions', 'cities', 'channels', 'user_favorites', 'recently_watched')
  AND grantee IN ('anon', 'authenticated')
ORDER BY table_name, grantee, privilege_type;
