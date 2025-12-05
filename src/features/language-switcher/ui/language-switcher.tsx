"use client";

import { Button } from "@design-system";
import { cn } from "@/design-system/utils/cn";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/navigation";
import type { AppLocale } from "@/i18n/routing";

export function LanguageSwitcher({ className }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = useLocale() as AppLocale;
  const languageSwitcher = useTranslations("languageSwitcher");

  const nextLocale: AppLocale = currentLocale === "ko" ? "en" : "ko";
  const buttonText =
    currentLocale === "ko" ? languageSwitcher("korean") : languageSwitcher("english");
  const ariaLabel =
    nextLocale === "ko" ? languageSwitcher("switchToKorean") : languageSwitcher("switchToEnglish");

  const handleToggle = () => {
    const targetPath = pathname ?? "/";
    router.replace(targetPath, { locale: nextLocale });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn("justify-center min-w-[120px]", className)}
      aria-label={ariaLabel}
      onClick={handleToggle}
    >
      <GlobeIcon />
      <span className="ml-2">{buttonText}</span>
    </Button>
  );
}

function GlobeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="h-4 w-4"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.5 3.5 2.5 14 0 18" />
      <path d="M12 3c-2.5 3.5-2.5 14 0 18" />
    </svg>
  );
}
