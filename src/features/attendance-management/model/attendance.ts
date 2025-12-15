/**
 * 자동 출석 관리 데이터 타입 정의
 */

export type AttendanceMethod = "qr" | "gps" | "manual";

export type AttendanceStatus = "present" | "absent" | "late" | "excused";

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseTitle: string;
  sessionDate: Date;
  checkInTime: Date | null;
  checkOutTime: Date | null;
  method: AttendanceMethod;
  status: AttendanceStatus;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  notes?: string;
  createdAt: Date;
}

export interface AttendanceSession {
  id: string;
  courseId: string;
  courseTitle: string;
  sessionDate: Date;
  startTime: Date;
  endTime: Date;
  location?: {
    name: string;
    latitude: number;
    longitude: number;
    radius: number; // GPS 허용 반경 (미터)
  };
  qrCode?: string;
  method: AttendanceMethod;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount: number;
  records: AttendanceRecord[];
  createdAt: Date;
}

/**
 * Mock 출석 세션 데이터
 */
export const mockAttendanceSessions: AttendanceSession[] = [
  {
    id: "session-1",
    courseId: "course-1",
    courseTitle: "소프트웨어 공학",
    sessionDate: new Date(2025, 11, 15),
    startTime: new Date(2025, 11, 15, 9, 0),
    endTime: new Date(2025, 11, 15, 12, 0),
    location: {
      name: "강의실 101",
      latitude: 37.5665,
      longitude: 126.978,
      radius: 50,
    },
    qrCode: "QR-2025-12-15-001",
    method: "qr",
    totalStudents: 30,
    presentCount: 25,
    absentCount: 3,
    lateCount: 2,
    excusedCount: 0,
    records: [],
    createdAt: new Date(2025, 11, 15, 8, 30),
  },
  {
    id: "session-2",
    courseId: "course-2",
    courseTitle: "데이터베이스 설계",
    sessionDate: new Date(2025, 11, 15),
    startTime: new Date(2025, 11, 15, 14, 0),
    endTime: new Date(2025, 11, 15, 17, 0),
    location: {
      name: "강의실 201",
      latitude: 37.5665,
      longitude: 126.978,
      radius: 50,
    },
    qrCode: "QR-2025-12-15-002",
    method: "gps",
    totalStudents: 25,
    presentCount: 22,
    absentCount: 2,
    lateCount: 1,
    excusedCount: 0,
    records: [],
    createdAt: new Date(2025, 11, 15, 13, 30),
  },
];
