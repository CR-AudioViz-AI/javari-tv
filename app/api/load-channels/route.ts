// COMPREHENSIVE MULTI-SOURCE CHANNEL LOADER
// Javari TV - CR AudioViz AI
// Roy Henderson - Feb 16, 2026 4:26 PM EST
// Loads THOUSANDS of channels from multiple M3U sources

import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// M3U playlist sources for maximum channel coverage
const M3U_SOURCES = [
  'https://raw.githubusercontent.com/Free-TV/IPTV/master/playlist.m3u8',
  'https://iptv-org.github.io/iptv/index.m3u',
  'https://raw.githubusercontent.com/iptv-org/iptv/master/streams/us.m3u',
  'https://raw.githubusercontent.com/iptv-org/iptv/master/streams/gb.m3u',
  'https://raw.githubusercontent.com/iptv-org/iptv/master/streams/ca.m3u'
]

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
  const timestamp = Date.now().toString(36)
  return `${country}-${clean}-${timestamp}`.substring(0, 60)
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

async function verifyStream(url: string, timeout = 5000): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)
    
    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'follow'
    })
    
    clearTimeout(timeoutId)
    
    // Accept 200, 206 (partial content), or 301/302/307/308 redirects
    return response.ok || 
           response.status === 206 || 
           (response.status >= 301 && response.status <= 308)
  } catch (error) {
    return false
  }
}

export async function GET(request: Request) {
  const startTime = Date.now()
  const log: string[] = []
  
  // Get query params
  const url = new URL(request.url)
  const verify = url.searchParams.get('verify') !== 'false' // Verify by default
  const limit = parseInt(url.searchParams.get('limit') || '1000') // Limit to 1000 by default
  
  try {
    log.push('🚀 Starting IPTV-org channel import...')
    log.push(`   Verification: ${verify ? 'ENABLED' : 'DISABLED'}`)
    log.push(`   Limit: ${limit} channels`)
    
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
    
    // Build stream lookup map - only ONLINE streams
    const streamMap = new Map<string, any[]>()
    let onlineStreams = 0
    
    for (const stream of streams) {
      if (stream.channel && 
          stream.url && 
          stream.status?.toLowerCase() === 'online' &&
          (stream.url.startsWith('http://') || stream.url.startsWith('https://'))) {
        
        if (!streamMap.has(stream.channel)) {
          streamMap.set(stream.channel, [])
        }
        streamMap.get(stream.channel)!.push(stream)
        onlineStreams++
      }
    }
    
    log.push(`✅ Filtered to ${onlineStreams} online streams`)
    
    // Process channels by country
    const channelsToInsert: any[] = []
    let totalProcessed = 0
    let verifiedCount = 0
    let failedVerification = 0
    
    for (const channel of channels) {
      if (totalProcessed >= limit) break
      if (!channel.country || !streamMap.has(channel.id)) continue
      
      const countryCode = channel.country.toLowerCase()
      if (!COUNTRY_CODES[countryCode as keyof typeof COUNTRY_CODES]) continue
      
      const channelStreams = streamMap.get(channel.id) || []
      if (channelStreams.length === 0) continue
      
      // Try to find a working stream
      let workingStream = null
      
      for (const stream of channelStreams) {
        if (verify) {
          const isWorking = await verifyStream(stream.url)
          if (isWorking) {
            workingStream = stream
            verifiedCount++
            break
          } else {
            failedVerification++
          }
        } else {
          // No verification - use first stream
          workingStream = stream
          break
        }
      }
      
      if (!workingStream) continue
      
      const channelData = {
        id: generateChannelId(channel.name, countryCode),
        name: channel.name,
        call_sign: channel.id,
        network: channel.network || null,
        logo_url: channel.logo || null,
        stream_url: workingStream.url,
        country_id: countryCode,
        region_id: null,
        city_id: null,
        is_national: true,
        is_local: false,
        category: categorizeChannel(channel.name, channel.categories),
        language: channel.languages?.[0] || 'en',
        hd: workingStream.url.includes('1080') || workingStream.url.includes('hd'),
        is_active: true,
        last_checked: new Date().toISOString()
      }
      
      channelsToInsert.push(channelData)
      totalProcessed++
      
      // Progress update every 50 channels
      if (totalProcessed % 50 === 0) {
        log.push(`   Processed ${totalProcessed} channels...`)
      }
    }
    
    log.push(`✅ Processed ${totalProcessed} channels`)
    if (verify) {
      log.push(`   Verified working: ${verifiedCount}`)
      log.push(`   Failed verification: ${failedVerification}`)
    }
    
    // Show distribution by country
    const distribution: Record<string, number> = {}
    for (const ch of channelsToInsert) {
      const country = COUNTRY_CODES[ch.country_id as keyof typeof COUNTRY_CODES]
      distribution[country] = (distribution[country] || 0) + 1
    }
    
    // Insert into database in batches
    log.push('💾 Inserting into database...')
    let insertedCount = 0
    let errorCount = 0
    
    for (let i = 0; i < channelsToInsert.length; i += 50) {
      const batch = channelsToInsert.slice(i, i + 50)
      
      const { error } = await supabase
        .from('channels')
        .upsert(batch, { onConflict: 'id' })
      
      if (error) {
        log.push(`❌ Error inserting batch: ${error.message}`)
        errorCount += batch.length
      } else {
        insertedCount += batch.length
      }
      
      // Small delay
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2)
    
    log.push('✅ IMPORT COMPLETE!')
    log.push(`📊 Summary:`)
    log.push(`   Total processed: ${totalProcessed}`)
    log.push(`   Successfully inserted: ${insertedCount}`)
    log.push(`   Errors: ${errorCount}`)
    log.push(`   Countries: ${Object.keys(distribution).length}`)
    log.push(`   Duration: ${duration}s`)
    
    return NextResponse.json({
      success: true,
      totalProcessed,
      insertedCount,
      errorCount,
      verifiedCount,
      failedVerification,
      countries: Object.keys(distribution).length,
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
