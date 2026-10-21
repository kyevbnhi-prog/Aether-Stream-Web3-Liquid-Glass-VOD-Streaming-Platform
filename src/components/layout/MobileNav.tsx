import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Film, Tv, Search, User } from 'lucide-react';

export const MobileNav: React.FC = () => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 liquid-glass border-t border-white/10 px-3 py-2 flex items-center justify-around">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
            isActive ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`
        }
      >
        <Home className="w-5 h-5" />
        <span>Home</span>
      </NavLink>

      <NavLink
        to="/movies"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
            isActive ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`
        }
      >
        <Film className="w-5 h-5" />
        <span>Movies</span>
      </NavLink>

      <NavLink
        to="/series"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
            isActive ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`
        }
      >
        <span className="text-base leading-5 font-bold tracking-tighter">S</span>
        <span>Series</span>
      </NavLink>

      <NavLink
        to="/live"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
            isActive ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`
        }
      >
        <Tv className="w-5 h-5" />
        <span>Live TV</span>
      </NavLink>

      <NavLink
        to="/search"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
            isActive ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`
        }
      >
        <Search className="w-5 h-5" />
        <span>Search</span>
      </NavLink>

      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
            isActive ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`
        }
      >
        <User className="w-5 h-5" />
        <span>Profile</span>
      </NavLink>
    </nav>
  );
};
