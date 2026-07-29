"use client";

import { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import { weddingConfig, formatWeddingDateShort } from "@/lib/wedding-config";

function getTimeLeft(target: number) {
  const diff = Math.max(0, target - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function SaveTheDateSection() {
  const { groom, bride } = weddingConfig;
  const target = new Date(weddingConfig.weddingDateISO).getTime();
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft> | null>(null);

  useEffect(() => {
    setTimeLeft(getTimeLeft(target));
    const id = setInterval(() => setTimeLeft(getTimeLeft(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const units = [
    { label: "Days", value: timeLeft?.days },
    { label: "Hours", value: timeLeft?.hours },
    { label: "Minutes", value: timeLeft?.minutes },
    { label: "Seconds", value: timeLeft?.seconds },
  ];

  return (
    <section className="relative flex min-h-screen items-end overflow-hidden py-20">
      <div className="absolute inset-0 bg-ink/70" />

      <div
        className="relative mx-auto flex flex-col items-center gap-6 px-6"
        style={{ width: "clamp(320px, 36.2vw, 696px)" }}
      >
        <div className="relative aspect-[695/334] w-full overflow-hidden shadow-lg">
          <Image src="/images/savedate-top-v2.jpg" alt="" fill className="object-cover" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent pt-10 pb-4">
            <div className="flex justify-center items-center gap-6 sm:gap-10">
              {units.map((unit, i) => (
                <Fragment key={unit.label}>
                  {i > 0 && <div className="h-8 w-0.5 bg-cream/70 sm:h-10" />}
                  <div className="flex flex-col items-center">
                    <span className="font-valencia text-2xl text-cream tabular-nums sm:text-3xl">
                      {unit.value !== undefined ? String(unit.value).padStart(2, "0") : "--"}
                    </span>
                    <span className="font-milton leading-none text-4xl text-cream/90 sm:text-2xl">
                      {unit.label}
                    </span>
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
        </div>

        <div className="grid w-full grid-cols-2 shadow-lg">
          {/* `overflow-hidden` alone doesn't stop this cell from growing —
              CSS still sizes the box to fit the text first, THEN clips, so
              a bigger font-size still expanded the box (and with it the
              photo cell next to it, since a grid row stretches both to
              match the taller one). Text now lives in an absolutely
              positioned layer instead, which can never affect this cell's
              own size — the aspect-[695/646] box stays fixed no matter what
              font-size the text is given. */}
          <div className="relative aspect-[695/646] bg-white">
            <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden px-2 text-center">
              <p className="font-velour-light text-sm sm:text-base" style={{ color: "#58595b" }}>
                {groom.fullName} &amp; {bride.fullName}
              </p>
              <p className="font-velour-light text-xs sm:text-sm" style={{ color: "#58595b" }}>
                {formatWeddingDateShort()}
              </p>
            </div>
          </div>
          <div className="relative aspect-[695/646] w-full overflow-hidden">
            <Image src="/images/savedate-hand-v4.jpg" alt="" fill className="object-cover grayscale" />
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <p className="font-parfumerie text-4xl text-white sm:text-5xl">#thedecade1010</p>

          <div className="relative w-56 sm:w-64">
            <Image
              src="/images/save-the-date-button.png"
              alt={weddingConfig.saveTheDateLabel}
              width={702}
              height={152}
              className="h-auto w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
