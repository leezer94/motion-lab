"use client";

import { motion } from "motion/react";
import { Card } from "@design-system";
import type { Demo } from "../model/demos";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/navigation";
import { getMotionDemoPathByTranslationKey } from "@/features/motion-demos";

const hoverTransition = {
  type: "spring" as const,
  stiffness: 180,
  damping: 16,
};

export function DemoCard({ demo }: { demo: Demo }) {
  const demoTranslations = useTranslations("demos");
  const locale = useLocale();
  const href = getMotionDemoPathByTranslationKey(demo.key);

  const cardContent = (
    <Card
      tone="glass"
      interactive={Boolean(href)}
      className="flex h-full flex-col bg-linear-to-br from-muted/50 via-card to-card text-foreground"
    >
      <div className={`mb-6 h-12 w-12 rounded-2xl bg-linear-to-br ${demo.accent}`} />
      <h2 className="text-xl font-semibold">{demoTranslations(`${demo.key}.title`)}</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {demoTranslations(`${demo.key}.description`)}
      </p>
    </Card>
  );

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
      {href ? (
        <Link href={href} locale={locale}>
          {cardContent}
        </Link>
      ) : (
        <div
          aria-disabled="true"
          className="block cursor-not-allowed rounded-3xl border border-dashed border-border/50 p-[1px] opacity-70"
        >
          {cardContent}
        </div>
      )}
    </motion.div>
  );
}
