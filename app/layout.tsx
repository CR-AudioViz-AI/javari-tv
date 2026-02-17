// Root Layout
// Javari TV - CR AudioViz AI
// Created: Feb 16, 2026

import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Javari TV - 10,000+ Live TV Channels',
  description: 'Watch live TV from around the world. Netflix-style interface with channels from 130+ countries.',
  keywords: 'live tv, streaming, iptv, free tv, channels, javari tv',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
