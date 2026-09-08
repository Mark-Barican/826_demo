import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/data/brand';

/**
 * robots.txt.
 *
 * Everything is crawlable. This is a five-page brochure site for a business
 * that wants to be found; there is no admin area, no search-result pages and no
 * paginated archive to keep out of an index.
 *
 * `/gallery` IS disallowed, and it is the one interesting line here. It is a
 * permanent redirect to `/work` kept so old links resolve (see
 * app/gallery/page.tsx). Left crawlable it is a second URL for the portfolio,
 * which is the duplicate-content problem the redirect was added to solve.
 *
 * The `Sitemap:` line only appears once 826 confirms a domain. It has to be an
 * absolute URL - a relative one is not valid in robots.txt and crawlers drop
 * it - and lib/data/brand.ts holds SITE_URL at null on purpose, because the
 * domain this site previously asserted was invented. Pointing crawlers at a
 * sitemap on a domain that is not ours is worse than not pointing at one.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/gallery',
    },
    ...(SITE_URL ? { sitemap: `${SITE_URL}/sitemap.xml`, host: SITE_URL } : {}),
  };
}
