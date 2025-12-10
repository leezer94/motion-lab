"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/design-system/utils/cn";
import { MotionLivePreview } from "../../_components/preview/motion-live-preview";
import { MotionControlPanel } from "../../_components/controls/motion-control-panel";
import { MotionControlSlider } from "../../_components/controls/motion-control-slider";
import { ArrowRight, Rocket } from "@/shared/icons";

const BUTTON_HEIGHT = 64;
const REST_WIDTH = 260;
const MIN_WIDTH = BUTTON_HEIGHT + 6;

export function AdaptiveHoverMorph() {
  const [morphDepth, setMorphDepth] = useState(0.75);
  const [glowStrength, setGlowStrength] = useState(0.6);
  const [isHovered, setIsHovered] = useState(false);

  const collapsedWidth = useMemo(() => {
    const delta = REST_WIDTH - MIN_WIDTH;
    return REST_WIDTH - morphDepth * delta;
  }, [morphDepth]);

  const glowShadow = useMemo(() => {
    const intensity = 0.2 + glowStrength * 0.45;
    return `0 25px 55px rgba(14, 165, 233, ${intensity})`;
  }, [glowStrength]);

  const idleShadow = "0 20px 50px rgba(15,23,42,0.35)";

  const footerMetrics = (
    <dl className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <dt className="text-muted-foreground">Collapsed width</dt>
        <dd className="font-semibold text-foreground">{Math.round(collapsedWidth)}px</dd>
      </div>
      <div>
        <dt className="text-muted-foreground">Glow intensity</dt>
        <dd className="font-semibold text-foreground">{(glowStrength * 100).toFixed(0)}%</dd>
      </div>
    </dl>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
      <MotionLivePreview
        footer={
          <p>
            Pill CTA morphs into a circular icon-only affordance once the pointer hovers, signaling
            a high-focus interaction.
          </p>
        }
      >
        <MorphingButton
          isHovered={isHovered}
          collapsedWidth={collapsedWidth}
          glowShadow={glowShadow}
          idleShadow={idleShadow}
          onHoverChange={setIsHovered}
        />
      </MotionLivePreview>
      <MotionControlPanel
        title="Tune interaction"
        description="Adjust morph depth and glow strength to match your brand rhythm."
        footer={footerMetrics}
      >
        <MotionControlSlider
          label="Morph depth"
          helper="Controls how compact the button becomes on hover."
          min={0.2}
          max={1}
          step={0.05}
          value={morphDepth}
          onChange={setMorphDepth}
        />
        <MotionControlSlider
          label="Glow strength"
          helper="Amplify the focus ring and drop shadow during hover."
          min={0}
          max={1}
          step={0.05}
          value={glowStrength}
          onChange={setGlowStrength}
        />
      </MotionControlPanel>
    </div>
  );
}

type MorphingButtonProps = {
  isHovered: boolean;
  collapsedWidth: number;
  glowShadow: string;
  idleShadow: string;
  onHoverChange: (next: boolean) => void;
};

function MorphingButton({
  isHovered,
  collapsedWidth,
  glowShadow,
  idleShadow,
  onHoverChange,
}: MorphingButtonProps) {
  return (
    <motion.button
      type="button"
      onHoverStart={() => onHoverChange(true)}
      onHoverEnd={() => onHoverChange(false)}
      whileTap={{ scale: 0.95 }}
      animate={{
        width: isHovered ? collapsedWidth : REST_WIDTH,
        borderRadius: isHovered ? BUTTON_HEIGHT / 2 : 999,
        boxShadow: isHovered ? glowShadow : idleShadow,
      }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      className={cn(
        "relative flex h-[64px] items-center justify-center overflow-hidden rounded-full border border-cyan-400/40",
        "bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-500 text-base font-semibold uppercase tracking-wide text-white",
      )}
    >
      <motion.span
        className="absolute inset-0 z-0 bg-white/20 blur-2xl"
        animate={{ opacity: isHovered ? 0.4 : 0.2 }}
        transition={{ duration: 0.4 }}
      />
      <motion.span
        className="relative z-10 flex items-center gap-2"
        animate={{
          opacity: isHovered ? 0 : 1,
          y: isHovered ? -12 : 0,
        }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      >
        <span>Launch</span>
        <ArrowRight className="h-4 w-4" />
      </motion.span>
      <motion.span
        className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-900"
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1 : 0.4,
        }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
      >
        <Rocket className="h-4 w-4" />
      </motion.span>
    </motion.button>
  );
}
