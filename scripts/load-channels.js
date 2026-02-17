#!/usr/bin/env node
// IPTV-org Channel Loader for Javari TV
// Loads thousands of live TV channels from IPTV-org database
// Roy Henderson - CR AudioViz AI
// Feb 16, 2026 3:42 PM EST

const https = require('https');
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kteobfyferrukqeolofj.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0ZW9iZnlmZXJydWtxZW9sb2ZqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjE5NzI2NiwiZXhwIjoyMDc3NTU3MjY2fQ.5baSBOBpBzcm5LeV4tN2H0qQJGNJoH0Q06ROwhbijCI';

const supabase = createClient(supabaseUrl, supabaseKey);

// IPTV-org database URLs
const CHANNELS_URL = 'https://iptv-org.github.io/iptv/channels.json';
const STREAMS_URL = 'https://iptv-org.github.io/iptv/streams.json';

// Country code mapping (ISO 3166-1 alpha-2)
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
  'nl': 'Netherlands'
};

async function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function generateChannelId(name, country) {
  const clean = name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `${country}-${clean}-${Date.now()}`.substring(0, 50);
}

function categorizeChannel(name, categories) {
  const nameLower = name.toLowerCase();
  
  if (categories?.includes('news') || nameLower.includes('news')) return 'news';
  if (categories?.includes('sports') || nameLower.includes('sport')) return 'sports';
  if (categories?.includes('movies') || nameLower.includes('movie') || nameLower.includes('cinema')) return 'movies';
  if (categories?.includes('kids') || nameLower.includes('kids') || nameLower.includes('cartoon')) return 'kids';
  if (categories?.includes('music') || nameLower.includes('music')) return 'entertainment';
  
  return 'entertainment';
}

async function loadChannels() {
  console.log('🚀 JAVARI TV - IPTV-ORG CHANNEL LOADER');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  try {
    console.log('📡 Fetching channel data from IPTV-org...');
    const [channels, streams] = await Promise.all([
      fetchJSON(CHANNELS_URL),
      fetchJSON(STREAMS_URL)
    ]);
    
    console.log(`✅ Found ${channels.length} channels`);
    console.log(`✅ Found ${streams.length} streams\n`);
    
    // Create stream lookup map
    const streamMap = new Map();
    streams.forEach(stream => {
      if (stream.channel && stream.url && stream.status?.toLowerCase() === 'online') {
        if (!streamMap.has(stream.channel)) {
          streamMap.set(stream.channel, []);
        }
        streamMap.get(stream.channel).push(stream);
      }
    });
    
    console.log('🔄 Processing channels by country...\n');
    
    const channelsByCountry = new Map();
    let totalProcessed = 0;
    let totalWithStreams = 0;
    
    for (const channel of channels) {
      if (!channel.country || !streamMap.has(channel.id)) continue;
      
      const countryCode = channel.country.toLowerCase();
      if (!COUNTRY_CODES[countryCode]) continue;
      
      const channelStreams = streamMap.get(channel.id);
      if (!channelStreams || channelStreams.length === 0) continue;
      
      // Use first working stream
      const stream = channelStreams[0];
      
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
      };
      
      if (!channelsByCountry.has(countryCode)) {
        channelsByCountry.set(countryCode, []);
      }
      channelsByCountry.get(countryCode).push(channelData);
      
      totalProcessed++;
      totalWithStreams++;
    }
    
    console.log(`✅ Processed ${totalProcessed} channels with working streams`);
    console.log(`📊 Distribution by country:\n`);
    
    for (const [country, channels] of channelsByCountry.entries()) {
      console.log(`   ${COUNTRY_CODES[country]}: ${channels.length} channels`);
    }
    
    console.log('\n💾 Inserting channels into database...\n');
    
    let insertedCount = 0;
    let errorCount = 0;
    
    for (const [country, channels] of channelsByCountry.entries()) {
      console.log(`   Inserting ${channels.length} channels for ${COUNTRY_CODES[country]}...`);
      
      // Insert in batches of 100
      for (let i = 0; i < channels.length; i += 100) {
        const batch = channels.slice(i, i + 100);
        
        const { data, error } = await supabase
          .from('channels')
          .upsert(batch, { onConflict: 'id' });
        
        if (error) {
          console.error(`   ❌ Error inserting batch: ${error.message}`);
          errorCount += batch.length;
        } else {
          insertedCount += batch.length;
        }
        
        // Rate limit
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('✅ CHANNEL LOADING COMPLETE!\n');
    console.log(`📊 Summary:`);
    console.log(`   Total channels processed: ${totalProcessed}`);
    console.log(`   Successfully inserted: ${insertedCount}`);
    console.log(`   Errors: ${errorCount}`);
    console.log(`   Countries covered: ${channelsByCountry.size}`);
    console.log('\n🎉 Javari TV is now loaded with live channels!');
    console.log('═══════════════════════════════════════════════════════════════\n');
    
  } catch (error) {
    console.error('❌ Error loading channels:', error.message);
    process.exit(1);
  }
}

// Run the loader
loadChannels();
