"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { cn } from "@/design-system/utils/cn";
import type { Course } from "../model/members";

type ApplicationDialogProps = {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ApplicationFormData) => void;
  type?: "student" | "volunteer"; // 학생 또는 봉사자 신청 타입
};

type ApplicationFormData = {
  motivation: string;
  experience: string;
  availability: string;
};

/**
 * 강의 신청 팝업 다이얼로그 컴포넌트
 */
export function ApplicationDialog({
  course,
  isOpen,
  onClose,
  onSubmit,
  type = "student",
}: ApplicationDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ApplicationFormData>();

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = (data: ApplicationFormData) => {
    onSubmit(data);
    reset();
    onClose();
  };

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

  if (!course) return null;

  const isFull =
    type === "student"
      ? course.currentStudents >= course.maxStudents
      : course.currentVolunteers >= course.maxVolunteers;

  const currentCount = type === "student" ? course.currentStudents : course.currentVolunteers;
  const maxCount = type === "student" ? course.maxStudents : course.maxVolunteers;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />

          {/* Dialog */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-xl pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-white">{course.title}</h2>
                  <p className="mt-1 text-sm text-slate-400">{course.description}</p>
                  <div className="mt-3 flex gap-4 text-xs text-slate-400">
                    <span>강의자: {course.instructorName}</span>
                    <span>•</span>
                    <span>
                      신청 현황: {currentCount} / {maxCount}명
                    </span>
                    <span>•</span>
                    <span>시작일: {course.startDate.toLocaleDateString("ko-KR")}</span>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              {isFull ? (
                <div className="py-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
                    <X className="h-8 w-8 text-red-400" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-white">신청 마감</h3>
                  <p className="text-slate-400">죄송합니다. 이 강의는 정원이 마감되었습니다.</p>
                  <button
                    onClick={handleClose}
                    className="mt-6 rounded-xl bg-emerald-500/20 px-6 py-2.5 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/30"
                  >
                    확인
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      신청 동기 <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      {...register("motivation", {
                        required: "신청 동기를 입력해주세요.",
                        minLength: {
                          value: 10,
                          message: "최소 10자 이상 입력해주세요.",
                        },
                      })}
                      rows={4}
                      placeholder="이 강의를 신청하는 이유를 작성해주세요..."
                      className={cn(
                        "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500",
                        "focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/20",
                        errors.motivation &&
                          "border-red-400/50 focus:border-red-400/50 focus:ring-red-400/20",
                      )}
                    />
                    {errors.motivation && (
                      <p className="mt-1 text-xs text-red-400">{errors.motivation.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      관련 경험
                    </label>
                    <textarea
                      {...register("experience")}
                      rows={3}
                      placeholder="관련 경험이나 배경 지식을 작성해주세요 (선택사항)..."
                      className={cn(
                        "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500",
                        "focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/20",
                      )}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      참여 가능 시간 <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("availability", {
                        required: "참여 가능 시간을 입력해주세요.",
                      })}
                      placeholder="예: 평일 오후 2시~5시"
                      className={cn(
                        "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500",
                        "focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/20",
                        errors.availability &&
                          "border-red-400/50 focus:border-red-400/50 focus:ring-red-400/20",
                      )}
                    />
                    {errors.availability && (
                      <p className="mt-1 text-xs text-red-400">{errors.availability.message}</p>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      className="flex-1 rounded-xl bg-emerald-500/20 px-4 py-3 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/30"
                    >
                      제출
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
