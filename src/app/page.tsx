"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const demos = [
  {
    title: "Hover springs",
    description: "Subtle lift/rotate animation for buttons or cards.",
    accent: "from-amber-400/30 to-orange-500/20",
  },
  {
    title: "Timeline reveal",
    description: "Elements pop into view with a staggered timeline.",
    accent: "from-indigo-400/30 to-sky-500/20",
  },
  {
    title: "Drag constraints",
    description: "Give components boundaries for tactile interactions.",
    accent: "from-emerald-400/30 to-lime-500/20",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-16 text-zinc-50 sm:px-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-6 text-center sm:text-left"
        >
          <p className="text-sm uppercase tracking-[0.4em] text-zinc-400">
            Framer Motion Lab
          </p>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
            Rapidly prototype delightful motion inside your Next.js app.
          </h1>
          <p className="text-base leading-relaxed text-zinc-300 sm:text-lg">
            This playground ships with Framer Motion so you can try interactions,
            validate easing curves, and copy snippets straight into your
            production features.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:justify-start">
            <Link
              href="https://www.framer.com/motion/"
              className="rounded-full bg-white/10 px-6 py-3 text-sm font-medium uppercase tracking-wide text-white transition hover:bg-white/20"
            >
              Motion Docs
            </Link>
            <Link
              href="https://nextjs.org/docs"
              className="rounded-full border border-white/30 px-6 py-3 text-sm font-medium uppercase tracking-wide text-white/80 transition hover:border-white hover:text-white"
            >
              Next.js Docs
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.15, delayChildren: 0.2 }}
          className="grid gap-6 md:grid-cols-3"
        >
          {demos.map((demo) => (
            <motion.div
              key={demo.title}
              variants={cardVariants}
              whileHover={{
                y: -10,
                rotateX: 4,
                boxShadow: "0px 20px 60px rgba(15, 23, 42, 0.45)",
              }}
              transition={{ type: "spring", stiffness: 180, damping: 16 }}
              className="rounded-3xl border border-white/10 bg-gradient-to-br p-6"
            >
              <div
                className={`mb-6 h-12 w-12 rounded-2xl bg-gradient-to-br ${demo.accent}`}
              />
              <h2 className="text-xl font-semibold">{demo.title}</h2>
              <p className="mt-2 text-sm text-zinc-300">{demo.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center sm:text-left"
        >
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-300">
            Tip
          </p>
          <p className="mt-4 text-lg text-zinc-100">
            Need another motion primitive? Create a component under
            <code className="mx-2 rounded bg-black/30 px-2 py-1 text-sm">
              src/components
            </code>
            and import it here to keep the lab tidy.
          </p>
        </motion.div>
      </div>
    </main>
  );
}
