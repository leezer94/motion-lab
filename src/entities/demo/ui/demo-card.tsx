"use client";

import { motion } from "motion/react";
import { Card } from "@design-system";
import type { Demo } from "../model/demos";
import { useTranslations } from "next-intl";

const hoverTransition = {
  type: "spring" as const,
  stiffness: 180,
  damping: 16,
};

export function DemoCard({ demo }: { demo: Demo }) {
  const demoTranslations = useTranslations("demos");

  return (
    <motion.div
      whileHover={{
        y: -10,
        rotateX: 4,
        filter: "drop-shadow(0px 25px 60px rgba(15, 23, 42, 0.35))",
      }}
      style={{ filter: "drop-shadow(0px 0px 0px rgba(15, 23, 42, 0))" }}
      transition={hoverTransition}
    >
      <Card
        tone="glass"
        interactive
        className="bg-linear-to-br from-muted/50 via-card to-card text-foreground"
      >
        <div className={`mb-6 h-12 w-12 rounded-2xl bg-linear-to-br ${demo.accent}`} />
        <h2 className="text-xl font-semibold">{demoTranslations(`${demo.key}.title`)}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {demoTranslations(`${demo.key}.description`)}
        </p>
      </Card>
    </motion.div>
  );
}
