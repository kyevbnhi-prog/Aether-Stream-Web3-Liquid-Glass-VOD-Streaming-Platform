import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { MobileNav } from './components/layout/MobileNav';
import { Footer } from './components/layout/Footer';
import { WalletModal } from './components/web3/WalletModal';

// Pages
import { EnterName } from './pages/EnterName';
import { Home } from './pages/Home';
import { Movies } from './pages/Movies';
import { Series } from './pages/Series';
import { LiveTV } from './pages/LiveTV';
import { Search } from './pages/Search';
import { Profile } from './pages/Profile';
import { Details } from './pages/Details';
import { Player } from './pages/Player';
import { NotFound } from './pages/NotFound';

// Services & Types
import { storageService } from './services/storage';
import { INITIAL_WEB3_STATE } from './services/web3';
import { UserProfile, WatchHistoryEntry, Web3WalletState } from './types/media';
import { CheckCircle2, Info } from 'lucide-react';

const AppContent: React.FC = () => {
  const location = useLocation();

  // App States
  const [userProfile, setUserProfile] = useState<UserProfile>(() => storageService.getProfile());
  const [watchlist, setWatchlist] = useState<string[]>(() => storageService.getWatchlist());
  const [watchHistory, setWatchHistory] = useState<WatchHistoryEntry[]>(() => storageService.getWatchHistory());
  const [walletState, setWalletState] = useState<Web3WalletState>(INITIAL_WEB3_STATE);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto hide toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  };

  // Profile actions
  const handleSaveName = (name: string) => {
    const updated = storageService.saveProfile({ displayName: name });
    setUserProfile(updated);
  };

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    const next = storageService.saveProfile(updated);
    setUserProfile(next);
  };

  // Watchlist actions
  const handleToggleWatchlist = (id: string) => {
    const isAdded = storageService.toggleWatchlist(id);
    setWatchlist(storageService.getWatchlist());
    showToast(isAdded ? 'Added to My List' : 'Removed from My List');
  };

  // History & Progress actions
  const handleSaveProgress = (
    mediaId: string,
    progress: number,
    duration: number,
    episodeId?: string
  ) => {
    storageService.saveProgress({
      mediaId,
      episodeId,
      title: 'Current Playback',
      posterUrl: '/src/assets/images/hero_cyber_cinema_1792544113059.jpg',
      type: episodeId ? 'series' : 'movie',
      progressSeconds: Math.floor(progress),
      durationSeconds: Math.floor(duration),
      completed: progress >= duration * 0.95,
    });
    setWatchHistory(storageService.getWatchHistory());
  };

  const handleRemoveHistory = (mediaId: string, episodeId?: string) => {
    const updated = storageService.removeFromHistory(mediaId, episodeId);
    setWatchHistory(updated);
    showToast('Removed from watch history');
  };

  const handleClearAllData = () => {
    storageService.clearAllData();
    setUserProfile(storageService.getProfile());
    setWatchlist([]);
    setWatchHistory([]);
    setWalletState(INITIAL_WEB3_STATE);
  };

  // Listen to external window.ethereum accounts/chain changes if present
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum && window.ethereum.on) {
      const handleAccountsChanged = (accounts: unknown) => {
        const accs = accounts as string[];
        if (!accs || accs.length === 0) {
          setWalletState(INITIAL_WEB3_STATE);
          showToast('Wallet disconnected from browser');
        } else {
          setWalletState((prev) => ({
            ...prev,
            address: accs[0],
            isConnected: true,
          }));
          showToast('Active wallet account switched');
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        if (window.ethereum?.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, []);

  // Determine whether to hide Top Bar and Footer (e.g. full immersion video player)
  const isPlayerView = location.pathname.startsWith('/player');
  const isEnterNameView = location.pathname === '/enter-name';

  return (
    <div className="min-h-screen bg-[#080a10] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Bar Navigation (Hidden in full player & initial enter-name screen) */}
      {!isPlayerView && !isEnterNameView && (
        <Navbar
          displayName={userProfile.displayName}
          avatarUrl={userProfile.avatarUrl}
          walletState={walletState}
          onOpenWallet={() => setIsWalletModalOpen(true)}
        />
      )}

      {/* Main Viewport Content */}
      <main className="flex-1 w-full">
        <Routes>
          <Route
            path="/enter-name"
            element={
              <EnterName
                currentName={userProfile.displayName}
                onSaveName={handleSaveName}
                onShowToast={showToast}
              />
            }
          />
          <Route
            path="/"
            element={
              !userProfile.displayName ? (
                <Navigate to="/enter-name" replace />
              ) : (
                <Home
                  userProfile={userProfile}
                  watchlist={watchlist}
                  onToggleWatchlist={handleToggleWatchlist}
                  watchHistory={watchHistory}
                  getProgress={(id) => storageService.getProgress(id)}
                />
              )
            }
          />
          <Route
            path="/movies"
            element={
              <Movies
                watchlist={watchlist}
                onToggleWatchlist={handleToggleWatchlist}
                getProgress={(id) => storageService.getProgress(id)}
              />
            }
          />
          <Route
            path="/series"
            element={
              <Series
                watchlist={watchlist}
                onToggleWatchlist={handleToggleWatchlist}
                getProgress={(id) => storageService.getProgress(id)}
              />
            }
          />
          <Route path="/live" element={<LiveTV />} />
          <Route
            path="/search"
            element={
              <Search
                watchlist={watchlist}
                onToggleWatchlist={handleToggleWatchlist}
                getProgress={(id) => storageService.getProgress(id)}
              />
            }
          />
          <Route
            path="/profile"
            element={
              <Profile
                userProfile={userProfile}
                onUpdateProfile={handleUpdateProfile}
                watchlist={watchlist}
                onToggleWatchlist={handleToggleWatchlist}
                watchHistory={watchHistory}
                onRemoveHistory={handleRemoveHistory}
                walletState={walletState}
                onOpenWallet={() => setIsWalletModalOpen(true)}
                onClearAllData={handleClearAllData}
                onShowToast={showToast}
              />
            }
          />
          <Route
            path="/details/:id"
            element={
              <Details
                watchlist={watchlist}
                onToggleWatchlist={handleToggleWatchlist}
                getProgress={(id, ep) => storageService.getProgress(id, ep)}
              />
            }
          />
          <Route
            path="/player/:id"
            element={
              <Player
                onSaveProgress={handleSaveProgress}
                getProgress={(id, ep) => storageService.getProgress(id, ep)}
              />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Footer (Hidden in player & enter-name) */}
      {!isPlayerView && !isEnterNameView && <Footer />}

      {/* Mobile Bottom Navigation Bar (Hidden in player & enter-name) */}
      {!isPlayerView && !isEnterNameView && <MobileNav />}

      {/* Web3 Wallet Access Modal */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        walletState={walletState}
        onUpdateWallet={setWalletState}
        onShowToast={showToast}
      />

      {/* Global Liquid Glass Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50 liquid-glass rounded-xl px-4 py-3 border border-cyan-400/30 text-xs font-semibold text-white shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
