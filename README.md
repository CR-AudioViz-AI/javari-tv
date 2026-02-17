# Javari TV

Netflix-style live TV streaming platform with 10,000+ channels from around the world.

## Features

- 🎬 Netflix-style interface with collapsible country/state/city navigation
- 📺 10,000+ live TV channels from 130+ countries (powered by IPTV-org)
- ⭐ Favorites system - star channels to save them
- ⏱️ Recently watched tracking
- 📱 Responsive design (desktop, tablet, mobile)
- 🎥 Full-screen video player with HLS support

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Video Player:** React Player
- **Deployment:** Vercel
- **Data Source:** IPTV-org (open source channel database)

## Quick Start

1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env.local` with Supabase credentials
4. Run database migrations (see `/docs/DATABASE_SETUP.md`)
5. Start dev server: `npm run dev`

## Database Setup

The app requires these Supabase tables:
- `countries` - Country list with flags
- `regions` - States/provinces/territories
- `cities` - City listings
- `channels` - TV channel database
- `user_favorites` - User favorite channels
- `recently_watched` - Recently watched tracking

Run the SQL schema from `/docs/schema.sql` in your Supabase SQL editor.

## Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/CR-AudioViz-AI/javari-tv)

## Legal

Javari TV provides links to publicly available streams but does not host, own, or control any video content. All streams are believed to be authorized for public distribution by copyright holders.

## Built By

**CR AudioViz AI, LLC**  
Roy Henderson, CEO & Co-Founder  
Cindy Henderson, CMO & Co-Founder

**Mission:** "Your Story. Our Design"

---

© 2026 CR AudioViz AI, LLC. All rights reserved.
