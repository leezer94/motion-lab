import json
import sys
from typing import List, Dict

import requests

OLLAMA_ENDPOINT = "http://localhost:11434/api/chat"
MODEL_NAME = "qwen2.5"
SYSTEM_PROMPT = "You are Motion Lab's UX/motion assistant. Always answer in Korean and mention relevant demos with links when possible."

ChatMessage = Dict[str, str]


def send_chat(messages: List[ChatMessage]) -> str:
    payload = {
        "model": MODEL_NAME,
        "messages": messages,
        "stream": False,
    }

    response = requests.post(OLLAMA_ENDPOINT, json=payload, timeout=60)
    response.raise_for_status()
    data = response.json()
    return data["message"]["content"]


def main():
    user_prompt = "".join(sys.argv[1:]) if len(sys.argv) > 1 else "오키드 테마 버튼 인터랙션 추천해줘"

    history: List[ChatMessage] = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": user_prompt},
    ]

    try:
        reply = send_chat(history)
    except requests.RequestException as exc:
        print(f"[ERROR] Failed to reach ollama: {exc}")
        sys.exit(1)

    print("Assistant:\n" + reply)


if __name__ == "__main__":
    main()
