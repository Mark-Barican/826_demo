'use client';

import Link from 'next/link';
import { PLAUSIBLE_DOMAIN, useConsent } from '@/lib/analytics';

/**
 * The analytics notice.
 *
 * IT IS NOT A COOKIE BANNER, BECAUSE THERE ARE NO COOKIES. Saying "we use
 * cookies" on a site that sets none would be the same kind of untruth as the
 * warranty claims lib/data/claims.ts exists to keep off this site, and it is
 * the reason most of these banners are ignored: they all say the same thing
 * whether or not it is true. This says what actually happens - a cookieless
 * counter, no personal data - and offers a real way to stop it.
 *
 * IT DOES NOT BLOCK THE PAGE. No overlay, no dimming, nothing to dismiss before
 * reading. Blocking is what you do when you need consent before you may act,
 * and Plausible does not need consent. This is an FYI with a working off
 * switch, so it sits at the bottom, out of the way, and one tap makes it go.
 *
 * IT DOES NOT APPEAR AT ALL when analytics is not installed - there is nothing
 * to disclose - so a deployment without `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` set
 * shows no notice, which is exactly right, because that build genuinely does
 * nothing to the visitor.
 *
 * THE ONE THING THAT IS WRITTEN TO THE DEVICE is the answer to this notice, in
 * localStorage, so it is not asked again on every page. That is a change to
 * what the site does and /privacy says so explicitly - see the note at the top
 * of lib/data/legal.ts about re-checking those pages whenever this changes.
 */
export function CookieNotice() {
  const { consent, choose } = useConsent();

  // Nothing installed, still resolving, or already answered.
  if (!PLAUSIBLE_DOMAIN) return null;
  if (consent === undefined || consent !== null) return null;

  return (
    <div
      role="region"
      aria-label="Analytics notice"
      className="tone-ink border-t border-rule bg-surface px-6 py-4 text-fg sm:px-8"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="type-detail text-fg-muted">
          We count visits with a cookieless tool. It stores nothing on your device and collects
          nothing about you personally.{' '}
          <Link href="/privacy" className="text-fg underline decoration-accent underline-offset-4">
            What we collect
          </Link>
        </p>

        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => choose('denied')}
            className="type-meta inline-flex min-h-[44px] items-center border border-rule px-5 text-fg transition-colors hover:border-accent hover:text-accent"
          >
            Turn off
          </button>
          <button
            type="button"
            onClick={() => choose('granted')}
            className="type-meta inline-flex min-h-[44px] items-center bg-accent px-5 text-on-accent transition-colors hover:bg-accent-hover"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
