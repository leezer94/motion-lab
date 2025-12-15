"use client";

import { Download } from "lucide-react";
import { useState } from "react";
import { cn } from "@/design-system/utils/cn";
import { useExcelExport } from "../lib/use-excel-export";
import type { AutomationLog } from "../model/logs";

type ExcelExportButtonProps = {
  logs: AutomationLog[];
  filename?: string;
};

/**
 * Excel 내보내기 버튼 컴포넌트
 */
export function ExcelExportButton({ logs, filename = "automation-logs" }: ExcelExportButtonProps) {
  const { exportToExcel } = useExcelExport();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (logs.length === 0) {
      alert("내보낼 데이터가 없습니다.");
      return;
    }

    setIsExporting(true);
    try {
      await exportToExcel(logs, filename);
    } catch (error) {
      console.error("Excel export failed:", error);
      alert("Excel 파일 내보내기에 실패했습니다.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting || logs.length === 0}
      className={cn(
        "inline-flex items-center gap-2 rounded-xl border border-emerald-400/50 bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-300 transition",
        "hover:bg-emerald-500/30 hover:border-emerald-400",
        "disabled:opacity-50 disabled:cursor-not-allowed",
      )}
    >
      <Download className="h-4 w-4" />
      {isExporting ? "내보내는 중..." : "Excel 내보내기"}
    </button>
  );
}
