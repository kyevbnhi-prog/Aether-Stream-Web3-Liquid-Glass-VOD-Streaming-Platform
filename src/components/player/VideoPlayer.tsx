import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  RotateCcw,
  FastForward,
  SkipForward,
  Settings,
  AlertTriangle,
  ArrowLeft,
  Check,
} from 'lucide-react';
import { Episode } from '../../types/media';

interface VideoPlayerProps {
  title: string;
  subtitle?: string;
  videoUrl: string;
  initialTime?: number;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onEnded?: () => void;
  onBack?: () => void;
  nextEpisode?: Episode | null;
  onNextEpisode?: () => void;
  introStart?: number;
  introEnd?: number;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  title,
  subtitle,
  videoUrl,
  initialTime = 0,
  onTimeUpdate,
  onEnded,
  onBack,
  nextEpisode,
  onNextEpisode,
  introStart = 0,
  introEnd = 0,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState('1080p 60fps (High)');
  const [hasError, setHasError] = useState(false);
  const [resumeNotification, setResumeNotification] = useState<string | null>(null);
  const [customUrlInput, setCustomUrlInput] = useState('');

  // Initial resume setup
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (initialTime > 5) {
      video.currentTime = initialTime;
      const mins = Math.floor(initialTime / 60);
      const secs = Math.floor(initialTime % 60);
      setResumeNotification(`Resumed from ${mins}:${secs < 10 ? '0' : ''}${secs}`);
      setTimeout(() => setResumeNotification(null), 4000);
    }
  }, [initialTime]);

  // Controls auto-hide timer
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
        setShowSpeedMenu(false);
        setShowQualityMenu(false);
      }
    }, 3500);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      const video = videoRef.current;
      if (!video) return;

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'arrowleft':
          e.preventDefault();
          seekBy(-10);
          break;
        case 'arrowright':
          e.preventDefault();
          seekBy(10);
          break;
        case 'arrowup':
          e.preventDefault();
          changeVolume(0.1);
          break;
        case 'arrowdown':
          e.preventDefault();
          changeVolume(-0.1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isFullscreen, volume, isMuted]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => setHasError(true));
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const changeVolume = (delta: number) => {
    const video = videoRef.current;
    if (!video) return;
    const newVol = Math.max(0, Math.min(1, volume + delta));
    video.volume = newVol;
    setVolume(newVol);
    if (newVol > 0 && isMuted) {
      video.muted = false;
      setIsMuted(false);
    }
  };

  const handleVolumeSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    const video = videoRef.current;
    if (!video) return;
    video.volume = val;
    setVolume(val);
    if (val === 0) {
      video.muted = true;
      setIsMuted(true);
    } else if (isMuted) {
      video.muted = false;
      setIsMuted(false);
    }
  };

  const seekBy = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(video.duration || 0, video.currentTime + seconds));
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const targetTime = parseFloat(e.target.value);
    video.currentTime = targetTime;
    setCurrentTime(targetTime);
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const setSpeed = (speed: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = speed;
    setPlaybackSpeed(speed);
    setShowSpeedMenu(false);
  };

  const skipIntro = () => {
    const video = videoRef.current;
    if (!video || !introEnd) return;
    video.currentTime = introEnd;
  };

  const restartVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    setResumeNotification(null);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const showSkipIntro =
    introEnd > 0 && currentTime >= introStart && currentTime < introEnd;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-full min-h-[480px] bg-black select-none overflow-hidden group flex items-center justify-center"
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-contain cursor-pointer"
        onClick={togglePlay}
        onTimeUpdate={() => {
          if (videoRef.current) {
            const cur = videoRef.current.currentTime;
            const dur = videoRef.current.duration || 0;
            setCurrentTime(cur);
            setDuration(dur);
            if (onTimeUpdate) onTimeUpdate(cur, dur);
          }
        }}
        onLoadedMetadata={() => {
          if (videoRef.current) {
            setDuration(videoRef.current.duration || 0);
            setHasError(false);
          }
        }}
        onError={() => setHasError(true)}
        onEnded={() => {
          setIsPlaying(false);
          if (onEnded) onEnded();
        }}
        playsInline
      />

      {/* Resume Notification */}
      {resumeNotification && (
        <div className="absolute top-20 left-8 z-30 liquid-glass rounded-xl p-3 border border-cyan-500/30 text-xs text-white flex items-center gap-3 animate-in fade-in duration-300">
          <span>{resumeNotification}</span>
          <button
            onClick={restartVideo}
            className="text-cyan-400 font-semibold hover:underline flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" /> Start from beginning
          </button>
        </div>
      )}

      {/* Skip Intro Button */}
      {showSkipIntro && (
        <button
          onClick={skipIntro}
          className="absolute bottom-24 right-8 z-30 liquid-glass px-4 py-2 rounded-xl border border-white/20 text-xs font-semibold text-white hover:border-cyan-400 hover:text-cyan-300 shadow-xl transition-all flex items-center gap-2"
        >
          <FastForward className="w-3.5 h-3.5" />
          <span>Skip Intro</span>
        </button>
      )}

      {/* Error Fallback Overlay */}
      {hasError && (
        <div className="absolute inset-0 z-40 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Stream Unavailable or Format Error</h3>
          <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
            The configured media endpoint could not be played directly by your browser. You can load any valid test MP4 video stream URL below to verify instant playback.
          </p>

          <div className="flex w-full max-w-md gap-2">
            <input
              type="text"
              placeholder="https://example.com/stream.mp4"
              value={customUrlInput}
              onChange={(e) => setCustomUrlInput(e.target.value)}
              className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-cyan-400"
            />
            <button
              onClick={() => {
                if (videoRef.current && customUrlInput) {
                  videoRef.current.src = customUrlInput;
                  videoRef.current.load();
                  videoRef.current.play();
                  setHasError(false);
                }
              }}
              className="px-4 py-2 bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-xs font-semibold rounded-xl hover:opacity-90 transition-opacity"
            >
              Load Stream
            </button>
          </div>

          <button
            onClick={() => {
              if (videoRef.current) {
                videoRef.current.src = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4';
                videoRef.current.load();
                videoRef.current.play();
                setHasError(false);
              }
            }}
            className="mt-4 text-xs text-cyan-400 hover:underline"
          >
            Or restore high-compatibility Tears of Steel test stream
          </button>
        </div>
      )}

      {/* Top Header Bar Overlay */}
      <div
        className={`absolute top-0 left-0 right-0 z-20 p-6 bg-gradient-to-b from-black/80 to-transparent transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="w-10 h-10 rounded-full liquid-glass-subtle flex items-center justify-center text-white hover:text-cyan-300 hover:border-white/30 transition-colors"
                aria-label="Back to details"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h2 className="text-base md:text-lg font-bold text-white tracking-tight">{title}</h2>
              {subtitle && <p className="text-xs text-slate-300">{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/50 border border-cyan-500/20">
              {selectedQuality}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Liquid Glass Controls Overlay */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-20 p-4 md:p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Scrubber Bar */}
        <div className="relative mb-3 flex items-center group/scrubber">
          <input
            type="range"
            min="0"
            max={duration || 100}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-slate-700/60 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:h-2.5 transition-all"
            aria-label="Seek time slider"
          />
        </div>

        {/* Control Buttons Row */}
        <div className="flex items-center justify-between">
          {/* Left Controls */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-xl liquid-glass text-white hover:text-cyan-300 flex items-center justify-center transition-transform active:scale-95"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            {/* Seek Back 10s */}
            <button
              onClick={() => seekBy(-10)}
              className="p-2 text-slate-300 hover:text-white transition-colors"
              title="Rewind 10 seconds"
              aria-label="Rewind 10 seconds"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Seek Forward 10s */}
            <button
              onClick={() => seekBy(10)}
              className="p-2 text-slate-300 hover:text-white transition-colors"
              title="Forward 10 seconds"
              aria-label="Forward 10 seconds"
            >
              <FastForward className="w-4 h-4" />
            </button>

            {/* Next Episode Button */}
            {nextEpisode && onNextEpisode && (
              <button
                onClick={onNextEpisode}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg liquid-glass-subtle text-xs font-medium text-slate-200 hover:text-cyan-300 hover:border-cyan-500/30 transition-colors"
                title={`Next: ${nextEpisode.title}`}
              >
                <SkipForward className="w-3.5 h-3.5" />
                <span>Next Episode</span>
              </button>
            )}

            {/* Volume */}
            <div className="flex items-center gap-2 group/volume">
              <button
                onClick={toggleMute}
                className="p-2 text-slate-300 hover:text-white transition-colors"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeSlider}
                className="w-16 md:w-20 h-1 bg-slate-700/60 rounded appearance-none cursor-pointer accent-cyan-400"
                aria-label="Volume slider"
              />
            </div>

            {/* Timestamps */}
            <div className="font-mono text-xs text-slate-300 tabular-nums">
              <span>{formatTime(currentTime)}</span>
              <span className="mx-1 text-slate-500">/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 relative">
            {/* Speed Selector */}
            <div className="relative">
              <button
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="px-2.5 py-1 rounded-lg liquid-glass-subtle text-xs font-mono font-medium text-slate-300 hover:text-white hover:border-white/20 transition-colors"
                title="Playback Speed"
              >
                {playbackSpeed}x
              </button>
              {showSpeedMenu && (
                <div className="absolute bottom-10 right-0 w-28 liquid-glass rounded-xl border border-white/10 p-1 shadow-2xl flex flex-col gap-1 z-30">
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => setSpeed(speed)}
                      className={`px-3 py-1.5 text-xs text-left rounded-lg transition-colors flex items-center justify-between ${
                        playbackSpeed === speed ? 'bg-violet-600/40 text-cyan-300 font-semibold' : 'text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      <span>{speed}x</span>
                      {playbackSpeed === speed && <Check className="w-3 h-3 text-cyan-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quality Selector */}
            <div className="relative">
              <button
                onClick={() => setShowQualityMenu(!showQualityMenu)}
                className="p-2 text-slate-300 hover:text-white transition-colors"
                title="Streaming Quality"
                aria-label="Quality settings"
              >
                <Settings className="w-4 h-4" />
              </button>
              {showQualityMenu && (
                <div className="absolute bottom-10 right-0 w-44 liquid-glass rounded-xl border border-white/10 p-1.5 shadow-2xl flex flex-col gap-1 z-30">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 px-2 py-1">Resolution</span>
                  {['4K Ultra HD (HDR)', '1080p 60fps (High)', '720p (Data Saver)', 'Auto (Adaptive)'].map((q) => (
                    <button
                      key={q}
                      onClick={() => {
                        setSelectedQuality(q);
                        setShowQualityMenu(false);
                      }}
                      className={`px-2.5 py-1.5 text-xs text-left rounded-lg transition-colors flex items-center justify-between ${
                        selectedQuality === q ? 'bg-violet-600/40 text-cyan-300 font-semibold' : 'text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      <span className="truncate">{q}</span>
                      {selectedQuality === q && <Check className="w-3 h-3 text-cyan-400 shrink-0" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-2 text-slate-300 hover:text-white transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
