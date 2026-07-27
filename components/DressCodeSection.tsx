import Image from "next/image";
import { weddingConfig } from "@/lib/wedding-config";
import { Reveal } from "./Reveal";

export function DressCodeSection() {
  const { dressCode } = weddingConfig;

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-rose py-24 text-cream">
      <Image
        src="/images/dresscode-paper-frame.webp"
        alt=""
        fill
        aria-hidden
        className="pointer-events-none object-cover mix-blend-multiply opacity-70"
      />

      <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center gap-6 px-6 text-center">
        <Reveal className="flex flex-col items-center gap-2">
          <h2 className="font-milton stroke-thin text-5xl sm:text-6xl">Dresscode</h2>
          <h3 className="font-velour mt-2 text-4xl uppercase tracking-wide sm:text-5xl">
            {dressCode.heading}
          </h3>
        </Reveal>

        <Reveal delay={0.15} className="relative mt-4 w-full max-w-2xl">
          <Image
            src="/images/dresscode-illustration-v2.png"
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

        <Reveal delay={0.25} className="font-velour flex flex-col gap-1 text-base">
          <p>{dressCode.ladiesText}</p>
          <p>{dressCode.gentlemenText}</p>
        </Reveal>
      </div>
    </section>
  );
}
