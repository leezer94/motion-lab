"use client";

import { Link } from "@/navigation";
import { ThemeToggle } from "@/features/theme-toggle";
import { LanguageSwitcher } from "@/features/language-switcher";

type MotionOverviewHeaderProps = {
  copy: {
    label: string;
    heading: string;
    subheading: string;
    ctaLabel: string;
  };
};

export function MotionOverviewHeader({ copy }: MotionOverviewHeaderProps) {
  return (
    <header className="flex flex-col gap-4 rounded-3xl border border-border/60 bg-card/70 px-6 py-5 shadow-[0_25px_60px_rgba(15,23,42,0.12)] lg:flex-row lg:items-center lg:justify-between">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          {copy.label}
        </p>
        <h1 className="text-2xl font-semibold leading-tight">{copy.heading}</h1>
        <p className="text-sm text-muted-foreground">{copy.subheading}</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <div className="flex w-full items-center justify-between gap-3 rounded-2xl border border-border/60 bg-background/80 px-4 py-3 sm:w-auto sm:justify-end">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-2xl border border-border/80 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary"
        >
          {copy.ctaLabel}
        </Link>
      </div>
    </header>
  );
}
