'use client'

// Main Page - Javari TV
// Netflix-style live TV platform
// CR AudioViz AI - Created: Feb 16, 2026

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import ChannelGrid from '@/components/ChannelGrid'
import VideoPlayer from '@/components/VideoPlayer'
import type { Channel } from '@/lib/types'

export default function Home() {
  const [selection, setSelection] = useState<{
    country?: string
    region?: string
    city?: string
    view?: string
  }>({
    view: 'browse',
    country: 'us', // Default to US
  })

  const [playingChannel, setPlayingChannel] = useState<Channel | null>(null)
  const [userId, setUserId] = useState<string>('')

  useEffect(() => {
    // Get or create user ID (localStorage for now, before auth)
    let storedUserId = localStorage.getItem('javari_user_id')
    if (!storedUserId) {
      storedUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('javari_user_id', storedUserId)
    }
    setUserId(storedUserId)
  }, [])

  function handleNavigate(newSelection: typeof selection) {
    setSelection({ ...selection, ...newSelection })
  }

  function handlePlayChannel(channel: Channel) {
    setPlayingChannel(channel)
  }

  function handleClosePlayer() {
    setPlayingChannel(null)
  }

  if (!userId) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="h-screen flex bg-black text-white overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar onNavigate={handleNavigate} currentSelection={selection} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <ChannelGrid
          selection={selection}
          onPlayChannel={handlePlayChannel}
          userId={userId}
        />
      </main>

      {/* Video Player (Full Screen Modal) */}
      {playingChannel && (
        <VideoPlayer
          channel={playingChannel}
          onClose={handleClosePlayer}
          userId={userId}
        />
      )}
    </div>
  )
}
