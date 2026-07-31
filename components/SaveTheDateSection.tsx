"use client";

import { Fragment, useEffect, useState, type MouseEvent } from "react";
import Image from "next/image";
import { useWeddingConfig } from "@/lib/wedding-config";
import { useUiStrings } from "@/lib/ui-strings";
import { useFont } from "@/lib/fonts";
import { useLanguage } from "@/lib/LanguageContext";
import { isAndroid, isIOS, isInAppBrowser } from "@/lib/inAppBrowser";

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
  const weddingConfig = useWeddingConfig();
  const ui = useUiStrings();
  const font = useFont();
  const { language } = useLanguage();
  const target = new Date(weddingConfig.weddingDateISO).getTime();
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft> | null>(null);
  const [showOpenInBrowserHint, setShowOpenInBrowserHint] = useState(false);

  useEffect(() => {
    setTimeLeft(getTimeLeft(target));
    const id = setInterval(() => setTimeLeft(getTimeLeft(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  // In-app browsers (Zalo, Messenger, Facebook, ...) run a locked-down
  // WebView that can't download files or hand off to the Calendar app —
  // that's an app-level restriction, nothing our page's code can change.
  // The one escape hatch: Android lets a page navigate to an `intent://`
  // URL, which the OS resolves outside the WebView entirely, landing the
  // user in their actual default browser where the download works
  // normally. iOS has no equivalent — a WKWebView can't be told to hand
  // off to Safari — so there we just point the user at the "..." menu
  // these apps already provide for exactly this.
  function handleCalendarClick(e: MouseEvent<HTMLAnchorElement>) {
    if (!isInAppBrowser()) return;

    if (isAndroid()) {
      e.preventDefault();
      const icsUrl = new URL(`/calendar.ics?lang=${language}`, window.location.href);
      window.location.href = `intent://${icsUrl.host}${icsUrl.pathname}${icsUrl.search}#Intent;scheme=https;end`;
      return;
    }

    if (isIOS()) {
      e.preventDefault();
      setShowOpenInBrowserHint(true);
    }
  }

  const units = [
    { id: "days", label: ui.countdown.days, value: timeLeft?.days },
    { id: "hours", label: ui.countdown.hours, value: timeLeft?.hours },
    { id: "minutes", label: ui.countdown.minutes, value: timeLeft?.minutes },
    { id: "seconds", label: ui.countdown.seconds, value: timeLeft?.seconds },
  ];

  return (
    <section className="relative flex min-h-screen items-center sm:items-end overflow-hidden py-20">
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
              <div className="flex justify-center items-center gap-2 sm:gap-5">
                {units.map((unit, i) => (
                  <Fragment key={unit.id}>
                    {i > 0 && <div className="h-6 w-0.5 -mt-[10px] bg-cream/70 sm:-mt-[16px] sm:h-8" />}
                    <div className="flex flex-col items-center">
                      <span className="font-valencia text-lg text-white tabular-nums sm:text-3xl">
                        {unit.value !== undefined ? String(unit.value).padStart(2, "0") : "--"}
                      </span>
                      <span
                        className={`${font("heading")} text-white leading-none text-lg sm:text-3xl`}
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
                  className={`${font("heading")} text-3xl sm:text-6xl leading-[0.8] tracking-[-1px]`}
                  style={{ WebkitTextStroke: '0.1px #000' }}
                >
                  {ui.saveTheDate.the}
                </p>
                <p className={`${font("bodyLight")} text-xl sm:text-3xl tracking-normal`}>{ui.saveTheDate.decade}</p>
                <p className="font-velour-light text-base sm:text-xl tracking-normal">10.10</p>
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
            href={`/calendar.ics?lang=${language}`}
            onClick={handleCalendarClick}
            aria-label={ui.saveTheDate.addToCalendarAria}
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

          {showOpenInBrowserHint && (
            <p className={`${font("body")} mt-3 max-w-xs text-center text-sm text-cream`}>
              {ui.saveTheDate.openInBrowserHint}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
