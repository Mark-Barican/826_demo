import { Metadata } from 'next';
import Link from 'next/link';
import { BranchImage } from '@/components/branches/BranchImage';
import { PageHeader } from '@/components/common/PageHeader';
import { Parallax } from '@/components/common/Parallax';
import { Reveal } from '@/components/common/Reveal';
import { Section } from '@/components/common/Section';
import { BranchMap } from '@/components/branches/BranchMap';
import { BRANCHES, STUDIO_COUNT, STUDIO_COUNT_WORD } from '@/lib/data/branches';
import { BRAND_NAME } from '@/lib/data/brand';

export const metadata: Metadata = {
  title: 'Studios',
  description: `The ${STUDIO_COUNT} ${BRAND_NAME} studios: ${BRANCHES.map((b) => b.name.replace(/^826\s*/, '')).join(', ')}.`,
};

/**
 * Studio index.
 *
 * Each studio is a hairline-ruled slab rather than a bordered card floating on
 * the same dark field. Dasmariñas has no photograph, no published hours and no
 * equipment list, so every block below is conditional - the layout has to hold
 * with a branch that has almost nothing filled in, because one does.
 */
export default function BranchesPage() {
  return (
    <main className="tone-ink min-h-screen bg-surface text-fg">
      <PageHeader
        title={`${STUDIO_COUNT_WORD} studios.`}
        subtitle="Across Metro Manila, Rizal and Cavite. Every studio takes its own calls."
        breadcrumbs={[{ label: 'Studios' }]}
      />

      <Section tone="paper" flush className="py-14 sm:py-20">
        <BranchMap />
      </Section>

      {/* One trigger per studio rather than one for the list. Each slab is
          taller than a viewport, so a shared trigger would have played all five
          before the second one was on screen. The articles stay siblings so
          `last:border-b` still finds the last of them. */}
      <Section tone="ink" flush className="py-4" revealBody={false}>
        <Reveal each>
          {BRANCHES.map((b, index) => (
            <article
              key={b.slug}
              id={b.slug}
              data-reveal
              className="scroll-mt-28 border-t border-rule py-16 last:border-b sm:py-20"
            >
              <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
                <div className="lg:col-span-5">
                  {/* No photograph means BranchImage renders a typographic
                      plate, and type does not belong in the oversized layer
                      the drift needs. See the note on `still`. */}
                  <Parallax
                    still={!b.image}
                    className="aspect-[4/3] border border-rule bg-surface-raised"
                  >
                    <BranchImage
                      src={b.image}
                      name={b.name}
                      city={b.city}
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      priority={index === 0}
                    />
                  </Parallax>

                  {b.cleanroomSpecs.length > 0 && (
                    <dl className="mt-6 grid grid-cols-1 gap-x-8 sm:grid-cols-2">
                      {b.cleanroomSpecs.map((spec) => (
                        <div key={spec.label} className="border-b border-rule-soft py-3">
                          <dt className="type-meta text-fg-muted">{spec.label}</dt>
                          <dd className="mt-1 text-sm text-fg">{spec.value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </div>

                <div className="lg:col-span-7">
                  <span className="type-meta block text-accent">
                    {String(index + 1).padStart(2, '0')} &middot; {b.city}
                  </span>
                  <h2 className="type-section mt-3">{b.name}</h2>
                  <p className="type-body mt-5 text-fg-muted">{b.description}</p>

                  <dl className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                    <div>
                      <dt className="type-meta text-fg-muted">Address</dt>
                      <dd className="mt-1 text-sm">{b.address}</dd>
                      {b.locatedIn && <dd className="type-value text-fg-muted">{b.locatedIn}</dd>}
                    </div>
                    <div>
                      <dt className="type-meta text-fg-muted">Phone</dt>
                      <dd className="mt-1">
                        <a
                          href={`tel:${b.phone.replace(/\s+/g, '')}`}
                          className="inline-flex min-h-[44px] items-center text-sm tabular-nums underline decoration-accent underline-offset-4 transition-colors hover:text-accent"
                        >
                          {b.phone}
                        </a>
                      </dd>
                    </div>
                    <div>
                      <dt className="type-meta text-fg-muted">Hours</dt>
                      {b.hours.length > 0 ? (
                        b.hours.map((h) => (
                          <dd key={h.days} className="mt-1 type-value text-fg-muted">
                            {h.days}: {h.time}
                          </dd>
                        ))
                      ) : (
                        <dd className="mt-1 type-value text-fg-muted">Not published. Call ahead.</dd>
                      )}
                    </div>
                    {b.capacity && (
                      <div>
                        <dt className="type-meta text-fg-muted">Capacity</dt>
                        <dd className="mt-1 type-value text-fg-muted">{b.capacity}</dd>
                      </div>
                    )}
                  </dl>

                  {b.features.length > 0 && (
                    <ul className="mt-8 border-t border-rule pt-6">
                      {b.features.map((f) => (
                        <li
                          key={f}
                          className="border-b border-rule-soft py-3 type-value text-fg-muted last:border-0"
                        >
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-10 flex flex-wrap gap-3">
                    <Link
                      href={`/branches/${b.slug}`}
                      className="type-meta inline-flex min-h-[44px] items-center bg-accent px-6 text-on-accent transition-colors hover:bg-accent-hover"
                    >
                      Studio details
                    </Link>
                    <Link
                      href={`/booking?branch=${b.slug}`}
                      className="type-meta inline-flex min-h-[44px] items-center border border-rule px-6 text-fg transition-colors hover:border-accent hover:text-accent"
                    >
                      Book here
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </Reveal>
      </Section>
    </main>
  );
}
