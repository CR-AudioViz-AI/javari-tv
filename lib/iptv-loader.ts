// IPTV Data Loader
// Fetches channel data from IPTV-org GitHub repository
// Javari TV - CR AudioViz AI - Feb 16, 2026

import { supabaseAdmin } from './supabase'

interface IPTVChannel {
  id: string
  name: string
  network?: string
  logo?: string
  stream_url: string
  country: string
  categories?: string[]
  languages?: string[]
}

/**
 * Fetch channels from IPTV-org database
 * Source: https://github.com/iptv-org/database
 */
export async function fetchIPTVChannels(): Promise<IPTVChannel[]> {
  try {
    // Fetch the channels.csv from IPTV-org repository
    const response = await fetch(
      'https://raw.githubusercontent.com/iptv-org/database/master/data/channels.csv'
    )
    
    if (!response.ok) {
      throw new Error(`Failed to fetch IPTV data: ${response.statusText}`)
    }
    
    const csvText = await response.text()
    return parseIPTVChannels(csvText)
  } catch (error) {
    console.error('Error fetching IPTV channels:', error)
    return []
  }
}

/**
 * Parse CSV data from IPTV-org
 */
function parseIPTVChannels(csv: string): IPTVChannel[] {
  const lines = csv.split('\n')
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
  
  const channels: IPTVChannel[] = []
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    
    const values = line.split(',').map(v => v.trim().replace(/"/g, ''))
    const channel: any = {}
    
    headers.forEach((header, index) => {
      channel[header] = values[index] || ''
    })
    
    // Map to our channel structure
    if (channel.id && channel.name) {
      channels.push({
        id: channel.id,
        name: channel.name,
        network: channel.network,
        logo: channel.logo,
        stream_url: channel.stream_url || channel.url || '',
        country: channel.country || 'US',
        categories: channel.categories ? channel.categories.split(';') : [],
        languages: channel.languages ? channel.languages.split(';') : ['en'],
      })
    }
  }
  
  return channels
}

/**
 * Load channels into Supabase
 */
export async function loadChannelsToSupabase(channels: IPTVChannel[]) {
  console.log(`Loading ${channels.length} channels to Supabase...`)
  
  // Group by country for efficient insertion
  const byCountry = channels.reduce((acc, ch) => {
    const country = ch.country.toLowerCase()
    if (!acc[country]) acc[country] = []
    acc[country].push(ch)
    return acc
  }, {} as Record<string, IPTVChannel[]>)
  
  let inserted = 0
  
  for (const [countryCode, countryChannels] of Object.entries(byCountry)) {
    // Ensure country exists
    const { error: countryError } = await supabaseAdmin
      .from('countries')
      .upsert({
        id: countryCode,
        code: countryCode.toUpperCase(),
        name: getCountryName(countryCode),
        flag_emoji: getCountryFlag(countryCode),
        sort_order: countryCode === 'us' ? 1 : 999,
      }, { onConflict: 'code' })
    
    if (countryError) {
      console.error(`Error upserting country ${countryCode}:`, countryError)
      continue
    }
    
    // Insert channels in batches
    const batchSize = 100
    for (let i = 0; i < countryChannels.length; i += batchSize) {
      const batch = countryChannels.slice(i, i + batchSize)
      
      const channelData = batch.map(ch => ({
        id: ch.id,
        name: ch.name,
        network: ch.network || null,
        logo_url: ch.logo || null,
        stream_url: ch.stream_url,
        country_id: countryCode,
        is_national: true, // Assume national for now
        category: ch.categories?.[0] || 'general',
        language: ch.languages?.[0] || 'en',
        is_active: true,
      }))
      
      const { error } = await supabaseAdmin
        .from('channels')
        .upsert(channelData, { onConflict: 'id' })
      
      if (error) {
        console.error(`Error inserting batch:`, error)
      } else {
        inserted += batch.length
        console.log(`Inserted ${inserted}/${channels.length} channels...`)
      }
    }
  }
  
  console.log(`✅ Loaded ${inserted} channels successfully`)
  return inserted
}

/**
 * Helper: Get country name from code
 */
function getCountryName(code: string): string {
  const countries: Record<string, string> = {
    us: 'United States',
    gb: 'United Kingdom',
    ca: 'Canada',
    au: 'Australia',
    de: 'Germany',
    fr: 'France',
    es: 'Spain',
    it: 'Italy',
    br: 'Brazil',
    mx: 'Mexico',
    // Add more as needed
  }
  return countries[code.toLowerCase()] || code.toUpperCase()
}

/**
 * Helper: Get country flag emoji
 */
function getCountryFlag(code: string): string {
  const flags: Record<string, string> = {
    us: '🇺🇸',
    gb: '🇬🇧',
    ca: '🇨🇦',
    au: '🇦🇺',
    de: '🇩🇪',
    fr: '🇫🇷',
    es: '🇪🇸',
    it: '🇮🇹',
    br: '🇧🇷',
    mx: '🇲🇽',
  }
  return flags[code.toLowerCase()] || '🌐'
}

/**
 * Initialize Javari TV database with sample data
 */
export async function initializeJavariTV() {
  console.log('🚀 Initializing Javari TV database...')
  
  // First, create sample data for testing
  await createSampleData()
  
  // Then fetch real IPTV data
  const channels = await fetchIPTVChannels()
  
  if (channels.length > 0) {
    await loadChannelsToSupabase(channels)
  }
  
  console.log('✅ Javari TV initialization complete')
}

/**
 * Create sample data for testing (Cincinnati channels for Roy)
 */
async function createSampleData() {
  console.log('Creating sample data...')
  
  // Countries
  await supabaseAdmin.from('countries').upsert([
    { id: 'us', name: 'United States', code: 'US', flag_emoji: '🇺🇸', sort_order: 1 },
    { id: 'gb', name: 'United Kingdom', code: 'GB', flag_emoji: '🇬🇧', sort_order: 2 },
    { id: 'ca', name: 'Canada', code: 'CA', flag_emoji: '🇨🇦', sort_order: 3 },
  ], { onConflict: 'code' })
  
  // Regions
  await supabaseAdmin.from('regions').upsert([
    { id: 'us-oh', country_id: 'us', name: 'Ohio', code: 'OH', type: 'state' },
    { id: 'us-fl', country_id: 'us', name: 'Florida', code: 'FL', type: 'state' },
  ], { onConflict: 'id' })
  
  // Cities
  await supabaseAdmin.from('cities').upsert([
    { id: 'us-oh-cincinnati', region_id: 'us-oh', name: 'Cincinnati' },
    { id: 'us-fl-cape-coral', region_id: 'us-fl', name: 'Cape Coral' },
  ], { onConflict: 'id' })
  
  // Sample channels
  await supabaseAdmin.from('channels').upsert([
    {
      id: 'wkrc-12',
      name: 'WKRC CBS 12',
      call_sign: 'WKRC',
      network: 'CBS',
      stream_url: 'https://content.uplynk.com/channel/ff809e6d9ec34109abfb333f0d4444b5.m3u8',
      country_id: 'us',
      region_id: 'us-oh',
      city_id: 'us-oh-cincinnati',
      is_local: true,
      category: 'news',
      language: 'en',
      is_active: true,
    },
    {
      id: 'cnn-us',
      name: 'CNN',
      network: 'CNN',
      stream_url: 'https://cnn-cnninternational-1-eu.rakuten.wurl.tv/playlist.m3u8',
      country_id: 'us',
      is_national: true,
      category: 'news',
      language: 'en',
      is_active: true,
    },
  ], { onConflict: 'id' })
  
  console.log('✅ Sample data created')
}
