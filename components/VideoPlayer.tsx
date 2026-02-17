'use client'

// Video Player Component
// Javari TV - CR AudioViz AI
// Created: Feb 16, 2026

import { useEffect, useRef } from 'react'
import ReactPlayer from 'react-player'
import { X, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Channel } from '@/lib/types'
import { useState } from 'react'

interface VideoPlayerProps {
  channel: Channel
  onClose: () => void
  userId: string
}

export default function VideoPlayer({ channel, onClose, userId }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Track in recently watched
    trackRecentlyWatched()

    // Handle escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen()
        } else {
          onClose()
        }
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [channel.id])

  async function trackRecentlyWatched() {
    // Upsert to recently_watched
    await supabase.from('recently_watched').upsert(
      {
        user_id: userId,
        channel_id: channel.id,
        watched_at: new Date().toISOString(),
      },
      {
        onConflict: 'user_id,channel_id',
      }
    )
  }

  function toggleFullscreen() {
    if (!containerRef.current) return

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  function handleError() {
    setError('Unable to load stream. The channel may be offline or unavailable.')
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black z-50 flex flex-col"
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-gray-900 bg-opacity-95">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white">
            {channel.call_sign || channel.network || channel.name}
          </h2>
          <p className="text-sm text-gray-400">{channel.name}</p>
          {channel.category && (
            <span className="inline-block mt-1 text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">
              {channel.category}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Mute Toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 hover:bg-gray-800 rounded transition"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-white" />
            ) : (
              <Volume2 className="w-5 h-5 text-white" />
            )}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 hover:bg-gray-800 rounded transition"
          >
            {isFullscreen ? (
              <Minimize className="w-5 h-5 text-white" />
            ) : (
              <Maximize className="w-5 h-5 text-white" />
            )}
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded transition"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Video Player */}
      <div className="flex-1 bg-black relative">
        {error ? (
          <div className="flex items-center justify-center h-full text-center px-4">
            <div>
              <p className="text-red-500 text-lg font-medium mb-2">
                {error}
              </p>
              <p className="text-gray-400 text-sm">
                This stream may be temporarily unavailable or have been removed.
              </p>
              <button
                onClick={onClose}
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition"
              >
                Back to Channels
              </button>
            </div>
          </div>
        ) : (
          <div className="video-player-container">
            <ReactPlayer
              url={channel.stream_url}
              playing={isPlaying}
              muted={isMuted}
              controls={true}
              width="100%"
              height="100%"
              onError={handleError}
              config={{
                file: {
                  attributes: {
                    controlsList: 'nodownload',
                  },
                },
              }}
            />
          </div>
        )}
      </div>

      {/* Info Footer (optional) */}
      <div className="bg-gray-900 bg-opacity-95 p-3 text-center">
        <p className="text-xs text-gray-500">
          Press <kbd className="px-2 py-1 bg-gray-800 rounded">ESC</kbd> to close
          {' • '}
          <span className="text-gray-600">
            Javari TV • CR AudioViz AI • {new Date().getFullYear()}
          </span>
        </p>
      </div>
    </div>
  )
}
