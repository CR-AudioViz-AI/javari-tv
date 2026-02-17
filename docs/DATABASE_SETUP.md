# Database Setup Instructions

## Supabase Tables Required

Execute this SQL in your Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

-- Indexes
CREATE INDEX idx_channels_country ON channels(country_id);
CREATE INDEX idx_channels_region ON channels(region_id);
CREATE INDEX idx_channels_city ON channels(city_id);
CREATE INDEX idx_channels_category ON channels(category);
CREATE INDEX idx_user_favorites_user ON user_favorites(user_id);
CREATE INDEX idx_recently_watched_user ON recently_watched(user_id);
```

## Initial Data Load

After tables are created, initialize with sample data:

```bash
curl -X POST http://localhost:3000/api/channels?action=init
```

This will:
1. Load sample countries (US, UK, Canada)
2. Load sample regions (Ohio, Florida, etc.)
3. Load sample cities (Cincinnati, Cape Coral)
4. Fetch and load IPTV-org channel database
