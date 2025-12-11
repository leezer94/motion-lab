"use client";

import { motion } from "motion/react";
import { cn } from "@/design-system/utils/cn";
import type { SpecimenCard } from "../model/use-gbif-specimens";

type EcologyCarouselCardProps = {
  specimen: SpecimenCard;
  relativePosition: number;
  isActive: boolean;
  isMobile: boolean;
  onSelect: () => void;
};

export function EcologyCarouselCard({
  specimen,
  relativePosition,
  isActive,
  isMobile,
  onSelect,
}: EcologyCarouselCardProps) {
  const distance = Math.abs(relativePosition);
  if (distance > 2 || (isMobile && !isActive)) {
    return null;
  }

  return (
    <motion.article
      layout
      className={cn(
        "absolute flex w-[190px] flex-col items-center rounded-[32px] border border-white/10 bg-slate-950/80 px-5 py-6 text-center text-slate-50 shadow-[0_25px_70px_rgba(8,10,35,0.6)]",
        !isActive ? "cursor-pointer" : "cursor-default",
      )}
      animate={{
        x: isMobile ? 0 : relativePosition * 210,
        scale: isMobile ? 1 : isActive ? 1 : 0.85,
        opacity: isActive ? 1 : 0.45,
        rotateY: isMobile ? 0 : relativePosition * -10,
        zIndex: 10 - distance,
      }}
      transition={{ type: "spring", stiffness: 320, damping: 32 }}
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
      onClick={() => {
        if (!isActive) {
          onSelect();
        }
      }}
      onKeyDown={(event) => {
        if (!isActive && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onSelect();
        }
      }}
    >
      <div
        className={cn(
          "mb-4 h-14 w-14 rounded-full border border-white/20 bg-gradient-to-br",
          specimen.accent,
        )}
      />
      <h3
        className="mb-1 text-lg font-semibold leading-tight"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {specimen.name}
      </h3>
      <p
        className="text-[10px] uppercase tracking-[0.3em] text-slate-400"
        style={{ display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" }}
      >
        {specimen.family}
      </p>
      <p className="mt-2 text-xs text-slate-300 line-clamp-1">{specimen.region}</p>
    </motion.article>
  );
}
