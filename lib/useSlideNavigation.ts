"use client";

import { useEffect, useRef, type RefObject } from "react";
import type { TimelineHandle } from "@/components/TimelineSection";
import type { DetailsHandle } from "@/components/DetailsSection";

// Index of the Timeline section among `document.querySelectorAll("main section")`,
// fixed by the section order in app/page.tsx (Hero, SaveTheDate, Timeline, ...).
const TIMELINE_INDEX = 2;
// Details/Dresscode combined section — same sub-step mechanism as Timeline
// (see DetailsSection.tsx). Fixed by section order: Hero, SaveTheDate,
// Timeline, Gallery, Details(+Dresscode), ...
const DETAILS_INDEX = 4;

// Perceived speed of a slide-to-slide jump. Custom rAF tween instead of the
// browser's built-in `behavior: "smooth"` — its duration/easing vary by
// browser and tend to feel sluggish for a deliberate "one gesture = one
// slide" interaction.
const SLIDE_ANIMATION_MS = 650;
// Total time a slide jump blocks further input, so one physical scroll/swipe
// gesture (which fires many wheel/touchmove events) only advances once.
const SLIDE_LOCK_MS = 800;
// Same idea but for an in-place milestone-set switch inside Timeline, which
// only runs a 0.4s crossfade rather than a scroll animation.
const STEP_LOCK_MS = 550;
// macOS trackpads/mice report wheel input as a long stream of momentum
// events that keeps firing well past SLIDE_LOCK_MS — often 1-2s+ for one
// physical swipe. A fixed-duration lock alone lets the tail end of that
// same swipe slip through once the lock expires and trigger a second
// advance ("scrolls twice"). Instead, once a swipe has advanced a slide,
// every wheel event is absorbed until GESTURE_IDLE_MS passes with no wheel
// events at all — i.e. the physical gesture has actually stopped — before
// a new one is allowed to trigger the next advance.
const GESTURE_IDLE_MS = 180;

const WHEEL_THRESHOLD = 2;
const SWIPE_THRESHOLD_PX = 40;
const EDGE_EPSILON_PX = 1;

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Site-wide "one scroll/swipe = one slide" navigation: each top-level
 * <section> under <main> is treated as a slide. A wheel notch or swipe
 * animates straight to the next/previous section's edge instead of the
 * page free-scrolling gradually.
 *
 * Sections taller than the viewport (e.g. the RSVP form) still scroll
 * natively within themselves — slide-advance only triggers once the user
 * has reached that section's top/bottom edge, so tall content stays fully
 * reachable.
 *
 * Timeline is a single slide with its own past/future sub-step: scrolling
 * into/through it first tries `timelineRef.current.tryAdvance` before
 * moving on to the next/previous slide. Details/Dresscode work the same way
 * via `detailsRef`.
 */
