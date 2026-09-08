import type { Metadata, Viewport } from 'next';
import { Mona_Sans, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { RouteLoader } from '@/components/common/RouteLoader';
import { BottomBar } from '@/components/common/BottomBar';
import { Analytics } from '@/components/common/Analytics';
import { STUDIO_COUNT } from '@/lib/data/branches';
import { BRAND_NAME, SITE_URL } from '@/lib/data/brand';

/**
 * The headline voice. Loaded variable with the `wdth` axis, because the display
 * tier WIDENS rather than only growing - see `.type-display` in globals.css.
 *
 * That axis is the constraint that decides this typeface, and it rules out most
 * of the obvious candidates: of everything Google serves, only 46 Latin faces
 * have a width axis that goes ABOVE 100, and the fashionable neo-grotesques -
 * Instrument Sans, Bricolage Grotesque, Schibsted Grotesk - all stop at 100.
 * They can condense and cannot expand, so `font-stretch: 125%` would silently
 * clamp and the headlines would quietly lose the character the whole page is
 * built around. Mona Sans carries 75-125, the same range Archivo had, with a
 * cleaner and more contemporary drawing.
 *
 * The variables are named for their ROLE, not the face, so replacing either one
 * is a change to this file and nothing else.
 */
const grotesque = Mona_Sans({
  variable: '--font-grotesque',
  subsets: ['latin'],
  axes: ['wdth'],
  display: 'swap',
});

/**
 * The specification voice: spec tables, labels, addresses, numerals. Geist Mono
 * is drawn for precision and reads as instrumentation; IBM Plex Mono, which was
 * here before, is softer and reads as corporate documentation.
 */
const technical = Geist_Mono({
  variable: '--font-technical',
  subsets: ['latin'],
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#08080a',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  /**
   * The origin every relative metadata URL is resolved against - the Open Graph
   * card, the canonical tags, the icons. Without it Next resolves them against
   * localhost in development and warns at build, and a social card pointing at
   * localhost is a social card with no image.
   *
   * Set once, in lib/data/brand.ts, and left off entirely until 826 confirms a
   * domain. See the note on SITE_URL there, and app/sitemap.ts for what else
   * that one edit switches on.
   */
  ...(SITE_URL ? { metadataBase: new URL(SITE_URL) } : {}),
  title: {
    template: `%s | ${BRAND_NAME}`,
    default: `${BRAND_NAME} | Paint Protection Film, Ceramic Coating & Paint Correction`,
  },
  description:
    `${BRAND_NAME} installs paint protection film, corrects paint and applies ceramic coating across ${STUDIO_COUNT} studios in Metro Manila.`,
  keywords: [
    BRAND_NAME,
    '826 Auto Aesthetic',
    'Paint Protection Film Manila',
    'PPF Philippines',
    'Ceramic Coating QC',
    'Paint Correction Libis',
    'Supercar Detailing Manila',
    'Vespa PPF',
  ],
  authors: [{ name: BRAND_NAME }],
  /**
   * `favicon.ico` is a real multi-size icon (16/32/48/256), so it is declared
   * once with `sizes: 'any'` rather than pinned to one of them. The Apple touch
   * icon is generated - see app/apple-icon.tsx - and iOS needs it because it
   * ignores .ico completely.
   */
  icons: {
    icon: [{ url: '/favicon.ico', sizes: 'any' }],
    apple: [{ url: '/apple-icon', sizes: '180x180' }],
  },
  openGraph: {
    title: BRAND_NAME,
    description:
      `Paint protection film, paint correction and ceramic coating across ${STUDIO_COUNT} studios in Metro Manila.`,
    ...(SITE_URL ? { url: SITE_URL } : {}),
    siteName: BRAND_NAME,
    locale: 'en_PH',
    type: 'website',
  },
  /**
   * `summary_large_image` is what turns the 1200x630 card from a thumbnail
   * beside the text into the full-width image. The image itself is picked up
   * automatically from app/opengraph-image.tsx; naming it here would be a
   * second place for the same URL to go stale.
   */
  twitter: {
    card: 'summary_large_image',
    title: BRAND_NAME,
    description: `Paint protection film, paint correction and ceramic coating across ${STUDIO_COUNT} studios in Metro Manila.`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  /*
   * `data-scroll-behavior="smooth"` is what makes a new page start at the top.
   *
   * globals.css sets `scroll-behavior: smooth` on `html`, for in-page anchor
   * links. Next 15 and earlier quietly turned that off for the duration of a
   * route change and back on afterwards, so navigation jumped and anchors
   * glided. NEXT 16 NO LONGER DOES THAT unless asked, and this project is on
   * 16: the reset to the top became an animated scroll instead of a jump, and
   * arriving on a page a screen and a half down was the result. Measured -
   * scrolled to 2500px, clicked through, and the new route was still sitting at
   * 2500px two seconds later; forcing `scroll-behavior: auto` for the same
   * navigation landed at 0 immediately.
   *
   * This attribute opts back into the old override. It is not the same as
   * deleting the smooth scrolling: anchors within a page still glide, and only
   * the cross-page reset is made instant. Next's own dev console asks for this
   * by name, which was worth reading rather than filtering out.
   */
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${grotesque.variable} ${technical.variable} h-full antialiased dark`}
    >
      <body className="tone-ink min-h-full flex flex-col bg-surface text-fg font-sans selection:bg-brand selection:text-black">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-accent focus:text-on-accent focus:px-4 focus:py-2 focus:type-meta"
        >
          Skip to content
        </a>
        <Header />
        <div id="main" className="flex-1 flex flex-col">{children}</div>
        <Footer />
        {/* The sticky mobile CTA and the analytics notice, stacked so they
            cannot cover each other, with the page's bottom padding measured
            from whatever the stack turns out to be. Outside the route template,
            so it does not fade in and out on every navigation. */}
        <BottomBar />
        {/* Outside the route template on purpose, so it survives a navigation
            and can fade out over the page it was covering. */}
        <RouteLoader />
        {/* Renders nothing unless NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set, and
            nothing if the visitor has turned measurement off. */}
        <Analytics />
      </body>
    </html>
  );
}
