import Product from '../client/components/Products';
import { useState, useEffect, useMemo } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import styles from '../client/styles/HomePage.module.css';
import { useProgram } from '../client/hooks/useProgram';
import { ClaimModal } from '../client/components/ClaimModal';

export default function HomePage() {
    const { publicKey } = useWallet();
    const [products, setProducts] = useState<any[]>([]);
    const { fetchCustomer, userComics, program } = useProgram();
    const [showClaimModal, setShowClaimModal] = useState<boolean>(false);

    useEffect(() => {
        if (program) {
            fetchCustomer();
        }
    }, [program]);
    console.log(userComics);
    //Refetch products on wallet change
    useEffect(() => {
        fetch(`/api/fetchProducts`)
            .then((response) => response.json())
            .then((data) => {
                setProducts(data);
            });
    }, [publicKey]);

    return (
        <div className={styles.App}>
            {showClaimModal && <ClaimModal hide={() => setShowClaimModal(false)} isShown={showClaimModal} />}
            <header className={styles.header}>
                <div className="ph-app-logo">
                    <span>S🕸️lpay Comics</span>
                </div>
                <div className={styles.appButtons}>
                    <WalletMultiButton className={styles.connectWalletButton} />
                    <button className={styles.claimButton} onClick={() => setShowClaimModal(true)}>
                        Claim
                    </button>
                </div>
            </header>
            <main className={styles.container}>
                <div className={styles.productsContainer}>
                    {products.map((product) => (
                        <Product paid={userComics.includes(product.id)} key={product.id} product={product} />
                    ))}
                </div>
            </main>
            <footer className={styles.appFooter}>
                <p>Accepting sols/usdc for comic books!</p>
            </footer>
        </div>
    );
}
