/**
 * How the hero renders on this device.
 *
 *   still  no scrub at all. The panels beside the finished car, the whole
 *          before/after story in one static view. This is a designed state, not
 *          a degraded one: the sequence exists to show film going on, and a
 *          two-up says that without moving.
 *   band   letterboxed 16:9 strip with type above and below.
 *   full   cover-fit, pinned, scrubbed.
 *
 * The geometry test is the load-bearing one. The footage is 16:9 and the
 * subject spans most of the width, so cover-fit on a portrait phone retains
 * only about a quarter of the frame - you would be looking at one door rather
 * than a car. Filling the viewport is the wrong goal there, so `band` stops
 * trying and shows the composition the footage actually has.
 *
 * `deviceMemory` and `effectiveType` are Chromium-only and absent on iOS
 * Safari, so they are treated as bonus signals and never as the only gate.
 *
 * This used to also carry the frame ladder and decode-window sizes for the
 * WebP frame sequence. That pipeline is gone - the hero scrubs the video
 * directly now - so all that remains is the mode and the pin length.
 */
export type HeroMode = 'still' | 'band' | 'full';

/**
 * Below this viewport aspect, cover-fit starts cropping into the car.
 *
 * THE LAYOUT ITSELF DOES NOT READ THIS. `band` is a shape, and shapes belong in
 * CSS: the `hero-band` variant in app/globals.css carries the same threshold as
 * `@media (max-aspect-ratio: 4/3)` and does the letterboxing and the type
 * placement, so turning a phone on its side re-lays-out on the next frame
 * without rebuilding a pinned ScrollTrigger. What this value decides here is
 * the PIN LENGTH, which is a scroll distance rather than a shape and would have
 * to be rebuilt either way.
 *
 * Both are inclusive at exactly 4/3, so a window at precisely that ratio cannot
 * get the band layout with the cover pin length or the other way round.
 */
export const MIN_COVER_ASPECT = 1.33;

export type ModeConfig = {
  mode: HeroMode;
  /** ScrollTrigger `end` value. */
  pin: string;
};

export function detectMode(): ModeConfig {
  if (typeof window === 'undefined') return { mode: 'full', pin: '+=320%' };

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } })
    .connection;
  const thin = conn?.saveData === true || conn?.effectiveType === '2g' || conn?.effectiveType === 'slow-2g';

  if (reduced || thin) return { mode: 'still', pin: '' };

  // innerHeight can genuinely be 0 - a backgrounded tab, a hidden pane, a
  // browser restoring session state. Guessing `band` from a bogus aspect would
  // lock in the wrong layout for the whole session, so assume the common case
  // and let the ResizeObserver correct the geometry later.
  const aspect = window.innerHeight > 0 ? window.innerWidth / window.innerHeight : 16 / 9;

  if (aspect <= MIN_COVER_ASPECT) return { mode: 'band', pin: '+=220%' };

  return { mode: 'full', pin: '+=320%' };
}
