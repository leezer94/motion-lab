import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SSR Demo - Server-Side Rendering",
  description: "Next.js SSR (Server-Side Rendering) 데모 페이지",
};

/**
 * SSR (Server-Side Rendering) 데모 페이지
 * - 매 요청마다 서버에서 렌더링됩니다
 * - 항상 최신 데이터를 표시합니다
 */
export default async function SSRDemoPage() {
  // 서버에서 데이터 가져오기 (매 요청마다 실행)
  const serverTime = new Date().toISOString();
  // 타임스탬프 기반 값 (매 요청마다 다름, 순수 함수 규칙 준수)
  const uniqueNumber = Number.parseInt(serverTime.slice(-6).replace(/[-:T]/g, ""), 10) % 1000;

  // 외부 API 호출 시뮬레이션
  const response = await fetch("https://api.github.com/repos/vercel/next.js", {
    next: { revalidate: 0 }, // 캐시하지 않음 (SSR)
  });
  const repoData = await response.json();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">SSR Demo</h1>
          <p className="text-lg text-slate-300">
            Server-Side Rendering - 매 요청마다 서버에서 렌더링
          </p>
        </div>

        <div className="space-y-6">
          {/* 렌더링 정보 카드 */}
          <div className="rounded-2xl border border-purple-500/20 bg-purple-500/10 p-6 backdrop-blur-sm">
            <h2 className="mb-4 text-xl font-semibold">렌더링 정보</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3">
                <span className="text-slate-300">렌더링 타입:</span>
                <span className="font-mono font-semibold text-purple-300">SSR</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3">
                <span className="text-slate-300">서버 시간:</span>
                <span className="font-mono text-sm text-purple-300">{serverTime}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3">
                <span className="text-slate-300">고유 숫자:</span>
                <span className="font-mono font-semibold text-purple-300">{uniqueNumber}</span>
              </div>
            </div>
          </div>

          {/* GitHub API 데이터 카드 */}
          <div className="rounded-2xl border border-purple-500/20 bg-purple-500/10 p-6 backdrop-blur-sm">
            <h2 className="mb-4 text-xl font-semibold">실시간 API 데이터</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3">
                <span className="text-slate-300">Repository:</span>
                <span className="font-semibold text-purple-300">{repoData.full_name}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3">
                <span className="text-slate-300">Stars:</span>
                <span className="font-semibold text-purple-300">
                  {repoData.stargazers_count?.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3">
                <span className="text-slate-300">Forks:</span>
                <span className="font-semibold text-purple-300">
                  {repoData.forks_count?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* 특징 설명 */}
          <div className="rounded-2xl border border-purple-500/20 bg-purple-500/10 p-6 backdrop-blur-sm">
            <h2 className="mb-4 text-xl font-semibold">SSR 특징</h2>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-purple-300">✓</span>
                <span>매 요청마다 서버에서 렌더링되어 항상 최신 데이터 표시</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-300">✓</span>
                <span>동적 콘텐츠에 적합 (사용자별 맞춤 데이터)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-300">✓</span>
                <span>SEO에 유리 (서버에서 완전히 렌더링된 HTML 제공)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-300">⚠</span>
                <span>서버 부하가 높을 수 있음 (매 요청마다 처리)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
