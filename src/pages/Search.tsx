import React, { useState, useMemo } from 'react';
import { Search as SearchIcon, X, SlidersHorizontal, Film, Tv, Radio, Star, RotateCcw } from 'lucide-react';
import { ALL_MEDIA, LIVE_CHANNELS, GENRES, SEARCH_SUGGESTIONS } from '../data/catalog';
import { MediaCard } from '../components/media/MediaCard';
import { Link } from 'react-router-dom';

interface SearchProps {
  watchlist: string[];
  onToggleWatchlist: (id: string) => void;
  getProgress: (mediaId: string) => number;
}

export const Search: React.FC<SearchProps> = ({
  watchlist,
  onToggleWatchlist,
  getProgress,
}) => {
  const [query, setQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedType, setSelectedType] = useState<'all' | 'movie' | 'series' | 'live'>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'year'>('relevance');

  // Filtered media results
  const mediaResults = useMemo(() => {
    return ALL_MEDIA.filter((item) => {
      // Type match
      if (selectedType !== 'all' && selectedType !== 'live' && item.type !== selectedType) {
        return false;
      }
      if (selectedType === 'live') {
        return false;
      }

      // Genre match
      if (selectedGenre !== 'All' && !item.genres.includes(selectedGenre)) {
        return false;
      }

      // Rating match
      if (item.rating < minRating) {
        return false;
      }

      // Query match (title, synopsis, cast, director, genres)
      if (query.trim()) {
        const q = query.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesSynopsis = item.synopsis.toLowerCase().includes(q);
        const matchesCast = item.cast.some((c) => c.toLowerCase().includes(q));
        const matchesDirector = item.director.toLowerCase().includes(q);
        const matchesGenre = item.genres.some((g) => g.toLowerCase().includes(q));
        return matchesTitle || matchesSynopsis || matchesCast || matchesDirector || matchesGenre;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'year') return b.releaseYear - a.releaseYear;
      return 0;
    });
  }, [query, selectedGenre, selectedType, minRating, sortBy]);

  // Filtered live channels
  const channelResults = useMemo(() => {
    if (selectedType === 'movie' || selectedType === 'series') return [];
    if (!query.trim() && selectedType !== 'live') return [];

    const q = query.toLowerCase().trim();
    return LIVE_CHANNELS.filter((ch) => {
      if (selectedGenre !== 'All' && ch.category.toLowerCase() !== selectedGenre.toLowerCase()) {
        return false;
      }
      if (!q) return true;
      return (
        ch.name.toLowerCase().includes(q) ||
        ch.category.toLowerCase().includes(q) ||
        ch.currentProgram.title.toLowerCase().includes(q)
      );
    });
  }, [query, selectedGenre, selectedType]);

  const resetFilters = () => {
    setQuery('');
    setSelectedGenre('All');
    setSelectedType('all');
    setMinRating(0);
    setSortBy('relevance');
  };

  const hasActiveFilters =
    query.trim() !== '' ||
    selectedGenre !== 'All' ||
    selectedType !== 'all' ||
    minRating > 0;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 min-h-screen">
      {/* Search Header */}
      <div className="max-w-3xl mx-auto mb-8 space-y-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight text-center">
          Search Aether Catalog
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 text-center">
          Instant search across cinema films, series episodes, live broadcast channels, and cast.
        </p>

        {/* Search Input Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-cyan-400">
            <SearchIcon className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, director, actor, genre..."
            className="w-full pl-12 pr-12 py-3.5 rounded-2xl liquid-glass border border-white/15 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 shadow-xl transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white"
              aria-label="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Popular Search Suggestions */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1 text-xs">
          <span className="text-slate-500 font-medium mr-1">Popular:</span>
          {SEARCH_SUGGESTIONS.map((term) => (
            <button
              key={term}
              onClick={() => setQuery(term)}
              className="px-2.5 py-1 rounded-lg liquid-glass-subtle text-slate-300 hover:text-cyan-300 hover:border-cyan-400/40 text-[11px] transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Toolbar (Segmented Controls & Dropdowns) */}
      <div className="liquid-glass rounded-2xl p-4 border border-white/10 mb-8 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Content Type Selector */}
          <div className="flex items-center gap-1 p-1 bg-slate-950/70 rounded-xl border border-white/5">
            {(['all', 'movie', 'series', 'live'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors ${
                  selectedType === type
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {type === 'all' ? 'All Content' : type === 'movie' ? 'Movies' : type === 'series' ? 'Series' : 'Live TV'}
              </button>
            ))}
          </div>

          {/* Rating & Sorting Dropdowns */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* Minimum Rating */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Min Rating:</span>
              <select
                value={minRating}
                onChange={(e) => setMinRating(parseFloat(e.target.value))}
                className="bg-slate-950 border border-white/10 text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-400 text-xs"
              >
                <option value={0}>Any</option>
                <option value={8}>8.0+ ★</option>
                <option value={8.5}>8.5+ ★</option>
                <option value={9}>9.0+ ★</option>
              </select>
            </div>

            {/* Sort By */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-950 border border-white/10 text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-400 text-xs"
              >
                <option value="relevance">Relevance</option>
                <option value="rating">Highest Rated</option>
                <option value="year">Newest First</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 transition-colors ml-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Genre Filter Scroll Row */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-white/5">
          {GENRES.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedGenre === g
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Live Channels Section (if any matched) */}
      {channelResults.length > 0 && (
        <div className="mb-10">
          <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400" />
            <span>Matching Live Channels ({channelResults.length})</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {channelResults.map((channel) => (
              <Link
                key={channel.id}
                to={`/live?channel=${channel.id}`}
                className="p-4 rounded-xl liquid-glass border border-white/10 hover:border-cyan-400/50 flex items-center gap-3 transition-all group"
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-900 shrink-0">
                  <img
                    src={channel.logoUrl}
                    alt={channel.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-sm truncate group-hover:text-cyan-300">
                      {channel.name}
                    </span>
                    <span className="text-[10px] text-cyan-400 font-mono bg-cyan-950/60 px-1.5 py-0.2 rounded border border-cyan-500/30">
                      LIVE
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    Now: {channel.currentProgram.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Media Results Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Film className="w-4 h-4 text-violet-400" />
            <span>Catalog Results ({mediaResults.length})</span>
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            {selectedGenre !== 'All' ? `${selectedGenre} · ` : ''}
            {selectedType !== 'all' ? selectedType.toUpperCase() : 'ALL MEDIA'}
          </span>
        </div>

        {mediaResults.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {mediaResults.map((item) => (
              <div key={item.id} className="w-full">
                <MediaCard
                  media={item}
                  isInWatchlist={watchlist.includes(item.id)}
                  onToggleWatchlist={onToggleWatchlist}
                  progressSeconds={getProgress(item.id)}
                />
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="w-full py-16 liquid-glass rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center p-6">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center text-slate-500 mb-3">
              <SearchIcon className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">No matches found</h3>
            <p className="text-xs text-slate-400 max-w-sm mb-4">
              We couldn't find any titles matching "{query}" with the current filters. Try searching for a different actor, title, or resetting filters.
            </p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-colors shadow-lg shadow-violet-600/30"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
