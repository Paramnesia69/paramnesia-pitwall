/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.formula1.com',
        pathname: '/image/upload/**',
      },
    ],
  },
};

export default nextConfig;
