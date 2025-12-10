// button.types.ts

/** 시각 스타일(틀) */
export type ButtonVariant = "primary" | "secondary" | "tertiary";

/** 컨테이너 사이즈 토큰 */
export type ButtonSize = "sm" | "md" | "lg";

/** form 동작 타입 */
export type ButtonNativeType = "button" | "submit" | "reset";

/** 라벨 폰트 패밀리 토큰 */
export type ButtonTextFamilyToken =
  | "system"
  | "pretendard"
  | "paperlogy"
  | "clash-display"
  | "climate-crisis";

/** 라벨 폰트 사이즈 토큰 */
export type ButtonTextSizeToken = "sm" | "md" | "lg" | "xl";

/** 라벨 폰트 웨이트 토큰 */
export type ButtonTextWeightToken = "regular" | "medium" | "semibold" | "bold" | "black";

export interface ButtonClickDetail {
  originalEvent: MouseEvent;
}

export interface ButtonToggleDetail {
  pressed: boolean;
}
