import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "md" | "sm";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  asChild?: boolean;
}

const variantMap: Record<ButtonVariant, string> = {
  primary: "bg-accent text-accent-foreground hover:bg-accent/90 focus-visible:ring-accent/40",
  secondary: "border border-border text-foreground hover:bg-card focus-visible:ring-border/60",
  ghost: "text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:ring-border/40",
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
    "inline-flex items-center justify-center rounded-full font-medium uppercase tracking-wide transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    variantMap[variant],
    sizeMap[size],
    fullWidth && "w-full",
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", fullWidth, asChild, ...props },
  ref,
) {
  const Component = asChild ? Slot : "button";

  return (
    <Component
      ref={ref}
      className={cn(buttonStyles({ variant, size, fullWidth }), className)}
      {...props}
    />
  );
});
