import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/shared/providers/theme-provider";
import { getLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "Framer Motion Examples",
  description: "Next.js playground preloaded with Framer Motion demos.",
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default async function RootLayout({ children }: RootLayoutProps) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
