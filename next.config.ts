import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
  },
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Content-Security-Policy',
          value:
            "default-src 'self'; script-src 'self' 'unsafe-inline'; img-src 'self' https://images.pexels.com; media-src 'self' https://videos.pexels.com; frame-src 'self';",
        },
      ],
    },
  ],
}

export default nextConfig
