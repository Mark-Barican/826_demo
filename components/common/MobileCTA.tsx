'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PRIMARY_BRANCH } from '@/lib/data/branches';

/**
 * The standing call to action on a phone.
 *
 * WHAT IT IS FIXING. Below `md` the header collapses to a mark and a hamburger:
 * measured on the homepage at 375x812, the only things a customer could reach
 * without opening a menu or scrolling were the logo and the menu button, and
 * the hero's own "Book Consultation" sat at 672px - inside an 812px viewport by
 * 140px, and below the fold on any shorter phone. So on the most common device
 * the site had no visible way to act on it. This means every page has one, at
 * every scroll position, without a customer having to find the menu.
 *
 * TWO ACTIONS, NOT ONE. Booking is the considered path and gets the filled
 * button; the phone number is the impatient one and gets equal room, because
 * this is a business where a customer with a chipped bonnet would rather ask a
 * person. `tel:` with the spaces stripped - a dialler will not parse "0956 330
 * 8477" reliably - and it points at the Quezon City studio, which is the one
 * branches.ts nominates to stand for the business.
 *
 * IT IS NOT SHOWN ON /booking. A button that sends you to the page you are
 * already reading is furniture, and it would sit on top of the form's own
 * submit control.
 *
 * This renders only the bar itself. Being fixed, keeping clear of the footer
 * and sharing the bottom of the screen with the analytics notice are all
 * BottomBar's job - see the note there about why the spacer is measured rather
 * than written down.
 */
export function MobileCTA() {
  const pathname = usePathname();
  if (pathname === '/booking') return null;

  return (
    <div className="tone-ink border-t border-rule bg-surface px-4 py-3 text-fg md:hidden">
      <div className="flex gap-3">
        <Link
          href="/booking"
          className="type-meta flex min-h-[48px] flex-1 items-center justify-center bg-accent px-4 text-on-accent transition-colors hover:bg-accent-hover"
        >
          Book
        </Link>
        <a
          href={`tel:${PRIMARY_BRANCH.phone.replace(/\s+/g, '')}`}
          className="type-meta flex min-h-[48px] flex-1 items-center justify-center border border-rule px-4 text-fg transition-colors hover:bg-surface-raised"
        >
          Call
        </a>
      </div>
    </div>
  );
}
