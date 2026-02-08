# Luo Film - Streaming Platform

## Overview

Luo Film is a movie and TV show streaming platform built as a client-side Single Page Application (SPA). Users can browse movies, TV series, and live TV channels, watch content via an embedded video player (ArtPlayer), and manage subscriptions. The platform includes an admin panel for content management (movies, series, TV channels, hero carousel, users, subscriptions). Content data and user data are stored in Firebase Realtime Database. The app targets a Ugandan audience with subscription pricing in UGX and mobile money payment integration.

Official domain: luofilm.site

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Stack
- **Framework**: React 18 with TypeScript
- **Bundler**: Vite 5 with SWC plugin for fast compilation
- **Routing**: react-router-dom v6 with flat route structure
- **Styling**: Tailwind CSS with CSS custom properties (HSL color system) + shadcn/ui component library (Radix UI primitives)
- **State Management**: React Context API (AuthContext for auth/user/subscription state, MovieContext for all content data) combined with TanStack React Query
- **Video Player**: ArtPlayer library for movie/series/live TV playback with HLS support
- **Testing**: Vitest with jsdom environment and React Testing Library

### Key Architecture Decisions

**Client-only SPA (no server)**
- All code runs in the browser. There is no backend server or API layer in this repo.
- Data is fetched directly from Firebase Realtime Database using `onValue` listeners for real-time sync.
- The Vite dev server binds to port 5000 on 0.0.0.0 with `allowedHosts: true` for Replit compatibility.

**Firebase as primary backend**
- Authentication: Email/password and Google sign-in via Firebase Auth
- Database: Firebase Realtime Database stores users, subscriptions, movies, series, episodes, hero slides, and TV channels
- Storage: Firebase Storage for media assets
- Analytics: Firebase Analytics (loaded conditionally)

**Content types**
- Movies (type: "movie") — single video with streamlink/videoUrl
- Series (type: "series") — multiple episodes grouped by season
- TV Channels — live streams with HLS URLs
- Hero Slides — carousel banners on the homepage

**Subscription/access model**
- Two tiers: "normal" (basic access) and "agent" (premium/early access)
- Three durations: 1 day, 1 week, 1 month
- Payment via Ugandan mobile money (API at api.livrauganda.workers.dev)
- Subscription checks happen in AuthContext (hasNormalAccess, hasAgentAccess)
- Content gating: agent-exclusive movies require agent subscription; regular content requires normal subscription

**Admin panel**
- Routes under `/admin/*` with AdminLayout wrapper
- Pages: Dashboard, Movies, Series, TV Channels, Hero management, Users, Subscriptions
- Admin role checked via user.role === "admin" in AuthContext

**Video proxy**
- A Supabase edge function proxies video URLs that aren't CORS-friendly (especially Google Drive links)
- The Supabase client is used ONLY for this video proxy — no database tables in Supabase
- Direct playback for .mp4/.m3u8 files and known CORS-friendly domains

### Project Structure
```
LUO-FILM/
├── index.html              # Entry HTML with SEO meta tags
├── vite.config.ts          # Vite config (port 5000, SWC, path aliases)
├── tailwind.config.ts      # Tailwind with custom theme tokens
├── components.json         # shadcn/ui configuration
├── src/
│   ├── main.tsx            # React entry point
│   ├── App.tsx             # Root component with routing
│   ├── index.css           # Global styles + Tailwind + CSS variables
│   ├── contexts/
│   │   ├── AuthContext.tsx  # Firebase auth, user/subscription state, admin functions
│   │   └── MovieContext.tsx # Movies, series, episodes, TV channels, hero slides (Firebase RTDB)
│   ├── data/
│   │   ├── movies.ts       # TypeScript interfaces for Movie, HeroSlide (defaults empty)
│   │   └── subscriptions.ts # Subscription plan definitions with UGX pricing
│   ├── lib/
│   │   ├── firebase.ts     # Firebase app initialization and exports
│   │   ├── videoProxy.ts   # Video URL processing (Google Drive conversion, CORS proxy)
│   │   └── utils.ts        # cn() utility for Tailwind class merging
│   ├── pages/
│   │   ├── Index.tsx        # Homepage with hero carousel + movie sections
│   │   ├── Login.tsx        # Auth page
│   │   ├── PlayPage.tsx     # Video player page with ArtPlayer
│   │   ├── MoviesPage.tsx   # Browse all movies
│   │   ├── TVShows.tsx      # Browse all series
│   │   ├── TVChannels.tsx   # Live TV with channel switcher
│   │   ├── AgentPage.tsx    # Agent-exclusive content
│   │   ├── UpcomingPage.tsx # Calendar view of upcoming releases
│   │   ├── SearchResults.tsx # Search results page
│   │   └── admin/           # Admin panel pages
│   ├── components/
│   │   ├── ui/              # shadcn/ui base components (40+ Radix-based components)
│   │   ├── play/            # Video player sub-components
│   │   ├── HeroCarousel.tsx # Homepage banner carousel
│   │   ├── MovieCard.tsx    # Individual movie/series card
│   │   ├── MovieGrid.tsx    # Grid layout for content
│   │   ├── MovieSection.tsx # Horizontal scrolling section
│   │   ├── MovieBoxHeader.tsx # Top navigation bar with search
│   │   ├── MovieBoxSidebar.tsx # Desktop sidebar navigation
│   │   ├── MobileNavBar.tsx # Bottom navigation for mobile
│   │   ├── LoginModal.tsx   # Login/register modal
│   │   └── SubscriptionModal.tsx # Subscription plan selection + payment
│   └── hooks/
│       ├── use-mobile.tsx   # Mobile breakpoint detection (768px)
│       └── use-toast.ts     # Toast notification system
```

## External Dependencies

### Firebase (Primary Backend)
- **Auth**: Email/password + Google OAuth sign-in
- **Realtime Database**: Stores all application data (users, subscriptions, movies, series, episodes, hero slides, TV channels)
- **Storage**: Media file storage
- **Analytics**: Usage tracking
- **Project**: luo-movies (config in `src/lib/firebase.ts`)

### Supabase (Video Proxy Only)
- Used exclusively for an edge function that proxies video streams for CORS-incompatible sources
- No database tables are used in Supabase
- URL configured via `VITE_SUPABASE_URL` env var (defaults to `ruopqthulidyyeilpcli.supabase.co`)

### Payment API
- **Endpoint**: `https://api.livrauganda.workers.dev/api/validate-phone` (and related payment endpoints)
- Handles Ugandan mobile money (MTN/Airtel) payments for subscriptions
- Cloudflare Workers-based API

### NPM Dependencies (Key)
- `react`, `react-dom` — UI framework
- `react-router-dom` — Client-side routing
- `@tanstack/react-query` — Data fetching/caching
- `artplayer` — Video player with HLS, PiP, fullscreen support
- `firebase` — Firebase SDK (auth, database, storage, analytics)
- `@supabase/supabase-js` — Supabase client (video proxy only)
- `tailwindcss` — Utility-first CSS
- Radix UI primitives (via shadcn/ui) — Accessible component primitives
- `lucide-react` — Icon library
- `recharts` — Charts (admin dashboard)
- `vaul` — Drawer component
- `embla-carousel-react` — Carousel
- `date-fns` — Date formatting