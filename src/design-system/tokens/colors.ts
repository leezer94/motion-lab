export type MotionLabThemeMode = "light" | "dark";

type ColorToken = {
  light: string;
  dark: string;
};

type MotionLabColorTokens = {
  background: ColorToken;
  surface: ColorToken;
  surfaceMuted: ColorToken;
  border: ColorToken;
  text: ColorToken;
  textMuted: ColorToken;
  accent: ColorToken;
  accentMuted: ColorToken;
  accentForeground: ColorToken;
};

export const motionLabColors: MotionLabColorTokens = {
  background: {
    light: "#f8fafc",
    dark: "#020617",
  },
  surface: {
    light: "#ffffff",
    dark: "#0f172a",
  },
  surfaceMuted: {
    light: "#e2e8f0",
    dark: "#1e1b4b",
  },
  border: {
    light: "rgba(15, 23, 42, 0.1)",
    dark: "rgba(255, 255, 255, 0.15)",
  },
  text: {
    light: "#0f172a",
    dark: "#f8fafc",
  },
  textMuted: {
    light: "rgba(15, 23, 42, 0.7)",
    dark: "rgba(226, 232, 240, 0.75)",
  },
  accent: {
    light: "#4c1d95",
    dark: "#7c3aed",
  },
  accentMuted: {
    light: "rgba(76, 29, 149, 0.15)",
    dark: "rgba(124, 58, 237, 0.2)",
  },
  accentForeground: {
    light: "#f5f3ff",
    dark: "#fdf4ff",
  },
};

export const motionLabColorVars = {
  background: "--ml-color-background",
  surface: "--ml-color-surface",
  surfaceMuted: "--ml-color-surface-muted",
  border: "--ml-color-border",
  text: "--ml-color-text",
  textMuted: "--ml-color-text-muted",
  accent: "--ml-color-accent",
  accentMuted: "--ml-color-accent-muted",
  accentForeground: "--ml-color-accent-foreground",
} as const;

export function getMotionLabColor(mode: MotionLabThemeMode, token: keyof MotionLabColorTokens) {
  return motionLabColors[token][mode];
}
