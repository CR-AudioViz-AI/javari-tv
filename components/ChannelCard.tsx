'use client'

// Channel Card Component
// Javari TV - CR AudioViz AI
// Created: Feb 16, 2026

import { useState, useEffect } from 'react'
import { Star, Play } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Channel } from '@/lib/types'

interface ChannelCardProps {
  channel: Channel
  onPlay: (channel: Channel) => void
  userId: string
}

export default function ChannelCard({ channel, onPlay, userId }: ChannelCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    checkFavorite()
  }, [channel.id, userId])

  async function checkFavorite() {
    const { data } = await supabase
      .from('user_favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('channel_id', channel.id)
      .single()
    
    setIsFavorite(!!data)
  }

  async function toggleFavorite(e: React.MouseEvent) {
    e.stopPropagation()
    
    if (isFavorite) {
      await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', userId)
        .eq('channel_id', channel.id)
      setIsFavorite(false)
    } else {
      await supabase
        .from('user_favorites')
        .insert({
          user_id: userId,
          channel_id: channel.id,
        })
      setIsFavorite(true)
    }
  }

  return (
    <div className="channel-card bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 cursor-pointer group">
      {/* Logo/Thumbnail */}
      <div className="aspect-video bg-gray-700 flex items-center justify-center relative overflow-hidden">
        {channel.logo_url ? (
          <img
            src={channel.logo_url}
            alt={channel.name}
            className="w-20 h-20 object-contain"
          />
        ) : (
          <div className="text-4xl font-bold text-gray-600">
            {channel.network?.[0] || channel.name[0]}
          </div>
        )}
        
        {/* Play overlay on hover */}
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Play className="w-12 h-12 text-white" />
        </div>

        {/* HD Badge */}
        {channel.hd && (
          <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
            HD
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white truncate">
              {channel.call_sign || channel.network || channel.name}
            </h3>
            <p className="text-sm text-gray-400 truncate">{channel.name}</p>
            {channel.category && (
              <span className="inline-block mt-1 text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">
                {channel.category}
              </span>
            )}
          </div>
          
          {/* Favorite Button */}
          <button
            onClick={toggleFavorite}
            className="flex-shrink-0 p-1 hover:bg-gray-700 rounded transition"
          >
            <Star
              className={`w-5 h-5 ${
                isFavorite ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400'
              }`}
            />
          </button>
        </div>

        {/* Watch Button */}
        <button
          onClick={() => onPlay(channel)}
          className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded py-2 flex items-center justify-center gap-2 transition"
        >
          <Play className="w-4 h-4" />
          WATCH NOW
        </button>
      </div>
    </div>
  )
}
