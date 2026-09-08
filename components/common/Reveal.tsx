'use client';

import { useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { cn } from '@/lib/utils';
import { PAGE_ENTRANCE_DELAY } from '@/lib/motion';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Seconds between each revealed element. */
  stagger?: number;
  /** Travel distance in px. Halved on small screens by the matchMedia below. */
  y?: number;
  /** Where the trigger must reach before the reveal fires. */
  start?: string;
  /**
   * Give every marked item its own trigger instead of sharing the scope's.
   *
   * For long runs of repeated blocks - the five studios, the branch directory,
   * a process list - where one trigger at the top of the scope would play the
   * last item several screens before anyone scrolled to it.
   */
  each?: boolean;
  /**
   * This scope is on screen the moment the route mounts.
   *
   * Plays once, after the route transition clears, with no ScrollTrigger at
   * all - there is no scroll to wait for. Used by the masthead on every inner
   * page.
   */
  entrance?: boolean;
}

/**
 * Scroll reveal for a whole scope.
 *
 * Rules this is built around, all learned the hard way on this site.
 *
 * **One trigger per section, not one per element.** An earlier version of this
 * site wrapped every heading and card in its own reveal and ended up with about
 * 35 live ScrollTriggers on a single page. This registers one trigger for the
 * scope and staggers whatever is marked `data-reveal` inside it, which is how
 * a page keeps a dozen or so in total. `each` is the deliberate exception, for
 * lists long enough that one shared trigger reads as broken.
 *
 * **Never put the pre-animation state in CSS.** The start state is set inside
 * useGSAP's layout effect, which runs before paint - by `gsap.from` in the
 * default and entrance modes, by an explicit `gsap.set` in `each` mode. If GSAP
 * never runs - JS disabled, a bundle that failed, an error earlier in the tree
 * - the content is simply visible, because nothing in the stylesheet ever hid
 * it. Adding `opacity: 0` to a stylesheet to "help" would turn any scripting
 * failure into a blank page.
 *
 * **Triggers are armed after the route transition, not at mount.** Every route
 * mounts underneath a full-screen loading panel (components/common/
 * PageTransition.tsx). A trigger created in the mount frame fires immediately
 * for anything already in the viewport - which is behind that panel - so the
 * reader would arrive at a section that had already finished animating. The
 * elements are hidden at mount as always; only the trigger waits. See
 * lib/motion.ts for the timing the two files share.
 *
 * Everything happens inside `gsap.matchMedia`, so `prefers-reduced-motion`
 * gets no animation at all rather than a faster one, and phones get shorter
 * travel.
 *
 * The reveal is REVERSIBLE. Scrolling down plays it in, scrolling back up plays
 * it out, and scrolling down again plays it in once more. The alternative,
 * `once: true`, fires a single time and leaves the page static on the way back
 * up.
 *
 * `y` is animated rather than a wrapper transform on purpose - these elements
 * never contain anything `position: fixed`. Transforming an ancestor of a fixed
 * element makes it the containing block and breaks it; that is what took the
 * pinned hero out, see components/common/PageTransition.tsx.
 *
 * REVEALS NEST. A Section always opens a scope of its own, so a list inside one
 * that wants `each` has to open a second scope inside the first. Each scope
 * animates only the marks that belong to it - see `collectTargets` - otherwise
 * the outer scope would grab the inner scope's items and animate them a second
 * time, from a different trigger, in the opposite direction.
 */
