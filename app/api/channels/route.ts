// Channels API Route
// Javari TV - CR AudioViz AI
// Created: Feb 16, 2026

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { initializeJavariTV } from '@/lib/iptv-loader'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')

  if (action === 'init') {
    // Initialize database with IPTV data
    try {
      await initializeJavariTV()
      return NextResponse.json({ success: true, message: 'Database initialized' })
    } catch (error: any) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }
  }

  if (action === 'stats') {
    // Get channel statistics
    const { data: countries } = await supabaseAdmin
      .from('countries')
      .select('id', { count: 'exact' })

    const { data: channels } = await supabaseAdmin
      .from('channels')
      .select('id', { count: 'exact' })

    return NextResponse.json({
      countries: countries?.length || 0,
      channels: channels?.length || 0,
    })
  }

  return NextResponse.json({ message: 'Javari TV API' })
}

export async function POST(request: Request) {
  const body = await request.json()

  if (body.action === 'initialize') {
    try {
      await initializeJavariTV()
      return NextResponse.json({ success: true })
    } catch (error: any) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
