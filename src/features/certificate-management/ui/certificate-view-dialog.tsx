"use client";

import { motion, AnimatePresence } from "motion/react";
import { X, Download, CheckCircle } from "lucide-react";
import { cn } from "@/design-system/utils/cn";
import type { Certificate } from "../model/certificates";

type CertificateViewDialogProps = {
  certificate: Certificate | null;
  isOpen: boolean;
  onClose: () => void;
};

/**
 * 교육증 확인 및 PDF 출력 다이얼로그
 */
export function CertificateViewDialog({
  certificate,
  isOpen,
  onClose,
}: CertificateViewDialogProps) {
  if (!certificate || !isOpen) return null;

  const handleDownloadPDF = () => {
    // PDF 생성 기능은 현재 비활성화되어 있습니다.
    alert("PDF 다운로드 기능은 준비 중입니다.");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />

          {/* Dialog */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-slate-900/95 shadow-2xl backdrop-blur-xl pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                <div>
                  <h2 className="text-2xl font-semibold text-white">교육증 확인</h2>
                  <p className="mt-1 text-sm text-slate-400">
                    교육 이수 내역을 확인하고 PDF로 출력할 수 있습니다.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto px-6 py-6">
                <div className="space-y-6">
                  {/* 교육증 정보 카드 */}
                  <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-6 backdrop-blur">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="rounded-full bg-emerald-500/20 p-2">
                        <CheckCircle className="h-6 w-6 text-emerald-300" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-emerald-300">교육 이수증</h3>
                        <p className="text-xs text-slate-400">
                          교육증 번호: {certificate.certificateNumber}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 mt-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-1">
                            수강생
                          </p>
                          <p className="text-sm font-semibold text-white">
                            {certificate.studentName}
                          </p>
                          <p className="text-xs text-slate-400">학번: {certificate.studentId}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-1">
                            강의명
                          </p>
                          <p className="text-sm font-semibold text-white">
                            {certificate.courseTitle}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                        <div>
                          <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-1">
                            이수일
                          </p>
                          <p className="text-sm font-semibold text-white">
                            {certificate.completedAt.toLocaleDateString("ko-KR")}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-1">
                            성적
                          </p>
                          <p className="text-sm font-semibold text-emerald-300">
                            {certificate.grade}점
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-1">
                            출석률
                          </p>
                          <p className="text-sm font-semibold text-blue-300">
                            {certificate.attendance}%
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-white/10">
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-1">
                          발급일
                        </p>
                        <p className="text-sm text-slate-300">
                          {certificate.issuedAt.toLocaleDateString("ko-KR")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* PDF 다운로드 버튼 */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
                    >
                      닫기
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadPDF}
                      className={cn(
                        "flex items-center justify-center gap-2 flex-1 rounded-xl bg-emerald-500/20 px-6 py-3 text-sm font-semibold text-emerald-300 transition",
                        "hover:bg-emerald-500/30",
                      )}
                    >
                      <Download className="h-4 w-4" />
                      PDF 다운로드
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
