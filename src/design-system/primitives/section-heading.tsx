import type { HTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../utils/cn";

type HeadingTag = "h1" | "h2" | "h3";

export interface SectionHeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  size?: "lg" | "xl";
  as?: HeadingTag;
  asChild?: boolean;
}

const sizeMap = {
  lg: "text-3xl sm:text-4xl",
  xl: "text-4xl sm:text-5xl",
};

export function SectionHeading({
  className,
  size = "lg",
  as = "h2",
  asChild,
  ...props
}: SectionHeadingProps) {
  const Component = asChild ? Slot : as;

  return (
    <Component
      className={cn("font-semibold leading-tight text-foreground", sizeMap[size], className)}
      {...props}
    />
  );
}
