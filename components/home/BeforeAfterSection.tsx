import Link from 'next/link';
import { BeforeAfterSlider } from '@/components/common/BeforeAfterSlider';
import { Section } from '@/components/common/Section';

/**
 * Paint correction, set as an inspection plate on paper.
 *
 * The slider is the most carefully built component on the site - pointer
 * capture, full keyboard control, correct ARIA, and a frame that keeps the
 * source's 744:946 portrait aspect so both halves show the same part of the
 * car. It was sitting on the dark surface between two card grids, where it read
 * as one more panel. On paper it reads as what it is.
 *
 * The three bordered explanation cards that used to sit underneath are now one
 * ruled line of three terms. They were saying small things in large boxes.
 */
const STAGES = [
  {
    term: 'Defect removal',
    def: 'Wash swirls, automatic-wash scratches and fallout etching levelled out of the clear coat.',
  },
  {
    term: 'Optical depth',
    def: 'Metallic flake and reflection come back once the surface scattering the light is gone.',
  },
  {
    term: 'Then protected',
    def: 'The corrected finish goes under film or coating, so it stays the way it left the studio.',
  },
] as const;

export function BeforeAfterSection() {
  return (
    <Section tone="paper">
      <BeforeAfterSlider />

      <dl className="mt-16 grid gap-8 border-t border-rule pt-8 sm:mt-20 sm:grid-cols-3 sm:gap-10">
        {STAGES.map((s, i) => (
          <div key={s.term}>
            <dt className="flex items-baseline gap-3">
              <span className="type-meta text-accent">{String(i + 1).padStart(2, '0')}</span>
              <span className="type-card">{s.term}</span>
            </dt>
            <dd className="mt-3 type-detail text-fg-muted">{s.def}</dd>
          </div>
        ))}
      </dl>

      <Link
        href="/services/paint-correction"
        className="type-meta group mt-12 inline-flex flex-col gap-2 text-fg transition-colors hover:text-accent"
      >
        <span>The multi-stage correction process</span>
        <span
          aria-hidden
          className="h-px w-full max-w-[4rem] bg-accent transition-all duration-300 group-hover:max-w-full"
        />
      </Link>
    </Section>
  );
}
