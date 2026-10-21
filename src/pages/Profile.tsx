import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Settings,
  Shield,
  Clock,
  Bookmark,
  Trash2,
  Edit2,
  Check,
  RotateCcw,
  Wallet,
  Play,
  Film,
  AlertTriangle,
} from 'lucide-react';
import { UserProfile, WatchHistoryEntry, Web3WalletState } from '../types/media';
import { ALL_MEDIA, GENRES, AVATAR_ASSET } from '../data/catalog';
import { shortenAddress } from '../services/web3';
import { storageService } from '../services/storage';

interface ProfileProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  watchlist: string[];
  onToggleWatchlist: (id: string) => void;
  watchHistory: WatchHistoryEntry[];
  onRemoveHistory: (mediaId: string, episodeId?: string) => void;
  walletState: Web3WalletState;
  onOpenWallet: () => void;
  onClearAllData: () => void;
  onShowToast: (msg: string) => void;
}

export const Profile: React.FC<ProfileProps> = ({
  userProfile,
  onUpdateProfile,
  watchlist,
  onToggleWatchlist,
  watchHistory,
  onRemoveHistory,
  walletState,
  onOpenWallet,
  onClearAllData,
  onShowToast,
}) => {
  const navigate = useNavigate();
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(userProfile.displayName || '');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Watchlist items resolved
  const watchlistItems = watchlist
    .map((id) => ALL_MEDIA.find((m) => m.id === id))
    .filter((m): m is (typeof ALL_MEDIA)[0] => Boolean(m));

  const handleSaveName = () => {
    const trimmed = nameInput.trim();
    if (trimmed) {
      onUpdateProfile({ displayName: trimmed });
      setIsEditingName(false);
      onShowToast(`Display name updated to "${trimmed}"`);
    }
  };

  const toggleGenre = (genre: string) => {
    const current = userProfile.favoriteGenres;
    let next: string[];
    if (current.includes(genre)) {
      next = current.filter((g) => g !== genre);
    } else {
      next = [...current, genre];
    }
    onUpdateProfile({ favoriteGenres: next });
    onShowToast(`Updated favorite genres`);
  };

  const handleConfirmClearAll = () => {
    onClearAllData();
    setShowClearConfirm(false);
    onShowToast('All local profile, history, and preferences reset.');
    navigate('/enter-name');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 min-h-screen space-y-10">
      {/* Profile Header Glass Panel */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Glow orb */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          {/* Avatar Box */}
          <div className="relative group">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-cyan-400/50 shadow-xl shadow-cyan-500/20 bg-slate-900">
              <img
                src={userProfile.avatarUrl || AVATAR_ASSET}
                alt={userProfile.displayName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* User Info & Edit */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-cyan-400 text-white text-lg font-bold focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveName}
                    className="p-2 rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                    title="Save name"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {userProfile.displayName || 'Cyber Voyager'}
                  </h1>
                  <button
                    onClick={() => {
                      setNameInput(userProfile.displayName || '');
                      setIsEditingName(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-cyan-300 transition-colors"
                    title="Edit display name"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-400">
              <span>Member since {userProfile.joinedDate}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-cyan-400">Local-First Vault</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-300">{watchlist.length} items in My List</span>
            </div>

            {/* Web3 Pass Badge in Header */}
            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
              {walletState.isConnected ? (
                <button
                  onClick={onOpenWallet}
                  className="flex items-center gap-2 px-3 py-1 rounded-xl bg-violet-950/60 border border-violet-500/40 text-violet-200 text-xs font-semibold hover:border-violet-400 transition-colors"
                >
                  <Shield className="w-3.5 h-3.5 text-cyan-400" />
                  <span>VIP Pass Tier: {walletState.tier}</span>
                  <span className="font-mono text-slate-400">({shortenAddress(walletState.address)})</span>
                </button>
              ) : (
                <button
                  onClick={onOpenWallet}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-xl liquid-glass-subtle border border-white/10 text-slate-300 text-xs hover:text-white hover:border-cyan-400/40 transition-colors"
                >
                  <Wallet className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Link Web3 Wallet for VIP Badges</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Settings & Preferences) */}
        <div className="space-y-6 lg:col-span-1">
          {/* Playback Settings Card */}
          <div className="liquid-glass rounded-2xl p-5 border border-white/10 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Settings className="w-4 h-4 text-cyan-400" />
              <span>Playback Preferences</span>
            </h2>

            {/* Quality Setting */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 block">Default Stream Quality</label>
              <select
                value={userProfile.playbackQuality}
                onChange={(e) =>
                  onUpdateProfile({ playbackQuality: e.target.value as UserProfile['playbackQuality'] })
                }
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="4K HDR">4K Ultra HD (HDR Master)</option>
                <option value="1080p">1080p 60fps (Recommended)</option>
                <option value="Auto">Auto (Dynamic Bandwidth)</option>
              </select>
            </div>

            {/* Autoplay Toggle */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-xs text-white block font-medium">Autoplay Next Episode</span>
                <span className="text-[11px] text-slate-400">Continuous playback for series</span>
              </div>
              <button
                onClick={() => onUpdateProfile({ autoPlayNext: !userProfile.autoPlayNext })}
                className={`w-10 h-6 rounded-full transition-colors relative p-0.5 ${
                  userProfile.autoPlayNext ? 'bg-cyan-500' : 'bg-slate-800'
                }`}
                aria-label="Toggle autoplay next episode"
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    userProfile.autoPlayNext ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Subtitles Toggle */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-xs text-white block font-medium">Closed Captions</span>
                <span className="text-[11px] text-slate-400">Display subtitles by default</span>
              </div>
              <button
                onClick={() => onUpdateProfile({ subtitlesEnabled: !userProfile.subtitlesEnabled })}
                className={`w-10 h-6 rounded-full transition-colors relative p-0.5 ${
                  userProfile.subtitlesEnabled ? 'bg-cyan-500' : 'bg-slate-800'
                }`}
                aria-label="Toggle subtitles"
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    userProfile.subtitlesEnabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Favorite Genres Card */}
          <div className="liquid-glass rounded-2xl p-5 border border-white/10 space-y-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Favorite Genres
            </h2>
            <p className="text-xs text-slate-400">
              Personalizes recommendation algorithms across the Home feed.
            </p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {GENRES.filter((g) => g !== 'All').map((genre) => {
                const isFav = userProfile.favoriteGenres.includes(genre);
                return (
                  <button
                    key={genre}
                    onClick={() => toggleGenre(genre)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      isFav
                        ? 'bg-gradient-to-r from-violet-600 to-indigo-600 border-violet-400/50 text-white font-semibold'
                        : 'liquid-glass-subtle border-white/5 text-slate-400 hover:text-white hover:border-white/20'
                    }`}
                  >
                    {genre}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Danger Zone: Clear Local Data */}
          <div className="liquid-glass rounded-2xl p-5 border border-rose-500/20 space-y-3">
            <h2 className="text-sm font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Storage Reset</span>
            </h2>
            <p className="text-xs text-slate-400">
              Clear all saved watch progress, watchlist entries, and display name from this browser.
            </p>
            <button
              onClick={() => setShowClearConfirm(true)}
              className="w-full py-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Local Data</span>
            </button>
          </div>
        </div>

        {/* Right Column (Watch History & Watchlist) */}
        <div className="space-y-8 lg:col-span-2">
          {/* Watch History Section */}
          <div className="liquid-glass rounded-2xl p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-violet-400" />
                <span>Watch History & Resumes ({watchHistory.length})</span>
              </h2>
            </div>

            {watchHistory.length > 0 ? (
              <div className="space-y-3 max-h-[360px] overflow-y-auto no-scrollbar pr-1">
                {watchHistory.map((entry) => {
                  const percent =
                    entry.durationSeconds > 0
                      ? Math.min(100, Math.round((entry.progressSeconds / entry.durationSeconds) * 100))
                      : 0;
                  return (
                    <div
                      key={`${entry.mediaId}-${entry.episodeId || 'main'}`}
                      className="p-3 rounded-xl liquid-glass-subtle border border-white/5 flex items-center justify-between gap-3 hover:border-white/15 transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-16 h-10 rounded-lg overflow-hidden bg-slate-900 shrink-0">
                          <img
                            src={entry.posterUrl}
                            alt={entry.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-white truncate">{entry.title}</h4>
                          {entry.subtitle && (
                            <p className="text-[11px] text-cyan-300 font-mono truncate">
                              {entry.subtitle}
                            </p>
                          )}
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                            <span>{percent}% watched</span>
                            <span>·</span>
                            <span>{new Date(entry.lastWatched).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          to={`/player/${entry.mediaId}${entry.episodeId ? `?episode=${entry.episodeId}` : ''}`}
                          className="p-2 rounded-lg bg-violet-600/30 hover:bg-violet-600/50 text-cyan-300 transition-colors"
                          title="Resume playback"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                        </Link>
                        <button
                          onClick={() => onRemoveHistory(entry.mediaId, entry.episodeId)}
                          className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                          title="Remove from history"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">
                No watch history yet. Start streaming any film to track resume progress.
              </p>
            )}
          </div>

          {/* Watchlist Section */}
          <div className="liquid-glass rounded-2xl p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-cyan-400" />
                <span>My Saved List ({watchlistItems.length})</span>
              </h2>
            </div>

            {watchlistItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {watchlistItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl liquid-glass-subtle border border-white/5 flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-16 rounded-lg overflow-hidden bg-slate-900 shrink-0">
                        <img
                          src={item.posterUrl}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {item.releaseYear} · {item.genres[0]}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <Link
                        to={`/details/${item.id}`}
                        className="p-2 rounded-lg liquid-glass text-white hover:text-cyan-300 transition-colors"
                        title="View details"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </Link>
                      <button
                        onClick={() => onToggleWatchlist(item.id)}
                        className="p-2 text-slate-400 hover:text-rose-400 transition-colors"
                        title="Remove from My List"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">
                Your watchlist is empty. Click the + button on any title to save it for later.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Clearing Data */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-sm liquid-glass rounded-2xl border border-rose-500/30 p-6 space-y-4 shadow-2xl">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Reset all local streaming data?</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              This will erase your screen alias, saved watchlist, watch history, and playback preferences. You will be redirected to the name onboarding screen.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2.5 rounded-xl liquid-glass text-xs font-semibold text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmClearAll}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white shadow-lg shadow-rose-600/30"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
