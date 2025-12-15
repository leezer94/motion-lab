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
import { ChevronLeft, ChevronRight, BookOpen, Clock, Award, Star } from "lucide-react";
import { cn } from "@/design-system/utils/cn";
import type { Volunteer } from "../model/members";
import { mockVolunteers, mockCourses } from "../model/members";
import { ApplicationDialog } from "./application-dialog";

type VolunteerViewProps = {
  filterValues: {
    search: string;
    applicationStatus: string;
  };
};

/**
 * 봉사자 뷰 컴포넌트
 * - 참여 가능한 강의 목록
 * - 참여한 강의 목록
 * - 봉사 시간 통계
 */
export function VolunteerView({ filterValues }: VolunteerViewProps) {
  const [activeTab, setActiveTab] = useState<"available" | "enrolled" | "history">("available");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedCourse, setSelectedCourse] = useState<(typeof mockCourses)[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // 클라이언트 마운트 확인
  // Next.js Hydration 문제 해결을 위한 표준 패턴

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 참여 가능한 강의 (모집중이고 봉사자 정원이 남은 강의)
  const availableCourses = useMemo(() => {
    return mockCourses
      .filter(
        (course) =>
          course.status === "recruiting" &&
          course.currentVolunteers < course.maxVolunteers &&
          (!filterValues.search || course.title.includes(filterValues.search)),
      )
      .sort((a, b) => a.id.localeCompare(b.id)); // 정렬하여 deterministic하게
  }, [filterValues.search]);

  // 참여한 강의 목록
  const enrolledCourses = useMemo(() => {
    const allEnrollments: (Volunteer["enrolledCourses"][0] & { volunteerName: string })[] = [];
    mockVolunteers.forEach((volunteer) => {
      volunteer.enrolledCourses.forEach((enrollment) => {
        allEnrollments.push({
          ...enrollment,
          volunteerName: volunteer.name,
        });
      });
    });
    return allEnrollments
      .filter(
        (enrollment) =>
          (!filterValues.search || enrollment.courseTitle.includes(filterValues.search)) &&
          (filterValues.applicationStatus === "all" ||
            enrollment.status === filterValues.applicationStatus),
      )
      .sort((a, b) => {
        // courseId와 volunteerName으로 정렬하여 deterministic하게
        const courseCompare = a.courseId.localeCompare(b.courseId);
        return courseCompare !== 0 ? courseCompare : a.volunteerName.localeCompare(b.volunteerName);
      });
  }, [filterValues]);

  // 완료된 강의 이력
  const completedHistory = useMemo(() => {
    const allEnrollments: (Volunteer["enrolledCourses"][0] & { volunteerName: string })[] = [];
    mockVolunteers.forEach((volunteer) => {
      volunteer.enrolledCourses
        .filter((e) => e.status === "completed")
        .forEach((enrollment) => {
          allEnrollments.push({
            ...enrollment,
            volunteerName: volunteer.name,
          });
        });
    });
    return allEnrollments
      .filter(
        (enrollment) =>
          !filterValues.search || enrollment.courseTitle.includes(filterValues.search),
      )
      .sort((a, b) => {
        // courseId와 volunteerName으로 정렬하여 deterministic하게
        const courseCompare = a.courseId.localeCompare(b.courseId);
        return courseCompare !== 0 ? courseCompare : a.volunteerName.localeCompare(b.volunteerName);
      });
  }, [filterValues]);

  // 통계
  const stats = useMemo(() => {
    const totalHours = mockVolunteers.reduce((sum, v) => sum + v.totalCompletedHours, 0);
    const totalCourses = mockVolunteers.reduce((sum, v) => sum + v.totalCompletedCourses, 0);
    const avgRating =
      mockVolunteers.reduce((sum, v) => sum + v.averageRating, 0) / mockVolunteers.length;
    return { totalHours, totalCourses, avgRating: Math.round(avgRating * 10) / 10 };
  }, []);

  const availableColumns: ColumnDef<(typeof availableCourses)[0]>[] = [
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
      accessorKey: "currentVolunteers",
      header: "봉사자 현황",
      cell: (info) => {
        const course = info.row.original;
        return (
          <span className="text-sm text-slate-300">
            {course.currentVolunteers} / {course.maxVolunteers}명
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
    {
      id: "actions",
      header: "신청",
      cell: (info) => {
        const course = info.row.original;
        const isFull = course.currentVolunteers >= course.maxVolunteers;
        return (
          <button
            onClick={() => {
              setSelectedCourse(course);
              setIsDialogOpen(true);
            }}
            disabled={isFull}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium transition",
              isFull
                ? "bg-slate-700/50 text-slate-500 cursor-not-allowed"
                : "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30",
            )}
          >
            {isFull ? "정원 마감" : "신청하기"}
          </button>
        );
      },
    },
  ];

  const enrolledColumns: ColumnDef<(typeof enrolledCourses)[0]>[] = [
    {
      accessorKey: "courseTitle",
      header: "강의명",
      cell: (info) => <span className="font-semibold text-white">{info.getValue() as string}</span>,
    },
    {
      accessorKey: "volunteerName",
      header: "봉사자명",
      cell: (info) => <span className="text-sm text-slate-300">{info.getValue() as string}</span>,
    },
    {
      accessorKey: "status",
      header: "상태",
      cell: (info) => {
        const status = info.getValue() as string;
        const statusConfig = {
          pending: { label: "대기중", className: "bg-yellow-500/20 text-yellow-300" },
          approved: { label: "승인", className: "bg-emerald-500/20 text-emerald-300" },
          rejected: { label: "거절", className: "bg-red-500/20 text-red-300" },
          completed: { label: "완료", className: "bg-blue-500/20 text-blue-300" },
        };
        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
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
      accessorKey: "volunteerHours",
      header: "봉사 시간",
      cell: (info) => {
        const hours = info.getValue() as number;
        return <span className="text-sm text-slate-300">{hours}시간</span>;
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
  ];

  const historyColumns: ColumnDef<(typeof completedHistory)[0]>[] = [
    {
      accessorKey: "courseTitle",
      header: "강의명",
      cell: (info) => <span className="font-semibold text-white">{info.getValue() as string}</span>,
    },
    {
      accessorKey: "volunteerName",
      header: "봉사자명",
      cell: (info) => <span className="text-sm text-slate-300">{info.getValue() as string}</span>,
    },
    {
      accessorKey: "volunteerHours",
      header: "봉사 시간",
      cell: (info) => {
        const hours = info.getValue() as number;
        return <span className="text-sm font-semibold text-white">{hours}시간</span>;
      },
    },
    {
      accessorKey: "rating",
      header: "평가",
      cell: (info) => {
        const rating = info.getValue() as number | null;
        return (
          <div className="flex items-center gap-1">
            {rating !== null ? (
              <>
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-white">{rating.toFixed(1)}</span>
              </>
            ) : (
              <span className="text-xs text-slate-400">-</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "completedAt",
      header: "완료일",
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

  const availableTable = useReactTable({
    data: availableCourses,
    columns: availableColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
    initialState: { pagination: { pageSize: 10 } },
  });

  const enrolledTable = useReactTable({
    data: enrolledCourses,
    columns: enrolledColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
    initialState: { pagination: { pageSize: 10 } },
  });

  const historyTable = useReactTable({
    data: completedHistory,
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
      {/* 통계 카드 */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-emerald-300" />
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">총 봉사 시간</p>
          </div>
          <p className="mt-2 text-2xl font-semibold text-white">{stats.totalHours}시간</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-blue-300" />
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">완료한 강의</p>
          </div>
          <p className="mt-2 text-2xl font-semibold text-white">{stats.totalCourses}개</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-300" />
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">평균 평가</p>
          </div>
          <p className="mt-2 text-2xl font-semibold text-white">{stats.avgRating}점</p>
        </div>
      </div>

      {/* 탭 */}
      <div className="flex gap-2 border-b border-white/10">
        {[
          { id: "available", label: "참여 가능한 강의", icon: BookOpen },
          { id: "enrolled", label: "참여한 강의", icon: Clock },
          { id: "history", label: "완료 이력", icon: Award },
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
          {activeTab === "available" && renderTable(availableTable)}
          {activeTab === "enrolled" && renderTable(enrolledTable)}
          {activeTab === "history" && renderTable(historyTable)}
        </>
      )}

      {/* 신청 팝업 */}
      <ApplicationDialog
        course={selectedCourse}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={(data) => {
          // 제출 처리 (현재는 팝업만 닫힘)
          console.log("봉사 신청 제출:", data);
        }}
        type="volunteer"
      />
    </div>
  );
}
