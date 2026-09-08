import { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/common/PageHeader';
import { LegalSection, P, Bullets, Unpublished } from '@/components/common/LegalBody';
import { Reveal } from '@/components/common/Reveal';
import { LEGAL, TRADING_NAME } from '@/lib/data/legal';
import { PRIMARY_BRANCH } from '@/lib/data/branches';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description:
    'The terms this website is provided under: prices are indicative, booking is confirmed by phone, and photographs are 826 own work.',
};

/**
 * Terms of use.
 *
 * Scoped deliberately to the WEBSITE, not to the workshop contract. 826 has not
 * published its service terms, warranty periods or cancellation policy, and
 * inventing them here would be inventing a contract - the same problem
 * lib/data/claims.ts exists to prevent. Where a term would need one of those
 * facts, this page says the studio sets it in writing at the time of quoting.
 *
 * See the note at the top of lib/data/legal.ts before publishing.
 */
export default function TermsPage() {
  return (
    <main className="tone-ink min-h-screen bg-surface text-fg">
      <PageHeader
        title="Terms of use."
        subtitle="What this website is, what the prices on it mean, and where the actual agreement for work on your vehicle comes from."
        breadcrumbs={[{ label: 'Terms of use' }]}
      />

      <div className="tone-paper bg-surface text-fg">
        <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-8 sm:py-20">
          <LegalSection n={1} title="What these terms cover">
            <P>
              These terms apply to your use of this website. They are not the agreement for work on
              your vehicle. That agreement is made with a studio when you book, and its terms are
              the ones written on the quote and job sheet you are given.
            </P>
            <P>
              The site is operated by {TRADING_NAME}. Registered business details:{' '}
              {LEGAL.registeredName && LEGAL.registrationNumber ? (
                <>
                  {LEGAL.registeredName}, {LEGAL.registrationNumber}.
                </>
              ) : (
                <Unpublished what="Registration details" />
              )}
            </P>
          </LegalSection>

          <LegalSection n={2} title="Prices are indicative">
            <P>
              The prices shown under packages and pricing are starting points for a vehicle in
              normal condition. They are not a quote and not an offer.
            </P>
            <Bullets
              items={[
                'The final price depends on the vehicle, its size and the condition of the paint when it is inspected.',
                'A studio will give you a price and a scope of work before any work begins.',
                'Prices on this site can change without notice. The price you are quoted in person is the one that applies.',
                'All prices are in Philippine pesos.',
              ]}
            />
          </LegalSection>

          <LegalSection n={3} title="Booking">
            <P>
              The booking form on this site does not send anything. It builds a summary in your
              browser and asks you to phone the studio. Filling it in does not reserve a slot, and
              nothing is booked until a studio confirms it with you directly.
            </P>
            <P>
              To book, call {PRIMARY_BRANCH.city} on {PRIMARY_BRANCH.phone}, or the studio nearest
              you from the{' '}
              <Link href="/branches" className="underline decoration-accent underline-offset-4">
                studios page
              </Link>
              .
            </P>
          </LegalSection>

          <LegalSection n={4} title="Work, warranties and aftercare">
            <P>
              Any warranty, guarantee, aftercare schedule or cancellation term that applies to work
              on your vehicle is set by the studio and given to you in writing when you book. This
              website does not state warranty periods, and nothing on it should be read as
              promising one.
            </P>
            <P>
              Published service terms:{' '}
              <Unpublished what="Written service terms" />. Ask the studio for these before you
              commit to work.
            </P>
          </LegalSection>

          <LegalSection n={5} title="Photographs and content">
            <P>
              The photographs on this site are of work carried out by {TRADING_NAME}, in its own
              studios. They show real vehicles and are not stock imagery.
            </P>
            <Bullets
              items={[
                'Photographs, text, layout and design on this site belong to 826 or are used with permission. Do not reuse them commercially without asking.',
                'Vehicles shown were photographed with the owner permission. If you are an owner and want a photograph of your vehicle removed, call any studio and it will be taken down.',
                'Brand and model names belong to their respective manufacturers and are used only to describe the vehicle in the frame.',
              ]}
            />
          </LegalSection>

          <LegalSection n={6} title="Accuracy">
            <P>
              This site is kept as accurate as reasonably possible, but details change. Opening
              hours, prices, available packages and studio addresses may be out of date at any
              given moment. If something matters to your decision, confirm it with a studio by
              phone rather than relying on the page.
            </P>
            <P>
              The studio map pins locate each studio&rsquo;s area rather than its doorway, because
              826 has not published street addresses. Call before travelling.
            </P>
          </LegalSection>

          <LegalSection n={7} title="Links to other sites">
            <P>
              Some links lead off this site, for example the directions links which open Google
              Maps. Those sites are not controlled by {TRADING_NAME} and their own terms apply once
              you arrive.
            </P>
          </LegalSection>

          <LegalSection n={8} title="Governing law">
            <P>
              These terms are governed by the laws of the Republic of the Philippines. Address for
              legal notices: {LEGAL.noticeAddress ?? <Unpublished what="An address for notices" />}.
            </P>
            <P>
              This wording was written on {LEGAL.lastUpdated}
              {LEGAL.lastReviewed ? ` and last reviewed on ${LEGAL.lastReviewed}` : ''}.
            </P>
          </LegalSection>

          <Reveal className="border-t border-rule pt-10">
            <Link
              href="/privacy"
              className="type-meta group inline-flex flex-col gap-2 text-fg transition-colors hover:text-accent"
            >
              <span>Read the privacy policy</span>
              <span
                aria-hidden
                className="h-px w-full max-w-[4rem] bg-accent transition-all duration-300 group-hover:max-w-full"
              />
            </Link>
          </Reveal>
        </div>
      </div>
    </main>
  );
}
