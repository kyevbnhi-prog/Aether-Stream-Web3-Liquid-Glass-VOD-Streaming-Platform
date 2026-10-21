import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, Film, Tv, Radio } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-white/5 bg-slate-950/80 backdrop-blur-xl mt-20 pt-12 pb-24 md:pb-12 px-4 md:px-8 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {/* Brand column */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-violet-600 to-cyan-400 p-[1px]">
              <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              </div>
            </div>
            <span>Aether<span className="text-violet-400">Stream</span></span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            The next-generation liquid-glass video-on-demand and real-time broadcasting network. Powered by client-authoritative state and optional Web3 VIP privileges.
          </p>
          <div className="flex items-center gap-3 text-xs text-cyan-400/80 font-mono">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" /> High-Bitrate 4K
            </span>
            <span aria-hidden="true">·</span>
            <span>Zero Slop</span>
          </div>
        </div>

        {/* Discovery Links */}
        <div>
          <h4 className="text-xs uppercase font-semibold text-slate-200 tracking-wider mb-3">Discovery</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/movies" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                <Film className="w-3 h-3 text-slate-500" /> Feature Films
              </Link>
            </li>
            <li>
              <Link to="/series" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                <Tv className="w-3 h-3 text-slate-500" /> Episodic Series
              </Link>
            </li>
            <li>
              <Link to="/live" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-slate-500" /> Live Television Guide
              </Link>
            </li>
            <li>
              <Link to="/search" className="hover:text-cyan-400 transition-colors">
                Deep Catalog Search
              </Link>
            </li>
          </ul>
        </div>

        {/* Web3 & Ecosystem */}
        <div>
          <h4 className="text-xs uppercase font-semibold text-slate-200 tracking-wider mb-3">Web3 Privileges</h4>
          <ul className="space-y-2 text-xs">
            <li className="text-slate-400">Cyber Pass Tiers</li>
            <li className="text-slate-400">Obsidian VIP Backstage</li>
            <li className="text-slate-400">Decentralized Storage Resolvers</li>
            <li className="text-slate-400">EIP-1193 Standard Wallets</li>
          </ul>
        </div>

        {/* Platform & Storage */}
        <div>
          <h4 className="text-xs uppercase font-semibold text-slate-200 tracking-wider mb-3">Account & Safety</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/profile" className="hover:text-cyan-400 transition-colors">
                Profile Settings & Data
              </Link>
            </li>
            <li>
              <Link to="/enter-name" className="hover:text-cyan-400 transition-colors">
                Switch Display Name
              </Link>
            </li>
            <li className="text-slate-500">Local-First Storage Shield</li>
            <li className="text-slate-500">WCAG AA Compliant Player</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>© 2026 Aether Stream. All rights reserved. Open-source demo cinema assets licensed under Creative Commons.</p>
        <p className="font-mono text-[11px] text-slate-500">VOD-V3.8 // LIQUID GLASS ARCHITECTURE</p>
      </div>
    </footer>
  );
};
