import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { ALL_MEDIA } from '../data/catalog';
import { VideoPlayer } from '../components/player/VideoPlayer';
import { Episode, MediaItem } from '../types/media';
import { storageService } from '../services/storage';
import { Tv, List, ArrowLeft, Film } from 'lucide-react';

interface PlayerPageProps {
  onSaveProgress: (mediaId: string, progress: number, duration: number, episodeId?: string) => void;
  getProgress: (mediaId: string, episodeId?: string) => number;
}

export const Player: React.FC<PlayerPageProps> = ({
  onSaveProgress,
  getProgress,
}) => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const episodeId = searchParams.get('episode');
  const navigate = useNavigate();

  const [showEpisodeDrawer, setShowEpisodeDrawer] = useState(false);

  const media = ALL_MEDIA.find((m) => m.id === id);

  // Identify current episode for series
  const { currentEpisode, allEpisodes, nextEpisode } = useMemo(() => {
    if (!media || media.type !== 'series' || !media.seasons) {
      return { currentEpisode: null, allEpisodes: [], nextEpisode: null };
    }

    const flatEpisodes: Episode[] = media.seasons.flatMap((s) => s.episodes);
    const selected = episodeId
      ? flatEpisodes.find((ep) => ep.id === episodeId) || flatEpisodes[0]
      : flatEpisodes[0];

    const currentIndex = flatEpisodes.findIndex((ep) => ep.id === selected.id);
    const next = currentIndex >= 0 && currentIndex < flatEpisodes.length - 1
      ? flatEpisodes[currentIndex + 1]
      : null;

    return { currentEpisode: selected, allEpisodes: flatEpisodes, nextEpisode: next };
  }, [media, episodeId]);

  if (!media) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center text-center p-6 bg-black">
        <Film className="w-12 h-12 text-slate-500 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Media Stream Not Found</h2>
        <p className="text-xs text-slate-400 max-w-sm mb-6">
          The requested title does not exist or has been removed from the playback server.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-5 py-2.5 rounded-xl bg-violet-600 text-white text-xs font-semibold hover:bg-violet-500"
        >
          Return to Theater
        </button>
      </div>
    );
  }

  // Determine playback parameters
  const videoUrl = currentEpisode ? currentEpisode.videoUrl : media.videoUrl;
  const initialTime = getProgress(media.id, currentEpisode?.id);
  const title = media.title;
  const subtitle = currentEpisode
    ? `Season ${currentEpisode.seasonNumber} · Episode ${currentEpisode.episodeNumber}: ${currentEpisode.title}`
    : `${media.releaseYear} · ${media.genres.join(' / ')}`;

  const handleTimeUpdate = (curTime: number, dur: number) => {
    if (dur > 0 && Math.floor(curTime) % 3 === 0) {
      onSaveProgress(media.id, curTime, dur, currentEpisode?.id);
    }
  };

  const handleSelectEpisode = (ep: Episode) => {
    setSearchParams({ episode: ep.id });
    setShowEpisodeDrawer(false);
  };

  const handleNextEpisode = () => {
    if (nextEpisode) {
      setSearchParams({ episode: nextEpisode.id });
    }
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex flex-col">
      {/* Video Player Core */}
      <div className="relative flex-1 w-full h-full">
        <VideoPlayer
          title={title}
          subtitle={subtitle}
          videoUrl={videoUrl}
          initialTime={initialTime}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleNextEpisode}
          onBack={() => navigate(`/details/${media.id}`)}
          nextEpisode={nextEpisode}
          onNextEpisode={handleNextEpisode}
          introStart={currentEpisode?.introStart}
          introEnd={currentEpisode?.introEnd}
        />

        {/* Series Episode Selector Drawer Trigger */}
        {media.type === 'series' && allEpisodes.length > 1 && (
          <button
            onClick={() => setShowEpisodeDrawer(!showEpisodeDrawer)}
            className="absolute top-6 right-6 z-30 px-3.5 py-2 rounded-xl liquid-glass text-xs font-semibold text-white hover:text-cyan-300 hover:border-cyan-400/40 shadow-xl flex items-center gap-2 transition-all"
            title="Episode Drawer"
          >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">Episodes</span>
          </button>
        )}

        {/* Series Episode Drawer Panel */}
        {showEpisodeDrawer && (
          <div className="absolute top-0 right-0 bottom-0 w-80 max-w-[85vw] z-40 liquid-glass border-l border-white/10 p-5 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <Tv className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Episodes</h3>
              </div>
              <button
                onClick={() => setShowEpisodeDrawer(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar space-y-2.5">
              {allEpisodes.map((ep) => {
                const isCurrent = ep.id === currentEpisode?.id;
                return (
                  <button
                    key={ep.id}
                    onClick={() => handleSelectEpisode(ep)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start gap-3 ${
                      isCurrent
                        ? 'bg-gradient-to-r from-violet-950/70 to-slate-900 border-cyan-400/60 shadow-lg'
                        : 'liquid-glass-subtle border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="w-16 h-10 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-white/10">
                      <img
                        src={ep.thumbnailUrl}
                        alt={ep.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono text-cyan-400 font-semibold">
                          S{ep.seasonNumber}:E{ep.episodeNumber}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">{ep.duration}</span>
                      </div>
                      <h4 className="text-xs font-semibold text-white truncate mt-0.5">
                        {ep.title}
                      </h4>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
