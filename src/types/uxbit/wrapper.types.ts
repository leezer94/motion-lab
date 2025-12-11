// wrapper.types.ts
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

export type BgSize = "auto" | "cover" | "contain" | string;
export type BgRepeat = "no-repeat" | "repeat" | "repeat-x" | "repeat-y" | string;
export type BgAttachment = "scroll" | "fixed" | "local" | string;
export type BgBlend = "normal" | "multiply" | "screen" | "overlay" | "darken" | "lighten" | string;
