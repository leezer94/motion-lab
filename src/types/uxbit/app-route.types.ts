// app-route.types.ts
export type FlexDirection = "row" | "row-reverse" | "column" | "column-reverse";
export type FlexWrap = "nowrap" | "wrap" | "wrap-reverse";
export type Justify =
  | "flex-start"
  | "center"
  | "flex-end"
  | "space-between"
  | "space-around"
  | "space-evenly";
export type AlignItems = "stretch" | "flex-start" | "center" | "flex-end" | "baseline";
export type AlignContent =
  | "stretch"
  | "flex-start"
  | "center"
  | "flex-end"
  | "space-between"
  | "space-around";

export type HeightMode = "auto" | "dvh" | "screen";

export type OverflowMode = "visible" | "hidden" | "clip" | "scroll" | "auto";
export type ScrollBehavior = "auto" | "smooth";

export type ScrollSnapType =
  | "none"
  | "x mandatory"
  | "x proximity"
  | "y mandatory"
  | "y proximity"
  | "block mandatory"
  | "block proximity"
  | "inline mandatory"
  | "inline proximity"
  | "both mandatory"
  | "both proximity";

export type SnapAlign = "start" | "center" | "end" | "none";

export type TextAlign = "start" | "end" | "left" | "center" | "right" | "justify";
export type TextTransform = "none" | "capitalize" | "uppercase" | "lowercase";

export type BgSize = "auto" | "cover" | "contain" | string;
export type BgRepeat = "no-repeat" | "repeat" | "repeat-x" | "repeat-y" | string;
export type BgAttachment = "scroll" | "fixed" | "local" | string;
export type BgBlend = "normal" | "multiply" | "screen" | "overlay" | "darken" | "lighten" | string;
