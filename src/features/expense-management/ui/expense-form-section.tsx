"use client";

import { useFormContext } from "react-hook-form";
import { Upload, X, FileText, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/design-system/utils/cn";
import type { ExpenseForm } from "../model/expenses";

type ExpenseFormSectionProps = {
  type: "accommodation" | "fuel" | "lectureFee";
  label: string;
  maxAmount: number;
  requiresReceipt: boolean;
  fileLimit?: number;
  maxFileSize?: number;
  allowedTypes?: string[];
  isOptional?: boolean; // 옵셔널 여부 (숙박비만)
};

/**
 * 비용 항목별 폼 섹션 컴포넌트
 */
export function ExpenseFormSection({
  type,
  label,
  maxAmount,
  requiresReceipt,
  fileLimit = 0,
  maxFileSize = 10 * 1024 * 1024,
  allowedTypes = [],
  isOptional = false,
}: ExpenseFormSectionProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ExpenseForm>();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const amount = watch(`${type}.amount`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formFiles = watch(`${type}.receiptFiles` as any) as File[] | undefined;
  const [files, setFiles] = useState<File[]>(formFiles || []);
  const [isEnabled, setIsEnabled] = useState<boolean>(type === "accommodation" ? amount > 0 : true);

  // form의 파일 값과 동기화
  useEffect(() => {
    if (formFiles) {
      setFiles(formFiles);
    }
  }, [formFiles]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles: File[] = [];

    selectedFiles.forEach((file) => {
      // 파일 타입 검증
      if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
        alert(`${file.name}: 허용되지 않은 파일 형식입니다.`);
        return;
      }

      // 파일 크기 검증
      if (file.size > maxFileSize) {
        alert(`${file.name}: 파일 크기가 너무 큽니다. (최대 ${maxFileSize / 1024 / 1024}MB)`);
        return;
      }

      // 파일 개수 제한
      if (fileLimit > 0 && files.length + validFiles.length >= fileLimit) {
        alert(`최대 ${fileLimit}개까지 첨부할 수 있습니다.`);
        return;
      }

      validFiles.push(file);
    });

    const newFiles = [...files, ...validFiles];
    setFiles(newFiles);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue(`${type}.receiptFiles` as any, newFiles);
  };

  const handleFileRemove = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue(`${type}.receiptFiles` as any, newFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  // 숙박비 체크박스 변경 핸들러
  const handleAccommodationToggle = (checked: boolean) => {
    setIsEnabled(checked);
    if (checked) {
      // 체크되면 8만원 자동 입력
      setValue(`${type}.amount`, 80000, { shouldValidate: false });
    } else {
      // 체크 해제되면 0원
      setValue(`${type}.amount`, 0, { shouldValidate: false });
      setValue(`${type}.description`, "", { shouldValidate: false });
    }
  };

  const isOverLimit = amount > maxAmount;
  const showMaxAmount = maxAmount !== Infinity;

  return (
    <motion.div
      layout
      className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur transition-all hover:border-white/20"
    >
      <div className="p-6">
        {/* 헤더 - 항상 표시 */}
        <div className="mb-4 flex items-center justify-between">
          <div className="min-h-12 flex flex-col justify-center">
            <h3 className="text-lg font-semibold text-white">{label}</h3>
            <AnimatePresence mode="wait">
              {isOptional && !isEnabled ? (
                <motion.p
                  key="hint-disabled"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-1 text-xs text-slate-400"
                >
                  선택 시 기본 80,000원이 적용됩니다
                </motion.p>
              ) : isOptional && isEnabled ? (
                <motion.p
                  key="hint-enabled"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-1 text-xs text-emerald-400"
                >
                  80,000원이 자동으로 적용됩니다
                </motion.p>
              ) : null}
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-4">
            {isOptional && (
              <label className="relative flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={isEnabled}
                  onChange={(e) => handleAccommodationToggle(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={cn(
                    "relative h-7 w-12 rounded-full transition-all duration-300 ease-in-out",
                    isEnabled
                      ? "bg-emerald-500/30 shadow-lg shadow-emerald-500/20"
                      : "bg-slate-700/50",
                  )}
                >
                  <motion.div
                    className={cn(
                      "absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-colors",
                      isEnabled && "bg-emerald-400",
                    )}
                    initial={false}
                    animate={{
                      x: isEnabled ? 20 : 2,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                  >
                    {isEnabled && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex h-full items-center justify-center"
                      >
                        <Check className="h-3.5 w-3.5 text-emerald-700" />
                      </motion.div>
                    )}
                  </motion.div>
                </div>
                <span className="text-sm font-medium text-slate-300">숙박비 신청</span>
              </label>
            )}
            {showMaxAmount && (
              <span className="text-xs text-slate-400">최대 {maxAmount.toLocaleString()}원</span>
            )}
          </div>
        </div>

        {/* 폼 컨텐츠 - AnimatePresence로 부드럽게 전환 */}
        <AnimatePresence initial={false}>
          {(!isOptional || isEnabled) && (
            <motion.div
              key="form-content"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="overflow-hidden"
            >
              <div className="space-y-4">
                {/* 금액 입력 */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    금액 {!isOptional && <span className="text-red-400">*</span>}
                  </label>
                  {type === "accommodation" && isOptional ? (
                    // 숙박비는 옵셔널이고 선택되면 8만원 고정
                    <div className="relative">
                      <input
                        type="text"
                        value="80,000원"
                        readOnly
                        aria-label="숙박비 금액 (80,000원 고정)"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pl-12 text-sm text-slate-400"
                      />
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                        ₩
                      </span>
                      <input
                        type="hidden"
                        {...register(`${type}.amount`, {
                          value: isEnabled ? 80000 : 0,
                          valueAsNumber: true,
                        })}
                      />
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="number"
                        {...register(`${type}.amount`, {
                          required: "금액을 입력해주세요.",
                          min: { value: 0, message: "0원 이상 입력해주세요." },
                          max: showMaxAmount
                            ? {
                                value: maxAmount,
                                message: `최대 ${maxAmount.toLocaleString()}원까지 입력 가능합니다.`,
                              }
                            : undefined,
                          valueAsNumber: true,
                        })}
                        placeholder="0"
                        className={cn(
                          "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pl-12 text-sm text-white placeholder:text-slate-500",
                          "focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/20",
                          isOverLimit &&
                            "border-red-400/50 focus:border-red-400/50 focus:ring-red-400/20",
                        )}
                      />
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                        ₩
                      </span>
                      {amount > 0 && (
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                          {amount.toLocaleString()}원
                        </span>
                      )}
                    </div>
                  )}
                  {errors[type]?.amount && (
                    <p className="mt-1 text-xs text-red-400">{errors[type]?.amount?.message}</p>
                  )}
                  {isOverLimit && (
                    <p className="mt-1 text-xs text-red-400">
                      최대 금액({maxAmount.toLocaleString()}원)을 초과했습니다.
                    </p>
                  )}
                </div>

                {/* 설명 입력 */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    비고/설명 {requiresReceipt && <span className="text-red-400">*</span>}
                  </label>
                  <textarea
                    {...register(`${type}.description`, {
                      required: requiresReceipt ? "설명을 입력해주세요." : false,
                    })}
                    rows={3}
                    placeholder="비용 발생 내역을 작성해주세요..."
                    className={cn(
                      "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500",
                      "focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/20",
                    )}
                  />
                  {errors[type]?.description && (
                    <p className="mt-1 text-xs text-red-400">
                      {errors[type]?.description?.message}
                    </p>
                  )}
                </div>

                {/* 증빙자료 첨부 (유류비만) */}
                {requiresReceipt && fileLimit > 0 && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      증빙자료 첨부 <span className="text-red-400">*</span>
                      <span className="ml-2 text-xs text-slate-400">
                        (최대 {fileLimit}개, {formatFileSize(maxFileSize)} 이하)
                      </span>
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept={allowedTypes.join(",")}
                      onChange={handleFileSelect}
                      aria-label="증빙자료 파일 선택"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={files.length >= fileLimit}
                      className={cn(
                        "flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 bg-white/5 px-4 py-3 text-sm text-slate-300 transition",
                        "hover:border-emerald-400/50 hover:bg-white/10 hover:text-white",
                        files.length >= fileLimit && "opacity-50 cursor-not-allowed",
                      )}
                    >
                      <Upload className="h-4 w-4" />
                      파일 선택 ({files.length}/{fileLimit})
                    </button>

                    {/* 첨부된 파일 목록 */}
                    {files.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {files.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-slate-400" />
                              <div>
                                <p className="text-xs font-medium text-white">{file.name}</p>
                                <p className="text-xs text-slate-400">
                                  {formatFileSize(file.size)}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleFileRemove(index)}
                              aria-label={`${file.name} 파일 제거`}
                              className="rounded-lg p-1 text-slate-400 transition hover:bg-red-500/20 hover:text-red-400"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {files.length === 0 && (
                      <p className="mt-2 text-xs text-slate-400">
                        증빙자료를 첨부해주세요. (이미지 또는 PDF)
                      </p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
