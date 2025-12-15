"use client";

import { useForm } from "react-hook-form";
import { useState, useEffect, useMemo } from "react";
import type { ExpenseForm } from "../model/expenses";

const defaultValues: ExpenseForm = {
  instructorId: "",
  instructorName: "",
  courseId: "",
  courseTitle: "",
  accommodation: {
    amount: 0,
    description: "",
    receiptFiles: [],
  },
  fuel: {
    amount: 0,
    description: "",
    receiptFiles: [],
  },
  lectureFee: {
    amount: 0,
    description: "",
  },
  paymentInfo: {
    accountHolder: "",
    bankName: "",
    accountNumber: "",
    memo: "",
  },
  totalAmount: 0,
  submittedAt: null,
  status: "draft",
};

/**
 * 비용 관리 폼 관리를 위한 hook
 */
export function useExpenseForm() {
  const form = useForm<ExpenseForm>({
    defaultValues,
    mode: "onChange",
  });

  const [uploadingFiles, setUploadingFiles] = useState<Record<string, boolean>>({});

  const watchValues = form.watch();

  // 총 금액 계산 (useMemo로 최적화)
  const totalAmount = useMemo(() => {
    return (
      (watchValues.accommodation?.amount || 0) +
      (watchValues.fuel?.amount || 0) +
      (watchValues.lectureFee?.amount || 0)
    );
  }, [watchValues.accommodation?.amount, watchValues.fuel?.amount, watchValues.lectureFee?.amount]);

  // 총 금액을 폼에 반영 (useEffect로 분리하여 무한 루프 방지)
  useEffect(() => {
    form.setValue("totalAmount", totalAmount, { shouldValidate: false });
  }, [totalAmount, form]);

  const resetForm = () => {
    form.reset(defaultValues);
  };

  return {
    form,
    watchValues,
    totalAmount,
    uploadingFiles,
    setUploadingFiles,
    resetForm,
    setValue: form.setValue,
  };
}
