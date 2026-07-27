import Image from "next/image";
import { weddingConfig } from "@/lib/wedding-config";
import { Reveal } from "./Reveal";

export function DetailsSection() {
  const { venue, schedule } = weddingConfig;

  return (
    <section id="details" className="relative flex min-h-screen items-center overflow-hidden bg-wine py-24 text-cream">
      <Image src="/images/details-illustration.webp" alt="" fill aria-hidden className="pointer-events-none object-cover" />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-3 px-6 text-center">
        <Reveal className="flex flex-col items-center gap-2">
          <h2 className="font-milton stroke-thin text-5xl sm:text-6xl">The Details</h2>
          <h3 className="font-velour mt-2 text-4xl uppercase tracking-wide sm:text-5xl">
            {venue.name}
          </h3>
          <p className="font-velour mt-4 text-base">{venue.room}</p>
          <p className="font-velour text-base">{venue.address}</p>
        </Reveal>

        <Reveal
          delay={0.15}
          className="font-velour mt-16 flex flex-col items-center gap-10 sm:flex-row sm:gap-12"
        >
          {schedule.map((item, i) => (
            <div key={item.label} className="flex items-center gap-10 sm:gap-12">
              <div className="flex flex-col items-center gap-3">
                <p className="text-2xl sm:text-3xl">{item.time}</p>
                <p className="text-xs uppercase tracking-[0.3em] text-cream/80">
                  {item.label}
                </p>
              </div>
              {i < schedule.length - 1 && (
                <span className="hidden h-px w-10 bg-cream/40 sm:block" />
              )}
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
