// Supabase Client Configuration
// Javari TV - CR AudioViz AI
// Created: Feb 16, 2026

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kteobfyferrukqeolofj.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0ZW9iZnlmZXJydWtxZW9sb2ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxOTcyNjYsImV4cCI6MjA3NzU1NzI2Nn0.uy-jlF_z6qVb8qogsNyGDLHqT4HhmdRhLrW7zPv3qhY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Service role client for admin operations (server-side only)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : supabase
