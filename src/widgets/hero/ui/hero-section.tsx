"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Button, Eyebrow, SectionHeading } from "@design-system";
import { siteConfig } from "@/shared/config/site";
import { useTranslations } from "next-intl";

export function HeroSection() {
  const hero = useTranslations("hero");
  const { primaryCta, secondaryCta, tertiaryCta } = siteConfig.hero;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-6 text-center sm:text-left"
    >
      <Eyebrow>{hero("kicker")}</Eyebrow>
      <SectionHeading as="h1" size="xl">
        {hero("headline")}
      </SectionHeading>
      <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
        {hero("subheading")}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4 sm:justify-start">
        <Button asChild>
          <Link href={primaryCta.href} target={primaryCta.target}>
            {hero("primaryCtaLabel")}
          </Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href={secondaryCta.href} target={secondaryCta.target}>
            {hero("secondaryCtaLabel")}
          </Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href={tertiaryCta.href} target={tertiaryCta.target}>
            {hero("tertiaryCtaLabel")}
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}
