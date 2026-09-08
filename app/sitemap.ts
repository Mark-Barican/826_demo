import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/data/brand';
import { SITE_ROUTES } from '@/lib/data/routes';

/**
 * sitemap.xml.
 *
 * THIS IS EMPTY UNTIL A DOMAIN IS CONFIRMED, and that is not a bug.
 *
 * The sitemap protocol requires `<loc>` to be a full, absolute URL - the spec
 * is explicit that a relative path is invalid, and crawlers discard entries
 * that carry one. There is exactly one absolute origin this site could use and
 * lib/data/brand.ts holds it at null, because the domain the site used to claim
 * (826detailing.ph) was invented alongside the wrong business name and was
 * removed rather than guessed at again.
 *
 * So the choice here is between an empty sitemap and a sitemap full of URLs on
 * a domain 826 may not own. An empty one costs nothing: Search Console reports
 * it as empty, which is true and fixable. A wrong one asks Google to index
 * somebody else's website.
 *
 * TO TURN THIS ON: set `SITE_URL` in lib/data/brand.ts to the live origin, with
 * no trailing slash, e.g. `https://826autoaesthetic.ph`. Every route below,
 * `robots.txt`'s Sitemap line, the canonical tags and the Open Graph image URL
 * all start working from that one edit. Nothing else needs changing.
 *
 * The route list itself lives in lib/data/routes.ts, shared with the canonical
 * tags, so the two cannot drift apart.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!SITE_URL) return [];

  const lastModified = new Date();

  return SITE_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path === '/' ? '' : route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
