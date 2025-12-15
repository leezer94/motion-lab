"use client";

import { useForm } from "react-hook-form";
import type { LogsFilterForm } from "../model/logs";

const defaultValues: LogsFilterForm = {
  workflowName: "",
  status: "all",
  level: "all",
  dateFrom: "",
  dateTo: "",
};

/**
 * 로그 필터 폼 관리를 위한 hook
 */
export function useLogsFilter() {
  const form = useForm<LogsFilterForm>({
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
