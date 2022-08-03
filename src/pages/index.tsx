import Product from '../client/components/Products';
import { useState, useEffect } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import styles from '../client/styles/HomePage.module.css';
import { useProgram } from '../client/hooks/useProgram';

export default function HomePage() {
    const { publicKey } = useWallet();
    const [products, setProducts] = useState<any[]>([]);

    const { fetchCustomer, customer, program, addComic, createCustomer } = useProgram();

    useEffect(() => {
        if (program) {
            fetchCustomer();
        }
    }, [program]);

    const handleAdd = () => {
        createCustomer('Comic-1234');
    };

    console.log(customer);

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
            <div className={styles.container}>
                <header className={styles.headerContainer}>
                    <p className={styles.header}>🕸️ Solpay Comic Books Store 📖</p>
                    <p className={styles.subText}>accepting sols for comic books!</p>
                </header>
                <main>
                    <button style={{ background: 'green', height: '100px', width: '200px' }} onClick={handleAdd}>
                        Add a dummy comic
                    </button>
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
