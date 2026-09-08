import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Reveal } from './Reveal';

export type Tone = 'ink' | 'paper';

interface SectionAction {
  href: string;
  label: string;
}

interface SectionProps {
  /**
   * Which surface this section sits on. This is the whole point of the
   * component: section rhythm is decided here and nowhere else, so the page
   * cannot drift back into one flat dark field the way it had.
   */
  tone?: Tone;
  /** Small mono label. Optional on purpose - it is not a badge for every heading. */
  label?: string;
  title?: ReactNode;
  /**
   * Promote the heading to the display tier. Reserved for at most three
   * moments site-wide; `.type-display` is a ceiling, not a default.
   */
  display?: boolean;
  intro?: ReactNode;
  action?: SectionAction;
  /** Let children run to the viewport edge; the header still sits in the container. */
  bleed?: boolean;
  /** Drop the vertical padding, for sections that manage their own. */
  flush?: boolean;
  /**
   * Whether the body animates as one block.
   *
   * Leave true for prose and single blocks. Set false when the children mark
   * their own `data-reveal` items - a grid of cards, a ruled list - so they
   * cascade individually instead of fading in together. Only one level is ever
   * animated; see Reveal.
   */
  revealBody?: boolean;
  id?: string;
  className?: string;
  containerClassName?: string;
  children?: ReactNode;
}

const CONTAINER = 'mx-auto w-full max-w-7xl px-6 sm:px-8';

export function Section({
  tone = 'ink',
  label,
  title,
  display = false,
  intro,
  action,
  bleed = false,
  flush = false,
  revealBody = true,
  id,
  className,
  containerClassName,
  children,
}: SectionProps) {
  const hasHeader = Boolean(label || title || intro || action);

  return (
    <section
      id={id}
      className={cn(
        tone === 'paper' ? 'tone-paper' : 'tone-ink',
        'bg-surface text-fg',
        !flush && 'py-20 sm:py-28 lg:py-32',
        className,
      )}
    >
      {/* One reveal scope for the whole section - see components/common/Reveal.tsx
          for why it is one ScrollTrigger and not one per element. The header
          parts are marked individually so they cascade; the body is marked as a
          single unit unless the page marks its own items inside it. */}
      <Reveal>
        {hasHeader && (
          <div className={cn(CONTAINER, bleed ? 'mb-12 sm:mb-16' : undefined)}>
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-3xl">
                {label && (
                  <span data-reveal className="type-meta block text-accent">
                    {label}
                  </span>
                )}
                {title && (
                  <h2
                    data-reveal
                    className={cn(display ? 'type-display' : 'type-section', label && 'mt-3')}
                  >
                    {title}
                  </h2>
                )}
                {intro && (
                  <p data-reveal className="type-body mt-5 text-fg-muted">
                    {intro}
                  </p>
                )}
              </div>

              {action && (
                <div data-reveal>
                  <SectionLink {...action} />
                </div>
              )}
            </div>

            {!bleed && <div className="mt-12 sm:mt-16" />}
          </div>
        )}

        {children &&
          (bleed ? (
            <div {...(revealBody ? { 'data-reveal': '' } : {})}>{children}</div>
          ) : (
            <div
              {...(revealBody ? { 'data-reveal': '' } : {})}
              className={cn(CONTAINER, containerClassName)}
            >
              {children}
            </div>
          ))}
      </Reveal>
    </section>
  );
}

/**
 * The section-level link. The old site appended `&rarr;` to sixteen of these;
 * a rule that grows on hover carries the same affordance without the glyph.
 */
export function SectionLink({ href, label }: SectionAction) {
  return (
    <Link
      href={href}
      className="group inline-flex shrink-0 flex-col gap-2 text-fg-muted transition-colors hover:text-fg"
    >
      <span className="type-meta">{label}</span>
      <span className="h-px w-full max-w-[3rem] bg-accent transition-all duration-300 group-hover:max-w-full" />
    </Link>
  );
}

/** Shared container width, for the handful of places that lay out their own header. */
export { CONTAINER };
