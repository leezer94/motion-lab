"use client";

import * as ExcelJS from "exceljs";
import type { AutomationLog } from "../model/logs";

/**
 * Excel 파일로 로그 데이터를 내보내는 hook
 */
export function useExcelExport() {
  const exportToExcel = async (logs: AutomationLog[], filename: string = "automation-logs") => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("실행 로그");

    // 헤더 스타일
    const headerStyle = {
      font: { bold: true, color: { argb: "FFFFFFFF" } },
      fill: {
        type: "pattern" as const,
        pattern: "solid" as const,
        fgColor: { argb: "FF10B981" }, // emerald-500
      },
      alignment: { vertical: "middle" as const, horizontal: "center" as const },
      border: {
        top: { style: "thin" as const },
        left: { style: "thin" as const },
        bottom: { style: "thin" as const },
        right: { style: "thin" as const },
      },
    };

    // 헤더 추가
    worksheet.columns = [
      { header: "ID", key: "id", width: 15 },
      { header: "워크플로 이름", key: "workflowName", width: 25 },
      { header: "상태", key: "status", width: 12 },
      { header: "레벨", key: "level", width: 10 },
      { header: "실행 시간 (ms)", key: "executionTime", width: 18 },
      { header: "처리 레코드 수", key: "recordCount", width: 18 },
      { header: "시작 시간", key: "startTime", width: 20 },
      { header: "종료 시간", key: "endTime", width: 20 },
      { header: "소요 시간 (초)", key: "duration", width: 15 },
      { header: "실행자", key: "triggeredBy", width: 15 },
      { header: "에러 메시지", key: "errorMessage", width: 40 },
    ];

    // 헤더 행 스타일 적용
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.style = headerStyle;
    });

    // 데이터 추가
    logs.forEach((log) => {
      worksheet.addRow({
        id: log.id,
        workflowName: log.workflowName,
        status: getStatusLabel(log.status),
        level: getLevelLabel(log.level),
        executionTime: log.executionTime,
        recordCount: log.recordCount,
        startTime: log.startTime.toLocaleString("ko-KR"),
        endTime: log.endTime ? log.endTime.toLocaleString("ko-KR") : "-",
        duration: log.duration,
        triggeredBy: log.triggeredBy,
        errorMessage: log.errorMessage || "-",
      });
    });

    // 데이터 행 스타일
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
          cell.alignment = { vertical: "middle", horizontal: "left" };
        });
      }
    });

    // 파일 다운로드
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}-${new Date().toISOString().split("T")[0]}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return { exportToExcel };
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    success: "성공",
    failed: "실패",
    pending: "대기",
    running: "실행중",
  };
  return labels[status] || status;
}

function getLevelLabel(level: string): string {
  const labels: Record<string, string> = {
    info: "정보",
    warning: "경고",
    error: "오류",
    debug: "디버그",
  };
  return labels[level] || level;
}
