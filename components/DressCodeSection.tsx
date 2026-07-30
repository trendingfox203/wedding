"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { weddingConfig } from "@/lib/wedding-config";
import { Reveal } from "./Reveal";

export function DressCodeSection() {
  const { dressCode } = weddingConfig;

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-wine py-16 text-cream sm:py-8">
      <Image
        src="/images/dresscode_bg.webp"
        alt=""
        fill
        aria-hidden
        className="pointer-events-none object-cover"
      />

      <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center gap-6 px-6 text-center">
        <Reveal className="flex flex-col items-center gap-2">
          <h2 className="font-milton stroke-thin text-5xl sm:text-6xl">Dresscode</h2>
          <h3 className="font-velour-light mt-2 text-4xl uppercase tracking-wide sm:text-5xl">
            {dressCode.heading}
          </h3>
        </Reveal>

        <Reveal delay={0.15} className="relative mt-4 w-full max-w-2xl">
          <Image
            src="/images/dresscode-illustration-v2.webp"
            alt="Guests in the wedding's dress code palette"
            width={924}
            height={428}
            className="h-auto w-full"
          />
        </Reveal>

        <Reveal delay={0.2} className="relative w-full max-w-xs">
          <Image
            src="/images/dresscode-swatches.png"
            alt="Dress code fabric swatches"
            width={412}
            height={82}
            className="h-auto w-full"
          />
        </Reveal>

        {/* Plain motion.div (animate on mount) instead of Reveal's
            whileInView — this section is short enough that this text sits
            close to the bottom edge, and the slide navigation snaps the
            whole section into view near-instantly rather than scrolling
            past it gradually, so Reveal's "-80px" viewport margin often
            never gets crossed and the text stays stuck invisible (same bug
            fixed the same way for Timeline's "2024 · Barcelona" earlier). */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
          className="font-velour flex flex-col gap-1 text-base"
        >
          <p>{dressCode.ladiesText}</p>
          <p>{dressCode.gentlemenText}</p>
        </motion.div>
      </div>
    </section>
  );
}
