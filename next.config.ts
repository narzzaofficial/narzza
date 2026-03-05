import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
    remotePatterns: [
      // DigitalOcean Spaces (uploaded images)
      { protocol: "https", hostname: "*.digitaloceanspaces.com" },
      // Placeholder images (fallback data)
      { protocol: "https", hostname: "picsum.photos" },
      // Clerk user avatars
      { protocol: "https", hostname: "img.clerk.com" },
    ],
  },
  async headers() {
    return [
      {
        // Security headers for all routes
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Content-Security-Policy-Report-Only",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://clerk.narzza.studio https://*.clerk.accounts.dev https://challenges.cloudflare.com https://www.youtube.com https://s.ytimg.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",

              "img-src 'self' data: blob: https://*.digitaloceanspaces.com https://picsum.photos https://img.clerk.com https://i.ytimg.com https://*.ytimg.com",

              "connect-src 'self' https://*.clerk.accounts.dev https://*.digitaloceanspaces.com https://www.youtube.com https://youtube.com",

              "frame-src https://challenges.cloudflare.com https://accounts.clerk.dev https://www.youtube.com https://www.youtube-nocookie.com",

              "worker-src 'self' blob:",
            ].join("; "),
          },
        ],
      },
      {
        // Static assets: cache 1 year
        source:
          "/:path*\\.(js|css|woff2|woff|ttf|ico|svg|png|jpg|jpeg|webp|avif)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
