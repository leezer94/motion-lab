"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { MotionLivePreview } from "@/widgets/motion-preview";
import { MotionControlPanel, MotionControlSlider } from "@/features/motion-controls";
import { ArrowRight } from "@/shared/icons";
import { useTimelineRevealControls } from "../model/useTimelineRevealControls";

const timelineSteps = [
  {
    title: "Research",
    body: "Audit flows and collect relevant insights.",
  },
  {
    title: "Ideate",
    body: "Sketch variants, run micro-interaction tests.",
  },
  {
    title: "Prototype",
    body: "Build motion prototypes and gather feedback.",
  },
  {
    title: "Ship",
    body: "Polish easing, QA, and roll out the experience.",
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
          <div className="flex items-center justify-between rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm uppercase tracking-[0.3em] text-slate-200">
            <span>Motion roadmap</span>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-white transition hover:border-white"
              onClick={() => setSequenceKey((prev) => prev + 1)}
            >
              Replay
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <motion.div
            key={sequenceKey}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mt-6 flex flex-col gap-4"
          >
            {timelineSteps.map((step, index) => (
              <motion.div
                key={step.title}
                variants={stepVariants}
                className="group relative overflow-hidden rounded-3xl border border-white/15 bg-white/5 p-5 text-left text-slate-100 shadow-[0_20px_60px_rgba(5,6,22,0.45)]"
              >
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
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-sm font-semibold text-white">
                    {(index + 1).toString().padStart(2, "0")}
                  </div>
                  <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                </div>
                <p className="mt-3 text-sm text-slate-300">{step.body}</p>
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
