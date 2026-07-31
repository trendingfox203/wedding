"use client";

import { useLanguage } from "@/lib/LanguageContext";

// Fixed bottom-right, deliberately not top-* — InAppBrowserRedirect's
// "open in browser" banner is `fixed inset-x-0 top-0 z-50`, so anything
// pinned to a top corner would collide with it whenever that banner shows.
export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="fixed bottom-4 right-4 z-40 flex overflow-hidden rounded-full border border-cream/40 bg-ink/70 font-velour text-xs text-cream shadow-lg backdrop-blur-sm">
      <button
        type="button"
        onClick={() => setLanguage("en")}
        aria-pressed={language === "en"}
        className={`px-3 py-1.5 transition-colors ${
          language === "en" ? "bg-cream text-wine" : "hover:bg-cream/10"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage("vi")}
        aria-pressed={language === "vi"}
        className={`px-3 py-1.5 transition-colors ${
          language === "vi" ? "bg-cream text-wine" : "hover:bg-cream/10"
        }`}
      >
        VI
      </button>
    </div>
  );
}
