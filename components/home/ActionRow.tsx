import Link from 'next/link';
import { Reveal } from '@/components/common/Reveal';
import { RuledGrid, RULED_CELL } from '@/components/common/RuledGrid';
import { PRIMARY_BRANCH, STUDIO_COUNT } from '@/lib/data/branches';

/**
 * Pre-footer action row, after XPEL's three-up.
 *
 * It replaces a single oversized gold panel that shouted one CTA at everyone.
 * Three doors is a better read of who reaches the bottom of the page: someone
 * ready to book, someone working out whether 826 is near them, and someone with
 * a question they want answered before either.
 */
const ACTIONS = [
  {
    href: '/booking',
    label: 'Book a consultation',
    body: 'Bring the car in for a paint inspection and a written scope of work before anything is agreed.',
    cta: 'Start a booking',
    primary: true,
  },
  {
    href: '/branches',
    label: 'Find your studio',
    body: `${STUDIO_COUNT} studios across Metro Manila, from Quezon City down to Cavite.`,
    cta: 'See all studios',
    primary: false,
  },
  {
    href: '/contact',
    label: 'Ask a question',
    body: `Call ${PRIMARY_BRANCH.city} on ${PRIMARY_BRANCH.phone}, or reach any studio directly.`,
    cta: 'Contact details',
    primary: false,
  },
] as const;

export function ActionRow() {
  return (
    <section className="tone-ink border-t border-rule bg-surface text-fg">
      <Reveal className="mx-auto w-full max-w-7xl">
        <RuledGrid as="ul" className="grid-cols-1 md:grid-cols-3">
          {ACTIONS.map((action) => (
            <li key={action.href} data-reveal className={`${RULED_CELL} bg-surface`}>
            <Link
              href={action.href}
              className="group flex h-full flex-col justify-between gap-8 p-8 transition-colors hover:bg-surface-raised sm:p-10 lg:p-12"
            >
              <div>
                <h2 className="type-card">{action.label}</h2>
                <p className="mt-3 type-detail text-fg-muted">{action.body}</p>
              </div>

              <span
                className={
                  action.primary
                    ? 'type-meta inline-flex min-h-[44px] items-center justify-center bg-accent px-6 text-on-accent transition-colors group-hover:bg-accent-hover'
                    : 'type-meta inline-flex min-h-[44px] items-center justify-center border border-rule px-6 text-fg transition-colors group-hover:border-accent group-hover:text-accent'
                }
              >
                {action.cta}
              </span>
            </Link>
          </li>
          ))}
        </RuledGrid>
      </Reveal>
    </section>
  );
}
