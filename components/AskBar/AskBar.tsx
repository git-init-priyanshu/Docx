"use client";

// Floating ask bar: a pill at the bottom of the screen that grows into a
// conversation once you ask something.
//
// Mounted on both the dashboard and the editor so the same conversation is
// reachable from either, and collapsed by default so it costs the writing
// surface a single line of chrome.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUp, RotateCcw, Sparkles, X } from "lucide-react";

import useClientSession from "@/lib/customHooks/useClientSession";
import Citations from "./Citations";
import { useChat } from "./useChat";
import { STATUS_LABEL } from "./types";

export default function AskBar() {
  const session = useClientSession();
  const isSignedIn = !!session?.id;

  const [expanded, setExpanded] = useState(false);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);

  const { messages, status, error, send, reset } = useChat(isSignedIn);

  const busy = status !== "idle";
  const showTranscript = expanded && (messages.length > 0 || busy || !!error);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "j") {
        e.preventDefault();
        setExpanded(true);
        inputRef.current?.focus();
      }
      if (e.key === "Escape" && document.activeElement === inputRef.current) {
        inputRef.current?.blur();
        setExpanded(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    const node = transcriptRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages, status]);

  const submit = () => {
    if (!input.trim() || busy) return;
    send(input);
    setInput("");
    setExpanded(true);
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-40 flex justify-center px-4">
      <div className="pointer-events-auto w-full max-w-[640px]">
        {showTranscript && (
          <div className="mb-2 overflow-hidden rounded-2xl border border-[var(--lp-border)] bg-[var(--lp-card)] shadow-lg">
            <div className="flex items-center justify-between border-b border-[var(--lp-border)] px-4 py-2">
              <span className="text-xs font-medium text-[var(--lp-muted)]">
                Answers come only from your documents
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={reset}
                  title="Start a new conversation"
                  className="rounded p-1 text-[var(--lp-muted)] transition-colors hover:text-[var(--lp-ink)]"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setExpanded(false)}
                  title="Collapse"
                  className="rounded p-1 text-[var(--lp-muted)] transition-colors hover:text-[var(--lp-ink)]"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div
              ref={transcriptRef}
              className="max-h-[45vh] space-y-3 overflow-y-auto px-4 py-3"
            >
              {messages.map((message, i) => (
                <div key={i}>
                  {message.role === "user" ? (
                    <p className="text-sm font-medium text-[var(--lp-ink)]">
                      {message.content}
                    </p>
                  ) : (
                    <div className="text-sm leading-relaxed text-[var(--lp-ink-2)]">
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      {message.citations && (
                        <Citations citations={message.citations} />
                      )}
                    </div>
                  )}
                </div>
              ))}

              {busy && (
                <p className="animate-pulse text-xs text-[var(--lp-muted)]">
                  {STATUS_LABEL[status]}…
                </p>
              )}

              {error && (
                <p className="text-xs text-[var(--lp-rose)]">{error}</p>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 rounded-full border border-[var(--lp-border)] bg-[var(--lp-card)] px-4 py-2 shadow-lg">
          <Sparkles className="h-4 w-4 shrink-0 text-[var(--lp-accent-ink)]" />

          {isSignedIn ? (
            <>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => setExpanded(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submit();
                }}
                placeholder="Ask about your documents"
                className="min-w-0 flex-1 bg-transparent text-sm text-[var(--lp-ink)] outline-none placeholder:text-[var(--lp-muted)]"
              />
              {input.trim() ? (
                <button
                  type="button"
                  onClick={submit}
                  disabled={busy}
                  title="Ask"
                  className="rounded-full bg-[var(--lp-accent)] p-1.5 text-[var(--lp-accent-ink)] transition-opacity disabled:opacity-50"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
              ) : (
                <kbd className="hidden shrink-0 rounded border border-[var(--lp-border)] px-1.5 py-0.5 text-[10px] text-[var(--lp-muted)] sm:block">
                  ⌘J
                </kbd>
              )}
            </>
          ) : (
            <p className="flex-1 text-sm text-[var(--lp-muted)]">
              <Link
                href="/login"
                className="font-medium text-[var(--lp-accent-ink)] underline-offset-2 hover:underline"
              >
                Sign in
              </Link>{" "}
              to ask questions about your documents
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
