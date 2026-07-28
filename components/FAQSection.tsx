"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { weddingConfig } from "@/lib/wedding-config";
import { Reveal } from "./Reveal";

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      id="faq"
      className="relative flex min-h-screen items-start justify-center overflow-hidden bg-wine py-24 text-cream"
    >
      {/* Fixed-height wrapper (not tied to the section's own height) so opening/closing an
          accordion item — which changes the section's height — never resizes this image and
          triggers an object-cover re-crop. min-h covers the worst case (heading + all questions
          closed + the single longest answer open, measured at ~1004px) on short viewports; on
          tall viewports h-screen takes over instead. Any remaining extra just shows bg-wine. */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-screen w-full min-h-[1050px] overflow-hidden"
        aria-hidden
      >
        <Image
          src="/images/rsvp-illustration.webp"
          alt=""
          fill
          className="object-cover"
        />
      </div>
      <div className="relative mx-auto w-full max-w-3xl px-6">
        <Reveal className="mb-12 flex flex-col items-center gap-2 text-center">
          <h2 className="font-milton stroke-thin text-5xl sm:text-6xl">Frequently Asked</h2>
          <h3 className="font-velour mt-2 text-4xl uppercase tracking-wide sm:text-5xl">
            Questions
          </h3>
        </Reveal>

        <div className="font-velour divide-y divide-cream/25 border-y border-cream/25">
          {weddingConfig.faqs.map((faq, i) => {
            const open = openIndex === i;
            return (
              <div key={faq.question}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : i)}
                  aria-expanded={open}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left text-lg"
                >
                  <span>{faq.question}</span>
                  <span
                    className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
                  >
                    ⌄
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="w-full overflow-hidden"
                    >
                      <p className="w-full pb-5 text-sm leading-relaxed text-cream/80">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
