/**
 * 회원 관리 데이터 타입 정의
 */

export type MemberRole = "student" | "instructor" | "volunteer";

export type ApplicationStatus = "pending" | "approved" | "rejected" | "completed" | "cancelled";

export type CourseStatus = "recruiting" | "ongoing" | "completed" | "cancelled";

export interface Course {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  instructorName: string;
  category: string;
  maxStudents: number;
  currentStudents: number;
  maxVolunteers: number;
  currentVolunteers: number;
  startDate: Date;
  endDate: Date;
  status: CourseStatus;
  location: string;
  createdAt: Date;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  studentId: string; // 학번
  department: string; // 학과
  year: number; // 학년
  role: "student";
  status: "active" | "inactive";
  enrolledCourses: StudentEnrollment[];
  applicationHistory: StudentApplication[];
  totalCompletedCourses: number;
  createdAt: Date;
}

export interface Instructor {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: "instructor";
  status: "active" | "inactive";
  createdCourses: Course[];
  applicationHistory: InstructorApplication[];
  totalCourses: number;
  totalStudents: number;
  approvalRate: number; // 승인률
  createdAt: Date;
}

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  organization: string; // 소속 기관
  role: "volunteer";
  status: "active" | "inactive";
  enrolledCourses: VolunteerEnrollment[];
  applicationHistory: VolunteerApplication[];
  totalCompletedHours: number; // 총 봉사 시간
  totalCompletedCourses: number;
  averageRating: number; // 평균 평가 점수
  createdAt: Date;
}

export interface StudentEnrollment {
  courseId: string;
  courseTitle: string;
  status: ApplicationStatus;
  appliedAt: Date;
  approvedAt: Date | null;
  completedAt: Date | null;
  grade: number | null; // 성적
  attendance: number; // 출석률 (%)
}

export interface StudentApplication {
  id: string;
  courseId: string;
  courseTitle: string;
  status: ApplicationStatus;
  appliedAt: Date;
  approvedAt: Date | null;
  rejectedAt: Date | null;
  rejectionReason: string | null;
}

export interface InstructorApplication {
  id: string;
  courseId: string;
  courseTitle: string;
  applicantId: string;
  applicantName: string;
  applicantType: "student" | "volunteer";
  status: ApplicationStatus;
  appliedAt: Date;
  reviewedAt: Date | null;
  notes: string | null;
}

export interface VolunteerEnrollment {
  courseId: string;
  courseTitle: string;
  status: ApplicationStatus;
  appliedAt: Date;
  approvedAt: Date | null;
  completedAt: Date | null;
  volunteerHours: number; // 봉사 시간
  rating: number | null; // 평가 점수
  feedback: string | null; // 피드백
}

export interface VolunteerApplication {
  id: string;
  courseId: string;
  courseTitle: string;
  status: ApplicationStatus;
  appliedAt: Date;
  approvedAt: Date | null;
  rejectedAt: Date | null;
  rejectionReason: string | null;
}

/**
 * Mock 데이터 생성
 */

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

const categories = ["프로그래밍", "디자인", "비즈니스", "마케팅", "데이터", "보안", "기타"];

const departments = [
  "컴퓨터공학과",
  "경영학과",
  "디자인학과",
  "경제학과",
  "심리학과",
  "사회학과",
  "영어영문학과",
  "수학과",
];

const organizations = [
  "서울시 봉사센터",
  "청년봉사단",
  "사회공헌재단",
  "지역사회개발협회",
  "교육봉사연합",
];

const _koreanNames = [
  "김민수",
  "이영희",
  "박준호",
  "최지은",
  "정동욱",
  "강서연",
  "윤태현",
  "장미라",
  "임성호",
  "한소영",
  "오진우",
  "신혜진",
  "류현우",
  "조은지",
  "배성민",
  "전유진",
  "송민준",
  "홍수진",
  "문태영",
  "고은비",
];

function generateKoreanName(): string {
  const surnames = ["김", "이", "박", "최", "정", "강", "윤", "장", "임", "한"];
  const givenNames = [
    ["민", "수"],
    ["영", "희"],
    ["준", "호"],
    ["지", "은"],
    ["동", "욱"],
    ["서", "연"],
    ["태", "현"],
    ["미", "라"],
    ["성", "호"],
    ["소", "영"],
    ["진", "우"],
    ["혜", "진"],
    ["현", "우"],
    ["은", "지"],
    ["성", "민"],
  ];
  const surname = surnames[Math.floor(Math.random() * surnames.length)];
  const given = givenNames[Math.floor(Math.random() * givenNames.length)];
  return surname + given[0] + given[1];
}

function generateEmail(name: string): string {
  const domains = ["gmail.com", "naver.com", "daum.net", "university.ac.kr"];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  const namePart = name.replace(/\s/g, "").toLowerCase();
  return `${namePart}${Math.floor(Math.random() * 1000)}@${domain}`;
}

function generatePhone(): string {
  return `010-${Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")}-${Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")}`;
}

