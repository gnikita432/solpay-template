import Products from "../components/Products";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'

export default function HomePage() {
  const { publicKey } = useWallet()
  return (
    <div className="flex flex-col gap-8 max-w-4xl items-stretch m-auto pt-24">
      <h1 className="text-6xl my-4 p-0 font-extrabold self-center text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-pink-600">SOLPAY TEMPLATE</h1>
      <div className="basis-1/4">
        <WalletMultiButton className='!bg-gray-900 hover:scale-105' />
      </div>
      <Products></Products>
    </div>
  )
}