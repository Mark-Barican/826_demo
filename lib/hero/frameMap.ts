/**
 * Scroll-progress to video-time mapping for the hero.
 *
 * PLAYED IN REVERSE, ON PURPOSE.
 *
 * The footage runs car -> film sweeps across -> panels fan out. Told that way
 * round it ends on loose sheets of plastic, which is the least appealing frame
 * in the reel. Reversed it becomes the actual sales story: you arrive on the
 * cut panels, watch them wrap onto the car, and land on the finished vehicle,
 * which is what the customer is buying. Scroll progress therefore runs from
 * LAST_FRAME down to FIRST_FRAME.
 *
 * SOURCE IS NOW THE VIDEO, NOT A FRAME SEQUENCE.
 *
 * The 192-frame WebP set this replaced was itself a rebuild of an ezgif export.
 * Both are gone. Driving the master h264 directly is half the bytes (4.6MB
 * against 8.1MB) and removes the entire frame cache - the encoded map, the
 * low-res ladder, the LRU window and the 128MB decode budget.
 *
 * That only works because of how the file is encoded. Measured seek latency in
 * the browser, scrubbing backwards, which is the direction this hero moves:
 *
 *   master as supplied (long GOP) .... 107ms mean, 220ms worst   unusable
 *   re-encoded keyint=5 .............. 10.7ms mean, 14.6ms worst  ships
 *   all-intra keyint=1 ............... 7.3ms mean, 12.8ms worst   10MB, not worth it
 *
 * A frame at 60fps is 16.7ms. The shipped encode seeks inside that budget in
 * both directions; the file as supplied was six times over it and would have
 * juddered far worse than the frame sequence ever did. If this video is ever
 * re-exported it MUST keep a short GOP, or the hero falls apart.
 *
 * Measured luma deltas over the master frames (160x90 greyscale, mean absolute
 * adjacent difference):
 *
 *   mean adjacent delta ............ 1.138
 *   25 / 50 / 75% motion at frame .. 81 / 122 / 166
 *   frame 186 delta ................ 29.1, against 2.2 for the next highest
 *
 * Two consequences drive the segment table:
 *
 * 1. Linear scroll-to-time spends a third of the pin on a car that barely
 *    moves. Segment B is pulled toward motion-equalised time so the wrap reads
 *    at a constant rate.
 * 2. The scrub never touches frame 186 or later. 186 is a hard cut to a closer
 *    shot where the film is already draped and wrinkled - it reads as a botched
 *    application. Reversed, that cut would be the very first thing on screen,
 *    so the timeline starts at 185 instead: the wide composition with the
 *    sheets fanned out beside the car.
 */

/** Master frame rate. The mapping converts frame indices to video time with it. */
export const FPS = 24;

export const FRAME_COUNT = 192;
export const FIRST_FRAME = 1;

/**
 * Where the footage stops being usable - the hard cut described above.
 * Frames 186-192 are never shown.
 */
export const CUT_FRAME = 186;

/**
 * The frame the reversed scrub STARTS on: the wide composition with the PPF
 * sheets fanned out beside the car.
 */
export const LAST_FRAME = CUT_FRAME - 1; // 185

/**
 * Where the exploded-layers composition stops being legible as separate sheets.
 * Read off the frames: 181-185 is the full fan, 171 has three separating, 164
 * is a single sheet against the car. Reversed, this is where the opening beat
 * ends and the wrap begins.
 */
export const REVEAL_FRAME = 170;

/** The h264 the hero scrubs. Short GOP - see the note above before replacing it. */
export const VIDEO_SRC = '/hero/seq-gop5.mp4';

/**
 * Stills. Two frames survive the switch to video: the poster the browser paints
 * before the first decode, and the pair the reduced-motion layout uses.
 */
export const POSTER_PANELS = '/hero/hero-185.webp';
export const POSTER_CAR = '/hero/hero-001.webp';

/** Seconds of the file the scrub uses, measured from 0. */
export const USABLE_DURATION = (LAST_FRAME - FIRST_FRAME) / FPS;

/** Cumulative share of total sequence motion at each frame. Measured, not modelled. */
const CUMULATIVE_MOTION: readonly number[] = [
  0.0000, 0.0004, 0.0006, 0.0008, 0.0010, 0.0016, 0.0023, 0.0027, 0.0033, 0.0040,
  0.0045, 0.0049, 0.0053, 0.0063, 0.0072, 0.0080, 0.0091, 0.0101, 0.0109, 0.0118,
  0.0127, 0.0140, 0.0151, 0.0161, 0.0173, 0.0184, 0.0192, 0.0199, 0.0206, 0.0219,
  0.0230, 0.0241, 0.0255, 0.0268, 0.0280, 0.0290, 0.0302, 0.0321, 0.0340, 0.0361,
  0.0387, 0.0410, 0.0431, 0.0451, 0.0473, 0.0501, 0.0529, 0.0555, 0.0586, 0.0615,
  0.0644, 0.0677, 0.0712, 0.0760, 0.0811, 0.0861, 0.0918, 0.0975, 0.1031, 0.1084,
  0.1143, 0.1212, 0.1280, 0.1348, 0.1422, 0.1488, 0.1553, 0.1617, 0.1681, 0.1748,
  0.1813, 0.1878, 0.1948, 0.2023, 0.2102, 0.2182, 0.2256, 0.2335, 0.2410, 0.2474,
  0.2546, 0.2622, 0.2701, 0.2780, 0.2866, 0.2952, 0.3039, 0.3121, 0.3213, 0.3299,
  0.3376, 0.3448, 0.3516, 0.3586, 0.3661, 0.3732, 0.3802, 0.3858, 0.3906, 0.3947,
  0.3987, 0.4028, 0.4068, 0.4103, 0.4146, 0.4188, 0.4237, 0.4292, 0.4351, 0.4407,
  0.4460, 0.4507, 0.4564, 0.4615, 0.4662, 0.4709, 0.4755, 0.4805, 0.4857, 0.4912,
  0.4978, 0.5034, 0.5094, 0.5157, 0.5217, 0.5282, 0.5358, 0.5420, 0.5505, 0.5564,
  0.5619, 0.5675, 0.5732, 0.5797, 0.5864, 0.5927, 0.6003, 0.6071, 0.6139, 0.6206,
  0.6275, 0.6346, 0.6417, 0.6476, 0.6543, 0.6595, 0.6646, 0.6694, 0.6742, 0.6791,
  0.6836, 0.6877, 0.6935, 0.6979, 0.7025, 0.7067, 0.7110, 0.7154, 0.7199, 0.7241,
  0.7302, 0.7351, 0.7399, 0.7443, 0.7488, 0.7534, 0.7579, 0.7625, 0.7680, 0.7733,
  0.7782, 0.7827, 0.7878, 0.7931, 0.7983, 0.8038, 0.8100, 0.8155, 0.8209, 0.8262,
  0.8318, 0.8375, 0.8431, 0.8488, 0.8591, 0.9930, 0.9945, 0.9958, 0.9969, 0.9980,
  0.9991, 1.0000
];

