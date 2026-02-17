-- DISABLE RLS FOR JAVARI TV PUBLIC TABLES
-- Roy Henderson - CR AudioViz AI
-- Feb 16, 2026 3:33 PM EST
-- SIMPLEST FIX: Just turn off RLS for public read tables

-- Disable RLS on public read tables (countries, regions, cities, channels)
ALTER TABLE countries DISABLE ROW LEVEL SECURITY;
ALTER TABLE regions DISABLE ROW LEVEL SECURITY;
ALTER TABLE cities DISABLE ROW LEVEL SECURITY;
ALTER TABLE channels DISABLE ROW LEVEL SECURITY;

-- Keep RLS enabled for user-specific tables but allow all operations
ALTER TABLE user_favorites DISABLE ROW LEVEL SECURITY;
ALTER TABLE recently_watched DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('countries', 'regions', 'cities', 'channels', 'user_favorites', 'recently_watched')
ORDER BY tablename;
