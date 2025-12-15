"use client";

import { useState, useEffect } from "react";
import { FormProvider } from "react-hook-form";
import { ExpenseSubmissionForm } from "./expense-submission-form";
import { useExpenseForm } from "../lib/use-expense-form";
import { mockInstructors, mockCourses } from "@/features/member-management/model/members";

/**
 * 비용 관리 페이지 메인 컨텐츠 컴포넌트
 */
export function ExpensePageContent() {
  const { form, setValue } = useExpenseForm();
  const [isMounted, setIsMounted] = useState(false);

  // Next.js Hydration 문제 해결을 위한 표준 패턴

  useEffect(() => {
    setIsMounted(true);
    // Mock 데이터로 기본 정보 설정
    if (mockInstructors.length > 0 && mockCourses.length > 0) {
      const instructor = mockInstructors[0];
      const course = mockCourses[0];
      setValue("instructorId", instructor.id, { shouldValidate: false });
      setValue("instructorName", instructor.name, { shouldValidate: false });
      setValue("courseId", course.id, { shouldValidate: false });
      setValue("courseTitle", course.title, { shouldValidate: false });
      // 입금 정보 기본값 설정 (예금주명은 강의자명으로 자동 설정)
      setValue("paymentInfo.accountHolder", instructor.name, { shouldValidate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isMounted) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-slate-400">로딩 중...</div>
      </div>
    );
  }

  return (
    <FormProvider {...form}>
      <ExpenseSubmissionForm />
    </FormProvider>
  );
}
