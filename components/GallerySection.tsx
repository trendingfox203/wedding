"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { weddingConfig } from "@/lib/wedding-config";
import { getPhotoConfig } from "@/lib/photo-config";

const fadeTransition = { duration: 0.4, ease: "easeInOut" as const };

// Full inline style from a photo's config — objectFit/objectPosition plus
// an optional transform/transformOrigin (e.g. a zoom-in crop that plain
// object-position can't express) for photos that need it.
function photoStyle(src: string): CSSProperties {
  const cfg = getPhotoConfig(src);
  return {
    objectFit: cfg.objectFit,
    objectPosition: cfg.objectPosition,
    transform: cfg.transform,
    transformOrigin: cfg.transformOrigin,
  };
}

export function GallerySection() {
  const { gallery, groom, bride } = weddingConfig;
  // photos[0] + photos[1] are the special first page (quote/signature card
  // on the left). Everything after that is paginated in pairs — page 2 =
  // photos[2]+photos[3], page 3 = photos[4]+photos[5], etc. — so each photo
  // after the first two appears on exactly one page, and "next" swaps both
  // sides together instead of sliding one photo at a time.
  const pairPhotos = gallery.photos.slice(2);
  const pairs: [string, string | undefined][] = [];
  for (let i = 0; i < pairPhotos.length; i += 2) {
    pairs.push([pairPhotos[i], pairPhotos[i + 1]]);
  }
  const pageCount = 1 + pairs.length;
  const [page, setPage] = useState(0);

  const prev = () => setPage((p) => (p - 1 + pageCount) % pageCount);
  const next = () => setPage((p) => (p + 1) % pageCount);

  const isFirstPage = page === 0;
  const leftPhoto = isFirstPage ? gallery.photos[0] : pairs[page - 1][0];
  const rightPhoto = isFirstPage ? gallery.photos[1] : pairs[page - 1][1];

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden py-16">
      <div className="absolute inset-0 bg-ink/70" />

      <div className="relative mx-auto flex w-full max-w-4xl items-center px-4">
        {pageCount > 1 && (
          <button
            type="button"
            onClick={prev}
            aria-label="Previous photo"
            className="absolute left-0 z-10 flex h-11 w-11 shrink-0 items-center justify-center text-4xl text-[#878787] hover:text-cream"
          >
            ‹
          </button>
        )}

        <div className="grid flex-1 grid-cols-1 items-stretch sm:grid-cols-2 sm:items-start">
          <AnimatePresence mode="wait" initial={false}>
            {isFirstPage ? (
              <motion.div
                key="first-left"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={fadeTransition}
                className="relative flex flex-col items-center justify-center gap-4 bg-cream-dim px-8 text-left text-ink sm:aspect-[653/785] sm:px-[9%]"
              >
                {/* Photo + quote + signature as one group, centered as a whole
                    in the frame — puts the photo right around the frame's
                    center with the quote trailing close behind it (~1 line
                    gap), instead of pinning the quote to the frame's bottom
                    edge (which put a big empty gap between photo and text). */}
                <div className="flex mt-24 w-[55%] flex-col items-start gap-4">
                  <div className="relative aspect-[8/9] w-full overflow-hidden">
                    <Image
                      src={gallery.photos[0]}
                      alt={`${groom.fullName} & ${bride.fullName}`}
                      fill
                      style={photoStyle(gallery.photos[0])}
                    />
                  </div>
                  <p className="w-full font-velour text-xs text-justify leading-relaxed sm:text-[10px]">
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
              </motion.div>
            ) : (
              <motion.div
                key={`left-${page}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={fadeTransition}
                className="relative min-h-[320px] w-full overflow-hidden sm:aspect-[653/785] sm:min-h-0"
              >
                {leftPhoto && (
                  <Image
                    src={leftPhoto}
                    alt=""
                    fill
                    style={photoStyle(leftPhoto)}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative min-h-[320px] w-full overflow-hidden sm:aspect-[653/785] sm:min-h-0">
            <AnimatePresence mode="wait" initial={false}>
              {rightPhoto && (
                <motion.div
                  key={`right-${page}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={fadeTransition}
                  className="absolute inset-0"
                >
                  <Image
                    src={rightPhoto}
                    alt=""
                    fill
                    style={photoStyle(rightPhoto)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {pageCount > 1 && (
          <button
            type="button"
            onClick={next}
            aria-label="Next photo"
            className="absolute right-0 z-10 flex h-11 w-11 shrink-0 items-center justify-center text-4xl text-cream/80 hover:text-cream"
          >
            ›
          </button>
        )}
      </div>
    </section>
  );
}
