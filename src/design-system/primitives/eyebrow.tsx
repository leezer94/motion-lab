import type { HTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../utils/cn";

export interface EyebrowProps extends HTMLAttributes<HTMLParagraphElement> {
  muted?: boolean;
  asChild?: boolean;
}

export function Eyebrow({ className, muted, asChild, ...props }: EyebrowProps) {
  const Component = asChild ? Slot : "p";

  return (
    <Component
      className={cn(
        "text-[0.72rem] uppercase tracking-[0.4em]",
        muted ? "text-muted-foreground" : "text-accent",
        className,
      )}
      {...props}
    />
  );
}
