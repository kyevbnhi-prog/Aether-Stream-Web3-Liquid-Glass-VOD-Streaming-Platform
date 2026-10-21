# Aether Stream — Web3 Liquid-Glass VOD & Streaming Platform

Aether Stream is an ultra-premium, cinematic Video-on-Demand (VOD) and Live TV streaming platform engineered with Apple-inspired liquid-glass surfaces, electric violet and cyan luminescence, deep charcoal and midnight gradients, and modular Web3 wallet VIP pass privileges.

***

### User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural and design decisions have been aligned based on your preferences:
> - **Brand & Aesthetic**: **Aether Stream** — dark cinematic ambiance with translucent liquid-glass surfaces, subtle specular highlights, electric violet (`#8b5cf6`) and neon cyan (`#06b6d4`) accents, and clean unboxed typographic metadata.
> - **Content & Streaming**: Curated high-definition open cinema films (such as *Tears of Steel*, *Sintel*, *Cosmos Laundromat*, *Big Buck Bunny*) with legitimate playable streams, full season/episode structures for series, and live HLS/test broadcast channels with honest stream status handling.
> - **Web3 Integration**: Optional browser-injected wallet integration (EIP-1193 standard, MetaMask, Coinbase Wallet, etc.) supporting network switching, shortened address display, account change listeners, and VIP Pass tiers (Standard, Cyber Pass, Obsidian VIP) that unlock exclusive 4K badges and member perks without gating core streaming.

- **Persistence Strategy**: Client-side `localStorage` stores user display name, avatar choice, watch history with exact timestamp progress, watchlist entries, theme preferences, and wallet connection state.
- **Navigation Architecture**: Full 9-page routing covering Enter Name, Home, Search, Live TV, Profile, Details, Player, Series, Movies, and 404 Fallback.

***

## 1. Overview & Core Concept

- **What It Does**: Provides an immersive, responsive streaming experience across movies, multi-season series, and live television channels. Features dynamic real-time catalog search, instant watchlist management, resume-from-last-timestamp playback, keyboard-controlled video player, and Web3 wallet connectivity for VIP perks.
- **Target Audience**: Cinephiles, sci-fi enthusiasts, tech-forward viewers, and Web3 community members seeking a high-fidelity media experience.
- **Key Value**: A production-grade streaming interface that combines cinematic visual luxury with zero-slop legibility, instant video playback, and modular Web3 connectivity that never gets in the way of regular viewing.

***

## 2. User Experience & Visual Design

### Key User Flows

1. **Onboarding / Welcome Flow**: First-time visitors arrive at the **Enter Your Name** liquid-glass portal. Upon entering their alias (or continuing as guest), profile preferences are saved to storage and they transition seamlessly to the Home feed. Returning users can revisit or modify their alias anytime from the Profile.
2. **Browsing & Discovery Flow**: The **Home**, **Movies**, and **Series** pages present full-bleed cinematic hero spotlights, horizontal swipe/scroll carousels, category filtering (Sci-Fi, Cyberpunk, Action, Thriller, Documentary), and live sorting.
3. **Deep Dive & Details Flow**: Clicking any title opens the **Details** page with high-res backdrop art, trailer modal playback, cast rosters, metadata (runtime, year, rating, genre), watchlist toggles, and episode drawers for episodic series.
4. **Playback Flow**: Launching playback triggers the **Video Player** view with complete custom HTML5 controls (scrubber bar, volume slider, playback rate selector, fullscreen toggle, skip intro button, next episode shortcut, and keyboard shortcuts `Space`, `K`, `F`, `M`, `←`, `→`). Viewing progress is automatically recorded.
5. **Live TV Experience**: The **Live TV** directory categorizes real-time channels by News, Sports, Cinema, and Tech, featuring an interactive video monitor and live schedule guides.
6. **Web3 Perks Flow**: Users can connect an injected Web3 wallet (or test in demo mode). The wallet calculates VIP tiers based on address balance/tokens, granting a luminous VIP streaming badge and token perks.

### Visual Identity & Theme
- **Dominant Neutral Canvas (60%)**: Deep obsidian and charcoal (`#090b11`, `#0d111d`, `#131826`) with ambient radial glows.
- **Structural Surfaces (30%)**: Liquid-glass panels crafted with `backdrop-blur-xl`, `bg-white/[0.04]` to `bg-slate-950/70`, subtle specular borders (`border-white/10`), and deep drop shadows.
- **Accent Budget (10%)**: Electric Violet (`#8b5cf6` / `#a855f7`) for primary call-to-actions and VIP highlights; Neon Cyan (`#06b6d4` / `#22d3ee`) for progress meters and active streaming indicators.
- **Typography & Layout**: Modern geometric sans (`Plus Jakarta Sans` / `DM Sans`), clean unboxed metadata with dot separators (`2025 · Sci-Fi · 1h 48m · 8.9 ★`), tabular figures for timestamps (`tabular-nums font-mono`), and zero pill badge clutter.

