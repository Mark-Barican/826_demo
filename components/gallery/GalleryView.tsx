'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Image from 'next/image';
import { Reveal } from '@/components/common/Reveal';
import { RuledGrid, RULED_CELL } from '@/components/common/RuledGrid';
import { GALLERY_PROJECTS, type GalleryProject } from '@/lib/data/gallery';

/**
 * Portfolio grid and lightbox.
 *
 * Changes beyond layout:
 *
 * - Categories are derived from GALLERY_PROJECTS rather than typed inline. The
 *   inline list had already drifted: it labelled `customer` as "Client
 *   Deliveries" while the data calls it "Client Handoffs", so the tab and the
 *   card disagreed.
 * - The lightbox was a div with no dialog semantics, no Escape handler, no
 *   focus trap and no scroll lock. It is now a modal dialog that takes focus,
 *   returns it on close, cycles Tab within itself, and moves between photos on
 *   the arrow keys.
 * - Cards are 4:5, which is the aspect the photographs actually are. `branch`
 *   is not printed - see the note at the top of lib/data/gallery.ts.
 *
 * LIGHTBOX LAYOUT. It used to be a single column - header, one landscape image
 * box, a thumbnail strip, then a footer. Two things were wrong with that. The
 * photographs are 4:5 portrait and the box was `aspect-[4/3]`, so every image
 * sat pillarboxed between two wide bands of empty black. And the image pane was
 * `flex-1` inside a `max-h-[92vh]` container whose children could not shrink,
 * so it ate the space underneath and the thumbnail strip was cut in half.
 *
 * It is now two columns: the photograph takes the height it needs on the left,
 * and everything else lives in a panel on the right that scrolls on its own.
 * The thumbnails wrap in a grid there rather than sitting in one clipped row.
 * `min-h-0` on both columns is what actually allows them to shrink inside the
 * capped dialog - without it the old clipping comes straight back.
 */
