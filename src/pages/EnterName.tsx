import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Shield, Film, User, CheckCircle2 } from 'lucide-react';
import { HERO_ASSET, AVATAR_ASSET } from '../data/catalog';
import { storageService } from '../services/storage';

interface EnterNameProps {
  currentName: string;
  onSaveName: (name: string) => void;
  onShowToast: (msg: string) => void;
}

export const EnterName: React.FC<EnterNameProps> = ({
  currentName,
  onSaveName,
  onShowToast,
}) => {
  const [name, setName] = useState(currentName || '');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Please enter a display name to continue.');
      return;
    }
    if (trimmed.length < 2) {
      setError('Name must be at least 2 characters.');
      return;
    }

    onSaveName(trimmed);
    onShowToast(`Welcome to Aether Stream, ${trimmed}!`);
    navigate('/');
  };

  const handleGuestContinue = () => {
    const guestName = 'Cyber Voyager';
    onSaveName(guestName);
    onShowToast('Entering as Cyber Voyager (Guest)');
    navigate('/');
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden bg-slate-950">
      {/* Background Cinematic Image with Blur and Radial Vignette */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_ASSET}
          alt="Cinematic Backdrop"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover scale-105 filter blur-sm opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(8,10,16,0.9)_80%)]" />
      </div>

      {/* Ambient Lighting Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Glass Panel */}
      <div className="relative z-10 w-full max-w-lg liquid-glass rounded-3xl p-8 sm:p-10 border border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
        {/* Brand Lockup */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-400 p-[2px] mb-4 shadow-xl shadow-violet-600/30">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-cyan-300" />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Welcome to Aether<span className="text-violet-400">Stream</span>
          </h1>
          <p className="text-sm text-slate-300 max-w-sm leading-relaxed">
            The next-generation liquid-glass streaming portal for cinema, episodic originals, and live decentralized television.
          </p>
        </div>

        {/* Name Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="displayName" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Choose Your Screen Alias
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="displayName"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                placeholder="e.g. NeoRider, Vance, Cypher"
                maxLength={30}
                autoFocus
                className="w-full pl-10 pr-4 py-3.5 rounded-xl liquid-glass-subtle border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
              />
            </div>
            {error && <p className="text-xs text-rose-400 mt-2 font-medium">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-semibold text-sm shadow-xl shadow-violet-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 group"
          >
            <span>Enter Theater Experience</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleGuestContinue}
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              Continue as Guest
            </button>
            <span className="text-xs text-slate-500 font-mono">Instant Local Persistence</span>
          </div>
        </form>

        {/* Feature Badges */}
        <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-2 gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>4K HDR Video Playback</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
            <span>Optional Web3 VIP Passes</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Saved Progress & History</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
            <span>Zero Tracking or Ads</span>
          </div>
        </div>
      </div>
    </div>
  );
};
