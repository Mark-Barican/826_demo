import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { PageHeader } from '@/components/common/PageHeader';
import { Parallax } from '@/components/common/Parallax';
import { RuledGrid, RULED_CELL } from '@/components/common/RuledGrid';
import { Section } from '@/components/common/Section';
import { STUDIO_COUNT_WORD } from '@/lib/data/branches';
import { BRAND_NAME } from '@/lib/data/brand';

export const metadata: Metadata = {
  title: 'About',
  description: `How ${BRAND_NAME} works: the install standards, the lighting, and the studios behind the paint protection film and correction work.`,
};

/**
 * About.
 *
 * Two things changed beyond layout.
 *
 * The stats bar asserted a "10-Year Certified" PPF warranty. That is a
 * contractual promise nobody has confirmed 826 can make, so it is out - see
 * lib/data/claims.ts.
 *
 * The tooling roster is gone entirely. It was headed "World-Class Chemical &
 * Equipment Partners" and named Scangrip, Rupes, Gyeon, Stek and XPEL, which
 * reads as a partnership or accreditation claim however it is captioned. Mark
 * asked for it removed on 2026-09-06.
 */
const STANDARDS = [
  {
    num: '01',
    title: 'No blade on paint',
    description:
      'Film patterns are plotted and cut off the vehicle, then hand-extended over edges. Nothing is trimmed with a blade against the clear coat.',
  },
  {
    num: '02',
    title: 'Daylight-spectrum inspection',
    description:
      'Bays are lit with high colour-rendering daylight fixtures rather than standard fluorescent tubes, because swirls and holograms simply do not show under the latter.',
  },
  {
    num: '03',
    title: 'Depth measured before polishing',
    description:
      'Clear coat cannot be replaced. Thickness is measured across the body before machine polishing, so correction stops before the coat is thinned.',
  },
  {
    num: '04',
    title: 'Dust controlled during install',
    description:
      'Film is installed in a closed, filtered bay. A single particle under optical film is permanent, so the air is dealt with before the car arrives.',
  },
] as const;

export default function AboutPage() {
  return (
    <main className="tone-ink min-h-screen bg-surface text-fg">
      <PageHeader
        title="How the work is done."
        subtitle="A Filipino-owned automotive care company. 826 installs paint protection film, applies graphene and ceramic coatings, fits nano ceramic tint and details cars and motorcycles across Metro Manila, Rizal and Cavite."
        breadcrumbs={[{ label: 'About' }]}
      />

      {/* The copy is marked line by line rather than as one column, so the
          kicker, the heading and the two paragraphs arrive in reading order
          with the photograph behind them. */}
      <Section tone="paper" revealBody={false}>
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <span data-reveal className="type-meta block text-accent">Who we are</span>
            <h2 data-reveal className="type-section mt-4">
              Filipino-owned, and particular about paint.
            </h2>
            <p data-reveal className="type-body mt-6 text-fg-muted">
              826 Auto Aesthetic &amp; Protection is a Filipino-owned automotive care company. We
              do premium detailing, protection and enhancement work for every kind of vehicle:
              paint protection film, graphene and ceramic coatings, interior leather care,
              windshield protection, nano ceramic tint and full auto detailing.
            </p>
            <p data-reveal className="type-body mt-4 text-fg-muted">
              Detailing here has often meant a wash and a wax. We were set up around the other
              half of the job: measuring what the paint can take, correcting it properly, and
              then protecting the result so it holds. Skilled hands, the right tools, and a
              standard we hold to whether the car is a daily sedan, a pickup that works for a
              living, or a scooter.
            </p>
            <p data-reveal className="type-body mt-4 text-fg-muted">
              The short version: we look after every vehicle that comes in as if it were our own.
            </p>
          </div>

          <div data-reveal className="lg:col-span-6">
            <Parallax className="aspect-[4/3] border border-rule bg-surface-raised">
              <Image
                src="/work/branches/c5-libis.jpg"
                alt="The 826 C5 Libis studio"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </Parallax>
          </div>
        </div>
      </Section>

      <Section
        tone="ink"
        label="Standards"
        title="Four things we hold to."
        revealBody={false}
      >
        <RuledGrid as="ol" className="sm:grid-cols-2 lg:grid-cols-4">
          {STANDARDS.map((v) => (
            <li key={v.num} data-reveal className={`${RULED_CELL} flex flex-col gap-3 bg-surface p-8`}>
              <span className="type-meta text-accent">{v.num}</span>
              <h3 className="type-card">{v.title}</h3>
              <p className="type-detail text-fg-muted">{v.description}</p>
            </li>
          ))}
        </RuledGrid>
      </Section>

      <Section tone="paper" title="Come and look at the bay." display revealBody={false}>
        <p data-reveal className="type-body text-fg-muted">
          Bring the car in. We will measure the paint, tell you what it needs and what it does
          not, and put the scope in writing before anything starts. {STUDIO_COUNT_WORD} studios
          to choose from.
        </p>
        <div data-reveal className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/booking"
            className="type-meta inline-flex min-h-[48px] items-center bg-accent px-8 text-on-accent transition-colors hover:bg-accent-hover"
          >
            Book a consultation
          </Link>
          <Link
            href="/branches"
            className="type-meta inline-flex min-h-[48px] items-center border border-rule px-8 text-fg transition-colors hover:border-accent hover:text-accent"
          >
            See the studios
          </Link>
        </div>
      </Section>
    </main>
  );
}
