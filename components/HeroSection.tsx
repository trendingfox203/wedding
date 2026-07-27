import Image from "next/image";
import { weddingConfig } from "@/lib/wedding-config";

export function HeroSection() {
  const { groom, bride, weddingDateDisplay, tagline, openInvitationLabel } = weddingConfig;

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

      <div className="relative z-10 flex h-full flex-col items-center px-6 text-center text-cream [text-shadow:0_1px_12px_rgba(0,0,0,0.35)]">
        <div className="flex flex-col items-center pt-[12vh]">
          <h2 className="font-velour text-lg uppercase tracking-[0.5em] sm:text-2xl">
            A Love Story
          </h2>
          <div className="mt-5 h-px w-14 bg-cream/80" />
          <p className="font-velour mt-5 text-xs uppercase tracking-[0.4em] sm:text-sm">
            {weddingDateDisplay.day}
            <sup>{weddingDateDisplay.ordinal}</sup> {weddingDateDisplay.month}{" "}
            {weddingDateDisplay.year}
          </p>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center">
          <h1 className="font-parfumerie text-6xl leading-none sm:text-8xl md:text-9xl">
            {groom.shortName} &amp; {bride.shortName}
          </h1>
          <p className="font-gt-italic mt-4 text-lg italic sm:text-xl">{tagline}</p>
        </div>

        <a
          href="#story"
          className="mb-[8vh] w-48 transition-transform hover:scale-105 sm:w-56"
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
