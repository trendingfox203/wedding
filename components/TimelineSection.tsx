"use client";

import { useState } from "react";
import Image from "next/image";
import { weddingConfig } from "@/lib/wedding-config";
import { Reveal } from "./Reveal";

type TimelineItem = { title: string; text: string; photo: string };

function TextBlock({
  item,
  delay,
  width,
  className = "",
}: {
  item: TimelineItem;
  delay: number;
  width: number;
  className?: string;
}) {
  return (
    <Reveal
      delay={delay}
      style={{ maxWidth: width }}
      className={`flex flex-col gap-2 text-left font-valencia ${className}`}
    >
      <p className="text-[26px]">{item.title}</p>
      <p className="text-[26px] leading-snug ">{item.text}</p>
    </Reveal>
  );
}

function PhotoBlock({
  item,
  delay,
  width,
  height,
  className = "",
}: {
  item: TimelineItem;
  delay: number;
  width: number;
  height: number;
  className?: string;
}) {
  return (
    <Reveal
      delay={delay}
      style={{ width, height }}
      className={`relative shrink-0 overflow-hidden rounded-sm ${className}`}
    >
      <Image src={item.photo} alt={item.title} fill className="object-cover" />
    </Reveal>
  );
}

export function TimelineSection() {
  const { timeline } = weddingConfig;
  const [showFuture, setShowFuture] = useState(false);
  const items = showFuture ? timeline.future : timeline.past;
  const [item0, item1, item2] = items;

  const heading = (
    <Reveal className="text-left">
      <button
        type="button"
        onClick={() => setShowFuture((v) => !v)}
        className="font-milton stroke-thin text-6xl transition-opacity hover:opacity-80 sm:text-[118px]"
      >
        {timeline.heading}
      </button>
    </Reveal>
  );

  return (
    <section className="relative flex min-h-screen snap-start items-center overflow-hidden py-24 text-cream">
      <div className="absolute inset-0 bg-ink/70" />
      <div className="relative mx-auto max-w-3xl px-6">
        {/* Mobile: single sequential column, heading on top */}
        <div className="flex flex-col gap-10 sm:hidden">
          {heading}
          {items.map((item, i) => (
            <div key={item.title} className="flex flex-col gap-5">
              <TextBlock item={item} delay={i * 0.1} width={320} />
              <div className="relative aspect-[9/10] w-full overflow-hidden rounded-sm">
                <Image src={item.photo} alt={item.title} fill className="object-cover" />
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: two staggered columns, sizes/gaps matched to exact Figma
            layer positions (frame3 → Group129 → Group124/126/128). */}
        <div className="hidden gap-x-16 sm:flex">
          <div className="flex flex-col items-start">
            {heading}
            <TextBlock item={item0} delay={0} width={298} className="mt-[21px] mb-[120px]" />
            <PhotoBlock item={item1} delay={0.1} width={281} height={295} className="mb-[88px]" />
            <TextBlock item={item2} delay={0.2} width={328} />
          </div>
          <div className="flex flex-col items-start">
            <PhotoBlock item={item0} delay={0} width={281} height={315} className="mb-[63px]" />
            <TextBlock item={item1} delay={0.1} width={291} className="mb-[37px]" />
            <PhotoBlock item={item2} delay={0.2} width={281} height={315} />
          </div>
        </div>
      </div>
    </section>
  );
}
