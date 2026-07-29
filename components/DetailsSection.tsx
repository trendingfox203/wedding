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

        {/* Figma keeps this row much tighter/closer to the address above it,
            and the three times clustered together (not spread edge-to-edge)
            — matched via a Figma export: gap from address ~= 0.93x the
            address's own width, schedule row itself compact around center. */}
        <Reveal
          delay={0.15}
          className="font-velour mt-[170px] flex flex-col items-center gap-10 sm:flex-row sm:gap-2"
        >
          {schedule.map((item, i) => (
            <div key={item.label} className="flex items-start gap-10 sm:gap-6">
              <div className="flex flex-col items-center gap-3">
                <p className="text-2xl sm:text-3xl">{item.time}</p>
                <p className="text-xs uppercase tracking-[0.3em] text-cream">
                  {item.label}
                </p>
              </div>
              {i < schedule.length - 1 && (
                <span className="hidden mt-2 mr-5  h-px w-[64px] bg-white sm:block" />
              )}
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
