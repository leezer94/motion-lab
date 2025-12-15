"use client";

import { useState, useEffect, useMemo } from "react";
import { CheckCircle, XCircle, Clock, Users, AlertCircle, Settings, Zap } from "lucide-react";
import { cn } from "@/design-system/utils/cn";
import { mockCourseApprovalConfigs, mockApplications } from "../model/approval";
import type { CourseApprovalConfig, Application, ApprovalStatus } from "../model/approval";

/**
 * 강의 신청 승인 페이지 메인 컨텐츠 컴포넌트
 */
export function ApprovalPageContent() {
  const [configs] = useState<CourseApprovalConfig[]>(mockCourseApprovalConfigs);
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [_selectedCourse, setSelectedCourse] = useState<CourseApprovalConfig | null>(null);
  const [filterStatus, setFilterStatus] = useState<ApprovalStatus | "all">("all");
  const [isMounted, setIsMounted] = useState(false);

  // 클라이언트 마운트 확인
  // Next.js Hydration 문제 해결을 위한 표준 패턴
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => filterStatus === "all" || app.status === filterStatus);
  }, [applications, filterStatus]);

  const getStatusConfig = (status: ApprovalStatus) => {
    const configs = {
      pending: { label: "대기중", className: "bg-yellow-500/20 text-yellow-300", icon: Clock },
      approved: {
        label: "승인됨",
        className: "bg-emerald-500/20 text-emerald-300",
        icon: CheckCircle,
      },
      rejected: { label: "거절됨", className: "bg-red-500/20 text-red-300", icon: XCircle },
      waitlisted: { label: "대기열", className: "bg-blue-500/20 text-blue-300", icon: AlertCircle },
    };
    return configs[status];
  };

  const getRuleLabel = (rule: string) => {
    const rules = {
      first_come: "선착순",
      qualification: "자격 검증",
      manual: "수동 승인",
      lottery: "추첨",
    };
    return rules[rule as keyof typeof rules] || rule;
  };

  // stats를 useMemo로 계산하여 deterministic하게
  const stats = useMemo(() => {
    return {
      total: applications.length,
      pending: applications.filter((a) => a.status === "pending").length,
      approved: applications.filter((a) => a.status === "approved").length,
      rejected: applications.filter((a) => a.status === "rejected").length,
      waitlisted: applications.filter((a) => a.status === "waitlisted").length,
    };
  }, [applications]);

  const handleApprove = (applicationId: string) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === applicationId
          ? {
              ...app,
              status: "approved" as ApprovalStatus,
              approvedAt: new Date(),
              reviewedBy: "admin",
            }
          : app,
      ),
    );
  };

  const handleReject = (applicationId: string, reason: string) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === applicationId
          ? {
              ...app,
              status: "rejected" as ApprovalStatus,
              rejectedAt: new Date(),
              rejectedReason: reason,
              reviewedBy: "admin",
            }
          : app,
      ),
    );
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">강의 신청 승인</h1>
          <p className="mt-2 text-slate-400">자동 승인 워크플로우 및 대기자 관리</p>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid gap-4 md:grid-cols-5">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-500/20 p-2">
              <Users className="h-5 w-5 text-blue-300" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">총 신청</p>
              <p className="mt-1 text-2xl font-semibold text-white">
                {isMounted ? stats.total : "-"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-yellow-500/20 p-2">
              <Clock className="h-5 w-5 text-yellow-300" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">대기중</p>
              <p className="mt-1 text-2xl font-semibold text-white">
                {isMounted ? stats.pending : "-"}
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
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">승인됨</p>
              <p className="mt-1 text-2xl font-semibold text-white">
                {isMounted ? stats.approved : "-"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-red-500/20 p-2">
              <XCircle className="h-5 w-5 text-red-300" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">거절됨</p>
              <p className="mt-1 text-2xl font-semibold text-white">
                {isMounted ? stats.rejected : "-"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-500/20 p-2">
              <AlertCircle className="h-5 w-5 text-blue-300" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">대기열</p>
              <p className="mt-1 text-2xl font-semibold text-white">
                {isMounted ? stats.waitlisted : "-"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 강의별 승인 설정 */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
        <div className="border-b border-white/10 px-6 py-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-200">
            강의별 승인 설정
          </h3>
        </div>
        <div className="divide-y divide-white/5">
          {configs.map((config) => (
            <div
              key={config.courseId}
              className="px-6 py-4 transition hover:bg-white/5 cursor-pointer"
              onClick={() => setSelectedCourse(config)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className="text-lg font-semibold text-white">{config.courseTitle}</h4>
                    {config.autoApproveEnabled && (
                      <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-xs text-emerald-300">
                        <Zap className="inline h-3 w-3 mr-1" />
                        자동 승인
                      </span>
                    )}
                    <span className="rounded-full bg-slate-700/50 px-2 py-1 text-xs text-slate-300">
                      {getRuleLabel(config.approvalRule)}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-sm text-slate-400">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {config.currentEnrollment} / {config.maxCapacity}명
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      대기중: {config.pendingCount}건
                    </div>
                  </div>
                </div>
                <div className="ml-4 flex items-center gap-2">
                  <button
                    aria-label="설정"
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                  >
                    <Settings className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 필터 */}
      <div className="flex gap-2">
        {(["all", "pending", "approved", "rejected", "waitlisted"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-semibold transition",
              filterStatus === status
                ? "bg-emerald-500/20 text-emerald-300"
                : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white",
            )}
          >
            {status === "all" ? "전체" : getStatusConfig(status as ApprovalStatus).label}
          </button>
        ))}
      </div>

      {/* 신청 목록 */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
        <div className="border-b border-white/10 px-6 py-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-200">
            신청 목록
          </h3>
        </div>
        <div className="divide-y divide-white/5">
          {filteredApplications.length === 0 ? (
            <div className="px-6 py-12 text-center text-slate-400">신청이 없습니다.</div>
          ) : (
            filteredApplications.map((application) => {
              const statusConfig = getStatusConfig(application.status);
              const StatusIcon = statusConfig.icon;
              return (
                <div key={application.id} className="px-6 py-4 transition hover:bg-white/5">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="text-lg font-semibold text-white">
                          {application.studentName}
                        </h4>
                        <span
                          className={cn("rounded-full px-2 py-1 text-xs", statusConfig.className)}
                        >
                          <StatusIcon className="inline h-3 w-3 mr-1" />
                          {statusConfig.label}
                        </span>
                        {application.autoApproved && (
                          <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-xs text-emerald-300">
                            <Zap className="inline h-3 w-3 mr-1" />
                            자동
                          </span>
                        )}
                      </div>
                      <div className="mt-2 flex items-center gap-4 text-sm text-slate-400">
                        <span>{application.courseTitle}</span>
                        <span>신청일: {application.appliedAt.toLocaleDateString("ko-KR")}</span>
                        {application.priority > 0 && <span>우선순위: {application.priority}</span>}
                      </div>
                    </div>
                    {application.status === "pending" && (
                      <div className="ml-4 flex items-center gap-2">
                        <button
                          onClick={() => handleApprove(application.id)}
                          className="rounded-lg bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/30"
                        >
                          승인
                        </button>
                        <button
                          onClick={() => handleReject(application.id, "수강 정원 초과")}
                          className="rounded-lg bg-red-500/20 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/30"
                        >
                          거절
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
