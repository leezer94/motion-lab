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
    label: "자동화 설계",
    slug: "design",
    items: [
      {
        title: "대시보드",
        description: "전체 처리량과 SLA 현황",
        slug: "dashboard",
        href: `${basePath}/design/dashboard`,
      },
      {
        title: "시나리오 빌더",
        description: "워크플로 단계 설계",
        slug: "scenarios",
        href: `${basePath}/design/scenarios`,
      },
      {
        title: "템플릿 & 버전",
        description: "프로세스 템플릿 관리",
        slug: "templates",
        href: `${basePath}/design/templates`,
      },
    ],
  },
  {
    label: "실행 관리",
    slug: "operations",
    items: [
      {
        title: "트리거 채널",
        description: "폼 · 이메일 · 슬랙 수신",
        slug: "triggers",
        href: `${basePath}/operations/triggers`,
      },
      {
        title: "태스크 인박스",
        description: "예외 처리 & 승인 대기",
        slug: "tasks",
        href: `${basePath}/operations/tasks`,
      },
      {
        title: "모니터링 · 로그",
        description: "실패 시나리오와 알림",
        slug: "logs",
        href: `${basePath}/operations/logs`,
      },
    ],
  },
  {
    label: "연동 · 설정",
    slug: "platform",
    items: [
      {
        title: "시스템 커넥터",
        description: "ERP · 전자결재 · API",
        slug: "connectors",
        href: `${basePath}/platform/connectors`,
      },
      {
        title: "AI 에이전트",
        description: "문서 요약 · 데이터 정제 블록",
        slug: "agents",
        href: `${basePath}/platform/agents`,
      },
      {
        title: "권한 · 통제",
        description: "팀별 역할과 승인 라인",
        slug: "settings",
        href: `${basePath}/platform/settings`,
      },
    ],
  },
];

export function getAutomationNavItem(sectionSlug: string, itemSlug: string) {
  return automationNavSections
    .find((section) => section.slug === sectionSlug)
    ?.items.find((item) => item.slug === itemSlug);
}
