-- JAVARI TV DATABASE MIGRATION
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/kteobfyferrukqeolofj/sql
-- Created: Feb 16, 2026 - CR AudioViz AI

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (clean slate)
DROP TABLE IF EXISTS recently_watched CASCADE;
DROP TABLE IF EXISTS user_favorites CASCADE;
DROP TABLE IF EXISTS channels CASCADE;
DROP TABLE IF EXISTS cities CASCADE;
DROP TABLE IF EXISTS regions CASCADE;
DROP TABLE IF EXISTS countries CASCADE;

-- Countries
CREATE TABLE countries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  flag_emoji TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Regions
CREATE TABLE regions (
  id TEXT PRIMARY KEY,
  country_id TEXT REFERENCES countries(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT,
  type TEXT DEFAULT 'state',
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
  network TEXT,
  logo_url TEXT,
  stream_url TEXT NOT NULL,
  country_id TEXT REFERENCES countries(id) ON DELETE CASCADE,
  region_id TEXT REFERENCES regions(id) ON DELETE SET NULL,
  city_id TEXT REFERENCES cities(id) ON DELETE SET NULL,
  is_national BOOLEAN DEFAULT false,
  is_local BOOLEAN DEFAULT false,
  category TEXT,
  language TEXT,
  hd BOOLEAN DEFAULT false,
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

-- Indexes for performance
CREATE INDEX idx_channels_country ON channels(country_id);
CREATE INDEX idx_channels_region ON channels(region_id);
CREATE INDEX idx_channels_city ON channels(city_id);
CREATE INDEX idx_channels_category ON channels(category);
CREATE INDEX idx_channels_active ON channels(is_active) WHERE is_active = true;
CREATE INDEX idx_user_favorites_user ON user_favorites(user_id);
CREATE INDEX idx_recently_watched_user ON recently_watched(user_id);

-- Seed data for testing
INSERT INTO countries (id, name, code, flag_emoji, sort_order) VALUES
  ('us', 'United States', 'US', '🇺🇸', 1),
  ('gb', 'United Kingdom', 'GB', '🇬🇧', 2),
  ('ca', 'Canada', 'CA', '🇨🇦', 3);

INSERT INTO regions (id, country_id, name, code, type, sort_order) VALUES
  ('us-oh', 'us', 'Ohio', 'OH', 'state', 1),
  ('us-fl', 'us', 'Florida', 'FL', 'state', 2);

INSERT INTO cities (id, region_id, name, latitude, longitude) VALUES
  ('us-oh-cincinnati', 'us-oh', 'Cincinnati', 39.1031, -84.5120),
  ('us-fl-cape-coral', 'us-fl', 'Cape Coral', 26.5629, -81.9495);

-- Sample Cincinnati channels for Roy
INSERT INTO channels (id, name, call_sign, network, stream_url, country_id, region_id, city_id, is_local, category, language, is_active) VALUES
  ('wkrc-12', 'WKRC CBS 12', 'WKRC', 'CBS', 'https://content.uplynk.com/channel/ff809e6d9ec34109abfb333f0d4444b5.m3u8', 'us', 'us-oh', 'us-oh-cincinnati', true, 'news', 'en', true),
  ('wcpo-9', 'WCPO ABC 9', 'WCPO', 'ABC', 'https://content.uplynk.com/channel/3324f2467c414329b3b0cc5cd987b6be.m3u8', 'us', 'us-oh', 'us-oh-cincinnati', true, 'news', 'en', true),
  ('wlwt-5', 'WLWT NBC 5', 'WLWT', 'NBC', 'https://content.uplynk.com/channel/328d1434fb51476ea6ca1c8a6449b9e7.m3u8', 'us', 'us-oh', 'us-oh-cincinnati', true, 'news', 'en', true);

-- Sample national channels
INSERT INTO channels (id, name, network, stream_url, country_id, is_national, category, language, is_active) VALUES
  ('cnn-us', 'CNN', 'CNN', 'https://cnn-cnninternational-1-eu.rakuten.wurl.tv/playlist.m3u8', 'us', true, 'news', 'en', true),
  ('fox-news-us', 'Fox News', 'Fox News', 'https://fox-foxnewsnow-samsungus.amagi.tv/playlist.m3u8', 'us', true, 'news', 'en', true),
  ('espn-us', 'ESPN', 'ESPN', 'https://espn-espn-1-us.plex.wurl.tv/playlist.m3u8', 'us', true, 'sports', 'en', true);

-- Success message
SELECT 'Database setup complete! Tables created with sample data.' AS status;
