import Products from '../client/components/Products'

export default function HomePage() {
  return (
    <div className="m-auto flex max-w-4xl flex-col items-stretch gap-8 pt-24">
      <h1 className="my-4 self-center bg-gradient-to-r from-fuchsia-600 to-pink-600 bg-clip-text p-0 text-6xl font-extrabold text-transparent">
        SOLPAY TEMPLATE
      </h1>
      <Products></Products>
    </div>
  )
}
