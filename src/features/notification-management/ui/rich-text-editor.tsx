"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/design-system/utils/cn";

// React Quill New를 dynamic import로 로드 (SSR 방지 및 React 19 호환)
const ReactQuill = dynamic(
  async () => {
    const mod = await import("react-quill-new");
    return { default: mod.default || mod };
  },
  { ssr: false },
);

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

/**
 * 리치 텍스트 에디터 컴포넌트 (React Quill 사용)
 */
export function RichTextEditor({
  value,
  onChange,
  placeholder = "내용을 입력하세요...",
  className,
}: RichTextEditorProps) {
  // 모든 hooks를 최상단에 배치 (Rules of Hooks 준수)
  const [isMounted, setIsMounted] = useState(false);
  const [hasError, setHasError] = useState(false);

  // CSS를 동적으로 로드하고 마운트 상태 설정
  useEffect(() => {
    if (typeof window !== "undefined") {
      Promise.all([
        // @ts-expect-error - CSS 파일 동적 import 타입 에러 무시
        import("react-quill-new/dist/quill.snow.css")
          .catch(() => {
            // CSS 로드 실패 시 무시
          })
          .catch(() => {
            // CSS 로드 실패 시 무시 (중복 catch는 무시)
          }),
      ]).finally(() => {
        // 최소한의 지연만 두어 빠른 마운트 (UI shifting 최소화)
        // requestAnimationFrame을 사용하여 다음 프레임에 마운트
        requestAnimationFrame(() => {
          setIsMounted(true);
        });
      });
    }
  }, []);

  // 전역 에러 핸들러 설정
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleError = (event: ErrorEvent) => {
      if (event.message?.includes("findDOMNode") || event.message?.includes("react-quill")) {
        event.preventDefault();
        setHasError(true);
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason?.message?.includes("findDOMNode")) {
        event.preventDefault();
        setHasError(true);
      }
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  // Quill 툴바 설정
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ color: [] }, { background: [] }],
      ["link"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list", // ordered와 bullet 리스트 모두 처리
    "color",
    "background",
    "link",
  ];

  // Fallback 에디터 (에러 발생 시 또는 로딩 중)
  const FallbackEditor = ({ isLoading = false }: { isLoading?: boolean }) => (
    <div className={cn("rounded-xl border border-white/10 bg-white/5", "min-h-[280px]", className)}>
      {isLoading ? (
        <div className="flex h-[280px] flex-col">
          {/* 툴바 스켈레톤 */}
          <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-3">
            <div className="h-6 w-6 rounded bg-white/10" />
            <div className="h-6 w-6 rounded bg-white/10" />
            <div className="h-6 w-6 rounded bg-white/10" />
            <div className="ml-auto h-6 w-6 rounded bg-white/10" />
          </div>
          {/* 에디터 영역 스켈레톤 */}
          <div className="flex-1 px-4 py-3">
            <div className="h-4 w-3/4 rounded bg-white/5 mb-2" />
            <div className="h-4 w-1/2 rounded bg-white/5" />
          </div>
        </div>
      ) : (
        <>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={10}
            className="w-full rounded-xl border-0 bg-transparent px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none min-h-[200px]"
          />
          {hasError && (
            <p className="px-4 pb-3 text-xs text-slate-400">
              리치 텍스트 에디터를 로드할 수 없어 기본 에디터를 사용합니다.
            </p>
          )}
        </>
      )}
    </div>
  );

  if (hasError) {
    return <FallbackEditor />;
  }

  if (!isMounted) {
    return <FallbackEditor isLoading />;
  }

  // ReactQuill 렌더링 시도
  try {
    return (
      <div
        className={cn("rounded-xl border border-white/10 bg-white/5", "min-h-[280px]", className)}
      >
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          className="[&_.ql-container]:min-h-[280px] [&_.ql-editor]:min-h-[200px] [&_.ql-editor]:text-white [&_.ql-editor]:placeholder:text-slate-500 [&_.ql-container]:border-0 [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-white/10 [&_.ql-toolbar]:bg-white/5 [&_.ql-toolbar]:rounded-t-xl [&_.ql-toolbar_.ql-stroke]:stroke-slate-300 [&_.ql-toolbar_.ql-fill]:fill-slate-300 [&_.ql-toolbar_button:hover_.ql-stroke]:stroke-white [&_.ql-toolbar_button:hover_.ql-fill]:fill-white [&_.ql-toolbar_button.ql-active_.ql-stroke]:stroke-emerald-300 [&_.ql-toolbar_button.ql-active_.ql-fill]:fill-emerald-300 [&_.ql-editor]:rounded-b-xl"
        />
      </div>
    );
  } catch {
    // 렌더링 중 에러 발생 시 fallback으로 전환
    return <FallbackEditor />;
  }
}
