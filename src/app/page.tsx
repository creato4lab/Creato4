import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/constants';
import { generateLocalBusinessSchema, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/schemas';
import HomeClient from './HomeClient';

// ─── SEO Metadata (Server-side, visible to crawlers) ──────
export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} — We Turn Ideas Into Working Products`,
  description:
    'Creato4 Lab is an engineering & product development company specializing in Product Design, Mechanical Engineering, Embedded Systems, PCB Design, IoT, AI, Software, and Robotics. Based in Gujarat, India.',
  alternates: {
    canonical: SITE_CONFIG.url,
  },
  openGraph: {
    title: `${SITE_CONFIG.name} — We Turn Ideas Into Working Products`,
    description: SITE_CONFIG.shortDescription,
    url: SITE_CONFIG.url,
    images: [
      {
        url: '/creato4-full-brand.png',
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.name} — Design · Engineer · Build`,
      },
    ],
  },
};

// ─── Homepage FAQ Data (for FAQ Schema) ───────────────────
const homepageFAQs = [
  {
    question: 'What services does Creato4 Lab offer?',
    answer:
      'Creato4 Lab offers Product Engineering, Mechanical Design & CAD, Electronics & PCB Design, Embedded Systems & IoT, Software Development, and AI & Automation services.',
  },
  {
    question: 'How does the project development process work?',
    answer:
      'Our 8-step process includes: Discover, Feasibility, Architect, Design, Prototype, Integrate, Test & Iterate, and Deliver. We start with understanding your vision and deliver working products with full source code and manufacturing guides.',
  },
  {
    question: 'Does Creato4 Lab offer a free initial consultation?',
    answer:
      'Yes, we offer a free initial discussion to understand your project requirements. You can request a callback through our website and our team will get in touch.',
  },
  {
    question: 'What kind of products can Creato4 Lab build?',
    answer:
      'We build IoT devices, drones, embedded systems, custom PCBs, smart kiosks, robotic systems, web applications, and AI-powered solutions. From concept to production-ready prototypes.',
  },
  {
    question: 'Does Creato4 Lab sell digital engineering products?',
    answer:
      'Yes, we sell engineering project blueprints including complete source code, circuit schematics, 3D CAD files, and documentation for both hardware and software projects.',
  },
];

// ─── JSON-LD Schemas ──────────────────────────────────────
const localBusinessSchema = generateLocalBusinessSchema();
const breadcrumbSchema = generateBreadcrumbSchema([
  { name: 'Home', url: SITE_CONFIG.url },
]);
const faqSchema = generateFAQSchema(homepageFAQs);

// ─── Server Component (SSR — content visible to crawlers) ──
export default function HomePage() {
  return (
    <>
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      {/* Client-side interactive homepage */}
      <HomeClient />
    </>
  );
}
