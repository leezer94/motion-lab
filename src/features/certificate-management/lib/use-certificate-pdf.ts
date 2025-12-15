"use client";

import html2pdf from "html2pdf.js";

export interface CertificatePDFData {
  studentName: string;
  studentId: string;
  courseTitle: string;
  completedAt: Date;
  grade: number;
  attendance: number;
  certificateNumber: string;
}

/**
 * 교육증 PDF 생성 함수 (html2pdf.js 사용 - 한글 지원)
 */
export async function generateCertificatePDF(data: CertificatePDFData): Promise<void> {
  // PDF로 변환할 HTML 생성
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap');
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Noto Sans KR', sans-serif;
          background: #f5f5f5;
          padding: 20mm;
          width: 297mm;
          height: 210mm;
        }
        .certificate {
          background: white;
          width: 100%;
          height: 100%;
          border: 2px solid #c8c8c8;
          padding: 30mm;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          position: relative;
        }
        .title {
          font-size: 36px;
          font-weight: 700;
          color: #006400;
          margin-bottom: 20px;
          text-align: center;
        }
        .divider {
          width: 80%;
          height: 2px;
          background: #006400;
          margin: 20px 0 40px 0;
        }
        .content {
          width: 100%;
          max-width: 600px;
        }
        .intro {
          font-size: 16px;
          text-align: center;
          margin-bottom: 40px;
          color: #323232;
        }
        .info-row {
          display: flex;
          margin-bottom: 20px;
          font-size: 14px;
        }
        .info-label {
          font-weight: 700;
          width: 100px;
          color: #323232;
        }
        .info-value {
          flex: 1;
          color: #323232;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 20px;
          margin-top: 30px;
          padding-top: 30px;
          border-top: 1px solid #e0e0e0;
        }
        .info-item {
          text-align: center;
        }
        .info-item-label {
          font-size: 11px;
          color: #666;
          margin-bottom: 5px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .info-item-value {
          font-size: 14px;
          font-weight: 600;
          color: #323232;
        }
        .cert-number {
          font-size: 11px;
          color: #666;
          text-align: center;
          margin-top: 40px;
        }
        .issue-date {
          font-size: 12px;
          color: #323232;
          text-align: center;
          margin-top: 30px;
        }
        .signature {
          margin-top: 40px;
          text-align: right;
          padding-right: 60px;
        }
        .signature-line {
          width: 80px;
          height: 1px;
          background: #969696;
          margin: 0 auto 5px;
        }
        .signature-label {
          font-size: 10px;
          color: #666;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="certificate">
        <h1 class="title">교육 이수증</h1>
        <div class="divider"></div>
        
        <div class="content">
          <p class="intro">다음과 같이 교육을 이수하였음을 증명합니다.</p>
          
          <div class="info-row">
            <span class="info-label">수강생:</span>
            <span class="info-value">${data.studentName} (학번: ${data.studentId})</span>
          </div>
          
          <div class="info-row">
            <span class="info-label">강의명:</span>
            <span class="info-value">${data.courseTitle}</span>
          </div>
          
          <div class="info-grid">
            <div class="info-item">
              <div class="info-item-label">이수일</div>
              <div class="info-item-value">${data.completedAt.toLocaleDateString("ko-KR")}</div>
            </div>
            <div class="info-item">
              <div class="info-item-label">성적</div>
              <div class="info-item-value" style="color: #006400;">${data.grade}점</div>
            </div>
            <div class="info-item">
              <div class="info-item-label">출석률</div>
              <div class="info-item-value" style="color: #0066cc;">${data.attendance}%</div>
            </div>
          </div>
          
          <div class="cert-number">교육증 번호: ${data.certificateNumber}</div>
          
          <div class="issue-date">발급일: ${new Date().toLocaleDateString("ko-KR")}</div>
          
          <div class="signature">
            <div class="signature-line"></div>
            <div class="signature-label">발급기관 서명</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  // 기존 body 및 html 스타일 백업
  const originalBodyOverflow = document.body.style.overflow;
  const originalBodyPosition = document.body.style.position;
  const originalBodyWidth = document.body.style.width;
  const originalBodyHeight = document.body.style.height;
  const originalHtmlOverflow = document.documentElement.style.overflow;
  const originalHtmlPosition = document.documentElement.style.position;

  // PDF 생성 중 UI 보호를 위한 오버레이 생성
  const overlay = document.createElement("div");
  overlay.id = "pdf-generator-overlay";
  overlay.style.cssText = `
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    background: rgba(0, 0, 0, 0.8) !important;
    z-index: 999998 !important;
    pointer-events: none !important;
    opacity: 0 !important;
    transition: opacity 0.2s !important;
  `;
  document.body.appendChild(overlay);

  // 오버레이를 보이게 하기 (UI 변화를 가림)
  requestAnimationFrame(() => {
    overlay.style.opacity = "1";
  });

  // body와 html 스타일 보호
  document.body.style.overflow = originalBodyOverflow || "auto";
  document.body.style.position = originalBodyPosition || "relative";
  document.documentElement.style.overflow = originalHtmlOverflow || "auto";
  document.documentElement.style.position = originalHtmlPosition || "relative";

  // 완전히 격리된 컨테이너 생성 (새 창처럼 동작)
  const container = document.createElement("div");
  container.id = "pdf-generator-temp-container";
  container.setAttribute("data-pdf-container", "true");
  container.style.cssText = `
    position: fixed !important;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) scale(0.01) !important;
    width: 297mm !important;
    height: 210mm !important;
    overflow: hidden !important;
    z-index: 999999 !important;
    pointer-events: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
    isolation: isolate !important;
    contain: layout style paint !important;
  `;

  // HTML 콘텐츠 삽입
  container.innerHTML = htmlContent;
  document.body.appendChild(container);

  try {
    // 폰트와 스타일이 로드될 시간을 주기
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const element = container.querySelector(".certificate") as HTMLElement;
    if (!element) {
      throw new Error("교육증 요소를 찾을 수 없습니다.");
    }

    // html2canvas가 컨테이너만 캡처하도록 설정
    const opt = {
      margin: 0,
      filename: `교육증_${data.studentName}_${data.courseTitle.replace(/\s/g, "_")}.pdf`,
      image: { type: "jpeg" as const, quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        logging: false,
        allowTaint: true,
        windowWidth: 1123,
        windowHeight: 794,
        scrollX: 0,
        scrollY: 0,
        x: 0,
        y: 0,
        backgroundColor: "#f5f5f5",
        // 컨테이너만 캡처하도록 제한
        onclone: (clonedDoc: Document, _element: HTMLElement) => {
          // 복제된 문서에서 컨테이너 외부의 모든 요소 제거
          const clonedBody = clonedDoc.body;
          if (clonedBody) {
            // 컨테이너를 제외한 모든 자식 요소 제거
            const allChildren = Array.from(clonedBody.children);
            allChildren.forEach((child) => {
              if (!child.hasAttribute("data-pdf-container")) {
                child.remove();
              }
            });
            // 컨테이너를 body의 유일한 자식으로 만들기
            const container = clonedBody.querySelector('[data-pdf-container="true"]');
            if (container) {
              clonedBody.innerHTML = "";
              clonedBody.appendChild(container);
            }
          }
        },
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "landscape" as const,
      },
    };

    // PDF 생성 및 다운로드
    await html2pdf().set(opt).from(element).save();
  } finally {
    // 오버레이 제거
    if (document.body.contains(overlay)) {
      overlay.style.opacity = "0";
      setTimeout(() => {
        if (document.body.contains(overlay)) {
          document.body.removeChild(overlay);
        }
      }, 200);
    }

    // 스타일 복원
    document.body.style.overflow = originalBodyOverflow;
    document.body.style.position = originalBodyPosition;
    document.body.style.width = originalBodyWidth;
    document.body.style.height = originalBodyHeight;
    document.documentElement.style.overflow = originalHtmlOverflow;
    document.documentElement.style.position = originalHtmlPosition;

    // 컨테이너 제거
    if (document.body.contains(container)) {
      container.style.display = "none";
      document.body.removeChild(container);
    }

    // 강제 리플로우로 UI 복구
    requestAnimationFrame(() => {
      void document.body.offsetHeight;
      void document.documentElement.offsetHeight;
    });
  }
}
