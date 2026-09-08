import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/common/PageHeader';
import { LegalSection, P, Bullets, Unpublished } from '@/components/common/LegalBody';
import { Reveal } from '@/components/common/Reveal';
import { LEGAL, TRADING_NAME } from '@/lib/data/legal';
import { ANALYTICS_INSTALLED } from '@/lib/data/analytics';
import { PRIMARY_BRANCH, STUDIO_COUNT } from '@/lib/data/branches';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: ANALYTICS_INSTALLED
    ? 'What this website does and does not collect. No cookies, a cookieless visit counter you can switch off, and no form that sends anything.'
    : 'What this website does and does not collect. No cookies, no analytics, and no form on the site sends anything.',
};

/**
 * Privacy policy.
 *
 * Written from what the code actually does - see the note at the top of
 * lib/data/legal.ts, which lists what was checked.
 *
 * IT DESCRIBES THE BUILD IT IS IN, rather than a fixed set of claims. Visit
 * measurement is switched on by an environment variable, so a deployment with
 * it set and one without genuinely do different things to a visitor, and a
 * single fixed wording would be a lie in one of them. `ANALYTICS_INSTALLED`
 * decides which description is true here; section 4 exists either way so the
 * numbering does not shift between builds.
 *
 * This will stop being accurate the day the booking form is wired to a real
 * endpoint. Revisit it then.
 */
