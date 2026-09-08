/**
 * Facts the legal pages need, and which of them 826 has actually supplied.
 *
 * READ THIS BEFORE PUBLISHING /terms OR /privacy.
 *
 * These two pages were written to describe what this website genuinely does,
 * which was checked against the code rather than assumed:
 *
 *   - no cookies, and no tag manager or advertising pixel of any kind
 *   - no form on the site submits anywhere. The booking form builds a summary
 *     in the browser and asks the customer to phone it in; it makes no network
 *     request and stores nothing
 *   - the studios map pulls its tiles from CARTO (basemaps.cartocdn.com) and a
 *     worker script from unpkg.com, so those two third parties do receive the
 *     visitor's IP address and request headers when the map loads
 *
 * TWO OF THOSE CHANGED ON 2026-09-07, and this list is the reason the privacy
 * page was rewritten in the same breath rather than afterwards. The site can
 * now count visits with Plausible, and it can now write to the visitor's
 * browser:
 *
 *   - measurement is installed only when NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set
 *     (lib/data/analytics.ts). Unset, the two claims above still hold exactly
 *     as written, and /privacy says so
 *   - Plausible sets no cookies, stores no IP addresses and builds no
 *     cross-site profile, so no personal data is processed and no consent is
 *     required. It is on by default with a real opt-out; see lib/analytics.ts
 *   - the opt-out answer is kept in localStorage under `826:analytics`. That is
 *     now the one thing this site writes to a visitor's device, and it is the
 *     only reason the "nothing is written" line above had to go
 *
 * app/privacy/page.tsx reads the same constant and describes whichever way it
 * is set, so a deployment cannot end up claiming to measure nothing while
 * measuring. Keep that arrangement.
 *
 * They are a truthful description of a brochure site, not a substitute for
 * legal advice. Have them reviewed before relying on them, and re-check them
 * the moment the booking form starts actually sending anything, because at that
 * point 826 begins collecting personal data and the privacy page stops being
 * accurate.
 *
 * Anything 826 has not published stays `null` here, and the pages render a
 * visible placeholder instead - the same convention as lib/data/branches.ts.
 * Never fill these in with a plausible-looking guess.
 */
export const LEGAL = {
  /** Registered business or trade name, as filed. */
  registeredName: null as string | null,
  /** DTI / SEC registration number. */
  registrationNumber: null as string | null,
  /** Address for legal notices. Branch addresses are not a substitute. */
  noticeAddress: null as string | null,
  /** Inbox for privacy requests. No 826 email address is on file anywhere. */
  privacyEmail: null as string | null,
  /** Set when a person has actually reviewed and approved the wording. */
  lastReviewed: null as string | null,
  /** Date the current wording was written. */
  lastUpdated: '2026-09-06',
} as const;

/**
 * Trading name used in prose where a registered name is not required.
 * Re-exported from lib/data/brand.ts so there is exactly one definition.
 */
export { BRAND_NAME as TRADING_NAME } from './brand';
