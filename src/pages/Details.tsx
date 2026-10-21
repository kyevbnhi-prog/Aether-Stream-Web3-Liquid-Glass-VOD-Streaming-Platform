import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Play,
  Plus,
  Check,
  Star,
  Film,
  Sparkles,
  ArrowLeft,
  Tv,
  Calendar,
  Clock,
  UserCheck,
  X,
} from 'lucide-react';
import { ALL_MEDIA } from '../data/catalog';
import { MediaCarousel } from '../components/media/MediaCarousel';
import { MediaItem, Episode } from '../types/media';

interface DetailsProps {
  watchlist: string[];
  onToggleWatchlist: (id: string) => void;
  getProgress: (mediaId: string, episodeId?: string) => number;
}

export const Details: React.FC<DetailsProps> = ({
  watchlist,
  onToggleWatchlist,
  getProgress,
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const media = ALL_MEDIA.find((m) => m.id === id);

  const [selectedSeasonNumber, setSelectedSeasonNumber] = useState<number>(1);
  const [showTrailerModal, setShowTrailerModal] = useState(false);

  if (!media) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <Film className="w-12 h-12 text-slate-500 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Title Not Found</h2>
        <p className="text-xs text-slate-400 max-w-sm mb-6">
          The requested movie or series could not be found in the current catalog.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-5 py-2.5 rounded-xl bg-violet-600 text-white text-xs font-semibold hover:bg-violet-500 shadow-lg shadow-violet-600/30"
        >
          Return to Theater Home
        </button>
      </div>
    );
  }

  const isInWatchlist = watchlist.includes(media.id);
  const similarItems = ALL_MEDIA.filter(
    (item) => item.id !== media.id && item.genres.some((g) => media.genres.includes(g))
  );

  const currentSeason = media.seasons?.find((s) => s.seasonNumber === selectedSeasonNumber);

  const handlePlayEpisode = (episode: Episode) => {
    navigate(`/player/${media.id}?episode=${episode.id}`);
  };

  return (
    <div className="relative w-full pb-20">
      {/* Full-bleed Cinematic Backdrop */}
      <div className="relative w-full h-[65vh] min-h-[460px] max-h-[680px] overflow-hidden">
        <img
          src={media.backdropUrl}
          alt={media.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-top scale-100 filter brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080a10] via-[#080a10]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080a10] via-[#080a10]/40 to-transparent" />

        {/* Back Button */}
        <div className="absolute top-6 left-4 md:left-8 z-20">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full liquid-glass flex items-center justify-center text-white hover:text-cyan-300 hover:border-cyan-400/40 transition-colors shadow-xl"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Details Card (Elevated Liquid Glass Container) */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-40 relative z-20">
        <div className="liquid-glass rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl backdrop-blur-2xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Poster Column */}
            <div className="md:col-span-1">
              <div className="relative aspect-[2/3] w-full max-w-[280px] mx-auto rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-slate-900">
                <img
                  src={media.posterUrl}
                  alt={media.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                {media.is4K && (
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-950/80 text-cyan-300 border border-cyan-500/30 backdrop-blur-md">
                    4K ULTRA HD
                  </span>
                )}
              </div>
            </div>

            {/* Synopsis & Actions Column */}
            <div className="md:col-span-3 space-y-5">
              {/* Kicker & Rating */}
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="px-2.5 py-1 rounded-md bg-violet-600/30 border border-violet-400/40 text-violet-300 font-semibold uppercase tracking-wider">
                  {media.type === 'movie' ? 'Feature Film' : 'Original Series'}
                </span>

                <div className="flex items-center gap-1 text-amber-400 font-mono font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{media.rating.toFixed(1)} / 10</span>
                </div>

                <span className="text-slate-400 font-mono">·</span>
                <span className="text-slate-300 font-mono">{media.releaseYear}</span>
                <span className="text-slate-400 font-mono">·</span>
                <span className="text-slate-300 font-mono">{media.duration}</span>
              </div>

              {/* Title & Tagline */}
              <div>
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                  {media.title}
                </h1>
                {media.tagline && (
                  <p className="text-sm sm:text-base text-cyan-300 italic mt-1 font-medium">
                    "{media.tagline}"
                  </p>
                )}
              </div>

              {/* Genre List */}
              <div className="flex flex-wrap items-center gap-2">
                {media.genres.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 rounded-lg liquid-glass-subtle text-xs text-slate-300 border border-white/5"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              {/* Synopsis Prose */}
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
                {media.synopsis}
              </p>

              {/* Cast & Director */}
              <div className="pt-2 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 font-medium block">Starring:</span>
                  <span className="text-slate-200 font-medium">{media.cast.join(', ')}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block">Directed by:</span>
                  <span className="text-slate-200 font-medium">{media.director}</span>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center gap-3 pt-4">
                <button
                  onClick={() => navigate(`/player/${media.id}`)}
                  className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-semibold text-sm shadow-xl shadow-violet-600/30 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>{media.type === 'series' ? 'Play Episode 1' : 'Watch Now'}</span>
                </button>

                {media.trailerUrl && (
                  <button
                    onClick={() => setShowTrailerModal(true)}
                    className="px-5 py-3.5 rounded-xl liquid-glass text-white hover:text-cyan-300 hover:border-cyan-400/40 text-sm font-medium transition-all"
                  >
                    Official Trailer
                  </button>
                )}

                <button
                  onClick={() => onToggleWatchlist(media.id)}
                  className={`px-5 py-3.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                    isInWatchlist
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/40 font-semibold'
                      : 'liquid-glass text-white hover:border-white/30'
                  }`}
                >
                  {isInWatchlist ? (
                    <>
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span>Added to My List</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                      <span>Add to My List</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Series Episode Picker Section (Only for series) */}
          {media.type === 'series' && media.seasons && (
            <div className="mt-12 pt-8 border-t border-white/10 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Tv className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-xl font-bold text-white">Episodes & Chapters</h3>
                </div>

                {/* Season Switcher Tabs */}
                <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-white/5">
                  {media.seasons.map((season) => (
                    <button
                      key={season.seasonNumber}
                      onClick={() => setSelectedSeasonNumber(season.seasonNumber)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                        selectedSeasonNumber === season.seasonNumber
                          ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Season {season.seasonNumber}
                    </button>
                  ))}
                </div>
              </div>

              {/* Episodes List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentSeason?.episodes.map((ep) => (
                  <div
                    key={ep.id}
                    onClick={() => handlePlayEpisode(ep)}
                    className="p-3.5 rounded-2xl liquid-glass-subtle border border-white/5 hover:border-violet-500/50 hover:bg-slate-900/60 cursor-pointer transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-900 mb-3 border border-white/10">
                        <img
                          src={ep.thumbnailUrl}
                          alt={ep.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-10 h-10 rounded-full bg-violet-600 text-white flex items-center justify-center shadow-lg">
                            <Play className="w-4 h-4 fill-white ml-0.5" />
                          </div>
                        </div>
                        <span className="absolute bottom-2 right-2 text-[10px] font-mono bg-black/80 px-2 py-0.5 rounded text-slate-300">
                          {ep.duration}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                        {ep.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                        {ep.overview}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                      <span>Season {ep.seasonNumber} · Ep {ep.episodeNumber}</span>
                      <span className="text-cyan-400 font-medium group-hover:underline">Play Now</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Similar Titles Carousel */}
      {similarItems.length > 0 && (
        <div className="mt-12">
          <MediaCarousel
            title="More Like This"
            subtitle={`Explore related ${media.genres.join(' & ')} selections`}
            items={similarItems}
            watchlist={watchlist}
            onToggleWatchlist={onToggleWatchlist}
            getProgress={getProgress}
          />
        </div>
      )}

      {/* Official Trailer Modal */}
      {showTrailerModal && media.trailerUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="w-full max-w-4xl liquid-glass rounded-2xl border border-white/15 p-4 shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-sm font-bold text-white">
                Trailer: {media.title}
              </h3>
              <button
                onClick={() => setShowTrailerModal(false)}
                className="p-1 rounded-lg hover:text-white text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
              <video
                src={media.trailerUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
