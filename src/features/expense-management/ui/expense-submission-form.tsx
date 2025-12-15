"use client";

import { useFormContext } from "react-hook-form";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { cn } from "@/design-system/utils/cn";
import { ExpenseFormSection } from "./expense-form-section";
import { expenseConfig } from "../model/expenses";
import { mockCourses } from "@/features/member-management/model/members";
import type { ExpenseForm } from "../model/expenses";

/**
 * 비용 제출 폼 컴포넌트 (구글폼 스타일)
 */
function ExpenseFormContent() {
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors, isSubmitting },
    watch,
  } = useFormContext<ExpenseForm>();

  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const watchValues = watch();

  const totalAmount = useMemo(
    () =>
      (watchValues.accommodation?.amount || 0) +
      (watchValues.fuel?.amount || 0) +
      (watchValues.lectureFee?.amount || 0),
    [watchValues.accommodation?.amount, watchValues.fuel?.amount, watchValues.lectureFee?.amount],
  );

  const onSubmit = async (data: ExpenseForm) => {
    try {
      // 실제로는 API 호출
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("비용 제출:", data);
      setSubmitStatus("success");
    } catch {
      setSubmitStatus("error");
    }
  };

  const isFormValid =
    (watchValues.accommodation?.amount || 0) >= 0 && // 숙박비는 옵셔널이므로 >= 0
    watchValues.fuel?.amount > 0 &&
    watchValues.fuel?.receiptFiles?.length > 0 &&
    watchValues.lectureFee?.amount > 0 &&
    watchValues.paymentInfo?.accountHolder &&
    watchValues.paymentInfo?.bankName &&
    watchValues.paymentInfo?.accountNumber;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 기본 정보 */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <h3 className="mb-4 text-lg font-semibold text-white">기본 정보</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">강의자명</label>
            <input
              type="text"
              value={watchValues.instructorName || ""}
              readOnly
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-400"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              강의명 <span className="text-red-400">*</span>
            </label>
            <select
              {...register("courseId", {
                required: "강의를 선택해주세요.",
                onChange: (e) => {
                  const selectedCourse = mockCourses.find((c) => c.id === e.target.value);
                  if (selectedCourse) {
                    setValue("courseTitle", selectedCourse.title);
                  }
                },
              })}
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
        </div>
      </div>

      {/* 숙박비 (옵셔널) */}
      <ExpenseFormSection
        type="accommodation"
        label={expenseConfig.accommodation.label}
        maxAmount={expenseConfig.accommodation.maxAmount}
        requiresReceipt={expenseConfig.accommodation.requiresReceipt}
        fileLimit={expenseConfig.accommodation.fileLimit}
        isOptional={true}
      />

      {/* 유류비 */}
      <ExpenseFormSection
        type="fuel"
        label={expenseConfig.fuel.label}
        maxAmount={expenseConfig.fuel.maxAmount}
        requiresReceipt={expenseConfig.fuel.requiresReceipt}
        fileLimit={expenseConfig.fuel.fileLimit}
        maxFileSize={expenseConfig.fuel.maxFileSize}
        allowedTypes={expenseConfig.fuel.allowedTypes}
      />

      {/* 강의료 */}
      <ExpenseFormSection
        type="lectureFee"
        label={expenseConfig.lectureFee.label}
        maxAmount={expenseConfig.lectureFee.maxAmount}
        requiresReceipt={expenseConfig.lectureFee.requiresReceipt}
        fileLimit={expenseConfig.lectureFee.fileLimit}
      />

      {/* 총 금액 요약 */}
      <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-6 backdrop-blur">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-emerald-300">총 지출 금액</span>
          <span className="text-3xl font-bold text-white">{totalAmount.toLocaleString()}원</span>
        </div>
        <div className="mt-4 grid gap-2 text-sm text-slate-300">
          <div className="flex justify-between">
            <span>숙박비:</span>
            <span>{(watchValues.accommodation?.amount || 0).toLocaleString()}원</span>
          </div>
          <div className="flex justify-between">
            <span>유류비:</span>
            <span>{(watchValues.fuel?.amount || 0).toLocaleString()}원</span>
          </div>
          <div className="flex justify-between">
            <span>강의료:</span>
            <span>{(watchValues.lectureFee?.amount || 0).toLocaleString()}원</span>
          </div>
        </div>
      </div>

      {/* 입금 정보 */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <h3 className="mb-4 text-lg font-semibold text-white">입금 정보</h3>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                예금주명 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                {...register("paymentInfo.accountHolder", {
                  required: "예금주명을 입력해주세요.",
                })}
                placeholder="홍길동"
                className={cn(
                  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500",
                  "focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/20",
                  errors.paymentInfo?.accountHolder &&
                    "border-red-400/50 focus:border-red-400/50 focus:ring-red-400/20",
                )}
              />
              {errors.paymentInfo?.accountHolder && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.paymentInfo.accountHolder.message}
                </p>
              )}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                은행명 <span className="text-red-400">*</span>
              </label>
              <select
                {...register("paymentInfo.bankName", {
                  required: "은행을 선택해주세요.",
                })}
                className={cn(
                  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white",
                  "focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/20",
                  errors.paymentInfo?.bankName &&
                    "border-red-400/50 focus:border-red-400/50 focus:ring-red-400/20",
                )}
              >
                <option value="">은행을 선택하세요</option>
                <option value="KB국민은행">KB국민은행</option>
                <option value="신한은행">신한은행</option>
                <option value="우리은행">우리은행</option>
                <option value="하나은행">하나은행</option>
                <option value="NH농협은행">NH농협은행</option>
                <option value="카카오뱅크">카카오뱅크</option>
                <option value="토스뱅크">토스뱅크</option>
                <option value="IBK기업은행">IBK기업은행</option>
                <option value="SC제일은행">SC제일은행</option>
                <option value="케이뱅크">케이뱅크</option>
                <option value="새마을금고">새마을금고</option>
                <option value="신협">신협</option>
                <option value="우체국">우체국</option>
              </select>
              {errors.paymentInfo?.bankName && (
                <p className="mt-1 text-xs text-red-400">{errors.paymentInfo.bankName.message}</p>
              )}
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              계좌번호 <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              {...register("paymentInfo.accountNumber", {
                required: "계좌번호를 입력해주세요.",
                pattern: {
                  value: /^[0-9-]+$/,
                  message: "계좌번호는 숫자와 하이픈(-)만 입력 가능합니다.",
                },
              })}
              placeholder="123-456-789012"
              className={cn(
                "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500",
                "focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/20",
                errors.paymentInfo?.accountNumber &&
                  "border-red-400/50 focus:border-red-400/50 focus:ring-red-400/20",
              )}
            />
            {errors.paymentInfo?.accountNumber && (
              <p className="mt-1 text-xs text-red-400">
                {errors.paymentInfo.accountNumber.message}
              </p>
            )}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              입금 메모 <span className="text-xs text-slate-400">(선택)</span>
            </label>
            <input
              type="text"
              {...register("paymentInfo.memo")}
              placeholder="강의료 입금 등"
              className={cn(
                "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500",
                "focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/20",
              )}
            />
          </div>
        </div>
      </div>

      {/* 봉사자 안내 */}
      <div className="rounded-2xl border border-blue-400/30 bg-blue-500/10 p-4 backdrop-blur">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-blue-500/20 p-2">
            <CheckCircle className="h-5 w-5 text-blue-300" />
          </div>
          <div>
            <h4 className="font-semibold text-blue-300">봉사자 안내</h4>
            <p className="mt-1 text-sm text-slate-300">
              봉사자는 무료봉사로 진행되며, 비용 관리가 필요하지 않습니다.
            </p>
          </div>
        </div>
      </div>

      {/* 제출 버튼 */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className={cn(
            "flex-1 rounded-xl bg-emerald-500/20 px-6 py-4 text-sm font-semibold text-emerald-300 transition",
            "hover:bg-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed",
          )}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              제출 중...
            </span>
          ) : (
            "제출하기"
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
            className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-6 backdrop-blur"
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-emerald-300" />
              <div>
                <h4 className="font-semibold text-emerald-300">제출 완료</h4>
                <p className="mt-1 text-sm text-slate-300">
                  비용 관리가 성공적으로 제출되었습니다. 검토 후 승인 여부를 알려드리겠습니다.
                </p>
              </div>
            </div>
          </motion.div>
        )}
        {submitStatus === "error" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-2xl border border-red-400/30 bg-red-500/10 p-6 backdrop-blur"
          >
            <div className="flex items-center gap-3">
              <XCircle className="h-6 w-6 text-red-300" />
              <div>
                <h4 className="font-semibold text-red-300">제출 실패</h4>
                <p className="mt-1 text-sm text-slate-300">
                  제출 중 오류가 발생했습니다. 다시 시도해주세요.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}

/**
 * 비용 제출 폼 래퍼 컴포넌트
 */
export function ExpenseSubmissionForm() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-white">강의자 비용 관리</h1>
        <p className="mt-2 text-slate-400">
          강의 관련 비용을 입력하고 제출해주세요. 모든 항목을 정확히 작성해주시기 바랍니다.
        </p>
      </div>
      <ExpenseFormContent />
    </div>
  );
}
