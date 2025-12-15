/**
 * 교육증 관리 데이터 타입 정의
 */

import type { StudentEnrollment, Student } from "@/features/member-management/model/members";

export interface Certificate {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseTitle: string;
  completedAt: Date;
  grade: number;
  attendance: number;
  issuedAt: Date;
  certificateNumber: string; // 교육증 번호
}

/**
 * 교육증 생성 함수
 */
export function generateCertificate(student: Student, enrollment: StudentEnrollment): Certificate {
  const certificateNumber = `CERT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 100000)).padStart(5, "0")}`;

  return {
    id: `cert-${student.id}-${enrollment.courseId}`,
    studentId: student.studentId, // 학번 사용
    studentName: student.name,
    courseId: enrollment.courseId,
    courseTitle: enrollment.courseTitle,
    completedAt: enrollment.completedAt || new Date(),
    grade: enrollment.grade || 0,
    attendance: enrollment.attendance,
    issuedAt: new Date(),
    certificateNumber,
  };
}
