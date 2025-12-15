import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  automationNavSections,
  getAutomationNavItem,
} from "@/features/automation-nav/model/navigation";
import { LogsPageContent } from "@/features/automation-logs";
import { MemberPageContent } from "@/features/member-management";
import { ExpensePageContent } from "@/features/expense-management";
import { NotificationPageContent } from "@/features/notification-management";

type AutomationRoutePageProps = {
  params: Promise<{
    section: string;
    feature: string;
  }>;
};

export function generateStaticParams() {
  return automationNavSections.flatMap((section) =>
    section.items.map((item) => ({
      section: section.slug,
      feature: item.slug,
    })),
  );
}

export function generateMetadata({ params }: AutomationRoutePageProps): Metadata {
  return {
    title: `Automation · ${params.then((p) => p.feature)}`,
  };
}

export default async function AutomationRoutePage({ params }: AutomationRoutePageProps) {
  const { section, feature } = await params;
  const navItem = getAutomationNavItem(section, feature);

  if (!navItem) {
    notFound();
  }

  // 모니터링 · 로그 페이지인 경우 LogsPageContent 사용
  if (section === "operations" && feature === "logs") {
    return <LogsPageContent />;
  }

  // 회원 관리 페이지인 경우 MemberPageContent 사용
  if (section === "platform" && feature === "members") {
    return <MemberPageContent />;
  }

  // 비용 관리 페이지인 경우 ExpensePageContent 사용
  if (section === "platform" && feature === "expenses") {
    return <ExpensePageContent />;
  }

  // 알림 발송 페이지인 경우 NotificationPageContent 사용
  if (section === "operations" && feature === "notifications") {
    return <NotificationPageContent />;
  }

  // 자동 출석 관리 페이지인 경우 AttendancePageContent 사용
  if (section === "operations" && feature === "attendance") {
    const { AttendancePageContent } = await import("@/features/attendance-management");
    return <AttendancePageContent />;
  }

  // 강의 일정 스케줄링 페이지인 경우 SchedulingPageContent 사용
  if (section === "operations" && feature === "scheduling") {
    const { SchedulingPageContent } = await import("@/features/scheduling-management");
    return <SchedulingPageContent />;
  }

  // 강의 신청 승인 페이지인 경우 ApprovalPageContent 사용
  if (section === "platform" && feature === "approval") {
    const { ApprovalPageContent } = await import("@/features/approval-management");
    return <ApprovalPageContent />;
  }

  // 기본 프로토타입 페이지
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-slate-100 backdrop-blur">
      <p className="text-xs uppercase tracking-[0.4em] text-emerald-200">{navItem.title}</p>
      <h2 className="mt-4 text-3xl font-semibold">{navItem.description}</h2>
      <p className="mt-3 max-w-3xl text-slate-300">
        이 페이지는 &quot;{navItem.title}&quot; 영역에 해당하는 실제 업무 자동화 모듈이 배치될
        자리입니다. 워크플로 카드, 조건 분기, 커넥터 설정 등 shadcn/ui 기반 컴포넌트를 여기서 조합해
        나갈 수 있습니다.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 shadow-inner shadow-black/30"
          >
            <p className="text-xs uppercase tracking-[0.35em] text-emerald-200/80">Prototype</p>
            <h3 className="mt-2 text-lg font-semibold text-white">
              {navItem.title} - 모듈 {index + 1}
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              실제 데이터 바인딩 전까지는 이러한 프로토타입 카드로 인터랙션을 합의하고, 이후 shadcn
              컴포넌트로 교체할 수 있습니다.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
