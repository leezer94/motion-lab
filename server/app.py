"\"\"\"FastAPI bridge between Motion Lab and the local Ollama server.\"\"\""

from __future__ import annotations

from typing import List
import os

import requests
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

OLLAMA_ENDPOINT = os.environ.get("OLLAMA_ENDPOINT", "http://localhost:11434/api/chat")
OLLAMA_MODEL = os.environ.get("OLLAMA_MODEL", "qwen2.5-3b-ko:latest")
APP_BASE_URL = os.environ.get("APP_BASE_URL", "http://localhost:3000").rstrip("/")

BASE_SYSTEM_PROMPT = """
당신은 Motion Lab의 UX/Motion 어시스턴트다.
사용자가 어떤 언어로 질문하더라도 **반드시 한국어로만** 답변해야 한다.
제공된 모션 데모 목록을 참고해 `/[locale]/motions/...` 링크와 간단한 설명, 태그를 함께 제공하라.
적절한 데모가 없다면 "새로운 실험 아이디어"를 한국어로 제안하라.
"""

MOTION_DEMOS = [
    {
        "slug": "button/adaptive-hover-morph",
        "title": "Adaptive Hover Morph",
        "kicker": "Button motion / 01",
        "description": "A pill CTA that compresses into a circular icon when hovered to signal urgency.",
        "tags": ["button", "hover", "cta", "glow"],
    },
    {
        "slug": "timeline/time-reveal",
        "title": "Timeline Reveal",
        "kicker": "Timeline motion / 01",
        "description": "Sequential cards fade in with staggered springs to narrate multi-step journeys.",
        "tags": ["timeline", "stagger", "roadmap"],
    },
    {
        "slug": "interactions/ecology-matrix",
        "title": "Ecology Matrix",
        "kicker": "Interaction motion / 01",
        "description": "Orchid-inspired carousel that highlights one specimen while adjacent cards preview upcoming moods.",
        "tags": ["carousel", "hover", "fragrance", "orchid"],
    },
]


class ChatMessage(BaseModel):
    role: str = Field(..., examples=["user", "assistant", "system"])
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    locale: str = "en"
    max_matches: int = 3


class ChatResponse(BaseModel):
    reply: str
    matches: List[dict]


app = FastAPI(title="Motion Lab Chat API")


def rank_demos(query: str, limit: int = 3) -> List[dict]:
    tokens = [token for token in query.lower().split() if token]
    scored = []
    for demo in MOTION_DEMOS:
        haystack = " ".join([demo["title"], demo["description"], " ".join(demo["tags"])]).lower()
        score = sum(token in haystack for token in tokens)
        scored.append((score, demo))
    scored.sort(key=lambda item: item[0], reverse=True)
    matches = [demo for score, demo in scored if score > 0][:limit]
    return matches or MOTION_DEMOS[: limit or 3]


def build_catalog_prompt(matches: List[dict], locale: str) -> str:
    lines = ["여기 추천 가능한 모션 데모 목록이 있어:"]
    for idx, demo in enumerate(matches, start=1):
        full_url = f"{APP_BASE_URL}/{locale}/motions/{demo['slug']}"
        lines.append(
            f"{idx}. {demo['title']} ({demo['kicker']})\n"
            f"   링크: {full_url}\n"
            f"   설명: {demo['description']}\n"
            f"   태그: {', '.join(demo['tags'])}"
        )
    return "\n".join(lines)


def call_ollama(messages: List[ChatMessage]) -> str:
    payload = {
        "model": OLLAMA_MODEL,
        "messages": [message.dict() for message in messages],
        "stream": False,
    }
    try:
        response = requests.post(
            OLLAMA_ENDPOINT,
            json=payload,
            timeout=60,
            headers={"ngrok-skip-browser-warning": "1"},
        )
        response.raise_for_status()
    except requests.RequestException as exc:
        raise HTTPException(status_code=502, detail=f"Ollama error: {exc}") from exc
    data = response.json()
    return data["message"]["content"]


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    if not request.messages:
        raise HTTPException(status_code=400, detail="messages cannot be empty")

    user_message = request.messages[-1].content
    matches = rank_demos(user_message, request.max_matches)
    catalog_prompt = build_catalog_prompt(matches, request.locale)
    matches_with_links = [
        {**match, "url": f"{APP_BASE_URL}/{request.locale}/motions/{match['slug']}"}
        for match in matches
    ]

    composed_messages = [
        ChatMessage(role="system", content=BASE_SYSTEM_PROMPT + "\n" + catalog_prompt),
        *request.messages,
    ]

    reply = call_ollama(composed_messages)
    return ChatResponse(reply=reply, matches=matches_with_links)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("server.app:app", host="0.0.0.0", port=8000, reload=True)
