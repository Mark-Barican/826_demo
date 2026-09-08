'use client';

import { useState } from 'react';
import Link from 'next/link';
import { HeroVideo } from './HeroVideo';
import { POSTER_PANELS, POSTER_CAR, type HeroPhase } from '@/lib/hero/frameMap';
import type { HeroMode } from '@/lib/hero/mode';

/**
 * Hero overlay.
 *
 * THE SEQUENCE RUNS BACKWARDS. Scrolling down takes you from the cut PPF
 * panels, through the film wrapping onto the car, to the finished vehicle. The
 * copy below is written to that order and its boundaries come from
 * `phaseForFrame` rather than hardcoded numbers - see lib/hero/frameMap.ts.
 *
 * Two things about the footage decide this layout, both measured off the frames
 * rather than guessed:
 *
 * 1. **It is a light scene.** The studio backdrop runs 121-148 luma at its
 *    darkest. Against it, white text is 2.12:1 and the brand gold is 1.03:1 -
 *    both effectively invisible, which is why an earlier overlay could not be
 *    read. Near-black is 4.7:1 at the worst corner and 5-9:1 across the bands
 *    used here, so all hero type is near-black.
 * 2. **The car owns the middle.** Sampling every third frame, nothing darker
 *    than the backdrop ever enters rows 0-36% or 72-100%; the car and film
 *    occupy 38-70%. Type therefore sits in those two clear bands and never
 *    between them. That is also where the motion is: 79% of all frame-to-frame
 *    change happens in the middle third.
 *
 * No scrim. A scrim here would be decoration doing no work, because near-black
 * already clears AA against the backdrop unaided.
 */
