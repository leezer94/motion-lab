import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SSG Demo - Static Site Generation",
  description: "Next.js SSG (Static Site Generation) 데모 페이지",
};

/**
 * SSG (Static Site Generation) 데모 페이지
 * - 빌드 시점에 정적으로 생성됩니다
 * - 모든 사용자에게 동일한 콘텐츠를 제공합니다
 */
// 빌드 시점에 고정되는 값 (환경 변수로 설정 가능)
const BUILD_TIME = process.env.BUILD_TIME || new Date().toISOString();
const STATIC_NUMBER = 42; // 빌드 시 결정된 값

export default async function SSGDemoPage() {
  // 정적 데이터 (빌드 시 한 번만 가져옴)
  const response = await fetch("https://api.github.com/repos/vercel/next.js", {
    cache: "force-cache", // 캐시 강제 (SSG)
  });
  const repoData = await response.json();

  // 개발 환경인지 확인
  const isDevelopment = process.env.NODE_ENV === "development";

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">SSG Demo</h1>
          <p className="text-lg text-slate-300">
            Static Site Generation - 빌드 시점에 정적으로 생성
          </p>
        </div>

        <div className="space-y-6">
          {/* 렌더링 정보 카드 */}
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-6 backdrop-blur-sm">
            <h2 className="mb-4 text-xl font-semibold">렌더링 정보</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3">
                <span className="text-slate-300">렌더링 타입:</span>
                <span className="font-mono font-semibold text-blue-300">SSG</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3">
                <span className="text-slate-300">빌드 시간:</span>
                <span className="font-mono text-sm text-blue-300">{BUILD_TIME}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3">
                <span className="text-slate-300">정적 숫자:</span>
                <span className="font-mono font-semibold text-blue-300">{STATIC_NUMBER}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3">
                <span className="text-slate-300">환경:</span>
                <span className="font-mono font-semibold text-blue-300">
                  {isDevelopment ? "개발 (dev)" : "프로덕션 (build)"}
                </span>
              </div>
              {isDevelopment ? (
                <div className="mt-4 rounded-lg bg-yellow-500/10 px-4 py-3 text-sm text-yellow-300">
                  ⚠️ 개발 환경(`next dev`)에서는 SSG가 SSR처럼 동작합니다. 진짜 SSG를 보려면{" "}
                  <code className="rounded bg-yellow-500/20 px-1">npm run build</code> 후{" "}
                  <code className="rounded bg-yellow-500/20 px-1">npm start</code>를 실행하세요.
                </div>
              ) : (
                <div className="mt-4 rounded-lg bg-blue-500/20 px-4 py-3 text-sm text-blue-300">
                  ✓ 이 페이지는 빌드 시 생성되었습니다. 새로고침해도 값이 변하지 않습니다.
                </div>
              )}
            </div>
          </div>

          {/* GitHub API 데이터 카드 */}
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-6 backdrop-blur-sm">
            <h2 className="mb-4 text-xl font-semibold">빌드 시점 API 데이터</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3">
                <span className="text-slate-300">Repository:</span>
                <span className="font-semibold text-blue-300">{repoData.full_name}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3">
                <span className="text-slate-300">Stars:</span>
                <span className="font-semibold text-blue-300">
                  {repoData.stargazers_count?.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3">
                <span className="text-slate-300">Forks:</span>
                <span className="font-semibold text-blue-300">
                  {repoData.forks_count?.toLocaleString()}
                </span>
              </div>
              <div className="mt-4 rounded-lg bg-yellow-500/10 px-4 py-3 text-sm text-yellow-300">
                ⚠️ 이 데이터는 빌드 시점의 값입니다. 재배포 전까지 업데이트되지 않습니다.
              </div>
            </div>
          </div>

          {/* 특징 설명 */}
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-6 backdrop-blur-sm">
            <h2 className="mb-4 text-xl font-semibold">SSG 특징</h2>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-300">✓</span>
                <span>빌드 시점에 한 번만 생성되어 매우 빠른 로딩 속도</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300">✓</span>
                <span>CDN에 캐시되어 전 세계 어디서나 빠른 접근</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300">✓</span>
                <span>서버 부하가 없음 (정적 파일 제공)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-300">⚠</span>
                <span>데이터 업데이트 시 재배포 필요</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-300">⚠</span>
                <span>동적 콘텐츠에는 부적합</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
