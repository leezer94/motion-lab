export const locales = ["en", "ko"] as const;
export type AppLocale = (typeof locales)[number];

export function isSupportedLocale(locale: string): locale is AppLocale {
  return (locales as readonly string[]).includes(locale);
}
