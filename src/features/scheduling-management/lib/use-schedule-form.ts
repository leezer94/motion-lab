"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";

export type RepeatType = "none" | "weekly" | "biweekly";

export interface ScheduleFormData {
  courseId: string;
  courseTitle: string;
  instructorId: string;
  instructorName: string;
  platformId: string;
  platformName: string;
  startDate: Date;
  endDate: Date;
  startTime: string; // HH:mm 형식
  endTime: string; // HH:mm 형식
  dayOfWeek: number[]; // 선택된 요일들 (0: 일요일, 1: 월요일, ...)
  repeatType: RepeatType;
  maxCapacity: number;
  status: "draft" | "confirmed";
}

const defaultValues: ScheduleFormData = {
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
};

/**
 * 일정 생성 폼 관리를 위한 hook
 */
export function useScheduleForm() {
  const form = useForm<ScheduleFormData>({
    defaultValues,
    mode: "onChange",
  });

  const [isCheckingConflicts, setIsCheckingConflicts] = useState(false);
  const [conflicts, setConflicts] = useState<Array<{ type: string; message: string }>>([]);

  const resetForm = () => {
    form.reset(defaultValues);
    setConflicts([]);
  };

  return {
    form,
    isCheckingConflicts,
    conflicts,
    setConflicts,
    setIsCheckingConflicts,
    resetForm,
  };
}
