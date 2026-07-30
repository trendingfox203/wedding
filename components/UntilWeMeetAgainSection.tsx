import Image from "next/image";
import { weddingConfig } from "@/lib/wedding-config";
import { Reveal } from "./Reveal";
import { formatWeddingDateShort } from "@/lib/wedding-config";
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

export function UntilWeMeetAgainSection() {
  const { closing } = weddingConfig;

  return (
    <section id="story" className="relative flex min-h-screen items-center overflow-hidden py-24 text-cream">
      <Image src="/images/until-we-meet-bg-v3.jpg" alt="" fill className="object-cover grayscale" />
      <div className="absolute inset-0 bg-ink/60" />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-44 px-6 sm:flex-row sm:items-center sm:justify-between">
        <Reveal className="flex flex-col items-center gap-4 text-center">
          <h2 className="font-velour text-2xl uppercase tracking-[0.25em] sm:text-3xl">
            {closing.heading}
          </h2>
          {/* <div className="h-px w-14 bg-cream/70" /> */}
          <p className="font-gt-italic mt-2 text-2xl">{closing.subheading}</p>
          <p className="font-velour-light text-2xl uppercase tracking-wide">
            {formatWeddingDateShort()}
          </p>
          {/* <div className="h-px w-14 bg-cream/70" /> */}
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
            <Image src="/images/until-we-meet-1-v3.jpg" alt="" fill className="object-contain grayscale" />
          </div>
          <div
            className="absolute shadow-lg"
            style={{ left: PHOTO1.width + GAP, top: 0, width: PHOTO2.width, height: PHOTO2.height }}
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
      <div
        className="absolute"
        style={{
          left: `${(1150 / 1920) * 100}%`,
          bottom: `${(148 / 1080) * 100}%`,
          width: `${(252 / 1920) * 100}%`,
          height: `${(197 / 1080) * 100}%`,
        }}
      >
        <Image src="/images/frame9_handsignn.png" alt="" fill className="object-contain" />
      </div>
    </section>
  );
}
