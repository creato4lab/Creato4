/**
 * Creato4 Lab — JSON-LD Structured Data Generators
 * =================================================
 * Generates Schema.org structured data for Google Search, AI Search engines,
 * and rich results. All schemas follow Google's official recommendations.
 */

import { SITE_CONFIG } from './constants';

/** Organization Schema — appears on every page via root layout */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_CONFIG.url}/#organization`,
    name: SITE_CONFIG.name,
    legalName: SITE_CONFIG.legalName,
    url: SITE_CONFIG.url,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_CONFIG.url}/creato4-logo.svg`,
      width: 512,
      height: 512,
    },
    description: SITE_CONFIG.description,
    foundingDate: String(SITE_CONFIG.foundingYear),
    founder: {
      '@type': 'Person',
      name: SITE_CONFIG.founder,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: SITE_CONFIG.email,
      contactType: 'customer service',
      availableLanguage: ['English', 'Hindi', 'Gujarati'],
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE_CONFIG.address.streetAddress,
      addressLocality: SITE_CONFIG.address.addressLocality,
      addressRegion: SITE_CONFIG.address.addressRegion,
      postalCode: SITE_CONFIG.address.postalCode,
      addressCountry: SITE_CONFIG.address.addressCountry,
    },
    sameAs: Object.values(SITE_CONFIG.social).filter(Boolean),
  };
}

/** LocalBusiness Schema — for local SEO on homepage */
export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE_CONFIG.url}/#localbusiness`,
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    image: `${SITE_CONFIG.url}/creato4-full-brand.png`,
    description: SITE_CONFIG.shortDescription,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE_CONFIG.address.streetAddress,
      addressLocality: SITE_CONFIG.address.addressLocality,
      addressRegion: SITE_CONFIG.address.addressRegion,
      postalCode: SITE_CONFIG.address.postalCode,
      addressCountry: SITE_CONFIG.address.addressCountry,
    },
    priceRange: '₹₹',
    currenciesAccepted: SITE_CONFIG.currency,
    paymentAccepted: 'UPI, Credit Card, Bank Transfer',
    areaServed: [
      { '@type': 'Country', name: 'India' },
      { '@type': 'State', name: 'Gujarat' },
    ],
    knowsAbout: SITE_CONFIG.services,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Engineering Services',
      itemListElement: SITE_CONFIG.services.map((service, index) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service,
          provider: { '@id': `${SITE_CONFIG.url}/#organization` },
        },
        position: index + 1,
      })),
    },
  };
}

/** Service Schema — for service detail sections */
export function generateServiceSchema(service: {
  name: string;
  description: string;
  features?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'Organization',
      '@id': `${SITE_CONFIG.url}/#organization`,
      name: SITE_CONFIG.name,
    },
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
    ...(service.features && {
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: `${service.name} Features`,
        itemListElement: service.features.map((feature, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: feature,
        })),
      },
    }),
  };
}

/** Product Schema — for shop product detail pages */
export function generateProductSchema(product: {
  name: string;
  description: string;
  price: number;
  currency?: string;
  image?: string;
  slug: string;
  category?: string;
  availability?: 'InStock' | 'OutOfStock';
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image || `${SITE_CONFIG.url}/creato4-full-brand.png`,
    url: `${SITE_CONFIG.url}/shop/${product.slug}`,
    brand: {
      '@type': 'Organization',
      '@id': `${SITE_CONFIG.url}/#organization`,
      name: SITE_CONFIG.name,
    },
    category: product.category,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency || SITE_CONFIG.currency,
      availability: `https://schema.org/${product.availability || 'InStock'}`,
      seller: {
        '@type': 'Organization',
        name: SITE_CONFIG.name,
      },
    },
  };
}

/** FAQ Schema — for FAQ sections or pages */
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/** BreadcrumbList Schema — for page navigation context */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** WebSite Schema — for sitelinks search box in Google */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_CONFIG.url}/#website`,
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.shortDescription,
    publisher: {
      '@id': `${SITE_CONFIG.url}/#organization`,
    },
    inLanguage: SITE_CONFIG.locale,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_CONFIG.url}/shop?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/** WebPage Schema — base for individual pages */
export function generateWebPageSchema(page: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.name,
    description: page.description,
    url: page.url,
    isPartOf: {
      '@id': `${SITE_CONFIG.url}/#website`,
    },
    about: {
      '@id': `${SITE_CONFIG.url}/#organization`,
    },
    inLanguage: SITE_CONFIG.locale,
  };
}
