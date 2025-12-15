"use client";

import { cn } from "@/design-system/utils/cn";
import type { AutomationNavSection } from "../model/navigation";
import { NavItem } from "./nav-item";

type NavSectionProps = {
  section: AutomationNavSection;
  isOpen: boolean;
  activeHref: string;
  onSectionClick: (sectionLabel: string) => void;
};

/**
 * 네비게이션 섹션 컴포넌트
 * 1뎁스 섹션과 2뎁스 아이템들을 포함하는 아코디언 형태
 */
export function NavSection({ section, isOpen, activeHref, onSectionClick }: NavSectionProps) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/5">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
        onClick={() => onSectionClick(section.label)}
      >
        <span className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-200">
          {section.label}
        </span>
        <span
          className={cn(
            "text-xs text-emerald-200 transition-transform duration-300 ease-in-out",
            isOpen ? "rotate-90" : "",
          )}
        >
          ›
        </span>
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-[600px]" : "max-h-0",
        )}
      >
        <ul className="space-y-2 px-3 pb-3">
          {section.items.map((item) => {
            const isActive = activeHref.startsWith(item.href);
            return <NavItem key={item.slug} item={item} isActive={isActive} />;
          })}
        </ul>
      </div>
    </div>
  );
}
