import type { HTMLAttributes } from "react";
import { cn } from "../utils/cn";

type CardTone = "frosted" | "glass" | "solid";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  tone?: CardTone;
  padding?: "md" | "lg";
  interactive?: boolean;
}

const toneMap: Record<CardTone, string> = {
  frosted: "bg-white/[0.08] border-white/10",
  glass: "bg-gradient-to-br from-white/5 to-transparent border-white/5",
  solid: "bg-white text-zinc-900 border-white/70",
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
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border transition will-change-transform",
        toneMap[tone],
        paddingMap[padding],
        interactive &&
          "hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10 motion-safe:duration-300",
        className,
      )}
      {...props}
    />
  );
}
