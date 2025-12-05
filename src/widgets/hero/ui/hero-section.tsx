"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { buttonStyles, Eyebrow, SectionHeading } from "@design-system";
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
      <Eyebrow>{kicker}</Eyebrow>
      <SectionHeading as="h1" size="xl">
        {headline}
      </SectionHeading>
      <p className="text-base leading-relaxed text-zinc-300 sm:text-lg">{subheading}</p>
      <div className="flex flex-wrap items-center justify-center gap-4 sm:justify-start">
        <Link href={primaryCta.href} className={buttonStyles({ variant: "primary" })}>
          {primaryCta.label}
        </Link>
        <Link href={secondaryCta.href} className={buttonStyles({ variant: "secondary" })}>
          {secondaryCta.label}
        </Link>
      </div>
    </motion.div>
  );
}
