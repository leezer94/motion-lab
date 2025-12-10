"use client";

import type { ReactNode } from "react";
import { useMemo } from "react";
import { Provider as JotaiProvider, createStore } from "jotai";

type JotaiStoreProviderProps = {
  children: ReactNode;
};

export function JotaiStoreProvider({ children }: JotaiStoreProviderProps) {
  const store = useMemo(() => createStore(), []);

  return <JotaiProvider store={store}>{children}</JotaiProvider>;
}
