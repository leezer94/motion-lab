/**
 * 강의 신청 승인 워크플로우 데이터 타입 정의
 */

export type ApprovalStatus = "pending" | "approved" | "rejected" | "waitlisted";

export type ApprovalRule = "first_come" | "qualification" | "manual" | "lottery";

export interface Application {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseTitle: string;
  appliedAt: Date;
  status: ApprovalStatus;
  priority: number; // 선착순 우선순위
  qualifications: {
    hasPrerequisite: boolean;
    gradeRequirement: number;
    meetsRequirement: boolean;
  };
  autoApproved: boolean;
  approvedAt: Date | null;
  rejectedAt: Date | null;
  rejectedReason: string | null;
  reviewedBy: string | null;
}

export interface CourseApprovalConfig {
  courseId: string;
  courseTitle: string;
  maxCapacity: number;
  currentEnrollment: number;
  approvalRule: ApprovalRule;
  autoApproveEnabled: boolean;
  qualificationCheckEnabled: boolean;
  waitlistEnabled: boolean;
  applications: Application[];
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  waitlistedCount: number;
}

/**
 * Mock 강의 승인 설정 데이터
 */
export const mockCourseApprovalConfigs: CourseApprovalConfig[] = [
  {
    courseId: "course-1",
    courseTitle: "소프트웨어 공학",
    maxCapacity: 30,
    currentEnrollment: 25,
    approvalRule: "first_come",
    autoApproveEnabled: true,
    qualificationCheckEnabled: true,
    waitlistEnabled: true,
    applications: [],
    pendingCount: 3,
    approvedCount: 25,
    rejectedCount: 2,
    waitlistedCount: 5,
  },
  {
    courseId: "course-2",
    courseTitle: "데이터베이스 설계",
    maxCapacity: 50,
    currentEnrollment: 45,
    approvalRule: "qualification",
    autoApproveEnabled: true,
    qualificationCheckEnabled: true,
    waitlistEnabled: true,
    applications: [],
    pendingCount: 5,
    approvedCount: 45,
    rejectedCount: 3,
    waitlistedCount: 7,
  },
];

/**
 * Mock 신청 데이터
 */
export const mockApplications: Application[] = [
  {
    id: "app-1",
    studentId: "student-1",
    studentName: "김학생",
    studentEmail: "student1@example.com",
    courseId: "course-1",
    courseTitle: "소프트웨어 공학",
    appliedAt: new Date(2025, 11, 10, 9, 0),
    status: "pending",
    priority: 1,
    qualifications: {
      hasPrerequisite: true,
      gradeRequirement: 70,
      meetsRequirement: true,
    },
    autoApproved: false,
    approvedAt: null,
    rejectedAt: null,
    rejectedReason: null,
    reviewedBy: null,
  },
  {
    id: "app-2",
    studentId: "student-2",
    studentName: "이학생",
    studentEmail: "student2@example.com",
    courseId: "course-1",
    courseTitle: "소프트웨어 공학",
    appliedAt: new Date(2025, 11, 10, 9, 5),
    status: "approved",
    priority: 2,
    qualifications: {
      hasPrerequisite: true,
      gradeRequirement: 70,
      meetsRequirement: true,
    },
    autoApproved: true,
    approvedAt: new Date(2025, 11, 10, 9, 6),
    rejectedAt: null,
    rejectedReason: null,
    reviewedBy: "system",
  },
  {
    id: "app-3",
    studentId: "student-3",
    studentName: "박학생",
    studentEmail: "student3@example.com",
    courseId: "course-2",
    courseTitle: "데이터베이스 설계",
    appliedAt: new Date(2025, 11, 11, 10, 0),
    status: "waitlisted",
    priority: 8,
    qualifications: {
      hasPrerequisite: true,
      gradeRequirement: 75,
      meetsRequirement: true,
    },
    autoApproved: false,
    approvedAt: null,
    rejectedAt: null,
    rejectedReason: null,
    reviewedBy: null,
  },
];
