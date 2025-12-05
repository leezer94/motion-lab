import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "../utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "md" | "sm";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const variantMap: Record<ButtonVariant, string> = {
  primary:
    "bg-white/90 text-zinc-900 hover:bg-white hover:text-zinc-950 focus-visible:ring-white/80",
  secondary:
    "border border-white/30 text-white/90 hover:border-white hover:text-white focus-visible:ring-white/40",
  ghost: "text-white/80 hover:text-white hover:bg-white/10 focus-visible:ring-white/20",
};

const sizeMap: Record<ButtonSize, string> = {
  md: "px-6 py-3 text-sm",
  sm: "px-4 py-2 text-xs",
};

export function buttonStyles({
  variant = "primary",
  size = "md",
  fullWidth,
}: Pick<ButtonProps, "variant" | "size" | "fullWidth"> = {}) {
  return cn(
    "inline-flex items-center justify-center rounded-full font-medium uppercase tracking-wide transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
    variantMap[variant],
    sizeMap[size],
    fullWidth && "w-full",
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", fullWidth, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(buttonStyles({ variant, size, fullWidth }), className)}
      {...props}
    />
  );
});
