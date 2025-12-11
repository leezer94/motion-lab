"use client";

import { motion } from "motion/react";
import { demos, DemoCard } from "@/entities/demo";

const containerVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

export function DemoGrid() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.15, delayChildren: 0.2 }}
      className="grid gap-6 md:grid-cols-3"
    >
      {demos.map((demo) => (
        <motion.div key={demo.key} variants={containerVariants}>
          <DemoCard demo={demo} />
        </motion.div>
      ))}
    </motion.div>
  );
}