function generateCourses(
  count: number,
  instructorIds: string[],
  instructorNames: string[],
): Course[] {
  const courses: Course[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const instructorIndex = Math.floor(Math.random() * instructorIds.length);
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 60) - 30);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 30) + 7);

    const maxStudents = [20, 30, 40, 50][Math.floor(Math.random() * 4)];
    const maxVolunteers = [2, 3, 4, 5][Math.floor(Math.random() * 4)];

    courses.push({
      id: `course-${i + 1}`,
      title: courseTitles[Math.floor(Math.random() * courseTitles.length)],
      description: `${courseTitles[Math.floor(Math.random() * courseTitles.length)]}에 대한 실무 중심 강의입니다.`,
      instructorId: instructorIds[instructorIndex],
      instructorName: instructorNames[instructorIndex],
      category: categories[Math.floor(Math.random() * categories.length)],
      maxStudents,
      currentStudents: Math.floor(Math.random() * maxStudents),
      maxVolunteers,
      currentVolunteers: Math.floor(Math.random() * maxVolunteers),
      startDate,
      endDate,
      status: startDate > now ? "recruiting" : endDate < now ? "completed" : "ongoing",
      location: `강의실 ${String.fromCharCode(65 + Math.floor(Math.random() * 5))}-${Math.floor(Math.random() * 100) + 101}`,
      createdAt: new Date(
        startDate.getTime() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000,
      ),
    });
  }

  return courses;
}

function generateStudents(count: number): Student[] {
  const students: Student[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const name = generateKoreanName();
    const studentId = `2024${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`;
    const year = Math.floor(Math.random() * 4) + 1;

    // 참여 이력 생성 (3-8개)
    const enrollmentCount = Math.floor(Math.random() * 6) + 3;
    const enrollments: StudentEnrollment[] = [];
    const applications: StudentApplication[] = [];

    for (let j = 0; j < enrollmentCount; j++) {
      const appliedAt = new Date(now);
      appliedAt.setDate(appliedAt.getDate() - Math.floor(Math.random() * 180));
      const status: ApplicationStatus = ["approved", "completed", "rejected", "pending"][
        Math.floor(Math.random() * 4)
      ] as ApplicationStatus;
      const approvedAt =
        status !== "pending" && status !== "rejected"
          ? new Date(appliedAt.getTime() + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000)
          : null;
      const completedAt =
        status === "completed"
          ? new Date(
              (approvedAt || appliedAt).getTime() +
                Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000,
            )
          : null;

      enrollments.push({
        courseId: `course-${Math.floor(Math.random() * 20) + 1}`,
        courseTitle: courseTitles[Math.floor(Math.random() * courseTitles.length)],
        status,
        appliedAt,
        approvedAt,
        completedAt,
        grade: status === "completed" ? Math.floor(Math.random() * 30) + 70 : null,
        attendance: status === "completed" ? Math.floor(Math.random() * 20) + 80 : 0,
      });

      applications.push({
        id: `app-student-${i}-${j}`,
        courseId: `course-${Math.floor(Math.random() * 20) + 1}`,
        courseTitle: courseTitles[Math.floor(Math.random() * courseTitles.length)],
        status,
        appliedAt,
        approvedAt,
        rejectedAt:
          status === "rejected"
            ? new Date(appliedAt.getTime() + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000)
            : null,
        rejectionReason: status === "rejected" ? "정원 초과" : null,
      });
    }

    students.push({
      id: `student-${i + 1}`,
      name,
      email: generateEmail(name),
      phone: generatePhone(),
      studentId,
      department: departments[Math.floor(Math.random() * departments.length)],
      year,
      role: "student",
      status: Math.random() > 0.1 ? "active" : "inactive",
      enrolledCourses: enrollments,
      applicationHistory: applications,
      totalCompletedCourses: enrollments.filter((e) => e.status === "completed").length,
      createdAt: new Date(now.getTime() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000),
    });
  }

  return students;
}

function generateInstructors(count: number): Instructor[] {
  const instructors: Instructor[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const name = generateKoreanName();
    const courseCount = Math.floor(Math.random() * 10) + 5;
    const courses = generateCourses(courseCount, [`instructor-${i + 1}`], [name]);

    const totalStudents = courses.reduce((sum, c) => sum + c.currentStudents, 0);
    const approvalRate = Math.floor(Math.random() * 30) + 70; // 70-100%

    // 신청자 관리 이력 생성
    const applicationHistory: InstructorApplication[] = [];
    courses.forEach((course) => {
      const applicantCount = Math.floor(Math.random() * 10) + 5;
      for (let j = 0; j < applicantCount; j++) {
        const appliedAt = new Date(course.createdAt);
        appliedAt.setDate(appliedAt.getDate() + Math.floor(Math.random() * 30));
        const status: ApplicationStatus =
          Math.random() * 100 < approvalRate ? "approved" : "rejected";

        applicationHistory.push({
          id: `app-instructor-${i}-${j}`,
          courseId: course.id,
          courseTitle: course.title,
          applicantId: `student-${Math.floor(Math.random() * 50) + 1}`,
          applicantName: generateKoreanName(),
          applicantType: Math.random() > 0.3 ? "student" : "volunteer",
          status,
          appliedAt,
          reviewedAt: new Date(
            appliedAt.getTime() + Math.floor(Math.random() * 5) * 24 * 60 * 60 * 1000,
          ), // approved 또는 rejected이므로 항상 설정
          notes: status === "approved" ? "우수한 자격을 갖춘 지원자입니다." : "정원 초과",
        });
      }
    });

    instructors.push({
      id: `instructor-${i + 1}`,
      name,
      email: generateEmail(name),
      phone: generatePhone(),
      department: departments[Math.floor(Math.random() * departments.length)],
      role: "instructor",
      status: Math.random() > 0.1 ? "active" : "inactive",
      createdCourses: courses,
      applicationHistory,
      totalCourses: courseCount,
      totalStudents,
      approvalRate,
      createdAt: new Date(now.getTime() - Math.floor(Math.random() * 730) * 24 * 60 * 60 * 1000),
    });
  }

  return instructors;
}

