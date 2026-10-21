import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Radio, Users, Volume2, VolumeX, Maximize2, Sparkles, Clock, AlertCircle } from 'lucide-react';
import { LIVE_CHANNELS } from '../data/catalog';
import { LiveChannel } from '../types/media';

export const LiveTV: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialChannelId = searchParams.get('channel') || LIVE_CHANNELS[0].id;

  const [selectedChannel, setSelectedChannel] = useState<LiveChannel>(
    LIVE_CHANNELS.find((c) => c.id === initialChannelId) || LIVE_CHANNELS[0]
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isMuted, setIsMuted] = useState(true);
  const [streamError, setStreamError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setStreamError(false);
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {
        // Autoplay policy or error
      });
    }
  }, [selectedChannel]);

  const categories = ['All', 'Cinema', 'News', 'Sports', 'Entertainment', 'Tech & Sci'];

  const filteredChannels = LIVE_CHANNELS.filter(
    (ch) => selectedCategory === 'All' || ch.category === selectedCategory
  );

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (!document.fullscreenElement) {
        videoRef.current.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 min-h-screen">
      {/* Page Title */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
          <Radio className="w-4 h-4 animate-pulse" />
          <span>REAL-TIME BROADCAST NETWORK</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Live Television Guide
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Continuous broadcast streams, high-definition sports feeds, and live science dispatches.
        </p>
      </div>

      {/* Main Live Stage Split (Monitor + Channel Information) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Live Video Monitor (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden liquid-glass border border-white/10 shadow-2xl bg-black">
            {/* Real Playable Stream Element */}
            <video
              ref={videoRef}
              src={selectedChannel.streamUrl}
              autoPlay
              muted={isMuted}
              playsInline
              loop
              onPlaying={() => setIsPlaying(true)}
              onError={() => setStreamError(true)}
              className="w-full h-full object-contain"
            />

            {/* Live Indicator Badge & Metadata Top Overlay */}
            <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider font-mono bg-rose-600/90 text-white border border-rose-500/50 shadow-lg shadow-rose-600/30 flex items-center gap-1.5 backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  LIVE NOW
                </span>
                <span className="px-2 py-1 rounded-md text-[11px] font-mono font-medium text-slate-200 bg-black/60 border border-white/10 backdrop-blur-md">
                  {selectedChannel.callsign}
                </span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-200 font-mono bg-black/60 px-2.5 py-1 rounded-md border border-white/10 backdrop-blur-md">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <span>{selectedChannel.viewerCount.toLocaleString()} watching</span>
              </div>
            </div>

            {/* Error or Fallback Overlay */}
            {streamError && (
              <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10">
                <AlertCircle className="w-10 h-10 text-amber-400 mb-2" />
                <h4 className="text-sm font-bold text-white mb-1">
                  Live Feed Temporarily Re-routing
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mb-3">
                  The upstream satellite relay for {selectedChannel.name} is currently switching transponders.
                </p>
                <button
                  onClick={() => {
                    setStreamError(false);
                    if (videoRef.current) {
                      videoRef.current.load();
                      videoRef.current.play();
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg bg-violet-600 text-white text-xs font-semibold hover:bg-violet-500"
                >
                  Retry Connection
                </button>
              </div>
            )}

            {/* Quick Stream Controls Bottom Overlay */}
            <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-auto">
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="p-2 rounded-xl liquid-glass text-white hover:text-cyan-300 transition-colors"
                  aria-label={isMuted ? 'Unmute live audio' : 'Mute audio'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <span className="text-xs text-slate-300 font-medium px-2.5 py-1.5 rounded-xl liquid-glass backdrop-blur-md">
                  {selectedChannel.resolution}
                </span>
              </div>

              <button
                onClick={handleFullscreen}
                className="p-2 rounded-xl liquid-glass text-white hover:text-cyan-300 transition-colors"
                aria-label="Fullscreen live monitor"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Current Program Details Card */}
          <div className="p-5 rounded-2xl liquid-glass border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-cyan-400 font-semibold uppercase tracking-wider">
                  Currently Broadcasting
                </span>
                <h2 className="text-lg font-bold text-white mt-0.5">
                  {selectedChannel.currentProgram.title}
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {selectedChannel.currentProgram.start} – {selectedChannel.currentProgram.end}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedChannel.currentProgram.description}
            </p>

            {/* Progress of Program */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Program Elapsed</span>
                <span>{selectedChannel.currentProgram.progressPercentage}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-cyan-400"
                  style={{ width: `${selectedChannel.currentProgram.progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Up Next Preview */}
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                Up Next at {selectedChannel.upcomingProgram.start}:
              </span>
              <span className="font-semibold text-slate-200">
                {selectedChannel.upcomingProgram.title}
              </span>
            </div>
          </div>
        </div>

        {/* Channels Directory Sidebar (1 col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Channel Directory
            </h3>
            <span className="text-xs font-mono text-slate-400">
              {filteredChannels.length} Channels
            </span>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-violet-600 text-white font-semibold'
                    : 'liquid-glass-subtle text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Channels List */}
          <div className="space-y-2.5 max-h-[580px] overflow-y-auto no-scrollbar pr-1">
            {filteredChannels.map((channel) => {
              const isSelected = selectedChannel.id === channel.id;
              return (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'bg-gradient-to-r from-violet-950/60 to-slate-900/80 border-violet-500/60 shadow-lg shadow-violet-950/40'
                      : 'liquid-glass border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="w-11 h-11 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-white/10 mt-0.5">
                    <img
                      src={channel.logoUrl}
                      alt={channel.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-white truncate">
                        {channel.name}
                      </span>
                      <span className="text-[10px] font-mono text-cyan-400">
                        {channel.callsign}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-300 truncate mt-0.5 font-medium">
                      {channel.currentProgram.title}
                    </p>

                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono mt-1">
                      <span>{channel.category}</span>
                      <span>·</span>
                      <span>{channel.resolution}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
