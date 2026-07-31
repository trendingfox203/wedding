"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useWeddingConfig } from "@/lib/wedding-config";
import { useUiStrings } from "@/lib/ui-strings";
import { useFont } from "@/lib/fonts";
import { getPhotoConfig } from "@/lib/photo-config";
import { isDesktopViewport } from "@/lib/viewport";

const fadeTransition = { duration: 0.4, ease: "easeInOut" as const };

// Full inline style from a photo's config — objectFit/objectPosition plus
// an optional transform/transformOrigin (e.g. a zoom-in crop that plain
// object-position can't express) for photos that need it. `isMobile` pulls
// in each photo's optional `mobile` override — the Gallery photo box has a
// different shape on mobile (min-h-[320px] w-full) than desktop
// (sm:aspect-[653/785]), so a crop tuned for one often looks wrong on the
// other. Resolved with a `useState`+`useEffect` (not read directly at
// render time) so server and client render the same thing on first paint —
// reading window.matchMedia during render would mismatch since the server
// has no viewport to check.
function photoStyle(src: string, isMobile: boolean): CSSProperties {
  const cfg = getPhotoConfig(src, isMobile);
  return {
    objectFit: cfg.objectFit,
    objectPosition: cfg.objectPosition,
    transform: cfg.transform,
    transformOrigin: cfg.transformOrigin,
  };
}

export function GallerySection() {
  const { gallery, groom, bride } = useWeddingConfig();
  const ui = useUiStrings();
  const font = useFont();
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
  // Starts false (matches what the server renders, since it has no
  // viewport to check) and corrects itself right after mount — a one-frame
  // flash of the desktop crop on a real mobile device is harmless and
  // avoids a hydration mismatch.
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(!isDesktopViewport());
  }, []);

  const prev = () => setPage((p) => (p - 1 + pageCount) % pageCount);
  const next = () => setPage((p) => (p + 1) % pageCount);

  const isFirstPage = page === 0;
  const leftPhoto = isFirstPage ? gallery.photos[0] : pairs[page - 1][0];
  const rightPhoto = isFirstPage ? gallery.photos[1] : pairs[page - 1][1];

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden sm:py-16">
      <div className="absolute inset-0 bg-ink/70" />

      <div className="relative mx-auto flex w-full max-w-4xl items-center px-4">
        {pageCount > 1 && (
          <button
            type="button"
            onClick={prev}
            aria-label={ui.gallery.previousAria}
            // 1. Dùng màu trắng sáng, thêm text-shadow để tách khỏi mọi nền
            // 2. Tăng kích thước nút bấm (w-12 h-12) và dùng SVG có sẵn
            className="absolute left-0 z-10 flex h-12 w-12 items-center justify-center rounded-full text-[#878787] transition-colors hover:bg-cream/20"
            style={{ textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="currentColor"
              className="h-8 w-8"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}


        {/* The intro/quote page needs its own full-width column on mobile —
            at a narrow half-column width its quote paragraph would need
            8-10+ wrapped lines to fit, which doesn't work at any
            reasonable font size (desktop has always been 2-up here, kept
            via sm:grid-cols-2). Plain photo-pair pages go 2-up at every
            size now, matching what was actually asked for ("hai ảnh nằm ở
            hai bên giống như trên laptop"). */}
        <div
          className={
            isFirstPage
              ? "grid flex-1 grid-cols-2 items-start sm:grid-cols-2"
              : "grid flex-1 grid-cols-2 items-start"
          }
        >
          <AnimatePresence mode="wait" initial={false}>
            {isFirstPage ? (
              <motion.div
                key="first-left"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={fadeTransition}
                className="relative flex flex-col items-center justify-center gap-4 bg-cream-dim px-8 text-left text-ink aspect-[10/16] sm:aspect-[653/785] sm:px-[9%]"
              >
                {/* Photo + quote + signature as one group, centered as a whole
                    in the frame — puts the photo right around the frame's
                    center with the quote trailing close behind it (~1 line
                    gap), instead of pinning the quote to the frame's bottom
                    edge (which put a big empty gap between photo and text). */}
                <div className="flex mt-12 sm:mt-4 w-full sm:w-[70%] flex-col items-center sm:items-start gap-2 sm:gap-4">
                  <div className="relative w-[70%] aspect-[140/180] sm:aspect-[8/9] sm:w-full sm:overflow-hidden">
                    <Image
                      src={gallery.photos[0]}
                      alt={`${groom.fullName} & ${bride.fullName}`}
                      fill
                      style={photoStyle(gallery.photos[0], isMobile)}
                    />
                  </div>
                  <p className={`w-[70%] ${font("body")} text-[0.3rem] text-justify leading-relaxed sm:text-[10px]`}>
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
                className="relative aspect-[10/16] sm:aspect-[653/785] w-full overflow-hidden"
              >
                {leftPhoto && (
                  <Image
                    src={leftPhoto}
                    alt=""
                    fill
                    style={photoStyle(leftPhoto, isMobile)}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative aspect-[10/16] sm:aspect-[653/785] w-full overflow-hidden">
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
                    style={photoStyle(rightPhoto, isMobile)}
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
            aria-label={ui.gallery.nextAria}
            // Tương tự cho nút bên phải
            className="absolute right-0 z-10 flex h-12 w-12 items-center justify-center rounded-full text-white transition-colors hover:bg-white/20"
            style={{ textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="currentColor"
              className="h-8 w-8"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </section>
  );
}
