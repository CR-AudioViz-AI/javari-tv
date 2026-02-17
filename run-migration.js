// Direct Supabase Migration Runner
// Executes SQL migration via Supabase Management API
// Roy Henderson - CR AudioViz AI - Feb 16, 2026 2:52 PM EST

const https = require('https');
const fs = require('fs');

const SUPABASE_PROJECT_REF = 'kteobfyferrukqeolofj';
const SUPABASE_ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN || '';

if (!SUPABASE_ACCESS_TOKEN) {
  console.error('❌ ERROR: SUPABASE_ACCESS_TOKEN environment variable not set');
  console.log('\nTo get your access token:');
  console.log('1. Go to https://supabase.com/dashboard/account/tokens');
  console.log('2. Create a new token');
  console.log('3. Set it: export SUPABASE_ACCESS_TOKEN="your_token_here"');
  console.log('4. Run this script again');
  process.exit(1);
}

// Read the migration SQL
const migrationSQL = fs.readFileSync('./supabase_complete_migration.sql', 'utf8');

console.log('🚀 Running Javari TV Database Migration...\n');
console.log('Project:', SUPABASE_PROJECT_REF);
console.log('SQL Length:', migrationSQL.length, 'bytes\n');

const options = {
  hostname: SUPABASE_PROJECT_REF + '.supabase.co',
  port: 443,
  path: '/rest/v1/rpc/exec_sql',
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${SUPABASE_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0ZW9iZnlmZXJydWtxZW9sb2ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxOTcyNjYsImV4cCI6MjA3NzU1NzI2Nn0.uy-jlF_z6qVb8qogsNyGDLHqT4HhmdRhLrW7zPv3qhY'
  }
};

const payload = JSON.stringify({
  query: migrationSQL
});

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    console.log('Response:', data);
    
    if (res.statusCode === 200 || res.statusCode === 201) {
      console.log('\n✅ Migration completed successfully!');
    } else {
      console.log('\n❌ Migration failed');
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error:', error.message);
});

req.write(payload);
req.end();
