"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { weddingConfig } from "@/lib/wedding-config";

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
    <section className="relative flex min-h-screen snap-start items-center overflow-hidden py-20">
      <div className="absolute inset-0 bg-ink/35" />

      <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-6 px-6">
        <div className="relative aspect-[696/335] w-full overflow-hidden shadow-lg">
          <Image src="/images/savedate-top-v2.jpg" alt="" fill className="object-cover" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent pt-10 pb-4">
            <div className="flex justify-center gap-6 sm:gap-10">
              {units.map((unit) => (
                <div key={unit.label} className="flex flex-col items-center gap-1">
                  <span className="font-serif text-2xl text-cream tabular-nums sm:text-3xl">
                    {unit.value !== undefined ? String(unit.value).padStart(2, "0") : "--"}
                  </span>
                  <span className="font-script text-sm text-cream/90 sm:text-base">
                    {unit.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid w-full grid-cols-2 shadow-lg">
          <div className="flex aspect-[10/9] items-center justify-center bg-cream px-6">
            <p className="font-serif text-lg text-ink sm:text-xl">
              {weddingConfig.weddingDateDisplay.day}
              <sup>{weddingConfig.weddingDateDisplay.ordinal}</sup>{" "}
              {weddingConfig.weddingDateDisplay.month.toUpperCase()}{" "}
              {weddingConfig.weddingDateDisplay.year}
            </p>
          </div>
          <div className="relative aspect-[10/9] w-full overflow-hidden">
            <Image src="/images/savedate-hand-v4.jpg" alt="" fill className="object-cover grayscale" />
          </div>
        </div>

        <div className="relative mt-4 w-56 sm:w-64">
          <Image
            src="/images/save-the-date-button.png"
            alt={weddingConfig.saveTheDateLabel}
            width={702}
            height={152}
            className="h-auto w-full"
          />
        </div>
      </div>
    </section>
  );
}
