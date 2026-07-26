import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Output standalone bundle for Docker/VPS deployment
  output: "standalone",

  // Enable React Strict Mode for catching issues
  reactStrictMode: true,

  // Enable Gzip/Brotli Compression
  compress: true,

  // Powered-by header removed for security
  poweredByHeader: false,

  // Image Optimization
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.jsdelivr.net" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "raw.githubusercontent.com" },
    ],
  },

  // Security Headers
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // DNS Prefetch — speed up external resource resolution
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          // HSTS — force HTTPS for 2 years with preload
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          // Clickjacking protection
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          // MIME sniffing protection
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // Referrer policy — send origin on cross-origin, full URL on same-origin
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Permissions Policy — restrict browser features
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          // XSS Protection (legacy browsers)
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          // Content Security Policy
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms https://checkout.razorpay.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: blob: https://images.unsplash.com https://lh3.googleusercontent.com https://*.google-analytics.com https://*.googletagmanager.com",
              "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://www.clarity.ms https://api.razorpay.com https://*.razorpay.com",
              "frame-src 'self' https://api.razorpay.com https://*.razorpay.com https://www.googletagmanager.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
        ],
      },
      // Cache static assets aggressively
      {
        source: "/(.*)\\.(ico|svg|png|jpg|jpeg|gif|webp|avif|woff|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Block search engine indexing of admin/dashboard/API routes
      {
        source: "/(admin|dashboard|api|login|register)(.*)",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
      },
    ];
  },

  // Redirects for URL normalization
  async redirects() {
    return [
      // Redirect trailing slashes
      {
        source: "/:path+/",
        destination: "/:path+",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
