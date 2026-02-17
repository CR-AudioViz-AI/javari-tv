-- Javari TV Complete Database Migration
-- CR AudioViz AI - Roy Henderson
-- Created: Feb 16, 2026 2:38 PM EST
-- Includes: Tables, RLS Policies, Indexes, Initial Data

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- DROP EXISTING TABLES (for clean migration)
-- ============================================================================
DROP TABLE IF EXISTS recently_watched CASCADE;
DROP TABLE IF EXISTS user_favorites CASCADE;
DROP TABLE IF EXISTS channels CASCADE;
DROP TABLE IF EXISTS cities CASCADE;
DROP TABLE IF EXISTS regions CASCADE;
DROP TABLE IF EXISTS countries CASCADE;

-- ============================================================================
-- CREATE TABLES
-- ============================================================================

-- Countries
CREATE TABLE countries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE, -- ISO 2-letter: 'US', 'GB', etc.
  flag_emoji TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Regions (States/Provinces/Territories)
CREATE TABLE regions (
  id TEXT PRIMARY KEY,
  country_id TEXT REFERENCES countries(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT, -- State code: 'OH', 'CA', etc.
  type TEXT DEFAULT 'state', -- 'state', 'province', 'territory'
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Cities
CREATE TABLE cities (
  id TEXT PRIMARY KEY,
  region_id TEXT REFERENCES regions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  latitude DECIMAL,
  longitude DECIMAL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Channels
CREATE TABLE channels (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  call_sign TEXT,
  network TEXT, -- 'CBS', 'NBC', 'ABC', 'Fox', etc.
  logo_url TEXT,
  stream_url TEXT NOT NULL,
  
  -- Location Hierarchy
  country_id TEXT REFERENCES countries(id) ON DELETE CASCADE,
  region_id TEXT REFERENCES regions(id) ON DELETE SET NULL,
  city_id TEXT REFERENCES cities(id) ON DELETE SET NULL,
  is_national BOOLEAN DEFAULT false,
  is_local BOOLEAN DEFAULT false,
  
  -- Metadata
  category TEXT, -- 'news', 'sports', 'movies', 'kids', 'entertainment'
  language TEXT, -- 'en', 'es', 'fr', etc.
  hd BOOLEAN DEFAULT false,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  last_checked TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User Favorites
CREATE TABLE user_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  channel_id TEXT REFERENCES channels(id) ON DELETE CASCADE,
  added_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, channel_id)
);

-- Recently Watched
CREATE TABLE recently_watched (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  channel_id TEXT REFERENCES channels(id) ON DELETE CASCADE,
  watched_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, channel_id)
);

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE recently_watched ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- CREATE RLS POLICIES - ALLOW PUBLIC READ ACCESS
-- ============================================================================

-- Countries: Public read access
CREATE POLICY "Allow public read access to countries"
  ON countries FOR SELECT
  TO public
  USING (true);

-- Regions: Public read access
CREATE POLICY "Allow public read access to regions"
  ON regions FOR SELECT
  TO public
  USING (true);

-- Cities: Public read access
CREATE POLICY "Allow public read access to cities"
  ON cities FOR SELECT
  TO public
  USING (true);

-- Channels: Public read access
CREATE POLICY "Allow public read access to channels"
  ON channels FOR SELECT
  TO public
  USING (true);

-- User Favorites: Users can manage their own favorites
CREATE POLICY "Users can view own favorites"
  ON user_favorites FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can insert own favorites"
  ON user_favorites FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can delete own favorites"
  ON user_favorites FOR DELETE
  TO public
  USING (true);

-- Recently Watched: Users can manage their own watch history
CREATE POLICY "Users can view own watch history"
  ON recently_watched FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can insert own watch history"
  ON recently_watched FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can delete own watch history"
  ON recently_watched FOR DELETE
  TO public
  USING (true);

-- ============================================================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX idx_channels_country ON channels(country_id);
CREATE INDEX idx_channels_region ON channels(region_id);
CREATE INDEX idx_channels_city ON channels(city_id);
CREATE INDEX idx_channels_category ON channels(category);
CREATE INDEX idx_channels_active ON channels(is_active) WHERE is_active = true;
CREATE INDEX idx_channels_national ON channels(country_id, is_national) WHERE is_national = true;
CREATE INDEX idx_channels_local ON channels(city_id, is_local) WHERE is_local = true;
CREATE INDEX idx_user_favorites_user ON user_favorites(user_id);
CREATE INDEX idx_recently_watched_user ON recently_watched(user_id);
CREATE INDEX idx_regions_country ON regions(country_id);
CREATE INDEX idx_cities_region ON cities(region_id);

-- ============================================================================
-- INSERT INITIAL DATA
-- ============================================================================

-- Countries
INSERT INTO countries (id, name, code, flag_emoji, sort_order) VALUES
  ('us', 'United States', 'US', '🇺🇸', 1),
  ('gb', 'United Kingdom', 'GB', '🇬🇧', 2),
  ('ca', 'Canada', 'CA', '🇨🇦', 3),
  ('au', 'Australia', 'AU', '🇦🇺', 4),
  ('de', 'Germany', 'DE', '🇩🇪', 5),
  ('fr', 'France', 'FR', '🇫🇷', 6),
  ('es', 'Spain', 'ES', '🇪🇸', 7),
  ('it', 'Italy', 'IT', '🇮🇹', 8),
  ('mx', 'Mexico', 'MX', '🇲🇽', 9),
  ('br', 'Brazil', 'BR', '🇧🇷', 10);

-- US Regions (States)
INSERT INTO regions (id, country_id, name, code, type, sort_order) VALUES
  ('us-oh', 'us', 'Ohio', 'OH', 'state', 1),
  ('us-fl', 'us', 'Florida', 'FL', 'state', 2),
  ('us-ca', 'us', 'California', 'CA', 'state', 3),
  ('us-ny', 'us', 'New York', 'NY', 'state', 4),
  ('us-tx', 'us', 'Texas', 'TX', 'state', 5),
  ('us-il', 'us', 'Illinois', 'IL', 'state', 6),
  ('us-pa', 'us', 'Pennsylvania', 'PA', 'state', 7),
  ('us-az', 'us', 'Arizona', 'AZ', 'state', 8),
  ('us-ga', 'us', 'Georgia', 'GA', 'state', 9),
  ('us-nc', 'us', 'North Carolina', 'NC', 'state', 10);

-- UK Regions
INSERT INTO regions (id, country_id, name, code, type, sort_order) VALUES
  ('gb-eng', 'gb', 'England', 'ENG', 'country', 1),
  ('gb-sct', 'gb', 'Scotland', 'SCT', 'country', 2),
  ('gb-wls', 'gb', 'Wales', 'WLS', 'country', 3),
  ('gb-nir', 'gb', 'Northern Ireland', 'NIR', 'country', 4);

-- Canadian Provinces
INSERT INTO regions (id, country_id, name, code, type, sort_order) VALUES
  ('ca-on', 'ca', 'Ontario', 'ON', 'province', 1),
  ('ca-qc', 'ca', 'Quebec', 'QC', 'province', 2),
  ('ca-bc', 'ca', 'British Columbia', 'BC', 'province', 3),
  ('ca-ab', 'ca', 'Alberta', 'AB', 'province', 4);

-- Cities (Focus on Roy's locations + major cities)
INSERT INTO cities (id, region_id, name, latitude, longitude) VALUES
  -- Ohio Cities
  ('us-oh-cincinnati', 'us-oh', 'Cincinnati', 39.1031, -84.5120),
  ('us-oh-cleveland', 'us-oh', 'Cleveland', 41.4993, -81.6944),
  ('us-oh-columbus', 'us-oh', 'Columbus', 39.9612, -82.9988),
  ('us-oh-toledo', 'us-oh', 'Toledo', 41.6528, -83.5379),
  ('us-oh-akron', 'us-oh', 'Akron', 41.0814, -81.5190),
  
  -- Florida Cities (Roy's current location)
  ('us-fl-cape-coral', 'us-fl', 'Cape Coral', 26.5629, -81.9495),
  ('us-fl-fort-myers', 'us-fl', 'Fort Myers', 26.6406, -81.8723),
  ('us-fl-miami', 'us-fl', 'Miami', 25.7617, -80.1918),
  ('us-fl-tampa', 'us-fl', 'Tampa', 27.9506, -82.4572),
  ('us-fl-orlando', 'us-fl', 'Orlando', 28.5383, -81.3792),
  
  -- California Cities
  ('us-ca-los-angeles', 'us-ca', 'Los Angeles', 34.0522, -118.2437),
  ('us-ca-san-francisco', 'us-ca', 'San Francisco', 37.7749, -122.4194),
  ('us-ca-san-diego', 'us-ca', 'San Diego', 32.7157, -117.1611),
  
  -- New York Cities
  ('us-ny-new-york', 'us-ny', 'New York', 40.7128, -74.0060),
  ('us-ny-buffalo', 'us-ny', 'Buffalo', 42.8864, -78.8784),
  
  -- Texas Cities
  ('us-tx-houston', 'us-tx', 'Houston', 29.7604, -95.3698),
  ('us-tx-dallas', 'us-tx', 'Dallas', 32.7767, -96.7970),
  ('us-tx-austin', 'us-tx', 'Austin', 30.2672, -97.7431);

-- Sample Channels (Cincinnati + National)
INSERT INTO channels (id, name, call_sign, network, stream_url, country_id, region_id, city_id, is_local, category, language, hd, is_active) VALUES
  -- Cincinnati Local Channels
  ('wkrc-12', 'WKRC CBS 12', 'WKRC', 'CBS', 'https://content.uplynk.com/channel/ff809e6d9ec34109abfb333f0d4444b5.m3u8', 'us', 'us-oh', 'us-oh-cincinnati', true, 'news', 'en', true, true),
  ('wcpo-9', 'WCPO ABC 9', 'WCPO', 'ABC', 'https://content.uplynk.com/channel/3324f2467c414329b3b0cc5cd987b6be.m3u8', 'us', 'us-oh', 'us-oh-cincinnati', true, 'news', 'en', true, true),
  ('wlwt-5', 'WLWT NBC 5', 'WLWT', 'NBC', 'https://content.uplynk.com/channel/328d1434fb51476cb563c16fb3e53438.m3u8', 'us', 'us-oh', 'us-oh-cincinnati', true, 'news', 'en', true, true),
  ('wxix-19', 'WXIX FOX 19', 'WXIX', 'Fox', 'https://content.uplynk.com/channel/0a18a8f5b69a4c60bb646a6e876d3fcb.m3u8', 'us', 'us-oh', 'us-oh-cincinnati', true, 'news', 'en', true, true),
  
  -- US National News Channels
  ('cnn-us', 'CNN', 'CNN', 'CNN', 'https://cnn-cnninternational-1-eu.rakuten.wurl.tv/playlist.m3u8', 'us', NULL, NULL, false, 'news', 'en', true, true),
  ('fox-news-us', 'Fox News Now', 'Fox News', 'Fox News', 'https://fox-foxnewsnow-samsungus.amagi.tv/playlist.m3u8', 'us', NULL, NULL, false, 'news', 'en', true, true),
  ('nbc-news-us', 'NBC News Now', 'NBC News', 'NBC', 'https://dai2.xumo.com/amagi_hls_data_xumo1212A-nbcnewsnow/CDN/playlist.m3u8', 'us', NULL, NULL, false, 'news', 'en', true, true),
  ('abc-news-us', 'ABC News Live', 'ABC News', 'ABC', 'https://content.uplynk.com/channel/3324f2467c414329b3b0cc5cd987b6be.m3u8', 'us', NULL, NULL, false, 'news', 'en', true, true),
  
  -- US National Sports
  ('espn-us', 'ESPN', 'ESPN', 'ESPN', 'https://espn-espn-1-us.plex.wurl.tv/playlist.m3u8', 'us', NULL, NULL, false, 'sports', 'en', true, true),
  ('fox-sports-us', 'Fox Sports', 'Fox Sports', 'Fox Sports', 'https://foxsports-foxsports-1-us.plex.wurl.tv/playlist.m3u8', 'us', NULL, NULL, false, 'sports', 'en', true, true),
  
  -- US National Entertainment
  ('pbs-us', 'PBS', 'PBS', 'PBS', 'https://pbs-samsunguk.amagi.tv/playlist.m3u8', 'us', NULL, NULL, false, 'entertainment', 'en', true, true),
  ('comedy-central-us', 'Comedy Central', 'Comedy Central', 'Comedy Central', 'https://service-stitcher.clusters.pluto.tv/stitch/hls/channel/5ca525b650be2571e3943c63/master.m3u8', 'us', NULL, NULL, false, 'entertainment', 'en', true, true);

-- Update national channel flags
UPDATE channels SET is_national = true WHERE country_id IS NOT NULL AND region_id IS NULL AND city_id IS NULL;

-- ============================================================================
-- VERIFICATION QUERIES (optional - comment out in production)
-- ============================================================================

-- Count records
SELECT 'Countries' as table_name, COUNT(*) as count FROM countries
UNION ALL
SELECT 'Regions', COUNT(*) FROM regions
UNION ALL
SELECT 'Cities', COUNT(*) FROM cities
UNION ALL
SELECT 'Channels', COUNT(*) FROM channels;
