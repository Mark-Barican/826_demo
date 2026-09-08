import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * The class every cell of a RuledGrid has to carry.
 *
 * The rules belong to the cells rather than to the container - see the
 * `.ruled-grid` note in app/globals.css for why. One left edge and one top edge
 * each: that draws every internal boundary exactly once, and draws nothing at
 * all beside a cell that is not there.
 */
export const RULED_CELL = 'border-l border-t border-rule';

type RuledGridTag = 'div' | 'ul' | 'ol';

interface RuledGridProps {
  /** The element to render. Lists stay lists. */
  as?: RuledGridTag;
  /** Column classes and anything else. Do NOT pass margin utilities - see below. */
  className?: string;
  id?: string;
  children: ReactNode;
}

/**
 * A grid ruled with hairlines, that leaves no slab of rule colour behind when a
 * row comes up short.
 *
 * Replaces `grid gap-px bg-rule` + `bg-surface` cells. Give every child
 * `RULED_CELL`; the grid handles the rest.
 *
 * NO MARGIN UTILITIES ON THIS. `.ruled-grid` sets a negative top and left
 * margin of its own, and it is an unlayered rule, so it beats anything Tailwind
 * would put on the same element - an `mx-auto` here would be silently ignored
 * and the grid would sit against the left edge. Centering and width belong on a
 * wrapper.
 *
 * NO TOP BORDER ON THIS EITHER, for the same reason the outer rules disappear:
 * the first pixel is clipped away. Where a rule is wanted above a grid, put it
 * on the element around it.
 */
export function RuledGrid({ as: Tag = 'div', className, id, children }: RuledGridProps) {
  return (
    <Tag id={id} className={cn('ruled-grid grid', className)}>
      {children}
    </Tag>
  );
}
