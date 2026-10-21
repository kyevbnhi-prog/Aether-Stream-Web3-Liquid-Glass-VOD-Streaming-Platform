import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Plus, Check, Star, Film } from 'lucide-react';
import { MediaItem } from '../../types/media';

interface MediaCardProps {
  media: MediaItem;
  isInWatchlist: boolean;
  onToggleWatchlist: (id: string) => void;
  progressSeconds?: number;
}

export const MediaCard: React.FC<MediaCardProps> = ({
  media,
  isInWatchlist,
  onToggleWatchlist,
  progressSeconds = 0,
}) => {
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  const progressPercent =
    media.durationSeconds > 0 && progressSeconds > 0
      ? Math.min(100, Math.round((progressSeconds / media.durationSeconds) * 100))
      : 0;

  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleWatchlist(media.id);
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/player/${media.id}`);
  };

  return (
    <div className="group relative flex-none w-[200px] sm:w-[220px] md:w-[240px] flex flex-col rounded-xl overflow-hidden liquid-glass border border-white/10 hover:border-violet-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-950/40">
      {/* Poster Media Box (Aspect 2:3 standard poster ratio) */}
      <Link to={`/details/${media.id}`} className="relative aspect-[2/3] w-full overflow-hidden bg-slate-900 block">
        {!imageError && media.posterUrl ? (
          <img
            src={media.posterUrl}
            alt={media.title}
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-900 to-indigo-950 text-slate-400">
            <Film className="w-10 h-10 mb-2 text-violet-400" />
            <span className="text-xs font-semibold text-center text-slate-200 line-clamp-2">
              {media.title}
            </span>
          </div>
        )}

        {/* Liquid Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/40 backdrop-blur-[2px]">
          <button
            onClick={handlePlayClick}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-violet-600 to-cyan-400 text-white flex items-center justify-center shadow-lg shadow-violet-600/50 hover:scale-110 active:scale-95 transition-transform"
            aria-label={`Play ${media.title}`}
          >
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </button>
        </div>

        {/* Top Badges (Subtle unboxed tags / 4K indicator) */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          {media.is4K && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-950/80 text-cyan-300 border border-cyan-500/30 backdrop-blur-md">
              4K HDR
            </span>
          )}
          {media.vipExclusive && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-violet-950/80 text-violet-300 border border-violet-500/30 backdrop-blur-md ml-auto">
              VIP PASS
            </span>
          )}
        </div>

        {/* Watchlist Quick Button */}
        <button
          onClick={handleWatchlistClick}
          className={`absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isInWatchlist
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/40'
              : 'liquid-glass-subtle text-white border border-white/20 hover:border-white/50 hover:bg-white/10'
          }`}
          title={isInWatchlist ? 'Remove from My List' : 'Add to My List'}
          aria-label={isInWatchlist ? 'Remove from My List' : 'Add to My List'}
        >
          {isInWatchlist ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Plus className="w-4 h-4 stroke-[2.5]" />}
        </button>

        {/* Watch Progress Bar */}
        {progressPercent > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </Link>

      {/* Card Info Box */}
      <div className="p-3.5 flex flex-col gap-1.5">
        <Link
          to={`/details/${media.id}`}
          className="text-sm font-semibold text-white hover:text-cyan-300 transition-colors line-clamp-1"
          title={media.title}
        >
          {media.title}
        </Link>

        {/* Zero-Pill Typography Metadata */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <span>{media.releaseYear}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="truncate max-w-[80px]">{media.genres[0]}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="flex items-center gap-0.5 text-amber-400 font-mono text-[11px] tabular-nums">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            {media.rating.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
};
