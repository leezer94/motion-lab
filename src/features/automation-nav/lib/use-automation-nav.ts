"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { automationNavSections } from "../model/navigation";

/**
 * 네비게이션 섹션의 열림/닫힘 상태와 활성 섹션을 관리하는 hook
 */
export function useAutomationNav() {
  const router = useRouter();
  const activeHref = usePathname();
  const [manuallyOpen, setManuallyOpen] = useState<string | undefined>();

  // 현재 활성 아이템이 속한 섹션을 자동으로 찾음
  const derivedLabel = useMemo(() => {
    return (
      automationNavSections.find((section) =>
        section.items.some((item) => activeHref.startsWith(item.href)),
      )?.label ?? automationNavSections[0]?.label
    );
  }, [activeHref]);

  const openSectionLabel = manuallyOpen ?? derivedLabel;

  /**
   * 섹션을 클릭했을 때 첫 번째 아이템으로 이동하고 섹션을 열기
   */
  const handleSectionClick = (sectionLabel: string) => {
    const section = automationNavSections.find((s) => s.label === sectionLabel);
    const firstItem = section?.items[0];

    if (firstItem) {
      router.push(firstItem.href);
    }
    setManuallyOpen(sectionLabel);
  };

  /**
   * 특정 섹션이 열려있는지 확인
   */
  const isSectionOpen = (sectionLabel: string) => {
    return openSectionLabel === sectionLabel;
  };

  return {
    openSectionLabel,
    isSectionOpen,
    handleSectionClick,
  };
}
