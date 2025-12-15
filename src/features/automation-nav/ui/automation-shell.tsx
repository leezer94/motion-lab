"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";
import { cn } from "@/design-system/utils/cn";
import { automationNavSections } from "../model/navigation";

type AutomationShellProps = {
  children: ReactNode;
};

export function AutomationShell({ children }: AutomationShellProps) {
  const activeHref = usePathname();

  const activeItem = useMemo(() => {
    return automationNavSections
      .flatMap((section) => section.items)
      .find((item) => activeHref.startsWith(item.href));
  }, [activeHref]);

  return (
    <div className="mx-auto flex min-h-screen max-w-[1400px] rounded-[32px] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 shadow-[0_40px_120px_rgba(2,6,23,0.65)]">
      <AutomationSidebar activeHref={activeHref} />
      <section className="flex flex-1 flex-col border-l border-white/5">
        <AutomationHeader activeTitle={activeItem?.title ?? "대시보드"} />
        <main className="flex-1 overflow-y-auto px-10 py-8">{children}</main>
      </section>
    </div>
  );
}

type AutomationSidebarProps = {
  activeHref: string;
};

function AutomationSidebar({ activeHref }: AutomationSidebarProps) {
  const [manuallyOpen, setManuallyOpen] = useState<string | undefined>();

  const derivedLabel =
    automationNavSections.find((section) =>
      section.items.some((item) => activeHref.startsWith(item.href)),
    )?.label ?? automationNavSections[0]?.label;

  const openSectionLabel = manuallyOpen ?? derivedLabel;

  return (
    <aside className="w-[320px] border-r border-white/5 p-8">
      <div className="mb-8 flex flex-col gap-1">
        <p className="text-sm font-semibold uppercase tracking-[0.6em] text-emerald-200/80">
          Automation
        </p>
        <h2 className="text-2xl font-semibold text-white">업무 자동화 허브</h2>
        <p className="text-sm text-slate-400">설계·실행·연동을 한 번에 관리하세요.</p>
      </div>
      <nav className="space-y-4">
        {automationNavSections.map((section) => {
          const isOpen = openSectionLabel === section.label;
          const defaultHref = section.items[0]?.href;
          return (
            <div key={section.label} className="rounded-2xl border border-white/5 bg-white/5">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                onClick={() => {
                  setManuallyOpen((prev) => (prev === section.label ? undefined : section.label));
                }}
              >
                <span className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-200">
                  {section.label}
                </span>
                {defaultHref ? (
                  <Link
                    href={defaultHref}
                    onClick={(event) => event.stopPropagation()}
                    className="text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-200/80 underline-offset-4 hover:text-emerald-100 hover:underline"
                  >
                    바로가기
                  </Link>
                ) : null}
                <span
                  className={cn("text-xs text-emerald-200 transition", isOpen ? "rotate-90" : "")}
                >
                  ›
                </span>
              </button>
              <div
                className={cn(
                  "overflow-hidden transition-all",
                  isOpen ? "max-h-[600px]" : "max-h-0",
                )}
              >
                <ul className="space-y-2 px-3 pb-3">
                  {section.items.map((item) => {
                    const isActive = activeHref.startsWith(item.href);
                    return (
                      <li key={item.slug}>
                        <Link
                          href={item.href}
                          className={cn(
                            "block rounded-2xl border px-4 py-3 text-left transition",
                            isActive
                              ? "border-emerald-300/60 bg-emerald-300/10 text-white shadow-md shadow-emerald-300/30"
                              : "border-white/5 bg-transparent text-slate-300 hover:border-white/20 hover:bg-white/10 hover:text-white",
                          )}
                        >
                          <p className="text-sm font-semibold">{item.title}</p>
                          <p className="text-xs text-slate-400">{item.description}</p>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

function AutomationHeader({ activeTitle }: { activeTitle: string }) {
  return (
    <header className="flex flex-col gap-4 border-b border-white/5 px-10 py-6 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-200">
          운영 현황
        </p>
        <h1 className="text-3xl font-semibold">{activeTitle}</h1>
        <p className="text-sm text-slate-400">
          헤더에 생성/배포 액션 및 전역 검색이 추가될 예정입니다.
        </p>
      </div>
      <div className="flex gap-3">
        <button className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-white transition hover:border-white/40 hover:bg-white/10">
          실시간 로그
        </button>
        <button className="rounded-2xl bg-emerald-400 px-5 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-emerald-400/40 transition hover:bg-emerald-300">
          새 워크플로
        </button>
      </div>
    </header>
  );
}