export default function PrivacyPage() {
  return (
    <main className="tone-ink min-h-screen bg-surface text-fg">
      <PageHeader
        title="What we collect."
        subtitle={
          ANALYTICS_INSTALLED
            ? 'Short answer: no cookies, no accounts, and none of the forms send anything anywhere. Visits are counted with a cookieless tool you can switch off.'
            : 'Short answer: this website collects nothing about you. No cookies, no analytics, and none of the forms send anything anywhere.'
        }
        breadcrumbs={[{ label: 'Privacy policy' }]}
      />

      <div className="tone-paper bg-surface text-fg">
        <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-8 sm:py-20">
          <LegalSection n={1} title="The short version">
            <P>
              {TRADING_NAME} runs this website to show its work and to tell you where the studios
              are and what things cost. It does not track you, profile you, or build a record of
              your visit.
            </P>
            <Bullets
              items={
                ANALYTICS_INSTALLED
                  ? [
                      'No cookies are set by this site.',
                      'There is no Google Analytics, no advertising pixel and no tag manager.',
                      'Visits are counted anonymously, and you can switch that off. See section 4.',
                      'The only thing saved in your browser is your answer to that choice.',
                      'There are no accounts, so there is nothing to log into.',
                      'No form on this site transmits your details anywhere. See section 3.',
                    ]
                  : [
                      'No cookies are set, and nothing is saved in your browser.',
                      'There is no Google Analytics, no advertising pixel and no tag manager.',
                      'There are no accounts, so there is nothing to log into.',
                      'No form on this site transmits your details anywhere. See section 3.',
                    ]
              }
            />
          </LegalSection>

          <LegalSection n={2} title="Who is responsible">
            <P>
              This site is operated by {TRADING_NAME}, which runs {STUDIO_COUNT} studios across
              Metro Manila, Rizal and Cavite.
            </P>
            <P>
              Registered business name and registration number:{' '}
              {LEGAL.registeredName && LEGAL.registrationNumber ? (
                <>
                  {LEGAL.registeredName}, {LEGAL.registrationNumber}.
                </>
              ) : (
                <Unpublished what="Registration details" />
              )}
            </P>
            <P>
              For anything about this policy, the quickest route is the phone. Call{' '}
              {PRIMARY_BRANCH.city} on {PRIMARY_BRANCH.phone}, or any studio on the{' '}
              <Link href="/branches" className="underline decoration-accent underline-offset-4">
                studios page
              </Link>
              . An email address for privacy requests is{' '}
              {LEGAL.privacyEmail ?? <Unpublished what="An inbox" />}.
            </P>
          </LegalSection>

          <LegalSection n={3} title="The booking form does not send anything">
            <P>
              This is worth stating plainly, because most websites work the other way. The booking
              form on this site is not connected to {TRADING_NAME}. What you type stays in your own
              browser, is used only to build the summary shown at the end, and disappears when you
              close the tab. Nothing is emailed, stored or transmitted.
            </P>
            <P>
              That is why the last step asks you to phone the studio and read the summary out. Once
              you make that call, you are sharing your details with the studio directly, over the
              phone, in the ordinary way.
            </P>
          </LegalSection>

          <LegalSection n={4} title="How visits are counted">
            {ANALYTICS_INSTALLED ? (
              <>
                <P>
                  This site counts page views using Plausible, an analytics service chosen
                  specifically for what it does not do. It sets no cookies. It does not store your
                  IP address. It cannot follow you to another website, and it does not build a
                  profile of you or try to work out who you are. What {TRADING_NAME} gets is a
                  count: how many people looked at a page, and roughly where in the world and from
                  which kind of device.
                </P>
                <P>
                  Because none of that identifies you, it is not personal information and this site
                  does not ask your permission for it. You can still refuse. On your first visit a
                  notice at the bottom of the screen offers to turn it off; choose &ldquo;Turn
                  off&rdquo; and the counter is never loaded again in this browser.
                </P>
                <P>
                  Remembering that answer is the one and only thing this site saves in your
                  browser. It is a single stored setting rather than a cookie, it is never sent
                  anywhere, and clearing your browsing data removes it - after which the notice
                  will ask again.
                </P>
              </>
            ) : (
              <P>
                They are not. This build of the site runs no analytics of any kind: no page-view
                counter, no heatmaps, no session recording. Nobody is told that you were here.
              </P>
            )}
          </LegalSection>

          <LegalSection n={5} title="What third parties see">
            <P>
              Two things on this site load from other companies, and those companies will see your
              IP address and browser details as a normal consequence of your device requesting a
              file from them.
            </P>
            <Bullets
              items={[
                ...(ANALYTICS_INSTALLED
                  ? [
                      <React.Fragment key="plausible">
                        <strong className="text-fg">The visit counter.</strong> A small script
                        loads from plausible.io on every page, unless you have turned it off. See
                        section 4.
                      </React.Fragment>,
                    ]
                  : []),
                <>
                  <strong className="text-fg">The studios map.</strong> Map tiles and styling come
                  from CARTO (basemaps.cartocdn.com), and a supporting script from unpkg.com. These
                  load only on pages that show the map.
                </>,
                <>
                  <strong className="text-fg">Links out.</strong> The &ldquo;Directions&rdquo; links
                  open Google Maps. Once you are there, Google&rsquo;s own terms and privacy policy
                  apply, not this one.
                </>,
                <>
                  <strong className="text-fg">Fonts.</strong> Typefaces are served from this site
                  itself, not from a font network, so no third party is contacted for them.
                </>,
              ]}
            />
            <P>
              Like any website, the server that delivers these pages may keep standard access logs
              kept by the hosting provider. Details of that provider and its retention period:{' '}
              <Unpublished what="Hosting details" />.
            </P>
          </LegalSection>

          <LegalSection n={6} title="Information you give a studio directly">
            <P>
              When you call, message or visit a studio, you will usually give your name, a contact
              number and details of your vehicle. A studio uses that to quote the work, book the
              slot and contact you about the job. That happens in the studio, not on this website,
              and this policy does not govern it.
            </P>
            <P>
              If you want to know what a studio holds about you, ask the studio. Under the
              Philippines Data Privacy Act of 2012 you have rights over your personal information,
              including the right to be told what is held, to have it corrected, and to object to
              how it is used.
            </P>
          </LegalSection>

          <LegalSection n={7} title="Children">
            <P>
              This site is aimed at vehicle owners and is not directed at children. Nothing here
              knowingly collects information from anyone.
            </P>
          </LegalSection>

          <LegalSection n={8} title="Changes">
            <P>
              If this site starts doing something different - if the booking form is connected, or
              the way visits are counted changes - this page must be updated before that change
              goes live. That is not a formality: section 4 is written from the setting that
              actually switches measurement on, so the two cannot drift apart. This wording was
              written on {LEGAL.lastUpdated}
              {LEGAL.lastReviewed ? ` and last reviewed on ${LEGAL.lastReviewed}` : ''}.
            </P>
          </LegalSection>

          <Reveal className="border-t border-rule pt-10">
            <Link
              href="/terms"
              className="type-meta group inline-flex flex-col gap-2 text-fg transition-colors hover:text-accent"
            >
              <span>Read the terms of use</span>
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
