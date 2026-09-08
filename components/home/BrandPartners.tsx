import { PARTNERS, type Partner } from '@/lib/data/partners';

/**
 * The band under the hero: the film brands 826 works with, on a slow loop.
 *
 * UNIFORM HEIGHT, DELIBERATELY. Every mark is rendered at the same height and
 * flattened to the same white, which is what Mark asked for and what makes
 * three lockups built by three different design teams read as one set. It is a
 * trade: STEK carries "| AUTOMOTIVE" and is about nine times as wide as it is
 * tall, while LLumar is stacked with its sun above the name, so at a shared
 * height LLumar's lettering comes out smaller than STEK's. LOGO_HEIGHT is set
 * high enough that LLumar still reads rather than tuned to make the widest mark
 * behave. If the row ever needs matched lettering instead, size each mark
 * separately - see the note on `height` in lib/data/partners.ts.
 *
 * WHY THE SET IS REPEATED. See the `.marquee-track` note in app/globals.css:
 * one half of the track has to be wider than the band or the loop shows a gap.
 *
 * NO REVEAL ON THIS ONE. The band already moves; fading it in on scroll on top
 * of that reads as two animations arguing. It is simply there.
 *
 * The second half of the track is `aria-hidden`, so a screen reader hears each
 * partner once rather than eight times.
 */

/** Rendered height of every mark, in px. */
const LOGO_HEIGHT = 30;

/** Repeats of the full set inside ONE half of the track. */
const SETS_PER_HALF = 4;

/** Seconds for one repeat to cross. Scaled up by SETS_PER_HALF in the CSS var. */
const SECONDS_PER_SET = 13;

/** Fades the marks in and out at both ends of the track instead of hard-cutting. */
const EDGE_FADE =
  'linear-gradient(to right, transparent, #000 44px, #000 calc(100% - 44px), transparent)';

export function BrandPartners() {
  if (PARTNERS.length === 0) return null;

  const half = Array.from({ length: SETS_PER_HALF }, () => PARTNERS).flat();

  const run = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {half.map((partner, i) => (
        <li key={`${partner.name}-${i}`} className="flex shrink-0 items-center px-8 sm:px-12">
          <PartnerMark partner={partner} />
        </li>
      ))}
    </ul>
  );

  return (
    <section className="tone-ink border-y border-rule bg-surface py-7 text-fg sm:py-8">
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-8">
        {/* No heading. The marks say what they are, and a label reading "Brand
            partners" beside three logos is the caption on a photograph of a
            cat. The list is still labelled for anyone who cannot see it. */}
        <h2 className="sr-only">Brand partners</h2>

        {/* A mask rather than a gradient overlay, so the fade does not need to
            know the band's background colour - which changes with the tone. */}
        <div
          className="relative overflow-hidden"
          style={{ maskImage: EDGE_FADE, WebkitMaskImage: EDGE_FADE }}
        >
          <div
            className="marquee-track flex min-w-max"
            style={
              { '--marquee-duration': `${SECONDS_PER_SET * SETS_PER_HALF}s` } as React.CSSProperties
            }
          >
            {run(false)}
            {run(true)}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * One mark.
 *
 * `brightness-0 invert` takes any artwork to pure white whatever colour it
 * arrived in, so STEK's black wordmark with its red icon, XPEL's white one and
 * LLumar's white-and-red sun all land as the same flat white. Check it against
 * each brand's guidelines before publishing; some brands require their mark in
 * colour, and if one does, drop the filter for that one.
 *
 * `partner.height` is ignored here on purpose - the marquee sizes every mark
 * the same. It stays in the data for any future static layout.
 */
function PartnerMark({ partner }: { partner: Partner }) {
  const label = `${partner.name} - ${partner.role}`;

  if (!partner.logo) {
    return (
      <span
        title={label}
        className="block font-sans text-lg font-semibold uppercase leading-none tracking-[0.14em] text-fg-muted"
      >
        {partner.name}
      </span>
    );
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={partner.logo}
      alt={label}
      loading="lazy"
      decoding="async"
      style={{ height: LOGO_HEIGHT }}
      className="w-auto max-w-none object-contain opacity-70 brightness-0 invert"
    />
  );
}
