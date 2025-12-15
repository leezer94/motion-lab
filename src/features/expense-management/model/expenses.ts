/**
 * 비용 관리 데이터 타입 정의
 */

export type ExpenseType = "accommodation" | "fuel" | "lecture_fee";

export type ExpenseStatus = "draft" | "submitted" | "approved" | "rejected" | "paid";

export interface ExpenseItem {
  id: string;
  type: ExpenseType;
  amount: number;
  description: string;
  receiptFiles: File[];
  receiptUrls: string[]; // 업로드된 파일 URL
  maxAmount: number;
  createdAt: Date;
}

export interface ExpenseForm {
  instructorId: string;
  instructorName: string;
  courseId: string;
  courseTitle: string;
  accommodation: {
    amount: number;
    description: string;
    receiptFiles: File[];
  };
  fuel: {
    amount: number;
    description: string;
    receiptFiles: File[];
  };
  lectureFee: {
    amount: number;
    description: string;
  };
  // 입금 정보
  paymentInfo: {
    accountHolder: string; // 예금주명
    bankName: string; // 은행명
    accountNumber: string; // 계좌번호
    memo?: string; // 입금 메모 (선택)
  };
  totalAmount: number;
  submittedAt: Date | null;
  status: ExpenseStatus;
}

export interface ExpenseSubmission {
  id: string;
  instructorId: string;
  instructorName: string;
  courseId: string;
  courseTitle: string;
  accommodation: ExpenseItem;
  fuel: ExpenseItem;
  lectureFee: ExpenseItem;
  paymentInfo: {
    accountHolder: string;
    bankName: string;
    accountNumber: string;
    memo?: string;
  };
  totalAmount: number;
  submittedAt: Date;
  status: ExpenseStatus;
  reviewedBy: string | null;
  reviewedAt: Date | null;
  rejectionReason: string | null;
}

/**
 * 비용 타입별 최대 금액 및 설정
 */
export const expenseConfig = {
  accommodation: {
    label: "숙박비",
    maxAmount: 80000,
    requiresReceipt: false,
    fileLimit: 0,
  },
  fuel: {
    label: "유류비",
    maxAmount: Infinity, // 증빙자료 필수이므로 최대 금액 제한 없음
    requiresReceipt: true,
    fileLimit: 5, // 최대 5개 파일
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ["image/jpeg", "image/png", "image/jpg", "application/pdf"],
  },
  lectureFee: {
    label: "강의료",
    maxAmount: Infinity,
    requiresReceipt: false,
    fileLimit: 0,
  },
};

/**
 * Mock 데이터 생성
 */
export const mockExpenseSubmissions: ExpenseSubmission[] = [];
