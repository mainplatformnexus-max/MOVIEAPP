# MovieBox - Streaming Platform

## Overview
MovieBox is a movie and TV show streaming platform built with React. It features a hero carousel, movie/series browsing, search, video playback via ArtPlayer, user authentication via Firebase, and an admin panel.

## Recent Changes
- 2026-02-07: Migrated from Lovable to Replit environment
  - Updated Vite config to bind to port 5000 with allowedHosts for Replit proxy
  - Removed unnecessary server/db.ts file
  - Set up workflow for development

## Architecture

### Frontend (Client-only SPA)
- **Framework**: React 18 + TypeScript
- **Bundler**: Vite 5 with SWC plugin
- **Routing**: react-router-dom v6
- **Styling**: Tailwind CSS + shadcn/ui components
- **State**: React Context (AuthContext, MovieContext) + TanStack React Query
- **Video Player**: ArtPlayer

### External Services
- **Firebase**: Authentication (email/password + Google), Realtime Database (users, subscriptions), Storage, Analytics
- **Supabase**: Video proxy edge function only (no database tables used)

### Key Files
- `src/App.tsx` - Main app with routing
- `src/contexts/AuthContext.tsx` - Firebase auth + user/subscription management
- `src/contexts/MovieContext.tsx` - Movie data context
- `src/lib/firebase.ts` - Firebase initialization
- `src/lib/videoProxy.ts` - Video proxy URL generation (uses Supabase edge function)
- `src/integrations/supabase/client.ts` - Supabase client (video proxy only)
- `src/data/movies.ts` - Movie data
- `src/pages/` - Page components (Index, Login, PlayPage, TVShows, MoviesPage, etc.)
- `src/pages/admin/` - Admin panel pages
- `src/components/` - Reusable components (HeroCarousel, MovieCard, MovieGrid, etc.)

### Project Structure
```
src/
├── assets/          # Images (hero banners, posters)
├── components/      # UI components
│   ├── ui/          # shadcn/ui base components
│   └── play/        # Video player components
├── contexts/        # React contexts (Auth, Movie)
├── data/            # Static data (movies, subscriptions)
├── hooks/           # Custom hooks
├── integrations/    # Supabase client
├── lib/             # Utilities (firebase, videoProxy)
├── pages/           # Page components
│   └── admin/       # Admin panel pages
└── test/            # Test files
```

## Environment Variables
- `VITE_SUPABASE_URL` - Supabase project URL (for video proxy edge function)
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Supabase anon key
- Firebase config is hardcoded in `src/lib/firebase.ts`

## Running
- Development: `npm run dev` (Vite dev server on port 5000)
- Build: `npm run build`

## User Preferences
- None recorded yet