export function Reveal({
  children,
  className,
  stagger = 0.07,
  y = 24,
  start = 'top 85%',
  each = false,
  entrance = false,
}: RevealProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          motion: '(prefers-reduced-motion: no-preference)',
          small: '(max-width: 767px)',
        },
        (ctx) => {
          // Reduced motion: return without touching anything. The content has
          // never been hidden, so it is already in its final state.
          if (!ctx.conditions?.motion) return;

          const targets = collectTargets(scope);
          if (targets.length === 0) return;

          const travel = ctx.conditions?.small ? y * 0.5 : y;

          // Every trigger's start and end is a scroll position measured once.
          // If this scope changes height afterwards - the portfolio filtered
          // down to one category, an image finally decoding - everything below
          // it on the page moves, and those triggers are now measuring against
          // a page that no longer exists. That is how the footer ended up
          // stranded at opacity 0 after a filter click: it had been scrolled
          // past, the page got shorter underneath it, and its start line was
          // left somewhere no scroll position could reach.
          const cleanups: Array<() => void> = [];
          const resize = new ResizeObserver(scheduleRefresh);
          resize.observe(scope);
          cleanups.push(() => resize.disconnect());
          const cleanup = () => cleanups.forEach((fn) => fn());

          if (entrance) {
            gsap.from(targets, {
              opacity: 0,
              y: travel,
              duration: 0.7,
              ease: 'power2.out',
              stagger,
              delay: PAGE_ENTRANCE_DELAY,
            });
            return cleanup;
          }

          // A trigger per item, batched. `ScrollTrigger.batch` groups whatever
          // crosses the line in the same frame and staggers that group, so a
          // grid row cascades together while the row three screens down waits
          // its turn.
          if (each) {
            gsap.set(targets, { opacity: 0, y: travel });

            cleanups.push(
              armAfterEntrance(ctx, () => {
                ScrollTrigger.batch(targets, {
                  start,
                  onEnter: (batch) =>
                    gsap.to(batch, {
                      opacity: 1,
                      y: 0,
                      duration: 0.7,
                      ease: 'power2.out',
                      stagger,
                      overwrite: true,
                    }),
                  // Scrolling back up above an item resets it, so coming down
                  // again replays it. There is deliberately no `onLeave`:
                  // fading a block out behind you as you scroll past reads as
                  // content vanishing rather than as an animation.
                  onLeaveBack: (batch) =>
                    gsap.to(batch, {
                      opacity: 0,
                      y: travel,
                      duration: 0.4,
                      ease: 'power2.in',
                      overwrite: true,
                    }),
                });
              }),
            );
            return cleanup;
          }

          // One trigger for the scope. The tween is built paused so its start
          // state still lands before paint; the trigger that drives it is
          // attached once the route transition has cleared.
          const tween = gsap.from(targets, {
            opacity: 0,
            y: travel,
            duration: 0.7,
            ease: 'power2.out',
            stagger,
            paused: true,
            immediateRender: true,
          });

          cleanups.push(
            armAfterEntrance(ctx, () => {
              ScrollTrigger.create({
                trigger: scope,
                start,
                end: 'bottom 15%',
                animation: tween,
                // onEnter / onLeave / onEnterBack / onLeaveBack.
                //
                // Scrolling down into the section plays it in; scrolling back
                // up past it plays it out; coming down again replays it.
                // `onLeave` is deliberately `none`: reversing there would fade
                // a section out behind you as you scrolled on past it, which
                // reads as content disappearing rather than as an animation.
                toggleActions: 'play none none reverse',
              });
            }),
          );

          return cleanup;
        },
      );

      return () => mm.revert();
    },
    { scope: root, dependencies: [each, entrance, stagger, y, start] },
  );

  return (
    <div ref={root} data-reveal-scope="" className={cn(className)}>
      {children}
    </div>
  );
}

/**
 * Re-measure every trigger on the page, once, after things stop moving.
 *
 * Shared and debounced across every scope on purpose: a filter click or a
 * batch of images decoding resizes several scopes in the same breath, and
 * `ScrollTrigger.refresh()` walks every trigger there is. One call after the
 * dust settles does the same job as a dozen during.
 */
let pendingRefresh: number | undefined;

function scheduleRefresh() {
  if (pendingRefresh !== undefined) window.clearTimeout(pendingRefresh);
  pendingRefresh = window.setTimeout(() => {
    pendingRefresh = undefined;
    ScrollTrigger.refresh();
  }, 150);
}

/**
 * Create the scroll trigger once the loading panel is out of the way, and
 * return the cleanup for the wait itself.
 *
 * `setTimeout` rather than `gsap.delayedCall`: GSAP's timers run off
 * requestAnimationFrame, which a background tab stops, and a reveal that never
 * arms is content nobody can read. A timeout still fires.
 *
 * `ctx.add` matters. Anything created in here is created long after the
 * matchMedia callback returned, so gsap has no idea it belongs to this context
 * and would not revert it - the trigger would outlive the component and go on
 * driving detached nodes. Running the work through `ctx.add` puts it back
 * inside the context that owns it.
 */
function armAfterEntrance(ctx: gsap.Context, create: () => void) {
  const timer = window.setTimeout(() => ctx.add(create), PAGE_ENTRANCE_DELAY * 1000);
  return () => window.clearTimeout(timer);
}

/**
 * What this scope animates.
 *
 * Two filters, both about not animating the same pixels twice.
 *
 * **Only this scope's marks.** A mark whose nearest enclosing scope is some
 * nested Reveal belongs to that one. Without this, a Section's scope would
 * animate every row of a list that had already opened its own `each` scope, and
 * the two would fight over opacity from different triggers.
 *
 * **Outermost marks only.** If a wrapper is marked and items inside it are too,
 * animating both would fade a group in while its own children are separately
 * fading in underneath. Mark one level or the other.
 */
function collectTargets(scope: HTMLElement): HTMLElement[] {
  const marked = Array.from(scope.querySelectorAll<HTMLElement>('[data-reveal]')).filter(
    (el) =>
      el.closest('[data-reveal-scope]') === scope &&
      el.parentElement?.closest('[data-reveal]') === null,
  );
  if (marked.length) return marked;

  // Nothing marked: animate the immediate children as one block, so a section
  // that has not marked anything still moves rather than not at all. A child
  // that is - or contains - a nested scope is left out; that scope handles it.
  return (Array.from(scope.children) as HTMLElement[]).filter(
    (el) => !el.matches('[data-reveal-scope]') && el.querySelector('[data-reveal-scope]') === null,
  );
}
