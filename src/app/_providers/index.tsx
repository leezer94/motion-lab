"use client";

import type { ReactNode } from "react";
import { QueryProvider } from "./query-provider";
import { ThemeProvider } from "@/shared/providers/theme-provider";
import type { ThemePreference } from "@/shared/providers/theme-config";

type AppProvidersProps = {
  children: ReactNode;
  initialTheme?: ThemePreference;
};

export function AppProviders({ children, initialTheme }: AppProvidersProps) {
  return (
    <QueryProvider>
      <ThemeProvider initialTheme={initialTheme}>{children}</ThemeProvider>
    </QueryProvider>
  );
}
