'use client';

import { useState } from 'react';
import { Map, MapMarker, MarkerContent, MarkerPopup, MapControls } from '@/components/ui/map';
import { BRANCHES } from '@/lib/data/branches';

/**
 * Branch locator.
 *
 * Pins are area-level, not door-level: 826 has published the neighbourhood and
 * the landmark each studio sits inside, but not street addresses. A map pin
 * implies precision it does not have, so every marker carries `precision` from
 * the data and the map states plainly what the pins mean. Swap in surveyed
 * coordinates and flip `precision` to 'exact' to remove the caveat.
 *
 * Colour note: the map canvas is always dark, whichever tone the surrounding
 * section is. Anything drawn *on* the map therefore uses the literal brand gold
 * rather than `text-accent`, because inside `.tone-paper` the accent resolves to
 * the darkened gold meant for light backgrounds and would vanish against the
 * map. Only the legend and caveat below it, which sit on the section surface,
 * use tone-aware tokens.
 */
export function BranchMap() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  // Centre and zoom chosen to hold Quezon City down to Dasmariñas in one frame.
  // MapProps extends MapLibre's own MapOptions, so this is `center`/`zoom`.
  const anyApproximate = BRANCHES.some((b) => b.coords.precision === 'area');

  return (
    <div>
      <div className="relative h-[420px] w-full overflow-hidden border border-rule sm:h-[560px]">
        {/* Scroll-zoom off. The map sits in the middle of a full-screen snap
            panel and is over a thousand pixels wide, so with the wheel bound to
            zoom it swallowed the page scroll across most of the viewport - put
            the cursor anywhere near the middle and the page simply stopped
            moving. Measured: six wheel gestures over the map advanced the page
            by nothing, the same six beside it moved through four sections.
            Zooming is still available on the +/- controls, which is the usual
            trade for a map embedded in a page rather than a map that IS the
            page. */}
        <Map
          theme="dark"
          className="h-full w-full"
          center={[121.03, 14.53]}
          zoom={9.6}
          scrollZoom={false}
        >
          {/* The zoom buttons were there all along and completely invisible:
              mapcn styles them with shadcn's `bg-background` / `border-border`
              / `text-foreground`, and against this project's tokens all three
              resolve to the same near-black as the map itself - measured at
              rgb(8,8,10) icon on rgb(8,8,10) fill inside an rgb(8,8,10) border.
              So the only zoom anyone could find was double-click, which only
              goes in. Restyled here rather than in the vendored component, and
              made a touch larger while we are at it. */}
          <MapControls
            className="
              [&>div]:rounded-none [&>div]:border-[rgba(255,255,255,0.16)] [&>div]:bg-[#0e0e12]
              [&>div>button:not(:last-child)]:border-b-[rgba(255,255,255,0.16)]
              [&_button]:size-9 [&_button]:text-[#f4f4f5]
              [&_button:hover]:bg-[#1c1c22] [&_button:hover]:text-[#d4af37]
            "
          />

          {BRANCHES.map((b, i) => (
            <MapMarker
              key={b.slug}
              longitude={b.coords.lng}
              latitude={b.coords.lat}
              onClick={() => setOpenSlug((s) => (s === b.slug ? null : b.slug))}
            >
              {/* Custom marker: a squared plate echoing the 826 signage numeral.
                  Flat fill and a hairline border - no glow, no gradient. */}
              <MarkerContent>
                <div
                  className={`group grid h-9 w-9 cursor-pointer place-items-center border transition-colors ${
                    openSlug === b.slug
                      ? 'border-[#e5c158] bg-[#d4af37] text-[#08080a]'
                      : 'border-[#d4af37] bg-[#08080a] text-[#d4af37] hover:bg-[#1c1708]'
                  }`}
                >
                  <span className="font-mono text-[11px] font-bold leading-none tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {/* stem */}
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-1.5 h-1.5 w-px bg-[#d4af37]"
                  />
                </div>
              </MarkerContent>

              <MarkerPopup>
                <div className="min-w-[196px] max-w-[240px]">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#d4af37]">
                    Studio {String(i + 1).padStart(2, '0')}
                  </p>
                  <p className="mt-1.5 text-[15px] font-medium leading-snug text-white">{b.name}</p>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-400">{b.address}</p>
                  {b.locatedIn && (
                    <p className="text-xs text-zinc-400">{b.locatedIn}</p>
                  )}
                  <a
                    href={`tel:${b.phone.replace(/\s+/g, '')}`}
                    className="mt-2 inline-flex min-h-[36px] items-center font-mono text-xs text-white underline decoration-[#d4af37] underline-offset-4 hover:text-[#e5c158]"
                  >
                    {b.phone}
                  </a>
                  {b.coords.precision === 'area' && (
                    <p className="mt-2 text-[10px] leading-snug text-zinc-500">
                      Pin shows the area. Call the branch for exact directions.
                    </p>
                  )}
                </div>
              </MarkerPopup>
            </MapMarker>
          ))}
        </Map>
      </div>

      {/* Legend / honest caveat */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          {BRANCHES.map((b, i) => (
            <li key={b.slug} className="flex items-center gap-2">
              <span className="grid h-5 w-5 place-items-center border border-[#d4af37] bg-[#08080a] font-mono text-[9px] font-bold tabular-nums text-[#d4af37]">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="type-detail text-fg-muted">{b.name.replace(/^826\s*/, '')}</span>
            </li>
          ))}
        </ul>
        {anyApproximate && (
          <p className="max-w-sm text-[11px] leading-relaxed text-fg-muted">
            Pins locate each branch&rsquo;s area, not its doorway. 826 has not published
            street addresses, so call the branch for exact directions.
          </p>
        )}
      </div>
    </div>
  );
}
