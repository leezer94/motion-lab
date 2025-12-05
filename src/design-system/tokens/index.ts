export * from "./colors";

export const motionLabRadii = {
  none: "0px",
  sm: "0.375rem",
  md: "0.75rem",
  lg: "1.5rem",
  xl: "2rem",
} as const;

export const motionLabDurations = {
  fast: 0.2,
  normal: 0.45,
  relaxed: 0.8,
} as const;

export const motionLabEasing = {
  entrance: [0.22, 1, 0.36, 1] as [number, number, number, number],
  exit: [0.4, 0, 0.2, 1] as [number, number, number, number],
} as const;
