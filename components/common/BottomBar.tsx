'use client';

import { useEffect, useRef } from 'react';
import { CookieNotice } from './CookieNotice';
import { MobileCTA } from './MobileCTA';

/**
 * Everything that lives pinned to the bottom of the window, in one stack.
 *
 * THE POINT IS THAT THEY DO NOT FIGHT. The analytics notice and the mobile call
 * to action are both bottom-anchored and can both be on screen at once, and a
 * first-time visitor on a phone is exactly when that happens. Two independently
 * fixed elements would have meant the notice covering the Book button on the
 * one visit where the site most wants it seen. Stacked in a single fixed
 * column, the notice simply sits on top of the bar and both are reachable.
 *
 * THE SPACER IS MEASURED, NOT WRITTEN DOWN. A fixed stack is out of the
 * document flow, so without compensation the last few centimetres of the footer
 * - the legal links and the studio phone numbers - can never be scrolled clear
 * of it. Its height changes with the viewport, with whether the notice has been
 * answered, with which route is showing (no CTA on /booking) and with the
 * iPhone home indicator, so a hardcoded height is wrong almost immediately: an
 * earlier version of this used a written-down 73px and left 5px of the footer
 * permanently underneath. A ResizeObserver on the stack keeps the page's bottom
 * padding equal to whatever the stack actually is.
 *
 * Written to `document.body` rather than to a wrapper because the footer is a
 * sibling of the page content in the root layout, and the padding has to sit
 * below both.
 *
 * LAYERING: z-30, deliberately under the header (z-50) and the mobile menu
 * (z-40), so opening the menu covers this rather than leaving a gold button
 * floating over the navigation.
 */
export function BottomBar() {
  const stack = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stack.current;
    if (!el) return;

    const apply = () => {
      document.body.style.paddingBottom = el.offsetHeight ? `${el.offsetHeight}px` : '';
    };

    const observer = new ResizeObserver(apply);
    observer.observe(el);
    apply();

    return () => {
      observer.disconnect();
      document.body.style.paddingBottom = '';
    };
  }, []);

  return (
    <div
      ref={stack}
      className="fixed inset-x-0 bottom-0 z-30 flex flex-col"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <CookieNotice />
      <MobileCTA />
    </div>
  );
}
