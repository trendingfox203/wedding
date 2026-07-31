"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { weddingConfig } from "@/lib/wedding-config";
import { isDesktopViewport } from "@/lib/viewport";

// Same mechanism as TimelineSection: Details + Dresscode share one slide in
// the site's slide-navigation. Scrolling within this slide crossfades
// between the two sets of content (instead of moving on to the next slide)
// until the boundary is reached, at which point the controller advances
// normally. Unlike Timeline, nothing stays fixed on screen — the whole
// block (heading included) crossfades together — and both states share the
// same background (Details' bg-wine + illustration) instead of Dresscode
// having its own, so the transition reads as one continuous page.
export type DetailsHandle = {
  tryAdvance: (down: boolean) => boolean;
  enterFromTop: () => void;
  enterFromBottom: () => void;
};

const fadeTransition = { duration: 0.4, ease: "easeInOut" as const };

export const DetailsSection = forwardRef<DetailsHandle>(function DetailsSection(_props, ref) {
  const { venue, schedule, dressCode } = weddingConfig;
  const [showDressCode, setShowDressCode] = useState(false);

  useImperativeHandle(
    ref,
    () => ({
      tryAdvance(down: boolean) {
        // Mobile shows Details + Dresscode as one continuous scroll — no
        // sub-step to intercept, same reasoning as TimelineSection.
        if (!isDesktopViewport()) return false;
        if (down && showDressCode) return false;
        if (!down && !showDressCode) return false;
        setShowDressCode(down);
        return true;
      },
      enterFromTop() {
        if (isDesktopViewport()) setShowDressCode(false);
      },
      enterFromBottom() {
        if (isDesktopViewport()) setShowDressCode(true);
      },
    }),
    [showDressCode],
  );

  function DetailsInfo() {
    return (
      <>
        <div className="flex flex-col items-center gap-2">
          <h2 className="font-milton stroke-thin text-5xl sm:text-6xl">The Details</h2>
          <h3 className="font-velour-light mt-2 text-4xl uppercase tracking-wide sm:text-5xl">
            {venue.name}
          </h3>
          <p className="font-velour mt-4 text-base">{venue.room}</p>
          <p className="font-velour text-base">{venue.address}</p>
        </div>

        {/* Figma keeps this row much tighter/closer to the address above it,
            and the three times clustered together (not spread edge-to-edge)
            — matched via a Figma export: gap from address ~= 0.93x the
            address's own width, schedule row itself compact around center. */}
        <div className="font-velour mt-12 flex flex-col items-center gap-10 sm:mt-[170px] sm:flex-row sm:gap-2">
          {schedule.map((item, i) => (
            <div key={item.label} className="flex items-start gap-10 sm:gap-6">
              <div className="flex flex-col items-center gap-3">
                <p className="text-2xl sm:text-3xl">{item.time}</p>
                <p className="text-lg tracking-normal uppercase text-cream">{item.label}</p>
              </div>
              {i < schedule.length - 1 && (
                <span className="hidden mt-2 mr-5  h-px w-[64px] bg-white sm:block" />
              )}
            </div>
          ))}
        </div>
      </>
    );
  }

  function DresscodeInfo() {
    return (
      <>
        <div className="flex flex-col items-center gap-2">
          <h2 className="font-milton stroke-thin text-5xl sm:text-6xl">Dresscode</h2>
          <h3 className="font-velour-light mt-2 text-4xl uppercase tracking-wide sm:text-5xl">
            {dressCode.heading}
          </h3>
        </div>

        <div className="relative mt-4 w-full max-w-2xl">
          <Image
            src="/images/dresscode-illustration-v3.webp"
            alt="Guests in the wedding's dress code palette"
            width={1600}
            height={719}
            className="h-auto w-full"
          />
        </div>

        <div className="relative w-full max-w-xs">
          <Image
            src="/images/dresscode-swatches-v2.webp"
            alt="Dress code fabric swatches"
            width={1200}
            height={221}
            className="h-auto w-full"
          />
        </div>

        <div className="font-velour flex flex-col gap-1 text-base">
          <p>{dressCode.ladiesText}</p>
          <p>{dressCode.gentlemenText}</p>
        </div>
      </>
    );
  }

  return (
    <section id="details" className="relative flex min-h-screen items-center overflow-hidden bg-wine py-16 text-cream sm:py-8">
      <Image src="/images/details-illustration.webp" alt="" fill aria-hidden className="pointer-events-none object-cover" />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-3 px-6 text-center">
        {/* Mobile: Details and Dresscode stacked one after another, one
            continuous scroll — no swipe-to-toggle here (see
            isDesktopViewport() above), just scroll to see the rest. Each
            block reveals independently via whileInView as it's actually
            scrolled to, now that mobile does genuine gradual scrolling
            (see the "mount" vs "scroll" trigger note in TimelineSection). */}
        <div className="flex w-full flex-col items-center gap-16 sm:hidden">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex w-full flex-col items-center gap-3"
          >
            <DetailsInfo />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex w-full flex-col items-center gap-6"
          >
            <DresscodeInfo />
          </motion.div>
        </div>

        {/* Desktop: crossfade toggle between the two, unchanged. */}
        <div className="relative hidden w-full sm:block">
          <AnimatePresence mode="wait">
            {showDressCode ? (
              <motion.div
                key="dresscode"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={fadeTransition}
                className="flex w-full flex-col items-center gap-6"
              >
                <DresscodeInfo />
              </motion.div>
            ) : (
              <motion.div
                key="details"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={fadeTransition}
                className="flex w-full flex-col items-center gap-3"
              >
                <DetailsInfo />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
});
