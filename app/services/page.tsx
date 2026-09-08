import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { PageHeader } from '@/components/common/PageHeader';
import { Parallax } from '@/components/common/Parallax';
import { Section } from '@/components/common/Section';
import { SERVICES, SERVICE_COUNT_WORD } from '@/lib/data/services';
import { BRAND_NAME } from '@/lib/data/brand';

export const metadata: Metadata = {
  title: 'Services',
  description: `Paint protection film, ceramic coating, paint correction, interior work and motorcycle detailing from ${BRAND_NAME}.`,
};

/**
 * Services index.
 *
 * The stacked slab layout is kept - it was already the best-composed inner page
 * - but the slabs now alternate tone instead of being five identical bordered
 * cards on one dark field, and the imagery is 4:5 rather than cropped to 16/10.
 *
 * The stats bar asserted film thickness, "9H+ Cured" hardness, a CRI figure and
 * "Up to 10 Yrs" warranty coverage. Those are in lib/data/claims.ts pending
 * confirmation, so the bar now counts what this repository actually knows.
 *
 * The closing banner also offered a "complimentary 40-point ultrasonic paint
 * depth analysis". Nobody has confirmed that is free or that it is 40 points,
 * so it now says what happens without pricing or quantifying it.
 */
export default function ServicesPage() {

  return (
    <main className="tone-ink min-h-screen bg-surface text-fg">
      <PageHeader
        title={`${SERVICE_COUNT_WORD} disciplines.`}
        subtitle="Paint protection film, coatings, nano ceramic tint, paint correction, interior work and motorcycles. Each one has its own page with the full process."
        breadcrumbs={[{ label: 'Services' }]}
      />

      {SERVICES.map((service, index) => (
        <Section
          key={service.slug}
          id={service.slug}
          tone={index % 2 === 0 ? 'ink' : 'paper'}
          className="scroll-mt-28"
          revealBody={false}
        >
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div data-reveal className="lg:col-span-5">
              <Parallax className="aspect-[4/5] border border-rule bg-surface-raised">
                <Image
                  src={service.heroImage}
                  alt={service.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </Parallax>
            </div>

            <div className="lg:col-span-7">
              <span data-reveal className="type-meta block text-accent">{service.duration}</span>
              <h2 data-reveal className="type-section mt-3">{service.title}</h2>
              <p data-reveal className="type-body mt-5 text-fg-muted">{service.description}</p>

              <h3 data-reveal className="type-meta mt-10 border-t border-rule pt-6 text-fg-muted">
                What it covers
              </h3>
              <ul data-reveal className="mt-4">
                {service.highlights.map((h) => (
                  <li
                    key={h}
                    className="border-b border-rule-soft py-3 type-detail text-fg-muted"
                  >
                    {h}
                  </li>
                ))}
              </ul>

              {/* The specification table and the full package list used to be
                  repeated here, straight off the detail page below the fold of
                  an index nobody reads that far down. They made each slab half
                  a screen too tall to sit in the viewport, and they said
                  nothing "Full process" does not say better. What is left is
                  what an index is for: what it is, what it covers, how long it
                  takes, and the two ways in. */}
              <p data-reveal className="type-meta mt-8 text-fg-muted">
                {service.specs.length} specifications &middot; {service.packages.length}{' '}
                {service.packages.length === 1 ? 'package' : 'packages'}
              </p>

              <div data-reveal className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={`/services/${service.slug}`}
                  className="type-meta inline-flex min-h-[48px] items-center bg-accent px-6 text-on-accent transition-colors hover:bg-accent-hover"
                >
                  Full process
                </Link>
                <Link
                  href={`/booking?service=${service.slug}`}
                  className="type-meta inline-flex min-h-[48px] items-center border border-rule px-6 text-fg transition-colors hover:border-accent hover:text-accent"
                >
                  Book this
                </Link>
              </div>
            </div>
          </div>
        </Section>
      ))}

      <Section tone="ink" title="Not sure which one you need?" display revealBody={false}>
        <p data-reveal className="type-body text-fg-muted">
          Bring the car to any studio. We will look at the paint, measure it, and tell you what it
          needs and what it does not before you commit to anything.
        </p>
        <Link
          data-reveal
          href="/booking"
          className="type-meta mt-10 inline-flex min-h-[48px] items-center bg-accent px-8 text-on-accent transition-colors hover:bg-accent-hover"
        >
          Book an assessment
        </Link>
      </Section>
    </main>
  );
}
