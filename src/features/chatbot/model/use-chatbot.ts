"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useLocale } from "next-intl";
import type { ChatbotMessage, ChatbotError, ChatMatch, ChatRequestPayload } from "./chatbot-types";

const DEFAULT_MAX_MATCHES = 3;

const QUICK_PROMPTS = [
  "다크 모드에 어울리는 버튼 모션 추천해줘",
  "타임라인 여정 표현에 맞는 동작 있어?",
  "몰입감 있는 인터랙션 모션을 알려줘",
];

export type UseChatbotOptions = {
  locale?: string;
  maxMatches?: number;
};

export type UseChatbotReturn = {
  messages: ChatbotMessage[];
  isThinking: boolean;
  error: ChatbotError | null;
  sendMessage: (text: string) => Promise<void>;
  resetConversation: () => void;
  suggestions: string[];
};

export function useChatbot(options?: UseChatbotOptions): UseChatbotReturn {
  const locale = useLocale();
  const effectiveLocale = options?.locale ?? locale;
  const maxMatches = options?.maxMatches ?? DEFAULT_MAX_MATCHES;

  const [messages, setMessages] = useState<ChatbotMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState<ChatbotError | null>(null);
  const messagesRef = useRef<ChatbotMessage[]>([]);

  const updateMessages = useCallback((next: ChatbotMessage[]) => {
    messagesRef.current = next;
    setMessages(next);
  }, []);

  const pushMessage = useCallback(
    (message: ChatbotMessage) => {
      updateMessages([...messagesRef.current, message]);
    },
    [updateMessages],
  );

  const resetConversation = useCallback(() => {
    messagesRef.current = [];
    setMessages([]);
    setError(null);
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isThinking) {
        return;
      }

      setError(null);
      const userMessage: ChatbotMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: trimmed,
        createdAt: Date.now(),
      };

      pushMessage(userMessage);
      setIsThinking(true);

      const payload: ChatRequestPayload = {
        messages: [...messagesRef.current].map(({ role, content }) => ({ role, content })),
        locale: effectiveLocale,
        max_matches: maxMatches,
      };

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.error ?? "챗봇 응답을 불러오지 못했습니다.");
        }

        const assistantMessage: ChatbotMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.reply,
          createdAt: Date.now(),
          matches: data.matches as ChatMatch[] | undefined,
        };

        pushMessage(assistantMessage);
      } catch (err) {
        setError({
          message: err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.",
          timestamp: Date.now(),
        });
      } finally {
        setIsThinking(false);
      }
    },
    [effectiveLocale, isThinking, maxMatches, pushMessage],
  );

  const suggestions = useMemo(() => QUICK_PROMPTS, []);

  return {
    messages,
    isThinking,
    error,
    sendMessage,
    resetConversation,
    suggestions,
  };
}
