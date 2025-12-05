"use client";

import { useEffect, useState } from "react";
import { Button } from "@design-system";
import { cn } from "@/design-system/utils/cn";
import { useTheme } from "@/shared/providers/theme-provider";
import { useTranslations } from "next-intl";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const themeToggle = useTranslations("themeToggle");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={className} aria-hidden="true">
        <span className="sr-only">{themeToggle("loadingLabel")}</span>
      </div>
    );
  }

  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn("justify-center min-w-[140px]", className)}
      aria-label={isDark ? themeToggle("switchToLight") : themeToggle("switchToDark")}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <MoonIcon /> : <SunIcon />}
      <span className="ml-2">{isDark ? themeToggle("darkMode") : themeToggle("lightMode")}</span>
    </Button>
  );
}

function SunIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      stroke="currentColor"
      fill="none"
      strokeWidth={1.5}
      className="h-4 w-4"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2m-3.07-7.07-1.41 1.41M6.34 17.66l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      stroke="currentColor"
      fill="none"
      strokeWidth={1.5}
      className="h-4 w-4"
    >
      <path d="M21 14.5A8.5 8.5 0 0 1 9.5 3 6.5 6.5 0 1 0 21 14.5Z" />
    </svg>
  );
}
