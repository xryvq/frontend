import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { arbitrumSepolia} from 'viem/chains';
export const config = getDefaultConfig({
  appName: 'Levra',
  projectId: process.env.WALLET_CONNECT_PROJECT_ID || 'batch4',
  chains: [arbitrumSepolia],
  ssr: true,
});