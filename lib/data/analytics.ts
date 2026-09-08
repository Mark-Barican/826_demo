/**
 * Whether visit measurement is installed, and under what site id.
 *
 * The bare domain Plausible counts under, e.g. `826auto.ph`. Unset means
 * analytics is genuinely not installed: no script, no notice, no request, and
 * the privacy page describes a site that measures nothing - which is then true.
 * Set `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` in the deployment environment to turn it
 * on. `NEXT_PUBLIC_` is required for the value to exist in the browser at all.
 *
 * THIS LIVES HERE, AWAY FROM lib/analytics.ts, because that file is marked
 * `'use client'` and /privacy is a server component. A server component that
 * imports from a client module pulls in a client boundary it has no use for;
 * the privacy page only needs to know whether to describe measurement, which is
 * a build-time constant.
 *
 * Changing this changes what the site does to visitors. app/privacy/page.tsx
 * reads the same constant and describes whichever way it is set - keep it that
 * way, and see the note at the top of lib/data/legal.ts.
 */
export const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? null;

/** Whether this build measures visits at all. */
export const ANALYTICS_INSTALLED = Boolean(PLAUSIBLE_DOMAIN);
