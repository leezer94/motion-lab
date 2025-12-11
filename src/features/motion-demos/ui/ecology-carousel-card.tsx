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
      className={cn(
        "absolute flex h-[240px] w-[180px] flex-col items-center justify-center rounded-[32px] border border-white/10 bg-slate-950/75 px-5 py-6 text-center text-slate-50 shadow-[0_25px_70px_rgba(8,10,35,0.6)]",
        !isActive ? "cursor-pointer" : "cursor-default",
      )}
      animate={{
        x: isMobile ? 0 : relativePosition * 210,
        scale: isMobile ? 1 : isActive ? 1 : 0.8,
        opacity: isActive ? 1 : 0.45,
        rotateY: isMobile ? 0 : relativePosition * -12,
        zIndex: 10 - distance,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 32 }}
      role="button"
      tabIndex={0}
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
          "mb-4 h-12 w-12 rounded-full border border-white/20 bg-gradient-to-br",
          specimen.accent,
        )}
      />
      <h3
        className="mb-2 text-lg font-semibold leading-tight"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {specimen.name}
      </h3>
      <p className="text-xs uppercase tracking-[0.35em] text-slate-400">{specimen.family}</p>
      <div
        className={cn(
          "mt-4 text-sm text-slate-300 transition-all duration-200",
          isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1",
        )}
      >
        {specimen.region}
      </div>
    </motion.article>
  );
}
