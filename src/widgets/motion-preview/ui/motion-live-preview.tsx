"use client";

import type { ReactNode } from "react";
import { cn } from "@/design-system/utils/cn";

type MotionLivePreviewProps = {
  label?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  contentClassName?: string;
};

export function MotionLivePreview({
  label = "Live preview",
  children,
  footer,
  className,
  contentClassName,
}: MotionLivePreviewProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center rounded-2xl border border-border/60 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 text-slate-50 shadow-[0_30px_80px_rgba(8,15,35,0.5)] sm:rounded-3xl sm:p-8 lg:p-10",
        className,
      )}
    >
      <p className="text-xs uppercase tracking-[0.4em] text-slate-400">{label}</p>
      <div
        className={cn(
          "relative mt-6 flex min-h-[180px] w-full items-center justify-center rounded-[28px] border border-white/10 bg-slate-900/60 shadow-inner sm:mt-8 sm:min-h-[220px] sm:rounded-[40px]",
          contentClassName,
        )}
      >
        {children}
      </div>
      {footer ? <div className="mt-8 text-center text-sm text-slate-300">{footer}</div> : null}
    </div>
  );
}
