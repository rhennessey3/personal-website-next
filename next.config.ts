import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/images/**', // Allow images from any Sanity project/dataset
      },
    ],
  },
  /* other config options if any */
};

export default nextConfig;