function generateVolunteers(count: number): Volunteer[] {
  const volunteers: Volunteer[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const name = generateKoreanName();
    const enrollmentCount = Math.floor(Math.random() * 8) + 2;
    const enrollments: VolunteerEnrollment[] = [];
    const applications: VolunteerApplication[] = [];

    let totalHours = 0;

    for (let j = 0; j < enrollmentCount; j++) {
      const appliedAt = new Date(now);
      appliedAt.setDate(appliedAt.getDate() - Math.floor(Math.random() * 180));
      const status: ApplicationStatus = ["approved", "completed", "rejected", "pending"][
        Math.floor(Math.random() * 4)
      ] as ApplicationStatus;
      const approvedAt =
        status !== "pending" && status !== "rejected"
          ? new Date(appliedAt.getTime() + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000)
          : null;
      const completedAt =
        status === "completed"
          ? new Date(
              (approvedAt || appliedAt).getTime() +
                Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000,
            )
          : null;
      const volunteerHours = status === "completed" ? Math.floor(Math.random() * 40) + 10 : 0;
      totalHours += volunteerHours;

      enrollments.push({
        courseId: `course-${Math.floor(Math.random() * 20) + 1}`,
        courseTitle: courseTitles[Math.floor(Math.random() * courseTitles.length)],
        status,
        appliedAt,
        approvedAt,
        completedAt,
        volunteerHours,
        rating: status === "completed" ? Math.floor(Math.random() * 2) + 4 : null, // 4-5점
        feedback: status === "completed" ? "봉사 활동이 매우 의미있었습니다." : null,
      });

      applications.push({
        id: `app-volunteer-${i}-${j}`,
        courseId: `course-${Math.floor(Math.random() * 20) + 1}`,
        courseTitle: courseTitles[Math.floor(Math.random() * courseTitles.length)],
        status,
        appliedAt,
        approvedAt,
        rejectedAt:
          status === "rejected"
            ? new Date(appliedAt.getTime() + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000)
            : null,
        rejectionReason: status === "rejected" ? "정원 초과" : null,
      });
    }

    const completedCount = enrollments.filter((e) => e.status === "completed").length;
    const averageRating =
      completedCount > 0
        ? enrollments
            .filter((e) => e.rating !== null)
            .reduce((sum, e) => sum + (e.rating || 0), 0) / completedCount
        : 0;

    volunteers.push({
      id: `volunteer-${i + 1}`,
      name,
      email: generateEmail(name),
      phone: generatePhone(),
      organization: organizations[Math.floor(Math.random() * organizations.length)],
      role: "volunteer",
      status: Math.random() > 0.1 ? "active" : "inactive",
      enrolledCourses: enrollments,
      applicationHistory: applications,
      totalCompletedHours: totalHours,
      totalCompletedCourses: completedCount,
      averageRating: Math.round(averageRating * 10) / 10,
      createdAt: new Date(now.getTime() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000),
    });
  }

  return volunteers;
}

// Mock 데이터 생성
const instructors = generateInstructors(15);
const instructorIds = instructors.map((i) => i.id);
const instructorNames = instructors.map((i) => i.name);

// Mock 데이터 생성 및 정렬 (Hydration 오류 방지를 위해 deterministic하게 정렬)
const students = generateStudents(50);
const courses = generateCourses(30, instructorIds, instructorNames);

// 정렬하여 항상 같은 순서 보장
export const mockStudents: Student[] = students.sort((a, b) => a.id.localeCompare(b.id));
export const mockInstructors: Instructor[] = instructors.sort((a, b) => a.id.localeCompare(b.id));
export const mockVolunteers: Volunteer[] = generateVolunteers(35).sort((a, b) =>
  a.id.localeCompare(b.id),
);
export const mockCourses: Course[] = courses.sort((a, b) => a.id.localeCompare(b.id));

// 모든 멤버 통합
export type Member = Student | Instructor | Volunteer;

export const mockMembers: Member[] = [...mockStudents, ...mockInstructors, ...mockVolunteers];
