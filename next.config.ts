import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),

  // ── 11. Page Load Speed ──────────────────────────────────────────────────
  compress: true,

  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ── 11. Cache-Control headers for static assets ──────────────────────────
  async headers() {
    return [
      {
        // Long-lived cache for all static Next.js assets (immutable hashes)
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache public images for 7 days
        source: '/(:path*).png',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' }],
      },
      {
        source: '/(:path*).svg',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' }],
      },
      {
        source: '/(:path*).ico',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' }],
      },
      {
        source: '/(:path*).webp',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' }],
      },
      {
        // ── 4. Security Headers for all pages ───────────────────────────
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https:",
              "connect-src 'self' https://www.google-analytics.com https://*.supabase.co",
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
    ];
  },

  // ── URL rewrite for "from-to" SEO friendly slug pattern ─────────────────
  async rewrites() {
    return [
      // Handle root-level "mankundu-to-howrah" short URL: banglarail.in/hwh-to-mku
      {
        source: '/:from([a-zA-Z0-9]+)-to-:to([a-zA-Z0-9]+)',
        destination: '/trains-between/:from-to-:to',
      },
      // Handle slash-separated URLs: /trains-between/HWH/MKU
      {
        source: '/trains-between/:from([a-zA-Z0-9]+)/:to([a-zA-Z0-9]+)',
        destination: '/trains-between/:from-to-:to',
      },
    ];
  },
};

export default nextConfig;
