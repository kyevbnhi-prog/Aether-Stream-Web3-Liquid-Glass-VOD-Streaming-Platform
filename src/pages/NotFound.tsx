import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass, Film } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 max-w-md mx-auto">
      <div className="w-16 h-16 rounded-2xl liquid-glass border border-white/10 flex items-center justify-center text-cyan-400 mb-6 shadow-2xl">
        <Compass className="w-8 h-8 animate-spin" style={{ animationDuration: '10s' }} />
      </div>

      <span className="text-xs font-mono font-bold text-violet-400 tracking-wider uppercase mb-1">
        Error 404 · Signal Lost
      </span>
      <h1 className="text-3xl font-extrabold text-white tracking-tight mb-3">
        Frequency Outside Orbit
      </h1>
      <p className="text-xs text-slate-400 leading-relaxed mb-6">
        The channel or broadcast sector you requested has decayed or does not exist in the Aether network catalog.
      </p>

      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-semibold hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-600/30 flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>Return to Theater</span>
        </Link>
        <Link
          to="/search"
          className="px-5 py-2.5 rounded-xl liquid-glass text-white hover:text-cyan-300 text-xs font-medium"
        >
          Search Catalog
        </Link>
      </div>
    </div>
  );
};
