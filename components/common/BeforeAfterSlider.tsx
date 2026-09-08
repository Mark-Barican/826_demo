'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';

interface BeforeAfterSliderProps {
  beforeImage?: string;
  afterImage?: string;
  beforeLabel?: string;
  afterLabel?: string;
  title?: string;
}

/**
 * Before/after wipe.
 *
 * The source pair is 744x946 - portrait. It was previously rendered into an
 * `aspect-[21/9]` box under `object-cover`, which kept only about 34% of the
 * image height. At the default 50% divider that showed the *front fender* on one
 * side and the *hood* on the other: two different parts of the car, so it read
 * as two unrelated photographs rather than a comparison. The frame now keeps the
 * source aspect, so both halves always show the same region and the wipe means
 * something.
 *
 * NO WRITTEN INSTRUCTIONS. This carried a paragraph explaining that both halves
 * are the same photograph, and a line reading "Drag, or focus the handle and use
 * the arrow keys". Mark had both removed on 2026-09-07. A divider with a grab
 * handle sitting on an image explains itself, and telling people how to use a
 * slider is the sort of copy that makes a site feel like a manual.
 *
 * Nothing was lost for assistive technology: the handle is a real `role="slider"`
 * with an aria-label and live aria-valuetext (see below), so a screen reader
 * already announces what it is, where it is, and that arrow keys move it. The
 * removed line was a visual restatement of that, not the source of it. Do not
 * put it back for accessibility reasons - check the handle instead.
 */
export function BeforeAfterSlider({
  beforeImage = '/work/before-after/826_ppf_before.webp',
  afterImage = '/work/before-after/826_ppf_after.webp',
  beforeLabel = 'Before / Swirled Clear Coat',
  afterLabel = 'After / Corrected',
  title = 'Optical Clarity & Surface Leveling',
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const moveTo = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.max(0, Math.min(pct, 100)));
  }, []);

  // Pointer events cover mouse, touch and pen in one path, and setPointerCapture
  // means the drag keeps tracking when the cursor leaves the frame - no global
  // window listeners to add and tear down.
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    moveTo(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) moveTo(e.clientX);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 2;
    if (e.key === 'ArrowLeft') { setPosition((p) => Math.max(0, p - step)); e.preventDefault(); }
    if (e.key === 'ArrowRight') { setPosition((p) => Math.min(100, p + step)); e.preventDefault(); }
    if (e.key === 'Home') { setPosition(0); e.preventDefault(); }
    if (e.key === 'End') { setPosition(100); e.preventDefault(); }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[minmax(0,440px)_1fr] gap-8 lg:gap-14 items-center">
      {/* Frame — kept at the source's own 744:946 so nothing is cropped away */}
      <div
        ref={containerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        className="relative w-full aspect-[744/946] bg-surface-raised border border-rule overflow-hidden select-none cursor-ew-resize touch-none"
      >
        {/* AFTER — full frame underneath */}
        <Image
          src={afterImage}
          alt="The same car after multi-stage paint correction, with the swirl marks removed"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 440px"
          priority
        />
        {/* The AFTER label is clipped to the region the after image actually
            occupies, mirroring the BEFORE label's clip. Without this the pair
            behaved asymmetrically: dragging left correctly took the BEFORE
            label away with the before image, but dragging right left the AFTER
            label sitting on top of a fully-revealed before image, captioning
            the wrong photograph. */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{ clipPath: `polygon(${position}% 0, 100% 0, 100% 100%, ${position}% 100%)` }}
        >
          <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/85 border border-white/10 text-[10px] font-mono tracking-widest uppercase text-[#d4af37]">
            {afterLabel}
          </div>
        </div>

        {/* BEFORE — clipped to the divider */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `polygon(0 0, ${position}% 0, ${position}% 100%, 0 100%)` }}
        >
          <Image
            src={beforeImage}
            alt="The same car before correction, its clear coat covered in wash swirls"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 440px"
            priority
          />
          <div className="absolute bottom-3 left-3 z-10 px-2.5 py-1 bg-black/85 border border-white/10 text-[10px] font-mono tracking-widest uppercase text-zinc-300">
            {beforeLabel}
          </div>
        </div>

        {/* Divider and handle */}
        <div className="absolute inset-y-0 z-20 pointer-events-none" style={{ left: `${position}%` }}>
          <div className="h-full w-px bg-white/90" />
          <div
            role="slider"
            tabIndex={0}
            aria-label="Comparison position: reveal before or after"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(position)}
            aria-valuetext={`${Math.round(position)}% before, ${100 - Math.round(position)}% after`}
            onKeyDown={onKeyDown}
            className="pointer-events-auto absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 grid h-11 w-11 place-items-center bg-[#08080a] border border-white/80 text-white cursor-ew-resize focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            <span aria-hidden="true" className="font-mono text-[11px] leading-none tracking-tighter">
              &#9664;&#9654;
            </span>
          </div>
        </div>
      </div>

      {/* Copy. Tone-aware, so the same component reads correctly whether the
          section around it is ink or paper. */}
      <div>
        <span className="type-meta text-accent">Visual inspection</span>
        <h3 className="type-section mt-3">{title}</h3>
      </div>
    </div>
  );
}
