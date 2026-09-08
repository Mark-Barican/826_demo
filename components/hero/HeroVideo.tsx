'use client';

import { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import {
  VIDEO_SRC,
  POSTER_PANELS,
  timeForProgress,
  frameForProgress,
  phaseForFrame,
  FPS,
  type HeroPhase,
} from '@/lib/hero/frameMap';
import { detectMode, type HeroMode } from '@/lib/hero/mode';

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Below this difference a seek is not worth issuing - under half a frame. */
const SEEK_EPSILON = 1 / (FPS * 2);

export type HeroVideoProps = {
  onReady?: () => void;
  onMode?: (mode: HeroMode) => void;
  /**
   * Fires only when the narrative phase changes: three times across the whole
   * scroll. This is the correct hook for swapping overlay copy.
   */
  onPhase?: (phase: HeroPhase) => void;
  className?: string;
  /**
   * Painted beneath the video: the no-JS fallback and the reduced-motion
   * layout. A separate slot from `children` because both are absolutely
   * positioned siblings, so whichever comes last in DOM order wins without an
   * explicit z-index.
   */
  underlay?: React.ReactNode;
  /** Painted above the video: headline, CTA, anything that reads over the film. */
  children?: React.ReactNode;
};

/**
 * Scroll-scrubbed hero, driven straight off the master h264 and played in
 * reverse - panels, wrap, finished car. See lib/hero/frameMap.ts for why it
 * runs backwards, why the file is encoded with a short GOP, and the seek
 * latency measurements that decided it.
 *
 * This replaced a 192-frame WebP sequence with a decode cache, an LRU window
 * and a low-res ladder. All of that existed to make frame scrubbing survivable;
 * a video with cheap seeks needs none of it.
 *
 * The one thing that genuinely matters here is not queueing seeks. Setting
 * `currentTime` while the element is already seeking makes the browser drop or
 * coalesce requests unpredictably, and the scrub visibly lags the scroll. So
 * the scroll handler only ever records a target, and the ticker issues at most
 * one seek at a time, always to the newest value.
 */
export function HeroVideo({
  onReady, onMode, onPhase, className, underlay, children,
}: HeroVideoProps) {
  const root = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [live, setLive] = useState(false);

  useGSAP(
    () => {
      const video = videoRef.current;
      const section = root.current;
      if (!video || !section) return;

      const config = detectMode();
      onMode?.(config.mode);
      if (config.mode === 'still') return; // parent renders the two-up

      // The URL-bar show/hide on mobile fires resize continuously and makes a
      // pin jump. Paired with 100svh sizing in CSS.
      ScrollTrigger.config({ ignoreMobileResize: true });

      const state = { p: 0 };
      let target = timeForProgress(0);
      let inFlight = false;
      let lastPhase: HeroPhase | null = null;
      let disposed = false;

      const applyPhase = (p: number) => {
        const phase = phaseForFrame(frameForProgress(p));
        if (phase !== lastPhase) {
          lastPhase = phase;
          onPhase?.(phase);
        }
      };

      /**
       * Issue at most one seek at a time, always to the latest target. A queued
       * seek is a dropped seek, so this coalesces instead of queueing.
       */
      const pump = () => {
        if (disposed || inFlight || video.readyState < 2) return;
        const t = target;
        if (Math.abs(video.currentTime - t) < SEEK_EPSILON) return;
        inFlight = true;
        video.currentTime = t;
      };
      const onSeeked = () => {
        inFlight = false;
        // The target may have moved while that seek was in flight.
        pump();
      };
      video.addEventListener('seeked', onSeeked);

      gsap.ticker.add(pump);

      let trigger: ScrollTrigger | null = null;
      let goneLive = false;

      const goLive = () => {
        if (goneLive || disposed) return;
        // Never create a pinned trigger against a zero-height section. A tab
        // restored from the background, or a pane that has not been laid out,
        // reports a 0 viewport; ScrollTrigger then caches a scroll getter that
        // permanently returns 0 and the scrub sits at the start forever.
        if (!section.clientHeight || !window.innerHeight) return;
        goneLive = true;

        const tween = gsap.to(state, {
          p: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: config.pin,
            // A small number, not `true`. A wheel fires discrete notches, often
            // 100px at a time, and mapping those straight to time lurches. 0.3
            // lerps over roughly two frames at 60fps - enough to absorb the
            // notch quantisation, far below the values that feel mushy.
            scrub: 0.3,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              target = timeForProgress(self.progress);
              applyPhase(self.progress);
              // GSAP's ticker sleeps after `autoSleep` idle frames. `pump` lives
              // on that ticker, so without this a scroll that arrives while it
              // is asleep would record a new target and never issue the seek.
              gsap.ticker.wake();
            },
          },
        });
        trigger = tween.scrollTrigger ?? null;

        setLive(true);
        onReady?.();

        // START FROM WHERE THE PAGE ACTUALLY IS, NOT FROM ZERO. The trigger can
        // perfectly well be created against a page that is already scrolled: a
        // refresh partway down (browsers restore the offset), a back
        // navigation, or simply a video that took long enough to load that the
        // reader had started moving. This used to assume progress 0 and set the
        // copy to the first phase, so the overlay read "It starts as flat
        // sheets of film" over the finished car until the next scroll event
        // corrected it. Caught on a screenshot at the end of the scrub.
        const landed = trigger?.progress ?? 0;
        target = timeForProgress(landed);
        applyPhase(landed);
        pump();
      };

      const onLoaded = () => {
        // Park on the first frame the reversed scrub shows before revealing.
        target = timeForProgress(0);
        pump();
        goLive();
      };
      if (video.readyState >= 2) onLoaded();
      else video.addEventListener('loadeddata', onLoaded, { once: true });

      // A ResizeObserver rather than a window resize listener: the section can
      // start at zero height (a backgrounded tab, a hidden pane, CSS not yet
      // applied) and a one-shot measurement would bail and never retry. It must
      // also refresh ScrollTrigger, because start and end are measured at
      // creation time and a trigger built against a zero-height viewport keeps
      // a zero-length scroll range.
      let refreshTimer = 0;
      const ro = new ResizeObserver(() => {
        window.clearTimeout(refreshTimer);
        refreshTimer = window.setTimeout(() => {
          if (disposed) return;
          if (!goneLive) goLive();
          else ScrollTrigger.refresh();
        }, 150);
      });
      ro.observe(section);

      document.fonts?.ready.then(() => {
        if (!disposed) ScrollTrigger.refresh();
      });

      return () => {
        disposed = true;
        window.clearTimeout(refreshTimer);
        ro.disconnect();
        gsap.ticker.remove(pump);
        video.removeEventListener('seeked', onSeeked);
        trigger?.kill();
      };
    },
    { scope: root },
  );

  // `root` is the pin target, so it must be the full-height section itself.
  return (
    <div ref={root} className={className}>
      {underlay}
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        poster={POSTER_PANELS}
        muted
        playsInline
        preload="auto"
        // Never autoplays: every frame shown is driven by scroll position.
        aria-hidden="true"
        tabIndex={-1}
        // Below 4/3 - the whole of `band` mode - this stops covering and starts
        // fitting. The footage is 16:9 and the car spans nearly all of it, so
        // cover-fit on a portrait viewport keeps about a quarter of the frame
        // width and throws the car away; `object-contain` keeps the whole
        // composition at whatever size the space allows.
        //
        // It also leaves the absolute layer and becomes a flex item, so the
        // section can put the type above and below it instead of on top of it -
        // see the overlay in HeroSection. `flex-1 min-h-0` is what lets the
        // footage give way to the text on a short screen rather than the other
        // way round. The variant is defined in app/globals.css.
        className="absolute inset-0 z-10 h-full w-full object-cover transition-opacity duration-700 hero-band:relative hero-band:inset-auto hero-band:order-2 hero-band:h-auto hero-band:min-h-0 hero-band:flex-1 hero-band:object-contain"
        style={{ opacity: live ? 1 : 0 }}
      />
      {children}
    </div>
  );
}
