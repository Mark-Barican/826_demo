'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { RuledGrid, RULED_CELL } from '@/components/common/RuledGrid';
import { BRANCHES, PRIMARY_BRANCH, STUDIO_COUNT } from '@/lib/data/branches';
import { SERVICES } from '@/lib/data/services';
import { BRAND_NAME } from '@/lib/data/brand';

gsap.registerPlugin(useGSAP);

interface NavLink {
  href: string;
  label: string;
  /** Opens the services mega menu on hover/focus. Only one entry has it. */
  mega?: boolean;
}

const NAV: readonly NavLink[] = [
  { href: '/services', label: 'Services', mega: true },
  { href: '/work', label: 'Work' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/branches', label: 'Studios' },
  { href: '/about', label: 'About' },
];

/**
 * Site header.
 *
 * Two things came from XPEL. The services mega menu, because the five
 * `/services/[slug]` pages existed but were only reachable from the footer and
 * one homepage grid. And a persistent studio locator beside the booking CTA -
 * on XPEL the installer locator is the most-used thing in the header, and 826
 * has the same question to answer.
 *
 * The bar is solid at every scroll position. It used to fade to a
 * `from-black/70` gradient at the top, but the hero behind it is a LIGHT studio
 * scene, so the gradient washed out over the frame and the nav sat on a muddy
 * half-tone. Solid black is legible against the footage at any scroll offset,
 * and it is cheaper than the old `backdrop-blur-md` plus `shadow-2xl` over a
 * scrubbing canvas.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const pathname = usePathname();
  const megaRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Escape closes the mega menu and the drawer.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setMegaOpen(false);
      setMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // The drawer is a full-screen overlay, so the page behind it must not scroll.
  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  /**
   * The drawer's open and close.
   *
   * IT STAYS IN THE DOM. It used to be `{mobileOpen && <div .../>}`, which can
   * only ever cut: React tears the node out the moment the state flips, so
   * there is nothing left to animate on the way out. Now it is always rendered
   * and `autoAlpha` carries it in and out - GSAP's autoAlpha is opacity plus
   * `visibility`, so at rest the drawer is `visibility: hidden`: out of the
   * accessibility tree, out of the tab order, and unable to take a tap.
   *
   * THE CLOSED STATE IS IN CSS HERE, AND THAT IS THE RIGHT WAY ROUND. Every
   * other animation on this site is built so a bundle that never runs leaves
   * content VISIBLE (see components/common/Reveal.tsx). A drawer inverts that:
   * the failure to avoid is a full-screen sheet of links sitting over the page
   * with no script to dismiss it. So the markup ships `invisible opacity-0` and
   * only a click on a button that requires JavaScript ever lifts it.
   *
   * `md:hidden` on the element still wins at desktop width, because it sets
   * `display` and this only ever touches opacity and visibility. Open the
   * drawer on a phone, rotate to a tablet, and it is simply gone.
   */
  const drawerRef = useRef<HTMLDivElement>(null);
  /** Nothing to animate out until something has been opened. */
  const drawerUsed = useRef(false);

  useGSAP(
    () => {
      const el = drawerRef.current;
      if (!el) return;

      const rows = el.querySelectorAll('[data-drawer-item]');
      const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      gsap.killTweensOf([el, rows]);

      if (mobileOpen) {
        drawerUsed.current = true;
        if (still) {
          gsap.set(el, { autoAlpha: 1 });
          gsap.set(rows, { opacity: 1, y: 0 });
          return;
        }
        // The panel arrives first and the rows come up through it, so the
        // drawer reads as one surface rather than a list assembling itself.
        gsap.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.22, ease: 'power2.out' });
        gsap.fromTo(
          rows,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out', stagger: 0.028, delay: 0.06 },
        );
        return;
      }

      // First render, and every render on a page that never opened it: park it
      // closed without playing anything.
      if (!drawerUsed.current || still) {
        gsap.set(el, { autoAlpha: 0 });
        return;
      }

      // Out as one piece. Staggering the rows away is a second thing to sit
      // through when the reader has already said they want this gone.
      gsap.to(el, { autoAlpha: 0, duration: 0.18, ease: 'power2.in' });
    },
    { dependencies: [mobileOpen] },
  );

  // A back or forward gesture with the drawer open would otherwise leave it
  // covering the page it just navigated to. Every link inside closes it on
  // click; this is for the navigations that do not go through one.
  //
  // Subscribed to `popstate` rather than run off a `pathname` change, which
  // would be a setState in an effect body - the cascading-render pattern this
  // project's React Compiler lint rejects, and rightly: the drawer closing is
  // this component reacting to the browser, not to its own render.
  useEffect(() => {
    const close = () => setMobileOpen(false);
    window.addEventListener('popstate', close);
    return () => window.removeEventListener('popstate', close);
  }, []);

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(href));

  /**
   * The rule under the current page, as ONE element that travels.
   *
   * It used to be a separate `<span>` rendered inside whichever link was
   * active, which is why changing page made it vanish from one word and appear
   * under another: there was never a single thing to move. This is one rule
   * belonging to the nav, measured against the active link and slid into place.
   *
   * IT IS POSITIONED IMPERATIVELY, NOT THROUGH STATE, and that is deliberate
   * twice over. Measuring an element and then setting state with the result is
   * the cascading-render pattern this project's React Compiler lint rejects.
   * And the rule is `aria-hidden` decoration that React has no other reason to
   * re-render for - writing two style properties on a ref is both cheaper and
   * the thing the measurement is actually for.
   */
  const navRef = useRef<HTMLElement>(null);
  const markerRef = useRef<HTMLSpanElement>(null);
  const navItems = useRef(new Map<string, HTMLElement>());
  /** False until the rule has been placed once, so it never flies in from x=0. */
  const placed = useRef(false);

  useEffect(() => {
    const nav = navRef.current;
    const marker = markerRef.current;
    if (!nav || !marker) return;

    let cancelled = false;
    /**
     * The last position written, so a re-measure that changes nothing writes
     * nothing.
     *
     * This guard is what makes the animation survive. A ResizeObserver fires
     * once the moment you observe an element, and `document.fonts.ready`
     * resolves immediately when the fonts are already cached - so on a page
     * change both would fire straight after the animated placement and, being
     * un-animated, would snap the rule to its destination with the transition
     * still in flight. Neither of them has anything new to say in that moment,
     * and now neither of them says it.
     */
    let last = '';

    const place = (animate: boolean) => {
      if (cancelled) return;

      const active = NAV.find((link) => isActive(link.href));
      const el = active ? navItems.current.get(active.href) : undefined;

      // Nowhere to be - /booking, /contact and the legal pages are not in the
      // nav. Fade out and hold the last position rather than sliding to the
      // left edge, so coming back lands from where it left.
      if (!el) {
        marker.style.opacity = '0';
        last = '';
        return;
      }

      const navBox = nav.getBoundingClientRect();
      const box = el.getBoundingClientRect();
      const x = Math.round(box.left - navBox.left);
      const width = Math.round(box.width);

      const next = `${x}|${width}`;
      if (!animate && next === last) return;
      last = next;

      // A reader who prefers less motion gets the jump every time.
      const still = !animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      marker.style.transition = still
        ? 'none'
        : 'transform 480ms cubic-bezier(0.16, 1, 0.3, 1), width 480ms cubic-bezier(0.16, 1, 0.3, 1), opacity 200ms linear';
      marker.style.transform = `translateX(${x}px)`;
      marker.style.width = `${width}px`;
      marker.style.opacity = '1';
    };

    // The first placement of the session is a jump - there is nowhere to
    // travel from. Every later run of this effect is a page change, which is
    // the whole point of the thing.
    place(placed.current);
    placed.current = true;

    // The nav reflows on resize, and again when the web font swaps in - Mona
    // Sans is loaded `display: 'swap'`, so every label is measured at one width
    // and repainted at another. Without this the rule sits under the fallback
    // font's idea of where "Pricing" ended. Neither is a page change, so
    // neither animates: they correct the rule, they do not move it.
    const observer = new ResizeObserver(() => place(false));
    observer.observe(nav);
    document.fonts?.ready.then(() => place(false)).catch(() => {});

    return () => {
      cancelled = true;
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // A short grace period on leave, so crossing the gap between the trigger and
  // the panel does not close it.
  const openMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };
  const closeMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMegaOpen(false), 120);
  };

  return (
    <>
      <header
        className={`tone-ink fixed inset-x-0 top-0 z-50 transition-[background-color,padding,border-color] duration-300 ${
          scrolled || megaOpen
            ? 'border-b border-rule bg-surface py-3'
            : 'border-b border-transparent bg-surface py-5'
        }`}
        onMouseLeave={closeMega}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 sm:px-8">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-3"
            onClick={() => setMobileOpen(false)}
          >
            <Image
              src="/brand/826 logo.webp"
              alt={`${BRAND_NAME} - home`}
              width={120}
              height={40}
              priority
              className="h-8 w-auto object-contain sm:h-9"
            />
          </Link>

          <nav
            ref={navRef}
            aria-label="Main"
            className="relative hidden items-center gap-5 md:flex lg:gap-8"
          >
            {NAV.map((link) => {
              // One ref map keyed by href, so the rule can find whichever link
              // is current without caring where it sits in the row.
              const register = (el: HTMLAnchorElement | null) => {
                if (el) navItems.current.set(link.href, el);
                else navItems.current.delete(link.href);
              };

              const className = `type-meta py-2 transition-colors hover:text-fg ${
                isActive(link.href) ? 'text-accent' : 'text-fg-muted'
              }`;

              return link.mega ? (
                <div key={link.href} onMouseEnter={openMega} onFocus={openMega}>
                  <Link
                    ref={register}
                    href={link.href}
                    aria-expanded={megaOpen}
                    aria-current={isActive(link.href) ? 'page' : undefined}
                    className={className}
                  >
                    {link.label}
                  </Link>
                </div>
              ) : (
                <Link
                  key={link.href}
                  ref={register}
                  href={link.href}
                  onMouseEnter={closeMega}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  className={className}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* The travelling rule. Starts at zero width and transparent, so a
                page with no nav entry - or a bundle that never runs - shows
                nothing rather than a stray mark at the left edge. Colour on the
                active label is what carries the state for anyone who cannot see
                this, along with `aria-current` above. */}
            <span
              ref={markerRef}
              aria-hidden
              className="pointer-events-none absolute -bottom-0.5 left-0 h-px w-0 bg-accent opacity-0"
            />
          </nav>

          <div className="hidden shrink-0 items-center gap-3 sm:flex">
            <Link
              href="/branches"
              className="type-meta hidden min-h-[44px] items-center border border-rule px-4 text-fg transition-colors hover:border-accent hover:text-accent lg:inline-flex"
            >
              Find a studio
            </Link>
            <Link
              href="/booking"
              className="type-meta inline-flex min-h-[44px] items-center bg-accent px-5 text-on-accent transition-colors hover:bg-accent-hover"
            >
              Book
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="p-2 text-fg md:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {/* Three bars into an X. The two outer bars carry the whole
                gesture, so they get the long expressive ease the drawer uses;
                the middle one just leaves, quickly, so it is not still fading
                while the cross is already formed. */}
            <span aria-hidden className="flex h-4 w-6 flex-col justify-between">
              <span
                className={`h-0.5 origin-center bg-current transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  mobileOpen ? 'translate-y-[7px] rotate-45' : ''
                }`}
              />
              <span
                className={`h-0.5 bg-current transition-opacity duration-150 ${
                  mobileOpen ? 'opacity-0' : 'delay-100'
                }`}
              />
              <span
                className={`h-0.5 origin-center bg-current transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  mobileOpen ? '-translate-y-[7px] -rotate-45' : ''
                }`}
              />
            </span>
          </button>
        </div>

        {/* Services mega menu */}
        <div
          ref={megaRef}
          onMouseEnter={openMega}
          className={`absolute inset-x-0 top-full hidden border-b border-rule bg-surface md:block ${
            megaOpen ? '' : 'pointer-events-none opacity-0'
          } transition-opacity duration-200`}
          aria-hidden={!megaOpen}
        >
          {/* The padding used to sit on the ruled grid itself, so `bg-rule`
              painted the gutters either side as two grey bands. It belongs on
              the container. */}
          <div className="mx-auto max-w-7xl px-6 sm:px-8">
            <RuledGrid className="lg:grid-cols-3">
              {/* No 01-06 above these. They are six services, not six steps -
                  nothing about ceramic tint comes after paint correction - so
                  the ordinals were counting the list rather than telling anyone
                  anything, and they were the first thing the eye landed on in
                  every cell. The service name should be. */}
              {SERVICES.map((s) => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  tabIndex={megaOpen ? undefined : -1}
                  onClick={() => setMegaOpen(false)}
                  className={`${RULED_CELL} group flex flex-col gap-3 bg-surface p-6 transition-colors hover:bg-surface-raised`}
                >
                  <span className="type-card">{s.shortTitle}</span>
                  <span className="type-detail text-fg-muted">{s.tagline}</span>
                  <span className="type-meta mt-auto pt-2 text-fg-muted">{s.duration}</span>
                </Link>
              ))}
            </RuledGrid>
          </div>
        </div>
      </header>

      {/* Mobile drawer. Always rendered, `invisible opacity-0` until the button
          lifts it - see the note on the animation above. */}
      <div
        ref={drawerRef}
        id="mobile-nav"
        className="tone-ink invisible fixed inset-0 z-40 flex flex-col overflow-y-auto overscroll-contain bg-surface px-6 pb-12 pt-24 text-fg opacity-0 md:hidden"
      >
        <nav aria-label="Mobile" className="flex flex-col">
          <Link
            href="/"
            data-drawer-item
            onClick={() => setMobileOpen(false)}
            className={`type-card border-b border-rule py-4 ${pathname === '/' ? 'text-accent' : ''}`}
          >
            Home
          </Link>
          {NAV.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-drawer-item
              onClick={() => setMobileOpen(false)}
              className={`type-card border-b border-rule py-4 ${
                isActive(link.href) ? 'text-accent' : ''
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            data-drawer-item
            onClick={() => setMobileOpen(false)}
            className={`type-card border-b border-rule py-4 ${
              pathname === '/contact' ? 'text-accent' : ''
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* Services, which the desktop mega menu also exposes. */}
        <span data-drawer-item className="type-meta mt-8 text-fg-muted">
          Services
        </span>
        <ul data-drawer-item className="mt-3 flex flex-col">
          {SERVICES.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/services/${s.slug}`}
                onClick={() => setMobileOpen(false)}
                className="block border-b border-rule-soft py-3 type-value text-fg-muted"
              >
                {s.title}
              </Link>
            </li>
          ))}
        </ul>

        <div data-drawer-item className="mt-8 flex flex-col gap-3">
          <Link
            href="/booking"
            onClick={() => setMobileOpen(false)}
            className="type-meta inline-flex min-h-[48px] items-center justify-center bg-accent px-6 text-on-accent"
          >
            Book a consultation
          </Link>
          <Link
            href="/branches"
            onClick={() => setMobileOpen(false)}
            className="type-meta inline-flex min-h-[48px] items-center justify-center border border-rule px-6 text-fg"
          >
            Find a studio
          </Link>
        </div>

        <div data-drawer-item className="type-meta mt-8 flex flex-col gap-1.5 text-fg-muted">
          <span>
            {PRIMARY_BRANCH.city}: {PRIMARY_BRANCH.phone}
          </span>
          <span>
            {STUDIO_COUNT} studios &middot; {BRANCHES[0].hours[0]?.time ?? 'Call for hours'}
          </span>
        </div>
      </div>
    </>
  );
}
