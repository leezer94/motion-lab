/**
 * 로그 데이터 타입 정의
 */

export type LogStatus = "success" | "failed" | "pending" | "running";

export type LogLevel = "info" | "warning" | "error" | "debug";

export interface AutomationLog {
  id: string;
  workflowName: string;
  status: LogStatus;
  level: LogLevel;
  executionTime: number; // milliseconds
  recordCount: number;
  startTime: Date;
  endTime: Date | null;
  errorMessage: string | null;
  triggeredBy: string;
  duration: number; // seconds
}

/**
 * 필터 폼 타입
 */
export interface LogsFilterForm {
  workflowName: string;
  status: LogStatus | "all";
  level: LogLevel | "all";
  dateFrom: string;
  dateTo: string;
}

/**
 * Mock 데이터 생성
 */
function generateMockLogs(count: number): AutomationLog[] {
  const workflows = [
    "주문 처리 워크플로",
    "재고 동기화",
    "고객 데이터 정제",
    "리포트 생성",
    "이메일 발송",
    "데이터 백업",
    "결제 처리",
    "알림 전송",
  ];

  const statuses: LogStatus[] = ["success", "failed", "pending", "running"];
  const levels: LogLevel[] = ["info", "warning", "error", "debug"];
  const users = ["김철수", "이영희", "박민수", "정수진", "최동욱"];

  const logs: AutomationLog[] = [];

  for (let i = 0; i < count; i++) {
    const startTime = new Date();
    startTime.setDate(startTime.getDate() - Math.floor(Math.random() * 30));
    startTime.setHours(Math.floor(Math.random() * 24));
    startTime.setMinutes(Math.floor(Math.random() * 60));

    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const duration = Math.floor(Math.random() * 3600) + 10; // 10초 ~ 1시간
    const endTime =
      status === "running" || status === "pending"
        ? null
        : new Date(startTime.getTime() + duration * 1000);

    const recordCount = Math.floor(Math.random() * 10000) + 1;
    const executionTime = duration * 1000 + Math.floor(Math.random() * 1000);

    logs.push({
      id: `log-${i + 1}`,
      workflowName: workflows[Math.floor(Math.random() * workflows.length)],
      status,
      level: levels[Math.floor(Math.random() * levels.length)],
      executionTime,
      recordCount,
      startTime,
      endTime,
      errorMessage: status === "failed" ? "처리 중 오류가 발생했습니다." : null,
      triggeredBy: users[Math.floor(Math.random() * users.length)],
      duration,
    });
  }

  return logs.sort((a, b) => {
    // ID로도 정렬하여 항상 동일한 순서 보장
    const timeDiff = b.startTime.getTime() - a.startTime.getTime();
    if (timeDiff !== 0) return timeDiff;
    return a.id.localeCompare(b.id);
  });
}

// Mock 데이터를 한 번만 생성하고 정적으로 유지
const _mockLogs = generateMockLogs(50);
export const mockLogs: AutomationLog[] = _mockLogs;

/**
 * 차트용 집계 데이터 타입
 */
export interface LogsChartData {
  date: string;
  success: number;
  failed: number;
  pending: number;
  running: number;
}

/**
 * 날짜별로 로그를 집계하는 함수
 */
export function aggregateLogsByDate(logs: AutomationLog[]): LogsChartData[] {
  const dateMap = new Map<
    string,
    { success: number; failed: number; pending: number; running: number }
  >();

  logs.forEach((log) => {
    const dateKey = log.startTime.toISOString().split("T")[0];
    const existing = dateMap.get(dateKey) || { success: 0, failed: 0, pending: 0, running: 0 };

    existing[log.status] = (existing[log.status] || 0) + 1;
    dateMap.set(dateKey, existing);
  });

  return Array.from(dateMap.entries())
    .map(([date, counts]) => ({
      date,
      ...counts,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
