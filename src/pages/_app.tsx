import React, { useMemo, FC } from 'react';
import { AppProps, AppContext, default as NextApp } from 'next/app';
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
import { clusterApiUrl } from '@solana/web3.js';
import { AppInitialProps } from 'next/dist/shared/lib/utils';
import { GlobalProvider } from '../client/components/context/GlobalProvider';
import { ThemeProvider } from '../client/components/context/ThemeProvider';
import { paymentMethod } from '../client/types';
import '../client/styles/index.css';

interface CustomAppProps extends AppProps {
    host: string;
}

const App: FC<CustomAppProps> & { getInitialProps(appContext: AppContext): Promise<AppInitialProps> } = ({
    Component,
    pageProps,
    host,
}) => {
    const baseURL = `https://${host}`;
    const network = WalletAdapterNetwork.Devnet;
    const storeAddress = process.env.NEXT_PUBLIC_STORE_ADDRESS || '';
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);
    const link = useMemo(() => new URL(`${baseURL}/api/qrcode/`), [baseURL]);

    const wallets = [
        new PhantomWalletAdapter(),
        new GlowWalletAdapter(),
        new SlopeWalletAdapter(),
        new SolflareWalletAdapter({ network }),
        new TorusWalletAdapter(),
    ];

    return (
        <ThemeProvider>
            <ConnectionProvider endpoint={endpoint}>
                <WalletProvider wallets={wallets} autoConnect>
                    <WalletModalProvider>
                        <GlobalProvider
                            itemId=""
                            link={link}
                            paymentMethod={paymentMethod.QRCode}
                            storeAddress={storeAddress}
                        >
                            <Component {...pageProps} />
                        </GlobalProvider>
                    </WalletModalProvider>
                </WalletProvider>
            </ConnectionProvider>
        </ThemeProvider>
    );
};

App.getInitialProps = async (appContext) => {
    const props = await NextApp.getInitialProps(appContext);
    const { req } = appContext.ctx;
    const host = req?.headers.host || 'localhost:3000';

    return {
        ...props,
        host,
    };
};

export default App;
