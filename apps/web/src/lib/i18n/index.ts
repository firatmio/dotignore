export { default as tr } from "./translations/tr";
export { default as en } from "./translations/en";
export type { Translations } from "./translations/tr";

export type Locale = "tr" | "en";

export const locales: Locale[] = ["tr", "en"];

export const localeNames: Record<Locale, string> = {
  tr: "Türkçe",
  en: "English",
};

export const localeFlags: Record<Locale, string> = {
  tr: "🇹🇷",
  en: "🇺🇸",
};

export function detectLocale(): Locale {
  if (typeof window === "undefined") return "en";

  // 1. Check localStorage preference
  const stored = localStorage.getItem("locale");
  if (stored && locales.includes(stored as Locale)) return stored as Locale;

  // 2. Check browser language
  const browserLang = navigator.language.split("-")[0];
  if (locales.includes(browserLang as Locale)) return browserLang as Locale;

  // 3. Default
  return "en";
}
