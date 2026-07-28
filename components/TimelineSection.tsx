"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { weddingConfig } from "@/lib/wedding-config";
import { Reveal } from "./Reveal";

type TimelineItem = { title: string; text: string; photo: string };

// Desktop content is scaled down from the raw Figma measurements so the whole
// section fits within one viewport height (no scroll) — needed for the
// swipe/click-to-advance milestones feature below.
const SCALE = 0.72;
const s = (px: number) => Math.round(px * SCALE);

// How long a wheel/swipe-triggered set switch blocks further switches, so one
// physical scroll gesture (which fires many wheel events) only advances once.
const SWITCH_LOCK_MS = 700;
// Minimum vertical touch movement to count as an intentional swipe.
const SWIPE_THRESHOLD_PX = 40;

// Timeline items animate on mount/switch (not on scroll-into-view like Reveal)
// because the whole set is meant to be visible at once — an element sitting
// near the bottom edge would otherwise never cross Reveal's "-80px" viewport
// margin and would stay stuck invisible.
function TextBlock({
  item,
  delay,
  width,
  fontSize = 26,
  className = "",
}: {
  item: TimelineItem;
  delay: number;
  width: number;
  fontSize?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      style={{ maxWidth: width }}
      className={`flex flex-col gap-2 text-left font-valencia ${className}`}
    >
      <p style={{ fontSize }}>{item.title}</p>
      <p style={{ fontSize }} className="leading-snug">
        {item.text}
      </p>
    </motion.div>
  );
}

function PhotoBlock({
  item,
  delay,
  width,
  height,
  className = "",
}: {
  item: TimelineItem;
  delay: number;
  width: number;
  height: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      style={{ width, height }}
      className={`relative shrink-0 overflow-hidden rounded-sm ${className}`}
    >
      <Image src={item.photo} alt={item.title} fill className="object-cover" />
    </motion.div>
  );
}

const fadeTransition = { duration: 0.4, ease: "easeInOut" as const };

export function TimelineSection() {
  const { timeline } = weddingConfig;
  const [showFuture, setShowFuture] = useState(false);
  const items = showFuture ? timeline.future : timeline.past;
  const [item0, item1, item2] = items;
  const setKey = showFuture ? "future" : "past";

  const sectionRef = useRef<HTMLElement>(null);
  const isActiveRef = useRef(false);
  const lockedRef = useRef(false);
  const touchStartYRef = useRef<number | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isActiveRef.current = entry.intersectionRatio > 0.6;
      },
      { threshold: [0, 0.6, 1] },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function tryAdvance(goingDown: boolean) {
    if (!isActiveRef.current || lockedRef.current) return false;
    // At the last set and scrolling down, or at the first set and scrolling
    // up: let the browser scroll to the next/previous section normally.
    if (goingDown && showFuture) return false;
    if (!goingDown && !showFuture) return false;

    lockedRef.current = true;
    setShowFuture(goingDown);
    window.setTimeout(() => {
      lockedRef.current = false;
    }, SWITCH_LOCK_MS);
    return true;
  }

  useEffect(() => {
    function onWheel(e: WheelEvent) {
      if (!isActiveRef.current || Math.abs(e.deltaY) < 2) return;
      if (tryAdvance(e.deltaY > 0)) e.preventDefault();
    }
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [showFuture]);

  useEffect(() => {
    function onTouchStart(e: TouchEvent) {
      touchStartYRef.current = e.touches[0]?.clientY ?? null;
    }
    function onTouchMove(e: TouchEvent) {
      if (!isActiveRef.current || touchStartYRef.current === null) return;
      const currentY = e.touches[0]?.clientY;
      if (currentY === undefined) return;
      const delta = touchStartYRef.current - currentY;
      if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return;
      if (tryAdvance(delta > 0)) {
        e.preventDefault();
        touchStartYRef.current = currentY;
      }
    }
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [showFuture]);

  function Heading({ fontSize }: { fontSize?: number }) {
    return (
      <Reveal className="text-left">
        <button
          type="button"
          onClick={() => setShowFuture((v) => !v)}
          className="font-milton stroke-thin text-6xl transition-opacity hover:opacity-80"
          style={fontSize ? { fontSize } : undefined}
        >
          {timeline.heading}
        </button>
      </Reveal>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen snap-start items-center overflow-hidden py-24 text-cream sm:py-8"
    >
      <div className="absolute inset-0 bg-ink/70" />
      <div className="relative mx-auto max-w-3xl px-6">
        {/* Mobile: single sequential column, heading on top */}
        <div className="flex flex-col gap-10 sm:hidden">
          <Heading />
          <AnimatePresence mode="wait">
            <motion.div
              key={setKey}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={fadeTransition}
              className="flex flex-col gap-10"
            >
              {items.map((item, i) => (
                <div key={item.title} className="flex flex-col gap-5">
                  <TextBlock item={item} delay={i * 0.1} width={320} />
                  <div className="relative aspect-[9/10] w-full overflow-hidden rounded-sm">
                    <Image src={item.photo} alt={item.title} fill className="object-cover" />
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Desktop: two staggered columns. Scaled down (SCALE=0.72) from the
            exact Figma measurements so the whole section fits one viewport
            height with no scroll. Scrolling/swiping while this section is in
            view crossfades between the past/future milestone sets before
            letting the page scroll on to the next section. */}
        <div className="hidden sm:flex" style={{ columnGap: s(41) }}>
          <div className="flex flex-col items-start">
            <Heading fontSize={s(118)} />
            <AnimatePresence mode="wait">
              <motion.div
                key={setKey}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={fadeTransition}
                className="flex flex-col items-start"
              >
                <TextBlock
                  item={item0}
                  delay={0}
                  width={s(298)}
                  fontSize={s(26)}
                  className="mt-[15px] mb-[92px]"
                />
                <PhotoBlock
                  item={item1}
                  delay={0.1}
                  width={s(281)}
                  height={s(295)}
                  className="mb-[67px]"
                />
                <TextBlock item={item2} delay={0.2} width={s(328)} fontSize={s(26)} />
              </motion.div>
            </AnimatePresence>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={setKey}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={fadeTransition}
              className="flex flex-col items-start"
            >
              <PhotoBlock
                item={item0}
                delay={0}
                width={s(281)}
                height={s(315)}
                className="mb-[50px]"
              />
              <TextBlock
                item={item1}
                delay={0.1}
                width={s(291)}
                fontSize={s(26)}
                className="mb-[32px]"
              />
              <PhotoBlock item={item2} delay={0.2} width={s(281)} height={s(315)} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
