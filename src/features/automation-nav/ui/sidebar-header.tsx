/**
 * 사이드바 상단 헤더 컴포넌트
 * JAKOREA 브랜딩과 설명을 표시
 */
export function SidebarHeader() {
  return (
    <div className="mb-8 flex flex-col gap-1">
      <p className="text-sm font-semibold uppercase tracking-[0.6em] text-emerald-200/80">
        JAKOREA
      </p>
      <h2 className="text-2xl font-semibold text-white">업무 자동화 허브</h2>
      <p className="text-sm text-slate-400">설계·실행·연동을 한 번에 관리하세요.</p>
    </div>
  );
}
