import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, Play, Plus, Check, Star, Sparkles, Filter, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { MOVIES, GENRES, MECH_ASSET } from '../data/catalog';
import { MediaCard } from '../components/media/MediaCard';
import { MediaCarousel } from '../components/media/MediaCarousel';
import { MediaItem } from '../types/media';

interface MoviesProps {
  watchlist: string[];
  onToggleWatchlist: (id: string) => void;
  getProgress: (mediaId: string) => number;
}

export const Movies: React.FC<MoviesProps> = ({
  watchlist,
  onToggleWatchlist,
  getProgress,
}) => {
  const navigate = useNavigate();

  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'rating' | 'newest' | 'title'>('rating');
  const [visibleCount, setVisibleCount] = useState<number>(12);

  const featuredMovie = MOVIES[0]; // Tears of Steel
  const isFeaturedInWatchlist = watchlist.includes(featuredMovie.id);

  const trendingMovies = MOVIES.filter((m) => m.trending);
  const newReleases = MOVIES.filter((m) => m.isNew);

  // Available release years
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(MOVIES.map((m) => m.releaseYear.toString()))).sort().reverse();
    return ['All', ...years];
  }, []);

  // Filtered & Sorted Movie Catalog
  const filteredMovies = useMemo(() => {
    return MOVIES.filter((m) => {
      if (selectedGenre !== 'All' && !m.genres.includes(selectedGenre)) return false;
      if (selectedYear !== 'All' && m.releaseYear.toString() !== selectedYear) return false;
      if (m.rating < minRating) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return b.releaseYear - a.releaseYear;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0;
    });
  }, [selectedGenre, selectedYear, minRating, sortBy]);

  const displayedMovies = filteredMovies.slice(0, visibleCount);

  const resetFilters = () => {
    setSelectedGenre('All');
    setSelectedYear('All');
    setMinRating(0);
    setSortBy('rating');
    setVisibleCount(12);
  };

  const hasActiveFilters = selectedGenre !== 'All' || selectedYear !== 'All' || minRating > 0;

  return (
    <div className="w-full pb-20 space-y-10">
      {/* Featured Movie Spotlight Banner */}
      <section className="relative w-full h-[65vh] min-h-[480px] max-h-[680px] overflow-hidden flex items-end">
        <div className="absolute inset-0 z-0">
          <img
            src={featuredMovie.backdropUrl}
            alt={featuredMovie.title}
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
              <span className="px-2.5 py-1 rounded-md bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/30 flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-cyan-200" />
                <span>Featured Motion Picture</span>
              </span>
              <span className="text-cyan-400 font-mono tracking-wider">
                {featuredMovie.is4K ? '4K ULTRA HD' : 'HD'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              {featuredMovie.title}
            </h1>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 font-medium">
              <span className="flex items-center gap-1 text-amber-400 font-bold font-mono">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                {featuredMovie.rating.toFixed(1)}
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{featuredMovie.releaseYear}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{featuredMovie.duration}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-cyan-300">{featuredMovie.genres.join(' / ')}</span>
            </div>

            <p className="text-sm text-slate-300 line-clamp-3 leading-relaxed">
              {featuredMovie.synopsis}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => navigate(`/player/${featuredMovie.id}`)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-semibold text-sm shadow-xl shadow-violet-600/30 flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Watch Film</span>
              </button>

              <button
                onClick={() => navigate(`/details/${featuredMovie.id}`)}
                className="px-5 py-3 rounded-xl liquid-glass text-white hover:text-cyan-300 text-sm font-medium"
              >
                View Details
              </button>

              <button
                onClick={() => onToggleWatchlist(featuredMovie.id)}
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
          title="Trending Movies"
          subtitle="Blockbuster sci-fi and animation cinema"
          items={trendingMovies}
          watchlist={watchlist}
          onToggleWatchlist={onToggleWatchlist}
          getProgress={getProgress}
        />

        <MediaCarousel
          title="New Mastered Releases"
          subtitle="4K HDR editions streaming in uncompressed spatial audio"
          items={newReleases}
          watchlist={watchlist}
          onToggleWatchlist={onToggleWatchlist}
          getProgress={getProgress}
        />
      </div>

      {/* Movies Catalog Filter & Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Film className="w-5 h-5 text-violet-400" />
              <span>Full Cinema Catalog ({filteredMovies.length})</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Explore open-source films, award-winning visual masterworks, and CGI features.
            </p>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Year Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Year:</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-slate-950 border border-white/10 text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-400 text-xs"
              >
                {availableYears.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            {/* Min Rating */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Rating:</span>
              <select
                value={minRating}
                onChange={(e) => setMinRating(parseFloat(e.target.value))}
                className="bg-slate-950 border border-white/10 text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-400 text-xs"
              >
                <option value={0}>All Ratings</option>
                <option value={8}>8.0+ ★</option>
                <option value={8.5}>8.5+ ★</option>
                <option value={9}>9.0+ ★</option>
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-950 border border-white/10 text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-400 text-xs"
              >
                <option value="rating">Top Rated</option>
                <option value="newest">Release Date</option>
                <option value="title">Alphabetical (A-Z)</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Genre Filter Scroll Row */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2">
          {GENRES.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedGenre === g
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-semibold'
                  : 'liquid-glass-subtle text-slate-400 hover:text-white'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Grid Display */}
        {displayedMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {displayedMovies.map((movie) => (
              <div key={movie.id} className="w-full">
                <MediaCard
                  media={movie}
                  isInWatchlist={watchlist.includes(movie.id)}
                  onToggleWatchlist={onToggleWatchlist}
                  progressSeconds={getProgress(movie.id)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full py-16 liquid-glass rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center p-6">
            <Film className="w-10 h-10 text-slate-500 mb-2" />
            <h3 className="text-base font-bold text-white mb-1">No movies match your criteria</h3>
            <p className="text-xs text-slate-400 max-w-sm mb-4">
              Try adjusting the genre filter or lowering the minimum rating.
            </p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Load More Pagination */}
        {filteredMovies.length > visibleCount && (
          <div className="flex justify-center pt-8">
            <button
              onClick={() => setVisibleCount((prev) => prev + 12)}
              className="px-6 py-3 rounded-xl liquid-glass text-xs font-semibold text-white hover:text-cyan-300 hover:border-cyan-400/40 transition-all shadow-xl"
            >
              Load More Movies ({filteredMovies.length - visibleCount} remaining)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
