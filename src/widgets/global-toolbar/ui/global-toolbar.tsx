"use client";

import Link from "next/link";
import { cn } from "@/design-system/utils/cn";
import { ThemeToggle } from "@/features/theme-toggle";
import { LanguageSwitcher } from "@/features/language-switcher";
import { Home } from "@/shared/icons";

type GlobalToolbarProps = {
  className?: string;
  showHomeLink?: boolean;
  homeHref?: string;
  homeAriaLabel?: string;
};

export function GlobalToolbar({
  className,
  showHomeLink = false,
  homeHref = "/",
  homeAriaLabel = "Back to home",
}: GlobalToolbarProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-end",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-center gap-2">
        <ThemeToggle className="min-w-[140px]" />
        <LanguageSwitcher className="min-w-[120px]" />
      </div>
      {showHomeLink ? (
        <Link
          href={homeHref}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/80 text-foreground transition-colors hover:border-primary/40 hover:text-primary"
          aria-label={homeAriaLabel}
        >
          <Home className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  );
}
