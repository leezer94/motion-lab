"use client";

import { cn } from "@/design-system/utils/cn";
import type { MemberRole } from "../model/members";

type MemberTabsProps = {
  activeRole: MemberRole | "all";
  onRoleChange: (role: MemberRole | "all") => void;
};

/**
 * 멤버 역할 탭 컴포넌트
 */
export function MemberTabs({ activeRole, onRoleChange }: MemberTabsProps) {
  const roles: { value: MemberRole | "all"; label: string; count: number }[] = [
    { value: "all", label: "전체", count: 100 },
    { value: "student", label: "학생", count: 50 },
    { value: "instructor", label: "강의자", count: 15 },
    { value: "volunteer", label: "봉사자", count: 35 },
  ];

  return (
    <div className="flex gap-2 border-b border-white/10">
      {roles.map((role) => (
        <button
          key={role.value}
          onClick={() => onRoleChange(role.value)}
          className={cn(
            "relative px-4 py-3 text-sm font-semibold transition",
            "border-b-2 border-transparent",
            activeRole === role.value
              ? "border-emerald-400 text-emerald-300"
              : "text-slate-400 hover:text-white",
          )}
        >
          {role.label}
          <span className="ml-2 text-xs opacity-70">({role.count})</span>
        </button>
      ))}
    </div>
  );
}
