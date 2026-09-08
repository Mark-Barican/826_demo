'use client';

import Script from 'next/script';
import { PLAUSIBLE_DOMAIN, analyticsAllowed, useConsent } from '@/lib/analytics';

/**
 * The visit counter.
 *
 * Renders nothing at all unless `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is set, so the
 * site ships with no analytics installed and no request leaving the page until
 * somebody deliberately turns it on. See lib/analytics.ts for why the provider
 * is Plausible and why the default is on-with-an-opt-out rather than opt-in.
 *
 * The opt-out is enforced HERE, by not rendering the script, rather than by
 * loading it and setting a flag. A script that is on the page has already made
 * the request the visitor asked not to make.
 *
 * `afterInteractive` rather than `beforeInteractive`: a page-view counter has
 * no business competing with the page itself for the main thread, and it has
 * nothing to do until the page has rendered anyway.
 */
export function Analytics() {
  const { consent } = useConsent();

  if (!PLAUSIBLE_DOMAIN) return null;
  if (!analyticsAllowed(consent)) return null;

  return (
    <Script
      defer
      strategy="afterInteractive"
      data-domain={PLAUSIBLE_DOMAIN}
      src="https://plausible.io/js/script.js"
    />
  );
}
