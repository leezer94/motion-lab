"use client";

import { useState } from "react";

export function useTimelineRevealControls() {
  const [stagger, setStagger] = useState(0.18);
  const [initialDelay, setInitialDelay] = useState(0.25);
  const [pulseIntensity, setPulseIntensity] = useState(0.4);

  return {
    stagger,
    setStagger,
    initialDelay,
    setInitialDelay,
    pulseIntensity,
    setPulseIntensity,
  };
}
