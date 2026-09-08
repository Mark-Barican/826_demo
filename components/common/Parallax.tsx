'use client';

import { useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { cn } from '@/lib/utils';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface ParallaxProps {
  children: ReactNode;
  /**
   * How far the image drifts, as a percentage of its own height. Small on
   * purpose - see below.
   */
  strength?: number;
  className?: string;
  /**
   * Marks the frame as a scroll-reveal target - see components/common/Reveal.tsx.
   *
   * Declared explicitly because TypeScript does NOT check hyphenated JSX
   * attributes on a component: writing `data-reveal` on this without the prop
   * compiles cleanly and is then silently thrown away, and the photograph
   * quietly drops out of its section's cascade with nothing to show for it.
   */
  'data-reveal'?: string;
  /**
   * Keep the frame, drop the drift: same box, same border, same clip, but the
   * children fill it exactly instead of sitting in an oversized layer.
   *
   * For a frame whose contents are TYPE rather than a photograph. The oversize
   * that makes the drift possible - 124% of the frame, hung 12% above it - puts
   * the bottom of that inner layer well below the bottom of the visible frame,
   * which is invisible on a photograph and ruinous on anything laid out inside
   * it. Dasmariñas has no studio photograph, so BranchImage renders a
   * typographic plate in its place; bottom-aligned against the oversized layer,
   * the last line of that plate sat 10px below the frame and was cut in half,
   * and the parallax then slid the cut up and down as you scrolled past.
   */
  still?: boolean;
}

/**
 * A photograph that drifts against the page as you scroll past it.
 *
 * This is what carries the eye from one section to the next now that scrolling
 * does not snap: the frame moves with the page, the picture inside it moves
 * slightly slower, and the difference reads as depth rather than as an effect.
 *
 * THE IMAGE IS OVERSIZED, WHICH IS THE WHOLE TRICK. The inner box is 124% of
 * the frame's height and sits 12% above it, so there is roughly an eighth of a
 * frame of slack at the top and at the bottom. The drift happens INSIDE that
 * slack and the frame never shows an edge. Get this wrong and a parallax
 * reveals a strip of background at one end of its travel, which is the usual
 * way it goes wrong.
 *
 * The sums, because they are easy to get wrong: `strength` is a percentage of
 * the INNER height, and the inner is 1.24x the frame, so 8 here is 9.9% of the
 * frame travelling against 12% of slack. Measured on the About photograph: 82px
 * of drift against 104px of slack. At 120%/10% it was 82px against 86px, which
 * worked but left under two pixels in hand - too close to trust across every
 * frame size on the site. Values much above 8 stop reading as depth and start
 * reading as an image sliding around in a window.
 *
 * SCRUBBED, NOT PLAYED. `scrub: true` ties the position to the scrollbar rather
 * than to a timeline, so it tracks a trackpad flick and a slow drag equally and
 * reverses exactly when the reader does.
 *
 * NOT FOR ANYTHING WITH SOMETHING FIXED IN IT. This transforms an element, and
 * a transform makes it the containing block for every `position: fixed`
 * descendant - which is what broke the pinned hero once already (see
 * components/common/PageTransition.tsx). Photographs only.
 *
 * Under `prefers-reduced-motion` nothing is set up at all and the picture just
 * sits still, correctly framed, because the slack is symmetrical.
 */
export function Parallax({
  children,
  strength = 8,
  className,
  'data-reveal': dataReveal,
  still = false,
}: ParallaxProps) {
  const root = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (still) return;
      const mm = gsap.matchMedia();

      mm.add({ motion: '(prefers-reduced-motion: no-preference)' }, (ctx) => {
        if (!ctx.conditions?.motion) return;

        gsap.fromTo(
          inner.current,
          { yPercent: -strength },
          {
            yPercent: strength,
            ease: 'none',
            scrollTrigger: {
              trigger: root.current,
              // From the frame entering the bottom of the screen to it leaving
              // the top, so the whole travel happens while it is being looked at.
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [strength, still] },
  );

  return (
    <div ref={root} data-reveal={dataReveal} className={cn('relative overflow-hidden', className)}>
      {still ? (
        children
      ) : (
        <div ref={inner} className="absolute inset-x-0 -top-[12%] h-[124%] will-change-transform">
          {children}
        </div>
      )}
    </div>
  );
}
