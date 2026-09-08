'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { BrandLoader } from './BrandLoader';
import { BOOT_MIN_MS, PANEL_MAX_MS, SLOW_NAVIGATION_MS } from '@/lib/motion';

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Fired by PageTransition when a link is clicked, and when a route mounts. */
export const NAV_START = '826:nav-start';
export const NAV_END = '826:nav-end';

/**
 * The loading panel, and the two moments it is allowed to appear.
 *
 * ONE: A COLD LOAD. Opening the site, or reloading, or arriving on a page from
 * outside. There is genuinely nothing on screen yet, so the panel covers the
 * gap and hands over to the page.
 *
 * TWO: A NAVIGATION THAT TAKES TOO LONG. Under a second the cross-fade in
 * PageTransition covers the change by itself and a panel would just be a flash
 * of branding. Over a second the reader is looking at a page that has already
 * faded out with nothing to say it is working, so the panel comes up. Every
 * route here is prerendered, so in practice this fires on a cold cache or a bad
 * connection - which is exactly when it should.
 *
 * It never appears on an ordinary page change. That was the previous behaviour
 * and it is what made every click feel slow.
 *
 * WHY THIS LIVES IN THE LAYOUT AND NOT IN THE TEMPLATE. `app/template.tsx`
 * remounts on every navigation, which is the whole point of it - but a panel
 * that unmounts the instant the new route arrives cannot fade out over the page
 * it was covering. Here it persists across navigations and can hand over
 * properly.
 *
 * IT NEVER TAKES POINTER EVENTS. `pointer-events: none` is on the element and
 * nothing ever lifts it. An earlier version raised it while the panel was up
 * and dropped it again on the way out, which is one failed animation away from
 * an invisible full-screen sheet that swallows every click on the site -
 * opacity 0 does not stop an element receiving them. Caught in testing: a
 * navigation click landed on the panel instead of the link and the page simply
 * never moved. Blocking input for the length of a load is not worth that.
 *
 * IT IS NEVER VISIBLE IN THE SERVER-RENDERED HTML. The overlay ships at
 * `opacity: 0` from an inline style and only GSAP ever raises it. With
 * JavaScript disabled it stays invisible and inert rather than sitting over a
 * page it can never clear - see the note in BrandLoader about `app/loading.tsx`,
 * which is the same failure and the reason that file does not exist.
 */
export function RouteLoader() {
  const overlay = useRef<HTMLDivElement>(null);
  /** True until the cold-load panel has been dismissed. */
  const booting = useRef(true);

  useGSAP(() => {
    const el = overlay.current;
    if (!el) return;

    // Cover immediately - inside the layout effect, so before first paint.
    gsap.set(el, { opacity: 1 });

    const hide = () => {
      booting.current = false;
      gsap.to(el, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.inOut',
        onComplete: () => ScrollTrigger.refresh(),
      });
    };

    // A FIXED HOLD, NOT A READINESS SIGNAL. This waited on `document.fonts.ready`
    // so the page would not be swapped in mid-reflow, and that is a promise which
    // can simply never settle - it did not in testing, and the panel then sat
    // there for the full three-second failsafe on every single load. The page is
    // server-rendered and hydration is quick, so a short predictable hold is
    // both safer and better: the reader gets the same panel for the same length
    // of time every time, rather than a wait that depends on the font cache.
    const held = window.setTimeout(hide, BOOT_MIN_MS);

    return () => window.clearTimeout(held);
  });

  // A navigation that outstays its welcome.
  useEffect(() => {
    let slow: number | undefined;
    let capped: number | undefined;

    const lower = () => {
      window.clearTimeout(capped);
      if (!overlay.current) return;
      // Only animate if it actually came up; otherwise this is a no-op.
      gsap.to(overlay.current, { opacity: 0, duration: 0.4, ease: 'power2.inOut' });
    };

    const onStart = () => {
      window.clearTimeout(slow);
      slow = window.setTimeout(() => {
        if (booting.current || !overlay.current) return;
        gsap.to(overlay.current, { opacity: 1, duration: 0.28, ease: 'power2.out' });
        // THE PANEL COMES DOWN WHETHER OR NOT THE ROUTE SAYS SO. NAV_END is the
        // signal it wants, and there were routes that never sent one - every
        // studio and every service page, see the note in PageTransition about
        // the root template not remounting into a dynamic segment. The page was
        // rendered and readable underneath the whole time; this panel was the
        // only thing between it and the reader, and nothing would have taken it
        // away.
        window.clearTimeout(capped);
        capped = window.setTimeout(lower, PANEL_MAX_MS);
      }, SLOW_NAVIGATION_MS);
    };

    const onEnd = () => {
      window.clearTimeout(slow);
      if (booting.current) return;
      lower();
    };

    window.addEventListener(NAV_START, onStart);
    window.addEventListener(NAV_END, onEnd);
    return () => {
      window.clearTimeout(slow);
      window.clearTimeout(capped);
      window.removeEventListener(NAV_START, onStart);
      window.removeEventListener(NAV_END, onEnd);
    };
  }, []);

  return (
    <div
      ref={overlay}
      aria-hidden
      style={{ opacity: 0 }}
      className="pointer-events-none fixed inset-0 z-[90]"
    >
      <BrandLoader />
    </div>
  );
}
