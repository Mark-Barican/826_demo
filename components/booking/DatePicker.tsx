'use client';

import { useEffect, useId, useRef, useState } from 'react';

/**
 * The preferred-date picker.
 *
 * REACT BITS HAS NO DATE PICKER. Its whole inventory is Text Animations,
 * Animations, Components and Backgrounds, and there is nothing date-shaped
 * anywhere in it. The nearest thing is `OptionWheel`, an iOS-style roller -
 * which is a real way to pick a date, but it is built out of `blur`, a 3D tilt,
 * a curve and an optional tick sound, and this site bans blur and glow outright.
 * A spinning frosted wheel in the middle of a flat, hairline-ruled form would
 * look like it had been pasted in from another website. So this is a month grid
 * written in the site's own language: square cells, one hairline between them,
 * gold for the day you picked.
 *
 * WHAT IT REPLACED. A bare `<input type="date">`. That is not a bad control -
 * on a phone it opens the OS picker, which beats anything hand-built - but on a
 * desktop it renders as a text box with a browser-drawn calendar icon, styled
 * by the browser rather than by the site, and it is the one field that looked
 * borrowed.
 *
 * WHAT IT KEEPS FROM THE NATIVE ONE. Past dates cannot be chosen, because a
 * preference for last Tuesday is not a preference. And no date at all is a
 * legitimate answer - it is in fact the default - so "Earliest available" is a
 * real option in the grid rather than something you achieve by deleting text.
 *
 * The value is the same `YYYY-MM-DD` string the native input produced, so
 * everything downstream - the validation, the summary, the empty-means-earliest
 * behaviour - is untouched.
 */

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'] as const;
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const;

/** `YYYY-MM-DD` for a local date, avoiding the UTC shift `toISOString` applies. */
function toKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/** Monday-first offset for the 1st of a month; JS weeks start on Sunday. */
function leadingBlanks(year: number, month: number): number {
  return (new Date(year, month, 1).getDay() + 6) % 7;
}

/**
 * `2026-09-10` as "10 September 2026".
 *
 * Exported because the summary at the end of the form is written to be read
 * down a phone, and nobody reads out "twenty twenty six dash zero nine".
 */
export function formatLong(key: string): string {
  const [y, m, d] = key.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

export function DatePicker({
  id,
  value,
  onChange,
  describedBy,
}: {
  id: string;
  /** `YYYY-MM-DD`, or empty for no preference. */
  value: string;
  onChange: (v: string) => void;
  describedBy?: string;
}) {
  const now = new Date();
  const todayKey = toKey(now.getFullYear(), now.getMonth(), now.getDate());

  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => {
    const [y, m] = value ? value.split('-').map(Number) : [now.getFullYear(), now.getMonth() + 1];
    return { year: y, month: m - 1 };
  });
  const wrap = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (event: PointerEvent) => {
      if (!wrap.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const blanks = leadingBlanks(view.year, view.month);

  // Never page back past the current month: everything in it would be dead.
  const atFirstMonth =
    view.year === now.getFullYear() && view.month === now.getMonth();

  const shiftMonth = (by: number) => {
    setView((v) => {
      const next = new Date(v.year, v.month + by, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });
  };

  const pick = (key: string) => {
    onChange(key);
    setOpen(false);
  };

  return (
    <div ref={wrap} className="relative">
      <button
        id={id}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-describedby={describedBy}
        onClick={() => setOpen((o) => !o)}
        className="peer flex w-full items-center justify-between border border-rule bg-surface-raised px-4 py-3 text-left text-sm text-fg transition-colors hover:border-fg-muted focus:outline-none"
      >
        <span className={value ? 'text-fg' : 'text-fg-muted'}>
          {value ? formatLong(value) : 'Earliest available'}
        </span>
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className="h-4 w-4 shrink-0 text-fg-muted"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="square"
        >
          <path d="M4 7h16M4 7v13h16V7M8 4v5M16 4v5" />
        </svg>
      </button>

      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-300 ease-out peer-focus:scale-x-100 motion-reduce:transition-none"
      />

      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-label="Choose a preferred date"
          className="absolute inset-x-0 top-full z-20 border border-t-0 border-rule bg-surface p-4"
        >
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => shiftMonth(-1)}
              disabled={atFirstMonth}
              aria-label="Previous month"
              className="grid h-9 w-9 place-items-center border border-rule text-fg transition-colors hover:bg-accent hover:text-on-accent disabled:pointer-events-none disabled:opacity-30"
            >
              <Chevron left />
            </button>

            <p aria-live="polite" className="type-meta">
              {MONTHS[view.month]} {view.year}
            </p>

            <button
              type="button"
              onClick={() => shiftMonth(1)}
              aria-label="Next month"
              className="grid h-9 w-9 place-items-center border border-rule text-fg transition-colors hover:bg-accent hover:text-on-accent"
            >
              <Chevron />
            </button>
          </div>

          <div aria-hidden className="mt-4 grid grid-cols-7 gap-px">
            {WEEKDAYS.map((d) => (
              <span key={d} className="type-meta py-1 text-center text-[11px] text-fg-muted">
                {d}
              </span>
            ))}
          </div>

          <div role="grid" className="mt-1 grid grid-cols-7 gap-px">
            {Array.from({ length: blanks }, (_, i) => (
              <span key={`blank-${i}`} aria-hidden />
            ))}

            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const key = toKey(view.year, view.month, day);
              const past = key < todayKey;
              const chosen = key === value;
              const isToday = key === todayKey;

              return (
                <button
                  key={key}
                  type="button"
                  role="gridcell"
                  disabled={past}
                  aria-current={isToday ? 'date' : undefined}
                  aria-label={formatLong(key)}
                  onClick={() => pick(key)}
                  className={`grid h-10 place-items-center border text-sm tabular-nums transition-colors ${
                    chosen
                      ? 'border-accent bg-accent text-on-accent'
                      : past
                        ? 'border-transparent text-fg-muted/30'
                        : isToday
                          ? 'border-accent text-fg hover:bg-surface-raised'
                          : 'border-transparent text-fg hover:bg-surface-raised'
                  } ${past ? 'cursor-default' : ''}`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* No date is the default and a real answer, so it gets a real
              control rather than being something you reach by clearing text. */}
          <button
            type="button"
            onClick={() => pick('')}
            className={`type-meta mt-4 flex min-h-[44px] w-full items-center justify-center border transition-colors ${
              value
                ? 'border-rule text-fg hover:border-accent hover:text-accent'
                : 'border-accent text-accent'
            }`}
          >
            Earliest available
          </button>
        </div>
      )}
    </div>
  );
}

function Chevron({ left = false }: { left?: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="square"
    >
      <path d={left ? 'M15 5 8 12l7 7' : 'M9 5l7 7-7 7'} />
    </svg>
  );
}
