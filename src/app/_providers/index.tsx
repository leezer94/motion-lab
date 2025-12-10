"use client";

import type { ReactNode } from "react";
import { QueryProvider } from "./query-provider";
import { JotaiStoreProvider } from "./jotai-provider";
import { ThemeProvider } from "@/shared/providers/theme-provider";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <JotaiStoreProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </JotaiStoreProvider>
    </QueryProvider>
  );
}
