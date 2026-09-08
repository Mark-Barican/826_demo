import { PageTransition } from '@/components/common/PageTransition';

/**
 * A template, not a layout, on purpose - but do not trust it to remount.
 *
 * A template is keyed by ITS OWN SEGMENT LEVEL, not by the full route. This one
 * is at the root, so its key is `/branches` for `/branches` and for
 * `/branches/c5-libis` alike, and moving between them remounts nothing. From
 * `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/
 * template.md`: "Navigations within deeper segments do not remount higher-level
 * templates."
 *
 * A previous version of this comment said the opposite, and PageTransition was
 * built on it: the arrival ran on mount, so every studio page and every service
 * page arrived invisible under a loading panel that never came down. The fix is
 * in that file - the arrival is keyed on `usePathname()` now, which changes on
 * every navigation whether this remounts or not.
 *
 * It stays a template rather than becoming a layout because the remount it does
 * give us - a top-level route change - resets the state of everything inside,
 * and because a layout would sit outside the pages it needs to fade.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
