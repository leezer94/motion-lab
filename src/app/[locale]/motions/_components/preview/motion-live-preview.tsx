"use client";

import type { ReactNode } from "react";

type MotionLivePreviewProps = {
  label?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function MotionLivePreview({
  label = "Live preview",
  children,
  footer,
}: MotionLivePreviewProps) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-border/60 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-10 text-slate-50 shadow-[0_30px_80px_rgba(8,15,35,0.5)]">
      <p className="text-xs uppercase tracking-[0.4em] text-slate-400">{label}</p>
      <div className="relative mt-10 flex h-[220px] w-full items-center justify-center rounded-[40px] border border-white/10 bg-slate-900/60 shadow-inner">
        {children}
      </div>
      {footer ? <div className="mt-8 text-center text-sm text-slate-300">{footer}</div> : null}
    </div>
  );
}
