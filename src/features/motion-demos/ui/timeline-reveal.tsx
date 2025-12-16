"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { MotionLivePreview } from "@/widgets/motion-preview";
import { MotionControlPanel, MotionControlSlider } from "@/features/motion-controls";
import { ArrowRight, Rocket } from "@/shared/icons";
import { useTimelineRevealControls } from "../model/use-timeline-reveal-controls";

const timelineSteps = [
  {
    title: "Research",
    body: "Audit flows and collect relevant insights.",
    icon: "🔍",
  },
  {
    title: "Ideate",
    body: "Sketch variants, run micro-interaction tests.",
    icon: "💡",
  },
  {
    title: "Prototype",
    body: "Build motion prototypes and gather feedback.",
    icon: "⚡",
  },
  {
    title: "Ship",
    body: "Polish easing, QA, and roll out the experience.",
    icon: "🚀",
  },
];

export function TimelineReveal() {
  const { stagger, setStagger, initialDelay, setInitialDelay, pulseIntensity, setPulseIntensity } =
    useTimelineRevealControls();
  const [sequenceKey, setSequenceKey] = useState(0);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: initialDelay,
      },
    },
  };

  const stepVariants = {
    hidden: { opacity: 0, y: 32, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring" as const, stiffness: 220, damping: 28 },
    },
  };

  const hoverVariants = {
    rest: { scale: 1, y: 0 },
    hover: { scale: 1.02, y: -4 },
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
      <MotionLivePreview
        label="Timeline reveal"
        contentClassName="flex-col items-stretch gap-6 p-6"
        footer={
          <p>
            Hover the CTA to replay the sequence, or fine-tune the reveal rhythm to match your
            product story.
          </p>
        }
      >
        <div className="w-full max-w-xl">
          <div className="flex items-center justify-between rounded-full border border-white/10 bg-gradient-to-r from-white/10 to-white/5 px-4 py-2.5 text-sm uppercase tracking-[0.3em] text-slate-200 backdrop-blur-sm">
            <span className="flex items-center gap-2">
              <Rocket className="h-4 w-4 text-cyan-400" />
              Motion roadmap
            </span>
            <motion.button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white transition-all hover:border-cyan-400/50 hover:bg-cyan-400/10 hover:text-cyan-200"
              onClick={() => setSequenceKey((prev) => prev + 1)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Replay
              <ArrowRight className="h-3.5 w-3.5" />
            </motion.button>
          </div>
          <motion.div
            key={sequenceKey}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative mt-8 flex flex-col gap-4"
          >
            {/* Timeline connector line */}
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400/30 via-sky-400/20 to-transparent" />

            {timelineSteps.map((step, index) => (
              <motion.div
                key={step.title}
                variants={stepVariants}
                initial="rest"
                whileHover="hover"
                className="group relative z-10 overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-white/5 to-white/[0.02] p-5 text-left text-slate-100 shadow-[0_20px_60px_rgba(5,6,22,0.45)] backdrop-blur-sm transition-all duration-300 hover:border-cyan-400/30 hover:shadow-[0_25px_70px_rgba(6,182,212,0.25)]"
              >
                {/* Animated gradient border */}
                <motion.span
                  className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400/70 via-sky-400/50 to-indigo-400/40"
                  layoutId={`timeline-progress-${index}`}
                  animate={{ opacity: pulseIntensity }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 1.2 + index * 0.15,
                  }}
                />

                {/* Hover glow effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-cyan-400/0 via-sky-400/0 to-indigo-400/0 opacity-0 transition-opacity duration-300 group-hover:opacity-10"
                  initial={false}
                />

                <div className="relative flex items-start gap-4">
                  {/* Timeline dot */}
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-md" />
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-sky-400/10 text-base font-semibold text-white shadow-lg ring-2 ring-cyan-400/20">
                      <span className="text-lg">{step.icon}</span>
                    </div>
                    <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-cyan-400/60 blur-sm" />
                  </div>

                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-cyan-400/80">
                        {(index + 1).toString().padStart(2, "0")}
                      </span>
                      <h3 className="text-lg font-semibold text-white transition-colors group-hover:text-cyan-200">
                        {step.title}
                      </h3>
                    </div>
                    <p className="mt-2.5 text-sm leading-relaxed text-slate-300/90 transition-colors group-hover:text-slate-200">
                      {step.body}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </MotionLivePreview>
      <MotionControlPanel
        title="Sequence controls"
        description="Dial in how quickly steps follow each other and how much energy the accents carry."
      >
        <MotionControlSlider
          label="Stagger"
          helper="Time between each step reveal"
          min={0.05}
          max={0.5}
          step={0.01}
          value={stagger}
          onChange={setStagger}
        />
        <MotionControlSlider
          label="Initial delay"
          helper="Delay before the first card appears"
          min={0}
          max={0.6}
          step={0.01}
          value={initialDelay}
          onChange={setInitialDelay}
        />
        <MotionControlSlider
          label="Pulse intensity"
          helper="Glow strength across the timeline"
          min={0}
          max={1}
          step={0.05}
          value={pulseIntensity}
          onChange={setPulseIntensity}
        />
      </MotionControlPanel>
    </div>
  );
}
