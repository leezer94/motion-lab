"use client";

import { useForm } from "react-hook-form";
import type { MemberRole, ApplicationStatus, CourseStatus } from "../model/members";

export interface MemberFilterForm {
  role: MemberRole | "all";
  status: "active" | "inactive" | "all";
  search: string;
  applicationStatus: ApplicationStatus | "all";
  courseStatus: CourseStatus | "all";
}

const defaultValues: MemberFilterForm = {
  role: "all",
  status: "all",
  search: "",
  applicationStatus: "all",
  courseStatus: "all",
};

/**
 * 멤버 필터 폼 관리를 위한 hook
 */
export function useMemberFilter() {
  const form = useForm<MemberFilterForm>({
    defaultValues,
    mode: "onChange",
  });

  const resetFilters = () => {
    form.reset(defaultValues);
  };

  return {
    form,
    resetFilters,
    watch: form.watch,
  };
}
