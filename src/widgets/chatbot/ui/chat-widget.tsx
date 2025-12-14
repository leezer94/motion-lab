"use client";

import { Fragment, type FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLocale } from "next-intl";
import { useChatbot, type ChatbotMessage, type ChatMatch } from "@/features/chatbot";
import { cn } from "@/design-system/utils/cn";
import { useIsMobile } from "@/shared/hooks/use-is-mobile";
import { MessageSquare, X, SendHorizontal, Loader2 } from "@/shared/icons";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, isThinking, sendMessage, error, resetConversation, suggestions } = useChatbot();
  const locale = useLocale();
  const isMobile = useIsMobile();
  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking, isOpen]);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!input.trim()) {
        return;
      }
      const nextMessage = input;
      setInput("");
      await sendMessage(nextMessage);
    },
    [input, sendMessage],
  );

  const handleSuggestionClick = useCallback(
    async (suggestion: string) => {
      setInput("");
      await sendMessage(suggestion);
    },
    [sendMessage],
  );

  const panelWidth = isMobile ? "w-full" : "w-[400px]";

  return (
    <div className="pointer-events-none fixed bottom-6 right-4 z-50 flex flex-col items-end gap-3 sm:right-6">
      <AnimatePresence>
        {isOpen ? (
          <motion.section
            key="chat-panel"
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.22, type: "spring", stiffness: 260, damping: 24 }}
            className={cn(
              "pointer-events-auto overflow-hidden rounded-3xl border border-border/60 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.15),_transparent_45%),_rgba(15,23,42,0.9)] p-5 text-sm text-foreground shadow-[0_30px_80px_rgba(15,23,42,0.45)] backdrop-blur",
              panelWidth,
            )}
          >
            <ChatWidgetHeader
              onClose={() => setIsOpen(false)}
              onReset={resetConversation}
              isBusy={isThinking}
            />

            <div className="mt-4 flex flex-col gap-4">
              <ChatHistory messages={messages} isThinking={isThinking} locale={locale} />

              {error ? (
                <div className="rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-xs text-destructive">
                  {error.message}
                </div>
              ) : null}

              {messages.length === 0 ? (
                <QuickPromptList
                  suggestions={suggestions}
                  onSelect={handleSuggestionClick}
                  isBusy={isThinking}
                />
              ) : null}

              <ChatInputForm
                value={input}
                onChange={setInput}
                onSubmit={handleSubmit}
                disabled={isThinking}
              />
            </div>
            <div ref={scrollAnchorRef} />
          </motion.section>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="button"
        aria-label={isOpen ? "챗봇 닫기" : "Motion Lab 챗봇 열기"}
        className={cn(
          "pointer-events-auto inline-flex h-14 w-14 items-center justify-center rounded-full border border-border/60 bg-background/90 text-foreground shadow-[0_15px_40px_rgba(15,23,42,0.35)] transition hover:border-primary/40 hover:text-primary",
          isThinking && !isOpen ? "animate-pulse" : "",
        )}
        onClick={() => setIsOpen((prev) => !prev)}
        whileTap={{ scale: 0.92 }}
      >
        {isOpen ? <X className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
      </motion.button>
    </div>
  );
}

type ChatWidgetHeaderProps = {
  onClose: () => void;
  onReset: () => void;
  isBusy: boolean;
};

function ChatWidgetHeader({ onClose, onReset, isBusy }: ChatWidgetHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-3">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Motion Lab
        </p>
        <h2 className="text-lg font-semibold">Playground Copilot</h2>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onReset}
          disabled={isBusy}
          className="rounded-full border border-border/60 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground transition hover:border-primary/40 hover:text-primary disabled:opacity-50"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-border/60 p-2 text-muted-foreground transition hover:border-primary/40 hover:text-primary"
          aria-label="챗봇 닫기"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}

type ChatHistoryProps = {
  messages: ChatbotMessage[];
  isThinking: boolean;
  locale: string;
};

function ChatHistory({ messages, isThinking, locale }: ChatHistoryProps) {
  const basePath = `/${locale}/motions`;
  return (
    <div className="max-h-[360px] space-y-4 overflow-y-auto pr-1">
      {messages.map((message) => (
        <div key={message.id} className="space-y-3">
          <ChatBubble message={message} />
          {message.matches && message.matches.length > 0 ? (
            <ChatMatchList matches={message.matches} fallbackBasePath={basePath} />
          ) : null}
        </div>
      ))}
      {isThinking ? <ThinkingBubble /> : null}
    </div>
  );
}

