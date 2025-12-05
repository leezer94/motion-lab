import type { HTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../utils/cn";

type CardTone = "frosted" | "glass" | "solid";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  tone?: CardTone;
  padding?: "md" | "lg";
  interactive?: boolean;
  asChild?: boolean;
}

const toneMap: Record<CardTone, string> = {
  frosted: "bg-card/90 border-border/60",
  glass: "bg-muted/80 border-border/40 backdrop-blur-xl",
  solid: "bg-card text-foreground border-border",
};

const paddingMap = {
  md: "p-6",
  lg: "p-8",
};

export function Card({
  tone = "frosted",
  padding = "md",
  interactive,
  className,
  asChild,
  ...props
}: CardProps) {
  const Component = asChild ? Slot : "div";

  return (
    <Component
      className={cn(
        "rounded-3xl border text-foreground transition will-change-transform",
        toneMap[tone],
        paddingMap[padding],
        interactive &&
          "hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(15,23,42,0.35)] dark:hover:shadow-[0_25px_60px_rgba(2,6,23,0.65)] motion-safe:duration-300",
        className,
      )}
      {...props}
    />
  );
}