export function HeroSection() {
  const [mode, setMode] = useState<HeroMode | null>(null);
  // Phase, not frame: three state changes across the whole scroll rather than a
  // re-render of this tree on every tick.
  const [phase, setPhase] = useState<HeroPhase>('panels');

  const isStill = mode === 'still';

  return (
    <section className="relative w-full bg-[#08080a]">
      <HeroVideo
        className={
          isStill
            ? 'relative flex w-full flex-col items-center gap-4 bg-[#08080a] px-6 py-32 md:flex-row'
            : 'relative h-[100svh] w-full overflow-hidden bg-[#08080a] hero-band:flex hero-band:flex-col'
        }
        onMode={setMode}
        onPhase={setPhase}
      >
        {isStill ? (
          // Reduced motion: static two-up on the dark surface, in the same order
          // the scrub tells it - panels first, finished car second.
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
            <div className="mb-8">
              <h1 className="type-display max-w-3xl text-white">
                The Art of the Flawless Finish
              </h1>
              <p className="type-body mt-5 max-w-2xl text-zinc-300">
                Film cut to the exact shape of your panels, wrapped on by hand, over the paint you
                already have.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {STILLS.map((f) => (
                <div
                  key={f.src}
                  className="relative aspect-[16/9] overflow-hidden border border-white/10 bg-[#0e0e12]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.src} alt={f.alt} className="h-full w-full object-cover" />
                  <div className="type-meta absolute bottom-3 left-3 border border-white/10 bg-black/80 px-3 py-1 text-[#d4af37]">
                    {f.caption}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/booking"
                className="type-meta inline-flex min-h-[48px] items-center bg-accent px-6 text-on-accent transition-colors hover:bg-accent-hover"
              >
                Book Consultation
              </Link>
              <Link
                href="/services"
                className="type-meta inline-flex min-h-[48px] items-center border border-rule px-6 text-fg transition-colors hover:border-accent hover:text-accent"
              >
                Our Services
              </Link>
            </div>
          </div>
        ) : (
          // Scroll-driven overlay, in two geometries.
          //
          // COVER (wider than 4/3). The overlay floats over the footage.
          // justify-between pins the two text groups to the clear bands top and
          // bottom, leaving 38-70% - the car, and 79% of the sequence's motion -
          // completely unobstructed.
          //
          // BAND (4/3 and taller). Nothing floats over anything: the section
          // becomes a flex column of headline / footage / supporting line, this
          // wrapper goes `display: contents` so its two cells become items of
          // that column, and `order` puts them either side of the video. The
          // type therefore lands in the dark above and below the footage rather
          // than on it - which is also why it flips to light here. Near-black is
          // only legible ON the light studio scene; over the letterbox it would
          // be invisible.
          //
          // THE FOOTAGE TAKES WHAT IS LEFT, and that is the point of doing it
          // this way rather than reserving a 16:9 slot. The two text blocks are
          // as tall as their content; the video is `flex-1 min-h-0` and
          // letterboxes into whatever remains. On a 390x844 phone that is a
          // 384x216 strip; on a 320x568 one the same layout hands it less and
          // the car simply comes out smaller, whole, rather than the text
          // running off the bottom of the screen. A fixed 16:9 slot could not
          // do that: measured, the supporting line and its two buttons need
          // 257px on a 320 and only about 120px was going spare.
          <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between px-6 pb-8 pt-20 hero-band:static hero-band:contents sm:px-12 sm:pb-12 sm:pt-24 lg:px-16">
            {/* TOP BAND (clear to 36%) — headline */}
            {/* `pt` clears the fixed header, which is 73px tall on a phone and
                85px from `sm` up - the logo steps up and the bar is padded
                more. 80px cleared the first and sat 5px under the second, so
                the tablet headline was tucked behind the bar. */}
            <div className="mx-auto w-full max-w-7xl hero-band:relative hero-band:z-20 hero-band:order-1 hero-band:shrink-0 hero-band:px-6 hero-band:pt-20 hero-band:sm:pt-28">
              <div className="grid max-w-3xl">
                {PHASES.map((p) => {
                  const active = phase === p.id;
                  return (
                    <div
                      key={p.id}
                      aria-hidden={!active}
                      className={`[grid-area:1/1] self-start transition-[opacity,transform] duration-700 ease-out ${
                        active ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0'
                      }`}
                    >
                      {p.id === 'panels' ? (
                        <h1 className="text-[2.1rem] font-semibold leading-[1.0] tracking-[-0.025em] text-[#08080a] [font-stretch:118%] hero-band:text-white sm:text-5xl lg:text-6xl hero-tight-heading">
                          {p.heading}
                        </h1>
                      ) : (
                        <h2 className="text-[2.1rem] font-semibold leading-[1.0] tracking-[-0.025em] text-[#08080a] [font-stretch:118%] hero-band:text-white sm:text-5xl lg:text-6xl hero-tight-heading">
                          {p.heading}
                        </h2>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* BOTTOM BAND (clear from 72%) — supporting line and actions.
                In band mode this sits under the footage; `pb-24` keeps the CTAs
                clear of the fixed BOOK/CALL bar, which is bottom-anchored over
                this section and does not push it. */}
            <div className="mx-auto w-full max-w-7xl hero-band:relative hero-band:z-20 hero-band:order-3 hero-band:shrink-0 hero-band:px-6 hero-band:pb-24 hero-band:pt-6 hero-band-tight:pb-20 hero-band-tight:pt-3">
              <div className="grid">
                {PHASES.map((p) => {
                  const active = phase === p.id;
                  return (
                    <div
                      key={p.id}
                      aria-hidden={!active}
                      className={`[grid-area:1/1] self-end transition-[opacity,transform] duration-700 ease-out ${
                        active ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
                      }`}
                    >
                      <p className="type-body hero-tight-body max-w-xl text-[#08080a]/85 hero-band:text-zinc-300">
                        {p.body}
                      </p>
                      {p.actions && (
                        <div
                          className={`mt-5 flex flex-wrap items-center gap-3 hero-band-tight:mt-3 hero-band-tight:gap-2 ${
                            active ? 'pointer-events-auto' : ''
                          }`}
                        >
                          {p.actions.map((a, i) => (
                            <Link
                              key={a.href}
                              href={a.href}
                              tabIndex={active ? undefined : -1}
                              // Two colourways, because the ground changes.
                              // Over the light studio scene the primary is
                              // near-black; over the band's letterbox it is the
                              // brand gold, which is what this site uses for a
                              // mark on a dark field (see --c-accent-brand).
                              className={
                                i === 0
                                  ? 'type-meta inline-flex min-h-[48px] items-center bg-[#08080a] px-6 text-white transition-colors hover:bg-[#1c1c20] hero-band:bg-[#d4af37] hero-band:text-[#08080a] hero-band:hover:bg-[#c39f2f] hero-band-tight:min-h-[44px] hero-band-tight:px-5'
                                  : 'type-meta inline-flex min-h-[48px] items-center border border-[#08080a]/35 px-6 text-[#08080a] transition-colors hover:bg-[#08080a]/5 hero-band:border-white/35 hero-band:text-white hero-band:hover:bg-white/10 hero-band-tight:min-h-[44px] hero-band-tight:px-5'
                              }
                            >
                              {a.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </HeroVideo>
    </section>
  );
}

/** The two frames kept from the old sequence, in the order the scrub shows them. */
const STILLS = [
  {
    src: POSTER_PANELS,
    alt: 'Paint protection film cut into separate panel-shaped sheets, laid out beside the car it was measured for',
    caption: '01 · Film cut to panel',
  },
  {
    src: POSTER_CAR,
    alt: 'The same car in the studio with the film applied',
    caption: '02 · On the car',
  },
] as const;

/**
 * Phase copy, in scroll order. Which phase shows is decided by `phaseForFrame`
 * in lib/hero/frameMap.ts from the same segment table that drives the scrub, so
 * the copy cannot drift out of sync with the footage.
 *
 * The story runs panels -> wrap -> finished car, so the payoff line and the
 * pricing CTA now land on the finished vehicle rather than on loose sheets of
 * film, which is where the old forward-running edit left them.
 *
 * Deliberately free of warranty periods, coverage percentages and durability
 * figures: 826 has published none. See lib/data/claims.ts.
 */
const PHASES: ReadonlyArray<{
  id: HeroPhase;
  heading: string;
  body: string;
  actions?: ReadonlyArray<{ href: string; label: string }>;
}> = [
  {
    id: 'panels',
    heading: 'The Art of the Flawless Finish.',
    body: 'It starts as flat sheets of film, cut to the exact shape of your panels before anything touches the car.',
    actions: [
      { href: '/booking', label: 'Book Consultation' },
      { href: '/services', label: 'Our Services' },
    ],
  },
  {
    id: 'wrapping',
    heading: 'Wrapped on by hand.',
    body: 'Each piece goes on over the paint you already have, tucked around the edges by hand. No blade ever touches your car.',
  },
  {
    id: 'finished',
    heading: 'This is what you drive away with.',
    body: 'Your colour, unchanged. From here the film takes the stone chips and the wash marks instead of your paint.',
    actions: [
      { href: '/pricing', label: 'View Packages & Pricing' },
      { href: '/work', label: 'View Works' },
    ],
  },
];
