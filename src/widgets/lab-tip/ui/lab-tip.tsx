"use client";

import { motion } from "motion/react";
import { Card, CodePill, Eyebrow } from "@design-system";
import { useTranslations } from "next-intl";

export function LabTip() {
  const tip = useTranslations("tip");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4, duration: 0.4 }}
    >
      <Card tone="frosted" padding="lg" className="text-center sm:text-left">
        <Eyebrow>{tip("label")}</Eyebrow>
        <p className="mt-4 text-lg text-foreground">
          {tip("body.prefix")}
          <CodePill className="mx-2">{tip("body.code")}</CodePill>
          {tip("body.suffix")}
        </p>
      </Card>
    </motion.div>
  );
}
