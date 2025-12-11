import type { HTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../utils/cn";

export interface CodePillProps extends HTMLAttributes<HTMLElement> {
  asChild?: boolean;
}

export function CodePill({ className, asChild, ...props }: CodePillProps) {
  const Component = asChild ? Slot : "code";

  return (
    <Component
      className={cn(
        "rounded-full border border-border/60 bg-muted px-3 py-1 text-sm text-foreground/90",
        className,
      )}
      {...props}
    />
  );
}
