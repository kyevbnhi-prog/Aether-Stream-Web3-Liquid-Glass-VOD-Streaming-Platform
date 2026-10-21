import { UserProfile, WatchHistoryEntry } from '../types/media';

const STORAGE_KEYS = {
  USER_PROFILE: 'aether_user_profile',
  WATCHLIST: 'aether_watchlist',
  WATCH_HISTORY: 'aether_watch_history',
  PLAYBACK_PROGRESS: 'aether_playback_progress',
  WEB3_STATE: 'aether_web3_state',
};

export const DEFAULT_PROFILE: UserProfile = {
  displayName: '',
  avatarUrl: '/src/assets/images/avatar_cyber_vip_1792544114964.jpg',
  joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
  favoriteGenres: ['Sci-Fi', 'Cyberpunk', 'Action'],
  playbackQuality: '4K HDR',
  autoPlayNext: true,
  subtitlesEnabled: false,
  volumeLevel: 0.8,
};

export const storageService = {
  // Profile
  getProfile(): UserProfile {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (stored) {
        return { ...DEFAULT_PROFILE, ...JSON.parse(stored) };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_PROFILE;
  },

  saveProfile(profile: Partial<UserProfile>): UserProfile {
    const current = this.getProfile();
    const updated = { ...current, ...profile };
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(updated));
    } catch {
      // Storage full or restricted
    }
    return updated;
  },

  // Watchlist
  getWatchlist(): string[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.WATCHLIST);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
    return ['m1', 's1', 'm3']; // Default curated initial favorites
  },

  toggleWatchlist(mediaId: string): boolean {
    const list = this.getWatchlist();
    const exists = list.includes(mediaId);
    let updated: string[];
    if (exists) {
      updated = list.filter((id) => id !== mediaId);
    } else {
      updated = [mediaId, ...list];
    }
    try {
      localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(updated));
    } catch {
      // Fallback
    }
    return !exists;
  },

  isInWatchlist(mediaId: string): boolean {
    return this.getWatchlist().includes(mediaId);
  },

  // Watch History & Resume Progress
  getWatchHistory(): WatchHistoryEntry[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.WATCH_HISTORY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
    return [];
  },

  saveProgress(entry: Omit<WatchHistoryEntry, 'lastWatched'>): void {
    const history = this.getWatchHistory();
    const filtered = history.filter(
      (item) => !(item.mediaId === entry.mediaId && item.episodeId === entry.episodeId)
    );
    const updatedEntry: WatchHistoryEntry = {
      ...entry,
      lastWatched: new Date().toISOString(),
    };
    const updated = [updatedEntry, ...filtered].slice(0, 30);
    try {
      localStorage.setItem(STORAGE_KEYS.WATCH_HISTORY, JSON.stringify(updated));
    } catch {
      // Fallback
    }
  },

  getProgress(mediaId: string, episodeId?: string): number {
    const history = this.getWatchHistory();
    const found = history.find(
      (item) => item.mediaId === mediaId && (!episodeId || item.episodeId === episodeId)
    );
    return found ? found.progressSeconds : 0;
  },

  removeFromHistory(mediaId: string, episodeId?: string): WatchHistoryEntry[] {
    const history = this.getWatchHistory();
    const updated = history.filter(
      (item) => !(item.mediaId === mediaId && (!episodeId || item.episodeId === episodeId))
    );
    try {
      localStorage.setItem(STORAGE_KEYS.WATCH_HISTORY, JSON.stringify(updated));
    } catch {
      // Fallback
    }
    return updated;
  },

  clearAllData(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
      localStorage.removeItem(STORAGE_KEYS.WATCHLIST);
      localStorage.removeItem(STORAGE_KEYS.WATCH_HISTORY);
      localStorage.removeItem(STORAGE_KEYS.PLAYBACK_PROGRESS);
      localStorage.removeItem(STORAGE_KEYS.WEB3_STATE);
    } catch {
      // Fallback
    }
  },
};
