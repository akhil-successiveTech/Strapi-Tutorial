/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.unsplash.com"], // ✅ allow optimized external images
    formats: ["image/avif", "image/webp"], // ✅ modern formats
  },
  experimental: {
    optimizeCss: true, // ✅ reduce CSS blocking time
  },
  compress: true, // ✅ enable gzip compression
};

export default nextConfig;
