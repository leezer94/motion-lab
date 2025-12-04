import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Framer Motion Examples",
  description: "Next.js playground preloaded with Framer Motion demos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
