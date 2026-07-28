import Image from "next/image";
import { weddingConfig } from "@/lib/wedding-config";
import { Reveal } from "./Reveal";

// Photo block measured directly off the Figma export at the frame's native 1920px width
// (photo1 259×364 @ top 76, photo2 432×567, 55px gap), then scaled down to match this
// section's actual max-w-6xl (1152px) container so photos stay proportional to the text
// instead of overpowering it.
const SCALE = 1152 / 1920;
const PHOTO1 = { width: 259 * SCALE, height: 364 * SCALE, top: 76 * SCALE };
const PHOTO2 = { width: 432 * SCALE, height: 567 * SCALE };
const GAP = 55 * SCALE;

export function UntilWeMeetAgainSection() {
  const { closing } = weddingConfig;

  return (
    <section id="story" className="relative flex min-h-screen items-center overflow-hidden py-24 text-cream">
      <Image src="/images/until-we-meet-bg-v3.jpg" alt="" fill className="object-cover grayscale" />
      <div className="absolute inset-0 bg-ink/60" />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-12 px-6 sm:flex-row sm:items-center sm:justify-between">
        <Reveal className="flex flex-col items-center gap-4 text-center">
          <h2 className="font-velour text-2xl uppercase tracking-[0.25em] sm:text-3xl">
            {closing.heading}
          </h2>
          <div className="h-px w-14 bg-cream/70" />
          <p className="font-gt-italic text-lg">{closing.subheading}</p>
          <p className="font-gt text-lg uppercase tracking-wide">
            {weddingConfig.weddingDateDisplay.day}
            <sup style={{ fontSize: "0.6em", }}>
              {weddingConfig.weddingDateDisplay.ordinal}
            </sup>{" "}
            {weddingConfig.weddingDateDisplay.month.toUpperCase()}{" "}
            {weddingConfig.weddingDateDisplay.year}
          </p>
          <div className="h-px w-14 bg-cream/70" />
        </Reveal>

        <Reveal
          delay={0.15}
          className="relative shrink-0"
          style={{ width: PHOTO1.width + GAP + PHOTO2.width, height: PHOTO2.height, maxWidth: "100%" }}
        >
          <div
            className="absolute shadow-lg"
            style={{ left: 0, top: PHOTO1.top, width: PHOTO1.width, height: PHOTO1.height }}
          >
            <Image src="/images/until-we-meet-1-v3.jpg" alt="" fill className="object-cover grayscale" />
          </div>
          <div
            className="absolute shadow-lg"
            style={{ left: PHOTO1.width + GAP, top: 0, width: PHOTO2.width, height: PHOTO2.height }}
          >
            <Image src="/images/until-we-meet-2-v3.jpg" alt="" fill className="object-cover grayscale" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
