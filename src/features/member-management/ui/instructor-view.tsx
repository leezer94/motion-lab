"use client";

import { useMemo, useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, BookOpen, Users, CheckCircle } from "lucide-react";
import { cn } from "@/design-system/utils/cn";
import type { InstructorApplication } from "../model/members";
import { mockInstructors } from "../model/members";

type InstructorViewProps = {
  filterValues: {
    search: string;
    applicationStatus: string;
  };
};

/**
 * 강의자 뷰 컴포넌트
 * - 개설한 강의 목록
 * - 신청자 관리
 * - 승인/거절 이력
 */
export function InstructorView({ filterValues }: InstructorViewProps) {
  const [activeTab, setActiveTab] = useState<"courses" | "applicants" | "history">("courses");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isMounted, setIsMounted] = useState(false);

  // 클라이언트 마운트 확인
  // Next.js Hydration 문제 해결을 위한 표준 패턴

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 개설한 강의 목록
  const createdCourses = useMemo(() => {
    const allCourses = mockInstructors.flatMap((instructor) =>
      instructor.createdCourses.map((course) => ({
        ...course,
        instructorName: instructor.name,
      })),
    );
    return allCourses
      .filter((course) => !filterValues.search || course.title.includes(filterValues.search))
      .sort((a, b) => a.id.localeCompare(b.id)); // 정렬하여 deterministic하게
  }, [filterValues.search]);

  // 신청자 관리 (대기중인 신청)
  const pendingApplications = useMemo(() => {
    const allApplications: (InstructorApplication & { instructorName: string })[] = [];
    mockInstructors.forEach((instructor) => {
      instructor.applicationHistory
        .filter((app) => app.status === "pending")
        .forEach((app) => {
          allApplications.push({
            ...app,
            instructorName: instructor.name,
          });
        });
    });
    return allApplications
      .filter(
        (app) =>
          (!filterValues.search || app.courseTitle.includes(filterValues.search)) &&
          (filterValues.applicationStatus === "all" ||
            app.status === filterValues.applicationStatus),
      )
      .sort((a, b) => a.id.localeCompare(b.id)); // 정렬하여 deterministic하게
  }, [filterValues]);

  // 승인/거절 이력
  const applicationHistory = useMemo(() => {
    const allApplications: (InstructorApplication & { instructorName: string })[] = [];
    mockInstructors.forEach((instructor) => {
      instructor.applicationHistory
        .filter((app) => app.status !== "pending")
        .forEach((app) => {
          allApplications.push({
            ...app,
            instructorName: instructor.name,
          });
        });
    });
    return allApplications
      .filter(
        (app) =>
          (!filterValues.search || app.courseTitle.includes(filterValues.search)) &&
          (filterValues.applicationStatus === "all" ||
            app.status === filterValues.applicationStatus),
      )
      .sort((a, b) => a.id.localeCompare(b.id)); // 정렬하여 deterministic하게
  }, [filterValues]);

  const coursesColumns: ColumnDef<(typeof createdCourses)[0]>[] = [
    {
      accessorKey: "title",
      header: "강의명",
      cell: (info) => <span className="font-semibold text-white">{info.getValue() as string}</span>,
    },
    {
      accessorKey: "instructorName",
      header: "강의자",
      cell: (info) => <span className="text-sm text-slate-300">{info.getValue() as string}</span>,
    },
    {
      accessorKey: "status",
      header: "상태",
      cell: (info) => {
        const status = info.getValue() as string;
        const statusConfig = {
          recruiting: { label: "모집중", className: "bg-blue-500/20 text-blue-300" },
          ongoing: { label: "진행중", className: "bg-emerald-500/20 text-emerald-300" },
          completed: { label: "완료", className: "bg-slate-500/20 text-slate-300" },
          cancelled: { label: "취소", className: "bg-red-500/20 text-red-300" },
        };
        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.recruiting;
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
      accessorKey: "currentStudents",
      header: "신청 현황",
      cell: (info) => {
        const course = info.row.original;
        return (
          <span className="text-sm text-slate-300">
            {course.currentStudents} / {course.maxStudents}명
          </span>
        );
      },
    },
    {
      accessorKey: "startDate",
      header: "시작일",
      cell: (info) => {
        const date = info.getValue() as Date;
        return <span className="text-xs text-slate-400">{date.toLocaleDateString("ko-KR")}</span>;
      },
    },
  ];

  const applicantsColumns: ColumnDef<(typeof pendingApplications)[0]>[] = [
    {
      accessorKey: "courseTitle",
      header: "강의명",
      cell: (info) => <span className="font-semibold text-white">{info.getValue() as string}</span>,
    },
    {
      accessorKey: "applicantName",
      header: "신청자",
      cell: (info) => <span className="text-sm text-slate-300">{info.getValue() as string}</span>,
    },
    {
      accessorKey: "applicantType",
      header: "유형",
      cell: (info) => {
        const type = info.getValue() as string;
        return (
          <span className="text-xs text-slate-400">{type === "student" ? "학생" : "봉사자"}</span>
        );
      },
    },
    {
      accessorKey: "appliedAt",
      header: "신청일",
      cell: (info) => {
        const date = info.getValue() as Date;
        return <span className="text-xs text-slate-400">{date.toLocaleDateString("ko-KR")}</span>;
      },
    },
    {
      id: "actions",
      header: "처리",
      cell: () => (
        <div className="flex gap-2">
          <button className="rounded-lg bg-emerald-500/20 px-3 py-1.5 text-xs font-medium text-emerald-300 transition hover:bg-emerald-500/30">
            승인
          </button>
          <button className="rounded-lg bg-red-500/20 px-3 py-1.5 text-xs font-medium text-red-300 transition hover:bg-red-500/30">
            거절
          </button>
        </div>
      ),
    },
  ];

  const historyColumns: ColumnDef<(typeof applicationHistory)[0]>[] = [
    {
      accessorKey: "courseTitle",
      header: "강의명",
      cell: (info) => <span className="font-semibold text-white">{info.getValue() as string}</span>,
    },
    {
      accessorKey: "applicantName",
      header: "신청자",
      cell: (info) => <span className="text-sm text-slate-300">{info.getValue() as string}</span>,
    },
    {
      accessorKey: "status",
      header: "처리 결과",
      cell: (info) => {
        const status = info.getValue() as string;
        const statusConfig = {
          approved: { label: "승인", className: "bg-emerald-500/20 text-emerald-300" },
          rejected: { label: "거절", className: "bg-red-500/20 text-red-300" },
        };
        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.approved;
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
      accessorKey: "reviewedAt",
      header: "처리일",
      cell: (info) => {
        const date = info.getValue() as Date | null;
        return (
          <span className="text-xs text-slate-400">
            {date ? date.toLocaleDateString("ko-KR") : "-"}
          </span>
        );
      },
    },
  ];

  const coursesTable = useReactTable({
    data: createdCourses,
    columns: coursesColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
    initialState: { pagination: { pageSize: 10 } },
  });

  const applicantsTable = useReactTable({
    data: pendingApplications,
    columns: applicantsColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
    initialState: { pagination: { pageSize: 10 } },
  });

  const historyTable = useReactTable({
    data: applicationHistory,
    columns: historyColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
    initialState: { pagination: { pageSize: 10 } },
  });

  const renderTable = <TData,>(table: ReturnType<typeof useReactTable<TData>>) => {
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
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={table.getAllColumns().length}
                    className="px-4 py-8 text-center text-slate-400"
                  >
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
        <div className="flex items-center justify-between border-t border-white/10 px-4 py-3">
          <div className="text-xs text-slate-400">
            총 {table.getFilteredRowModel().rows.length}개
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
  };

  return (
    <div className="space-y-6">
      {/* 탭 */}
      <div className="flex gap-2 border-b border-white/10">
        {[
          { id: "courses", label: "개설한 강의", icon: BookOpen },
          { id: "applicants", label: "신청자 관리", icon: Users },
          { id: "history", label: "승인/거절 이력", icon: CheckCircle },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={cn(
              "flex items-center gap-2 px-4 py-3 text-sm font-semibold transition",
              "border-b-2 border-transparent",
              activeTab === tab.id
                ? "border-emerald-400 text-emerald-300"
                : "text-slate-400 hover:text-white",
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* 테이블 */}
      {!isMounted ? (
        <div className="flex min-h-[200px] items-center justify-center text-slate-400">
          로딩 중...
        </div>
      ) : (
        <>
          {activeTab === "courses" && renderTable(coursesTable)}
          {activeTab === "applicants" && renderTable(applicantsTable)}
          {activeTab === "history" && renderTable(historyTable)}
        </>
      )}
    </div>
  );
}
