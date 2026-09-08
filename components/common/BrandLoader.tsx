import Image from 'next/image';
import { BRAND_NAME } from '@/lib/data/brand';

/**
 * The loading panel: the 826 mark over the ink surface with a sweeping rule.
 *
 * Rendered by components/common/RouteLoader.tsx, which decides WHEN it is seen.
 * It is deliberately not shown on every navigation any more - see that file.
 *
 * THERE IS DELIBERATELY NO `app/loading.tsx`. One existed briefly and had to go:
 * a root-level loading.tsx creates a Suspense boundary whose fallback is
 * emitted into the prerendered HTML of every page, as an opaque full-screen
 * cover with no opacity guard. With JavaScript enabled React swaps it out on
 * hydration and nobody notices; with JavaScript disabled - or during the
 * hydration gap on a slow connection - it sits on top of a page it can never
 * clear. Verified: a JS-disabled render showed that cover at opacity 1 over
 * fully-present content.
 *
 * The sweep is a CSS animation rather than GSAP so it still moves if this is
 * ever rendered somewhere GSAP has not loaded.
 */
export function BrandLoader({ className = '' }: { className?: string }) {
  return (
    <div
      className={`tone-ink flex h-full w-full flex-col items-center justify-center gap-6 bg-surface ${className}`}
    >
      <Image
        src="/brand/826 logo.webp"
        alt={BRAND_NAME}
        width={132}
        height={46}
        priority
        className="h-10 w-auto object-contain"
      />
      <div className="h-px w-40 overflow-hidden bg-rule">
        <span className="loader-sweep block h-full w-full bg-accent" />
      </div>
      <span className="sr-only" role="status">
        Loading
      </span>
    </div>
  );
}
