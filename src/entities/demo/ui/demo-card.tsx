"use client";

import { motion } from "framer-motion";
import type { Demo } from "../model/demos";

const hoverTransition = {
  type: "spring" as const,
  stiffness: 180,
  damping: 16,
};

export function DemoCard({ demo }: { demo: Demo }) {
  return (
    <motion.div
      whileHover={{
        y: -10,
        rotateX: 4,
        boxShadow: "0px 20px 60px rgba(15, 23, 42, 0.45)",
      }}
      transition={hoverTransition}
      className="rounded-3xl border border-white/10 bg-gradient-to-br p-6"
    >
      <div className={`mb-6 h-12 w-12 rounded-2xl bg-gradient-to-br ${demo.accent}`} />
      <h2 className="text-xl font-semibold">{demo.title}</h2>
      <p className="mt-2 text-sm text-zinc-300">{demo.description}</p>
    </motion.div>
  );
}
