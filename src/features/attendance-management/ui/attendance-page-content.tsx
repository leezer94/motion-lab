"use client";

import { useState, useEffect } from "react";
import { Calendar, MapPin, QrCode, Users, CheckCircle, XCircle, Clock } from "lucide-react";
import { mockAttendanceSessions } from "../model/attendance";
import type { AttendanceSession, AttendanceMethod } from "../model/attendance";

/**
 * 자동 출석 관리 페이지 메인 컨텐츠 컴포넌트
 */
export function AttendancePageContent() {
  const [sessions] = useState<AttendanceSession[]>(mockAttendanceSessions);
  const [selectedSession, setSelectedSession] = useState<AttendanceSession | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // 클라이언트 마운트 확인
  // Next.js Hydration 문제 해결을 위한 표준 패턴
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  const getMethodIcon = (method: AttendanceMethod) => {
    switch (method) {
      case "qr":
        return QrCode;
      case "gps":
        return MapPin;
      case "manual":
        return Users;
    }
  };

  const getMethodLabel = (method: AttendanceMethod) => {
    switch (method) {
      case "qr":
        return "QR 코드";
      case "gps":
        return "GPS 위치";
      case "manual":
        return "수동";
    }
  };

  const getStatusStats = (session: AttendanceSession) => {
    const attendanceRate =
      ((session.presentCount + session.lateCount) / session.totalStudents) * 100;
    return {
      attendanceRate: attendanceRate.toFixed(1),
      presentCount: session.presentCount,
      absentCount: session.absentCount,
      lateCount: session.lateCount,
    };
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">자동 출석 관리</h1>
          <p className="mt-2 text-slate-400">QR 코드 및 GPS 기반 출석 체크 및 출석률 관리</p>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-emerald-500/20 p-2">
              <CheckCircle className="h-5 w-5 text-emerald-300" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">출석률</p>
              <p className="mt-1 text-2xl font-semibold text-white">
                {isMounted
                  ? sessions.length > 0
                    ? (
                        sessions.reduce((acc, s) => {
                          const stats = getStatusStats(s);
                          return acc + parseFloat(stats.attendanceRate);
                        }, 0) / sessions.length
                      ).toFixed(1)
                    : "0"
                  : "-"}
                {isMounted && "%"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-500/20 p-2">
              <Users className="h-5 w-5 text-blue-300" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">총 세션</p>
              <p className="mt-1 text-2xl font-semibold text-white">
                {isMounted ? sessions.length : "-"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-yellow-500/20 p-2">
              <Clock className="h-5 w-5 text-yellow-300" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">지각</p>
              <p className="mt-1 text-2xl font-semibold text-white">
                {isMounted ? sessions.reduce((acc, s) => acc + s.lateCount, 0) : "-"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-red-500/20 p-2">
              <XCircle className="h-5 w-5 text-red-300" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">결석</p>
              <p className="mt-1 text-2xl font-semibold text-white">
                {isMounted ? sessions.reduce((acc, s) => acc + s.absentCount, 0) : "-"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 출석 세션 목록 */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
        <div className="border-b border-white/10 px-6 py-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-200">
            출석 세션 목록
          </h3>
        </div>
        <div className="divide-y divide-white/5">
          {sessions.length === 0 ? (
            <div className="px-6 py-12 text-center text-slate-400">출석 세션이 없습니다.</div>
          ) : (
            sessions.map((session) => {
              const MethodIcon = getMethodIcon(session.method);
              const stats = getStatusStats(session);
              return (
                <div
                  key={session.id}
                  className="px-6 py-4 transition hover:bg-white/5 cursor-pointer"
                  onClick={() => setSelectedSession(session)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <MethodIcon className="h-5 w-5 text-emerald-300" />
                        <h4 className="text-lg font-semibold text-white">{session.courseTitle}</h4>
                        <span className="rounded-full bg-slate-700/50 px-2 py-1 text-xs text-slate-300">
                          {getMethodLabel(session.method)}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-4 text-sm text-slate-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {session.sessionDate.toLocaleDateString("ko-KR")}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {session.startTime.toLocaleTimeString("ko-KR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {" - "}
                          {session.endTime.toLocaleTimeString("ko-KR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        {session.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {session.location.name}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="ml-4 flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-xs text-slate-400">출석률</p>
                        <p className="mt-1 text-lg font-semibold text-emerald-300">
                          {stats.attendanceRate}%
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-400">출석/지각/결석</p>
                        <p className="mt-1 text-sm font-semibold text-white">
                          {stats.presentCount} / {stats.lateCount} / {stats.absentCount}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 세션 상세 정보 모달 */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedSession(null)}
          />
          <div className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-900/95 shadow-2xl backdrop-blur-xl">
            <div className="border-b border-white/10 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-white">
                    {selectedSession.courseTitle}
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    {selectedSession.sessionDate.toLocaleDateString("ko-KR")}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedSession(null)}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="px-6 py-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">출석 방법</p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    {getMethodLabel(selectedSession.method)}
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">총 수강생</p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    {selectedSession.totalStudents}명
                  </p>
                </div>
              </div>
              {selectedSession.qrCode && (
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-2">QR 코드</p>
                  <div className="flex items-center gap-2">
                    <QrCode className="h-5 w-5 text-emerald-300" />
                    <code className="text-sm font-mono text-emerald-300">
                      {selectedSession.qrCode}
                    </code>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
