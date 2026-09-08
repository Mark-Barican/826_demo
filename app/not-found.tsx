import Link from 'next/link';
import type { Metadata } from 'next';
import { Reveal } from '@/components/common/Reveal';
import { RuledGrid, RULED_CELL } from '@/components/common/RuledGrid';
import { SERVICES } from '@/lib/data/services';
import { PRIMARY_BRANCH, STUDIO_COUNT } from '@/lib/data/branches';

export const metadata: Metadata = {
  title: 'Page not found',
  description:
    'That page has moved or never existed. Here are the services, packages, work and studios instead.',
  // The one page on the site that should never be indexed: it is a dead end
  // that answers to every wrong URL, and letting it into an index means those
  // URLs each get a search result promising a page that is not there.
  robots: { index: false, follow: true },
};

/**
 * 404.
 *
 * A dead end is the worst place to leave a customer, so this does the work a
 * good 404 should: says plainly what happened, then offers the handful of
 * things someone was most likely looking for, plus a phone number for anyone
 * who would rather just ask.
 *
 * This page lays out its own markup rather than going through Section, so it
 * has to open its own reveal scopes. It carried `data-reveal` marks with no
 * Reveal anywhere above them, which meant they did nothing at all.
 */
const DESTINATIONS = [
  { href: '/services', label: 'Services', hint: 'What we do, and what each one involves.' },
  { href: '/pricing', label: 'Packages & pricing', hint: 'What it costs for your size of vehicle.' },
  { href: '/work', label: 'Work', hint: 'Photographs of finished jobs.' },
  { href: '/branches', label: 'Studios', hint: `All ${STUDIO_COUNT} locations, with hours and numbers.` },
] as const;

export default function NotFound() {
  return (
    <main className="tone-ink flex min-h-screen flex-col bg-surface text-fg">
      <Reveal entrance className="mx-auto w-full max-w-7xl px-6 pb-16 pt-32 sm:px-8 lg:pt-40">
        <span data-reveal className="type-meta block text-accent">Error 404</span>
        <h1 data-reveal className="type-display mt-4">This page isn&rsquo;t here.</h1>
        <p data-reveal className="type-body mt-6 text-fg-muted">
          The link may be out of date, or the address may have a typo in it. Nothing is broken on
          your end. Here is where most people are heading.
        </p>
      </Reveal>

      <Reveal className="border-y border-rule">
        <div className="mx-auto w-full max-w-7xl">
          <RuledGrid as="ul" className="sm:grid-cols-2 lg:grid-cols-4">
            {DESTINATIONS.map((d) => (
              <li key={d.href} data-reveal className={`${RULED_CELL} bg-surface`}>
              <Link
                href={d.href}
                className="group flex h-full flex-col justify-between gap-6 p-8 transition-colors hover:bg-surface-raised"
              >
                <div>
                  <h2 className="type-card">{d.label}</h2>
                  <p className="mt-3 type-detail text-fg-muted">{d.hint}</p>
                </div>
                <span
                  aria-hidden
                  className="h-px w-6 bg-accent transition-all duration-300 group-hover:w-12"
                />
              </Link>
            </li>
            ))}
          </RuledGrid>
        </div>
      </Reveal>

      <Reveal className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div data-reveal className="lg:col-span-7">
            <h2 className="type-meta text-fg-muted">Looking for a particular service?</h2>
            <ul className="mt-4">
              {SERVICES.map((s) => (
                <li key={s.slug} className="border-b border-rule-soft">
                  <Link
                    href={`/services/${s.slug}`}
                    className="flex items-baseline justify-between gap-4 py-3 transition-colors hover:text-accent"
                  >
                    <span className="type-value">{s.title}</span>
                    <span className="type-meta shrink-0 text-fg-muted">{s.duration}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div data-reveal className="lg:col-span-5">
            <h2 className="type-meta text-fg-muted">Or just ask</h2>
            <p className="mt-4 type-body text-fg-muted">
              Call {PRIMARY_BRANCH.city} and someone will point you at the right thing.
            </p>
            <a
              href={`tel:${PRIMARY_BRANCH.phone.replace(/\s+/g, '')}`}
              className="type-meta mt-6 inline-flex min-h-[48px] items-center bg-accent px-6 text-on-accent transition-colors hover:bg-accent-hover"
            >
              Call {PRIMARY_BRANCH.phone}
            </a>
            <div className="mt-4">
              <Link
                href="/"
                className="type-meta inline-flex min-h-[48px] items-center border border-rule px-6 text-fg transition-colors hover:border-accent hover:text-accent"
              >
                Back to the homepage
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </main>
  );
}
