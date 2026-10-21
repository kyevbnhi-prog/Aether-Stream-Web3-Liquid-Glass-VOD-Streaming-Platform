export type MediaType = 'movie' | 'series';

export interface Episode {
  id: string;
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  overview: string;
  duration: string;
  durationSeconds: number;
  thumbnailUrl: string;
  videoUrl: string;
  introStart?: number;
  introEnd?: number;
}

export interface Season {
  seasonNumber: number;
  title: string;
  episodes: Episode[];
}

export interface MediaItem {
  id: string;
  title: string;
  type: MediaType;
  tagline: string;
  synopsis: string;
  posterUrl: string;
  backdropUrl: string;
  videoUrl: string;
  trailerUrl?: string;
  releaseYear: number;
  rating: number; // e.g. 8.7
  duration: string; // e.g. "1h 52m" or "2 Seasons"
  durationSeconds: number;
  genres: string[];
  cast: string[];
  director: string;
  seasons?: Season[];
  featured?: boolean;
  trending?: boolean;
  isNew?: boolean;
  is4K?: boolean;
  vipExclusive?: boolean;
}

export interface LiveChannel {
  id: string;
  name: string;
  callsign: string;
  category: 'News' | 'Sports' | 'Cinema' | 'Entertainment' | 'Tech & Sci';
  logoUrl: string;
  streamUrl: string;
  currentProgram: {
    title: string;
    description: string;
    start: string;
    end: string;
    progressPercentage: number;
  };
  upcomingProgram: {
    title: string;
    start: string;
  };
  isLive: boolean;
  viewerCount: number;
  resolution: string;
}

export interface UserProfile {
  displayName: string;
  avatarUrl: string;
  joinedDate: string;
  favoriteGenres: string[];
  playbackQuality: 'Auto' | '1080p' | '4K HDR';
  autoPlayNext: boolean;
  subtitlesEnabled: boolean;
  volumeLevel: number;
}

export interface WatchHistoryEntry {
  mediaId: string;
  episodeId?: string;
  title: string;
  subtitle?: string; // e.g. "S1:E3 · Quantum Core"
  posterUrl: string;
  type: MediaType;
  progressSeconds: number;
  durationSeconds: number;
  lastWatched: string;
  completed: boolean;
}

export type Web3VipTier = 'None' | 'Cyber Pass' | 'Obsidian VIP';

export interface Web3WalletState {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  networkName: string;
  tier: Web3VipTier;
  balanceEth: string;
  vipPassTokenId: string | null;
  isDemo: boolean;
}
