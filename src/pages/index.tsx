import Product from '../client/components/Products'
import { useState , useEffect} from 'react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'
import styles from '../client/styles/HomePage.module.css'

export default function HomePage() {
  const { publicKey } = useWallet()
  const [products, setProducts] = useState<any[]>([]);

  // we need to refetch the products whenever the userchanges( publickey )
  useEffect(() => {
    if (publicKey) {
      fetch(`/api/fetchProducts`)
        .then(response => response.json())
        .then(data => {
          setProducts(data);
          console.log("Products", data);
        });
    }
  }, [publicKey]);


  const renderNotConnectedContainer = () => (
    <div className={styles.buttonContainer}>
      <WalletMultiButton
        className={styles.ctaButton && styles.connectWalletButton}
      />
    </div>
  )
  const renderItemBuyContainer = () => (
    <div className={styles.productsContainer}>
      {products.map((product) => (
        <Product key={product.id} product={product} />
      ))}
    </div>
  );
  return (
    <div className={styles.App}>
      <div className={styles.container}>
        <header className={styles.headerContainer}>
          <p className={styles.header}>🕸️ Solpay Comic Books Store 📖</p>
          <p className={styles.subText}>accepting sols for comic books!</p>
        </header>
        <main> 
          {publicKey ? renderItemBuyContainer() : renderNotConnectedContainer()}
        </main>
      </div>
    </div>
  )
}
