"use client";

// Vietnamese-language font substitution. The site's decorative fonts
// (Velour, Milton, Valencia, GT Super) have little to no Vietnamese
// diacritic coverage — a Vietnamese character mid-word falls back to the
// browser's system font, breaking the look. Baskerville (app/fonts/
// Baskerville-*.ttf) covers Vietnamese fully and stands in for those roles
// when language is "vi". `font-parfumerie*` (the couple's names/"&") is
// deliberately excluded — names stay undiacritized (Latin-only), so no
// substitution is needed there regardless of language.
import { useLanguage } from "./LanguageContext";

const fontMap = {
  heading: { en: "font-milton", vi: "font-baskerville" },
  body: { en: "font-velour", vi: "font-baskerville" },
  bodyLight: { en: "font-velour-light", vi: "font-baskerville" },
  timeline: { en: "font-valencia", vi: "font-baskerville" },
  italic: { en: "font-gt-italic", vi: "font-baskerville italic" },
  scriptRegular: { en: "font-parfumerie-regular", vi: "font-baskerville italic" },
} as const;

export type FontRole = keyof typeof fontMap;

export function useFont() {
  const { language } = useLanguage();
  return (role: FontRole) => fontMap[role][language];
}
