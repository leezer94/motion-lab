"use client";

import { motion, AnimatePresence } from "motion/react";
import { X, Mail, MessageSquare, Calendar, Clock, Users, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/design-system/utils/cn";
import type { ScheduledNotification } from "../model/templates";

type NotificationDetailDialogProps = {
  notification: ScheduledNotification | null;
  isOpen: boolean;
  onClose: () => void;
};

/**
 * 알림 발송 상세 정보 다이얼로그
 */
export function NotificationDetailDialog({
  notification,
  isOpen,
  onClose,
}: NotificationDetailDialogProps) {
  if (!notification || !isOpen) return null;

  const getStatusConfig = (status: ScheduledNotification["status"]) => {
    const configs = {
      draft: { label: "초안", className: "bg-slate-500/20 text-slate-300", icon: Clock },
      scheduled: { label: "예약됨", className: "bg-blue-500/20 text-blue-300", icon: Calendar },
      sent: { label: "발송됨", className: "bg-emerald-500/20 text-emerald-300", icon: CheckCircle },
      failed: { label: "실패", className: "bg-red-500/20 text-red-300", icon: XCircle },
    };
    return configs[status];
  };

  const statusConfig = getStatusConfig(notification.status);
  const StatusIcon = statusConfig.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />

          {/* Dialog */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-slate-900/95 shadow-2xl backdrop-blur-xl pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                <div className="flex items-center gap-3">
                  {notification.type === "email" ? (
                    <Mail className="h-6 w-6 text-emerald-300" />
                  ) : (
                    <MessageSquare className="h-6 w-6 text-blue-300" />
                  )}
                  <div>
                    <h2 className="text-2xl font-semibold text-white">발송 상세 정보</h2>
                    <p className="mt-1 text-sm text-slate-400">
                      {notification.type === "email" ? "메일" : "SMS"} 발송 내역
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div
                className="overflow-y-auto px-6 py-6"
                style={{ maxHeight: "calc(90vh - 140px)" }}
              >
                <div className="space-y-6">
                  {/* 상태 및 기본 정보 */}
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">기본 정보</h3>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium",
                          statusConfig.className,
                        )}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {statusConfig.label}
                      </span>
                    </div>

                    <div className="grid gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-1">
                          템플릿
                        </p>
                        <p className="text-sm font-semibold text-white">
                          {notification.templateName}
                        </p>
                      </div>

                      {notification.subject && (
                        <div>
                          <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-1">
                            제목
                          </p>
                          <p className="text-sm text-white">{notification.subject}</p>
                        </div>
                      )}

                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-1">
                          발송 타입
                        </p>
                        <p className="text-sm text-white">
                          {notification.type === "email" ? "메일" : "SMS"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 수신자 정보 */}
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                    <div className="flex items-center gap-2 mb-4">
                      <Users className="h-5 w-5 text-emerald-300" />
                      <h3 className="text-lg font-semibold text-white">
                        수신자 ({notification.recipients.length}명)
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {notification.recipients.map((recipient, index) => (
                        <div
                          key={index}
                          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                        >
                          {recipient}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 발송 일정 */}
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                    <div className="flex items-center gap-2 mb-4">
                      <Calendar className="h-5 w-5 text-blue-300" />
                      <h3 className="text-lg font-semibold text-white">발송 일정</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-1">
                          예약 시간
                        </p>
                        <p className="text-sm text-white">
                          {notification.scheduledAt.toLocaleString("ko-KR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      {notification.sentAt && (
                        <div>
                          <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-1">
                            발송 시간
                          </p>
                          <p className="text-sm text-white">
                            {notification.sentAt.toLocaleString("ko-KR", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-1">
                          생성일
                        </p>
                        <p className="text-sm text-white">
                          {notification.createdAt.toLocaleString("ko-KR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 내용 미리보기 */}
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                    <h3 className="text-lg font-semibold text-white mb-4">내용 미리보기</h3>
                    <div className="rounded-lg border border-white/10 bg-slate-950/60 p-4 max-h-60 overflow-y-auto">
                      {notification.type === "email" ? (
                        <div
                          className="text-sm text-slate-300 prose prose-invert max-w-none"
                          dangerouslySetInnerHTML={{ __html: notification.content }}
                        />
                      ) : (
                        <p className="text-sm text-slate-300 whitespace-pre-wrap">
                          {notification.content}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end border-t border-white/10 px-6 py-4">
                <button
                  onClick={onClose}
                  className="rounded-xl bg-emerald-500/20 px-6 py-2 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/30"
                >
                  닫기
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
