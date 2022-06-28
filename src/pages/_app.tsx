import '../client/styles/globals.css';
import type { AppProps } from 'next/app';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
    GlowWalletAdapter,
    PhantomWalletAdapter,
    SlopeWalletAdapter,
    SolflareWalletAdapter,
    TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { GlobalProvider } from '../client/components/context/GlobalProvider';
// Default styles for wallet adapter
require('@solana/wallet-adapter-react-ui/styles.css');

function MyApp({ Component, pageProps }: AppProps) {
    const network = WalletAdapterNetwork.Devnet;
    const endpoint = process.env.NEXT_PUBLIC_CLUSTER_ENDPOINT || '';

    const wallets = [
        new PhantomWalletAdapter(),
        new GlowWalletAdapter(),
        new SlopeWalletAdapter(),
        new SolflareWalletAdapter({ network }),
        new TorusWalletAdapter(),
    ];

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <GlobalProvider itemId="" paymentMethod="Wallet">
                        <Component {...pageProps} />
                    </GlobalProvider>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}

export default MyApp;
