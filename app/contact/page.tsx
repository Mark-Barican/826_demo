import { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/common/PageHeader';
import { Reveal } from '@/components/common/Reveal';
import { Section } from '@/components/common/Section';
import { BRANCHES, STUDIO_COUNT } from '@/lib/data/branches';
import { BRAND_NAME } from '@/lib/data/brand';

export const metadata: Metadata = {
  title: 'Contact & Studio Directory',
  description: `Phone numbers, addresses and hours for all ${STUDIO_COUNT} ${BRAND_NAME} studios in Metro Manila, Rizal and Cavite.`,
};

/**
 * Contact.
 *
 * Rewritten around what 826 has actually published: a phone number per studio,
 * addresses, and hours. The previous version described a "central concierge
 * desk" with a 24-hour email response, but no email address exists in the data
 * for any branch, and the hotline was simply the Scout Limbaga mobile. There is
 * also no contact form on this page, so it no longer implies one - it points at
 * the phone numbers, which are the real channel.
 */
export default function ContactPage() {
  return (
    <main className="tone-ink min-h-screen bg-surface text-fg">
      <PageHeader
        title="Talk to a studio."
        subtitle="Every studio takes its own calls. Pick the one nearest you, or start a booking and we will come back to you."
        breadcrumbs={[{ label: 'Contact' }]}
      />

      <Section
        tone="paper"
        label="Direct lines"
        title="Every studio, every number."
        intro="826 has not published a head-office line or an inbox. These are the numbers that reach each studio directly."
        revealBody={false}
      >
        {/* Its own scope, and one trigger per row. The directory is taller than
            the viewport, so a single trigger at the top of the section would
            play the Cavite row while the reader is still on Quezon City. */}
        <Reveal each>
          <ul>
            {BRANCHES.map((b, i) => (
              <li key={b.slug} data-reveal className="border-t border-rule last:border-b">
                <div className="grid gap-4 py-8 lg:grid-cols-12 lg:gap-8">
                  <div className="lg:col-span-1">
                    <span className="type-meta text-accent">{String(i + 1).padStart(2, '0')}</span>
                  </div>

                  <div className="lg:col-span-4">
                    <h3 className="type-card">{b.name}</h3>
                    <p className="mt-2 type-value text-fg-muted">{b.address}</p>
                    {b.locatedIn && <p className="type-value text-fg-muted">{b.locatedIn}</p>}
                  </div>

                  <div className="lg:col-span-3">
                    <a
                      href={`tel:${b.phone.replace(/\s+/g, '')}`}
                      className="type-meta inline-flex min-h-[44px] items-center tabular-nums text-fg underline decoration-accent underline-offset-4 transition-colors hover:text-accent"
                    >
                      {b.phone}
                    </a>
                    {b.email ? (
                      <p className="mt-2 type-value text-fg-muted">{b.email}</p>
                    ) : (
                      <p className="mt-2 type-value text-fg-muted">No published email</p>
                    )}
                  </div>

                  <div className="lg:col-span-2">
                    {b.hours.length > 0 ? (
                      b.hours.map((h) => (
                        <p key={h.days} className="type-value text-fg-muted">
                          <span className="block text-fg">{h.days}</span>
                          {h.time}
                        </p>
                      ))
                    ) : (
                      <p className="type-value text-fg-muted">Hours not published. Call ahead.</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 lg:col-span-2">
                    <Link
                      href={`/booking?branch=${b.slug}`}
                      className="type-meta inline-flex min-h-[44px] items-center justify-center bg-accent px-4 text-on-accent transition-colors hover:bg-accent-hover"
                    >
                      Book here
                    </Link>
                    <a
                      href={b.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="type-meta inline-flex min-h-[44px] items-center justify-center border border-rule px-4 text-fg transition-colors hover:border-accent hover:text-accent"
                    >
                      Directions
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      <Section tone="ink" title="Rather we called you?" display revealBody={false}>
        <p data-reveal className="type-body text-fg-muted">
          Start a booking and tell us the vehicle and the work you are considering. It takes about
          a minute.
        </p>
        <Link
          data-reveal
          href="/booking"
          className="type-meta mt-8 inline-flex min-h-[48px] items-center bg-accent px-8 text-on-accent transition-colors hover:bg-accent-hover"
        >
          Start a booking
        </Link>
      </Section>
    </main>
  );
}
