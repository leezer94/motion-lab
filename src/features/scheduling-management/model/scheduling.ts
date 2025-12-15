/**
 * 강의 일정 스케줄링 데이터 타입 정의
 */

export type ScheduleStatus = "draft" | "confirmed" | "cancelled" | "completed";

export interface TimeSlot {
  id: string;
  startTime: Date;
  endTime: Date;
  dayOfWeek: number; // 0: 일요일, 1: 월요일, ...
}

export interface OnlinePlatform {
  id: string;
  name: string;
  type: "zoom" | "teams" | "google_meet" | "custom";
  maxCapacity: number;
  isAvailable: boolean;
  features: string[]; // ["recording", "breakout_rooms", "screen_share", "chat"]
}

export interface ScheduleConflict {
  type: "instructor" | "platform" | "time";
  conflictingItem: string;
  conflictingSchedule: string;
}

export interface CourseSchedule {
  id: string;
  courseId: string;
  courseTitle: string;
  instructorId: string;
  instructorName: string;
  platformId: string;
  platformName: string;
  platformType: "zoom" | "teams" | "google_meet" | "custom";
  meetingLink: string;
  meetingId?: string;
  meetingPassword?: string;
  timeSlots: TimeSlot[];
  startDate: Date;
  endDate: Date;
  status: ScheduleStatus;
  conflicts: ScheduleConflict[];
  studentCount: number;
  maxCapacity: number;
  recordingEnabled: boolean;
  recordingLink?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mock 온라인 플랫폼 데이터
 */
export const mockOnlinePlatforms: OnlinePlatform[] = [
  {
    id: "platform-1",
    name: "Zoom Pro",
    type: "zoom",
    maxCapacity: 100,
    isAvailable: true,
    features: ["recording", "breakout_rooms", "screen_share", "chat", "polling"],
  },
  {
    id: "platform-2",
    name: "Microsoft Teams",
    type: "teams",
    maxCapacity: 300,
    isAvailable: true,
    features: ["recording", "breakout_rooms", "screen_share", "chat", "whiteboard"],
  },
  {
    id: "platform-3",
    name: "Google Meet",
    type: "google_meet",
    maxCapacity: 100,
    isAvailable: true,
    features: ["recording", "screen_share", "chat"],
  },
  {
    id: "platform-4",
    name: "커스텀 플랫폼",
    type: "custom",
    maxCapacity: 50,
    isAvailable: true,
    features: ["recording", "screen_share", "chat"],
  },
];

/**
 * Mock 강의 일정 데이터 생성 (30개)
 */
function generateMockSchedules(): CourseSchedule[] {
  const schedules: CourseSchedule[] = [];
  const now = new Date();
  const courseTitles = [
    "웹 개발 기초",
    "데이터베이스 설계",
    "UI/UX 디자인",
    "프로그래밍 입문",
    "알고리즘과 자료구조",
    "모바일 앱 개발",
    "클라우드 컴퓨팅",
    "머신러닝 기초",
    "네트워크 보안",
    "소프트웨어 공학",
    "프로젝트 관리",
    "디지털 마케팅",
    "비즈니스 분석",
    "창업 실무",
    "커뮤니케이션 스킬",
  ];

  const instructorNames = [
    "김교수",
    "이교수",
    "박교수",
    "최교수",
    "정교수",
    "강교수",
    "윤교수",
    "장교수",
    "임교수",
    "한교수",
    "오교수",
    "신교수",
    "류교수",
    "조교수",
    "배교수",
  ];

  const statuses: ScheduleStatus[] = ["draft", "confirmed", "cancelled", "completed"];
  const platformTypes: Array<"zoom" | "teams" | "google_meet" | "custom"> = [
    "zoom",
    "teams",
    "google_meet",
    "custom",
  ];
  const platformNames = ["Zoom Pro", "Microsoft Teams", "Google Meet", "커스텀 플랫폼"];

  for (let i = 0; i < 30; i++) {
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 60) - 15);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 60) + 30);

    const startHour = [9, 10, 13, 14, 15, 18, 19][Math.floor(Math.random() * 7)];
    const duration = [2, 3, 4][Math.floor(Math.random() * 3)];
    const endHour = startHour + duration;

    const dayOfWeek = Math.floor(Math.random() * 5) + 1; // 월~금
    const platformIndex = Math.floor(Math.random() * 4);
    const maxCapacity = [30, 50, 100, 300][Math.floor(Math.random() * 4)];
    const studentCount = Math.floor(Math.random() * maxCapacity * 0.9);

    const meetingId = `${Math.floor(Math.random() * 1000000)}`;
    const meetingPassword =
      Math.random() > 0.5 ? `${Math.floor(Math.random() * 10000)}` : undefined;

    schedules.push({
      id: `schedule-${i + 1}`,
      courseId: `course-${Math.floor(Math.random() * 30) + 1}`,
      courseTitle: courseTitles[Math.floor(Math.random() * courseTitles.length)],
      instructorId: `instructor-${Math.floor(Math.random() * 15) + 1}`,
      instructorName: instructorNames[Math.floor(Math.random() * instructorNames.length)],
      platformId: `platform-${platformIndex + 1}`,
      platformName: platformNames[platformIndex],
      platformType: platformTypes[platformIndex],
      meetingLink: `https://${platformTypes[platformIndex] === "zoom" ? "zoom.us" : platformTypes[platformIndex] === "teams" ? "teams.microsoft.com" : "meet.google.com"}/j/${meetingId}`,
      meetingId,
      meetingPassword,
      timeSlots: [
        {
          id: `slot-${i + 1}`,
          startTime: new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate(),
            startHour,
            0,
          ),
          endTime: new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate(),
            endHour,
            0,
          ),
          dayOfWeek,
        },
      ],
      startDate,
      endDate,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      conflicts:
        Math.random() > 0.8
          ? [
              {
                type: Math.random() > 0.5 ? "instructor" : "platform",
                conflictingItem: Math.random() > 0.5 ? "강의자 일정 충돌" : "플랫폼 사용 중",
                conflictingSchedule: `schedule-${Math.floor(Math.random() * 30) + 1}`,
              },
            ]
          : [],
      studentCount,
      maxCapacity,
      recordingEnabled: Math.random() > 0.3,
      recordingLink: Math.random() > 0.5 ? `https://recording.example.com/${meetingId}` : undefined,
      createdAt: new Date(
        startDate.getTime() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000,
      ),
      updatedAt: new Date(
        startDate.getTime() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000,
      ),
    });
  }

  // id 기준으로 정렬하여 deterministic하게 (Hydration 오류 방지)
  return schedules.sort((a, b) => a.id.localeCompare(b.id));
}

export const mockCourseSchedules: CourseSchedule[] = generateMockSchedules();
