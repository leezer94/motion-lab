"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { siteConfig } from "@/shared/config/site";

export function HeroSection() {
  const { kicker, headline, subheading, primaryCta, secondaryCta } = siteConfig.hero;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-6 text-center sm:text-left"
    >
      <p className="text-sm uppercase tracking-[0.4em] text-zinc-400">{kicker}</p>
      <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">{headline}</h1>
      <p className="text-base leading-relaxed text-zinc-300 sm:text-lg">{subheading}</p>
      <div className="flex flex-wrap items-center justify-center gap-4 sm:justify-start">
        <Link
          href={primaryCta.href}
          className="rounded-full bg-white/10 px-6 py-3 text-sm font-medium uppercase tracking-wide text-white transition hover:bg-white/20"
        >
          {primaryCta.label}
        </Link>
        <Link
          href={secondaryCta.href}
          className="rounded-full border border-white/30 px-6 py-3 text-sm font-medium uppercase tracking-wide text-white/80 transition hover:border-white hover:text-white"
        >
          {secondaryCta.label}
        </Link>
      </div>
    </motion.div>
  );
}
