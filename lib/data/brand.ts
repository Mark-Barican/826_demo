/**
 * The business name, in one place.
 *
 * It is **826 Auto Aesthetic & Protection**. The site previously called itself
 * "826 Automotive Detailing", and in several places "826 Automotive Detailing
 * Atelier", neither of which is the business. Corrected 2026-09-06.
 *
 * The evidence was on every photograph the whole time: each job image in
 * `public/work/` carries a burnt-in watermark reading "826 AUTO AESTHETIC &
 * PROTECTION / SCT LIMBAGA QC". It is quoted in lib/data/gallery.ts and
 * lib/data/claims.ts and was still not matched against the site's own naming.
 *
 * Import these rather than typing the name. It appears in page titles, Open
 * Graph tags, the footer, image alt text and both legal pages, and a name that
 * lives in fourteen string literals is a name that will drift again.
 */

/** The full registered-style name, for titles, legal copy and attribution. */
export const BRAND_NAME = '826 Auto Aesthetic & Protection';

/**
 * Short form, for places where the full name is too long to read - breadcrumb
 * furniture, tight labels, and prose that has already established who "826" is.
 */
export const BRAND_SHORT = '826';

/**
 * What the business does, in one line, for meta descriptions.
 * Deliberately plain: no warranty periods or certification claims. See
 * lib/data/claims.ts.
 */
export const BRAND_TAGLINE =
  'Paint protection film, ceramic coating and paint correction in Metro Manila.';

/**
 * Canonical site URL, for Open Graph and any future sitemap.
 *
 * `null` until 826 confirms the live domain. The site previously asserted
 * `https://826detailing.ph`, which was invented at the same time as the wrong
 * business name - lib/data/branches.ts records that a matching
 * `concierge@826detailing.ph` address was fabricated too. Open Graph simply
 * omits the field while this is null, which is correct; a wrong canonical URL
 * is worse than none.
 */
export const SITE_URL: string | null = null;

/**
 * Social accounts, for the footer.
 *
 * `facebook` is the QUEZON CITY (Scout Limbaga) page, supplied by Mark on
 * 2026-09-07. It stands for the business as a whole down in the footer. Every
 * other studio's page belongs to that studio and lives on its own branch record
 * - see `facebook` in lib/data/branches.ts. This URL is deliberately duplicated
 * there rather than imported, because the two are answering different questions
 * and either could change without the other.
 *
 * `instagram` is the one account for the business, supplied 2026-09-07.
 *
 * Both are still typed nullable: the footer renders each link only when it has
 * a URL, and the whole row only when at least one does, so an account can be
 * dropped by emptying the field rather than by unpicking markup.
 */
export const SOCIAL: { instagram: string | null; facebook: string | null } = {
  instagram: 'https://www.instagram.com/826autoaesthetic/',
  facebook: 'https://www.facebook.com/826quezoncity/',
};
