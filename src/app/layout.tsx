import type { ReactNode } from "react";
import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { cookies } from "next/headers";
import { getLocale } from "next-intl/server";
import { AppProviders } from "@/app/_providers";
import type { ThemePreference } from "@/shared/providers/theme-config";
import { THEME_PREFERENCE_COOKIE } from "@/shared/providers/theme-config";

export const metadata: Metadata = {
  title: "Motion Lab",
  description: "Next.js playground preloaded with Framer Motion demos.",
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default async function RootLayout({ children }: RootLayoutProps) {
  const locale = await getLocale();
  const themeCookieStore = await cookies();
  const storedTheme = themeCookieStore.get(THEME_PREFERENCE_COOKIE)?.value;
  const initialTheme: ThemePreference | undefined =
    storedTheme === "dark" || storedTheme === "light"
      ? (storedTheme as ThemePreference)
      : undefined;

  return (
    <html lang={locale} className={initialTheme === "dark" ? "dark" : undefined}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="stylesheet"
          href="https://d20gpxbcszdbc7.cloudfront.net/uxbit/css/global/global.css"
        />
        <Script
          type="module"
          strategy="afterInteractive"
          src="https://d20gpxbcszdbc7.cloudfront.net/uxbit/build/uxbit.esm.js"
          data-stencil
          data-resources-url="https://d20gpxbcszdbc7.cloudfront.net/uxbit/build/"
        />
        <Script
          noModule
          strategy="afterInteractive"
          src="https://d20gpxbcszdbc7.cloudfront.net/uxbit/build/uxbit.js"
          data-stencil
        />
        <title>TintoLab UXbit – Demo (All Web Components)</title>
      </head>
      <body>
        <AppProviders initialTheme={initialTheme}>{children}</AppProviders>
      </body>
    </html>
  );
}
