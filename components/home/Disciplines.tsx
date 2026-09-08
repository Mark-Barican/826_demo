import Link from 'next/link';
import Image from 'next/image';
import { Section } from '@/components/common/Section';
import { SERVICES, SERVICE_COUNT_WORD } from '@/lib/data/services';

/**
 * The five disciplines, after Pure PPF's series panels: tall portrait panels
 * with the short name set vertically along the leading edge.
 *
 * This replaces a 12-column grid that keyed off `isLarge = index === 0 || index
 * === 1` and could not lay out five items - the last row always came out
 * ragged. Five equal panels have no such problem.
 *
 * Below lg the row scrolls horizontally with snap points and the next panel
 * deliberately peeks past the edge, which is both a real affordance and far
 * better than five full-height panels stacked into a five-screen column.
 */
export function Disciplines() {
  return (
    <Section
      tone="ink"
      label="Disciplines"
      title={`${SERVICE_COUNT_WORD} things we do, and nothing else.`}
      action={{ href: '/services', label: 'All capabilities' }}
      bleed
      revealBody={false}
    >
      {/* Not a RuledGrid: this is a scroller below lg and a grid above it, and
          it never has a short row - one column per discipline, and only at xl,
          where six of them still have room to read. The rules are
          still on the panels rather than the container, because `bg-rule` here
          was also painting the `pl-6` scroll gutter as a grey band before the
          first panel. `first:border-l-0` drops the leading rule, which is the
          left-hand panel in both layouts. */}
      <div
        className="
          flex snap-x snap-mandatory overflow-x-auto pl-6 sm:pl-8
          xl:grid xl:grid-cols-6 xl:overflow-visible xl:pl-0
          [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
        "
      >
        {SERVICES.map((service) => (
          <article
            key={service.slug}
            className="
              tone-ink group relative flex w-[78vw] shrink-0 snap-start border-l border-rule
              bg-surface first:border-l-0 sm:w-[46vw] lg:w-[30vw] xl:w-auto
            "
          >
            {/* Vertical series label. */}
            <div className="flex w-9 shrink-0 items-end justify-center border-r border-rule py-6 sm:w-11">
              <span className="label-vertical type-meta text-fg-muted transition-colors group-hover:text-accent">
                {service.shortTitle}
              </span>
            </div>

            <div className="flex min-w-0 flex-1 flex-col">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={service.heroImage}
                  alt={service.title}
                  fill
                  sizes="(max-width: 640px) 78vw, (max-width: 1024px) 46vw, 20vw"
                  className="object-cover brightness-[0.8] transition-[filter] duration-700 group-hover:brightness-100"
                />
              </div>

              <div className="flex flex-1 flex-col justify-between gap-6 p-5 sm:p-6">
                <div>
                  <h3 className="type-card">{service.title}</h3>
                  <p className="mt-3 type-detail text-fg-muted">{service.tagline}</p>
                </div>

                <div className="border-t border-rule-soft pt-4">
                  <span className="type-meta block text-fg-muted">{service.duration}</span>
                  <Link
                    href={`/services/${service.slug}`}
                    className="type-meta mt-3 inline-flex flex-col gap-1.5 text-fg transition-colors hover:text-accent"
                  >
                    <span>
                      Specifications
                      <span className="sr-only"> for {service.title}</span>
                    </span>
                    <span
                      aria-hidden
                      className="h-px w-full max-w-[2.5rem] bg-accent transition-all duration-300 group-hover:max-w-full"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </article>
        ))}

        {/* Trailing gutter so the last panel can snap clear of the edge. */}
        <span aria-hidden className="w-6 shrink-0 bg-surface sm:w-8 lg:hidden" />
      </div>
    </Section>
  );
}
