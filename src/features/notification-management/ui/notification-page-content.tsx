"use client";

import { FormProvider } from "react-hook-form";
import { useState, useEffect, useMemo } from "react";
import { Mail, MessageSquare, Plus, Calendar, CheckCircle, Clock, XCircle } from "lucide-react";
import { cn } from "@/design-system/utils/cn";
import { useNotificationForm } from "../lib/use-notification-form";
import { NotificationSendDialog } from "./notification-send-dialog";
import { NotificationDetailDialog } from "./notification-detail-dialog";
import { mockScheduledNotifications } from "../model/templates";
import type { ScheduledNotification } from "../model/templates";

/**
 * 알림 발송 페이지 메인 컨텐츠 컴포넌트
 */
export function NotificationPageContent() {
  const { form } = useNotificationForm();
  const [activeType, setActiveType] = useState<"email" | "sms">("email");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<ScheduledNotification | null>(
    null,
  );
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [scheduledNotifications] = useState<ScheduledNotification[]>(mockScheduledNotifications);
  const [isMounted, setIsMounted] = useState(false);

  // 클라이언트 마운트 확인
  // Next.js Hydration 문제 해결을 위한 표준 패턴
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  const emailCount = useMemo(
    () => scheduledNotifications.filter((n) => n.type === "email").length,
    [scheduledNotifications],
  );
  const smsCount = useMemo(
    () => scheduledNotifications.filter((n) => n.type === "sms").length,
    [scheduledNotifications],
  );

  const getStatusConfig = (status: ScheduledNotification["status"]) => {
    const configs = {
      draft: { label: "초안", className: "bg-slate-500/20 text-slate-300", icon: Clock },
      scheduled: { label: "예약됨", className: "bg-blue-500/20 text-blue-300", icon: Calendar },
      sent: { label: "발송됨", className: "bg-emerald-500/20 text-emerald-300", icon: CheckCircle },
      failed: { label: "실패", className: "bg-red-500/20 text-red-300", icon: XCircle },
    };
    return configs[status];
  };

  return (
    <FormProvider {...form}>
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white">알림 발송</h1>
            <p className="mt-2 text-slate-400">
              템플릿을 선택하여 메일 또는 SMS를 발송하거나 스케줄링하세요.
            </p>
          </div>
          <button
            onClick={() => setIsDialogOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-emerald-500/20 px-6 py-3 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/30"
          >
            <Plus className="h-4 w-4" />
            {activeType === "email" ? "메일 발송" : "SMS 발송"}
          </button>
        </div>

        {/* 타입 탭 */}
        <div className="flex gap-2 border-b border-white/10">
          {[
            { id: "email", label: "메일", icon: Mail, count: isMounted ? emailCount : 0 },
            { id: "sms", label: "SMS", icon: MessageSquare, count: isMounted ? smsCount : 0 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveType(tab.id as typeof activeType);
              }}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-semibold transition",
                "border-b-2 border-transparent",
                activeType === tab.id
                  ? "border-emerald-400 text-emerald-300"
                  : "text-slate-400 hover:text-white",
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
              <span className="text-xs opacity-70">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* 통계 카드 */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">전체</p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {isMounted ? scheduledNotifications.length : "-"}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">예약됨</p>
            <p className="mt-2 text-2xl font-semibold text-blue-300">
              {isMounted
                ? scheduledNotifications.filter((n) => n.status === "scheduled").length
                : "-"}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">발송됨</p>
            <p className="mt-2 text-2xl font-semibold text-emerald-300">
              {isMounted ? scheduledNotifications.filter((n) => n.status === "sent").length : "-"}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">실패</p>
            <p className="mt-2 text-2xl font-semibold text-red-300">
              {isMounted ? scheduledNotifications.filter((n) => n.status === "failed").length : "-"}
            </p>
          </div>
        </div>

        {/* 스케줄된 알림 목록 */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
          <div className="border-b border-white/10 px-6 py-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-200">
              발송 이력
            </h3>
          </div>
          {!isMounted ? (
            <div className="px-6 py-12 text-center text-slate-400">로딩 중...</div>
          ) : (
            <div className="divide-y divide-white/5">
              {scheduledNotifications.length === 0 ? (
                <div className="px-6 py-12 text-center text-slate-400">발송된 알림이 없습니다.</div>
              ) : (
                scheduledNotifications
                  .filter((n) => n.type === activeType)
                  .map((notification) => {
                    const statusConfig = getStatusConfig(notification.status);
                    const StatusIcon = statusConfig.icon;
                    return (
                      <button
                        key={notification.id}
                        onClick={() => {
                          setSelectedNotification(notification);
                          setIsDetailDialogOpen(true);
                        }}
                        className="w-full px-6 py-4 text-left transition hover:bg-white/5"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <h4 className="font-semibold text-white">
                                {notification.templateName}
                              </h4>
                              <span
                                className={cn(
                                  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
                                  statusConfig.className,
                                )}
                              >
                                <StatusIcon className="h-3 w-3" />
                                {statusConfig.label}
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-slate-400">
                              수신자: {notification.recipients.length}명
                            </p>
                            {notification.subject && (
                              <p className="mt-1 text-sm text-slate-300">{notification.subject}</p>
                            )}
                            <div className="mt-2 flex gap-4 text-xs text-slate-400">
                              <span>예약: {notification.scheduledAt.toLocaleString("ko-KR")}</span>
                              {notification.sentAt && (
                                <span>발송: {notification.sentAt.toLocaleString("ko-KR")}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })
              )}
            </div>
          )}
        </div>

        {/* 발송 다이얼로그 */}
        <NotificationSendDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          type={activeType}
        />

        {/* 상세 정보 다이얼로그 */}
        <NotificationDetailDialog
          notification={selectedNotification}
          isOpen={isDetailDialogOpen}
          onClose={() => {
            setIsDetailDialogOpen(false);
            setSelectedNotification(null);
          }}
        />
      </div>
    </FormProvider>
  );
}
