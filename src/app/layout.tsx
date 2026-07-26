import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { GlobalUIProvider } from "@/components/GlobalUIContext";
import { GlobalUIWrapper } from "@/components/GlobalUIWrapper";
import { Analytics } from "@/components/Analytics";
import { SITE_CONFIG } from "@/lib/constants";
import { generateOrganizationSchema, generateWebSiteSchema } from "@/lib/schemas";

// ─── Fonts (loaded via next/font for zero CLS) ─────────────
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

// ─── Viewport Configuration ────────────────────────────────
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: SITE_CONFIG.colors.background },
    { media: "(prefers-color-scheme: dark)", color: SITE_CONFIG.colors.primary },
  ],
};

// ─── Global Metadata ───────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),

  title: {
    default: `${SITE_CONFIG.name} — Engineering & Product Development`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,

  keywords: [
    "product engineering",
    "embedded systems",
    "PCB design",
    "IoT development",
    "mechanical design",
    "CAD prototyping",
    "software development",
    "AI solutions",
    "robotics",
    "hardware engineering",
    "Creato4 Lab",
    "engineering company India",
    "product development Gujarat",
  ],

  authors: [{ name: SITE_CONFIG.name, url: SITE_CONFIG.url }],
  creator: SITE_CONFIG.name,
  publisher: SITE_CONFIG.name,

  // ─── Robots ────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ─── Open Graph ────────────────────────────────────────
  openGraph: {
    type: "website",
    locale: SITE_CONFIG.locale,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: `${SITE_CONFIG.name} — Engineering & Product Development`,
    description: SITE_CONFIG.shortDescription,
    images: [
      {
        url: "/creato4-full-brand.png",
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.name} — Design · Engineer · Build`,
      },
    ],
  },

  // ─── Twitter Card ──────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.name} — Engineering & Product Development`,
    description: SITE_CONFIG.shortDescription,
    images: ["/creato4-full-brand.png"],
    creator: "@creato4lab",
  },

  // ─── Icons & Manifest ─────────────────────────────────
  icons: {
    icon: [
      { url: "/icon.jpg", type: "image/jpeg" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/creato4-full-brand.png", sizes: "180x180" },
    ],
  },
  manifest: "/manifest.webmanifest",

  // ─── Verification ─────────────────────────────────────
  ...(SITE_CONFIG.analytics.googleSearchConsoleVerification && {
    verification: {
      google: SITE_CONFIG.analytics.googleSearchConsoleVerification,
      ...(SITE_CONFIG.analytics.bingWebmasterVerification && {
        other: {
          "msvalidate.01": SITE_CONFIG.analytics.bingWebmasterVerification,
        },
      }),
    },
  }),

  // ─── Category ─────────────────────────────────────────
  category: "technology",

  // ─── Alternate Languages ──────────────────────────────
  alternates: {
    canonical: SITE_CONFIG.url,
  },
};

// ─── JSON-LD Structured Data (global) ──────────────────────
const organizationSchema = generateOrganizationSchema();
const websiteSchema = generateWebSiteSchema();

import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import NextTopLoader from 'nextjs-toploader';
import { PageLoaderWrapper } from "@/components/PageLoaderWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={SITE_CONFIG.language}
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />

        {/* DNS Prefetch for external resources */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <NextTopLoader color="#C4A35A" showSpinner={false} shadow="0 0 10px #C4A35A,0 0 5px #C4A35A" />
        <PageLoaderWrapper />
        <SessionProviderWrapper>
          <GlobalUIProvider>
            <GlobalUIWrapper>
              {children}
            </GlobalUIWrapper>
          </GlobalUIProvider>
        </SessionProviderWrapper>

        {/* Analytics — loads only when IDs are configured */}
        <Analytics />
      </body>
    </html>
  );
}
