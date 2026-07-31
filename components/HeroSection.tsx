"use client";

import Image from "next/image";
import { useWeddingConfig, formatWeddingDateShort } from "@/lib/wedding-config";
import { useUiStrings } from "@/lib/ui-strings";
import { useFont } from "@/lib/fonts";
import { playBackgroundMusic } from "@/lib/backgroundMusic";

export function HeroSection() {
  const weddingConfig = useWeddingConfig();
  const ui = useUiStrings();
  const font = useFont();
  const { groom, bride, tagline, openInvitationLabel } = weddingConfig;

  return (
    <section id="top" className="relative h-screen min-h-[640px] w-full overflow-hidden">
      <Image
        src="/images/hero.webp"
        alt={`${groom.fullName} & ${bride.fullName}`}
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30" />

      {/* Sizes use clamp(min, vw, max) instead of fixed px — the Figma reference
          is a 1920px-wide frame, so fixed px only looks right at ~1920px
          viewports. The vw term keeps the same proportion at any width; the
          min/max bounds keep it sane on very narrow or very wide screens.
          Same fix as frame3. */}
      <div className="relative z-10 flex h-full flex-col items-center px-6 text-center text-cream [text-shadow:0_1px_12px_rgba(0,0,0,0.35)]">
        <div className="flex flex-col items-center pt-[12vh]">
          <h2
            className={`font-velour-light uppercase`}
            style={{ fontSize: "clamp(32px, 4.11vw, 90px)", letterSpacing: "clamp(4px, 0.26vw, 6px)", lineHeight: 1.25 }}
          >
            {ui.hero.loveStory}
          </h2>
          <p
            className="font-velour-light mt-3 uppercase tracking-[0.05em]"
            style={{ fontSize: "clamp(13px, 1.25vw, 26px)", lineHeight: 1.25 }}
          >
            {formatWeddingDateShort()}
          </p>
        </div>

        <div
          className="relative flex flex-1 flex-col items-center justify-center"
          style={{ paddingBottom: "120px" }}
        >
          <h1
            className="font-parfumerie leading-none"
            style={{ fontSize: "clamp(85px, 12.71vw, 260px)" }}
          >
            {groom.shortName} <span className="font-parfumerie-old">&amp;</span> {bride.shortName}
          </h1>
          <p
            className={`font-parfumerie-regular leading-none`}
            style={{ fontSize: "clamp(28px, 4.11vw, 90px)", marginTop: "clamp(14px, 1.67vw, 34px)" }}
          >
            {tagline}
          </p>
        </div>

        <a
          href="#open-invitation"
          onClick={playBackgroundMusic}
          className="mb-[6vh] sm:mb-[3vh] transition-transform hover:scale-105"
          style={{ width: "clamp(200px, 19.06vw, 400px)" }}
        >
          <Image
            src="/images/open-invitation-button.png"
            alt={openInvitationLabel}
            width={732}
            height={166}
            className="h-auto w-full"
          />
        </a>
      </div>
    </section>
  );
}
