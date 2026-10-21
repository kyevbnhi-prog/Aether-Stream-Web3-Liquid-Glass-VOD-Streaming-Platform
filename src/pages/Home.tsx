import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Play, Info, Plus, Check, Star, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { MOVIES, SERIES, ALL_MEDIA, HERO_ASSET } from '../data/catalog';
import { MediaCarousel } from '../components/media/MediaCarousel';
import { MediaItem, UserProfile, WatchHistoryEntry } from '../types/media';

interface HomeProps {
  userProfile: UserProfile;
  watchlist: string[];
  onToggleWatchlist: (id: string) => void;
  watchHistory: WatchHistoryEntry[];
  getProgress: (mediaId: string) => number;
}

export const Home: React.FC<HomeProps> = ({
  userProfile,
  watchlist,
  onToggleWatchlist,
  watchHistory,
  getProgress,
}) => {
  const navigate = useNavigate();
  // Hero item
  const heroItem = ALL_MEDIA[0]; // Tears of Steel
  const isHeroInWatchlist = watchlist.includes(heroItem.id);

  // Curated lists
  const trendingItems = ALL_MEDIA.filter((m) => m.trending);
  const newReleases = ALL_MEDIA.filter((m) => m.isNew);
  const popularMovies = MOVIES.slice().sort((a, b) => b.rating - a.rating);
  const topSeries = SERIES.slice().sort((a, b) => b.rating - a.rating);

  // Recommended based on user genres
  const recommendedItems = ALL_MEDIA.filter((m) =>
    m.genres.some((g) => userProfile.favoriteGenres.includes(g))
  );

  // Continue watching items mapped to media
  const continueWatchingItems = watchHistory
    .map((h) => ALL_MEDIA.find((m) => m.id === h.mediaId))
    .filter((m): m is MediaItem => Boolean(m));

  return (
    <div className="relative w-full pb-16">
      {/* Hero Banner Section */}
      <section className="relative w-full h-[75vh] min-h-[520px] max-h-[780px] overflow-hidden flex items-end">
        {/* Full-bleed Backdrop Image with Parallax & Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroItem.backdropUrl}
            alt={heroItem.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center scale-100 animate-in fade-in duration-700"
          />
          {/* Multiple Gradient Overlays for High Contrast & Liquid Glass Transition */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080a10] via-[#080a10]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080a10] via-[#080a10]/60 to-transparent max-w-4xl" />
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#080a10]/80 to-transparent" />
        </div>

        {/* Ambient Hero Spotlight Glow */}
        <div className="absolute bottom-1/3 left-10 w-96 h-96 bg-violet-600/20 rounded-full blur-[140px] pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pb-12 w-full">
          <div className="max-w-2xl space-y-4">
            {/* Kicker & Badges */}
            <div className="flex items-center gap-2.5 text-xs font-semibold">
              <span className="px-2.5 py-1 rounded-md bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                <span>Featured Premiere</span>
              </span>
              <span className="text-cyan-400 font-mono tracking-wider">
                {heroItem.is4K ? '4K ULTRA HD' : 'HD'}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] text-balance">
              {heroItem.title}
            </h1>

            {/* Unboxed Metadata Line */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 font-medium">
              <span className="flex items-center gap-1 text-amber-400 font-bold font-mono">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                {heroItem.rating.toFixed(1)}
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{heroItem.releaseYear}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{heroItem.duration}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-cyan-300">{heroItem.genres.join(' / ')}</span>
            </div>

            {/* Synopsis */}
            <p className="text-sm md:text-base text-slate-300 line-clamp-3 leading-relaxed text-pretty">
              {heroItem.synopsis}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => navigate(`/player/${heroItem.id}`)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-semibold text-sm shadow-xl shadow-violet-600/30 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Watch Now</span>
              </button>

              <button
                onClick={() => navigate(`/details/${heroItem.id}`)}
                className="px-5 py-3 rounded-xl liquid-glass text-white hover:text-cyan-300 hover:border-cyan-400/50 font-medium text-sm flex items-center gap-2 transition-all"
              >
                <Info className="w-4 h-4" />
                <span>View Details</span>
              </button>

              <button
                onClick={() => onToggleWatchlist(heroItem.id)}
                className={`p-3 rounded-xl transition-all ${
                  isHeroInWatchlist
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/40'
                    : 'liquid-glass text-white hover:border-white/30'
                }`}
                title={isHeroInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                aria-label={isHeroInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
              >
                {isHeroInWatchlist ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Plus className="w-4 h-4 stroke-[2.5]" />}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Carousels */}
      <div className="space-y-4 -mt-8 relative z-20">
        {/* Continue Watching (Only when user has history) */}
        {continueWatchingItems.length > 0 && (
          <MediaCarousel
            title="Continue Watching"
            subtitle={`Pick up where you left off, ${userProfile.displayName || 'Voyager'}`}
            items={continueWatchingItems}
            watchlist={watchlist}
            onToggleWatchlist={onToggleWatchlist}
            getProgress={getProgress}
          />
        )}

        {/* Trending Now */}
        <MediaCarousel
          title="Trending Now"
          subtitle="Most watched titles across the Aether network this week"
          items={trendingItems}
          watchlist={watchlist}
          onToggleWatchlist={onToggleWatchlist}
          getProgress={getProgress}
        />

        {/* Recommended For You */}
        <MediaCarousel
          title="Recommended For You"
          subtitle={`Tailored for your taste in ${userProfile.favoriteGenres.join(', ')}`}
          items={recommendedItems.length > 0 ? recommendedItems : ALL_MEDIA.slice(0, 5)}
          watchlist={watchlist}
          onToggleWatchlist={onToggleWatchlist}
          getProgress={getProgress}
        />

        {/* New Releases */}
        <MediaCarousel
          title="New Releases"
          subtitle="Freshly mastered 4K cinema and episodic content"
          items={newReleases}
          watchlist={watchlist}
          onToggleWatchlist={onToggleWatchlist}
          getProgress={getProgress}
        />

        {/* Popular Movies */}
        <MediaCarousel
          title="Popular Movies"
          subtitle="Blockbuster sci-fi and animation cinema"
          viewAllLink="/movies"
          items={popularMovies}
          watchlist={watchlist}
          onToggleWatchlist={onToggleWatchlist}
          getProgress={getProgress}
        />

        {/* Top Series */}
        <MediaCarousel
          title="Top Series"
          subtitle="Multi-episode sagas and quantum serials"
          viewAllLink="/series"
          items={topSeries}
          watchlist={watchlist}
          onToggleWatchlist={onToggleWatchlist}
          getProgress={getProgress}
        />
      </div>
    </div>
  );
};
