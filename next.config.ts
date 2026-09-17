import type { NextConfig } from 'next';

const rawBackendUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.BACKEND_URL ||
  'http://localhost:5001';

// Normalize URL: remove any trailing slashes and trailing /api/v1 to prevent malformed proxy paths
const BACKEND_URL = rawBackendUrl
  .replace(/\/api\/v1\/?$/, '')
  .replace(/\/+$/, '');

const nextConfig: NextConfig = {
  // Proxy API requests to external Nest.js backend
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${BACKEND_URL}/api/v1/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
    ],
  },
};

export default nextConfig;
