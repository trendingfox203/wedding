"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { weddingConfig } from "@/lib/wedding-config";

type TimelineItem = { title: string; text: string; photo: string };

// Desktop content is scaled down from the raw Figma measurements so the whole
// section fits within one viewport height (no scroll) — needed for the
// site-wide slide navigation (useSlideNavigation) to treat this section as a
// single slide with its own past/future sub-step.
const SCALE = 0.72;
const s = (px: number) => Math.round(px * SCALE);

// Imperative API driven by useSlideNavigation (the site-wide "one scroll =
// one slide" controller) instead of this component owning its own
// wheel/touch listeners — the controller needs to know, for the section it
// currently treats as "active", whether a scroll-down/up should switch the
// milestone set (handled here) or move on to the next/previous slide.
export type TimelineHandle = {
  /** Try to switch milestone set in the given direction. Returns true if it
   *  handled the step internally (stay on this slide), false if already at
   *  that boundary (the caller should advance to the next/previous slide). */
  tryAdvance: (down: boolean) => boolean;
  /** Called right when this slide becomes active, so it opens on the
   *  set that matches the direction of entry. */
  enterFromTop: () => void;
  enterFromBottom: () => void;
};

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

export const TimelineSection = forwardRef<TimelineHandle>(function TimelineSection(_props, ref) {
  const { timeline } = weddingConfig;
  const [showFuture, setShowFuture] = useState(false);
  const items = showFuture ? timeline.future : timeline.past;
  const [item0, item1, item2] = items;
  const setKey = showFuture ? "future" : "past";

  useImperativeHandle(
    ref,
    () => ({
      tryAdvance(down: boolean) {
        if (down && showFuture) return false;
        if (!down && !showFuture) return false;
        setShowFuture(down);
        return true;
      },
      enterFromTop() {
        setShowFuture(false);
      },
      enterFromBottom() {
        setShowFuture(true);
      },
    }),
    [showFuture],
  );

  // Plain, unanimated — this heading stays on screen the whole time the
  // section is visible; only the dates/photos below it should carry any
  // transition effect (the AnimatePresence blocks further down). No mount
  // or scroll-triggered fade here, so it can't ever flicker or appear to
  // animate in sync with the past/future switch.
  function Heading({ fontSize }: { fontSize?: number }) {
    return (
      <div className="text-left">
        <button
          type="button"
          onClick={() => setShowFuture((v) => !v)}
          className="font-milton stroke-thin text-6xl transition-opacity hover:opacity-80"
          style={fontSize ? { fontSize } : undefined}
        >
          {timeline.heading}
        </button>
      </div>
    );
  }

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden py-24 text-cream sm:py-8">
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
        {/* Fixed width AND height instead of shrink-to-fit. This row sits
            inside a `mx-auto` + `items-center` centered parent, so if its
            own box size changed between the past/future sets — item2's text
            box is wider for the future set (avoids a 3rd line), and the
            past set's "Different cities..." wraps to 3 lines where the
            future set's equivalent text only needs 2 — the centered parent
            shifts too, visibly nudging "A decade of us" and everything else
            sideways/up-down when toggling. Width is the widest possible left
            column [390] + gap [41] + widest possible right column [291];
            height is tall enough for the tallest combination of text/photo
            in either set (measured live). Constant box size keeps the whole
            row (and its centering) pinned regardless of which set is
            showing. */}
        <div
          className="hidden sm:flex"
          style={{ columnGap: s(41), width: s(390 + 41 + 291), height: s(910) }}
        >
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
                {/* Only the future set's item2 text ("The Tea Ceremony marked...")
                    needs the wider box to avoid a 3rd line — widening it for
                    both sets made this the left column's widest child even
                    for the past set, shifting the whole column (and thus the
                    right column next to it) even though the past text still
                    only used 2 lines either way. */}
                <TextBlock
                  item={item2}
                  delay={0.2}
                  width={showFuture ? s(390) : s(328)}
                  fontSize={s(26)}
                />
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
});
