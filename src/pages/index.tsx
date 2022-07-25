import Product from '../client/components/Products';
import { useState, useEffect } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import styles from '../client/styles/HomePage.module.css';

export default function HomePage() {
    const { publicKey } = useWallet();
    const [products, setProducts] = useState<any[]>([]);

    //Refetch products on wallet change
    useEffect(() => {
        fetch(`/api/fetchProducts`)
            .then((response) => response.json())
            .then((data) => {
                setProducts(data);
                console.log('Products', data);
            });
    }, [publicKey]);

    return (
        <div className={styles.App}>
            <div className={styles.container}>
                <header className={styles.headerContainer}>
                    <p className={styles.header}>🕸️ Solpay Comic Books Store 📖</p>
                    <p className={styles.subText}>accepting sols for comic books!</p>
                </header>
                <main>
                    <div className={styles.walletButton}>
                        <WalletMultiButton className={styles.ctaButton && styles.connectWalletButton} />
                    </div>
                    <div className={styles.productsContainer}>
                        {products.map((product) => (
                            <Product key={product.id} product={product} />
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}
