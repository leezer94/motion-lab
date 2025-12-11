import createMiddleware from "next-intl/middleware";
import { locales } from "./src/i18n/routing";

export default createMiddleware({
  locales,
  defaultLocale: "en",
  localePrefix: "always",
});

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
