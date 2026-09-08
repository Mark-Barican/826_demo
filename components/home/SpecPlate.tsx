import Link from 'next/link';
import { Reveal } from '@/components/common/Reveal';
import { POSTER_PANELS } from '@/lib/hero/frameMap';

/**
 * The annotated specification plate.
 *
 * After Pure PPF's callout section: one large photograph with thin leader lines
 * running out to labelled specifications. It replaces the four-card philosophy
 * grid, which said the same things in the same box as every other section.
 *
 * The photograph is the hero's own opening still - the film fanned out as
 * separate panel-shaped sheets beside the car. It is 1920x1080, so unlike the
 * 1080px job photography it can carry a large reproduction, and it is already
 * in the project. Served as a plain <img> because `public/hero/*` is
 * deliberately not routed through next/image (see frameMap.ts).
 *
 * Copy discipline follows HeroSection: no warranty periods, coverage
 * percentages or durability figures, because 826 has published none and this
 * frame shows material rather than a finished result.
 *
 * Layout: leader lines only exist at lg and above, where there is room for the
 * plate to read as a drawing. Below that the callouts become an ordinary
 * numbered list under the photograph - a hairline pointing at nothing is worse
 * than no hairline.
 *
 * This does not go through Section - it is the only full-bleed drawing on the
 * site - so it opens its own reveal scopes. Three of them: the standfirst, the
 * plate itself, and the link. Splitting them means the plate is not already
 * animating while the reader is still on the first line above it.
 */

const CALLOUTS = [
  {
    n: '01',
    side: 'left',
    title: 'Cut to the panel',
    body: 'Each sheet is plotted to one panel and laid on it, rather than stretched across the body as a single piece.',
  },
  {
    n: '02',
    side: 'left',
    title: 'Laid over factory paint',
    body: 'The film sits on the original finish. Nothing underneath it is sanded, filled or repainted.',
  },
  {
    n: '03',
    side: 'right',
    title: 'Optically clear urethane',
    body: 'Thermoplastic urethane, applied so the colour and metallic flake underneath read unchanged.',
  },
  {
    n: '04',
    side: 'right',
    title: 'Edges wrapped, not trimmed',
    body: 'Where a panel edge allows it, film is tucked behind the edge instead of being blade-cut on the paint.',
  },
] as const;

export function SpecPlate() {
  const left = CALLOUTS.filter((c) => c.side === 'left');
  const right = CALLOUTS.filter((c) => c.side === 'right');

  return (
    <section className="tone-paper bg-surface py-20 text-fg sm:py-28 lg:py-32">
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-8">
        <Reveal className="max-w-4xl">
          <span data-reveal className="type-meta block text-accent">Paint Protection Film</span>
          <h2 data-reveal className="type-display mt-4">Applied panel by panel.</h2>
          <p data-reveal className="type-body mt-6 text-fg-muted">
            The frame below is the moment before installation: film already cut to the shape of
            each panel, waiting beside the car it was measured against.
          </p>
        </Reveal>
      </div>

      {/* The plate. Full-bleed at lg so the drawing gets the width it needs. */}
      <div className="mt-14 sm:mt-20">
        <Reveal className="mx-auto w-full max-w-[1800px] px-6 sm:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-x-10">
            {/* Left callouts */}
            <div className="hidden flex-col gap-16 lg:col-span-3 lg:flex">
              {left.map((c) => (
                <Callout key={c.n} {...c} align="right" />
              ))}
            </div>

            {/* Photograph */}
            <div data-reveal className="lg:col-span-6">
              <div className="relative border border-rule bg-surface-raised">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={POSTER_PANELS}
                  alt="Paint protection film cut into separate panel-shaped sheets, laid out beside the Tesla Model 3 it was measured for"
                  width={1920}
                  height={1080}
                  loading="lazy"
                  decoding="async"
                  className="block h-auto w-full"
                />
              </div>
            </div>

            {/* Right callouts */}
            <div className="hidden flex-col gap-16 lg:col-span-3 lg:flex">
              {right.map((c) => (
                <Callout key={c.n} {...c} align="left" />
              ))}
            </div>

            {/* Below lg: the same four specs as a plain numbered list. */}
            <ol className="grid gap-8 sm:grid-cols-2 lg:hidden">
              {CALLOUTS.map((c) => (
                <li key={c.n} data-reveal className="border-t border-rule pt-4">
                  <span className="type-meta text-accent">{c.n}</span>
                  <h3 className="type-card mt-2">{c.title}</h3>
                  <p className="mt-2 type-detail text-fg-muted">{c.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </div>

      <Reveal className="mx-auto mt-16 w-full max-w-7xl px-6 sm:px-8">
        <Link
          href="/services/paint-protection-film"
          className="type-meta group inline-flex flex-col gap-2 text-fg transition-colors hover:text-accent"
        >
          <span>Paint protection film specifications</span>
          <span className="h-px w-full max-w-[4rem] bg-accent transition-all duration-300 group-hover:max-w-full" />
        </Link>
      </Reveal>
    </section>
  );
}

/**
 * One labelled callout. The hairline runs toward the photograph and terminates
 * in a solid node, which is what makes the pair read as a drawing rather than
 * as two columns of text either side of an image.
 */
function Callout({
  n,
  title,
  body,
  align,
}: {
  n: string;
  title: string;
  body: string;
  align: 'left' | 'right';
}) {
  const toward = align === 'left';

  return (
    <div data-reveal className={toward ? 'pl-0' : 'text-right'}>
      <span className="type-meta text-accent">{n}</span>
      <h3 className="type-card mt-2">{title}</h3>
      <p className="mt-2 type-detail text-fg-muted">{body}</p>

      {/* Leader: rule out to the photograph edge, node where it lands. */}
      <div
        aria-hidden
        className={`mt-5 flex items-center ${
          toward ? 'flex-row-reverse justify-end -ml-10' : '-mr-10'
        }`}
      >
        <span className="h-px flex-1 bg-rule" />
        <span className="h-1.5 w-1.5 shrink-0 bg-accent" />
      </div>
    </div>
  );
}
