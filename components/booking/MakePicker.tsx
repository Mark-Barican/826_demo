'use client';

import { useEffect, useId, useRef, useState } from 'react';

/**
 * The make picker: type or choose.
 *
 * WHAT THIS REPLACED, AND WHY. It was a plain text input with a `<datalist>`.
 * A datalist is invisible until you type, renders in the browser's own chrome
 * rather than the site's, is styled differently in every browser, and on
 * several of them cannot be opened at all without a keyboard. So the one field
 * where the site knew the answers looked like the one field where it did not.
 *
 * WHAT CAME FROM REACT BITS. Its `AnimatedList` is the closest thing in the
 * library to this, and what is worth having is its BEHAVIOUR, not its code:
 * arrow keys move a highlight through the list, the highlight scrolls itself
 * into view, hovering moves it too, and Enter takes the highlighted row. That
 * model is reproduced here. What was left behind is the rest of it - Framer
 * Motion as a new dependency, `scale: 0.7` pop-in on every row, rounded
 * corners, and gradient fade masks top and bottom. This site has no gradients
 * and no radii, and a list that springs about while you are trying to pick your
 * own car is movement for its own sake.
 *
 * IT IS A SUGGESTION, NOT A CHOICE. Anything typed is kept, whether or not it
 * is in the list, because the list cannot know about every rebadged import and
 * a form that refuses a real vehicle is worse than a shorter list. That is also
 * why this is a text input with a listbox rather than a `<select>`.
 *
 * The ARIA is the standard combobox pattern: the input owns the listbox through
 * `aria-controls`, says whether it is open, and names the highlighted row with
 * `aria-activedescendant` - so focus never leaves the input and what a screen
 * reader announces stays in step with what the highlight is doing.
 */
export function MakePicker({
  id,
  value,
  onChange,
  onBlur,
  options,
  error,
  errorId,
  placeholder,
  required,
  noun,
}: {
  id: string;
  /** "car" or "motorcycle" - what this list is a list OF, for the listbox name. */
  noun: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  options: readonly string[];
  error?: string;
  errorId?: string;
  placeholder?: string;
  required?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const wrap = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const listId = useId();

  // Everything matching what has been typed so far. An empty field offers the
  // whole list, which is the point of opening it without typing.
  const query = value.trim().toLowerCase();
  const matches = query
    ? options.filter((o) => o.toLowerCase().includes(query))
    : [...options];

  // A click anywhere else is a decision to stop picking. `pointerdown` rather
  // than `click`, so the list is gone before the thing underneath reacts.
  useEffect(() => {
    if (!open) return;
    const onDown = (event: PointerEvent) => {
      if (!wrap.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  // Keep the highlighted row on screen. This is AnimatedList's one genuinely
  // necessary effect: without it, arrowing past the sixth row highlights things
  // nobody can see.
  useEffect(() => {
    if (!open || active < 0) return;
    const row = list.current?.children[active] as HTMLElement | undefined;
    row?.scrollIntoView({ block: 'nearest' });
  }, [active, open]);

  const choose = (make: string) => {
    onChange(make);
    setOpen(false);
    setActive(-1);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        setActive(0);
        return;
      }
      const step = event.key === 'ArrowDown' ? 1 : -1;
      setActive((i) => {
        const next = i + step;
        if (next < 0) return matches.length - 1;
        if (next >= matches.length) return 0;
        return next;
      });
      return;
    }

    if (event.key === 'Enter' && open && active >= 0 && matches[active]) {
      // Only swallow the Enter when it is actually taking a suggestion,
      // otherwise this steals the key that submits the form.
      event.preventDefault();
      choose(matches[active]);
      return;
    }

    if (event.key === 'Escape' && open) {
      event.preventDefault();
      setOpen(false);
      setActive(-1);
    }
  };

  return (
    <div ref={wrap} className="relative">
      <input
        id={id}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={open && active >= 0 ? `${listId}-${active}` : undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        autoComplete="off"
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
          setActive(-1);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        onBlur={(event) => {
          // Losing focus to a row of this list is not leaving the field, so the
          // "you have not filled this in" check must not run for it.
          if (wrap.current?.contains(event.relatedTarget as Node)) return;
          setOpen(false);
          setActive(-1);
          onBlur?.();
        }}
        className={`peer w-full border bg-surface-raised px-4 py-3 text-sm text-fg placeholder:text-fg-muted focus:outline-none ${
          error ? 'border-danger' : 'border-rule'
        }`}
      />

      {/* The same growing hairline every other field in this form uses. */}
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 transition-transform duration-300 ease-out peer-focus:scale-x-100 motion-reduce:transition-none ${
          error ? 'bg-danger' : 'bg-accent'
        }`}
      />

      {open && matches.length > 0 && (
        <ul
          ref={list}
          id={listId}
          role="listbox"
          aria-label={`Suggested ${noun} makes`}
          className="absolute inset-x-0 top-full z-20 max-h-56 overflow-y-auto border border-t-0 border-rule bg-surface"
        >
          {matches.map((make, i) => (
            <li
              key={make}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              // The row must not take focus from the input - that is the whole
              // reason a combobox uses `aria-activedescendant`. `pointerdown`
              // rather than `click` for the same reason: `click` lands after
              // the blur that would already have closed the list.
              onPointerDown={(e) => {
                e.preventDefault();
                choose(make);
              }}
              onMouseEnter={() => setActive(i)}
              className={`cursor-pointer px-4 py-2.5 text-sm transition-colors ${
                i === active ? 'bg-accent text-on-accent' : 'text-fg-muted hover:text-fg'
              }`}
            >
              {make}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
