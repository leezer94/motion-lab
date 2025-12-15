"use client";

import { usePathname } from "next/navigation";
import { automationNavSections } from "../model/navigation";
import { useAutomationNav } from "../lib/use-automation-nav";
import { SidebarHeader } from "./sidebar-header";
import { NavSection } from "./nav-section";

/**
 * Automation 사이드바 컴포넌트
 * 네비게이션 섹션과 아이템들을 렌더링
 */
export function AutomationSidebar() {
  const activeHref = usePathname();
  const { isSectionOpen, handleSectionClick } = useAutomationNav();

  return (
    <aside className="w-[320px] border-r border-white/5 p-8">
      <SidebarHeader />
      <nav className="space-y-4">
        {automationNavSections.map((section) => (
          <NavSection
            key={section.label}
            section={section}
            isOpen={isSectionOpen(section.label)}
            activeHref={activeHref}
            onSectionClick={handleSectionClick}
          />
        ))}
      </nav>
    </aside>
  );
}
