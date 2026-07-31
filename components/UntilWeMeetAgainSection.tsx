"use client";

import Image from "next/image";
import { useWeddingConfig, formatWeddingDateShort } from "@/lib/wedding-config";
import { useFont } from "@/lib/fonts";
import { Reveal } from "./Reveal";
// Photo block measured directly off the Figma export at the frame's native 1920px width
// (photo1 259×364 @ top 76, photo2 432×567, 55px gap), then scaled down to match this
// section's actual max-w-6xl (1152px) container so photos stay proportional to the text
// instead of overpowering it.
const SCALE = 1152 / 1920;
// photo1's actual file has its own white border baked in, at a narrower
// aspect ratio (519×832) than the original 259×364 Figma box — width
// recomputed from that real ratio (height kept the same) so object-contain
// shows the whole photo (border included) with no empty letterboxing.
const PHOTO1_RATIO = 519 / 832;
const PHOTO1 = { width: 364 * PHOTO1_RATIO * SCALE, height: 364 * SCALE, top: 76 * SCALE };
const PHOTO2 = { width: 432 * SCALE, height: 567 * SCALE };
const GAP = 55 * SCALE;
// The two photos used to be positioned with fixed pixel left/width values
// derived from the constants above. That's fine at desktop width (the
// outer box is capped at max-w-6xl, well under those pixel values), but on
// a narrow mobile screen the box shrinks (maxWidth: "100%") while the
// absolutely-positioned children kept their full desktop pixel size —
// photo 2 overflowed off the right edge of the viewport. Expressing every
// child position/size as a % of the box instead makes them scale with
// whatever width the box actually renders at, at any viewport.
const TOTAL_WIDTH = PHOTO1.width + GAP + PHOTO2.width;
const TOTAL_HEIGHT = PHOTO2.height;
const pct = (n: number, of: number) => `${(n / of) * 100}%`;

export function UntilWeMeetAgainSection() {
  const { closing } = useWeddingConfig();
  const font = useFont();

  return (
    <section id="story" className="relative flex min-h-screen items-center overflow-hidden py-24 text-cream">
      <Image src="/images/until-we-meet-bg-v3.jpg" alt="" fill className="object-cover grayscale" />
      <div className="absolute inset-0 bg-ink/60" />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-10 px-6  sm:w-[90vw]  sm:flex-row sm:items-center sm:justify-between sm:gap-44">
        <Reveal className="flex flex-col items-center gap-4 text-center">
          <h2 className={`${font("body")} text-xl uppercase tracking-[0.25em] sm:text-[1.75rem]`}>
            {closing.heading}
          </h2>
          {/* <div className="h-px w-14 bg-cream/70" /> */}
          <p className={`${font("italic")} mt-2 text-xl sm:text-2xl`}>{closing.subheading}</p>
          <p className="font-velour-light text-xl sm:text-2xl uppercase tracking-wide">
            {formatWeddingDateShort()}
          </p>
          {/* <div className="h-px w-14 bg-cream/70" /> */}
        </Reveal>

        <Reveal
          delay={0.15}
          className="relative w-full shrink-0"
          style={{ maxWidth: TOTAL_WIDTH, aspectRatio: `${TOTAL_WIDTH} / ${TOTAL_HEIGHT}` }}
        >
          <div
            className="absolute shadow-lg"
            style={{
              left: 0,
              top: pct(PHOTO1.top, TOTAL_HEIGHT),
              width: pct(PHOTO1.width, TOTAL_WIDTH),
              height: pct(PHOTO1.height, TOTAL_HEIGHT),
            }}
          >
            <Image src="/images/until-we-meet-1-v3.jpg" alt="" fill className="object-contain grayscale" />
          </div>
          <div
            className="absolute shadow-lg"
            style={{
              left: pct(PHOTO1.width + GAP, TOTAL_WIDTH),
              top: 0,
              width: pct(PHOTO2.width, TOTAL_WIDTH),
              height: "100%",
            }}
          >
            <Image src="/images/until-we-meet-2-v3.jpg" alt="" fill className="object-contain grayscale" />
          </div>
        </Reveal>
      </div>

      {/* Hand-drawn "With love, Duy & Khanh" signature, positioned per the
          Figma export: 252×197 at 1111px from the left / 86px from the
          bottom of the 1920×1080 reference frame — expressed as percentages
          of the section so it scales with the viewport instead of being
          pinned to a fixed pixel spot. */}
      {/* Dành cho Desktop (chỉ hiện trên sm trở lên) */}
      <div
        className="absolute hidden sm:block"
        style={{
          left: `${(1150 / 1920) * 100}%`,
          bottom: `${(148 / 1080) * 100}%`,
          width: `${(252 / 1920) * 100}%`,
          height: `${(197 / 1080) * 100}%`,
        }}
      >
        <Image src="/images/frame9_handsignn.png" alt="" fill className="object-contain" />
      </div>

      {/* Dành cho Mobile (chỉ hiện dưới sm) */}
      <div
        className="absolute block sm:hidden"
        style={{
          left: "10%",
          bottom: "12%",
          width: "48%",
          height: "12%",
        }}
      >
        <Image src="/images/frame9_handsignn.png" alt="" fill className="object-contain" />
      </div>
    </section>
  );
}
