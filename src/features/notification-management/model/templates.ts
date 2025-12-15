/**
 * 알림 관리 데이터 타입 정의
 */

export type NotificationType = "email" | "sms";

export type NotificationStatus = "draft" | "scheduled" | "sent" | "failed";

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string; // HTML content
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SMSTemplate {
  id: string;
  name: string;
  content: string; // 텍스트 내용
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScheduledNotification {
  id: string;
  type: NotificationType;
  templateId: string;
  templateName: string;
  recipients: string[]; // 이메일 주소 또는 전화번호
  subject?: string; // 이메일만
  content: string;
  scheduledAt: Date;
  sentAt: Date | null;
  status: NotificationStatus;
  createdAt: Date;
}

/**
 * Mock 메일 템플릿 데이터
 */
export const mockEmailTemplates: EmailTemplate[] = [
  {
    id: "email-1",
    name: "강의 안내 메일",
    subject: "[강의 안내] {{courseTitle}} 강의 시작 안내",
    content: `
      <p>안녕하세요, {{instructorName}}님</p>
      <p><strong>{{courseTitle}}</strong> 강의가 곧 시작됩니다.</p>
      <p><strong>강의 일정:</strong></p>
      <ul>
        <li>시작일: {{startDate}}</li>
        <li>장소: {{location}}</li>
      </ul>
      <p>감사합니다.</p>
    `,
    category: "강의 안내",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "email-2",
    name: "신청 승인 메일",
    subject: "[승인 완료] {{courseTitle}} 강의 신청이 승인되었습니다",
    content: `
      <p>안녕하세요, {{studentName}}님</p>
      <p><strong>{{courseTitle}}</strong> 강의 신청이 승인되었습니다.</p>
      <p>강의 시작 전까지 준비해주시기 바랍니다.</p>
      <p>감사합니다.</p>
    `,
    category: "신청 관리",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "email-3",
    name: "비용 관리 안내",
    subject: "[비용 관리] 강의자 비용 관리 안내",
    content: `
      <p>안녕하세요, {{instructorName}}님</p>
      <p>강의 관련 비용 관리를 위해 아래 링크에서 신청해주시기 바랍니다.</p>
      <p><a href="{{expenseLink}}">비용 관리 페이지로 이동</a></p>
      <p>감사합니다.</p>
    `,
    category: "비용 관리",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "email-4",
    name: "일반 공지",
    subject: "[공지] {{title}}",
    content: `
      <p>안녕하세요.</p>
      <p>{{content}}</p>
      <p>감사합니다.</p>
    `,
    category: "일반",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

/**
 * Mock SMS 템플릿 데이터
 */
export const mockSMSTemplates: SMSTemplate[] = [
  {
    id: "sms-1",
    name: "강의 시작 알림",
    content: "[{{courseTitle}}] 강의가 {{startDate}}에 시작됩니다. 장소: {{location}}",
    category: "강의 안내",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "sms-2",
    name: "신청 승인 알림",
    content: "[{{courseTitle}}] 강의 신청이 승인되었습니다. 강의 시작 전까지 준비해주세요.",
    category: "신청 관리",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "sms-3",
    name: "일반 알림",
    content: "{{content}}",
    category: "일반",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

/**
 * Mock 스케줄된 알림 데이터 생성 함수
 */
function generateMockNotifications(count: number): ScheduledNotification[] {
  const notifications: ScheduledNotification[] = [];
  const now = new Date();
  const emailTemplates = mockEmailTemplates;
  const smsTemplates = mockSMSTemplates;

  const sampleRecipients = {
    email: [
      "student1@example.com",
      "student2@example.com",
      "instructor1@example.com",
      "instructor2@example.com",
      "volunteer1@example.com",
      "admin@example.com",
      "manager@example.com",
    ],
    sms: [
      "010-1234-5678",
      "010-2345-6789",
      "010-3456-7890",
      "010-4567-8901",
      "010-5678-9012",
      "010-6789-0123",
    ],
  };

  const statuses: NotificationStatus[] = ["sent", "scheduled", "failed", "draft"];
  const statusWeights = [0.6, 0.25, 0.1, 0.05]; // sent가 가장 많음

  for (let i = 0; i < count; i++) {
    const type: NotificationType = i % 2 === 0 ? "email" : "sms";
    const templates = type === "email" ? emailTemplates : smsTemplates;
    const template = templates[Math.floor(Math.random() * templates.length)];
    const recipients = sampleRecipients[type];
    const recipientCount = Math.floor(Math.random() * 5) + 1;
    const selectedRecipients = recipients.sort(() => Math.random() - 0.5).slice(0, recipientCount);

    // 상태 선택 (가중치 적용)
    const random = Math.random();
    let status: NotificationStatus = "sent";
    let cumulative = 0;
    for (let j = 0; j < statuses.length; j++) {
      cumulative += statusWeights[j];
      if (random <= cumulative) {
        status = statuses[j];
        break;
      }
    }

    // 예약 시간 (과거 30일 ~ 미래 7일)
    const daysAgo = Math.floor(Math.random() * 37) - 7;
    const scheduledAt = new Date(now);
    scheduledAt.setDate(scheduledAt.getDate() + daysAgo);
    scheduledAt.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), 0, 0);

    // 발송 시간 (예약 시간 이후 또는 null)
    const sentAt =
      status === "sent" || status === "failed"
        ? new Date(scheduledAt.getTime() + Math.floor(Math.random() * 5) * 60 * 1000)
        : null;

    notifications.push({
      id: `notification-${i + 1}`,
      type,
      templateId: template.id,
      templateName: template.name,
      recipients: selectedRecipients,
      subject: type === "email" ? (template as EmailTemplate).subject : undefined,
      content: type === "email" ? (template as EmailTemplate).content : template.content,
      scheduledAt,
      sentAt,
      status,
      createdAt: new Date(scheduledAt.getTime() - Math.floor(Math.random() * 24) * 60 * 60 * 1000),
    });
  }

  // id 기준으로 정렬하여 deterministic하게 (Hydration 오류 방지)
  return notifications.sort((a, b) => a.id.localeCompare(b.id));
}

/**
 * Mock 스케줄된 알림 데이터 (15개)
 */
export const mockScheduledNotifications: ScheduledNotification[] = generateMockNotifications(15);
