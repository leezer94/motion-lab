"use client";

import { useEffect, useState } from "react";
import { Button } from "@design-system";
import { cn } from "@/design-system/utils/cn";
import { useTheme } from "@/shared/providers/theme-provider";
import { useTranslations } from "next-intl";
import { Sun, Moon } from "@/shared/icons";

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
      {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      <span className="ml-2">{isDark ? themeToggle("darkMode") : themeToggle("lightMode")}</span>
    </Button>
  );
}
