// Database Connection Test API
// Javari TV - CR AudioViz AI
// Roy Henderson - Feb 16, 2026 3:08 PM EST

import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const results = {
    timestamp: new Date().toISOString(),
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET',
    supabaseKeyPresent: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    supabaseKeyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
    tests: {} as Record<string, any>
  }

  // Test 1: Countries table
  try {
    const { data: countries, error: countriesError } = await supabase
      .from('countries')
      .select('*')
      .limit(5)
    
    results.tests.countries = {
      success: !countriesError,
      count: countries?.length || 0,
      error: countriesError?.message || null,
      sample: countries?.[0] || null
    }
  } catch (error: any) {
    results.tests.countries = {
      success: false,
      error: error.message
    }
  }

  // Test 2: Regions table
  try {
    const { data: regions, error: regionsError } = await supabase
      .from('regions')
      .select('*')
      .limit(5)
    
    results.tests.regions = {
      success: !regionsError,
      count: regions?.length || 0,
      error: regionsError?.message || null,
      sample: regions?.[0] || null
    }
  } catch (error: any) {
    results.tests.regions = {
      success: false,
      error: error.message
    }
  }

  // Test 3: Channels table
  try {
    const { data: channels, error: channelsError } = await supabase
      .from('channels')
      .select('*')
      .limit(5)
    
    results.tests.channels = {
      success: !channelsError,
      count: channels?.length || 0,
      error: channelsError?.message || null,
      sample: channels?.[0] || null
    }
  } catch (error: any) {
    results.tests.channels = {
      success: false,
      error: error.message
    }
  }

  return NextResponse.json(results, { status: 200 })
}
