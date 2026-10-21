import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Sparkles, Wallet, User, Search, Tv } from 'lucide-react';
import { shortenAddress } from '../../services/web3';
import { Web3WalletState } from '../../types/media';

interface NavbarProps {
  displayName: string;
  avatarUrl: string;
  walletState: Web3WalletState;
  onOpenWallet: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  displayName,
  avatarUrl,
  walletState,
  onOpenWallet,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full liquid-glass border-b border-white/10 px-4 md:px-8 py-3.5 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark */}
        <Link
          to="/"
          className="flex items-center gap-2.5 text-lg md:text-xl font-bold tracking-tight text-white whitespace-nowrap shrink-0 group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-cyan-400 p-[1px] shadow-lg shadow-violet-500/20 group-hover:shadow-cyan-400/30 transition-shadow">
            <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cyan-300" />
            </div>
          </div>
          <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
            Aether<span className="text-violet-400 font-extrabold ml-1">Stream</span>
          </span>
        </Link>

        {/* Zone 2: Navigation Links (single line, clean typography) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `whitespace-nowrap shrink-0 transition-colors py-1 ${
                isActive ? 'text-white border-b-2 border-cyan-400 font-semibold' : 'hover:text-white'
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/movies"
            className={({ isActive }) =>
              `whitespace-nowrap shrink-0 transition-colors py-1 ${
                isActive ? 'text-white border-b-2 border-cyan-400 font-semibold' : 'hover:text-white'
              }`
            }
          >
            Movies
          </NavLink>
          <NavLink
            to="/series"
            className={({ isActive }) =>
              `whitespace-nowrap shrink-0 transition-colors py-1 ${
                isActive ? 'text-white border-b-2 border-cyan-400 font-semibold' : 'hover:text-white'
              }`
            }
          >
            Series
          </NavLink>
          <NavLink
            to="/live"
            className={({ isActive }) =>
              `whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
                isActive ? 'text-white border-b-2 border-cyan-400 font-semibold' : 'hover:text-white'
              }`
            }
          >
            <Tv className="w-3.5 h-3.5 text-cyan-400" />
            <span>Live TV</span>
          </NavLink>
          <NavLink
            to="/search"
            className={({ isActive }) =>
              `whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
                isActive ? 'text-white border-b-2 border-cyan-400 font-semibold' : 'hover:text-white'
              }`
            }
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
          </NavLink>
        </nav>

        {/* Zone 3: Primary Action Area (Web3 Wallet & Profile) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Web3 Wallet Button */}
          <button
            onClick={onOpenWallet}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              walletState.isConnected
                ? 'bg-violet-950/40 border-violet-500/40 text-violet-200 hover:border-violet-400 shadow-sm shadow-violet-500/20'
                : 'liquid-glass-subtle border-white/10 text-slate-300 hover:text-white hover:border-white/20'
            }`}
            title={walletState.isConnected ? walletState.networkName : 'Connect Web3 Wallet'}
          >
            <Wallet className={`w-3.5 h-3.5 ${walletState.isConnected ? 'text-cyan-400' : 'text-slate-400'}`} />
            <span className="hidden sm:inline whitespace-nowrap">
              {walletState.isConnected
                ? shortenAddress(walletState.address)
                : 'Web3 Pass'}
            </span>
            {walletState.tier !== 'None' && (
              <span className="hidden lg:inline text-[10px] uppercase font-bold text-cyan-300 tracking-wider">
                [{walletState.tier}]
              </span>
            )}
          </button>

          {/* User Profile Shortcut */}
          <Link
            to="/profile"
            className="flex items-center gap-2.5 p-1 rounded-full liquid-glass-subtle border border-white/10 hover:border-violet-500/50 transition-colors group"
            title="Your Profile"
          >
            <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-800 border border-white/20">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName || 'User'}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
            <span className="hidden xl:inline text-xs font-medium text-slate-200 group-hover:text-white pr-2 max-w-[120px] truncate">
              {displayName || 'Guest'}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};
