"use client";

import type { ReactNode } from "react";
import { useActiveNavItem } from "../lib/use-active-nav-item";
import { AutomationSidebar } from "./automation-sidebar";
import { AutomationHeader } from "./automation-header";

type AutomationShellProps = {
  children: ReactNode;
};

/**
 * Automation Shell 컴포넌트
 * 사이드바와 메인 컨텐츠 영역을 포함하는 레이아웃 컨테이너
 */
export function AutomationShell({ children }: AutomationShellProps) {
  const activeItem = useActiveNavItem();

  return (
    <div className="mx-auto flex min-h-screen max-w-[1400px] rounded-[32px] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 shadow-[0_40px_120px_rgba(2,6,23,0.65)]">
      <AutomationSidebar />
      <section className="flex flex-1 flex-col border-l border-white/5">
        <AutomationHeader activeTitle={activeItem?.title ?? "대시보드"} />
        <main className="flex-1 overflow-y-auto px-10 py-8">{children}</main>
      </section>
    </div>
  );
}
