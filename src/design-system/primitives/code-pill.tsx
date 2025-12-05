import type { HTMLAttributes } from "react";
import { cn } from "../utils/cn";

export function CodePill({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <code
      className={cn("rounded-full bg-black/30 px-3 py-1 text-sm text-white/90", className)}
      {...props}
    />
  );
}
