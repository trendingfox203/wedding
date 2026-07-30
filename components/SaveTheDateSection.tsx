"use client";

import { Fragment, useEffect, useState } from "react";
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

// RFC 5545 requires CRLF line breaks and backslash-escaped commas/semicolons
// in text fields — the venue address has both.
function escapeICSText(text: string) {
  return text.replace(/([,;])/g, "\\$1");
}

function buildWeddingICS() {
  const { groom, bride, venue } = weddingConfig;
  const start = new Date(weddingConfig.weddingDateISO);
  // No explicit end time in the source data — block out a reasonable
  //4-hour window (ceremony through reception) rather than leaving it
  // open-ended, which some calendar apps render awkwardly.
  const end = new Date(start.getTime() + 4 * 60 * 60 * 1000);
  const toICSDate = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const title = `${groom.shortName.toUpperCase()} & ${bride.shortName.toUpperCase()}'S WEDDING DAY`;
  const location = `${venue.name}, ${venue.address}`;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Duy & Khanh Wedding//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:duy-khanh-wedding-${start.getTime()}@wedding-invitation`,
    // DTSTAMP just needs to be a valid timestamp per RFC 5545, not
    // literally "now" — reusing `start` keeps this fully deterministic
    // (new Date() here would render a different value on the server vs.
    // the client a moment later, a hydration mismatch on the href).
    `DTSTAMP:${toICSDate(start)}`,
    `DTSTART:${toICSDate(start)}`,
    `DTEND:${toICSDate(end)}`,
    `SUMMARY:${escapeICSText(title)}`,
    `LOCATION:${escapeICSText(location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join("\r\n");
}

// A real, static `<a href="data:text/calendar,...">` — not a `download`
// blob URL clicked programmatically via JS. The earlier version built a
// Blob + object URL and fired `.click()` on a detached <a> from inside an
// onClick handler; several mobile browsers (and most in-app WebViews —
// Zalo/Messenger/Facebook, which is how a lot of guests will actually open
// this link) silently refuse that kind of synthetic, script-triggered
// download/navigation, so tapping the button visibly did nothing. A plain
// anchor the user taps directly is a real, trusted navigation the OS
// handles the same way it handles any other calendar/mailto-style link:
// iOS shows the native "Add to Calendar" sheet inline, Android downloads
// the .ics for the user to open in Calendar.
function buildCalendarHref() {
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(buildWeddingICS())}`;
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
    <section className="relative flex min-h-screen items-end overflow-hidden py-20">
      <div className="absolute inset-0 bg-ink/70" />

      <div
        className="relative mx-auto flex flex-col items-center gap-12 px-6"
        style={{ width: "clamp(320px, 36.2vw, 696px)" }}
      >
        {/* Countdown photo and the date-card/hand-photo row are now one
            continuous block in the design (no gap between them) — wrapped
            together so they sit flush against each other, while the outer
            flex column's gap-6 still applies between this whole block and
            the #thedecade1010/button group below it. */}
        <div className="w-full">
          <div className="relative aspect-[695/334] w-full overflow-hidden shadow-lg">
            <Image src="/images/savedate-top-v2.jpg" alt="" fill className="object-cover" />
            <div className="absolute inset-x-0 bottom-0 pt-10 pb-6 ">
              <div className="flex justify-center items-center gap-5 sm:gap-5">
                {units.map((unit, i) => (
                  <Fragment key={unit.label}>
                    {i > 0 && <div className="h-8 w-0.5 -mt-[16px] bg-cream/70 sm:h-8" />}
                    <div className="flex flex-col items-center">
                      <span className="font-valencia text-2xl text-cream tabular-nums sm:text-3xl">
                        {unit.value !== undefined ? String(unit.value).padStart(2, "0") : "--"}
                      </span>
                      <span
                        className="font-milton text-white leading-none text-2xl sm:text-3xl"
                        style={{
                          WebkitTextStroke: '0.2px rgb(255,255,2555)',

                        }}
                      >
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
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 overflow-hidden px-2 text-center text-black">
                <p
                  className="font-milton text-5xl sm:text-6xl leading-[0.8] tracking-[-1px]"
                  style={{ WebkitTextStroke: '0.1px #000' }}
                >
                  The
                </p>
                <p className="font-velour-light text-2xl sm:text-3xl tracking-normal">DECADE</p>
                <p className="font-velour-light text-lg sm:text-xl tracking-normal">10.10</p>
              </div>
            </div>
            <div className="relative aspect-[695/646] w-full overflow-hidden">
              <Image src="/images/savedate-hand-v4.jpg" alt="" fill className="object-cover grayscale" />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center ">
          {/* <p className="font-parfumerie text-4xl text-white sm:text-5xl">#thedecade1010</p> */}

          <a
            href={buildCalendarHref()}
            aria-label="Add wedding day to calendar"
            className="relative w-56 transition-transform hover:scale-105 sm:w-64"
          >
            <Image
              src="/images/save-the-date-button.png"
              alt={weddingConfig.saveTheDateLabel}
              width={702}
              height={152}
              className="h-auto w-full"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