export function useSlideNavigation(
  timelineRef: RefObject<TimelineHandle | null>,
  detailsRef: RefObject<DetailsHandle | null>,
) {
  const indexRef = useRef(0);
  const lockedRef = useRef(false);
  const touchStartYRef = useRef<number | null>(null);
  const sectionsRef = useRef<HTMLElement[]>([]);
  const wheelGestureActiveRef = useRef(false);
  const wheelGestureIdleTimerRef = useRef<number | null>(null);
  // Gate: on a fresh load landing on Hero, nothing can scroll past it until
  // "Open Invitation" is clicked. `openedRef` tracks whether that's happened;
  // while it's false and we're still on Hero, every input path (wheel,
  // touch, keydown, and native scroll via the html/body overflow lock below)
  // is blocked outright instead of advancing.
  const openedRef = useRef(false);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main section"));
    sectionsRef.current = sections;
    if (sections.length === 0) return;

    // Sync to whatever section is on screen right now (e.g. reload mid-page,
    // or browser scroll restoration), so the first gesture advances from the
    // correct slide instead of assuming index 0.
    let closest = 0;
    let closestDist = Infinity;
    sections.forEach((el, i) => {
      const dist = Math.abs(el.getBoundingClientRect().top);
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    });
    indexRef.current = closest;
    // Only gate a genuine fresh landing on Hero. If the page loaded already
    // scrolled past it (deep link, scroll restoration), treat the
    // invitation as already "opened" so that content stays reachable.
    openedRef.current = closest !== 0;
    if (!openedRef.current) {
      document.documentElement.style.overflow = "hidden";
    }

    function unlockGate() {
      if (openedRef.current) return;
      openedRef.current = true;
      document.documentElement.style.overflow = "";
    }

    function edgeState(el: HTMLElement) {
      const rect = el.getBoundingClientRect();
      const overflows = rect.height > window.innerHeight + EDGE_EPSILON_PX;
      return {
        overflows,
        atBottom: rect.bottom <= window.innerHeight + EDGE_EPSILON_PX,
        atTop: rect.top >= -EDGE_EPSILON_PX,
      };
    }

    // "native" = let the browser scroll the current (overflowing) section
    // normally; "advance" = try a Timeline sub-step, else jump slides.
    function classifyIntent(down: boolean): "native" | "advance" {
      const el = sectionsRef.current[indexRef.current];
      if (!el) return "advance";
      const { overflows, atBottom, atTop } = edgeState(el);
      if (overflows) {
        if (down && !atBottom) return "native";
        if (!down && !atTop) return "native";
      }
      return "advance";
    }

    function goTo(index: number, enteringFromAbove: boolean) {
      const el = sectionsRef.current[index];
      if (!el) return;
      lockedRef.current = true;
      window.setTimeout(() => {
        lockedRef.current = false;
      }, SLIDE_LOCK_MS);

      const rect = el.getBoundingClientRect();
      // Short sections: always land on top=0. Sections taller than the
      // viewport: land on top edge when entering from above (scrolling
      // down) or bottom edge when entering from below (scrolling up), so
      // their full content stays reachable by native scroll either way.
      const desiredTop = enteringFromAbove ? 0 : Math.min(0, window.innerHeight - rect.height);
      const startY = window.scrollY;
      const targetY = startY + rect.top - desiredTop;
      const startTime = performance.now();

      function step(now: number) {
        const t = Math.min(1, (now - startTime) / SLIDE_ANIMATION_MS);
        window.scrollTo(0, startY + (targetY - startY) * easeInOutCubic(t));
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    function trySubStep(idx: number, down: boolean): boolean {
      const handle = idx === TIMELINE_INDEX ? timelineRef.current : idx === DETAILS_INDEX ? detailsRef.current : null;
      const handled = handle?.tryAdvance(down) ?? false;
      if (handled) {
        lockedRef.current = true;
        window.setTimeout(() => {
          lockedRef.current = false;
        }, STEP_LOCK_MS);
      }
      return handled;
    }

    function enterSubStep(idx: number, fromTop: boolean) {
      const handle = idx === TIMELINE_INDEX ? timelineRef.current : idx === DETAILS_INDEX ? detailsRef.current : null;
      if (!handle) return;
      if (fromTop) handle.enterFromTop();
      else handle.enterFromBottom();
    }

    function advance(down: boolean) {
      const idx = indexRef.current;
      if (down && idx === 0 && !openedRef.current) return;
      if ((idx === TIMELINE_INDEX || idx === DETAILS_INDEX) && trySubStep(idx, down)) return;
      const nextIdx = down ? idx + 1 : idx - 1;
      if (nextIdx < 0 || nextIdx >= sectionsRef.current.length) return;
      indexRef.current = nextIdx;
      if (nextIdx === TIMELINE_INDEX || nextIdx === DETAILS_INDEX) {
        enterSubStep(nextIdx, down);
      }
      goTo(nextIdx, down);
    }

    function jumpToId(id: string) {
      const target = document.getElementById(id);
      if (!target) return;
      const el = target.closest("section") ?? target;
      const idx = sectionsRef.current.indexOf(el as HTMLElement);
      if (idx === -1) return;
      indexRef.current = idx;
      if (idx === TIMELINE_INDEX || idx === DETAILS_INDEX) enterSubStep(idx, true);
      goTo(idx, true);
    }

    function armGestureIdleTimer() {
      if (wheelGestureIdleTimerRef.current !== null) {
        window.clearTimeout(wheelGestureIdleTimerRef.current);
      }
      wheelGestureIdleTimerRef.current = window.setTimeout(() => {
        wheelGestureActiveRef.current = false;
        wheelGestureIdleTimerRef.current = null;
      }, GESTURE_IDLE_MS);
    }

    function onWheel(e: WheelEvent) {
      // Any wheel event — trigger, lock tail, or macOS momentum tail —
      // pushes the "gesture still going" window out further.
      armGestureIdleTimer();

      if (lockedRef.current || wheelGestureActiveRef.current) {
        e.preventDefault();
        return;
      }
      if (Math.abs(e.deltaY) < WHEEL_THRESHOLD) return;
      const down = e.deltaY > 0;
      if (classifyIntent(down) === "native") return;
      e.preventDefault();
      wheelGestureActiveRef.current = true;
      advance(down);
    }

    function onTouchStart(e: TouchEvent) {
      touchStartYRef.current = e.touches[0]?.clientY ?? null;
    }

    function onTouchMove(e: TouchEvent) {
      if (lockedRef.current) {
        e.preventDefault();
        return;
      }
      if (touchStartYRef.current === null) return;
      const currentY = e.touches[0]?.clientY;
      if (currentY === undefined) return;
      const delta = touchStartYRef.current - currentY;
      if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return;
      const down = delta > 0;
      if (classifyIntent(down) === "native") {
        touchStartYRef.current = currentY;
        return;
      }
      e.preventDefault();
      touchStartYRef.current = currentY;
      advance(down);
    }

    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (lockedRef.current) return;
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        if (classifyIntent(true) === "native") return;
        e.preventDefault();
        advance(true);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        if (classifyIntent(false) === "native") return;
        e.preventDefault();
        advance(false);
      }
    }

    // Generic same-page anchor jump routed through the slide controller
    // instead of native anchor scroll. Hero's "Open Invitation" uses the
    // reserved id "open-invitation" (no matching element — it's a sentinel,
    // not a real jump target): clicking it unlocks the gate and advances
    // exactly one slide, same as any other forward gesture.
    function onClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const id = anchor.getAttribute("href")?.slice(1);
      if (!id) return;
      e.preventDefault();
      if (id === "open-invitation") {
        unlockGate();
        advance(true);
        return;
      }
      jumpToId(id);
    }

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("click", onClick);
      if (wheelGestureIdleTimerRef.current !== null) {
        window.clearTimeout(wheelGestureIdleTimerRef.current);
      }
      document.documentElement.style.overflow = "";
    };
  }, [timelineRef, detailsRef]);
}
