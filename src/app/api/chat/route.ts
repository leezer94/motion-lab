import { NextResponse } from "next/server";

type ChatMessage = {
  role: string;
  content: string;
};

type ChatRequestBody = {
  messages: ChatMessage[];
  locale?: string;
  max_matches?: number;
};

const CHATBOT_SERVER_URL = process.env.CHATBOT_SERVER_URL ?? "http://127.0.0.1:8000/chat";

export async function POST(request: Request) {
  let body: ChatRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  if (!body.messages || body.messages.length === 0) {
    return NextResponse.json({ error: "messages is required" }, { status: 400 });
  }

  try {
    const res = await fetch(CHATBOT_SERVER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: `Chat service error (${res.status}): ${text}` },
        { status: 502 },
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: `Unable to reach chat service: ${String(error)}` },
      { status: 502 },
    );
  }
}
