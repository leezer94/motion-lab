import { createNavigation } from "next-intl/navigation";
import { locales } from "./i18n/routing";

export const localePrefix = "always";

export const { Link, usePathname, useRouter, redirect } = createNavigation({
  locales,
  localePrefix,
});
