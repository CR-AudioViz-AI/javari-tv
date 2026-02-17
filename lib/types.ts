// Javari TV Type Definitions
// Created: Feb 16, 2026 - Roy Henderson, CR AudioViz AI

export interface Country {
  id: string
  name: string
  code: string // ISO 2-letter code (US, GB, etc)
  flag_emoji: string
  sort_order: number
}

export interface Region {
  id: string
  country_id: string
  name: string
  code: string | null // State code (OH, CA, etc)
  type: string // 'state', 'province', 'territory'
  sort_order: number
}

export interface City {
  id: string
  region_id: string
  name: string
  latitude: number | null
  longitude: number | null
}

export interface Channel {
  id: string
  name: string
  call_sign: string | null
  network: string | null
  logo_url: string | null
  stream_url: string
  
  // Location hierarchy
  country_id: string
  region_id: string | null
  city_id: string | null
  is_national: boolean
  is_local: boolean
  
  // Metadata
  category: string | null // 'news', 'sports', 'movies', 'kids'
  language: string | null // 'en', 'es', 'fr'
  hd: boolean
  
  // Status
  is_active: boolean
  last_checked: string | null
  
  created_at: string
  updated_at: string
}

export interface UserFavorite {
  id: string
  user_id: string
  channel_id: string
  added_at: string
}

export interface RecentlyWatched {
  id: string
  user_id: string
  channel_id: string
  watched_at: string
}

// Navigation state
export interface NavigationState {
  selectedCountry: string | null
  selectedRegion: string | null
  selectedCity: string | null
  view: 'favorites' | 'recent' | 'browse'
}

// Channel with location details
export interface ChannelWithLocation extends Channel {
  country?: Country
  region?: Region
  city?: City
}
