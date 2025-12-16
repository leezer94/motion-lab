"use client";

import { type ReactNode } from "react";
import { motion } from "motion/react";

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="rounded-3xl border border-border/70 bg-card/80 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.18)] backdrop-blur-sm transition-all duration-300 hover:border-cyan-400/20 hover:shadow-[0_25px_60px_rgba(15,23,42,0.25)]"
    >
      <div className="mb-1 flex items-center gap-2">
        <div className="h-1 w-1 rounded-full bg-cyan-400" />
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground/90">{description}</p>
      <div className="mt-6 space-y-6">{children}</div>
      {footer ? <div className="mt-8">{footer}</div> : null}
    </motion.div>
  );
}
