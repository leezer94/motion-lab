"use client";

import { motion } from "motion/react";

export function EcologyCarouselSkeleton() {
  return (
    <>
      {[-1, 0, 1].map((relative) => (
        <motion.article
          key={`skeleton-${relative}`}
          className="absolute flex h-[220px] w-[190px] flex-col items-center justify-center rounded-[32px] border border-white/10 bg-slate-900/50 px-5 py-6 text-center text-slate-50 shadow-[0_25px_70px_rgba(8,10,35,0.4)]"
          animate={{
            x: relative * 210,
            scale: relative === 0 ? 1 : 0.85,
            opacity: relative === 0 ? 0.6 : 0.3,
            rotateY: relative * -12,
            zIndex: 10 - Math.abs(relative),
          }}
        >
          <div className="mb-4 h-14 w-14 rounded-full border border-white/15 bg-white/10" />
          <div className="h-4 w-32 rounded-full bg-white/10" />
          <div className="mt-2 h-3 w-24 rounded-full bg-white/10" />
          <div className="mt-4 h-3 w-28 rounded-full bg-white/5" />
        </motion.article>
      ))}
    </>
  );
}
