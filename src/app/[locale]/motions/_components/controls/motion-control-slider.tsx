"use client";

import type { ChangeEvent } from "react";

type MotionControlSliderProps = {
  label: string;
  helper: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
};

export function MotionControlSlider({
  label,
  helper,
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.1,
}: MotionControlSliderProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(event.target.value));
  };

  return (
    <label className="block">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-xs text-muted-foreground">{value.toFixed(2)}</span>
      </div>
      <input
        type="range"
        className="mt-3 w-full accent-cyan-400"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={handleChange}
      />
      <p className="mt-2 text-xs text-muted-foreground">{helper}</p>
    </label>
  );
}
