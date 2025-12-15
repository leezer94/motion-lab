"use client";

import { FormProvider } from "react-hook-form";
import { useMemo, useState, useEffect } from "react";
import { useLogsFilter } from "../lib/use-logs-filter";
import { useLogsTable } from "../lib/use-logs-table";
import { aggregateLogsByDate, mockLogs } from "../model/logs";
import { LogsFilterForm } from "./logs-filter-form";
import { LogsTable } from "./logs-table";
import { LogsChart } from "./logs-chart";
import { ExcelExportButton } from "./excel-export-button";

/**
 * 로그 페이지 메인 컨텐츠 컴포넌트
 * 필터, 테이블, 차트, Excel 내보내기를 통합
 */
export function LogsPageContent() {
  const { form, watch } = useLogsFilter();
  const filterValues = watch();
  const [isMounted, setIsMounted] = useState(false);

  // 클라이언트에서만 마운트되도록 처리 (Hydration 오류 방지)
  // Next.js에서 Hydration 문제를 해결하기 위한 표준 패턴
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  const { filteredData } = useLogsTable(mockLogs, filterValues);

  const chartData = useMemo(() => {
    return aggregateLogsByDate(filteredData);
  }, [filteredData]);

  // 통계 값들을 useMemo로 계산
  const stats = useMemo(() => {
    return {
      total: filteredData.length,
      success: filteredData.filter((log) => log.status === "success").length,
      failed: filteredData.filter((log) => log.status === "failed").length,
      avgDuration:
        filteredData.length > 0
          ? Math.round(
              filteredData.reduce((sum, log) => sum + log.duration, 0) / filteredData.length,
            )
          : 0,
    };
  }, [filteredData]);

  return (
    <FormProvider {...form}>
      <div className="space-y-6">
        {/* 필터 폼 */}
        <LogsFilterForm />

        {/* 통계 카드 */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">전체 로그</p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {isMounted ? stats.total : "-"}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">성공</p>
            <p className="mt-2 text-2xl font-semibold text-emerald-300">
              {isMounted ? stats.success : "-"}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">실패</p>
            <p className="mt-2 text-2xl font-semibold text-red-300">
              {isMounted ? stats.failed : "-"}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">평균 처리 시간</p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {isMounted ? `${stats.avgDuration}초` : "-"}
            </p>
          </div>
        </div>

        {/* 차트 */}
        {isMounted && chartData.length > 0 && <LogsChart data={chartData} />}

        {/* 테이블 헤더 (Excel 내보내기 버튼 포함) */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-200">
            실행 로그 목록
          </h3>
          <ExcelExportButton logs={filteredData} />
        </div>

        {/* 테이블 */}
        {isMounted ? (
          <LogsTable data={filteredData} />
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
            <div className="text-center text-slate-400">로딩 중...</div>
          </div>
        )}
      </div>
    </FormProvider>
  );
}
