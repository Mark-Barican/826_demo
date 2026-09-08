import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Instagram and Facebook marks, and the row that holds them.
 *
 * The icons are inline SVG rather than an icon package. lucide-react is already
 * a dependency but dropped its brand icons, and pulling in a second icon
 * library for two glyphs is not worth the bundle.
 *
 * `currentColor` throughout, so the marks inherit whatever the surrounding text
 * is doing - including the hover colour - and work on both the ink and paper
 * tones without a second set of rules.
 *
 * The row renders NOTHING when it has no links. Both URLs are `null` in the
 * data until 826 supplies them (see SOCIAL in lib/data/brand.ts), and an empty
 * row of icons pointing nowhere is worse than no row.
 */

function InstagramMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4" fill="currentColor">
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.51 1.49-3.89 3.77-3.89 1.09 0 2.24.19 2.24.19v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99A10 10 0 0 0 22 12Z" />
    </svg>
  );
}

interface SocialLinksProps {
  instagram?: string | null;
  facebook?: string | null;
  /** Overrides the Facebook label, for a page that belongs to one studio. */
  facebookLabel?: string;
  className?: string;
}

export function SocialLinks({
  instagram,
  facebook,
  facebookLabel = 'Facebook',
  className,
}: SocialLinksProps) {
  if (!instagram && !facebook) return null;

  return (
    <ul className={cn('flex flex-wrap items-center gap-x-6 gap-y-3', className)}>
      {instagram && (
        <SocialLink href={instagram} label="Instagram">
          <InstagramMark />
        </SocialLink>
      )}
      {facebook && (
        <SocialLink href={facebook} label={facebookLabel}>
          <FacebookMark />
        </SocialLink>
      )}
    </ul>
  );
}

/**
 * One account. `noopener noreferrer` because these open off-site, and a visible
 * label beside the mark because an unlabelled glyph is a guess for anyone using
 * a screen reader or unfamiliar with the icon.
 */
function SocialLink({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="type-meta inline-flex min-h-[44px] items-center gap-2.5 text-fg-muted transition-colors hover:text-accent"
      >
        {children}
        <span>{label}</span>
      </a>
    </li>
  );
}
