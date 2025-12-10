// typography.types.ts

// ===== Variant / Align =====

export type Variant = "h1" | "h2" | "h3" | "p" | "span";

export type Align = "left" | "center" | "right" | "justify";

// 색상 토큰은 우선 string (디자인 토큰으로 교체 가능)
export type Color = string;
export type HighlightColor = string;

// ===== Font Family Tokens =====
// DsTypography에서 쓰던 FAMILY_MAP 기준으로 토큰 정규화
export const FONT_FAMILY = [
  "system",
  "pretendard",
  "paperlogy",
  "clash-display",
  "climate-crisis",
] as const;

export type FontFamily = (typeof FONT_FAMILY)[number];

export const FAMILY_MAP: Record<FontFamily, string> = {
  paperlogy:
    '"Paperlogy", Pretendard, system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif',
  "clash-display":
    '"Clash Display", "Inter", system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif',
  "climate-crisis":
    '"Climate Crisis", Pretendard, system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif',
  pretendard:
    'Pretendard, system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif',
  system:
    'system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif',
};

// ===== Font Size Tokens =====
// Stencil 컴포넌트에서 사용하는 fontSize 토큰

export const FONT_SIZE_KEYS = ["xs", "sm", "md", "lg", "xl", "xxl"] as const;

export type FontSize = (typeof FONT_SIZE_KEYS)[number];

export const FONT_SIZE: Record<FontSize, string> = {
  xs: "0.75rem",
  sm: "0.875rem",
  md: "1rem",
  lg: "1.125rem",
  xl: "1.25rem",
  xxl: "1.5rem",
};

// ===== Typing Effect Tokens =====

export const TYPING_UNIT = ["char", "word"] as const;

export type TypingUnit = (typeof TYPING_UNIT)[number];
