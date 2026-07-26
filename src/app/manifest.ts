import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/constants';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_CONFIG.name,
    short_name: 'Creato4',
    description: SITE_CONFIG.shortDescription,
    start_url: '/',
    display: 'standalone',
    background_color: SITE_CONFIG.colors.background,
    theme_color: SITE_CONFIG.colors.primary,
    orientation: 'portrait-primary',
    categories: ['engineering', 'technology', 'education', 'business'],
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/creato4-full-brand.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
