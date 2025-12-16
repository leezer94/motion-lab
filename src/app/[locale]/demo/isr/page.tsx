import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ISR Demo - Incremental Static Regeneration",
  description: "Next.js ISR (Incremental Static Regeneration) 데모 페이지",
};

/**
 * ISR (Incremental Static Regeneration) 데모 페이지
 * - 빌드 시 정적으로 생성되지만, 주기적으로 재생성됩니다
 * - revalidate 옵션으로 재생성 주기 설정
 */
export const revalidate = 10; // 10초마다 재생성

export default async function ISRDemoPage() {
  // ISR: 주기적으로 재생성되는 데이터
  const renderTime = new Date().toISOString();
  // 타임스탬프 기반 값 (재생성마다 다름, 순수 함수 규칙 준수)
  const uniqueNumber = Number.parseInt(renderTime.slice(-6).replace(/[-:T]/g, ""), 10) % 1000;

  // 외부 API 호출 (revalidate 주기에 따라 재생성)
  const response = await fetch("https://api.github.com/repos/vercel/next.js", {
    next: { revalidate: 10 }, // 10초마다 재생성
  });
  const repoData = await response.json();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">ISR Demo</h1>
          <p className="text-lg text-slate-300">
            Incremental Static Regeneration - 주기적으로 재생성되는 정적 페이지
          </p>
        </div>

        <div className="space-y-6">
          {/* 렌더링 정보 카드 */}
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6 backdrop-blur-sm">
            <h2 className="mb-4 text-xl font-semibold">렌더링 정보</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3">
                <span className="text-slate-300">렌더링 타입:</span>
                <span className="font-mono font-semibold text-emerald-300">ISR</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3">
                <span className="text-slate-300">재생성 주기:</span>
                <span className="font-mono font-semibold text-emerald-300">10초</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3">
                <span className="text-slate-300">렌더링 시간:</span>
                <span className="font-mono text-sm text-emerald-300">{renderTime}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3">
                <span className="text-slate-300">고유 숫자:</span>
                <span className="font-mono font-semibold text-emerald-300">{uniqueNumber}</span>
              </div>
              <div className="mt-4 rounded-lg bg-emerald-500/20 px-4 py-3 text-sm text-emerald-300">
                💡 이 페이지는 10초마다 자동으로 재생성됩니다. 새로고침하면 최신 데이터를 볼 수
                있습니다.
              </div>
            </div>
          </div>

          {/* GitHub API 데이터 카드 */}
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6 backdrop-blur-sm">
            <h2 className="mb-4 text-xl font-semibold">주기적 업데이트 API 데이터</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3">
                <span className="text-slate-300">Repository:</span>
                <span className="font-semibold text-emerald-300">{repoData.full_name}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3">
                <span className="text-slate-300">Stars:</span>
                <span className="font-semibold text-emerald-300">
                  {repoData.stargazers_count?.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3">
                <span className="text-slate-300">Forks:</span>
                <span className="font-semibold text-emerald-300">
                  {repoData.forks_count?.toLocaleString()}
                </span>
              </div>
              <div className="mt-4 rounded-lg bg-emerald-500/20 px-4 py-3 text-sm text-emerald-300">
                💡 이 데이터는 10초마다 자동으로 업데이트됩니다.
              </div>
            </div>
          </div>

          {/* 특징 설명 */}
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6 backdrop-blur-sm">
            <h2 className="mb-4 text-xl font-semibold">ISR 특징</h2>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-300">✓</span>
                <span>SSG의 빠른 성능과 SSR의 최신 데이터를 결합</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-300">✓</span>
                <span>주기적으로 자동 재생성되어 데이터가 최신 상태 유지</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-300">✓</span>
                <span>재생성 중에도 기존 페이지 제공 (무중단 업데이트)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-300">✓</span>
                <span>블로그, 뉴스 등 주기적 업데이트 콘텐츠에 최적</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-300">⚠</span>
                <span>재생성 주기 설정에 따라 데이터 최신성과 성능의 균형 필요</span>
              </li>
            </ul>
          </div>

          {/* 비교 테이블 */}
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6 backdrop-blur-sm">
            <h2 className="mb-4 text-xl font-semibold">렌더링 방식 비교</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-4 py-3 text-left text-slate-300">방식</th>
                    <th className="px-4 py-3 text-left text-slate-300">렌더링 시점</th>
                    <th className="px-4 py-3 text-left text-slate-300">데이터 최신성</th>
                    <th className="px-4 py-3 text-left text-slate-300">성능</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300">
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-3 font-semibold text-purple-300">SSR</td>
                    <td className="px-4 py-3">매 요청</td>
                    <td className="px-4 py-3">항상 최신</td>
                    <td className="px-4 py-3">보통</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-3 font-semibold text-blue-300">SSG</td>
                    <td className="px-4 py-3">빌드 시</td>
                    <td className="px-4 py-3">빌드 시점</td>
                    <td className="px-4 py-3">매우 빠름</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-emerald-300">ISR</td>
                    <td className="px-4 py-3">주기적</td>
                    <td className="px-4 py-3">설정 주기</td>
                    <td className="px-4 py-3">빠름</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
