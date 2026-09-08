'use client';

import { useCallback, useEffect, useRef, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { PAGE_ENTER, PAGE_EXIT } from '@/lib/motion';
import { NAV_END, NAV_START } from './RouteLoader';

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * The route transition, rendered from `app/template.tsx`.
 *
 * A CROSS-FADE, NOT A LOADING PANEL. This used to drop a full-screen panel with
 * the 826 mark over the whole window on every single navigation. What happens
 * now is that the page you are leaving fades out, the route changes, and the
 * page you arrive at fades up.
 *
 * AND NOT A WIPE EITHER. A panel that swept in from the left over the outgoing
 * page and carried on off to the right replaced this fade for a few hours on
 * 2026-09-07, on the reasonable-sounding grounds that a fade between two dark
 * pages under a fixed header is very close to invisible. Mark had it taken back
 * out the same day. Both of the things that have now been tried in this slot
 * failed the same way: the honest amount of ceremony for moving between two
 * prerendered pages on the same site is close to none, and anything you can
 * clearly SEE is, by construction, something you are being made to wait for.
 * If this comes up again, the answer is not a third kind of panel.
 *
 * The panel still exists, in components/common/RouteLoader.tsx, for the two
 * moments it earns its place: a cold load, and a navigation that takes longer
 * than a second. This component tells it when a navigation starts and ends; it
 * decides whether that is long enough to be worth covering.
 *
 * ARRIVAL IS KEYED ON THE PATHNAME, NOT ON A REMOUNT. This is the important
 * one, and getting it wrong cost every studio page and every service page.
 *
 * `app/template.tsx` sits at the ROOT of the app directory, and a template is
 * keyed by its own segment level - see `node_modules/next/dist/docs/01-app/
 * 03-api-reference/03-file-conventions/template.md`: "Templates receive a
 * unique key for their own segment level. They remount when that segment
 * (including its dynamic params) changes. Navigations within deeper segments
 * do not remount higher-level templates."
 *
 * So the root template's key is `/branches` for BOTH `/branches` and
 * `/branches/c5-libis`. Going from the studio index into a studio - or from the
 * service index into a service - does not remount it. Everything the arrival
 * used to do on mount therefore never ran: the page was left at the `opacity:
 * 0` the exit fade had put it at, NAV_END was never dispatched, and the panel
 * RouteLoader raises after a second stayed up at full opacity for good.
 *
 * Measured before this was fixed: the studio page was fully rendered in the DOM
 * at ~350ms, the panel came up over it at ~1.3s and never came down, and the
 * page underneath only became visible at ~2.7s when the dead-man switch in the
 * exit put it back. That is the "it loads for a very long time" - nothing was
 * loading at all.
 *
 * `usePathname()` changes on every navigation, remount or not, so the arrival
 * hangs off that instead. Do not reach for `useSearchParams()` alongside it:
 * reading search params in a client component opts every page that renders this
 * out of static rendering. A query-only change is dealt with in the exit
 * instead - it is simply not intercepted, because it is the same page.
 *
 * ONLY THE PAGE FADES. The header and the footer live in the layout, outside
 * this template, so they never move. That is the point: the frame of the site
 * stays put and the content changes inside it, which is what makes two pages
 * feel like one visit rather than two documents.
 *
 * THE FADE-OUT NEEDS THE CLICK, NOT THE NAVIGATION. By the time a route change
 * reaches React the old page is already gone, so there is nothing left to
 * animate out. The listener below catches the click first, in the capture
 * phase, plays the exit, and only then asks the router to move. Next's Link
 * runs its own onClick before checking `defaultPrevented` (see
 * next/dist/client/app-dir/link.js), so a link's own handler - closing the
 * mobile drawer, for one - still runs exactly as it did.
 *
 * NOTHING IS EVER HIDDEN IN CSS. The fade-up starts from an opacity GSAP sets
 * inside useGSAP's layout effect, which runs before paint, and the stylesheet
 * says nothing about it. If the bundle fails to run, the page is simply
 * visible. The failsafe below is the same bargain: a page nobody can see is a
 * worse outcome than a missing transition.
 *
 * Under `prefers-reduced-motion` there is no fade in either direction - links
 * are not intercepted at all, and navigation is instant.
 *
 * THIS ELEMENT IS ONLY EVER FADED, NEVER MOVED. It briefly animated `y` once,
 * and that broke the hero. A transform makes an element the containing block
 * for every `position: fixed` descendant, so ScrollTrigger's pinned hero
 * stopped being fixed to the viewport and scrolled away with the page -
 * measured at `position: fixed` with `top: -1500px`. Opacity creates no
 * containing block, so fading is safe, and so is nothing else. Any movement
 * belongs to the individual sections (components/common/Reveal.tsx), which
 * contain nothing fixed.
 *
 * THERE IS DELIBERATELY NO `app/loading.tsx`. One existed briefly and had to
 * go: a root-level loading.tsx creates a Suspense boundary whose fallback is
 * emitted into the prerendered HTML of every page, as an opaque full-screen
 * cover with no opacity guard. With JavaScript enabled React swaps it out on
 * hydration and nobody notices; with JavaScript disabled - or during the
 * hydration gap on a slow connection - it sits on top of a page it can never
 * clear. Verified: a JS-disabled render showed that cover at opacity 1 over
 * fully-present content.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const content = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  /** Set once an exit is playing, so a second click cannot start another. */
  const leaving = useRef(false);
  /**
   * Timers the exit owns: the belt-and-braces `router.push`, and the put-the-
   * page-back for a route that never arrives. Both are answers to a navigation
   * that did not happen, so both are cancelled the moment one does. They used
   * to be cleared only on unmount, which - see above - is not something that
   * reliably happens here.
   */
  const exitTimers = useRef<number[]>([]);
  const failsafe = useRef<number | undefined>(undefined);

  const clearExitTimers = useCallback(() => {
    exitTimers.current.forEach(window.clearTimeout);
    exitTimers.current = [];
  }, []);

  // Arrive. Runs on mount, and again on every pathname change - which is not
  // the same thing, because this component often survives the navigation.
  useGSAP(
    () => {
      // Whatever the exit was waiting for is here.
      clearExitTimers();
      leaving.current = false;
      // Tell the loading panel the route has landed, in case it came up.
      window.dispatchEvent(new Event(NAV_END));

      const el = content.current;
      if (!el) return;

      // Reduced motion: no fade in either direction. The exit never ran either,
      // so there should be no inline opacity - clear it anyway, in case the
      // preference changed mid-visit and left one behind.
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(el, { clearProps: 'opacity' });
        return;
      }

      gsap.fromTo(
        el,
        { opacity: 0 },
        {
          opacity: 1,
          duration: PAGE_ENTER,
          ease: 'power2.out',
          // Kills the exit tween if it is somehow still running on this element.
          overwrite: true,
          onComplete: () => {
            // Start and end positions were measured while the page was still
            // fading, so anything pinned needs remeasuring once it has settled.
            ScrollTrigger.refresh();
            // Leave no inline opacity on an ancestor of the pin.
            gsap.set(el, { clearProps: 'opacity' });
          },
        },
      );

      // Dead-man switch. The fade runs under half a second; if the page is still
      // not visible well after that - an error elsewhere in the tree, a tab
      // throttled hard enough that GSAP never finishes - show it anyway.
      window.clearTimeout(failsafe.current);
      failsafe.current = window.setTimeout(() => {
        if (content.current) gsap.set(content.current, { opacity: 1 });
      }, 3000);
    },
    { dependencies: [pathname] },
  );

  // Leave.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const onClick = (event: MouseEvent) => {
      // Anything the browser would not treat as a plain in-page navigation is
      // left alone: middle and right clicks, open-in-new-tab, downloads,
      // `target="_blank"`, and any handler that has already claimed the event.
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest('a');
      if (!anchor || anchor.hasAttribute('download')) return;

      const anchorTarget = anchor.getAttribute('target');
      if (anchorTarget && anchorTarget !== '_self') return;
      if (!anchor.getAttribute('href')) return;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      // Off-site, or not http at all - `tel:` and `mailto:` land here, because
      // their origin is opaque and never matches this one.
      if (url.origin !== window.location.origin) return;
      // Same page: a hash link, the link to the page you are already on, or a
      // change of query string on it. The arrival is keyed on the pathname, so
      // a fade-out here is a fade-out nothing ever fades back.
      if (url.pathname === window.location.pathname) return;

      event.preventDefault();
      if (leaving.current) return;
      leaving.current = true;

      // Starts the clock on the loading panel: if this navigation is still
      // going in a second's time, the panel comes up. See RouteLoader.
      window.dispatchEvent(new Event(NAV_START));

      const href = `${url.pathname}${url.search}${url.hash}`;
      let pushed = false;
      const go = () => {
        if (pushed) return;
        pushed = true;
        router.push(href);
        // If the route never arrives, this component is still mounted and
        // still invisible. Put the page back rather than leave a blank.
        exitTimers.current.push(
          window.setTimeout(() => {
            leaving.current = false;
            if (content.current) gsap.to(content.current, { opacity: 1, duration: PAGE_ENTER });
          }, 2000),
        );
      };

      gsap.to(content.current, {
        opacity: 0,
        duration: PAGE_EXIT,
        ease: 'power2.in',
        onComplete: go,
      });

      // We have already cancelled the browser's own navigation, so `onComplete`
      // is now the only thing that will start ours - and GSAP drives its
      // timeline off requestAnimationFrame, which a tab that has stopped
      // painting never runs. Navigate anyway shortly after the fade should have
      // finished, so a click can never end in nothing happening at all.
      exitTimers.current.push(window.setTimeout(go, PAGE_EXIT * 1000 + 400));
    };

    // Capture, so this runs before Next's Link handler decides to navigate.
    document.addEventListener('click', onClick, true);
    return () => {
      document.removeEventListener('click', onClick, true);
      window.clearTimeout(failsafe.current);
      clearExitTimers();
    };
  }, [router, clearExitTimers]);

  return (
    <div ref={content} className="flex flex-1 flex-col">
      {children}
    </div>
  );
}
