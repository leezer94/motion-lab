import { redirect } from "next/navigation";
import { automationNavSections } from "@/features/automation-nav/model/navigation";

export default function AutomationIndexPage() {
  // 첫 번째 섹션의 첫 번째 아이템으로 리다이렉트
  const firstSection = automationNavSections[0];
  const firstItem = firstSection?.items[0];

  if (firstItem) {
    redirect(firstItem.href);
  } else {
    // 폴백: 기본 경로
    redirect("/automation/operations/logs");
  }
}
