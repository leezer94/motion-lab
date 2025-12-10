"use client";

import type { ReactNode } from "react";

type MotionContentPanelProps = {
  children: ReactNode;
};

export function MotionContentPanel({ children }: MotionContentPanelProps) {
  return (
    <section className="flex-1 rounded-3xl border border-border/60 bg-card/60 p-6 shadow-[0_25px_60px_rgba(15,23,42,0.12)]">
      {children}
    </section>
  );
}
