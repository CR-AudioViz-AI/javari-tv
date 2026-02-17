const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://kteobfyferrukqeolofj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0ZW9iZnlmZXJydWtxZW9sb2ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxOTcyNjYsImV4cCI6MjA3NzU1NzI2Nn0.uy-jlF_z6qVb8qogsNyGDLHqT4HhmdRhLrW7zPv3qhY'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  console.log('Testing Supabase connection...\n')
  
  // Test countries table
  console.log('1. Testing countries table:')
  const { data: countries, error: countriesError } = await supabase
    .from('countries')
    .select('*')
    .limit(5)
  
  if (countriesError) {
    console.log('❌ Countries Error:', countriesError)
  } else {
    console.log('✅ Countries found:', countries?.length || 0)
    console.log('Data:', JSON.stringify(countries, null, 2))
  }
  
  // Test regions table
  console.log('\n2. Testing regions table:')
  const { data: regions, error: regionsError } = await supabase
    .from('regions')
    .select('*')
    .limit(5)
  
  if (regionsError) {
    console.log('❌ Regions Error:', regionsError)
  } else {
    console.log('✅ Regions found:', regions?.length || 0)
    console.log('Data:', JSON.stringify(regions, null, 2))
  }
  
  // Test channels table
  console.log('\n3. Testing channels table:')
  const { data: channels, error: channelsError } = await supabase
    .from('channels')
    .select('*')
    .limit(5)
  
  if (channelsError) {
    console.log('❌ Channels Error:', channelsError)
  } else {
    console.log('✅ Channels found:', channels?.length || 0)
    console.log('Data:', JSON.stringify(channels, null, 2))
  }
}

testConnection()
