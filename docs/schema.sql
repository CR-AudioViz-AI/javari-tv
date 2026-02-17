-- Javari TV Database Schema
-- Created: Feb 16, 2026 for Roy Henderson, CR AudioViz AI
-- Netflix-style live TV platform with 10,000+ channels

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Countries table
CREATE TABLE IF NOT EXISTS countries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE, -- ISO 2-letter: 'US', 'GB', etc.
  flag_emoji TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Regions (States/Provinces/Territories)
CREATE TABLE IF NOT EXISTS regions (
  id TEXT PRIMARY KEY,
  country_id TEXT REFERENCES countries(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT, -- State code: 'OH', 'CA', etc.
  type TEXT DEFAULT 'state', -- 'state', 'province', 'territory'
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Cities
CREATE TABLE IF NOT EXISTS cities (
  id TEXT PRIMARY KEY,
  region_id TEXT REFERENCES regions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  latitude DECIMAL,
  longitude DECIMAL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Channels
CREATE TABLE IF NOT EXISTS channels (
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

-- User Favorites (using localStorage user_id for now, auth later)
CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  channel_id TEXT REFERENCES channels(id) ON DELETE CASCADE,
  added_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, channel_id)
);

-- Recently Watched
CREATE TABLE IF NOT EXISTS recently_watched (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  channel_id TEXT REFERENCES channels(id) ON DELETE CASCADE,
  watched_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, channel_id)
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_channels_country ON channels(country_id);
CREATE INDEX IF NOT EXISTS idx_channels_region ON channels(region_id);
CREATE INDEX IF NOT EXISTS idx_channels_city ON channels(city_id);
CREATE INDEX IF NOT EXISTS idx_channels_category ON channels(category);
CREATE INDEX IF NOT EXISTS idx_channels_active ON channels(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_channels_national ON channels(country_id, is_national) WHERE is_national = true;
CREATE INDEX IF NOT EXISTS idx_channels_local ON channels(city_id, is_local) WHERE is_local = true;
CREATE INDEX IF NOT EXISTS idx_user_favorites_user ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_recently_watched_user ON recently_watched(user_id);
CREATE INDEX IF NOT EXISTS idx_regions_country ON regions(country_id);
CREATE INDEX IF NOT EXISTS idx_cities_region ON cities(region_id);

-- Insert initial test data (Cincinnati, Ohio for Roy)
INSERT INTO countries (id, name, code, flag_emoji, sort_order) VALUES
  ('us', 'United States', 'US', '🇺🇸', 1),
  ('gb', 'United Kingdom', 'GB', '🇬🇧', 2),
  ('ca', 'Canada', 'CA', '🇨🇦', 3)
ON CONFLICT (code) DO NOTHING;

INSERT INTO regions (id, country_id, name, code, type, sort_order) VALUES
  ('us-oh', 'us', 'Ohio', 'OH', 'state', 1),
  ('us-fl', 'us', 'Florida', 'FL', 'state', 2),
  ('us-ca', 'us', 'California', 'CA', 'state', 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO cities (id, region_id, name, latitude, longitude) VALUES
  ('us-oh-cincinnati', 'us-oh', 'Cincinnati', 39.1031, -84.5120),
  ('us-oh-cleveland', 'us-oh', 'Cleveland', 41.4993, -81.6944),
  ('us-fl-cape-coral', 'us-fl', 'Cape Coral', 26.5629, -81.9495)
ON CONFLICT (id) DO NOTHING;

-- Sample Cincinnati channels for testing
INSERT INTO channels (id, name, call_sign, network, stream_url, country_id, region_id, city_id, is_local, category, language, is_active) VALUES
  ('wkrc-12', 'WKRC CBS 12', 'WKRC', 'CBS', 'https://placeholder-stream.com/wkrc', 'us', 'us-oh', 'us-oh-cincinnati', true, 'news', 'en', true),
  ('wcpo-9', 'WCPO ABC 9', 'WCPO', 'ABC', 'https://placeholder-stream.com/wcpo', 'us', 'us-oh', 'us-oh-cincinnati', true, 'news', 'en', true),
  ('wlwt-5', 'WLWT NBC 5', 'WLWT', 'NBC', 'https://placeholder-stream.com/wlwt', 'us', 'us-oh', 'us-oh-cincinnati', true, 'news', 'en', true),
  ('wxix-19', 'WXIX FOX 19', 'WXIX', 'Fox', 'https://placeholder-stream.com/wxix', 'us', 'us-oh', 'us-oh-cincinnati', true, 'news', 'en', true)
ON CONFLICT (id) DO NOTHING;

-- Sample national channels
INSERT INTO channels (id, name, network, stream_url, country_id, is_national, category, language, is_active) VALUES
  ('cnn-us', 'CNN', 'CNN', 'https://placeholder-stream.com/cnn', 'us', true, 'news', 'en', true),
  ('fox-news-us', 'Fox News', 'Fox News', 'https://placeholder-stream.com/foxnews', 'us', true, 'news', 'en', true),
  ('espn-us', 'ESPN', 'ESPN', 'https://placeholder-stream.com/espn', 'us', true, 'sports', 'en', true)
ON CONFLICT (id) DO NOTHING;