function ChatBubble({ message }: { message: ChatbotMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl border px-4 py-3 text-sm shadow-sm",
          isUser
            ? "border-primary/30 bg-primary/10 text-primary-foreground"
            : "border-border/60 bg-card/80 text-foreground",
        )}
      >
        <p className="leading-relaxed">{renderMessageWithLinks(message.content)}</p>
      </div>
    </div>
  );
}

function ThinkingBubble() {
  return (
    <div className="flex gap-3">
      <div className="rounded-2xl border border-border/50 bg-card/70 px-4 py-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Motion insight를 불러오는 중...</span>
        </div>
      </div>
    </div>
  );
}

type ChatMatchListProps = {
  matches: ChatMatch[];
  fallbackBasePath: string;
};

function ChatMatchList({ matches, fallbackBasePath }: ChatMatchListProps) {
  return (
    <ul className="space-y-2">
      {matches.map((match) => (
        <li
          key={match.slug}
          className="rounded-2xl border border-border/50 bg-background/80 p-3 text-xs shadow-inner"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            {match.kicker}
          </p>
          <div className="mt-1 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold">{match.title}</p>
            <a
              className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary transition hover:text-primary/80"
              href={match.url ?? `${fallbackBasePath}/${match.slug}`}
            >
              View
            </a>
          </div>
          <p className="mt-1 text-muted-foreground">{match.description}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {match.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-primary"
              >
                {tag}
              </span>
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
}

type QuickPromptListProps = {
  suggestions: string[];
  onSelect: (prompt: string) => void;
  isBusy: boolean;
};

function QuickPromptList({ suggestions, onSelect, isBusy }: QuickPromptListProps) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/60 p-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
        빠른 질문
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => onSelect(suggestion)}
            disabled={isBusy}
            className="rounded-full border border-border/60 px-3 py-1 text-xs text-muted-foreground transition hover:border-primary/40 hover:text-primary disabled:opacity-50"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}

type ChatInputFormProps = {
  value: string;
  onChange: (next: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  disabled?: boolean;
};

function ChatInputForm({ value, onChange, onSubmit, disabled }: ChatInputFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex items-end gap-3">
      <label className="sr-only" htmlFor="motion-chat-input">
        Motion Lab 챗 입력창
      </label>
      <textarea
        id="motion-chat-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={2}
        placeholder="궁금한 모션이나 상황을 물어보세요"
        className="min-h-[64px] flex-1 resize-none rounded-2xl border border-border/60 bg-transparent px-4 py-3 text-sm text-foreground outline-none ring-0 transition focus:border-primary/50"
        disabled={disabled}
      />
      <button
        type="submit"
        disabled={disabled || value.trim().length === 0}
        className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/50 bg-primary text-primary-foreground shadow-lg transition hover:brightness-110 disabled:opacity-50"
        aria-label="메시지 전송"
      >
        {disabled ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <SendHorizontal className="h-5 w-5" />
        )}
      </button>
    </form>
  );
}

const URL_PATTERN = /(https?:\/\/[^\s]+)/g;

function renderMessageWithLinks(text: string) {
  const lines = text.split("\n");

  return lines.map((line, lineIndex) => (
    <Fragment key={`line-${lineIndex}`}>
      {lineIndex > 0 ? <br /> : null}
      {line.split(URL_PATTERN).map((segment, segmentIndex) => {
        if (!segment) {
          return null;
        }

        const normalized = segment.trim();
        const isUrl =
          normalized.startsWith("http://") ||
          normalized.startsWith("https://") ||
          normalized.startsWith("www.");

        if (!isUrl) {
          return <Fragment key={`segment-${lineIndex}-${segmentIndex}`}>{segment}</Fragment>;
        }

        const href = normalized.startsWith("www.") ? `https://${normalized}` : normalized;
        const displayText = href.replace(/^https?:\/\/[^/]+/, "") || href;
        return (
          <a
            key={`link-${lineIndex}-${segmentIndex}`}
            href={href}
            className="break-all font-medium text-primary underline-offset-4 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            {displayText}
          </a>
        );
      })}
    </Fragment>
  ));
}
