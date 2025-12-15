"use client";

import { useForm } from "react-hook-form";
import type { NotificationType } from "../model/templates";

export interface NotificationForm {
  type: NotificationType;
  templateId: string;
  recipients: string; // 쉼표로 구분된 이메일 주소 또는 전화번호
  subject: string; // 이메일만
  content: string; // 에디터로 작성한 내용
  scheduledDate: string;
  scheduledTime: string;
  sendImmediately: boolean;
}

const defaultValues: NotificationForm = {
  type: "email",
  templateId: "",
  recipients: "",
  subject: "",
  content: "",
  scheduledDate: "",
  scheduledTime: "",
  sendImmediately: false,
};

/**
 * 알림 발송 폼 관리를 위한 hook
 */
export function useNotificationForm() {
  const form = useForm<NotificationForm>({
    defaultValues,
    mode: "onChange",
  });

  const resetForm = () => {
    form.reset(defaultValues);
  };

  return {
    form,
    resetForm,
    watch: form.watch,
  };
}
