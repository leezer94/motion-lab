export type ChatRole = "user" | "assistant";

export type ChatMatch = {
  slug: string;
  title: string;
  kicker: string;
  description: string;
  tags: string[];
  url?: string;
};

export type ChatbotMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
  matches?: ChatMatch[];
};

export type ChatbotError = {
  message: string;
  timestamp: number;
};

export type ChatRequestPayload = {
  messages: Array<Pick<ChatbotMessage, "role" | "content">>;
  locale: string;
  max_matches: number;
};
