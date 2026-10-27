import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    'contact-starlight-licking.ngrok-free.dev',
    '*.ngrok-free.dev',
    '*.ngrok-free.app',
    '*.ngrok.app',
    '*.ngrok.io',
    'localhost:3000',
    '127.0.0.1:3000',
  ],
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