export function GalleryView() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selected, setSelected] = useState<GalleryProject | null>(null);
  const [imageIndex, setImageIndex] = useState(0);

  const filtersRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLSpanElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  // One tab per category actually present, in the order the data defines them,
  // labelled with the data's own label so the tab and the card agree.
  const categories = useMemo(() => {
    const seen = new Map<string, string>();
    for (const p of GALLERY_PROJECTS) {
      if (!seen.has(p.category)) seen.set(p.category, p.categoryLabel);
    }
    return [{ id: 'all', label: 'Everything' }, ...[...seen].map(([id, label]) => ({ id, label }))];
  }, []);

  const projects =
    activeCategory === 'all'
      ? GALLERY_PROJECTS
      : GALLERY_PROJECTS.filter((p) => p.category === activeCategory);

  /**
   * The active filter's block of colour slides between the tabs.
   *
   * One element that moves, rather than a background colour appearing on the
   * new tab and disappearing from the old one. The eye follows a thing that
   * travels; two colours cross-fading in different places is just a flicker,
   * which is what this was.
   *
   * It is measured from the button rather than laid out in the flow, because
   * the tabs wrap on narrow screens and their widths differ with the label. On
   * the FIRST run it is placed without animating - a highlight sliding in from
   * the top-left corner on page load would be motion explaining nothing.
   */
  const placedOnce = useRef(false);
  useGSAP(
    () => {
      const bar = filtersRef.current;
      const mark = highlightRef.current;
      if (!bar || !mark) return;

      const active = bar.querySelector<HTMLElement>('[aria-pressed="true"]');
      if (!active) return;

      const box = {
        x: active.offsetLeft,
        y: active.offsetTop,
        width: active.offsetWidth,
        height: active.offsetHeight,
      };

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!placedOnce.current || reduced) {
        placedOnce.current = true;
        gsap.set(mark, { ...box, autoAlpha: 1 });
        return;
      }

      gsap.to(mark, {
        ...box,
        autoAlpha: 1,
        duration: 0.42,
        ease: 'power3.out',
      });
    },
    { scope: filtersRef, dependencies: [activeCategory, categories.length] },
  );

  const open = (project: GalleryProject, trigger: HTMLElement) => {
    returnFocusRef.current = trigger;
    setSelected(project);
    setImageIndex(0);
  };

  const close = useCallback(() => {
    setSelected(null);
    returnFocusRef.current?.focus();
  }, []);

  const shots = useMemo(
    () => (selected ? (selected.images ?? [selected.image]) : []),
    [selected],
  );
  const shotCount = shots.length;

  const step = useCallback(
    (delta: number) => {
      if (shotCount < 2) return;
      setImageIndex((i) => (i + delta + shotCount) % shotCount);
    },
    [shotCount],
  );

  // Escape closes, arrows move between photos, Tab cycles inside the dialog.
  useEffect(() => {
    if (!selected) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        step(1);
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        step(-1);
        return;
      }
      if (e.key !== 'Tab' || !dialogRef.current) return;

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [selected, close, step]);

  // The dialog covers the page, so the page behind it must not scroll.
  useEffect(() => {
    if (!selected) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, [selected]);

  const shownImage = shots[imageIndex] ?? selected?.image;

  return (
    <div>
      {/* Filters */}
      <div ref={filtersRef} className="relative mb-12 border-b border-rule pb-6">
        {/* Starts invisible and is positioned by the effect above, so it never
            paints at 0,0 before it knows where the active tab is. */}
        <span
          ref={highlightRef}
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 bg-accent opacity-0"
        />

        <Reveal stagger={0.04} className="flex flex-wrap items-center gap-px">
          {categories.map((cat) => (
            <button
              key={cat.id}
              data-reveal
              type="button"
              aria-pressed={activeCategory === cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`type-meta relative z-10 min-h-[44px] px-4 transition-colors duration-300 ${
                activeCategory === cat.id ? 'text-on-accent' : 'text-fg-muted hover:text-fg'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </Reveal>
      </div>

      {/* Grid.
          Deliberately NOT keyed on the active category. Filtering unmounts the
          cards that leave and mounts fresh ones for the cards that arrive, and
          a fresh card carries no inline style, so it is simply visible - no
          card can end up stranded at opacity 0 by a filter change. Remounting
          the scope to re-run the cascade would mean re-mounting every image
          underneath it on every filter click. */}
      <Reveal stagger={0.04}>
        <RuledGrid as="ul" className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {projects.map((project) => (
            <li key={project.id} data-reveal className={`${RULED_CELL} bg-surface`}>
              <button
                type="button"
                onClick={(e) => open(project, e.currentTarget)}
                className="group block w-full text-left"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={project.image}
                    alt={`${project.vehicle} - ${project.categoryLabel}`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover brightness-[0.82] transition-[filter] duration-500 group-hover:brightness-100"
                  />
                  {project.images && project.images.length > 1 && (
                    <span className="type-meta absolute bottom-0 right-0 bg-surface px-2 py-1 text-fg-muted">
                      {project.images.length}
                    </span>
                  )}
                </div>

                <div className="p-4 sm:p-5">
                  <h3 className="type-card line-clamp-2">{project.vehicle}</h3>
                  <p className="mt-2 line-clamp-2 type-detail text-fg-muted">
                    {project.description}
                  </p>
                </div>
              </button>
            </li>
          ))}
        </RuledGrid>
      </Reveal>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-3 sm:p-6"
          onClick={close}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={selected.title}
            onClick={(e) => e.stopPropagation()}
            className="
              tone-ink grid max-h-[94vh] w-full max-w-6xl grid-rows-[minmax(0,1fr)_auto]
              overflow-hidden border border-rule bg-surface
              lg:grid-cols-[minmax(0,1fr)_22rem] lg:grid-rows-1
            "
          >
            {/* Photograph. Portrait-friendly: it takes the height available and
                is contained, rather than being fitted into a landscape box. */}
            <figure className="relative min-h-[46vh] bg-surface-sunken lg:min-h-0">
              {shownImage && (
                <Image
                  key={shownImage}
                  src={shownImage}
                  alt={`${selected.vehicle} - ${selected.categoryLabel}`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 62vw"
                  priority
                />
              )}

              {shotCount > 1 && (
                <>
                  <LightboxArrow side="left" onClick={() => step(-1)} />
                  <LightboxArrow side="right" onClick={() => step(1)} />
                  <span className="type-meta absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/75 px-3 py-1.5 tabular-nums text-white">
                    {imageIndex + 1} / {shotCount}
                  </span>
                </>
              )}
            </figure>

            {/* Panel. Scrolls on its own, so nothing below it can be clipped. */}
            <aside className="flex max-h-[44vh] min-h-0 flex-col overflow-y-auto border-t border-rule bg-surface lg:max-h-none lg:border-l lg:border-t-0">
              <div className="flex items-start justify-between gap-4 border-b border-rule p-5">
                <div className="min-w-0">
                  <span className="type-meta block text-accent">{selected.categoryLabel}</span>
                  <h3 className="type-card mt-1.5">{selected.title}</h3>
                </div>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={close}
                  aria-label="Close"
                  className="type-meta inline-flex min-h-[44px] shrink-0 items-center border border-rule px-4 text-fg transition-colors hover:border-accent hover:text-accent"
                >
                  Close
                </button>
              </div>

              <div className="flex flex-col gap-6 p-5">
                <dl>
                  <div className="flex items-baseline justify-between gap-4 border-b border-rule-soft py-2.5">
                    <dt className="type-meta shrink-0 text-fg-muted">Vehicle</dt>
                    <dd className="text-right text-sm">{selected.vehicle}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4 border-b border-rule-soft py-2.5">
                    <dt className="type-meta shrink-0 text-fg-muted">Work</dt>
                    <dd className="text-right text-sm">{selected.service}</dd>
                  </div>
                </dl>

                <p className="type-detail text-fg-muted">{selected.description}</p>

                {selected.specs && (
                  <ul className="flex flex-wrap gap-2">
                    {selected.specs.map((s) => (
                      <li
                        key={s}
                        className="type-meta border border-rule px-2.5 py-1.5 text-fg-muted"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Thumbnails wrap here instead of sitting in one clipped row. */}
                {shotCount > 1 && (
                  <div>
                    <span className="type-meta block text-fg-muted">
                      {shotCount} photographs
                    </span>
                    <ul className="mt-3 grid grid-cols-5 gap-1.5">
                      {shots.map((img, idx) => (
                        <li key={img}>
                          <button
                            type="button"
                            aria-label={`Photo ${idx + 1} of ${shotCount}`}
                            aria-pressed={imageIndex === idx}
                            onClick={() => setImageIndex(idx)}
                            className={`relative block aspect-square w-full overflow-hidden border transition-opacity ${
                              imageIndex === idx
                                ? 'border-accent opacity-100'
                                : 'border-rule opacity-55 hover:opacity-100'
                            }`}
                          >
                            <Image src={img} alt="" fill className="object-cover" sizes="72px" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      )}
    </div>
  );
}

function LightboxArrow({ side, onClick }: { side: 'left' | 'right'; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === 'left' ? 'Previous photo' : 'Next photo'}
      className={`absolute top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center bg-black/60 text-white transition-colors hover:bg-black/85 ${
        side === 'left' ? 'left-3' : 'right-3'
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        aria-hidden
      >
        <path d={side === 'left' ? 'M15 5 8 12l7 7' : 'M9 5l7 7-7 7'} />
      </svg>
    </button>
  );
}
