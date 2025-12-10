"use client";

import { motion } from "motion/react";
import { Card } from "@design-system";
import type { Demo, DemoTranslationKey } from "../model/demos";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/navigation";

const hoverTransition = {
  type: "spring" as const,
  stiffness: 180,
  damping: 16,
};

const demoRouteMap: Record<DemoTranslationKey, string> = {
  hoverSprings: "button",
  timelineReveal: "timeline-reveal",
  dragConstraints: "button",
};

export function DemoCard({ demo }: { demo: Demo }) {
  const demoTranslations = useTranslations("demos");
  const locale = useLocale();
  const href = `/motions/${demoRouteMap[demo.key] ?? "button"}`;

  return (
    <motion.div
      className="h-full"
      whileHover={{
        y: -10,
        rotateX: 4,
        filter: "drop-shadow(0px 25px 60px rgba(15, 23, 42, 0.35))",
      }}
      style={{ filter: "drop-shadow(0px 0px 0px rgba(15, 23, 42, 0))" }}
      transition={hoverTransition}
    >
      <Link href={href} locale={locale}>
        <Card
          tone="glass"
          interactive
          className="flex h-full flex-col bg-linear-to-br from-muted/50 via-card to-card text-foreground"
        >
          <div className={`mb-6 h-12 w-12 rounded-2xl bg-linear-to-br ${demo.accent}`} />
          <h2 className="text-xl font-semibold">{demoTranslations(`${demo.key}.title`)}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {demoTranslations(`${demo.key}.description`)}
          </p>
        </Card>
      </Link>
    </motion.div>
  );
}
