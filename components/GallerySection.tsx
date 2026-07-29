"use client";

import { useState } from "react";
import Image from "next/image";
import { weddingConfig } from "@/lib/wedding-config";

export function GallerySection() {
  const { gallery, groom, bride } = weddingConfig;
  const rightPhotos = gallery.photos.slice(1);
  const [index, setIndex] = useState(0);
  const count = rightPhotos.length;

  const prev = () => setIndex((i) => (i - 1 + count) % count);
  const next = () => setIndex((i) => (i + 1) % count);

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden py-16">
      <div className="absolute inset-0 bg-ink/70" />

      <div className="relative mx-auto flex w-full max-w-4xl items-center px-4">
        {count > 1 && (
          <button
            type="button"
            onClick={prev}
            aria-label="Previous photo"
            className="mr-2 shrink-0 text-3xl text-cream/80 hover:text-cream sm:mr-4"
          >
            ‹
          </button>
        )}

        <div className="grid flex-1 grid-cols-1 items-stretch sm:grid-cols-2 sm:items-start">
          <div className="relative flex flex-col items-center justify-center gap-4 bg-cream-dim px-8 text-left text-ink sm:aspect-[653/785] sm:px-[9%]">
            {/* Photo + quote + signature as one group, centered as a whole
                in the frame — puts the photo right around the frame's
                center with the quote trailing close behind it (~1 line
                gap), instead of pinning the quote to the frame's bottom
                edge (which put a big empty gap between photo and text). */}
            <div className="flex w-[55%] flex-col items-start gap-4">
              <div className="relative aspect-[8/9] w-full overflow-hidden">
                <Image
                  src={gallery.photos[0]}
                  alt={`${groom.fullName} & ${bride.fullName}`}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="w-full font-velour text-[10px] text-justify leading-relaxed">
                {gallery.quote}
              </p>
              <div className="relative aspect-[16/9] w-[78%] self-end">
                <Image
                  src={gallery.signatureImage}
                  alt={`${groom.fullName} & ${bride.fullName}`}
                  fill
                  className="object-contain object-right"
                />
              </div>
            </div>
          </div>

          <div className="relative min-h-[320px] w-full overflow-hidden sm:aspect-[653/785] sm:min-h-0">
            <Image
              key={index}
              src={rightPhotos[index]}
              alt=""
              fill
              className="object-cover transition-opacity duration-500"
            />
          </div>
        </div>

        {count > 1 && (
          <button
            type="button"
            onClick={next}
            aria-label="Next photo"
            className="ml-2 shrink-0 text-3xl text-cream/80 hover:text-cream sm:ml-4"
          >
            ›
          </button>
        )}
      </div>
    </section>
  );
}
