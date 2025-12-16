"use client";

import { type ChangeEvent, useState } from "react";
import { motion } from "motion/react";

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
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(event.target.value));
  };

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <label className="group block">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-foreground transition-colors group-hover:text-cyan-400/80">
          {label}
        </span>
        <motion.span
          className="inline-flex items-center justify-center rounded-md bg-cyan-400/10 px-2.5 py-1 text-xs font-mono font-medium text-cyan-400 ring-1 ring-cyan-400/20"
          animate={{
            scale: isDragging ? 1.05 : 1,
            backgroundColor: isDragging ? "rgba(6, 182, 212, 0.15)" : "rgba(6, 182, 212, 0.1)",
          }}
          transition={{ duration: 0.2 }}
        >
          {value.toFixed(2)}
        </motion.span>
      </div>

      <div className="relative">
        {/* Track background */}
        <div className="h-2 w-full rounded-full bg-slate-200/20 dark:bg-slate-700/30" />

        {/* Filled track */}
        <motion.div
          className="absolute top-0 left-0 h-2 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 shadow-lg shadow-cyan-400/30"
          style={{ width: `${percentage}%` }}
          transition={{ duration: isDragging ? 0 : 0.2, ease: "easeOut" }}
        />

        {/* Slider input */}
        <input
          type="range"
          className="absolute top-0 left-0 h-2 w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-cyan-400/50 [&::-webkit-slider-thumb]:ring-2 [&::-webkit-slider-thumb]:ring-cyan-400/50 [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:h-5 [&::-webkit-slider-thumb]:hover:w-5 [&::-webkit-slider-thumb]:active:cursor-grabbing [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:shadow-cyan-400/50 [&::-moz-range-thumb]:ring-2 [&::-moz-range-thumb]:ring-cyan-400/50 [&::-moz-range-thumb]:transition-all [&::-moz-range-thumb]:hover:h-5 [&::-moz-range-thumb]:hover:w-5 [&::-moz-range-thumb]:active:cursor-grabbing"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={handleChange}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
        />
      </div>

      <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground/80 transition-colors group-hover:text-muted-foreground">
        {helper}
      </p>
    </label>
  );
}
