import Products from '../client/components/Products'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'

export default function HomePage() {
  const { publicKey } = useWallet()
  return (
    <div className="m-auto flex max-w-4xl flex-col items-stretch gap-8 pt-24">
      <h1 className="my-4 self-center bg-gradient-to-r from-fuchsia-600 to-pink-600 bg-clip-text p-0 text-6xl font-extrabold text-transparent">
        SOLPAY TEMPLATE
      </h1>
      <div className="basis-1/4">
        <WalletMultiButton className="!bg-gray-900 hover:scale-105" />
      </div>
      <Products></Products>
    </div>
  )
}
