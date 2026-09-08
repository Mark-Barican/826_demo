'use client';

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import Link from 'next/link';
import { Reveal } from '@/components/common/Reveal';
import { RuledGrid, RULED_CELL } from '@/components/common/RuledGrid';
import { Section } from '@/components/common/Section';
import {
  PRICING_TIERS,
  ADD_ON_SERVICES,
  PRICING_FAQS,
  VEHICLE_SEGMENTS,
  type PricingTier,
  type VehicleSegmentId,
} from '@/lib/data/pricing';

interface PricingCalculatorProps {
  /**
   * Segment to open on, from `?segment=` - the homepage vehicle router links
   * straight here, so arriving from a tile lands on that tile's prices rather
   * than resetting to Sedan.
   */
  initialSegment?: VehicleSegmentId;
}

/**
 * Packages and prices.
 *
 * The segment list now comes from `lib/data/pricing.ts` instead of being typed
 * inline here and again, differently, in BookingForm.
 *
 * Two fixes beyond layout: the active-segment row printed the literal text
 * `&#9670;` because an HTML entity was sitting inside a JavaScript string
 * rather than in JSX, and the "most requested" tier carried a gold glow
 * `box-shadow` that nothing else on the site uses.
 */
export function PricingCalculator({ initialSegment }: PricingCalculatorProps) {
  const [segment, setSegment] = useState<VehicleSegmentId>(initialSegment ?? 'sedan');
  const active = VEHICLE_SEGMENTS.find((s) => s.id === segment);
  const tiers = PRICING_TIERS.filter((tier) => tier.prices[segment]);

  return (
    <>
      <Section tone="ink" label="Step 01" title="What are you bringing in?" flush className="pt-20 pb-14 sm:pt-28" revealBody={false}>
        <fieldset data-reveal>
          <legend className="sr-only">Vehicle segment</legend>
          <RuledGrid className="sm:grid-cols-2 lg:grid-cols-5">
            {VEHICLE_SEGMENTS.map((type) => {
              const isActive = segment === type.id;
              return (
                <button
                  key={type.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setSegment(type.id)}
                  className={`${RULED_CELL} flex flex-col justify-between gap-6 p-5 text-left transition-colors ${
                    isActive
                      ? 'bg-accent text-on-accent'
                      : 'bg-surface text-fg hover:bg-surface-raised'
                  }`}
                >
                  <span>
                    <span className="type-card block">{type.label}</span>
                    <span
                      className={`mt-2 block type-detail ${
                        isActive ? 'text-on-accent/80' : 'text-fg-muted'
                      }`}
                    >
                      {type.examples}
                    </span>
                  </span>
                  <span className="type-meta">{isActive ? 'Selected' : 'Select'}</span>
                </button>
              );
            })}
          </RuledGrid>
        </fieldset>
      </Section>

      <Section
        tone="paper"
        label="Step 02"
        title={`Packages for ${active?.label.toLowerCase() ?? 'your vehicle'}.`}
        intro="Prices are for the segment selected above. Step through the packages one at a time; the scope of work is the same whichever studio does it."
      >
        {/* One reveal for the whole carousel rather than one per card. The cards
            sit inside a horizontally scrolling box, and translating them on the
            Y axis in there is exactly what would give that box a vertical
            scrollbar for the length of its own animation. */}
        <PackageCarousel tiers={tiers} segment={segment} />
      </Section>

      <Section tone="ink" label="Add-ons" title="Priced separately." revealBody={false}>
        {/* A row at a time - the add-on list is long enough that one trigger at
            the top would run it all off before the reader got there. */}
        <Reveal each stagger={0.05}>
          <ul className="border-t border-rule">
            {ADD_ON_SERVICES.map((addon) => (
              <li key={addon.name} data-reveal className="border-b border-rule">
                <div className="grid gap-2 py-5 sm:grid-cols-12 sm:items-baseline sm:gap-6">
                  <h3 className="type-card sm:col-span-4">{addon.name}</h3>
                  <p className="type-detail text-fg-muted sm:col-span-6">
                    {addon.description}
                  </p>
                  <span className="font-mono text-sm tabular-nums text-accent sm:col-span-2 sm:text-right">
                    {addon.price}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      <Section tone="paper" label="Questions" title="Before you book." revealBody={false}>
        <dl className="grid gap-x-16 gap-y-10 md:grid-cols-2">
          {PRICING_FAQS.map((faq) => (
            <div key={faq.q} data-reveal className="border-t border-rule pt-5">
              <dt className="type-card">{faq.q}</dt>
              <dd className="mt-3 type-detail text-fg-muted">{faq.a}</dd>
            </div>
          ))}
        </dl>
      </Section>
    </>
  );
}

/**
 * How wide one slide is.
 *
 * Written out per count rather than built from a number, because Tailwind only
 * ships classes it can see in the source - and because a segment that carries
 * one or two packages should fill the track instead of leaving two thirds of it
 * empty.
 *
 * One whole card on a phone, not a card and a sliver of the next. The sliver
 * was there to say "there is more here", and the arrows on either side and the
 * row of marks underneath now say it plainly; spending 40px of a 280px card on
 * hinting at it instead is a bad trade when the price is set at 2.35rem and
 * ₱145,000 has to fit on one line.
 */
const SLIDE_WIDTH: Record<number, string> = {
  1: 'w-full',
  2: 'w-full sm:w-1/2',
  3: 'w-full sm:w-1/2 lg:w-1/3',
};
const SLIDE_WIDTH_DEFAULT = 'w-full sm:w-1/2 lg:w-1/3';

/**
 * The packages, as a track you step through rather than a wall you scroll past.
 *
 * Five packages in a three-column grid is two rows of roughly 700px cards, so
 * reading the last one meant scrolling most of a screen and losing the first
 * one off the top of it. One row that slides sideways puts the same five within
 * two clicks of each other and takes the section from about 1500px tall to
 * about 700px.
 *
 * It is a NATIVE scroll container with CSS scroll snapping, not a transformed
 * track, and that is worth being deliberate about. Swipe, trackpad, shift-wheel
 * and keyboard focus all work for free and correctly; a card that takes focus
 * is scrolled into view by the browser rather than left focused off-screen
 * behind an `overflow: hidden`; and there is no width arithmetic to get wrong
 * at a breakpoint. The buttons below only call `scrollTo`. The scroll position,
 * not a React state value, is the single source of truth for where the track is
 * - state is derived from it, which is why dragging with a finger keeps the
 * counter and the ticks honest without any extra code.
 */
function PackageCarousel({
  tiers,
  segment,
}: {
  tiers: PricingTier[];
  segment: VehicleSegmentId;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const [current, setCurrent] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  /**
   * Whether there is anything to step through at all. Three packages on a wide
   * display already fit, and dead controls under a carousel are worse than no
   * controls, so the whole chrome drops out when nothing overflows.
   */
  const [overflows, setOverflows] = useState(false);
  /**
   * How many positions the track can actually stop at - which is NOT how many
   * packages there are.
   *
   * Three cards are on screen at a time on a wide display, so five packages are
   * two presses apart, not four: the track runs out of scroll with the last two
   * cards already in view and there is no position where either of them sits at
   * the left edge. A mark for each package therefore drew five, two of which
   * could never light up. This counts the offsets the track can genuinely reach
   * and the marks follow it - five on a phone showing one card at a time, four
   * at two across, three at three across.
   */
  const [stops, setStops] = useState(1);
  /**
   * Where the last button press asked the track to go, and when.
   *
   * A smooth scroll takes a few hundred milliseconds, and the card nearest the
   * left edge halfway through it is still the one we started from. Without
   * this, pressing Next twice quickly would compute "the card after the one I
   * can currently see" twice and land one card along instead of two. It is
   * deliberately time-boxed, and dropped the moment a finger or a wheel takes
   * over, so a stale target can never outlive the scroll that set it.
   */
  const pending = useRef<{ index: number; at: number } | null>(null);

  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;

    const max = el.scrollWidth - el.clientWidth;
    const positions = offsets(el);
    const start = el.scrollLeft <= 1;
    const end = el.scrollLeft >= max - 1;

    setOverflows(max > 1);
    setAtStart(start);
    setAtEnd(end);
    setCurrent(indexNearest(positions, el.scrollLeft));
    // The reachable positions are the card offsets the track can still scroll
    // to; past that the track has hit its end and the remaining cards ride
    // along in view.
    setStops(positions.filter((position) => position <= max + 1).length);

    // An arrow that runs out is hidden, and hiding the element that holds the
    // focus hands the focus to the document body - so somebody stepping through
    // this on a keyboard would lose their place at the exact moment they reach
    // the end. Pass it to the arrow that still has somewhere to go.
    const focused = document.activeElement;
    if (start && focused === prevRef.current) nextRef.current?.focus();
    if (end && focused === nextRef.current) prevRef.current?.focus();
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    // Measured straight off the scroll event. Wrapping this in a
    // `requestAnimationFrame` is the usual advice and buys nothing here: the
    // scroll event is itself dispatched from the rendering steps, so it already
    // arrives at most once a frame, and the callback is five `offsetLeft` reads
    // against values React discards when they have not changed.
    //
    // What this state must NOT do is decide anything. Everything derived here
    // is one render behind by definition, and a browser that is not painting -
    // a background tab, an occluded window - does not dispatch scroll events at
    // all, so it can also be arbitrarily stale. `step` reads the DOM instead.
    el.addEventListener('scroll', measure, { passive: true });
    // Slides are a percentage of the track, so a resize changes how many of
    // them fit, and therefore whether the controls are needed at all.
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    measure();

    return () => {
      el.removeEventListener('scroll', measure);
      observer.disconnect();
    };
  }, [measure]);

  // A new segment is a different set of packages. Park the track back at the
  // start rather than leaving it wherever the previous set was left.
  useEffect(() => {
    pending.current = null;
    trackRef.current?.scrollTo({ left: 0, behavior: 'auto' });
  }, [segment]);

  const goTo = useCallback((index: number) => {
    const el = trackRef.current;
    if (!el) return;

    const positions = offsets(el);
    const wanted = positions[Math.max(0, Math.min(index, positions.length - 1))];
    if (wanted === undefined) return;

    // Asking for the last card does not put the last card on the left edge -
    // the track runs out of scroll before that. Record where it will ACTUALLY
    // come to rest, so a second press steps on from there rather than trying
    // to reach a position that does not exist.
    const left = Math.min(wanted, el.scrollWidth - el.clientWidth);
    pending.current = { index: indexNearest(positions, left), at: performance.now() };

    // Read the preference at click time rather than at mount: it can change
    // while the page is open, and this is the only motion in the component.
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollTo({ left, behavior: still ? 'auto' : 'smooth' });
  }, []);

  /**
   * Step one card along.
   *
   * Where "here" is comes from the DOM - the live scroll position, or the
   * target of a press that has not finished travelling yet - and never from
   * `current`, which is display state and one render behind. Driving the
   * buttons from render state is what makes a carousel swallow the second of
   * two quick presses.
   */
  const step = useCallback(
    (delta: number) => {
      const el = trackRef.current;
      if (!el) return;
      const held = pending.current;
      const from =
        held && performance.now() - held.at < 900
          ? held.index
          : indexNearest(offsets(el), el.scrollLeft);
      goTo(from + delta);
    },
    [goTo],
  );

  // A finger, a wheel or a trackpad takes over from whatever was last asked
  // for; from here the scroll position is the only truth again.
  const release = useCallback(() => {
    pending.current = null;
  }, []);

  const slideWidth = SLIDE_WIDTH[tiers.length] ?? SLIDE_WIDTH_DEFAULT;

  return (
    <div role="group" aria-roledescription="carousel" aria-label="Packages">
      {/* The arrows straddle the two edges of the track, which is why this
          wrapper is inset on a phone: half of each button hangs outside the
          track, and without the inset the outer one would sit flush against
          the edge of the screen. From `sm` up the section's own padding is
          wide enough to take it. The buttons have to be siblings of the track
          rather than children - the track clips its overflow, so anything
          inside it is cut off at the same edge the buttons need to sit on. */}
      <div className="relative mx-6 sm:mx-0">
        <div
          ref={trackRef}
          onPointerDown={release}
          onWheel={release}
          className="carousel-track relative flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
        >
          {tiers.map((tier, i) => (
            <div
              key={tier.id}
              data-slide
              className={`${slideWidth} flex shrink-0 snap-start border-l border-rule ${
                i === tiers.length - 1 ? 'border-r border-rule' : ''
              }`}
            >
              <PackageCard tier={tier} segment={segment} />
            </div>
          ))}
        </div>

        {overflows && (
          <>
            <Arrow buttonRef={prevRef} direction="left" onClick={() => step(-1)} spent={atStart} />
            <Arrow buttonRef={nextRef} direction="right" onClick={() => step(1)} spent={atEnd} />
          </>
        )}
      </div>

      {overflows && (
        <div className="mt-6 flex justify-center">
          {/* One mark per position the track can stop at, not one per package -
              see `stops`. How many cards a mark brings into view is the same
              arithmetic read the other way round, and it is what decides
              whether a mark names one package or the run that starts with it. */}
          {Array.from({ length: stops }, (_, i) => {
            const tier = tiers[i];
            const perView = tiers.length - stops + 1;

            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={
                  perView > 1 ? `Show packages from ${tier.name}` : `Show ${tier.name}`
                }
                aria-current={i === current ? 'true' : undefined}
                // The mark is 2px of rule; the padding is the thing you can
                // actually hit with a thumb.
                className="group px-2 py-4"
              >
                <span
                  className={`block h-0.5 transition-all duration-300 ${
                    i === current ? 'w-12 bg-accent' : 'w-6 bg-rule group-hover:bg-fg-muted'
                  }`}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * One package.
 *
 * The most requested package is not a badge pinned to an otherwise identical
 * card any more - it is inverted. `tone-ink` redefines `--c-surface`, `--c-fg`,
 * `--c-rule` and `--c-accent` on this one card, so a near-black card carrying
 * full brand gold sits in a row of pale ones. That is the entire treatment: no
 * glow, no drop shadow, no second palette. `text-accent` inside it resolves to
 * #d4af37 at 9.8:1 rather than to the darkened paper gold, because on ink the
 * brand gold is legitimately readable - which is the rule in globals.css, used
 * rather than worked around.
 *
 * The button hierarchy carries the rest. Every package used to have the same
 * filled gold call to action, which is five equally loud asks and therefore no
 * ask at all; the filled one now belongs to the featured card and the others
 * are outlined until hover.
 */
function PackageCard({ tier, segment }: { tier: PricingTier; segment: VehicleSegmentId }) {
  const featured = Boolean(tier.popular);

  return (
    // `text-fg` is not decoration here, it is required. `tone-ink` only
    // redefines the variables on this card; it cannot reach back and change a
    // colour that was already resolved further up the tree. Without an explicit
    // `text-fg` to re-resolve against this card's own tone, everything not
    // carrying a colour class - the package name, the "Best for" lead-in -
    // inherits the paper section's near-black and is painted #08080a on
    // #08080a. The package name was invisible.
    <article
      className={`relative flex w-full flex-col justify-between bg-surface p-7 pt-14 text-fg ${
        featured ? 'tone-ink' : ''
      }`}
    >
      {/* The top padding is held on every card whether or not the band is drawn,
          so the five prices stay on one line across the track. */}
      {featured && (
        <span className="type-meta absolute inset-x-0 top-0 flex h-9 items-center bg-accent px-7 text-on-accent">
          Most requested
        </span>
      )}

      <div>
        {/* The price leads. It is the one thing everybody on this page is
            looking for, and it used to be the fourth thing down. Gold is spent
            on the featured card alone: an accent every card gets is not an
            accent. */}
        <p
          className={`font-mono text-[2.35rem] leading-none tabular-nums ${
            featured ? 'text-accent' : 'text-fg'
          }`}
        >
          {tier.prices[segment]}
        </p>
        <h3 className="type-card mt-3">{tier.name}</h3>
        <p className="type-meta mt-2 block text-fg-muted">
          {tier.warranty} &middot; {tier.duration}
        </p>

        <p className="mt-4 text-[15px] leading-relaxed text-fg-muted">{tier.tagline}</p>

        {/* The scope list was a ruled table: every line had 10px of padding
            above and below it and its own hairline, which on a seven-item card
            is over 350px of card spent on separators. A tick and tight leading
            says the same thing in half the height and is quicker to scan down. */}
        <ul className="mt-6 flex flex-col gap-2 border-t border-rule pt-5">
          {tier.inclusions.map((inc) => (
            <li key={inc} className="flex gap-2.5 text-[14px] leading-snug text-fg-muted">
              <span aria-hidden className="mt-[7px] h-px w-2.5 shrink-0 bg-accent" />
              <span>{inc}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-7">
        <p className="text-[13px] leading-snug text-fg-muted">
          <span className="text-fg">Best for</span> {tier.recommendedFor.toLowerCase()}
        </p>
        <Link
          href={`/booking?package=${tier.id}&segment=${segment}`}
          className={`type-meta mt-5 flex min-h-[48px] items-center justify-center px-6 transition-colors ${
            featured
              ? 'bg-accent text-on-accent hover:bg-accent-hover'
              : 'border border-rule text-fg hover:bg-accent hover:text-on-accent'
          }`}
        >
          Reserve this package
        </Link>
      </div>
    </article>
  );
}

/**
 * Where each card sits along the track.
 *
 * `offsetLeft` is measured against the track because the track is the slides'
 * offset parent - that is what the `relative` on it is for - so these are
 * directly comparable with `scrollLeft`.
 */
function offsets(track: HTMLElement): number[] {
  return Array.from(track.querySelectorAll<HTMLElement>('[data-slide]'), (s) => s.offsetLeft);
}

/** The card whose left edge is nearest a given scroll position. */
function indexNearest(positions: number[], left: number): number {
  let nearest = 0;
  let shortest = Infinity;
  positions.forEach((position, i) => {
    const distance = Math.abs(position - left);
    if (distance < shortest) {
      shortest = distance;
      nearest = i;
    }
  });
  return nearest;
}

/**
 * One carousel arrow, sitting on its side of the track.
 *
 * Filled rather than outlined, because an outlined square reads as a frame and
 * a solid one reads as a button - and this is the control the whole section now
 * depends on being noticed.
 *
 * The pale border is what makes that survive. A solid near-black button is
 * obvious against the pale cards and invisible against the featured one, which
 * is near-black itself and IS the card the back arrow sits over as soon as you
 * step forward once. The border is the section's surface colour, so whichever
 * of the two the button lands on, one of the fill and the border is showing.
 *
 * AN ARROW WITH NOWHERE TO GO IS HIDDEN, not dimmed. A greyed-out control still
 * asks to be read and dismissed every time your eye passes it, and at either
 * end of a five-card track one of the two is always in that state. Fading it
 * out entirely leaves the cards and one live arrow, which is the whole point.
 *
 * It is faded rather than unmounted so the other one does not jump, and it is
 * taken out of the tab order and the accessibility tree at the same time -
 * an invisible button that can still be focused is worse than a dim one.
 * `PackageCarousel` moves the focus across when the arrow holding it runs out,
 * because hiding the focused element otherwise drops the focus to the body.
 */
function Arrow({
  buttonRef,
  direction,
  onClick,
  spent,
}: {
  buttonRef: RefObject<HTMLButtonElement | null>;
  direction: 'left' | 'right';
  onClick: () => void;
  spent: boolean;
}) {
  const left = direction === 'left';

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      aria-hidden={spent}
      tabIndex={spent ? -1 : undefined}
      aria-label={left ? 'Previous package' : 'Next package'}
      className={`absolute top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center border-2 border-surface bg-fg text-surface transition duration-200 hover:bg-accent hover:text-on-accent ${
        spent ? 'pointer-events-none opacity-0' : 'opacity-100'
      } ${left ? 'left-0 -translate-x-1/2' : 'right-0 translate-x-1/2'}`}
    >
      {/* Drawn rather than typed: the site does not append glyph arrows to its
          links, and a square-capped stroke sits with the hairline grid where a
          font's rounded chevron would not. */}
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
      >
        <path d={left ? 'M15 5 8 12l7 7' : 'M9 5l7 7-7 7'} />
      </svg>
    </button>
  );
}