/**
 * Segments, as an edit rather than a scrub bar, in SCROLL order - so `from` is
 * always the higher frame number and every range descends.
 * `share` values are fractions of total pinned scroll distance and sum to 1.
 */
const SEGMENTS = [
  // A: the cut panels, fanned out. The headline sets here.
  { from: LAST_FRAME, to: REVEAL_FRAME, share: 0.12, equalise: 0 },
  // B: the film travels back onto the car. The long middle, motion-equalised.
  { from: REVEAL_FRAME, to: 16, share: 0.6, equalise: 0.6 },
  // C: the finished car holds while the closing copy and CTAs resolve.
  { from: 16, to: FIRST_FRAME, share: 0.28, equalise: 0 },
] as const;

/**
 * The narrative phase a frame belongs to, named in scroll order.
 *
 * Any overlay that changes copy across the sequence must derive its boundaries
 * from here rather than hardcoding numbers.
 */
export type HeroPhase = 'panels' | 'wrapping' | 'finished';

export function phaseForFrame(frame: number): HeroPhase {
  if (frame >= REVEAL_FRAME) return 'panels';
  if (frame > SEGMENTS[2].from) return 'wrapping';
  return 'finished';
}

const LUT_SIZE = 1024;
/**
 * Precomputed progress -> frame lookup, built once at module load.
 * Uint16 because frame indices are 1..185 and the table is read every tick.
 * Segments descend (the sequence plays in reverse), so the equalise walk
 * below steps in whichever direction its segment runs.
 */
const LUT: Uint16Array = (() => {
  const lut = new Uint16Array(LUT_SIZE);

  // Frame index at a given fraction through a segment, blending linear time
  // toward motion-equalised time by `equalise`.
  const frameIn = (from: number, to: number, t: number, equalise: number) => {
    const linear = from + t * (to - from);
    if (equalise === 0) return linear;

    const c0 = CUMULATIVE_MOTION[from - 1];
    const c1 = CUMULATIVE_MOTION[to - 1];
    const span = c1 - c0;
    if (span === 0) return linear;

    // Walk to the frame whose cumulative motion reaches t of this segment's
    // total. `span` is negative on a descending segment, so the comparison has
    // to flip with the direction of travel.
    const target = c0 + t * span;
    const step = to >= from ? 1 : -1;
    let equalised = to;
    for (let f = from; step > 0 ? f <= to : f >= to; f += step) {
      const reached = step > 0
        ? CUMULATIVE_MOTION[f - 1] >= target
        : CUMULATIVE_MOTION[f - 1] <= target;
      if (reached) { equalised = f; break; }
    }
    return linear + equalise * (equalised - linear);
  };

  let acc = 0;
  const bounds = SEGMENTS.map((s) => { acc += s.share; return acc; });

  for (let i = 0; i < LUT_SIZE; i++) {
    const p = i / (LUT_SIZE - 1);
    let si = SEGMENTS.findIndex((_, n) => p <= bounds[n]);
    if (si < 0) si = SEGMENTS.length - 1;

    const seg = SEGMENTS[si];
    const start = si === 0 ? 0 : bounds[si - 1];
    const t = seg.share > 0 ? Math.min(1, Math.max(0, (p - start) / seg.share)) : 1;

    lut[i] = Math.round(frameIn(seg.from, seg.to, t, seg.equalise));
  }
  return lut;
})();

/** Map scroll progress (0..1) to a 1-based frame index. O(1), safe to call every tick. */
export function frameForProgress(p: number): number {
  const i = p <= 0 ? 0 : p >= 1 ? LUT_SIZE - 1 : (p * (LUT_SIZE - 1)) | 0;
  return LUT[i];
}

/**
 * Map scroll progress (0..1) to a time in the video, in seconds.
 *
 * This is the value the hero sets on the element. It runs backwards through the
 * file by construction: SEGMENTS descend, so progress 0 lands near
 * USABLE_DURATION and progress 1 lands at 0.
 */
export function timeForProgress(p: number): number {
  return (frameForProgress(p) - FIRST_FRAME) / FPS;
}
