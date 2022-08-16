/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cdn.asaha.com'],
  },
  typescript: {
    ignoreBuildErrors: true
  }
}

module.exports = nextConfig