***

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Direct HTML5 Video Controller vs Heavy Third-Party Player**
  - *Chosen Approach*: A custom, fully-styled liquid-glass HTML5 video controller built directly on standard `<video>` APIs with support for MP4 and HLS streams.
  - *Why*: Eliminates brittle external player dependencies, prevents React 19 version clashes, guarantees 100% custom liquid-glass aesthetics, and provides exact control over keyboard shortcuts and resume progress.
- **Decision 2: Client-Authoritative Local Persistence vs Server Database**
  - *Chosen Approach*: Unified `localStorage` storage layer for user profiles, watchlist, watch history, and progress bookmarks.
  - *Why*: Immediate zero-latency startup without backend configuration barriers, perfectly fulfilling the prompt's requirement for persistent local data with zero mock stubs.
- **Decision 3: Non-Blocking Web3 Integration (EIP-1193 + Standalone Provider)**
  - *Chosen Approach*: Native browser wallet detection (`window.ethereum`) with simulated VIP tier fallback for users without Web3 wallets.
  - *Why*: Allows everyone to enjoy 100% of the streaming features without requiring a crypto wallet, while delivering real Web3 wallet detection and account listener support for users with MetaMask, Coinbase, or Brave.

***

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                          AETHER STREAM PLATFORM                        │
└────────────────────────────────────────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┴──────────────────────────────┐
    ▼                                                              ▼
┌────────────────────────┐                                     ┌────────────────────────┐
│   Navigation & Shell   │                                     │  State & Persistence   │
│  - Top Bar (3-Zone)    │                                     │  - User Profile & Name │
│  - Mobile Bottom Bar   │                                     │  - Watchlist & History │
│  - Global Search Modal │                                     │  - Video Progress Sync │
│  - Liquid Toast System │                                     │  - Web3 Wallet Provider│
└────────────────────────┘                                     └────────────────────────┘
    │
    ├──────────────────────────────────────────────────────────────────────────┐
    ▼                                                                          ▼
┌─────────────────────────────────────────────────────────┐        ┌────────────────────────────┐
│                       Pages (9)                         │        │       Media Services       │
│ 1. Enter Name  (Cinematic liquid-glass onboarding)      │        │ - Catalog Store (Movies &  │
│ 2. Home        (Hero spotlight, carousels, continue)    │        │   Series with episodes)    │
│ 3. Search      (Real-time filtering, genre pills, sort) │        │ - Live Channel Guide       │
│ 4. Live TV     (Channel grid, program guide, preview)   │        │ - Stream URL Resolvers     │
│ 5. Profile     (Avatar, stats, watchlist, wallet perks) │        │ - Custom Player Controller │
│ 6. Details     (Backdrop, synopsis, cast, seasons)      │        │   (Speed, Fullscreen,      │
│ 7. Player      (HTML5 liquid player, resume, shortcuts) │        │    Seek, Resume, Chapters) │
│ 8. Series      (Episodic discovery, season selector)    │        └────────────────────────────┘
│ 9. Movies      (Cinema catalog, grid, year/rating filter│
│ + 404 Page     (Polished recovery route)                │
└─────────────────────────────────────────────────────────┘
```

### Data Models
- **MediaItem**: `id`, `title`, `type` (`'movie'` | `'series'`), `synopsis`, `posterUrl`, `backdropUrl`, `videoUrl`, `trailerUrl`, `releaseYear`, `rating`, `duration`, `genres`, `cast`, `director`, `seasons` (for series).
- **Episode**: `id`, `seasonNumber`, `episodeNumber`, `title`, `overview`, `duration`, `thumbnailUrl`, `videoUrl`.
- **LiveChannel**: `id`, `name`, `category`, `logoUrl`, `streamUrl`, `currentProgram`, `upcomingProgram`, `isLive`.
- **UserProfile**: `displayName`, `avatarId`, `joinedDate`, `favoriteGenres`, `themeMode`.
- **WatchHistoryEntry**: `mediaId`, `title`, `posterUrl`, `type`, `progressSeconds`, `durationSeconds`, `lastWatched`, `completed`.
- **Web3State**: `isConnected`, `address`, `chainId`, `tier` (`'none'` | `'standard'` | `'cyber'` | `'obsidian'`), `isDemo`.

***

## 5. Verification & Implementation Sequence

1. **Step 1**: Install necessary utility packages (`react-router-dom` for reliable 9-page URL routing and browser history) while keeping dependency footprint lean.
2. **Step 2**: Generate high-fidelity visual assets using `generate_image` in parallel for cinematic backdrops and hero features.
3. **Step 3**: Establish core types, curated media catalog, channel guide, and storage service hooks.
4. **Step 4**: Build liquid-glass UI primitives, Top Bar navigation, responsive mobile drawer, and player controller.
5. **Step 5**: Implement all 9 pages with deep interactivity, responsive carousels, and persistent states.
6. **Step 6**: Execute type checks (`npm run build` / compilation) and verify seamless navigation and video playback.
