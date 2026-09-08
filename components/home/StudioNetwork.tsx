import Link from 'next/link';
import { Section } from '@/components/common/Section';
import { BranchMap } from '@/components/branches/BranchMap';
import { BRANCHES, STUDIO_COUNT_WORD } from '@/lib/data/branches';

/**
 * The studio network, led by the map.
 *
 * This is XPEL's installer-locator idea - the thing its header points at from
 * every page - and 826 already had the MapLibre integration sitting on a single
 * inner route. Promoting it to the homepage costs nothing and answers the
 * question most visitors actually have.
 *
 * The studios are a hairline-ruled list rather than a grid of bordered cards.
 * The previous version was `md:grid-cols-2` holding five branches, so the fifth
 * always rendered as an orphan next to an empty cell; a list has no opinion
 * about the count. The heading now derives from the data too - it read "Four
 * Flagship Cleanrooms" for three days after Dasmariñas was added.
 */
export function StudioNetwork() {
  return (
    <Section
      tone="paper"
      label="Studio network"
      title={`${STUDIO_COUNT_WORD} studios across Metro Manila.`}
      action={{ href: '/branches', label: 'Studio details & hours' }}
      revealBody={false}
    >
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div data-reveal className="lg:col-span-7">
          <BranchMap />
        </div>

        {/* No 01-05 down the left of this list. The map beside it carries
            numbered pins and its own legend pairing each number with a studio
            name, so a second set here was never the key to anything - it was a
            column of ordinals in front of five places that have no order. */}
        <ul data-reveal className="lg:col-span-5">
          {BRANCHES.map((b) => (
            <li key={b.slug} className="border-t border-rule last:border-b">
              <Link
                href={`/branches/${b.slug}`}
                className="group flex items-baseline gap-4 py-5 transition-colors hover:text-accent sm:py-6"
              >
                <span className="min-w-0 flex-1">
                  <span className="type-card block">{b.name.replace(/^826\s*/, '')}</span>
                  <span className="mt-1.5 block type-value text-fg-muted">{b.city}</span>
                  {b.locatedIn && (
                    <span className="mt-0.5 block type-value text-fg-muted">{b.locatedIn}</span>
                  )}
                </span>

                <span className="type-meta shrink-0 tabular-nums text-fg-muted">{b.phone}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
