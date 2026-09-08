'use client';

import { useSyncExternalStore } from 'react';
import { PLAUSIBLE_DOMAIN } from './data/analytics';

export { PLAUSIBLE_DOMAIN };

/**
 * Measurement, and the visitor's say in it.
 *
 * THE PROVIDER IS PLAUSIBLE, AND THAT CHOICE IS THE REASON THIS FILE IS SHORT.
 * It sets no cookies, writes nothing to the visitor's device, stores no IP
 * addresses and builds no cross-site profile - so there is no personal data
 * being processed here and, in most jurisdictions including under the
 * Philippines' Data Privacy Act, nothing that requires consent to collect.
 * Google Analytics would need the opposite arrangement: off until accepted, a
 * blocking banner, and a much longer privacy page.
 *
 * WHICH IS WHY MEASUREMENT IS ON BY DEFAULT AND THE NOTICE IS AN OPT-OUT. An
 * opt-in gate would throw away most of the numbers 826 would use to decide
 * anything, in exchange for a consent that is not legally required for a
 * cookieless counter. The opt-out is real, though - `denied` genuinely stops
 * the script being loaded at all, rather than loading it and asking it nicely.
 *
 * TO MAKE IT OPT-IN INSTEAD: change the fallback in `analyticsAllowed` from
 * `true` to `false`. That one word is the whole switch, and the notice already
 * offers both answers.
 */

const STORAGE_KEY = '826:analytics';

/** Fired on this tab when the choice changes, so every reader updates at once. */
const CHANGED = '826:analytics-changed';

export type Consent = 'granted' | 'denied';

/** Read the stored choice. Returns null when the visitor has not answered. */
function read(): Consent | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === 'granted' || value === 'denied' ? value : null;
  } catch {
    // Private mode, or storage blocked entirely. Treated as "no answer yet",
    // which means measurement runs and the notice shows again next visit -
    // never a crash, and never a silent upgrade to consent that was not given.
    return null;
  }
}

export function setConsent(value: Consent) {
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Nothing to be done, and nothing worth breaking the page over. The choice
    // still applies for this page view through the event below.
  }
  window.dispatchEvent(new CustomEvent<Consent>(CHANGED, { detail: value }));
}

/** Re-read whenever this tab changes the choice, or another tab does. */
function subscribe(onChange: () => void): () => void {
  window.addEventListener(CHANGED, onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener(CHANGED, onChange);
    window.removeEventListener('storage', onChange);
  };
}

/**
 * The stored choice, as state.
 *
 * `undefined` means "not known yet", which is every render on the server and
 * the hydrating render in the browser. Reading localStorage during render would
 * make the server and the client disagree about what to draw and React would
 * throw the markup away.
 *
 * `useSyncExternalStore` rather than state-plus-an-effect: localStorage IS an
 * external store, this is precisely the hook for reading one safely across
 * hydration, and the effect version is what the project's React Compiler lint
 * rejects - correctly, since setting state in an effect body just to copy a
 * value in is a cascading render. It returns primitives, so React's identity
 * check settles immediately with nothing to memoise. Subscribing to `storage`
 * as well is a small bonus: turning measurement off in one tab turns it off in
 * the others.
 */
export function useConsent(): { consent: Consent | null | undefined; choose: (v: Consent) => void } {
  const consent = useSyncExternalStore<Consent | null | undefined>(
    subscribe,
    read,
    () => undefined,
  );

  return { consent, choose: setConsent };
}

/** Whether the counter may run. Unanswered means yes - see the note above. */
export function analyticsAllowed(consent: Consent | null | undefined): boolean {
  if (consent === undefined) return false; // not resolved yet; wait a beat
  return consent !== 'denied';
}
