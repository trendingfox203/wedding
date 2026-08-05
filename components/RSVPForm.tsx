"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useWeddingConfig } from "@/lib/wedding-config";
import { useUiStrings } from "@/lib/ui-strings";
import { useFont } from "@/lib/fonts";
import { useLanguage } from "@/lib/LanguageContext"; // <-- Đã thêm import
import { Reveal } from "./Reveal";

type Attending = "Joyfully accepts" | "Regretfully declines";

type RSVPFormValues = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  attending: Attending;
  guestCount: string;
  guestNames: string;
  dietary: string;
};

type SubmitState = "idle" | "submitting" | "success" | "error";

export function RSVPForm() {
  const weddingConfig = useWeddingConfig();
  const ui = useUiStrings();
  const font = useFont();
  const { language } = useLanguage(); // <-- Lấy ngôn ngữ hiện tại

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RSVPFormValues>({
    defaultValues: { attending: "Joyfully accepts" },
  });
  const [state, setState] = useState<SubmitState>("idle");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const attending = watch("attending");
  const attendingOptions: { value: Attending; label: string }[] = [
    { value: "Joyfully accepts", label: ui.rsvp.attendingAcceptLabel },
    { value: "Regretfully declines", label: ui.rsvp.attendingDeclineLabel },
  ];

  // Hàm chọn ảnh theo ngôn ngữ và trạng thái tham dự
  const getImageSource = (): string => {
    const baseName = attending === "Joyfully accepts" ? "rsvp-thanks-yes" : "rsvp-thanks-no";
    const suffix = language === "vi" ? "-vi" : "";
    return `/images/${baseName}${suffix}.webp`;
  };

  const onSubmit = async (values: RSVPFormValues) => {
    // 1. Đặt trạng thái submitting ngay lập tức (để nút đổi chữ thành "Đang gửi...")
    setState("submitting");

    // 2. Gửi dữ liệu ngay lập tức (chạy ngầm, không chờ đợi)
    try {
      if (!weddingConfig.rsvp.endpoint) {
        throw new Error("RSVP endpoint chưa được cấu hình.");
      }

      const payload: RSVPFormValues =
        values.attending === "Joyfully accepts"
          ? values
          : { ...values, phone: "", email: "", address: "", guestCount: "", guestNames: "", dietary: "" };

      // Gửi request ngay lập tức ở background (không await)
      fetch(weddingConfig.rsvp.endpoint, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(payload),
      }).catch((err) => {
        console.error("Lỗi gửi RSVP (ngầm):", err);
      });

    } catch (err) {
      console.error(err);
      // Nếu lỗi config, vẫn cho hiện popup để tránh người dùng thất vọng
      // (có thể bạn muốn setState("error") tùy ý)
    }

    // 3. Tạo độ trễ để người dùng kịp nhìn thấy nút "Đang gửi..."
    setTimeout(() => {
      // Chuyển sang thành công và hiện popup — popup không tự đóng nữa,
      // khách phải tự bấm đóng (nút X hoặc bấm ra ngoài). hasSubmitted
      // không bao giờ quay lại false trong lần tải trang này, nên nút
      // Confirm vẫn khoá kể cả sau khi đóng popup — tránh khách tưởng
      // chưa gửi thành công rồi bấm gửi lại.
      setState("success");
      setHasSubmitted(true);
    }, 2000);
  };

  const message =
    attending === "Joyfully accepts"
      ? weddingConfig.rsvp.successMessage
      : weddingConfig.rsvp.declineMessage;

  return (
    <section id="rsvp" className="relative flex min-h-screen items-start justify-center overflow-hidden bg-wine py-24 text-cream">
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
                {/* Đã thay src cứng bằng hàm getImageSource() */}
                <Image
                  src={getImageSource()}
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
            <Field label={ui.rsvp.fullNameLabel} error={errors.fullName?.message} className="order-1">
              <input
                {...register("fullName", { required: ui.rsvp.fullNameRequired })}
                className="input"
                type="text"
              />
            </Field>

            <fieldset className="order-2 flex flex-col gap-2">
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

            <div
              aria-hidden={attending !== "Joyfully accepts"}
              className={`flex flex-col gap-6 ${attending === "Joyfully accepts" ? "order-3" : "invisible order-6"}`}
            >
              <div className="grid gap-6 sm:grid-cols-2">
                <Field label={ui.rsvp.phoneLabel} error={errors.phone?.message}>
                  <input
                    {...register("phone", {
                      required: attending === "Joyfully accepts" ? ui.rsvp.phoneRequired : false,
                    })}
                    className="input"
                    type="tel"
                  />
                </Field>

                <Field label={ui.rsvp.emailLabel} error={errors.email?.message}>
                  <input
                    {...register("email", {
                      required: attending === "Joyfully accepts" ? ui.rsvp.emailRequired : false,
                    })}
                    className="input"
                    type="email"
                  />
                </Field>
              </div>

              <Field label={ui.rsvp.addressLabel}>
                <input {...register("address")} className="input" type="text" />
              </Field>

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
            </div>

            {state === "error" && (
              <p className={`text-sm text-red-300 ${attending === "Joyfully accepts" ? "order-4" : "order-3"}`}>
                {ui.rsvp.submitError(weddingConfig.contactEmail)}
              </p>
            )}

            <button
              type="submit"
              disabled={state === "submitting" || hasSubmitted}
              className={`mt-2 rounded-full px-8 py-3.5 ${font("body")} text-base transition-opacity hover:opacity-90 disabled:opacity-50 ${attending === "Joyfully accepts" ? "order-5" : "order-4"}`}
              style={{ backgroundColor: "#FEF7E9", color: "#501111" }}
            >
              {state === "submitting"
                ? ui.rsvp.sending
                : hasSubmitted
                  ? ui.rsvp.alreadySubmitted
                  : ui.rsvp.confirm}
            </button>

            <p className={`${font("body")} order-7 text-center text-xs sm:text-sm text-cream whitespace-pre-line`}>
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