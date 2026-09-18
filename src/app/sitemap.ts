import type { MetadataRoute } from 'next';
import { SUPPORTED_LOCALES } from '@/config/i18n.config';

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://snake-pest-identifier.org';

const PATHS = [
  '',
  '/snakes/identify',
  '/snakes/antivenom',
  '/snakes/first-aid',
  '/snakes/encyclopedia',
  '/pests/identify',
  '/pests/dosage',
  '/pests/encyclopedia',
  '/emergency',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [];

  for (const locale of SUPPORTED_LOCALES) {
    for (const path of PATHS) {
      routes.push({
        url: `${BASE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === '' ? 'daily' : 'weekly',
        priority: path === '' ? 1.0 : path.includes('identify') ? 0.9 : 0.8,
      });
    }
  }

  return routes;
}
