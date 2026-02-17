// API Endpoint to Load IPTV-org Channels
// Javari TV - CR AudioViz AI
// Roy Henderson - Feb 16, 2026 3:45 PM EST
// Call this from browser: /api/load-channels

import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const CHANNELS_URL = 'https://iptv-org.github.io/iptv/channels.json'
const STREAMS_URL = 'https://iptv-org.github.io/iptv/streams.json'

const COUNTRY_CODES = {
  'us': 'United States',
  'gb': 'United Kingdom',
  'ca': 'Canada',
  'au': 'Australia',
  'de': 'Germany',
  'fr': 'France',
  'es': 'Spain',
  'it': 'Italy',
  'mx': 'Mexico',
  'br': 'Brazil',
  'jp': 'Japan',
  'kr': 'South Korea',
  'in': 'India',
  'ar': 'Argentina',
  'nl': 'Netherlands',
  'se': 'Sweden',
  'no': 'Norway',
  'dk': 'Denmark',
  'fi': 'Finland',
  'pl': 'Poland'
}

function generateChannelId(name: string, country: string): string {
  const clean = name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return `${country}-${clean}-${Date.now()}`.substring(0, 50)
}

function categorizeChannel(name: string, categories?: string[]): string {
  const nameLower = name.toLowerCase()
  
  if (categories?.includes('news') || nameLower.includes('news')) return 'news'
  if (categories?.includes('sports') || nameLower.includes('sport')) return 'sports'
  if (categories?.includes('movies') || nameLower.includes('movie') || nameLower.includes('cinema')) return 'movies'
  if (categories?.includes('kids') || nameLower.includes('kids') || nameLower.includes('cartoon')) return 'kids'
  if (categories?.includes('music') || nameLower.includes('music')) return 'entertainment'
  
  return 'entertainment'
}

export async function GET() {
  const startTime = Date.now()
  const log: string[] = []
  
  try {
    log.push('🚀 Starting IPTV-org channel import...')
    
    // Fetch data from IPTV-org
    log.push('📡 Fetching channel and stream data...')
    
    const [channelsRes, streamsRes] = await Promise.all([
      fetch(CHANNELS_URL),
      fetch(STREAMS_URL)
    ])
    
    if (!channelsRes.ok || !streamsRes.ok) {
      throw new Error('Failed to fetch IPTV-org data')
    }
    
    const channels = await channelsRes.json()
    const streams = await streamsRes.json()
    
    log.push(`✅ Found ${channels.length} channels and ${streams.length} streams`)
    
    // Build stream lookup map
    const streamMap = new Map<string, any[]>()
    streams.forEach((stream: any) => {
      if (stream.channel && stream.url && stream.status?.toLowerCase() === 'online') {
        if (!streamMap.has(stream.channel)) {
          streamMap.set(stream.channel, [])
        }
        streamMap.get(stream.channel)!.push(stream)
      }
    })
    
    // Process channels by country
    const channelsByCountry = new Map<string, any[]>()
    let totalProcessed = 0
    
    for (const channel of channels) {
      if (!channel.country || !streamMap.has(channel.id)) continue
      
      const countryCode = channel.country.toLowerCase()
      if (!COUNTRY_CODES[countryCode as keyof typeof COUNTRY_CODES]) continue
      
      const channelStreams = streamMap.get(channel.id)
      if (!channelStreams || channelStreams.length === 0) continue
      
      const stream = channelStreams[0]
      
      const channelData = {
        id: generateChannelId(channel.name, countryCode),
        name: channel.name,
        network: channel.network || null,
        logo_url: channel.logo || null,
        stream_url: stream.url,
        country_id: countryCode,
        region_id: null,
        city_id: null,
        is_national: true,
        is_local: false,
        category: categorizeChannel(channel.name, channel.categories),
        language: channel.languages?.[0] || 'en',
        hd: stream.url.includes('1080') || stream.url.includes('hd'),
        is_active: true,
        last_checked: new Date().toISOString()
      }
      
      if (!channelsByCountry.has(countryCode)) {
        channelsByCountry.set(countryCode, [])
      }
      channelsByCountry.get(countryCode)!.push(channelData)
      totalProcessed++
    }
    
    log.push(`✅ Processed ${totalProcessed} channels with working streams`)
    
    // Show distribution
    const distribution: Record<string, number> = {}
    for (const [country, chs] of channelsByCountry.entries()) {
      distribution[COUNTRY_CODES[country as keyof typeof COUNTRY_CODES]] = chs.length
    }
    log.push(`📊 Distribution: ${JSON.stringify(distribution, null, 2)}`)
    
    // Insert into database in batches
    log.push('💾 Inserting into database...')
    let insertedCount = 0
    let errorCount = 0
    
    for (const [country, chs] of channelsByCountry.entries()) {
      // Insert in batches of 50
      for (let i = 0; i < chs.length; i += 50) {
        const batch = chs.slice(i, i + 50)
        
        const { error } = await supabase
          .from('channels')
          .upsert(batch, { onConflict: 'id' })
        
        if (error) {
          log.push(`❌ Error inserting batch for ${country}: ${error.message}`)
          errorCount += batch.length
        } else {
          insertedCount += batch.length
        }
        
        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 50))
      }
    }
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2)
    
    log.push('✅ IMPORT COMPLETE!')
    log.push(`📊 Summary:`)
    log.push(`   Total processed: ${totalProcessed}`)
    log.push(`   Successfully inserted: ${insertedCount}`)
    log.push(`   Errors: ${errorCount}`)
    log.push(`   Countries: ${channelsByCountry.size}`)
    log.push(`   Duration: ${duration}s`)
    
    return NextResponse.json({
      success: true,
      totalProcessed,
      insertedCount,
      errorCount,
      countries: channelsByCountry.size,
      distribution,
      duration: `${duration}s`,
      log
    })
    
  } catch (error: any) {
    log.push(`❌ Error: ${error.message}`)
    return NextResponse.json({
      success: false,
      error: error.message,
      log
    }, { status: 500 })
  }
}
