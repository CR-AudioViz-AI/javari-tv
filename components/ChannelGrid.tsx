'use client'

// Channel Grid Component
// Javari TV - CR AudioViz AI
// Created: Feb 16, 2026

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Channel } from '@/lib/types'
import ChannelCard from './ChannelCard'

interface ChannelGridProps {
  selection: {
    country?: string
    region?: string
    city?: string
    view?: string
  }
  onPlayChannel: (channel: Channel) => void
  userId: string
}

export default function ChannelGrid({ selection, onPlayChannel, userId }: ChannelGridProps) {
  const [localChannels, setLocalChannels] = useState<Channel[]>([])
  const [nationalChannels, setNationalChannels] = useState<Channel[]>([])
  const [favoriteChannels, setFavoriteChannels] = useState<Channel[]>([])
  const [recentChannels, setRecentChannels] = useState<Channel[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadChannels()
  }, [selection])

  async function loadChannels() {
    setLoading(true)

    if (selection.view === 'favorites') {
      await loadFavorites()
    } else if (selection.view === 'recent') {
      await loadRecent()
    } else {
      await loadBrowseChannels()
    }

    setLoading(false)
  }

  async function loadFavorites() {
    const { data: favorites } = await supabase
      .from('user_favorites')
      .select('channel_id')
      .eq('user_id', userId)

    if (!favorites || favorites.length === 0) {
      setFavoriteChannels([])
      return
    }

    const channelIds = favorites.map(f => f.channel_id)
    const { data } = await supabase
      .from('channels')
      .select('*')
      .in('id', channelIds)
      .eq('is_active', true)

    setFavoriteChannels(data || [])
  }

  async function loadRecent() {
    const { data: recent } = await supabase
      .from('recently_watched')
      .select('channel_id')
      .eq('user_id', userId)
      .order('watched_at', { ascending: false })
      .limit(20)

    if (!recent || recent.length === 0) {
      setRecentChannels([])
      return
    }

    const channelIds = recent.map(r => r.channel_id)
    const { data } = await supabase
      .from('channels')
      .select('*')
      .in('id', channelIds)
      .eq('is_active', true)

    setRecentChannels(data || [])
  }

  async function loadBrowseChannels() {
    if (selection.city) {
      // Load local channels for city
      const { data: local } = await supabase
        .from('channels')
        .select('*')
        .eq('city_id', selection.city)
        .eq('is_active', true)
        .order('name')

      setLocalChannels(local || [])

      // Also load national channels for this country
      const { data: national } = await supabase
        .from('channels')
        .select('*')
        .eq('country_id', selection.country!)
        .eq('is_national', true)
        .eq('is_active', true)
        .order('name')

      setNationalChannels(national || [])
    } else if (selection.country) {
      // Load national channels only
      const { data } = await supabase
        .from('channels')
        .select('*')
        .eq('country_id', selection.country)
        .eq('is_national', true)
        .eq('is_active', true)
        .order('name')

      setNationalChannels(data || [])
      setLocalChannels([])
    } else {
      // Default: Load US national channels
      const { data } = await supabase
        .from('channels')
        .select('*')
        .eq('country_id', 'us')
        .eq('is_national', true)
        .eq('is_active', true)
        .order('name')
        .limit(50)

      setNationalChannels(data || [])
      setLocalChannels([])
    }
  }

  function getTitle() {
    if (selection.view === 'favorites') return 'Your Favorite Channels'
    if (selection.view === 'recent') return 'Recently Watched'
    if (selection.city) return 'Local Channels'
    if (selection.country) return 'National Channels'
    return 'Featured Channels'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400">Loading channels...</div>
      </div>
    )
  }

  const displayChannels =
    selection.view === 'favorites'
      ? favoriteChannels
      : selection.view === 'recent'
      ? recentChannels
      : [...localChannels, ...nationalChannels]

  return (
    <div className="p-8">
      {/* Favorites View */}
      {selection.view === 'favorites' && (
        <div>
          <h2 className="text-3xl font-bold mb-6">⭐ Your Favorite Channels</h2>
          {favoriteChannels.length === 0 ? (
            <div className="text-gray-400 text-center py-12">
              <Star className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <p>No favorites yet!</p>
              <p className="text-sm mt-2">Click the star on any channel to save it here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {favoriteChannels.map(channel => (
                <ChannelCard
                  key={channel.id}
                  channel={channel}
                  onPlay={onPlayChannel}
                  userId={userId}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recent View */}
      {selection.view === 'recent' && (
        <div>
          <h2 className="text-3xl font-bold mb-6">⏱️ Recently Watched</h2>
          {recentChannels.length === 0 ? (
            <div className="text-gray-400 text-center py-12">
              <Clock className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <p>No recent channels!</p>
              <p className="text-sm mt-2">Start watching channels to see them here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentChannels.map(channel => (
                <ChannelCard
                  key={channel.id}
                  channel={channel}
                  onPlay={onPlayChannel}
                  userId={userId}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Browse View */}
      {selection.view === 'browse' && (
        <>
          {/* Local Channels Section */}
          {localChannels.length > 0 && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6">
                📍 Local Channels ({localChannels.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {localChannels.map(channel => (
                  <ChannelCard
                    key={channel.id}
                    channel={channel}
                    onPlay={onPlayChannel}
                    userId={userId}
                  />
                ))}
              </div>
            </div>
          )}

          {/* National Channels Section */}
          {nationalChannels.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold mb-6">
                📺 National Channels ({nationalChannels.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {nationalChannels.map(channel => (
                  <ChannelCard
                    key={channel.id}
                    channel={channel}
                    onPlay={onPlayChannel}
                    userId={userId}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {localChannels.length === 0 && nationalChannels.length === 0 && (
            <div className="text-gray-400 text-center py-12">
              <p>No channels found for this location.</p>
              <p className="text-sm mt-2">Try selecting a different region.</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function Star({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
      />
    </svg>
  )
}

function Clock({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}
