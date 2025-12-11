"use client";

import { Button } from "@design-system";
import { cn } from "@/design-system/utils/cn";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/navigation";
import type { AppLocale } from "@/i18n/routing";
import { Globe } from "@/shared/icons";

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
      <Globe className="h-4 w-4" />
      <span className="ml-2">{buttonText}</span>
    </Button>
  );
}
