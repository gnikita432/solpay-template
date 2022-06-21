import Products from "../components/Products";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-8 max-w-4xl items-stretch m-auto pt-24">
      <h1 className="text-6xl my-4 p-0 font-extrabold self-center text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-pink-600">SOLPAY TEMPLATE</h1>
      <Products></Products>
    </div>
  )
}