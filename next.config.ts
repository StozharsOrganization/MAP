import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
      // Add more trusted domains as needed:
      // { protocol: 'https', hostname: 'cdn.example.com' },
    ],
  },
};

export default nextConfig;
