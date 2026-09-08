import { Metadata } from 'next';
import Link from 'next/link';
import { Reveal } from '@/components/common/Reveal';
import { BookingForm } from '@/components/booking/BookingForm';
import { toVehicleSegment } from '@/lib/data/pricing';
import { STUDIO_COUNT } from '@/lib/data/branches';

export const metadata: Metadata = {
  title: 'Book a consultation',
  description: `Tell 826 what the vehicle is and which of the ${STUDIO_COUNT} studios suits you, then call to confirm the slot.`,
};

interface BookingPageProps {
  searchParams: Promise<{
    service?: string;
    branch?: string;
    segment?: string;
  }>;
}

/**
 * Booking.
 *
 * THE FORM IS THE PAGE. Every other route on this site opens with a masthead -
 * `PageHeader`, a display-tier heading, a standfirst, 128px of padding above it
 * - and that is right for a page you have arrived at to read. This is a page
 * you have arrived at to USE, from a button that already said "Book": the
 * heading "Tell us about the car." was 250px of screen spent telling somebody
 * who had just pressed Book that they were about to book something. Mark asked
 * for the form to be visible the moment the page opens, on 2026-09-07.
 *
 * So this lays out its own compact head instead of using PageHeader: the same
 * breadcrumb, a section-tier heading rather than the display tier, and only
 * enough top padding to clear the fixed header. The first two fields are above
 * the fold on a phone.
 *
 * The stats bar that used to sit under the old masthead promised a "40-Point
 * Map" intake assessment, a "HEPA Sterile" bay, a lighting spectrum and
 * "Instant Protocol" confirmation. None of those are published and the last was
 * actively untrue, since the form sends nothing. See BookingForm.
 *
 * `?service=`, `?branch=` and `?segment=` are carried through from the pricing
 * page's package buttons and the studio pages, so arriving from one of those
 * lands with that choice already made.
 */
export default async function BookingPage({ searchParams }: BookingPageProps) {
  const { service, branch, segment } = await searchParams;

  return (
    <main className="tone-ink min-h-screen bg-surface text-fg">
      <div className="mx-auto w-full max-w-7xl px-6 pb-20 pt-24 sm:px-8 sm:pb-28 lg:pt-28">
        <Reveal entrance>
          <div className="mx-auto max-w-2xl">
            <nav
              aria-label="Breadcrumb"
              data-reveal
              className="type-meta mb-5 flex flex-wrap items-center gap-2 text-fg-muted"
            >
              <Link href="/" className="inline-block py-1 transition-colors hover:text-fg">
                Home
              </Link>
              <span aria-hidden>/</span>
              <span className="text-accent" aria-current="page">
                Book a consultation
              </span>
            </nav>

            <h1 data-reveal className="type-section">
              Book a consultation.
            </h1>
          </div>

          {/* One reveal scope, and the form marked as a single block within it.
              The fields must not cascade in one by one: this is a form somebody
              is about to type into, and a control that is still arriving is a
              control you cannot click yet. */}
          <div data-reveal className="mt-7">
            <BookingForm
              initialService={service}
              initialBranch={branch}
              initialSegment={toVehicleSegment(segment) ?? undefined}
            />
          </div>
        </Reveal>
      </div>
    </main>
  );
}
