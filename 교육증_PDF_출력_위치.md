# 교육증 PDF 출력 위치

## 📍 접근 경로

1. **회원 관리** → **학생** 탭
2. **참여 이력** 탭 선택
3. 완료된 강의 목록에서 **"교육증"** 컬럼의 **"확인"** 버튼 클릭
4. 팝업에서 **"PDF 다운로드"** 버튼 클릭

## 📂 파일 위치

### 1. PDF 생성 함수

- **파일**: `src/features/certificate-management/lib/use-certificate-pdf.ts`
- **함수**: `generateCertificatePDF()`
- **기능**: jsPDF를 사용하여 교육증 PDF 생성 및 다운로드

### 2. 교육증 다이얼로그

- **파일**: `src/features/certificate-management/ui/certificate-view-dialog.tsx`
- **컴포넌트**: `CertificateViewDialog`
- **기능**: 교육증 정보 표시 및 PDF 다운로드 버튼 제공

### 3. 학생 뷰 통합

- **파일**: `src/features/member-management/ui/student-view.tsx`
- **위치**: "참여 이력" 테이블의 "교육증" 컬럼
- **동작**: "확인" 버튼 클릭 시 교육증 다이얼로그 열림

## 🔧 사용 방법

1. 회원 관리 페이지 접근: `/automation/platform/members`
2. 학생 탭 선택
3. "참여 이력" 탭 선택
4. 완료된 강의 목록에서 "교육증" 컬럼의 "확인" 버튼 클릭
5. 팝업에서 교육증 정보 확인
6. "PDF 다운로드" 버튼 클릭하여 PDF 파일 다운로드

## 📄 PDF 내용

- 교육 이수증 제목
- 수강생 정보 (이름, 학번)
- 강의명
- 이수일
- 성적
- 출석률
- 교육증 번호
- 발급일
- 발급기관 서명란
