"use client";

import { motion } from "motion/react";
import { siteConfig } from "@/shared/config/site";

export function LabTip() {
  const {
    label,
    body: { prefix, code, suffix },
  } = siteConfig.tip;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center sm:text-left"
    >
      <p className="text-sm uppercase tracking-[0.3em] text-zinc-300">{label}</p>
      <p className="mt-4 text-lg text-zinc-100">
        {prefix}
        <code className="mx-2 rounded bg-black/30 px-2 py-1 text-sm">{code}</code>
        {suffix}
      </p>
    </motion.div>
  );
}
