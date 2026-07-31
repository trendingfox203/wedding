"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useWeddingConfig } from "@/lib/wedding-config";
import { useUiStrings } from "@/lib/ui-strings";
import { useFont } from "@/lib/fonts";
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
  const weddingConfig = useWeddingConfig();
  const ui = useUiStrings();
  const font = useFont();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RSVPFormValues>({
    defaultValues: { attending: "Joyfully accepts" },
  });
  const [state, setState] = useState<SubmitState>("idle");
  const attending = watch("attending");
  const attendingOptions: { value: Attending; label: string }[] = [
    { value: "Joyfully accepts", label: ui.rsvp.attendingAcceptLabel },
    { value: "Regretfully declines", label: ui.rsvp.attendingDeclineLabel },
  ];

  const onSubmit = async (values: RSVPFormValues) => {
    setState("submitting");
    try {
      if (!weddingConfig.rsvp.endpoint) {
        throw new Error("RSVP endpoint chưa được cấu hình (weddingConfig.rsvp.endpoint).");
      }
      // Các field chỉ áp dụng khi "accepts" (số khách, tên khách, ăn kiêng, ngày đến/đi)
      // vẫn ở trong DOM khi "declines" (chỉ ẩn bằng invisible, không unmount) để giữ
      // nguyên chiều cao form — nhưng vì thế input vẫn giữ giá trị cũ (hoặc select mặc
      // định "1") dù người dùng không còn thấy/chỉnh chúng nữa. Xoá sạch các field này
      // khỏi payload khi declines để không gửi dữ liệu "ma" lên sheet.
      const payload: RSVPFormValues =
        values.attending === "Joyfully accepts"
          ? values
          : { ...values, guestCount: "", guestNames: "", dietary: "", arrivalDate: "", departureDate: "" };
      // Google Apps Script Web App không hỗ trợ CORS preflight cho JSON:
      // dùng no-cors + text/plain để tránh preflight, Apps Script tự parse JSON từ e.postData.contents.
      await fetch(weddingConfig.rsvp.endpoint, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(payload),
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
      <AnimatePresence>
        {state === "success" && (
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) setState("idle");
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg overflow-hidden rounded-lg shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] ring-1 ring-white/10"
            >
              <button
                type="button"
                onClick={() => setState("idle")}
                aria-label={ui.rsvp.closeAria}
                className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/10 text-xl leading-none text-ink transition-all duration-200 hover:scale-110 hover:bg-black/20"
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative mx-auto max-w-2xl px-6">
        <Reveal className="mb-12 flex flex-col items-center gap-2 text-center">
          <h2 className={`${font("heading")} stroke-thin text-5xl sm:text-6xl`}>{ui.rsvp.kindly}</h2>
          <h3 className={`${font("bodyLight")} mt-2 text-4xl uppercase tracking-wide sm:text-5xl`}>{ui.rsvp.rsvp}</h3>
          <p className={`${font("body")} text-center text-sm text-cream`}>
            {ui.rsvp.deadlineNotice(weddingConfig.rsvpDeadlineDisplay)}
          </p>
        </Reveal>

        <Reveal>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <div className="order-1 grid gap-6 sm:grid-cols-2">
              <Field label={ui.rsvp.fullNameLabel} error={errors.fullName?.message}>
                <input
                  {...register("fullName", { required: ui.rsvp.fullNameRequired })}
                  className="input"
                  type="text"
                />
              </Field>

              <Field label={ui.rsvp.phoneLabel} error={errors.phone?.message}>
                <input
                  {...register("phone", { required: ui.rsvp.phoneRequired })}
                  className="input"
                  type="tel"
                />
              </Field>
            </div>

            <Field label={ui.rsvp.emailLabel} error={errors.email?.message} className="order-2">
              <input
                {...register("email", { required: ui.rsvp.emailRequired })}
                className="input"
                type="email"
              />
            </Field>

            <fieldset className="order-3 flex flex-col gap-2">
              <legend className={`${font("body")} text-sm`}>{ui.rsvp.attendingLegend}</legend>
              <div className="flex flex-wrap gap-3 pt-1">
                {attendingOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`${font("body")} cursor-pointer rounded-full border px-5 py-2 text-sm transition-colors ${attending === option.value
                      ? "border-cream bg-cream text-wine"
                      : "border-cream/40 text-cream/80 hover:border-cream/70"
                      }`}
                  >
                    <input type="radio" value={option.value} {...register("attending")} className="sr-only" />
                    {option.label}
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
              className={`flex flex-col gap-6 ${attending === "Joyfully accepts" ? "order-4" : "invisible order-6"
                }`}
            >
              <Field label={ui.rsvp.guestCountLabel}>
                <select {...register("guestCount")} className="input">
                  {weddingConfig.rsvp.guestCountOptions.map((n: number) => (
                    <option key={n} value={n} className="text-ink">
                      {n}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label={ui.rsvp.guestNamesLabel}>
                <input {...register("guestNames")} className="input" type="text" />
              </Field>

              <Field label={ui.rsvp.dietaryLabel}>
                <input {...register("dietary")} className="input" type="text" />
              </Field>

              {/* <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Arrival Date in Ho Chi Minh City">
                  <input {...register("arrivalDate")} className="input" type="date" />
                </Field>

                <Field label="Departure Date from Ho Chi Minh City">
                  <input {...register("departureDate")} className="input" type="date" />
                </Field>
              </div> */}
            </div>

            {state === "error" && (
              <p className={`text-sm text-red-300 ${attending === "Joyfully accepts" ? "order-5" : "order-4"}`}>
                {ui.rsvp.submitError(weddingConfig.contactEmail)}
              </p>
            )}

            <button
              type="submit"
              disabled={state === "submitting"}
              className={`mt-2 rounded-full px-8 py-3.5 ${font("body")} text-base transition-opacity hover:opacity-90 disabled:opacity-50 ${attending === "Joyfully accepts" ? "order-6" : "order-5"
                }`}
              style={{ backgroundColor: "#FEF7E9", color: "#501111" }}
            >
              {state === "submitting" ? ui.rsvp.sending : ui.rsvp.confirm}
            </button>

            <p className={`${font("body")} order-7 text-center text-sm text-cream whitespace-pre-line`}>
              {ui.rsvp.reminder}
            </p>
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
  const font = useFont();
  return (
    <label className={`flex flex-col gap-2 ${className ?? ""}`}>
      <span className={`${font("body")} text-sm`}>{label}</span>
      {children}
      {error && <span className="text-xs text-red-300">{error}</span>}
    </label>
  );
}
