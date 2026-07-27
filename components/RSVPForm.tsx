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
      <div className="relative mx-auto max-w-2xl px-6">
        <Reveal className="mb-12 flex flex-col items-center gap-2 text-center">
          <h2 className="font-milton stroke-thin text-5xl sm:text-6xl">Kindly</h2>
          <h3 className="font-velour mt-2 text-4xl uppercase tracking-wide sm:text-5xl">RSVP</h3>
        </Reveal>

        {state === "success" ? (
          <Reveal className="font-velour py-8 text-center">
            <h4 className="text-2xl">{message.title}</h4>
            <p className="mt-4 text-cream/80">{message.body}</p>
          </Reveal>
        ) : (
          <Reveal>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
              <div className="grid gap-6 sm:grid-cols-2">
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

              <Field label="Email" error={errors.email?.message}>
                <input
                  {...register("email", { required: "Vui lòng nhập email" })}
                  className="input"
                  type="email"
                />
              </Field>

              <fieldset className="flex flex-col gap-2">
                <legend className="font-velour text-sm">Will you be attending?</legend>
                <div className="flex gap-6 pt-1">
                  {(["Joyfully accepts", "Regretfully declines"] as const).map((option) => (
                    <label key={option} className="font-velour flex items-center gap-2 text-sm">
                      <input type="radio" value={option} {...register("attending")} />
                      {option}
                    </label>
                  ))}
                </div>
              </fieldset>

              {attending === "Joyfully accepts" && (
                <>
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
                </>
              )}

              {state === "error" && (
                <p className="text-sm text-red-300">
                  Có lỗi khi gửi RSVP. Vui lòng thử lại hoặc liên hệ {weddingConfig.contactEmail}.
                </p>
              )}

              <button
                type="submit"
                disabled={state === "submitting"}
                className="mt-2 rounded-full bg-cream px-8 py-3.5 font-serif text-base text-wine transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {state === "submitting" ? "Sending..." : "Confirm"}
              </button>
            </form>
          </Reveal>
        )}
      </div>
    </section>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-velour text-sm">{label}</span>
      {children}
      {error && <span className="text-xs text-red-300">{error}</span>}
    </label>
  );
}
