#!/usr/bin/env node
// COMPREHENSIVE IPTV-ORG API CHANNEL LOADER
// Javari TV - CR AudioViz AI
// Roy Henderson - Feb 16, 2026 4:55 PM EST
// Loads 10,000+ channels from iptv-org official API
// Organized by country, state/subdivision, and city

const https = require('https');
const http = require('http');

const SUPABASE_URL = 'https://kteobfyferrukqeolofj.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0ZW9iZnlmZXJydWtxZW9sb2ZqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjE5NzI2NiwiZXhwIjoyMDc3NTU3MjY2fQ.5baSBOBpBzcm5LeV4tN2H0qQJGNJoH0Q06ROwhbijCI';

// Official iptv-org API endpoints
const API_ENDPOINTS = {
  channels: 'https://iptv-org.github.io/api/channels.json',
  streams: 'https://iptv-org.github.io/api/streams.json',
  countries: 'https://iptv-org.github.io/api/countries.json',
  cities: 'https://iptv-org.github.io/api/cities.json'
};

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, (res) => {
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

function supabaseRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'kteobfyferrukqeolofj.supabase.co',
      port: 443,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'return=minimal'
      }
    };

    if (body) {
      const bodyStr = JSON.stringify(body);
      options.headers['Content-Length'] = Buffer.byteLength(bodyStr);
    }

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ success: true, data: data ? JSON.parse(data) : null });
        } else {
          console.error(`Supabase error ${res.statusCode}:`, data);
          resolve({ success: false, error: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

function generateChannelId(name, country) {
  const clean = name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const timestamp = Date.now().toString(36);
  return `${country}-${clean}-${timestamp}`.substring(0, 60);
}

async function loadChannels() {
  console.log('\n🚀 JAVARI TV - COMPREHENSIVE IPTV-ORG CHANNEL LOADER');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('Loading 10,000+ channels with full geographic organization');
  console.log('Roy Henderson - CR AudioViz AI - Feb 16, 2026 4:55 PM EST\n');

  try {
    // Fetch all data from iptv-org API
    console.log('📡 Fetching data from iptv-org API...');
    const [channels, streams, countries, cities] = await Promise.all([
      fetchJSON(API_ENDPOINTS.channels),
      fetchJSON(API_ENDPOINTS.streams),
      fetchJSON(API_ENDPOINTS.countries),
      fetchJSON(API_ENDPOINTS.cities)
    ]);

    console.log(`✅ Fetched ${channels.length} channels`);
    console.log(`✅ Fetched ${streams.length} streams`);
    console.log(`✅ Fetched ${countries.length} countries`);
    console.log(`✅ Fetched ${cities.length} cities\n`);

    // Build stream lookup map - only ONLINE streams
    const streamMap = new Map();
    let onlineCount = 0;

    for (const stream of streams) {
      if (stream.channel && stream.url && stream.status === 'online') {
        if (!streamMap.has(stream.channel)) {
          streamMap.set(stream.channel, []);
        }
        streamMap.get(stream.channel).push(stream);
        onlineCount++;
      }
    }

    console.log(`✅ Found ${onlineCount} online streams\n`);
    console.log('🔄 Processing channels...\n');

    const channelsToInsert = [];
    let processed = 0;

    for (const channel of channels) {
      // Skip closed channels
      if (channel.closed) continue;
      
      // Must have a working stream
      if (!streamMap.has(channel.id)) continue;
      
      const channelStreams = streamMap.get(channel.id);
      if (!channelStreams || channelStreams.length === 0) continue;

      // Use first online stream
      const stream = channelStreams[0];

      const channelData = {
        id: generateChannelId(channel.name, channel.country),
        name: channel.name,
        call_sign: channel.id,
        network: channel.network || null,
        logo_url: channel.logo || null,
        stream_url: stream.url,
        country_id: channel.country?.toLowerCase() || 'us',
        region_id: channel.subdivision || null,
        city_id: channel.city || null,
        is_national: !channel.city,
        is_local: !!channel.city,
        category: channel.categories?.[0] || 'entertainment',
        language: channel.languages?.[0] || 'en',
        hd: stream.quality?.includes('720') || stream.quality?.includes('1080') || false,
        is_active: true,
        last_checked: new Date().toISOString()
      };

      channelsToInsert.push(channelData);
      processed++;

      if (processed % 500 === 0) {
        console.log(`   Processed ${processed} channels...`);
      }
    }

    console.log(`\n✅ Processed ${processed} channels with working streams\n`);

    // Show distribution
    const distribution = {};
    for (const ch of channelsToInsert) {
      const country = ch.country_id.toUpperCase();
      distribution[country] = (distribution[country] || 0) + 1;
    }

    console.log('📊 Top 20 countries by channel count:');
    Object.entries(distribution)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .forEach(([country, count]) => {
        console.log(`   ${country}: ${count} channels`);
      });

    console.log('\n💾 Inserting into Supabase...\n');

    let inserted = 0;
    let errors = 0;

    // Insert in batches of 100
    for (let i = 0; i < channelsToInsert.length; i += 100) {
      const batch = channelsToInsert.slice(i, i + 100);

      const result = await supabaseRequest('POST', '/rest/v1/channels', batch);
      
      if (result.success) {
        inserted += batch.length;
        console.log(`   Batch ${Math.floor(i / 100) + 1}/${Math.ceil(channelsToInsert.length / 100)}: ${inserted}/${channelsToInsert.length} inserted`);
      } else {
        errors += batch.length;
        console.error(`   ❌ Batch failed`);
      }

      await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('✅ CHANNEL LOADING COMPLETE!\n');
    console.log('📊 Final Summary:');
    console.log(`   Total processed: ${processed}`);
    console.log(`   Successfully inserted: ${inserted}`);
    console.log(`   Errors: ${errors}`);
    console.log(`   Countries: ${Object.keys(distribution).length}`);
    console.log('\n🎉 Javari TV now has thousands of channels from around the world!');
    console.log('═══════════════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('\n❌ FATAL ERROR:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

loadChannels();

const COUNTRY_CODES = {
  'us': '🇺🇸 United States',
  'gb': '🇬🇧 United Kingdom',
  'ca': '🇨🇦 Canada',
  'au': '🇦🇺 Australia',
  'de': '🇩🇪 Germany',
  'fr': '🇫🇷 France',
  'es': '🇪🇸 Spain',
  'it': '🇮🇹 Italy',
  'mx': '🇲🇽 Mexico',
  'br': '🇧🇷 Brazil',
  'jp': '🇯🇵 Japan',
  'kr': '🇰🇷 South Korea',
  'in': '🇮🇳 India',
  'ar': '🇦🇷 Argentina',
  'nl': '🇳🇱 Netherlands',
  'se': '🇸🇪 Sweden',
  'no': '🇳🇴 Norway',
  'dk': '🇩🇰 Denmark',
  'fi': '🇫🇮 Finland',
  'pl': '🇵🇱 Poland'
};

function fetchJSON(url) {
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

function supabaseRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'kteobfyferrukqeolofj.supabase.co',
      port: 443,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'return=minimal'
      }
    };

    if (body) {
      const bodyStr = JSON.stringify(body);
      options.headers['Content-Length'] = Buffer.byteLength(bodyStr);
    }

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ success: true, data: data ? JSON.parse(data) : null });
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

function generateChannelId(name, country) {
  const clean = name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const timestamp = Date.now().toString(36);
  return `${country}-${clean}-${timestamp}`.substring(0, 60);
}

function categorizeChannel(name, categories) {
  const nameLower = name.toLowerCase();
  
  if (categories?.includes('news') || nameLower.includes('news')) return 'news';
  if (categories?.includes('sports') || nameLower.includes('sport')) return 'sports';
  if (categories?.includes('movies') || nameLower.includes('movie')) return 'movies';
  if (categories?.includes('kids') || nameLower.includes('kids')) return 'kids';
  
  return 'entertainment';
}

async function loadChannels() {
  console.log('\n🚀 JAVARI TV - AUTOMATED CHANNEL LOADER');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('Roy Henderson - CR AudioViz AI');
  console.log('Feb 16, 2026 4:03 PM EST\n');

  try {
    console.log('📡 Fetching IPTV-org database...');
    const [channels, streams] = await Promise.all([
      fetchJSON(CHANNELS_URL),
      fetchJSON(STREAMS_URL)
    ]);

    console.log(`✅ Fetched ${channels.length} channels and ${streams.length} streams\n`);

    // Build stream map
    const streamMap = new Map();
    let onlineCount = 0;

    for (const stream of streams) {
      if (stream.channel && 
          stream.url && 
          stream.status?.toLowerCase() === 'online' &&
          (stream.url.startsWith('http://') || stream.url.startsWith('https://'))) {
        
        if (!streamMap.has(stream.channel)) {
          streamMap.set(stream.channel, []);
        }
        streamMap.get(stream.channel).push(stream);
        onlineCount++;
      }
    }

    console.log(`✅ Found ${onlineCount} online streams\n`);
    console.log('🔄 Processing channels by country...\n');

    const channelsToInsert = [];
    const distribution = {};

    for (const channel of channels) {
      if (!channel.country || !streamMap.has(channel.id)) continue;

      const countryCode = channel.country.toLowerCase();
      if (!COUNTRY_CODES[countryCode]) continue;

      const channelStreams = streamMap.get(channel.id);
      if (!channelStreams || channelStreams.length === 0) continue;

      // Use first available stream
      const stream = channelStreams[0];

      const channelData = {
        id: generateChannelId(channel.name, countryCode),
        name: channel.name,
        call_sign: channel.id,
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

      channelsToInsert.push(channelData);
      distribution[countryCode] = (distribution[countryCode] || 0) + 1;

      // Progress update
      if (channelsToInsert.length % 500 === 0) {
        console.log(`   Processed ${channelsToInsert.length} channels...`);
      }
    }

    console.log(`\n✅ Processed ${channelsToInsert.length} total channels\n`);
    console.log('📊 Distribution by country:');
    for (const [code, count] of Object.entries(distribution).sort((a, b) => b[1] - a[1])) {
      console.log(`   ${COUNTRY_CODES[code]}: ${count} channels`);
    }

    console.log('\n💾 Inserting into Supabase...\n');

    let insertedCount = 0;
    let errorCount = 0;

    // Insert in batches of 100
    for (let i = 0; i < channelsToInsert.length; i += 100) {
      const batch = channelsToInsert.slice(i, i + 100);

      try {
        await supabaseRequest('POST', '/rest/v1/channels', batch);
        insertedCount += batch.length;
        console.log(`   Inserted batch ${Math.floor(i / 100) + 1}/${Math.ceil(channelsToInsert.length / 100)} (${insertedCount} total)`);
      } catch (error) {
        console.error(`   ❌ Error inserting batch: ${error.message}`);
        errorCount += batch.length;
      }

      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('✅ CHANNEL LOADING COMPLETE!\n');
    console.log('📊 Final Summary:');
    console.log(`   Total processed: ${channelsToInsert.length}`);
    console.log(`   Successfully inserted: ${insertedCount}`);
    console.log(`   Errors: ${errorCount}`);
    console.log(`   Countries: ${Object.keys(distribution).length}`);
    console.log('\n🎉 Javari TV now has thousands of live channels!');
    console.log('═══════════════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('\n❌ FATAL ERROR:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run it
loadChannels();
