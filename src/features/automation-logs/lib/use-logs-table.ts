"use client";

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { useState, useMemo } from "react";
import type { AutomationLog, LogsFilterForm } from "../model/logs";

/**
 * TanStack Table을 사용한 로그 테이블 관리 hook
 */
export function useLogsTable(data: AutomationLog[], filterForm: LogsFilterForm) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // 필터 폼 값에 따라 데이터 필터링
  const filteredData = useMemo(() => {
    return data.filter((log) => {
      if (filterForm.workflowName && !log.workflowName.includes(filterForm.workflowName)) {
        return false;
      }
      if (filterForm.status !== "all" && log.status !== filterForm.status) {
        return false;
      }
      if (filterForm.level !== "all" && log.level !== filterForm.level) {
        return false;
      }
      if (filterForm.dateFrom) {
        const fromDate = new Date(filterForm.dateFrom);
        if (log.startTime < fromDate) return false;
      }
      if (filterForm.dateTo) {
        const toDate = new Date(filterForm.dateTo);
        toDate.setHours(23, 59, 59, 999);
        if (log.startTime > toDate) return false;
      }
      return true;
    });
  }, [data, filterForm]);

  const table = useReactTable({
    data: filteredData,
    columns: [] as ColumnDef<AutomationLog>[], // columns는 컴포넌트에서 정의
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return {
    table,
    filteredData,
  };
}
