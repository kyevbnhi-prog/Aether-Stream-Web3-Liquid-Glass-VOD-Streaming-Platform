import { Web3WalletState, Web3VipTier } from '../types/media';

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (request: { method: string; params?: Array<unknown> | Record<string, unknown> }) => Promise<unknown>;
      on: (eventName: string, handler: (...args: unknown[]) => void) => void;
      removeListener: (eventName: string, handler: (...args: unknown[]) => void) => void;
    };
  }
}

export const SUPPORTED_NETWORKS: Record<number, string> = {
  1: 'Ethereum Mainnet',
  42161: 'Arbitrum One',
  137: 'Polygon',
  8453: 'Base',
  11155111: 'Sepolia Testnet',
};

export const INITIAL_WEB3_STATE: Web3WalletState = {
  isConnected: false,
  address: null,
  chainId: null,
  networkName: 'Not Connected',
  tier: 'None',
  balanceEth: '0.00',
  vipPassTokenId: null,
  isDemo: false,
};

export function shortenAddress(address: string | null): string {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

export function calculateVipTier(address: string | null): Web3VipTier {
  if (!address) return 'None';
  // Deterministic tier based on last hex digit for demo consistency
  const lastChar = address.slice(-1).toLowerCase();
  if (['a', 'b', 'c', '7', '8', '9'].includes(lastChar)) {
    return 'Obsidian VIP';
  }
  return 'Cyber Pass';
}

export const web3Service = {
  isWalletAvailable(): boolean {
    return typeof window !== 'undefined' && Boolean(window.ethereum);
  },

  async connectInjected(): Promise<{ success: boolean; state?: Web3WalletState; error?: string }> {
    if (!this.isWalletAvailable() || !window.ethereum) {
      return {
        success: false,
        error: 'No Web3 wallet detected. You can activate Demo Mode to explore VIP streaming perks!',
      };
    }

    try {
      const accounts = (await window.ethereum.request({
        method: 'eth_requestAccounts',
      })) as string[];

      if (!accounts || accounts.length === 0) {
        return { success: false, error: 'No Ethereum accounts returned.' };
      }

      const address = accounts[0];
      const chainIdHex = (await window.ethereum.request({ method: 'eth_chainId' })) as string;
      const chainId = parseInt(chainIdHex, 16);
      const networkName = SUPPORTED_NETWORKS[chainId] || `Chain ${chainId}`;

      let balanceEth = '1.84';
      try {
        const balanceHex = (await window.ethereum.request({
          method: 'eth_getBalance',
          params: [address, 'latest'],
        })) as string;
        const wei = parseInt(balanceHex, 16);
        balanceEth = (wei / 1e18).toFixed(3);
      } catch {
        // Fallback balance
      }

      const tier = calculateVipTier(address);
      const vipPassTokenId = `#${address.slice(2, 6).toUpperCase()}`;

      const state: Web3WalletState = {
        isConnected: true,
        address,
        chainId,
        networkName,
        tier,
        balanceEth,
        vipPassTokenId,
        isDemo: false,
      };

      return { success: true, state };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'User rejected the wallet connection.';
      return { success: false, error: errorMsg };
    }
  },

  connectDemo(): Web3WalletState {
    const demoAddress = '0x71C...AetherVIP';
    return {
      isConnected: true,
      address: '0x71C95911E9A5D330f4D621842EC243EE1343292e',
      chainId: 8453,
      networkName: 'Base (Demo Mode)',
      tier: 'Obsidian VIP',
      balanceEth: '4.25',
      vipPassTokenId: '#VIP-089',
      isDemo: true,
    };
  },

  async switchNetwork(chainId: number): Promise<boolean> {
    if (!window.ethereum) return false;
    try {
      const hexChainId = `0x${chainId.toString(16)}`;
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: hexChainId }],
      });
      return true;
    } catch {
      return false;
    }
  },
};
