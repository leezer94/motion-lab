"use client";

import Link from "next/link";
import { cn } from "@/design-system/utils/cn";
import type { AutomationNavItem } from "../model/navigation";

type NavItemProps = {
  item: AutomationNavItem;
  isActive: boolean;
};

/**
 * 네비게이션 아이템 컴포넌트
 * 재사용 가능한 단일 아이템 렌더링
 */
export function NavItem({ item, isActive }: NavItemProps) {
  return (
    <li>
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
}
