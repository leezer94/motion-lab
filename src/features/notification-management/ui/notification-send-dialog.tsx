"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useFormContext } from "react-hook-form";
import { X, Send, Calendar, Clock, Users } from "lucide-react";
import { cn } from "@/design-system/utils/cn";
import { RichTextEditor } from "./rich-text-editor";
import { TemplateSelector } from "./template-selector";
import type { NotificationForm } from "../lib/use-notification-form";
import { mockEmailTemplates, mockSMSTemplates } from "../model/templates";

type NotificationSendDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  type: "email" | "sms";
};

/**
 * 알림 발송 다이얼로그 컴포넌트
 */
export function NotificationSendDialog({ isOpen, onClose, type }: NotificationSendDialogProps) {
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useFormContext<NotificationForm>();

  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const watchValues = watch();

  // 타입 설정
  useEffect(() => {
    setValue("type", type);
  }, [type, setValue]);

  // 다이얼로그 열림/닫힘에 따라 body 스크롤 제어
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  const selectedTemplateId = watchValues.templateId;

  // 템플릿 선택 시 내용 자동 채우기
  const handleTemplateSelect = (templateId: string) => {
    setValue("templateId", templateId);
    const template =
      type === "email"
        ? mockEmailTemplates.find((t) => t.id === templateId)
        : mockSMSTemplates.find((t) => t.id === templateId);

    if (template) {
      if (type === "email") {
        setValue("subject", (template as (typeof mockEmailTemplates)[0]).subject);
        setValue("content", (template as (typeof mockEmailTemplates)[0]).content);
      } else {
        setValue("content", (template as (typeof mockSMSTemplates)[0]).content);
      }
    }
  };

  const onSubmit = async (data: NotificationForm) => {
    try {
      // 실제로는 API 호출
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("알림 발송:", data);
      setSubmitStatus("success");

      // 성공 후 2초 뒤 모달 닫기
      setTimeout(() => {
        reset();
        setSubmitStatus("idle");
        onClose();
      }, 2000);
    } catch {
      setSubmitStatus("error");
    }
  };

  const recipientsArray = watchValues.recipients
    .split(",")
    .map((r) => r.trim())
    .filter((r) => r.length > 0);

  const isFormValid =
    selectedTemplateId &&
    recipientsArray.length > 0 &&
    (type === "sms" || watchValues.subject) &&
    watchValues.content &&
    (watchValues.sendImmediately || (watchValues.scheduledDate && watchValues.scheduledTime));

  if (!isOpen) return null;

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
              className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl border border-white/10 bg-slate-900/95 shadow-2xl backdrop-blur-xl pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                <div>
                  <h2 className="text-2xl font-semibold text-white">
                    {type === "email" ? "메일 발송" : "SMS 발송"}
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    템플릿을 선택하고 수신자를 지정하여 발송하세요.
                  </p>
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
                style={{
                  maxHeight: "calc(90vh - 140px)",
                  scrollbarGutter: "stable",
                }}
              >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* 템플릿 선택 */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      템플릿 선택 <span className="text-red-400">*</span>
                    </label>
                    <TemplateSelector
                      type={type}
                      emailTemplates={mockEmailTemplates}
                      smsTemplates={mockSMSTemplates}
                      selectedTemplateId={selectedTemplateId}
                      onSelectTemplate={handleTemplateSelect}
                    />
                    {errors.templateId && (
                      <p className="mt-1 text-xs text-red-400">{errors.templateId.message}</p>
                    )}
                  </div>

                  {/* 수신자 */}
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
                      <Users className="h-4 w-4" />
                      수신자 <span className="text-red-400">*</span>
                      <span className="ml-auto text-xs text-slate-400">
                        ({recipientsArray.length}명)
                      </span>
                    </label>
                    <textarea
                      {...register("recipients", {
                        required: "수신자를 입력해주세요.",
                        validate: (value) => {
                          const recipients = value
                            .split(",")
                            .map((r) => r.trim())
                            .filter((r) => r);
                          if (recipients.length === 0) return "최소 1명의 수신자가 필요합니다.";
                          return true;
                        },
                      })}
                      rows={3}
                      placeholder={
                        type === "email"
                          ? "이메일 주소를 쉼표로 구분하여 입력하세요 (예: user1@example.com, user2@example.com)"
                          : "전화번호를 쉼표로 구분하여 입력하세요 (예: 010-1234-5678, 010-9876-5432)"
                      }
                      className={cn(
                        "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500",
                        "focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/20",
                        errors.recipients &&
                          "border-red-400/50 focus:border-red-400/50 focus:ring-red-400/20",
                      )}
                    />
                    {errors.recipients && (
                      <p className="mt-1 text-xs text-red-400">{errors.recipients.message}</p>
                    )}
                  </div>

                  {/* 제목 (이메일만) */}
                  {type === "email" && (
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-300">
                        제목 <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        {...register("subject", {
                          required: "제목을 입력해주세요.",
                        })}
                        placeholder="메일 제목을 입력하세요"
                        className={cn(
                          "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500",
                          "focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/20",
                          errors.subject &&
                            "border-red-400/50 focus:border-red-400/50 focus:ring-red-400/20",
                        )}
                      />
                      {errors.subject && (
                        <p className="mt-1 text-xs text-red-400">{errors.subject.message}</p>
                      )}
                    </div>
                  )}

                  {/* 내용 */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      내용 <span className="text-red-400">*</span>
                    </label>
                    {type === "email" ? (
                      <RichTextEditor
                        value={watchValues.content}
                        onChange={(value) => setValue("content", value)}
                        placeholder="메일 내용을 작성하세요..."
                      />
                    ) : (
                      <textarea
                        {...register("content", {
                          required: "내용을 입력해주세요.",
                          maxLength: {
                            value: 2000,
                            message: "SMS는 최대 2000자까지 입력 가능합니다.",
                          },
                        })}
                        rows={6}
                        placeholder="SMS 내용을 작성하세요... (최대 2000자)"
                        className={cn(
                          "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500",
                          "focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/20",
                          errors.content &&
                            "border-red-400/50 focus:border-red-400/50 focus:ring-red-400/20",
                        )}
                      />
                    )}
                    {errors.content && (
                      <p className="mt-1 text-xs text-red-400">{errors.content.message}</p>
                    )}
                    {type === "sms" && watchValues.content && (
                      <p className="mt-1 text-xs text-slate-400">
                        {watchValues.content.length} / 2000자
                      </p>
                    )}
                  </div>

                  {/* 발송 옵션 */}
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="space-y-4">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          {...register("sendImmediately")}
                          className="h-4 w-4 rounded border-white/20 bg-white/5 text-emerald-500 focus:ring-emerald-400/50"
                        />
                        <span className="text-sm font-medium text-white">즉시 발송</span>
                      </label>

                      {!watchValues.sendImmediately && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="grid gap-4 md:grid-cols-2"
                        >
                          <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
                              <Calendar className="h-4 w-4" />
                              발송 일자 <span className="text-red-400">*</span>
                            </label>
                            <input
                              type="date"
                              {...register("scheduledDate", {
                                required: !watchValues.sendImmediately
                                  ? "발송 일자를 선택해주세요."
                                  : false,
                              })}
                              min={new Date().toISOString().split("T")[0]}
                              className={cn(
                                "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white",
                                "focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/20",
                              )}
                            />
                          </div>
                          <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
                              <Clock className="h-4 w-4" />
                              발송 시간 <span className="text-red-400">*</span>
                            </label>
                            <input
                              type="time"
                              {...register("scheduledTime", {
                                required: !watchValues.sendImmediately
                                  ? "발송 시간을 선택해주세요."
                                  : false,
                              })}
                              className={cn(
                                "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white",
                                "focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/20",
                              )}
                            />
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* 제출 버튼 */}
                  <div className="flex gap-3 border-t border-white/10 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      disabled={!isFormValid || isSubmitting}
                      className={cn(
                        "flex items-center justify-center gap-2 flex-1 rounded-xl bg-emerald-500/20 px-6 py-3 text-sm font-semibold text-emerald-300 transition",
                        "hover:bg-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed",
                      )}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-300 border-t-transparent" />
                          발송 중...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          {watchValues.sendImmediately ? "즉시 발송" : "스케줄링"}
                        </>
                      )}
                    </button>
                  </div>

                  {/* 제출 결과 */}
                  <AnimatePresence>
                    {submitStatus === "success" && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="rounded-full bg-emerald-500/20 p-2">
                            <Send className="h-5 w-5 text-emerald-300" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-emerald-300">발송 완료</h4>
                            <p className="mt-1 text-sm text-slate-300">
                              {watchValues.sendImmediately
                                ? "메일이 성공적으로 발송되었습니다."
                                : "스케줄이 등록되었습니다."}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
