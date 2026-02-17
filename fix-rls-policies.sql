-- Fix RLS Policies for Javari TV
-- Roy Henderson - CR AudioViz AI  
-- Feb 16, 2026 3:03 PM EST
-- This fixes the RLS policies to allow anon/authenticated read access

-- ============================================================================
-- DROP ALL EXISTING POLICIES (clean slate)
-- ============================================================================

DROP POLICY IF EXISTS "Allow public read access to countries" ON countries;
DROP POLICY IF EXISTS "Allow public read access to regions" ON regions;
DROP POLICY IF EXISTS "Allow public read access to cities" ON cities;
DROP POLICY IF EXISTS "Allow public read access to channels" ON channels;
DROP POLICY IF EXISTS "Users can view own favorites" ON user_favorites;
DROP POLICY IF EXISTS "Users can insert own favorites" ON user_favorites;
DROP POLICY IF EXISTS "Users can delete own favorites" ON user_favorites;
DROP POLICY IF EXISTS "Users can view own watch history" ON recently_watched;
DROP POLICY IF EXISTS "Users can insert own watch history" ON recently_watched;
DROP POLICY IF EXISTS "Users can delete own watch history" ON recently_watched;

-- ============================================================================
-- DISABLE RLS TEMPORARILY (for testing)
-- ============================================================================

ALTER TABLE countries DISABLE ROW LEVEL SECURITY;
ALTER TABLE regions DISABLE ROW LEVEL SECURITY;
ALTER TABLE cities DISABLE ROW LEVEL SECURITY;
ALTER TABLE channels DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites DISABLE ROW LEVEL SECURITY;
ALTER TABLE recently_watched DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RE-ENABLE RLS WITH CORRECT POLICIES
-- ============================================================================

ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE recently_watched ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- CREATE POLICIES - ALLOW ANON AND AUTHENTICATED ROLES
-- ============================================================================

-- Countries: Allow all reads
CREATE POLICY "countries_select_policy"
  ON countries FOR SELECT
  TO anon, authenticated
  USING (true);

-- Regions: Allow all reads
CREATE POLICY "regions_select_policy"
  ON regions FOR SELECT
  TO anon, authenticated
  USING (true);

-- Cities: Allow all reads
CREATE POLICY "cities_select_policy"
  ON cities FOR SELECT
  TO anon, authenticated
  USING (true);

-- Channels: Allow all reads
CREATE POLICY "channels_select_policy"
  ON channels FOR SELECT
  TO anon, authenticated
  USING (true);

-- User Favorites: Full CRUD for all users
CREATE POLICY "favorites_select_policy"
  ON user_favorites FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "favorites_insert_policy"
  ON user_favorites FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "favorites_delete_policy"
  ON user_favorites FOR DELETE
  TO anon, authenticated
  USING (true);

-- Recently Watched: Full CRUD for all users
CREATE POLICY "recent_select_policy"
  ON recently_watched FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "recent_insert_policy"
  ON recently_watched FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "recent_update_policy"
  ON recently_watched FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "recent_delete_policy"
  ON recently_watched FOR DELETE
  TO anon, authenticated
  USING (true);

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Show all policies
SELECT 
  tablename,
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('countries', 'regions', 'cities', 'channels', 'user_favorites', 'recently_watched')
ORDER BY tablename, policyname;
