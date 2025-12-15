"use client";

import { useFormContext } from "react-hook-form";
import { cn } from "@/design-system/utils/cn";
import type { LogsFilterForm, LogStatus, LogLevel } from "../model/logs";

/**
 * 로그 필터 폼 컴포넌트
 */
export function LogsFilterForm() {
  const {
    register,
    reset,
    formState: { isDirty },
  } = useFormContext<LogsFilterForm>();

  const statusOptions: { value: LogStatus | "all"; label: string }[] = [
    { value: "all", label: "전체" },
    { value: "success", label: "성공" },
    { value: "failed", label: "실패" },
    { value: "pending", label: "대기" },
    { value: "running", label: "실행중" },
  ];

  const levelOptions: { value: LogLevel | "all"; label: string }[] = [
    { value: "all", label: "전체" },
    { value: "info", label: "정보" },
    { value: "warning", label: "경고" },
    { value: "error", label: "오류" },
    { value: "debug", label: "디버그" },
  ];

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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-2 block text-xs font-medium text-slate-300">워크플로 이름</label>
          <input
            type="text"
            {...register("workflowName")}
            placeholder="검색..."
            className={cn(
              "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white",
              "placeholder:text-slate-500 focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/20",
            )}
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium text-slate-300">상태</label>
          <select
            {...register("status")}
            className={cn(
              "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white",
              "focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/20",
            )}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium text-slate-300">레벨</label>
          <select
            {...register("level")}
            className={cn(
              "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white",
              "focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/20",
            )}
          >
            {levelOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium text-slate-300">시작일</label>
          <input
            type="date"
            {...register("dateFrom")}
            className={cn(
              "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white",
              "focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/20",
            )}
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium text-slate-300">종료일</label>
          <input
            type="date"
            {...register("dateTo")}
            className={cn(
              "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white",
              "focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/20",
            )}
          />
        </div>
      </div>
    </div>
  );
}
