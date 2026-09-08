/**
 * Motion timings shared between the route transition and the reveals.
 *
 * These live in one place because two components have to agree on them. The
 * route transition (components/common/PageTransition.tsx) fades the page out
 * and the next one in, and anything already in view when that page mounts - the
 * masthead on every inner page - has to come in behind that fade rather than
 * underneath it.
 *
 * There used to be a branded loading panel here that held for 1.5s and wiped
 * away over 0.7s. It is gone. A panel is the right answer when there is a real
 * wait to cover; every route on this site is prerendered, so all it covered was
 * itself, and it broke the thread of the visit each time - you left a page, sat
 * in front of a logo, and arrived somewhere with no sense of having moved.
 * A cross-fade keeps the header, the footer and the reader's place, and costs
 * about a fifth of the time.
 */

/** How long the page you are leaving takes to fade away, before the route changes. */
export const PAGE_EXIT = 0.22;

/** How long the page you are arriving at takes to fade up. */
export const PAGE_ENTER = 0.45;

/**
 * How long a reveal waits before playing on a page that has just mounted.
 *
 * Short, and deliberately shorter than PAGE_ENTER: the section reveals should
 * start while the page itself is still fading up, so the two read as one
 * movement rather than as a fade followed by an animation. Long enough that
 * they are not both starting from nothing in the same frame, which just reads
 * as murk.
 */
export const PAGE_ENTRANCE_DELAY = 0.18;

/**
 * How long a navigation may take before the loading panel is brought up.
 *
 * Under this, the cross-fade covers the change on its own and a panel would be
 * a flash of branding nobody asked for. Over it, the reader is looking at a
 * page that has already faded out and has nothing to tell them it is working.
 */
export const SLOW_NAVIGATION_MS = 1000;

/**
 * The longest the loading panel may stay up on a navigation, whatever else
 * happens.
 *
 * The panel is taken down by the arriving route (NAV_END). If that signal never
 * comes, the reader is left looking at a logo over a page that is already fully
 * rendered underneath it, with no way back short of a reload - which is exactly
 * what happened on every studio and service page while the arrival was keyed on
 * a template remount that does not occur for those routes. That was a real bug
 * and it is fixed in components/common/PageTransition.tsx, but a cover that can
 * outlive the thing it is covering is worth a hard stop of its own.
 */
export const PANEL_MAX_MS = 4000;

/**
 * How long the panel is shown on a cold load. A flat hold, not a minimum:
 * see the note in components/common/RouteLoader.tsx about why it no longer
 * waits on a readiness signal. Long enough to read as a deliberate panel,
 * short enough not to be in the way.
 */
export const BOOT_MIN_MS = 700;
