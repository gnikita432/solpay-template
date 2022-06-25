import Products from '../client/components/Products'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'
import styles from '../client/styles/HomePage.module.css'

export default function HomePage() {
  const { publicKey } = useWallet()

  const renderNotConnectedContainer = () => (
    <div className={styles.buttonContainer}>
      <WalletMultiButton
        className={styles.ctaButton && styles.connectWalletButton}
      />
    </div>
  )
  return (
    <div className={styles.App}>
      <div className={styles.container}>
        <header className={styles.headerContainer}>
          <p className={styles.header}>🕸️ Solpay Comic Books Store 📖</p>
          <p className={styles.subText}>accepting sols for comic books!</p>
        </header>
        <main> 
          {publicKey ? "show the books" : renderNotConnectedContainer()}
        </main>
      </div>
    </div>
  )
}
