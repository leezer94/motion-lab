"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import { ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/design-system/utils/cn";
import type { AutomationLog } from "../model/logs";

const columns: ColumnDef<AutomationLog>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: (info) => (
      <span className="font-mono text-xs text-slate-400">{info.getValue() as string}</span>
    ),
  },
  {
    accessorKey: "workflowName",
    header: "워크플로 이름",
    cell: (info) => <span className="font-semibold text-white">{info.getValue() as string}</span>,
  },
  {
    accessorKey: "status",
    header: "상태",
    cell: (info) => {
      const status = info.getValue() as string;
      const statusConfig = {
        success: { label: "성공", className: "bg-emerald-500/20 text-emerald-300" },
        failed: { label: "실패", className: "bg-red-500/20 text-red-300" },
        pending: { label: "대기", className: "bg-yellow-500/20 text-yellow-300" },
        running: { label: "실행중", className: "bg-blue-500/20 text-blue-300" },
      };
      const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.success;
      return (
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
            config.className,
          )}
        >
          {config.label}
        </span>
      );
    },
  },
  {
    accessorKey: "level",
    header: "레벨",
    cell: (info) => {
      const level = info.getValue() as string;
      const levelConfig = {
        info: { label: "정보", className: "text-blue-300" },
        warning: { label: "경고", className: "text-yellow-300" },
        error: { label: "오류", className: "text-red-300" },
        debug: { label: "디버그", className: "text-slate-400" },
      };
      const config = levelConfig[level as keyof typeof levelConfig] || levelConfig.info;
      return <span className={cn("text-xs font-medium", config.className)}>{config.label}</span>;
    },
  },
  {
    accessorKey: "recordCount",
    header: "처리 레코드",
    cell: (info) => (
      <span className="text-sm text-slate-300">{(info.getValue() as number).toLocaleString()}</span>
    ),
  },
  {
    accessorKey: "startTime",
    header: "시작 시간",
    cell: (info) => {
      const date = info.getValue() as Date;
      return (
        <span className="text-xs text-slate-400">
          {date.toLocaleString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      );
    },
  },
  {
    accessorKey: "duration",
    header: "소요 시간",
    cell: (info) => {
      const seconds = info.getValue() as number;
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return (
        <span className="text-sm text-slate-300">
          {minutes > 0 ? `${minutes}분 ` : ""}
          {remainingSeconds}초
        </span>
      );
    },
  },
  {
    accessorKey: "triggeredBy",
    header: "실행자",
    cell: (info) => <span className="text-sm text-slate-300">{info.getValue() as string}</span>,
  },
];

type LogsTableProps = {
  data: AutomationLog[];
};

/**
 * TanStack Table을 사용한 로그 테이블 컴포넌트
 */
export function LogsTable({ data }: LogsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-white/10">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200"
                  >
                    {header.column.getCanSort() ? (
                      <button
                        onClick={header.column.getToggleSortingHandler()}
                        className="flex items-center gap-2 hover:text-emerald-300 transition"
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: <ArrowUp className="h-3 w-3" />,
                          desc: <ArrowDown className="h-3 w-3" />,
                        }[header.column.getIsSorted() as string] ?? (
                          <ArrowUpDown className="h-3 w-3 opacity-50" />
                        )}
                      </button>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-400">
                  데이터가 없습니다.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b border-white/5 transition hover:bg-white/5">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-white/10 px-4 py-3">
        <div className="text-xs text-slate-400">
          총 {data.length}개 중{" "}
          {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            data.length,
          )}{" "}
          개 표시
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className={cn(
              "rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white transition",
              "hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed",
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-xs text-slate-300">
            {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className={cn(
              "rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white transition",
              "hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed",
            )}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
