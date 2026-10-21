import React, { useState } from 'react';
import { X, Wallet, ShieldCheck, Check, Copy, ExternalLink, Zap, AlertCircle } from 'lucide-react';
import { Web3WalletState, Web3VipTier } from '../../types/media';
import { web3Service, shortenAddress, SUPPORTED_NETWORKS } from '../../services/web3';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletState: Web3WalletState;
  onUpdateWallet: (state: Web3WalletState) => void;
  onShowToast: (msg: string) => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  walletState,
  onUpdateWallet,
  onShowToast,
}) => {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (walletState.address) {
      navigator.clipboard.writeText(walletState.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onShowToast('Wallet address copied to clipboard');
    }
  };

  const handleConnectInjected = async () => {
    setLoading(true);
    setError(null);
    const result = await web3Service.connectInjected();
    setLoading(false);

    if (result.success && result.state) {
      onUpdateWallet(result.state);
      onShowToast(`Connected wallet: ${shortenAddress(result.state.address)} (${result.state.tier})`);
      onClose();
    } else {
      setError(result.error || 'Connection failed.');
    }
  };

  const handleConnectDemo = () => {
    const demoState = web3Service.connectDemo();
    onUpdateWallet(demoState);
    onShowToast('Connected Obsidian VIP Demo Wallet on Base');
    onClose();
  };

  const handleDisconnect = () => {
    onUpdateWallet({
      isConnected: false,
      address: null,
      chainId: null,
      networkName: 'Not Connected',
      tier: 'None',
      balanceEth: '0.00',
      vipPassTokenId: null,
      isDemo: false,
    });
    onShowToast('Web3 wallet disconnected');
    onClose();
  };

  const handleSwitchNetwork = async (chainId: number) => {
    if (walletState.isDemo) {
      onUpdateWallet({
        ...walletState,
        chainId,
        networkName: SUPPORTED_NETWORKS[chainId] || `Chain ${chainId}`,
      });
      onShowToast(`Switched network to ${SUPPORTED_NETWORKS[chainId]}`);
      return;
    }

    const ok = await web3Service.switchNetwork(chainId);
    if (ok) {
      onShowToast(`Switched network to ${SUPPORTED_NETWORKS[chainId]}`);
    } else {
      setError('Could not switch network automatically. Please switch in your wallet.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md liquid-glass rounded-2xl border border-white/10 p-6 shadow-2xl overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-violet-500/20 border border-violet-400/30 flex items-center justify-center text-violet-300">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Web3 VIP Access Pass</h3>
              <p className="text-xs text-slate-400">Decentralized streaming privileges & perks</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg liquid-glass-subtle flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error notice */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Connected state */}
        {walletState.isConnected ? (
          <div className="space-y-4 relative z-10">
            {/* Status Card */}
            <div className="p-4 rounded-xl liquid-glass-subtle border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Connected Account</span>
                <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
                  {walletState.isDemo ? 'Demo Mode' : 'Injected'}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-white/5">
                <span className="font-mono text-xs text-slate-200">
                  {shortenAddress(walletState.address)}
                </span>
                <button
                  onClick={handleCopy}
                  className="p-1.5 hover:text-cyan-400 text-slate-400 transition-colors rounded"
                  title="Copy address"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                <div className="bg-slate-900/40 p-2.5 rounded-lg border border-white/5">
                  <span className="text-slate-400 text-[11px] block">VIP Tier Status</span>
                  <span className="font-semibold text-violet-300 flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    {walletState.tier}
                  </span>
                </div>
                <div className="bg-slate-900/40 p-2.5 rounded-lg border border-white/5">
                  <span className="text-slate-400 text-[11px] block">Pass Token ID</span>
                  <span className="font-mono font-medium text-slate-200 mt-0.5 block">
                    {walletState.vipPassTokenId || '#STANDARD'}
                  </span>
                </div>
              </div>
            </div>

            {/* Network Selector */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                Active Blockchain Network
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(SUPPORTED_NETWORKS).slice(0, 4).map(([id, name]) => {
                  const numId = parseInt(id, 10);
                  const isCurrent = walletState.chainId === numId;
                  return (
                    <button
                      key={id}
                      onClick={() => handleSwitchNetwork(numId)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium text-left border transition-all ${
                        isCurrent
                          ? 'bg-violet-600/30 border-violet-400/50 text-white font-semibold shadow-sm'
                          : 'liquid-glass-subtle border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/10'
                      }`}
                    >
                      <span className="block truncate">{name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* VIP Perks List */}
            <div className="p-3 rounded-xl bg-violet-950/20 border border-violet-500/20 text-xs space-y-1.5 text-slate-300">
              <span className="font-semibold text-violet-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400" /> Active Member Privileges:
              </span>
              <p className="text-[11px] text-slate-400">
                • 4K HDR Ultra-high bitrate uncapped streaming
              </p>
              <p className="text-[11px] text-slate-400">
                • Priority access to live premieres and backstage Q&A
              </p>
              <p className="text-[11px] text-slate-400">
                • Zero ad interruptions across all catalog titles
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleDisconnect}
                className="w-full py-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 text-xs font-semibold transition-colors"
              >
                Disconnect Wallet
              </button>
            </div>
          </div>
        ) : (
          /* Disconnected State */
          <div className="space-y-4 relative z-10">
            <p className="text-xs text-slate-300 leading-relaxed">
              Connect your Ethereum-compatible wallet (MetaMask, Coinbase Wallet, Brave) or try the simulated demo wallet to unlock exclusive VIP badge tiers and member streaming perks.
            </p>

            <div className="space-y-2">
              <button
                onClick={handleConnectInjected}
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-violet-600/30 transition-all disabled:opacity-50"
              >
                <Wallet className="w-4 h-4" />
                <span>{loading ? 'Connecting...' : 'Connect Injected Browser Wallet'}</span>
              </button>

              <button
                onClick={handleConnectDemo}
                className="w-full py-2.5 px-4 rounded-xl liquid-glass-subtle border border-cyan-500/30 text-cyan-300 hover:bg-cyan-950/30 hover:border-cyan-400 text-xs font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>Try Demo Obsidian VIP Wallet (No Extension Needed)</span>
              </button>
            </div>

            <div className="pt-2 border-t border-white/5 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Non-custodial & Read-only</span>
              <span className="text-slate-500">EIP-1193 Standard</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
