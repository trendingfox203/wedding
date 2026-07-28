"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { weddingConfig } from "@/lib/wedding-config";
import { Reveal } from "./Reveal";

type Attending = "Joyfully accepts" | "Regretfully declines";

type RSVPFormValues = {
  fullName: string;
  phone: string;
  email: string;
  attending: Attending;
  guestCount: string;
  guestNames: string;
  dietary: string;
  arrivalDate: string;
  departureDate: string;
};

type SubmitState = "idle" | "submitting" | "success" | "error";

export function RSVPForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RSVPFormValues>({
    defaultValues: { attending: "Joyfully accepts", guestCount: "1" },
  });
  const [state, setState] = useState<SubmitState>("idle");
  const attending = watch("attending");

  const onSubmit = async (values: RSVPFormValues) => {
    setState("submitting");
    try {
      if (!weddingConfig.rsvp.endpoint) {
        throw new Error("RSVP endpoint chưa được cấu hình (weddingConfig.rsvp.endpoint).");
      }
      // Google Apps Script Web App không hỗ trợ CORS preflight cho JSON:
      // dùng no-cors + text/plain để tránh preflight, Apps Script tự parse JSON từ e.postData.contents.
      await fetch(weddingConfig.rsvp.endpoint, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(values),
      });
      setState("success");
    } catch (err) {
      console.error(err);
      setState("error");
    }
  };

  const message =
    attending === "Joyfully accepts"
      ? weddingConfig.rsvp.successMessage
      : weddingConfig.rsvp.declineMessage;

  return (
    <section id="rsvp" className="relative flex min-h-screen items-start justify-center overflow-hidden bg-wine py-24 text-cream">
      {/* Fixed-height wrapper (not tied to the section's own height) so toggling "attending"
          (which shows/hides several fields, changing the form's height) never resizes this
          image and triggers an object-cover re-crop — same fix as the FAQ background. min-h
          stretches the image to cover the form's worst case — on mobile the 2-col field pairs
          stack into 1 column, pushing the form to ~1250px, so this needs a bigger floor than
          desktop's ~1076px — so there's no plain bg-wine fallback showing below it. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-screen w-full min-h-[1350px] overflow-hidden" aria-hidden>
        <Image src="/images/rsvp-illustration.webp" alt="" fill className="object-cover" />
      </div>
      {state === "success" && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6"
        >
          <div className="relative w-full max-w-lg overflow-hidden rounded-sm shadow-2xl">
            <button
              type="button"
              onClick={() => setState("idle")}
              aria-label="Close"
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/10 text-xl leading-none text-ink transition-colors hover:bg-black/20"
            >
              ×
            </button>
            <div className="relative aspect-[1702/1042] w-full">
              <Image
                src={attending === "Joyfully accepts" ? "/images/rsvp-thanks-yes.webp" : "/images/rsvp-thanks-no.webp"}
                alt={`${message.heading} ${message.subheading}`}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      )}

      <div className="relative mx-auto max-w-2xl px-6">
        <Reveal className="mb-12 flex flex-col items-center gap-2 text-center">
          <h2 className="font-milton stroke-thin text-5xl sm:text-6xl">Kindly</h2>
          <h3 className="font-velour mt-2 text-4xl uppercase tracking-wide sm:text-5xl">RSVP</h3>
        </Reveal>

        <Reveal>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <div className="order-1 grid gap-6 sm:grid-cols-2">
              <Field label="Full Name" error={errors.fullName?.message}>
                <input
                  {...register("fullName", { required: "Vui lòng nhập họ tên" })}
                  className="input"
                  type="text"
                />
              </Field>

              <Field label="Phone Number" error={errors.phone?.message}>
                <input
                  {...register("phone", { required: "Vui lòng nhập số điện thoại" })}
                  className="input"
                  type="tel"
                />
              </Field>
            </div>

            <Field label="Email" error={errors.email?.message} className="order-2">
              <input
                {...register("email", { required: "Vui lòng nhập email" })}
                className="input"
                type="email"
              />
            </Field>

            <fieldset className="order-3 flex flex-col gap-2">
              <legend className="font-velour text-sm">Will you be attending?</legend>
              <div className="flex flex-wrap gap-3 pt-1">
                {(["Joyfully accepts", "Regretfully declines"] as const).map((option) => (
                  <label
                    key={option}
                    className={`font-velour cursor-pointer rounded-full border px-5 py-2 text-sm transition-colors ${
                      attending === option
                        ? "border-cream bg-cream text-wine"
                        : "border-cream/40 text-cream/80 hover:border-cream/70"
                    }`}
                  >
                    <input type="radio" value={option} {...register("attending")} className="sr-only" />
                    {option}
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Kept mounted and in flow (just invisible, not removed) so the form's natural
                height never changes when switching options — per the earlier request to keep
                the same size as the "accepts" state. The order-* classes below reorder what's
                *visible* so Confirm still sits right after the attending toggle when declining,
                instead of leaving a gap: the invisible block just gets pushed past the button. */}
            <div
              aria-hidden={attending !== "Joyfully accepts"}
              className={`flex flex-col gap-6 ${
                attending === "Joyfully accepts" ? "order-4" : "invisible order-6"
              }`}
            >
              <Field label="How many guests will attend?">
                <select {...register("guestCount")} className="input">
                  {weddingConfig.rsvp.guestCountOptions.map((n) => (
                    <option key={n} value={n} className="text-ink">
                      {n}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Guest Name(s)">
                <input {...register("guestNames")} className="input" type="text" />
              </Field>

              <Field label="Dietary Requirements">
                <input {...register("dietary")} className="input" type="text" />
              </Field>

              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Arrival Date in Ho Chi Minh City">
                  <input {...register("arrivalDate")} className="input" type="date" />
                </Field>

                <Field label="Departure Date from Ho Chi Minh City">
                  <input {...register("departureDate")} className="input" type="date" />
                </Field>
              </div>
            </div>

            {state === "error" && (
              <p className={`text-sm text-red-300 ${attending === "Joyfully accepts" ? "order-5" : "order-4"}`}>
                Có lỗi khi gửi RSVP. Vui lòng thử lại hoặc liên hệ {weddingConfig.contactEmail}.
              </p>
            )}

            <button
              type="submit"
              disabled={state === "submitting"}
              className={`mt-2 rounded-full bg-cream px-8 py-3.5 font-serif text-base text-wine transition-opacity hover:opacity-90 disabled:opacity-50 ${
                attending === "Joyfully accepts" ? "order-6" : "order-5"
              }`}
            >
              {state === "submitting" ? "Sending..." : "Confirm"}
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-2 ${className ?? ""}`}>
      <span className="font-velour text-sm">{label}</span>
      {children}
      {error && <span className="text-xs text-red-300">{error}</span>}
    </label>
  );
}
