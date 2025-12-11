import { getRequestConfig } from "next-intl/server";
import { locales, type AppLocale } from "./routing";

export default getRequestConfig(async ({ locale }) => {
  const normalizedLocale: AppLocale = locales.includes(locale as AppLocale)
    ? (locale as AppLocale)
    : "en";

  return {
    locale: normalizedLocale,
    messages: (await import(`./messages/${normalizedLocale}.json`)).default,
  };
});
