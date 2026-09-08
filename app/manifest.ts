import type { MetadataRoute } from 'next';
import { BRAND_NAME, BRAND_SHORT, BRAND_TAGLINE } from '@/lib/data/brand';

/**
 * The web app manifest.
 *
 * This is a brochure site, not an app, and the manifest is written as one:
 * `display: 'browser'` keeps a saved shortcut opening in the normal browser
 * with its address bar and back button, rather than in a standalone frame where
 * a customer who taps a phone number has no obvious way back. Claiming
 * standalone would be claiming to be something this is not.
 *
 * What it is actually here for is the metadata Android uses when someone adds
 * the site to their home screen: a name, a colour that matches the page instead
 * of a white flash, and an icon. The colours are the ink surface and are
 * literals for the same reason the Open Graph card's are - a manifest is JSON
 * served to the operating system, and nothing in globals.css can reach it.
 *
 * The icons point at the two routes Next generates from `app/favicon.ico` and
 * `app/apple-icon.tsx`. `sizes: 'any'` on the .ico is deliberate and correct:
 * it genuinely carries 16, 32, 48 and 256px, and listing one of those would
 * throw the other three away.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: BRAND_NAME,
    short_name: BRAND_SHORT,
    description: BRAND_TAGLINE,
    start_url: '/',
    display: 'browser',
    background_color: '#08080a',
    theme_color: '#08080a',
    lang: 'en-PH',
    icons: [
      { src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  };
}
