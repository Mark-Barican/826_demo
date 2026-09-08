import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { PageHeader } from '@/components/common/PageHeader';
import { Parallax } from '@/components/common/Parallax';
import { Reveal } from '@/components/common/Reveal';
import { RuledGrid, RULED_CELL } from '@/components/common/RuledGrid';
import { Section } from '@/components/common/Section';
import { SERVICES } from '@/lib/data/services';

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) return { title: 'Service not found' };

  return {
    title: service.title,
    description: service.description,
  };
}

/**
 * Service detail.
 *
 * The process is a numbered editorial sequence rather than a row of cards, and
 * both the heading and the layout are driven by `process.length`. The old
 * version hardcoded `md:grid-cols-5` and the heading "The 5-Stage Scientific
 * Workflow", which silently assumed every service has exactly five steps.
 *
 * Two stats were removed: "Facility Standard: Cleanroom Sterile" and
 * "Technician Standard: Master Certified" - see lib/data/claims.ts.
 */
/** Column class for a package row that cannot fill three. */
const NARROW_COLUMNS: Record<number, string> = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
};

export default async function IndividualServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const index = SERVICES.findIndex((s) => s.slug === slug);
  const service = SERVICES[index];

  if (!service) {
    notFound();
  }

  const next = SERVICES[(index + 1) % SERVICES.length];
  const previous = SERVICES[(index - 1 + SERVICES.length) % SERVICES.length];

  return (
    <main className="tone-ink min-h-screen bg-surface text-fg">
      <PageHeader
        title={service.title}
        subtitle={service.tagline}
        breadcrumbs={[{ label: 'Services', href: '/services' }, { label: service.shortTitle }]}
      />

      <Section tone="paper" revealBody={false}>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Parallax data-reveal="" className="aspect-[4/3] border border-rule bg-surface-raised">
              <Image
                src={service.heroImage}
                alt={service.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 58vw"
                priority
              />
            </Parallax>

            <dl data-reveal className="mt-8 grid gap-x-10 sm:grid-cols-2">
              {service.specs.map((spec) => (
                <div key={spec.label} className="border-b border-rule-soft py-3">
                  <dt className="type-detail text-fg-muted">{spec.label}</dt>
                  <dd className="mt-1 font-mono text-sm">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-5">
            <p data-reveal className="type-body text-fg-muted">{service.description}</p>

            <h2 data-reveal className="type-meta mt-10 border-t border-rule pt-6 text-fg-muted">
              What it covers
            </h2>
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

            <Link
              data-reveal
              href={`/booking?service=${service.slug}`}
              className="type-meta mt-10 flex min-h-[48px] items-center justify-center bg-accent px-6 text-on-accent transition-colors hover:bg-accent-hover"
            >
              Book this service
            </Link>
          </div>
        </div>
      </Section>

      <Section
        tone="ink"
        label="Process"
        title={`${service.process.length} stages, in order.`}
        revealBody={false}
      >
        {/* A stage at a time. The list runs the height of several screens, so
            the shared section trigger would have played the last stage long
            before anyone read the first. */}
        <Reveal each>
          <ol className="border-t border-rule">
            {service.process.map((step) => (
              <li key={step.step} data-reveal className="border-b border-rule">
                <div className="grid gap-3 py-8 lg:grid-cols-12 lg:gap-10">
                  <span className="type-meta text-accent lg:col-span-1">{step.step}</span>
                  <h3 className="type-card lg:col-span-4">{step.title}</h3>
                  <p className="type-body text-fg-muted lg:col-span-7">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </Section>

      <Section tone="paper" label="Packages" title="What you can book." revealBody={false}>
        {/* Columns follow the package count, so a service with one or two of
            them fills the row rather than leaving the rest of it blank. Class
            names are written out because Tailwind only ships what it can see. */}
        <RuledGrid className={NARROW_COLUMNS[service.packages.length] ?? 'lg:grid-cols-3'}>
          {service.packages.map((pkg) => (
            <article
              key={pkg.name}
              data-reveal
              className={`${RULED_CELL} flex flex-col justify-between bg-surface p-8`}
            >
              <div>
                <h3 className="type-card">{pkg.name}</h3>
                <p className="mt-3 font-mono text-2xl tabular-nums text-accent">{pkg.price}</p>
                <p className="mt-4 type-detail text-fg-muted">{pkg.description}</p>
                <ul className="mt-6 border-t border-rule pt-4">
                  {pkg.features.map((f) => (
                    <li
                      key={f}
                      className="border-b border-rule-soft py-2.5 type-value text-fg-muted last:border-0"
                    >
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href={`/booking?service=${service.slug}`}
                className="type-meta mt-8 flex min-h-[48px] items-center justify-center border border-rule px-6 text-fg transition-colors hover:border-accent hover:text-accent"
              >
                Book
              </Link>
            </article>
          ))}
        </RuledGrid>
      </Section>

      <Section tone="ink" flush className="border-t border-rule py-10">
        <nav aria-label="Other services" className="flex items-center justify-between gap-6">
          <Link href={`/services/${previous.slug}`} className="group max-w-[45%]">
            <span className="type-meta block text-fg-muted">Previous</span>
            <span className="type-card mt-2 block transition-colors group-hover:text-accent">
              {previous.shortTitle}
            </span>
          </Link>
          <Link href={`/services/${next.slug}`} className="group max-w-[45%] text-right">
            <span className="type-meta block text-fg-muted">Next</span>
            <span className="type-card mt-2 block transition-colors group-hover:text-accent">
              {next.shortTitle}
            </span>
          </Link>
        </nav>
      </Section>
    </main>
  );
}
