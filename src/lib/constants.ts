/**
 * Creato4 Lab — Centralized Site Configuration
 * =============================================
 * Single source of truth for all business information, URLs, and branding.
 * Used across metadata, JSON-LD schemas, components, and email templates.
 */

export const SITE_CONFIG = {
  // ─── Brand ─────────────────────────────────────────
  name: 'Creato4 Lab',
  legalName: 'Creato4 Lab',
  tagline: 'Design · Engineer · Build',
  shortDescription:
    'A multidisciplinary product & technology lab transforming ideas into working physical hardware, embedded systems, custom software, and 3D digital experiences.',
  description:
    'Creato4 Lab is an engineering and product development company specializing in Product Design, Mechanical Engineering, Embedded Systems, PCB Design, IoT Development, AI Solutions, Software Development, Robotics, CAD & Prototyping, and Research & Development.',

  // ─── URLs ──────────────────────────────────────────
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://creato4.com',
  domain: 'creato4.com',

  // ─── Contact ───────────────────────────────────────
  email: process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'creato4lab@gmail.com',
  phone: process.env.NEXT_PUBLIC_COMPANY_PHONE || '+91-9909089344',
  address: {
    streetAddress: process.env.NEXT_PUBLIC_COMPANY_STREET || 'Surat, Gujarat, India',
    addressLocality: process.env.NEXT_PUBLIC_COMPANY_CITY || 'Surat',
    addressRegion: process.env.NEXT_PUBLIC_COMPANY_STATE || 'Gujarat',
    postalCode: process.env.NEXT_PUBLIC_COMPANY_POSTAL || '394107',
    addressCountry: process.env.NEXT_PUBLIC_COMPANY_COUNTRY || 'IN',
  },

  // ─── Social ────────────────────────────────────────
  social: {
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://www.linkedin.com/company/creato4-lab',
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://www.instagram.com/creato4.lab',
    github: process.env.NEXT_PUBLIC_GITHUB_URL || '',
    youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL || '',
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL || '',
  },

  // ─── SEO ───────────────────────────────────────────
  locale: 'en_IN',
  language: 'en',
  currency: 'INR',
  foundingYear: 2022,
  founder: 'Prince Tagadiya',

  // ─── Analytics Placeholder IDs ─────────────────────
  // Replace these with real IDs before launch
  analytics: {
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID || '', // e.g., 'G-XXXXXXXXXX'
    googleTagManagerId: process.env.NEXT_PUBLIC_GTM_ID || '', // e.g., 'GTM-XXXXXXX'
    microsoftClarityId: process.env.NEXT_PUBLIC_CLARITY_ID || '', // e.g., 'xxxxxxxxxx'
    googleSearchConsoleVerification: process.env.NEXT_PUBLIC_GSC_VERIFICATION || '', // e.g., 'xxxxx'
    bingWebmasterVerification: process.env.NEXT_PUBLIC_BING_VERIFICATION || '', // e.g., 'xxxxx'
  },

  // ─── Colors (used in manifest, theme-color, etc.) ──
  colors: {
    primary: '#1A3C2F',
    secondary: '#C4A35A',
    background: '#FAF8F5',
    backgroundDark: '#1A3C2F',
  },

  // ─── Services (for Schema.org) ─────────────────────
  services: [
    'Product Engineering',
    'Mechanical Design & CAD',
    'Electronics & PCB Design',
    'Embedded Systems & IoT',
    'Software Development',
    'AI & Automation',
    'Robotics',
    'Research & Development',
    '3D Prototyping',
    'Industrial Design',
  ],

  // ─── Business Categories (for Local SEO) ───────────
  categories: [
    'Engineering Company',
    'Product Development',
    'Electronics Manufacturing',
    'Software Development',
    'IoT Solutions Provider',
  ],
} as const;

/** Navigation links used across Navbar and Footer */
export const NAV_LINKS = [
  { label: 'Services', href: '/#services', id: 'services' },
  { label: 'Projects', href: '/#selected-work', id: 'selected-work' },
  { label: 'Process', href: '/#how-we-deliver', id: 'how-we-deliver' },
  { label: 'Team', href: '/#team', id: 'team' },
  { label: 'Shop', href: '/shop', id: 'shop' },
] as const;

/** Footer link groups */
export const FOOTER_LINKS = {
  company: [
    { label: 'About Us', href: '/#team' },
    { label: 'Our Process', href: '/#how-we-deliver' },
    { label: 'Projects', href: '/#selected-work' },
    { label: 'Shop', href: '/shop' },
  ],
  services: [
    { label: 'Product Engineering', href: '/#services' },
    { label: 'Mechanical Design', href: '/#services' },
    { label: 'Electronics & PCB', href: '/#services' },
    { label: 'Embedded & IoT', href: '/#services' },
    { label: 'Software Development', href: '/#services' },
    { label: 'AI & Automation', href: '/#services' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms-of-service' },
    { label: 'Refund Policy', href: '/refund-policy' },
    { label: 'Cookie Policy', href: '/cookie-policy' },
    { label: 'Shipping Policy', href: '/shipping-policy' },
    { label: 'EULA', href: '/eula' },
    { label: 'Disclaimer', href: '/disclaimer' },
  ],
} as const;
