import type { HTMLAttributes } from "react";
import { cn } from "../utils/cn";

export interface EyebrowProps extends HTMLAttributes<HTMLParagraphElement> {
  muted?: boolean;
}

export function Eyebrow({ className, muted, ...props }: EyebrowProps) {
  return (
    <p
      className={cn(
        "text-[0.72rem] uppercase tracking-[0.4em]",
        muted ? "text-zinc-500" : "text-zinc-300",
        className,
      )}
      {...props}
    />
  );
}
