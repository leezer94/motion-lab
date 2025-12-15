export type AutomationNavItem = {
  title: string;
  description: string;
  slug: string;
  href: string;
};

export type AutomationNavSection = {
  label: string;
  slug: string;
  items: AutomationNavItem[];
};

const basePath = "/automation";

export const automationNavSections: AutomationNavSection[] = [
  {
    label: "실행 관리",
    slug: "operations",
    items: [
      {
        title: "모니터링 · 로그",
        description: "실패 시나리오와 알림",
        slug: "logs",
        href: `${basePath}/operations/logs`,
      },
      {
        title: "알림 발송",
        description: "메일 · SMS 스케줄링 및 템플릿 관리",
        slug: "notifications",
        href: `${basePath}/operations/notifications`,
      },
      {
        title: "자동 출석 관리",
        description: "QR 코드 · GPS 기반 출석 체크 및 관리",
        slug: "attendance",
        href: `${basePath}/operations/attendance`,
      },
      {
        title: "강의 일정 스케줄링",
        description: "강의 일정 자동 매칭 및 충돌 관리",
        slug: "scheduling",
        href: `${basePath}/operations/scheduling`,
      },
    ],
  },
  {
    label: "연동 · 설정",
    slug: "platform",
    items: [
      {
        title: "회원 관리",
        description: "학생 · 강의자 · 봉사자 관리",
        slug: "members",
        href: `${basePath}/platform/members`,
      },
      {
        title: "비용 관리",
        description: "강의자 비용 신청 및 관리",
        slug: "expenses",
        href: `${basePath}/platform/expenses`,
      },
      {
        title: "강의 신청 승인",
        description: "자동 승인 워크플로우 및 대기자 관리",
        slug: "approval",
        href: `${basePath}/platform/approval`,
      },
    ],
  },
];

export function getAutomationNavItem(sectionSlug: string, itemSlug: string) {
  return automationNavSections
    .find((section) => section.slug === sectionSlug)
    ?.items.find((item) => item.slug === itemSlug);
}
