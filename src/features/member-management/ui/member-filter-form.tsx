"use client";

import { useFormContext } from "react-hook-form";
import { cn } from "@/design-system/utils/cn";
import type { MemberFilterForm } from "../lib/use-member-filter";

/**
 * 멤버 필터 폼 컴포넌트
 */
export function MemberFilterForm() {
  const {
    register,
    reset,
    formState: { isDirty },
  } = useFormContext<MemberFilterForm>();

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-200">필터</h3>
        {isDirty && (
          <button
            type="button"
            onClick={() => reset()}
            className="text-xs text-slate-400 hover:text-white transition"
          >
            초기화
          </button>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-xs font-medium text-slate-300">검색</label>
          <input
            type="text"
            {...register("search")}
            placeholder="이름, 강의명 검색..."
            className={cn(
              "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white",
              "placeholder:text-slate-500 focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/20",
            )}
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium text-slate-300">신청 상태</label>
          <select
            {...register("applicationStatus")}
            className={cn(
              "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white",
              "focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/20",
            )}
          >
            <option value="all">전체</option>
            <option value="pending">대기중</option>
            <option value="approved">승인</option>
            <option value="rejected">거절</option>
            <option value="completed">완료</option>
            <option value="cancelled">취소</option>
          </select>
        </div>
      </div>
    </div>
  );
}
