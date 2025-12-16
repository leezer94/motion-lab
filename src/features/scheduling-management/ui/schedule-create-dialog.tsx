"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useForm, FormProvider } from "react-hook-form";
import { X, AlertTriangle, CheckCircle } from "lucide-react";
import { cn } from "@/design-system/utils/cn";
import { mockOnlinePlatforms } from "../model/scheduling";
import { mockCourses, mockInstructors } from "@/features/member-management/model/members";
import type { ScheduleFormData } from "../lib/use-schedule-form";

type ScheduleCreateDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ScheduleFormData) => void;
};

const weekDays = [
  { value: 0, label: "일", fullLabel: "일요일" },
  { value: 1, label: "월", fullLabel: "월요일" },
  { value: 2, label: "화", fullLabel: "화요일" },
  { value: 3, label: "수", fullLabel: "수요일" },
  { value: 4, label: "목", fullLabel: "목요일" },
  { value: 5, label: "금", fullLabel: "금요일" },
  { value: 6, label: "토", fullLabel: "토요일" },
];

/**
 * 일정 생성 다이얼로그 컴포넌트
 */
export function ScheduleCreateDialog({ isOpen, onClose, onSubmit }: ScheduleCreateDialogProps) {
  const form = useForm<ScheduleFormData>({
    defaultValues: {
      courseId: "",
      courseTitle: "",
      instructorId: "",
      instructorName: "",
      platformId: "",
      platformName: "",
      startDate: new Date(),
      endDate: new Date(),
      startTime: "09:00",
      endTime: "12:00",
      dayOfWeek: [],
      repeatType: "none",
      maxCapacity: 30,
      status: "draft",
    },
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  const watchValues = watch();
  const [conflicts, setConflicts] = useState<Array<{ type: string; message: string }>>([]);

  // 강의 선택 시 강의자 자동 설정
  useEffect(() => {
    if (watchValues.courseId) {
      const selectedCourse = mockCourses.find((c) => c.id === watchValues.courseId);
      if (selectedCourse) {
        setValue("courseTitle", selectedCourse.title);
        setValue("instructorId", selectedCourse.instructorId);
        const instructor = mockInstructors.find((i) => i.id === selectedCourse.instructorId);
        if (instructor) {
          setValue("instructorName", instructor.name);
        }
      }
    }
  }, [watchValues.courseId, setValue]);

  // 플랫폼 선택 시 플랫폼명 자동 설정
  useEffect(() => {
    if (watchValues.platformId) {
      const selectedPlatform = mockOnlinePlatforms.find((p) => p.id === watchValues.platformId);
      if (selectedPlatform) {
        setValue("platformName", selectedPlatform.name);
      }
    }
  }, [watchValues.platformId, setValue]);

  // 다이얼로그 열림/닫힘에 따라 body 스크롤 제어
  useEffect(() => {
    if (isOpen) {
      // 다이얼로그가 열릴 때 body 스크롤 막기
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        // 다이얼로그가 닫힐 때 원래 상태로 복원
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  // 충돌 체크 (간단한 예시)
  const checkConflicts = async () => {
    // 실제로는 서버에서 충돌을 체크해야 함
    await new Promise((resolve) => setTimeout(resolve, 500));

    const detectedConflicts: Array<{ type: string; message: string }> = [];

    // 예시: 플랫폼이 사용 불가능한 경우
    const selectedPlatform = mockOnlinePlatforms.find((p) => p.id === watchValues.platformId);
    if (selectedPlatform && !selectedPlatform.isAvailable) {
      detectedConflicts.push({
        type: "platform",
        message: `${selectedPlatform.name}은(는) 현재 사용 불가능합니다.`,
      });
    }

    setConflicts(detectedConflicts);
  };

  const onFormSubmit = async (data: ScheduleFormData) => {
    await checkConflicts();

    if (conflicts.length === 0) {
      onSubmit(data);
      form.reset();
      setConflicts([]);
      onClose();
    }
  };

  const handleDayToggle = (day: number) => {
    const currentDays = watchValues.dayOfWeek || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter((d) => d !== day)
      : [...currentDays, day].sort();
    setValue("dayOfWeek", newDays);
  };

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
              <FormProvider {...form}>
                <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                    <div>
                      <h2 className="text-2xl font-semibold text-white">일정 생성</h2>
                      <p className="mt-1 text-sm text-slate-400">
                        강의 일정을 생성하고 자동으로 충돌을 확인합니다.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={onClose}
                      aria-label="다이얼로그 닫기"
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Content */}
                  <div
                    className="overflow-y-auto px-6 py-6 space-y-6"
                    style={{ maxHeight: "calc(90vh - 180px)" }}
                  >
                    {/* 기본 정보 */}
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                      <h3 className="mb-4 text-lg font-semibold text-white">기본 정보</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-300">
                            강의 선택 <span className="text-red-400">*</span>
                          </label>
                          <select
                            {...register("courseId", { required: "강의를 선택해주세요." })}
                            className={cn(
                              "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white",
                              "focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/20",
                              errors.courseId &&
                                "border-red-400/50 focus:border-red-400/50 focus:ring-red-400/20",
                            )}
                          >
                            <option value="">강의를 선택하세요</option>
                            {mockCourses.map((course) => (
                              <option key={course.id} value={course.id}>
                                {course.title}
                              </option>
                            ))}
                          </select>
                          {errors.courseId && (
                            <p className="mt-1 text-xs text-red-400">{errors.courseId.message}</p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="instructor-name"
                            className="mb-2 block text-sm font-medium text-slate-300"
                          >
                            강의자
                          </label>
                          <input
                            id="instructor-name"
                            type="text"
                            value={watchValues.instructorName || ""}
                            readOnly
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-400"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 온라인 플랫폼 및 수용 인원 */}
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                      <h3 className="mb-4 text-lg font-semibold text-white">
                        온라인 플랫폼 및 수용 인원
                      </h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-300">
                            온라인 플랫폼 선택 <span className="text-red-400">*</span>
                          </label>
                          <select
                            {...register("platformId", {
                              required: "온라인 플랫폼을 선택해주세요.",
                            })}
                            className={cn(
                              "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white",
                              "focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/20",
                              errors.platformId &&
                                "border-red-400/50 focus:border-red-400/50 focus:ring-red-400/20",
                            )}
                          >
                            <option value="">플랫폼을 선택하세요</option>
                            {mockOnlinePlatforms.map((platform) => (
                              <option
                                key={platform.id}
                                value={platform.id}
                                disabled={!platform.isAvailable}
                              >
                                {platform.name} (최대 {platform.maxCapacity}명){" "}
                                {!platform.isAvailable && "(사용 불가)"}
                              </option>
                            ))}
                          </select>
                          {errors.platformId && (
                            <p className="mt-1 text-xs text-red-400">{errors.platformId.message}</p>
                          )}
                          {watchValues.platformId && (
                            <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-400">
                              {mockOnlinePlatforms
                                .find((p) => p.id === watchValues.platformId)
                                ?.features.map((feature, idx) => (
                                  <span
                                    key={idx}
                                    className="rounded-full bg-slate-700/50 px-2 py-1"
                                  >
                                    {feature === "recording"
                                      ? "녹화"
                                      : feature === "breakout_rooms"
                                        ? "그룹방"
                                        : feature === "screen_share"
                                          ? "화면공유"
                                          : feature === "chat"
                                            ? "채팅"
                                            : feature === "polling"
                                              ? "설문"
                                              : feature === "whiteboard"
                                                ? "화이트보드"
                                                : feature}
                                  </span>
                                ))}
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-300">
                            최대 수용 인원 <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="number"
                            {...register("maxCapacity", {
                              required: "수용 인원을 입력해주세요.",
                              min: { value: 1, message: "1명 이상 입력해주세요." },
                              max: {
                                value:
                                  mockOnlinePlatforms.find((p) => p.id === watchValues.platformId)
                                    ?.maxCapacity || 300,
                                message: "플랫폼 최대 수용 인원을 초과할 수 없습니다.",
                              },
                              valueAsNumber: true,
                            })}
                            className={cn(
                              "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white",
                              "focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/20",
                              errors.maxCapacity &&
                                "border-red-400/50 focus:border-red-400/50 focus:ring-red-400/20",
                            )}
                          />
                          {errors.maxCapacity && (
                            <p className="mt-1 text-xs text-red-400">
                              {errors.maxCapacity.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 일정 기간 */}
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                      <h3 className="mb-4 text-lg font-semibold text-white">일정 기간</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-300">
                            시작일 <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="date"
                            {...register("startDate", {
                              required: "시작일을 선택해주세요.",
                              valueAsDate: true,
                            })}
                            className={cn(
                              "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white",
                              "focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/20",
                              errors.startDate &&
                                "border-red-400/50 focus:border-red-400/50 focus:ring-red-400/20",
                            )}
                          />
                          {errors.startDate && (
                            <p className="mt-1 text-xs text-red-400">{errors.startDate.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-300">
                            종료일 <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="date"
                            {...register("endDate", {
                              required: "종료일을 선택해주세요.",
                              valueAsDate: true,
                              validate: (value) => {
                                const startDate = watchValues.startDate;
                                if (startDate && value < startDate) {
                                  return "종료일은 시작일 이후여야 합니다.";
                                }
                                return true;
                              },
                            })}
                            className={cn(
                              "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white",
                              "focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/20",
                              errors.endDate &&
                                "border-red-400/50 focus:border-red-400/50 focus:ring-red-400/20",
                            )}
                          />
                          {errors.endDate && (
                            <p className="mt-1 text-xs text-red-400">{errors.endDate.message}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 시간 및 요일 */}
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                      <h3 className="mb-4 text-lg font-semibold text-white">시간 및 요일</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-300">
                            시작 시간 <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="time"
                            {...register("startTime", { required: "시작 시간을 선택해주세요." })}
                            className={cn(
                              "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white",
                              "focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/20",
                              errors.startTime &&
                                "border-red-400/50 focus:border-red-400/50 focus:ring-red-400/20",
                            )}
                          />
                          {errors.startTime && (
                            <p className="mt-1 text-xs text-red-400">{errors.startTime.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-300">
                            종료 시간 <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="time"
                            {...register("endTime", {
                              required: "종료 시간을 선택해주세요.",
                              validate: (value) => {
                                const startTime = watchValues.startTime;
                                if (startTime && value <= startTime) {
                                  return "종료 시간은 시작 시간 이후여야 합니다.";
                                }
                                return true;
                              },
                            })}
                            className={cn(
                              "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white",
                              "focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/20",
                              errors.endTime &&
                                "border-red-400/50 focus:border-red-400/50 focus:ring-red-400/20",
                            )}
                          />
                          {errors.endTime && (
                            <p className="mt-1 text-xs text-red-400">{errors.endTime.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="mb-2 block text-sm font-medium text-slate-300">
                          요일 선택 <span className="text-red-400">*</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {weekDays.map((day) => {
                            const isSelected = watchValues.dayOfWeek?.includes(day.value);
                            return (
                              <button
                                key={day.value}
                                type="button"
                                onClick={() => handleDayToggle(day.value)}
                                className={cn(
                                  "rounded-xl px-4 py-2 text-sm font-semibold transition",
                                  isSelected
                                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                    : "bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 hover:text-white",
                                )}
                              >
                                {day.label}
                              </button>
                            );
                          })}
                        </div>
                        {errors.dayOfWeek && (
                          <p className="mt-1 text-xs text-red-400">
                            {errors.dayOfWeek.message || "최소 1개 이상의 요일을 선택해주세요."}
                          </p>
                        )}
                        {watchValues.dayOfWeek && watchValues.dayOfWeek.length === 0 && (
                          <p className="mt-1 text-xs text-yellow-400">
                            최소 1개 이상의 요일을 선택해주세요.
                          </p>
                        )}
                      </div>

                      <div className="mt-4">
                        <label className="mb-2 block text-sm font-medium text-slate-300">
                          반복 설정
                        </label>
                        <select
                          {...register("repeatType")}
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
                        >
                          <option value="none">반복 없음</option>
                          <option value="weekly">매주 반복</option>
                          <option value="biweekly">격주 반복</option>
                        </select>
                      </div>
                    </div>

                    {/* 충돌 알림 */}
                    {conflicts.length > 0 && (
                      <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4 backdrop-blur">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="h-5 w-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-yellow-300 mb-2">충돌 감지</h4>
                            <ul className="space-y-1 text-sm text-yellow-200">
                              {conflicts.map((conflict, index) => (
                                <li key={index}>• {conflict.message}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-end gap-3 border-t border-white/10 px-6 py-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || conflicts.length > 0}
                      className={cn(
                        "flex items-center gap-2 rounded-xl bg-emerald-500/20 px-6 py-3 text-sm font-semibold text-emerald-300 transition",
                        "hover:bg-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed",
                      )}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-300 border-t-transparent" />
                          생성 중...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          일정 생성
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </FormProvider>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
