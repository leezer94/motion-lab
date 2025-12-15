"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/design-system/utils/cn";
import { mockCourseSchedules, mockOnlinePlatforms } from "../model/scheduling";
import type { CourseSchedule, ScheduleStatus } from "../model/scheduling";
import { ScheduleCreateDialog } from "./schedule-create-dialog";
import type { ScheduleFormData } from "../lib/use-schedule-form";

/**
 * 강의 일정 스케줄링 페이지 메인 컨텐츠 컴포넌트
 */
export function SchedulingPageContent() {
  const [schedules, setSchedules] = useState<CourseSchedule[]>(mockCourseSchedules);
  const [selectedSchedule, setSelectedSchedule] = useState<CourseSchedule | null>(null);
  const [filterStatus, setFilterStatus] = useState<ScheduleStatus | "all">("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMounted, setIsMounted] = useState(false);
  const itemsPerPage = 10;

  // 클라이언트 마운트 확인
  // Next.js Hydration 문제 해결을 위한 표준 패턴
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  const filteredSchedules = useMemo(() => {
    return schedules.filter(
      (schedule) => filterStatus === "all" || schedule.status === filterStatus,
    );
  }, [schedules, filterStatus]);

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredSchedules.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSchedules = filteredSchedules.slice(startIndex, endIndex);

  // 필터 변경 시 첫 페이지로 이동
  const handleFilterChange = (status: ScheduleStatus | "all") => {
    setFilterStatus(status);
    setCurrentPage(1);
  };

  const getStatusConfig = (status: ScheduleStatus) => {
    const configs = {
      draft: { label: "초안", className: "bg-slate-500/20 text-slate-300", icon: Clock },
      confirmed: {
        label: "확정",
        className: "bg-emerald-500/20 text-emerald-300",
        icon: CheckCircle,
      },
      cancelled: { label: "취소", className: "bg-red-500/20 text-red-300", icon: XCircle },
      completed: { label: "완료", className: "bg-blue-500/20 text-blue-300", icon: CheckCircle },
    };
    return configs[status];
  };

  const hasConflicts = (schedule: CourseSchedule) => schedule.conflicts.length > 0;

  // stats를 useMemo로 계산하여 deterministic하게
  const stats = useMemo(() => {
    return {
      total: schedules.length,
      confirmed: schedules.filter((s) => s.status === "confirmed").length,
      draft: schedules.filter((s) => s.status === "draft").length,
      conflicts: schedules.filter((s) => hasConflicts(s)).length,
    };
  }, [schedules]);

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">강의 일정 스케줄링</h1>
          <p className="mt-2 text-slate-400">강의 일정 자동 매칭 및 충돌 관리</p>
        </div>
        <button
          onClick={() => setIsCreateDialogOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-emerald-500/20 px-6 py-3 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/30"
        >
          <Plus className="h-4 w-4" />
          일정 생성
        </button>
      </div>

      {/* 통계 카드 */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-500/20 p-2">
              <Calendar className="h-5 w-5 text-blue-300" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">총 일정</p>
              <p className="mt-1 text-2xl font-semibold text-white">
                {isMounted ? stats.total : "-"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-emerald-500/20 p-2">
              <CheckCircle className="h-5 w-5 text-emerald-300" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">확정</p>
              <p className="mt-1 text-2xl font-semibold text-white">
                {isMounted ? stats.confirmed : "-"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-slate-500/20 p-2">
              <Clock className="h-5 w-5 text-slate-300" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">초안</p>
              <p className="mt-1 text-2xl font-semibold text-white">
                {isMounted ? stats.draft : "-"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-yellow-500/20 p-2">
              <AlertTriangle className="h-5 w-5 text-yellow-300" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">충돌</p>
              <p className="mt-1 text-2xl font-semibold text-white">
                {isMounted ? stats.conflicts : "-"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 필터 */}
      <div className="flex gap-2">
        {(["all", "draft", "confirmed", "cancelled", "completed"] as const).map((status) => (
          <button
            key={status}
            onClick={() => handleFilterChange(status)}
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-semibold transition",
              filterStatus === status
                ? "bg-emerald-500/20 text-emerald-300"
                : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white",
            )}
          >
            {status === "all" ? "전체" : getStatusConfig(status as ScheduleStatus).label}
          </button>
        ))}
      </div>

      {/* 일정 목록 */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
        <div className="border-b border-white/10 px-6 py-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-200">
            강의 일정 목록
          </h3>
        </div>
        {!isMounted ? (
          <div className="px-6 py-12 text-center text-slate-400">로딩 중...</div>
        ) : (
          <>
            <div className="divide-y divide-white/5">
              {paginatedSchedules.length === 0 ? (
                <div className="px-6 py-12 text-center text-slate-400">일정이 없습니다.</div>
              ) : (
                paginatedSchedules.map((schedule) => {
                  const statusConfig = getStatusConfig(schedule.status);
                  const StatusIcon = statusConfig.icon;
                  const hasConflict = hasConflicts(schedule);
                  return (
                    <div
                      key={schedule.id}
                      className="px-6 py-4 transition hover:bg-white/5 cursor-pointer"
                      onClick={() => setSelectedSchedule(schedule)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h4 className="text-lg font-semibold text-white">
                              {schedule.courseTitle}
                            </h4>
                            <span
                              className={cn(
                                "rounded-full px-2 py-1 text-xs",
                                statusConfig.className,
                              )}
                            >
                              <StatusIcon className="inline h-3 w-3 mr-1" />
                              {statusConfig.label}
                            </span>
                            {hasConflict && (
                              <span className="rounded-full bg-yellow-500/20 px-2 py-1 text-xs text-yellow-300">
                                <AlertTriangle className="inline h-3 w-3 mr-1" />
                                충돌
                              </span>
                            )}
                          </div>
                          <div className="mt-2 flex items-center gap-4 text-sm text-slate-400">
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {schedule.instructorName}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {schedule.platformName}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {schedule.timeSlots[0]?.startTime.toLocaleTimeString("ko-KR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                              {" - "}
                              {schedule.timeSlots[0]?.endTime.toLocaleTimeString("ko-KR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>
                        </div>
                        <div className="ml-4 text-right">
                          <p className="text-xs text-slate-400">수강생</p>
                          <p className="mt-1 text-sm font-semibold text-white">
                            {schedule.studentCount} / {schedule.maxCapacity}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* 페이지네이션 */}
            {filteredSchedules.length > itemsPerPage && (
              <div className="flex items-center justify-between border-t border-white/10 px-6 py-4">
                <div className="text-xs text-slate-400">
                  총 {filteredSchedules.length}개 중 {startIndex + 1}-
                  {Math.min(endIndex, filteredSchedules.length)}개 표시
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    aria-label="이전 페이지"
                    className={cn(
                      "rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white transition",
                      "hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed",
                    )}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={cn(
                            "rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold transition",
                            currentPage === pageNum
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                              : "text-slate-300 hover:bg-white/10 hover:text-white",
                          )}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    aria-label="다음 페이지"
                    className={cn(
                      "rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white transition",
                      "hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed",
                    )}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* 일정 상세 정보 모달 */}
      <AnimatePresence>
        {selectedSchedule && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSchedule(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl border border-white/10 bg-slate-900/95 shadow-2xl backdrop-blur-xl pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="border-b border-white/10 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-white">
                      {selectedSchedule.courseTitle}
                    </h2>
                    <p className="mt-1 text-sm text-slate-400">{selectedSchedule.instructorName}</p>
                  </div>
                  <button
                    onClick={() => setSelectedSchedule(null)}
                    aria-label="모달 닫기"
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div
                className="overflow-y-auto px-6 py-6 space-y-6"
                style={{ maxHeight: "calc(90vh - 140px)" }}
              >
                {/* 기본 정보 */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-2">
                      온라인 플랫폼
                    </p>
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "rounded-full px-2 py-1 text-xs font-semibold",
                          selectedSchedule.platformType === "zoom" &&
                            "bg-blue-500/20 text-blue-300",
                          selectedSchedule.platformType === "teams" &&
                            "bg-purple-500/20 text-purple-300",
                          selectedSchedule.platformType === "google_meet" &&
                            "bg-green-500/20 text-green-300",
                          selectedSchedule.platformType === "custom" &&
                            "bg-slate-500/20 text-slate-300",
                        )}
                      >
                        {selectedSchedule.platformName}
                      </div>
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-2">수강생</p>
                    <p className="text-sm font-semibold text-white">
                      {selectedSchedule.studentCount} / {selectedSchedule.maxCapacity}명
                    </p>
                    <div className="mt-2 w-full bg-slate-700/50 rounded-full h-2">
                      <div
                        className="bg-emerald-500 h-2 rounded-full transition-all"
                        style={{
                          width: `${(selectedSchedule.studentCount / selectedSchedule.maxCapacity) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* 일정 정보 */}
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-3">
                    일정 정보
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-400 mb-1">시작일</p>
                      <p className="text-white font-semibold">
                        {selectedSchedule.startDate.toLocaleDateString("ko-KR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 mb-1">종료일</p>
                      <p className="text-white font-semibold">
                        {selectedSchedule.endDate.toLocaleDateString("ko-KR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 mb-1">요일</p>
                      <p className="text-white font-semibold">
                        {
                          ["일", "월", "화", "수", "목", "금", "토"][
                            selectedSchedule.timeSlots[0]?.dayOfWeek || 0
                          ]
                        }
                        요일
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 mb-1">시간</p>
                      <p className="text-white font-semibold">
                        {selectedSchedule.timeSlots[0]?.startTime.toLocaleTimeString("ko-KR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {" - "}
                        {selectedSchedule.timeSlots[0]?.endTime.toLocaleTimeString("ko-KR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 온라인 접속 정보 */}
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-emerald-300 mb-3">
                    온라인 접속 정보
                  </p>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-slate-400 mb-1">회의 링크</p>
                      <div className="flex items-center gap-2">
                        <a
                          href={selectedSchedule.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 text-sm text-emerald-300 hover:text-emerald-200 underline truncate"
                        >
                          {selectedSchedule.meetingLink}
                        </a>
                        <button
                          onClick={() =>
                            navigator.clipboard.writeText(selectedSchedule.meetingLink)
                          }
                          className="rounded-lg bg-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/30 transition"
                        >
                          복사
                        </button>
                      </div>
                    </div>
                    {selectedSchedule.meetingId && (
                      <div>
                        <p className="text-xs text-slate-400 mb-1">회의 ID</p>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 text-sm font-mono text-white bg-slate-800/50 px-3 py-2 rounded-lg">
                            {selectedSchedule.meetingId}
                          </code>
                          <button
                            onClick={() =>
                              navigator.clipboard.writeText(selectedSchedule.meetingId || "")
                            }
                            className="rounded-lg bg-slate-700/50 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition"
                          >
                            복사
                          </button>
                        </div>
                      </div>
                    )}
                    {selectedSchedule.meetingPassword && (
                      <div>
                        <p className="text-xs text-slate-400 mb-1">비밀번호</p>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 text-sm font-mono text-white bg-slate-800/50 px-3 py-2 rounded-lg">
                            {selectedSchedule.meetingPassword}
                          </code>
                          <button
                            onClick={() =>
                              navigator.clipboard.writeText(selectedSchedule.meetingPassword || "")
                            }
                            className="rounded-lg bg-slate-700/50 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition"
                          >
                            복사
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 녹화 정보 */}
                {selectedSchedule.recordingEnabled && (
                  <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-blue-300 mb-1">
                          녹화 활성화
                        </p>
                        <p className="text-sm text-slate-300">강의가 자동으로 녹화됩니다.</p>
                      </div>
                      {selectedSchedule.recordingLink && (
                        <a
                          href={selectedSchedule.recordingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg bg-blue-500/20 px-4 py-2 text-sm font-semibold text-blue-300 hover:bg-blue-500/30 transition"
                        >
                          녹화 보기
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* 충돌 사항 */}
                {hasConflicts(selectedSchedule) && (
                  <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs uppercase tracking-[0.3em] text-yellow-300 mb-2">
                          충돌 사항
                        </p>
                        <ul className="space-y-1">
                          {selectedSchedule.conflicts.map((conflict, index) => (
                            <li key={index} className="text-sm text-yellow-200">
                              •{" "}
                              {conflict.type === "instructor"
                                ? "강의자"
                                : conflict.type === "platform"
                                  ? "플랫폼"
                                  : "시간"}{" "}
                              충돌: {conflict.conflictingItem}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* 상태 정보 */}
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-1">상태</p>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold",
                          getStatusConfig(selectedSchedule.status).className,
                        )}
                      >
                        {(() => {
                          const StatusIconForDetail = getStatusConfig(selectedSchedule.status).icon;
                          return <StatusIconForDetail className="h-3 w-3" />;
                        })()}
                        {getStatusConfig(selectedSchedule.status).label}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400 mb-1">생성일</p>
                      <p className="text-sm text-slate-300">
                        {selectedSchedule.createdAt.toLocaleDateString("ko-KR")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 일정 생성 다이얼로그 */}
      <ScheduleCreateDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={(data: ScheduleFormData) => {
          // 일정 생성 로직 (실제로는 서버에 전송)
          const selectedPlatform = mockOnlinePlatforms.find((p) => p.id === data.platformId);
          const meetingId = `${Math.floor(Math.random() * 1000000)}`;
          const meetingPassword =
            Math.random() > 0.5 ? `${Math.floor(Math.random() * 10000)}` : undefined;
          const platformType = selectedPlatform?.type || "zoom";
          const meetingLink = `https://${platformType === "zoom" ? "zoom.us" : platformType === "teams" ? "teams.microsoft.com" : "meet.google.com"}/j/${meetingId}`;

          const newSchedule: CourseSchedule = {
            id: `schedule-${Date.now()}`,
            courseId: data.courseId,
            courseTitle: data.courseTitle,
            instructorId: data.instructorId,
            instructorName: data.instructorName,
            platformId: data.platformId,
            platformName: data.platformName,
            platformType: platformType as "zoom" | "teams" | "google_meet" | "custom",
            meetingLink,
            meetingId,
            meetingPassword,
            timeSlots: data.dayOfWeek.map((day, index) => ({
              id: `slot-${Date.now()}-${index}`,
              startTime: new Date(data.startDate),
              endTime: new Date(data.endDate),
              dayOfWeek: day,
            })),
            startDate: data.startDate,
            endDate: data.endDate,
            status: data.status,
            conflicts: [],
            studentCount: 0,
            maxCapacity: data.maxCapacity,
            recordingEnabled: Math.random() > 0.3,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          setSchedules((prev) => [newSchedule, ...prev]);
          setIsCreateDialogOpen(false);
        }}
      />
    </div>
  );
}
