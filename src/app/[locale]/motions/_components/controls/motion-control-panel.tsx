"use client";

import type { ReactNode } from "react";

type MotionControlPanelProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function MotionControlPanel({
  title,
  description,
  children,
  footer,
}: MotionControlPanelProps) {
  return (
    <div className="rounded-3xl border border-border/70 bg-card/80 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.18)]">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <div className="mt-6 space-y-6">{children}</div>
      {footer ? <div className="mt-8">{footer}</div> : null}
    </div>
  );
}
