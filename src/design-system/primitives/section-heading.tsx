import type { HTMLAttributes } from "react";
import { cn } from "../utils/cn";

type HeadingTag = "h1" | "h2" | "h3";

export interface SectionHeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  size?: "lg" | "xl";
  as?: HeadingTag;
}

const sizeMap = {
  lg: "text-3xl sm:text-4xl",
  xl: "text-4xl sm:text-5xl",
};

export function SectionHeading({
  className,
  size = "lg",
  as = "h2",
  ...props
}: SectionHeadingProps) {
  const Component = as;
  return (
    <Component
      className={cn("font-semibold leading-tight text-white", sizeMap[size], className)}
      {...props}
    />
  );
}
