"use client";

import { motion } from "motion/react";
import { Card, CodePill, Eyebrow } from "@design-system";
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
    >
      <Card tone="frosted" padding="lg" className="text-center sm:text-left">
        <Eyebrow>{label}</Eyebrow>
        <p className="mt-4 text-lg text-zinc-100">
          {prefix}
          <CodePill className="mx-2">{code}</CodePill>
          {suffix}
        </p>
      </Card>
    </motion.div>
  );
}
