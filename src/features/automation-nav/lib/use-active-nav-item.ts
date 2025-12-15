import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { automationNavSections, type AutomationNavItem } from "../model/navigation";

/**
 * 현재 경로에 해당하는 활성 네비게이션 아이템을 계산하는 hook
 */
export function useActiveNavItem(): AutomationNavItem | undefined {
  const activeHref = usePathname();

  return useMemo(() => {
    return automationNavSections
      .flatMap((section) => section.items)
      .find((item) => activeHref.startsWith(item.href));
  }, [activeHref]);
}
