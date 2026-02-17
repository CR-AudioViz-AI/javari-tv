-- Verify RLS Policies for Javari TV
-- Roy Henderson - CR AudioViz AI
-- Feb 16, 2026 3:02 PM EST

-- Check if RLS is enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('countries', 'regions', 'cities', 'channels', 'user_favorites', 'recently_watched')
ORDER BY tablename;

-- Check existing policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('countries', 'regions', 'cities', 'channels', 'user_favorites', 'recently_watched')
ORDER BY tablename, policyname;
