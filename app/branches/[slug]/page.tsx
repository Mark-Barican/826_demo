import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BranchImage } from '@/components/branches/BranchImage';
import { PageHeader } from '@/components/common/PageHeader';
import { Parallax } from '@/components/common/Parallax';
import { RuledGrid, RULED_CELL } from '@/components/common/RuledGrid';
import { SocialLinks } from '@/components/common/SocialLinks';
import { Section } from '@/components/common/Section';
import { BRANCHES } from '@/lib/data/branches';
import { SERVICES } from '@/lib/data/services';

interface BranchPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BRANCHES.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: BranchPageProps) {
  const { slug } = await params;
  const branch = BRANCHES.find((b) => b.slug === slug);
  if (!branch) return { title: 'Studio not found' };

  return {
    title: branch.name,
    description: branch.description,
  };
}

/**
 * Studio detail.
 *
 * Two corrections beyond layout.
 *
 * The stats bar claimed "Positive HEPA" filtration, a lighting temperature and
 * "Master Certification: Gyeon & Stek" on every studio regardless of what the
 * data held for it. The certification in particular is a claim about another
 * company's programme - see lib/data/claims.ts. Stats now come from the branch
 * record, and are omitted where that record is empty.
 *
 * The services list was headed "Services Available at {branch}" but rendered
 * every service with no filtering, on every studio - including Dasmariñas,
 * which has no published equipment at all. 826 has not published a per-studio
 * service list, so the heading no longer claims one.
 */
export default async function IndividualBranchPage({ params }: BranchPageProps) {
  const { slug } = await params;
  const index = BRANCHES.findIndex((b) => b.slug === slug);
  const branch = BRANCHES[index];

  if (!branch) {
    notFound();
  }


  return (
    <main className="tone-ink min-h-screen bg-surface text-fg">
      <PageHeader
        title={branch.name}
        subtitle={branch.tagline}
        breadcrumbs={[{ label: 'Studios', href: '/branches' }, { label: branch.name }]}
      />

      <Section tone="paper" revealBody={false}>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            {/* See the studio index: a branch with no photograph gets a
                typographic plate, which must not sit in the drift layer. */}
            <Parallax
              data-reveal=""
              still={!branch.image}
              className="aspect-[4/3] border border-rule bg-surface-raised"
            >
              <BranchImage
                src={branch.image}
                name={branch.name}
                city={branch.city}
                sizes="(max-width: 1024px) 100vw, 58vw"
                priority
              />
            </Parallax>

            <p data-reveal className="type-body mt-8 text-fg-muted">{branch.description}</p>

            {branch.cleanroomSpecs.length > 0 && (
              <>
                <h2 data-reveal className="type-meta mt-10 border-t border-rule pt-6 text-fg-muted">
                  Facility
                </h2>
                <dl data-reveal className="mt-4 grid gap-x-10 sm:grid-cols-2">
                  {branch.cleanroomSpecs.map((spec) => (
                    <div key={spec.label} className="border-b border-rule-soft py-3">
                      <dt className="type-detail text-fg-muted">{spec.label}</dt>
                      <dd className="mt-1 font-mono text-sm">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </>
            )}

            {branch.features.length > 0 && (
              <>
                <h2 data-reveal className="type-meta mt-10 text-fg-muted">On site</h2>
                <ul data-reveal className="mt-4">
                  {branch.features.map((f) => (
                    <li
                      key={f}
                      className="border-b border-rule-soft py-3 type-detail text-fg-muted"
                    >
                      {f}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <div className="lg:col-span-5">
            <h2 data-reveal className="type-meta text-fg-muted">Getting here</h2>
            <dl data-reveal className="mt-4">
              <div className="border-b border-rule py-4">
                <dt className="type-detail text-fg-muted">Address</dt>
                <dd className="mt-1 text-sm">{branch.address}</dd>
                {branch.locatedIn && (
                  <dd className="type-value text-fg-muted">{branch.locatedIn}</dd>
                )}
              </div>
              <div className="border-b border-rule py-4">
                <dt className="type-detail text-fg-muted">Phone</dt>
                <dd className="mt-1">
                  <a
                    href={`tel:${branch.phone.replace(/\s+/g, '')}`}
                    className="inline-flex min-h-[44px] items-center text-sm tabular-nums underline decoration-accent underline-offset-4 transition-colors hover:text-accent"
                  >
                    {branch.phone}
                  </a>
                </dd>
              </div>
              <div className="border-b border-rule py-4">
                <dt className="type-detail text-fg-muted">Hours</dt>
                {branch.hours.length > 0 ? (
                  branch.hours.map((h) => (
                    <dd key={h.days} className="mt-1 type-value text-fg-muted">
                      {h.days}: {h.time}
                    </dd>
                  ))
                ) : (
                  <dd className="mt-1 type-value text-fg-muted">Not published. Call ahead.</dd>
                )}
              </div>
            </dl>

            <div data-reveal className="mt-8 flex flex-col gap-3">
              <Link
                href={`/booking?branch=${branch.slug}`}
                className="type-meta flex min-h-[48px] items-center justify-center bg-accent px-6 text-on-accent transition-colors hover:bg-accent-hover"
              >
                Book at this studio
              </Link>
              <a
                href={branch.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="type-meta flex min-h-[48px] items-center justify-center border border-rule px-6 text-fg transition-colors hover:border-accent hover:text-accent"
              >
                Open in Google Maps
              </a>
            </div>

            {/* This studio's own Facebook page, not the company one. Renders
                nothing until a URL is set on the branch record. */}
            {branch.facebook && (
              <div data-reveal className="mt-8 border-t border-rule pt-6">
                <h2 className="type-meta text-fg-muted">Follow this studio</h2>
                <SocialLinks
                  facebook={branch.facebook}
                  facebookLabel={`${branch.name} on Facebook`}
                  className="mt-2"
                />
              </div>
            )}

            {branch.coords.precision === 'area' && (
              <p data-reveal className="mt-6 type-detail text-fg-muted">
                826 has not published a street address for this studio. The map pin locates the
                area, so call before travelling.
              </p>
            )}
          </div>
        </div>
      </Section>

      <Section
        tone="ink"
        label="Services"
        title="What 826 does."
        intro="826 has not published a per-studio service list, so call this studio to confirm it takes the work you need."
        revealBody={false}
      >
        <RuledGrid as="ul" className="sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <li key={s.slug} data-reveal className={`${RULED_CELL} bg-surface`}>
              <Link
                href={`/services/${s.slug}`}
                className="group flex h-full flex-col gap-3 p-6 transition-colors hover:bg-surface-raised"
              >
                <span className="type-meta text-accent">{String(i + 1).padStart(2, '0')}</span>
                <span className="type-card">{s.shortTitle}</span>
                <span className="type-detail text-fg-muted">{s.tagline}</span>
              </Link>
            </li>
          ))}
        </RuledGrid>
      </Section>
    </main>
  );
}
