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
import { ChevronLeft, ChevronRight, BookOpen, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/design-system/utils/cn";
import type { Student, Course, StudentApplication, StudentEnrollment } from "../model/members";
import { mockStudents, mockCourses } from "../model/members";
import { ApplicationDialog } from "./application-dialog";
import { CertificateViewDialog } from "@/features/certificate-management/ui/certificate-view-dialog";
import { generateCertificate } from "@/features/certificate-management/model/certificates";
import type { Certificate } from "@/features/certificate-management/model/certificates";

type StudentViewProps = {
  filterValues: {
    search: string;
    applicationStatus: string;
  };
};

/**
 * 학생 뷰 컴포넌트
 * - 신청 가능한 강의 목록
 * - 신청한 강의 목록
 * - 참여 이력
 */
export function StudentView({ filterValues }: StudentViewProps) {
  const [activeTab, setActiveTab] = useState<"available" | "applied" | "history">("available");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [isCertificateDialogOpen, setIsCertificateDialogOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // 클라이언트 마운트 확인
  // Next.js Hydration 문제 해결을 위한 표준 패턴

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 교육증 다이얼로그 이벤트 리스너
  useEffect(() => {
    const handleOpenCertificate = (event: Event) => {
      const customEvent = event as CustomEvent<{ student: Student; enrollment: StudentEnrollment }>;
      const { student, enrollment } = customEvent.detail;
      const certificate = generateCertificate(student, enrollment);
      setSelectedCertificate(certificate);
      setIsCertificateDialogOpen(true);
    };

    window.addEventListener("openCertificate", handleOpenCertificate as EventListener);
    return () => {
      window.removeEventListener("openCertificate", handleOpenCertificate as EventListener);
    };
  }, []);

  // 신청 가능한 강의 (모집중이고 정원이 남은 강의)
  const availableCourses = useMemo(() => {
    return mockCourses
      .filter(
        (course) =>
          course.status === "recruiting" &&
          course.currentStudents < course.maxStudents &&
          (!filterValues.search || course.title.includes(filterValues.search)),
      )
      .sort((a, b) => a.id.localeCompare(b.id)); // 정렬하여 deterministic하게
  }, [filterValues.search]);

  // 신청한 강의 목록 (모든 학생의 신청 이력 통합)
  const appliedCourses = useMemo(() => {
    const allApplications: (StudentApplication & { studentName: string })[] = [];
    mockStudents.forEach((student) => {
      student.applicationHistory.forEach((app) => {
        allApplications.push({
          ...app,
          studentName: student.name,
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

  // 참여 이력 (완료된 강의)
  const completedHistory = useMemo(() => {
    const allEnrollments: (Student["enrolledCourses"][0] & { studentName: string })[] = [];
    mockStudents.forEach((student) => {
      student.enrolledCourses
        .filter((e) => e.status === "completed")
        .forEach((enrollment) => {
          allEnrollments.push({
            ...enrollment,
            studentName: student.name,
          });
        });
    });

    return allEnrollments
      .filter(
        (enrollment) =>
          !filterValues.search || enrollment.courseTitle.includes(filterValues.search),
      )
      .sort((a, b) => {
        // courseId와 studentName으로 정렬하여 deterministic하게
        const courseCompare = a.courseId.localeCompare(b.courseId);
        return courseCompare !== 0 ? courseCompare : a.studentName.localeCompare(b.studentName);
      });
  }, [filterValues]);

  const availableColumns: ColumnDef<Course>[] = [
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
      accessorKey: "category",
      header: "카테고리",
      cell: (info) => <span className="text-xs text-slate-400">{info.getValue() as string}</span>,
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
    {
      id: "actions",
      header: "신청",
      cell: (info) => {
        const course = info.row.original;
        const isFull = course.currentStudents >= course.maxStudents;
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

  const appliedColumns: ColumnDef<StudentApplication & { studentName: string }>[] = [
    {
      accessorKey: "courseTitle",
      header: "강의명",
      cell: (info) => <span className="font-semibold text-white">{info.getValue() as string}</span>,
    },
    {
      accessorKey: "studentName",
      header: "학생명",
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
          cancelled: { label: "취소", className: "bg-slate-500/20 text-slate-300" },
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
      accessorKey: "appliedAt",
      header: "신청일",
      cell: (info) => {
        const date = info.getValue() as Date;
        return <span className="text-xs text-slate-400">{date.toLocaleDateString("ko-KR")}</span>;
      },
    },
  ];

  const historyColumns: ColumnDef<Student["enrolledCourses"][0] & { studentName: string }>[] = [
    {
      accessorKey: "courseTitle",
      header: "강의명",
      cell: (info) => <span className="font-semibold text-white">{info.getValue() as string}</span>,
    },
    {
      accessorKey: "studentName",
      header: "학생명",
      cell: (info) => <span className="text-sm text-slate-300">{info.getValue() as string}</span>,
    },
    {
      accessorKey: "grade",
      header: "성적",
      cell: (info) => {
        const grade = info.getValue() as number | null;
        return (
          <span className="text-sm font-semibold text-white">
            {grade !== null ? `${grade}점` : "-"}
          </span>
        );
      },
    },
    {
      accessorKey: "attendance",
      header: "출석률",
      cell: (info) => {
        const attendance = info.getValue() as number;
        return <span className="text-sm text-slate-300">{attendance}%</span>;
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
    {
      id: "certificate",
      header: "교육증",
      cell: (info) => {
        const enrollment = info.row.original;
        return (
          <button
            onClick={() => {
              // 교육증 다이얼로그 열기
              const student = mockStudents.find((s) => s.name === enrollment.studentName);
              if (student && enrollment.completedAt) {
                // CertificateViewDialog는 상위 컴포넌트에서 관리
                // 여기서는 이벤트만 발생시킴
                const event = new CustomEvent("openCertificate", {
                  detail: { student, enrollment },
                });
                window.dispatchEvent(event);
              }
            }}
            className="rounded-lg bg-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/30"
          >
            확인
          </button>
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

  const appliedTable = useReactTable({
    data: appliedCourses,
    columns: appliedColumns,
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
      {/* 탭 */}
      <div className="flex gap-2 border-b border-white/10">
        {[
          { id: "available", label: "신청 가능한 강의", icon: BookOpen },
          { id: "applied", label: "신청한 강의", icon: Clock },
          { id: "history", label: "참여 이력", icon: CheckCircle },
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
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-12 text-center">
          <div className="text-slate-400">로딩 중...</div>
        </div>
      ) : (
        <>
          {activeTab === "available" && renderTable(availableTable)}
          {activeTab === "applied" && renderTable(appliedTable)}
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
          console.log("학생 신청 제출:", data);
        }}
        type="student"
      />

      {/* 교육증 확인 다이얼로그 */}
      <CertificateViewDialog
        certificate={selectedCertificate}
        isOpen={isCertificateDialogOpen}
        onClose={() => {
          setIsCertificateDialogOpen(false);
          setSelectedCertificate(null);
        }}
      />
    </div>
  );
}
