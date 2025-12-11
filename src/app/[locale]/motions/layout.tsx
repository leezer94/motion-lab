"use client";

import type { ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "@/navigation";
import { motionNavSections } from "./index";
import { MotionSidebar, MotionContentPanel } from "@/widgets/motion-shell";
import type { MotionNavListSection } from "@/features/motion-nav";
import { GlobalToolbar } from "@/widgets/global-toolbar";
import { getMotionDemoHrefBySlug } from "@/features/motion-demos";

type MotionLayoutProps = {
  children: ReactNode;
};

export default function MotionLayout({ children }: MotionLayoutProps) {
  const pathname = usePathname();
  const locale = useLocale();
  const layoutTranslations = useTranslations("motionLayout");
  const demoTranslations = useTranslations("demos");
  const normalizedPathname =
    pathname.startsWith(`/${locale}`) && pathname.length > locale.length + 1
      ? pathname.slice(locale.length + 1)
      : pathname;

  const overviewCopy = {
    label: layoutTranslations("overviewLabel"),
    heading: layoutTranslations("overviewHeading"),
    subheading: layoutTranslations("overviewSubheading"),
    ctaLabel: layoutTranslations("backToHome"),
  };

  const sidebarCopy = {
    label: layoutTranslations("sectionLabel"),
    heading: layoutTranslations("heading"),
    subheading: layoutTranslations("subheading"),
  };

  const navSections: MotionNavListSection[] = motionNavSections.map((section) => ({
    key: section.id,
    label: layoutTranslations(`navSections.${section.labelTranslationKey}`),
    items: section.items.map((item) => {
      const href = getMotionDemoHrefBySlug(item.slug);
      return {
        key: item.slug,
        href,
        locale,
        label: demoTranslations(`${item.translationKey}.title`),
        isActive: normalizedPathname === href,
        isAvailable: item.isAvailable,
        comingSoonLabel: layoutTranslations("comingSoon"),
      };
    }),
  }));

  return (
    <div className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <section className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">
              {overviewCopy.label}
            </p>
            <h1 className="text-3xl font-semibold text-foreground">{overviewCopy.heading}</h1>
            <p className="text-base text-muted-foreground">{overviewCopy.subheading}</p>
          </section>
          <GlobalToolbar
            className="sm:justify-end"
            showHomeLink
            homeAriaLabel={overviewCopy.ctaLabel}
          />
        </div>
        <div className="flex flex-col gap-8 lg:flex-row">
          <MotionSidebar copy={sidebarCopy} navSections={navSections} />
          <MotionContentPanel>{children}</MotionContentPanel>
        </div>
      </div>
    </div>
  );
}
