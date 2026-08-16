"use client";

// Conversation state plus the NDJSON stream reader for /api/chat.
//
// Split from the component so the bar stays presentational: the parsing rules
// for the wire format live next to nothing but themselves.

import { useCallback, useEffect, useRef, useState } from "react";

import { GetLatestChatThread } from "./actions";
import type { ChatMessage, ChatStatus, Citation } from "./types";

type StreamEvent =
  | { type: "status"; value: string }
  | { type: "citations"; value: Citation[] }
  | { type: "text"; value: string }
  | { type: "done"; threadId: string }
  | { type: "error"; value: string };

const isStatus = (value: string): value is Exclude<ChatStatus, "idle"> =>
  value === "searching" || value === "ranking" || value === "answering";

export function useChat(enabled: boolean) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ChatStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const threadIdRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    GetLatestChatThread().then((result) => {
      if (cancelled || !result.success || !result.data) return;
      threadIdRef.current = result.data.id;
      setMessages(result.data.messages);
    });

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const send = useCallback(async (question: string) => {
    const trimmed = question.trim();
    if (!trimmed) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setError(null);
    setStatus("searching");
    setMessages((prev) => [
      ...prev,
      { role: "user", content: trimmed },
      { role: "assistant", content: "" },
    ]);

    // Mutates the trailing assistant message in place — it is the one this
    // request owns, and rebuilding the whole list per token would re-render
    // every prior message.
    const updateAnswer = (fn: (message: ChatMessage) => ChatMessage) =>
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = fn(next[next.length - 1]);
        return next;
      });

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          threadId: threadIdRef.current,
        }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error ?? "Could not reach the assistant");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        // A chunk boundary can land mid-line; hold the remainder back.
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue;

          let event: StreamEvent;
          try {
            event = JSON.parse(line) as StreamEvent;
          } catch {
            continue;
          }

          switch (event.type) {
            case "status":
              if (isStatus(event.value)) setStatus(event.value);
              break;
            case "citations":
              updateAnswer((message) => ({
                ...message,
                citations: event.value,
              }));
              break;
            case "text":
              updateAnswer((message) => ({
                ...message,
                content: message.content + event.value,
              }));
              break;
            case "done":
              threadIdRef.current = event.threadId;
              break;
            case "error":
              setError(event.value);
              break;
          }
        }
      }
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return;
      setError(e instanceof Error ? e.message : "Something went wrong");
      // Drop the empty answer bubble so a failure does not leave a blank turn.
      setMessages((prev) =>
        prev[prev.length - 1]?.content === "" ? prev.slice(0, -1) : prev,
      );
    } finally {
      setStatus("idle");
    }
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    threadIdRef.current = null;
    setMessages([]);
    setError(null);
    setStatus("idle");
  }, []);

  return { messages, status, error, send, reset };
}
