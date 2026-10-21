import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MediaItem } from '../../types/media';
import { MediaCard } from './MediaCard';
import { Link } from 'react-router-dom';

interface MediaCarouselProps {
  title: string;
  subtitle?: string;
  viewAllLink?: string;
  items: MediaItem[];
  watchlist: string[];
  onToggleWatchlist: (id: string) => void;
  getProgress: (mediaId: string) => number;
}

export const MediaCarousel: React.FC<MediaCarouselProps> = ({
  title,
  subtitle,
  viewAllLink,
  items,
  watchlist,
  onToggleWatchlist,
  getProgress,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -500 : 500;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <section className="relative w-full py-4 group/carousel">
      {/* Header */}
      <div className="flex items-end justify-between px-4 md:px-8 mb-3.5">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-white tracking-tight flex items-center gap-2">
            {title}
          </h2>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-2">
          {viewAllLink && (
            <Link
              to={viewAllLink}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors mr-2"
            >
              View All
            </Link>
          )}
          {/* Scroll Buttons */}
          <button
            onClick={() => scroll('left')}
            className="hidden md:flex w-8 h-8 rounded-lg liquid-glass-subtle items-center justify-center text-slate-300 hover:text-white hover:border-white/20 transition-colors"
            aria-label={`Scroll ${title} left`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="hidden md:flex w-8 h-8 rounded-lg liquid-glass-subtle items-center justify-center text-slate-300 hover:text-white hover:border-white/20 transition-colors"
            aria-label={`Scroll ${title} right`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Carousel Track */}
      <div
        ref={scrollRef}
        className="flex items-center gap-4 px-4 md:px-8 overflow-x-auto no-scrollbar scroll-smooth pb-3"
      >
        {items.map((media) => (
          <MediaCard
            key={media.id}
            media={media}
            isInWatchlist={watchlist.includes(media.id)}
            onToggleWatchlist={onToggleWatchlist}
            progressSeconds={getProgress(media.id)}
          />
        ))}
      </div>
    </section>
  );
};
