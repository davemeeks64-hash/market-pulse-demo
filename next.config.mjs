/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    turboMode: true, // ✅ use correct key, not 'turbo'
  },
};

export default nextConfig;
