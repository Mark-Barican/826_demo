import { BRANCHES } from './branches';
import { SERVICES } from './services';

/**
 * Every indexable path on the site, in one place.
 *
 * The sitemap and the canonical URLs both need this list, and a route list that
 * exists twice is a route list that will disagree with itself the next time a
 * page is added. Adding a route to the app directory and forgetting it here is
 * still possible; adding it here twice, differently, is not.
 *
 * `/gallery` is deliberately absent. It is a `redirect()` to `/work` kept only
 * so old links resolve - see app/gallery/page.tsx - and a sitemap that lists a
 * redirect is telling a crawler to index a URL that does not serve a page.
 *
 * `priority` here is a hint about relative importance WITHIN this site and
 * nothing more. Google has said for years that it largely ignores it; it costs
 * nothing to be honest about the shape of the site anyway.
 */
export interface SiteRoute {
  path: string;
  changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  priority: number;
}

const STATIC_ROUTES: SiteRoute[] = [
  { path: '/', changeFrequency: 'monthly', priority: 1 },
  { path: '/services', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/pricing', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/work', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/branches', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/booking', changeFrequency: 'yearly', priority: 0.7 },
  { path: '/about', changeFrequency: 'yearly', priority: 0.6 },
  { path: '/contact', changeFrequency: 'yearly', priority: 0.6 },
  { path: '/privacy', changeFrequency: 'yearly', priority: 0.2 },
  { path: '/terms', changeFrequency: 'yearly', priority: 0.2 },
];

/** Every route, static and generated, in the order a crawler should meet them. */
export const SITE_ROUTES: SiteRoute[] = [
  ...STATIC_ROUTES,
  ...SERVICES.map((service) => ({
    path: `/services/${service.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  })),
  ...BRANCHES.map((branch) => ({
    path: `/branches/${branch.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  })),
];
