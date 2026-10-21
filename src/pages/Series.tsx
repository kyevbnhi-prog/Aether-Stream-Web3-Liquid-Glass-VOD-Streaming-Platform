import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tv, Play, Plus, Check, Star, Sparkles, Filter } from 'lucide-react';
import { SERIES, GENRES } from '../data/catalog';
import { MediaCard } from '../components/media/MediaCard';
import { MediaCarousel } from '../components/media/MediaCarousel';
import { MediaItem } from '../types/media';

interface SeriesProps {
  watchlist: string[];
  onToggleWatchlist: (id: string) => void;
  getProgress: (mediaId: string) => number;
}

export const Series: React.FC<SeriesProps> = ({
  watchlist,
  onToggleWatchlist,
  getProgress,
}) => {
  const navigate = useNavigate();
  const [selectedGenre, setSelectedGenre] = useState('All');

  const featuredSeries = SERIES[0]; // Chronos: Quantum Colony
  const isFeaturedInWatchlist = watchlist.includes(featuredSeries.id);

  // Filter series by genre
  const filteredSeries = SERIES.filter(
    (s) => selectedGenre === 'All' || s.genres.includes(selectedGenre)
  );

  const trendingSeries = SERIES.filter((s) => s.trending);
  const newSeries = SERIES.filter((s) => s.isNew);

  return (
    <div className="w-full pb-20 space-y-10">
      {/* Featured Series Hero Banner */}
      <section className="relative w-full h-[65vh] min-h-[480px] max-h-[680px] overflow-hidden flex items-end">
        <div className="absolute inset-0 z-0">
          <img
            src={featuredSeries.backdropUrl}
            alt={featuredSeries.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080a10] via-[#080a10]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080a10] via-[#080a10]/60 to-transparent max-w-4xl" />
        </div>

        {/* Hero Spotlight Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pb-12 w-full">
          <div className="max-w-2xl space-y-4">
            <div className="flex items-center gap-2.5 text-xs font-semibold">
              <span className="px-2.5 py-1 rounded-md bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/30 flex items-center gap-1.5">
                <Tv className="w-3.5 h-3.5 text-cyan-300" />
                <span>Featured Original Series</span>
              </span>
              <span className="text-cyan-400 font-mono tracking-wider">
                {featuredSeries.duration}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              {featuredSeries.title}
            </h1>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 font-medium">
              <span className="flex items-center gap-1 text-amber-400 font-bold font-mono">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                {featuredSeries.rating.toFixed(1)}
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{featuredSeries.releaseYear}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-cyan-300">{featuredSeries.genres.join(' / ')}</span>
            </div>

            <p className="text-sm text-slate-300 line-clamp-3 leading-relaxed">
              {featuredSeries.synopsis}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => navigate(`/player/${featuredSeries.id}`)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-semibold text-sm shadow-xl shadow-violet-600/30 flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Play Season 1</span>
              </button>

              <button
                onClick={() => navigate(`/details/${featuredSeries.id}`)}
                className="px-5 py-3 rounded-xl liquid-glass text-white hover:text-cyan-300 text-sm font-medium"
              >
                View Seasons & Episodes
              </button>

              <button
                onClick={() => onToggleWatchlist(featuredSeries.id)}
                className={`p-3 rounded-xl transition-all ${
                  isFeaturedInWatchlist
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/40'
                    : 'liquid-glass text-white hover:border-white/30'
                }`}
                title={isFeaturedInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
              >
                {isFeaturedInWatchlist ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Plus className="w-4 h-4 stroke-[2.5]" />}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Carousels Section */}
      <div className="space-y-4 -mt-8 relative z-20">
        <MediaCarousel
          title="Trending Series"
          subtitle="Top streamed television sagas and miniseries"
          items={trendingSeries}
          watchlist={watchlist}
          onToggleWatchlist={onToggleWatchlist}
          getProgress={getProgress}
        />

        <MediaCarousel
          title="Recently Added Series"
          subtitle="Brand-new seasons and episodic releases"
          items={newSeries}
          watchlist={watchlist}
          onToggleWatchlist={onToggleWatchlist}
          getProgress={getProgress}
        />
      </div>

      {/* Series Grid Catalog with Genre Filter */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/5">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Tv className="w-5 h-5 text-cyan-400" />
              <span>All Episodic Series ({filteredSeries.length})</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Browse complete seasons, episodes, and behind-the-scenes specials.
            </p>
          </div>

          {/* Genre Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {GENRES.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedGenre === g
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-semibold'
                    : 'liquid-glass-subtle text-slate-400 hover:text-white'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Display */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredSeries.map((series) => (
            <div key={series.id} className="w-full">
              <MediaCard
                media={series}
                isInWatchlist={watchlist.includes(series.id)}
                onToggleWatchlist={onToggleWatchlist}
                progressSeconds={getProgress(series.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
