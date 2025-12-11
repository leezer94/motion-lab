"use client";

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
  const themeToggle = useTranslations("themeToggle");
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
