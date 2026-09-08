import type { ReactNode } from 'react';
import { Reveal } from '@/components/common/Reveal';

/**
 * Shared furniture for /terms and /privacy.
 *
 * Legal copy is long-form reading, so it gets a measure, real paragraph
 * spacing and numbered sections rather than the card treatment the rest of the
 * site uses.
 *
 * Each section opens its own reveal scope, because these pages are a single
 * long column of eight or nine sections with no Section component anywhere -
 * one trigger at the top would play the whole document while the reader is
 * still on section one. The numbered heading counts in first, then each
 * paragraph and each bullet behind it, which is roughly the order they get
 * read in.
 */
export function LegalSection({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-rule py-10 sm:py-12">
      <Reveal className="grid gap-6 lg:grid-cols-12 lg:gap-12">
        <div data-reveal className="lg:col-span-4">
          <span className="type-meta text-accent">{String(n).padStart(2, '0')}</span>
          <h2 className="type-card mt-2">{title}</h2>
        </div>
        {/* Unmarked, so the marks inside it - the paragraphs and bullet rows -
            are what cascade. Marking this too would fade the column in over its
            own children fading in. */}
        <div className="flex flex-col gap-4 lg:col-span-8">{children}</div>
      </Reveal>
    </section>
  );
}

export function P({ children }: { children: ReactNode }) {
  return (
    <p data-reveal className="type-body text-fg-muted">
      {children}
    </p>
  );
}

export function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul className="flex flex-col">
      {items.map((item, i) => (
        <li
          key={i}
          data-reveal
          className="border-b border-rule-soft py-3 type-detail text-fg-muted last:border-0"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

/**
 * A fact 826 has not supplied. Renders a visible, honest placeholder rather
 * than letting the page imply something that was never provided.
 */
export function Unpublished({ what }: { what: string }) {
  return (
    <span className="border-b border-dashed border-accent text-fg">
      [{what} not yet published &mdash; please ask at any studio]
    </span>
  );
}
