import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, baseSepolia, hederaTestnet } from 'wagmi/chains'
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors'
import { createWeb3Modal } from '@web3modal/wagmi/react'

const WALLET_CONNECT_PROJECT_ID = import.meta.env.VITE_WC_PROJECT_ID

const metadata = {
  name: 'zero drive ',
  description: 'AppKit Example',
  url: 'https://reown.com/appkit', // origin must match your domain & subdomain
  icons: ['https://assets.reown.com/reown-profile-pic.png']
}

const chains = [mainnet, sepolia, baseSepolia, hederaTestnet] as const

export const initWeb3Modal = () => {
  createWeb3Modal({
    wagmiConfig: config,
    projectId: WALLET_CONNECT_PROJECT_ID,
    metadata
  });
};

export const config = createConfig({
  chains,
  connectors: [
    injected(),
    coinbaseWallet(),
    walletConnect({ projectId: WALLET_CONNECT_PROJECT_ID }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
