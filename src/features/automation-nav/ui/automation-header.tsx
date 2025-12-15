/**
 * Automation 헤더 컴포넌트
 * 현재 활성 페이지의 제목과 설명을 표시
 */
type AutomationHeaderProps = {
  activeTitle: string;
};

export function AutomationHeader({ activeTitle }: AutomationHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-white/5 px-10 py-6 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-200">
          운영 현황
        </p>
        <h1 className="text-3xl font-semibold">{activeTitle}</h1>
        <p className="text-sm text-slate-400">
          헤더에 생성/배포 액션 및 전역 검색이 추가될 예정입니다.
        </p>
      </div>
    </header>
  );
}
