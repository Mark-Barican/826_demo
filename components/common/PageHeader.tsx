import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Reveal } from '@/components/common/Reveal';
import type { Tone } from '@/components/common/Section';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
  tone?: Tone;
}

/**
 * Inner-page masthead.
 *
 * The title uses the display tier, and the radial dot-grid background is gone -
 * it was 3% opacity texture doing no work.
 *
 * NO BADGE. Every page carried a small gold label above its title - "Pricing"
 * over "What it costs.", "Studios" over "Five studios." - and it was saying the
 * page's name for the third time in the same block of screen, after the
 * breadcrumb and before a heading that already said it. Mark had it removed on
 * 2026-09-07. What it was really doing was spending the one accent colour in
 * the masthead on a label nobody needed, which left the breadcrumb - the part
 * that actually tells you where you are - in plain grey.
 *
 * So the gold moved to the crumb for the current page. There is exactly one
 * highlighted thing in this header now and it is the answer to "where am I".
 * `branch.badge` in lib/data/branches.ts ("Flagship Studio" and so on) was only
 * ever rendered here and is now unused; it was left in the data rather than
 * deleted, in case that description belongs somewhere on the branch pages.
 *
 * NO STAT BAR. Every page used to end its masthead with a four-column row of
 * figures - "Disciplines 6", "Packages 14", "Steps 4", "Cookies None". Mark had
 * it removed on 2026-09-07 and he was right: a customer cannot do anything with
 * any of them. They were furniture that made every masthead look identical and
 * pushed the actual page half a screen further down. Anything genuinely useful
 * that lived there - the Quezon City phone number, opening days - is on the page
 * itself, where someone looking for it would go.
 *
 * This is the one reveal on the site that does NOT wait for a scroll, because
 * there is no scroll to wait for: it is the first thing on the page and it is
 * always already in view. `entrance` plays it on mount once the route
 * transition has cleared, so the page arrives and then settles rather than
 * arriving already finished. Every stat is marked separately so the bar counts
 * itself in left to right instead of appearing as one slab.
 */
export function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  tone = 'ink',
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        tone === 'paper' ? 'tone-paper' : 'tone-ink',
        'border-b border-rule bg-surface pb-14 pt-32 text-fg lg:pb-20 lg:pt-40',
      )}
    >
      <Reveal entrance className="mx-auto w-full max-w-7xl px-6 sm:px-8">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav
            aria-label="Breadcrumb"
            data-reveal
            className="type-meta mb-8 flex flex-wrap items-center gap-2 text-fg-muted"
          >
            <Link href="/" className="inline-block py-1 transition-colors hover:text-fg">
              Home
            </Link>
            {breadcrumbs.map((b, i) => (
              <span key={i} className="flex items-center gap-2">
                <span aria-hidden className="text-fg-muted">/</span>
                {b.href ? (
                  <Link href={b.href} className="inline-block py-1 transition-colors hover:text-fg">
                    {b.label}
                  </Link>
                ) : (
                  /* The page you are on, and the only gold thing in this
                     header. `aria-current` already said so; now it looks it. */
                  <span className="text-accent" aria-current="page">
                    {b.label}
                  </span>
                )}
              </span>
            ))}
          </nav>
        )}

        <h1 data-reveal className="type-display max-w-4xl">
          {title}
        </h1>

        {subtitle && (
          <p data-reveal className="type-body mt-6 text-fg-muted">
            {subtitle}
          </p>
        )}

      </Reveal>
    </div>
  );
}
