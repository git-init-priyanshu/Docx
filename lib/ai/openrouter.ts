const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

export type ChatRequest = {
  model: string;
  prompt: string;
  /** Ask for a JSON body instead of prose. The prompt must still describe the shape. */
  json?: boolean;
  temperature?: number;
  maxTokens?: number;
  /** Tried in order when the primary model is unavailable or rate limited. */
  fallbacks?: string[];
};

export const isConfigured = () => Boolean(process.env.OPENROUTER_API_KEY);

function buildBody(request: ChatRequest, stream: boolean) {
  return {
    model: request.model,
    models: request.fallbacks?.length
      ? [request.model, ...request.fallbacks]
      : undefined,
    messages: [{ role: "user", content: request.prompt }],
    temperature: request.temperature,
    max_tokens: request.maxTokens,
    response_format: request.json ? { type: "json_object" } : undefined,
    stream,
  };
}

async function post(request: ChatRequest, stream: boolean): Promise<Response> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error("OPENROUTER_API_KEY is not set");

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      // Optional attribution headers. They place the app on OpenRouter's public
      // leaderboards and do not affect routing.
      "HTTP-Referer": process.env.APP_URL ?? "http://localhost:3000",
      "X-Title": "Docx",
    },
    body: JSON.stringify(buildBody(request, stream)),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `OpenRouter ${response.status} for ${request.model}: ${detail.slice(0, 500)}`,
    );
  }
  return response;
}

export async function chat(request: ChatRequest): Promise<string> {
  const response = await post(request, false);
  const body = await response.json();

  // A 200 can still carry a provider-level error in the body rather than in the
  // status, so the happy path has to check for one.
  if (body?.error) {
    throw new Error(`OpenRouter: ${body.error.message ?? "unknown error"}`);
  }
  return body?.choices?.[0]?.message?.content ?? "";
}

// OpenRouter holds long-running connections open with `: OPENROUTER PROCESSING`
// comment lines. Those are not events, and parsing them as JSON would throw on
// every keepalive.
function deltaOf(event: string): string | null {
  for (const line of event.split("\n")) {
    if (!line.startsWith("data:")) continue;

    const payload = line.slice(5).trim();
    if (!payload || payload === "[DONE]") return null;

    try {
      const delta = JSON.parse(payload)?.choices?.[0]?.delta?.content;
      if (typeof delta === "string" && delta) return delta;
    } catch {
      // A chunk that does not parse is not worth killing the stream over.
    }
  }
  return null;
}

export async function* streamChat(
  request: ChatRequest,
): AsyncGenerator<string> {
  const response = await post(request, true);
  if (!response.body) throw new Error("OpenRouter returned an empty stream");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    // Normalising the whole buffer rather than each chunk keeps a CRLF that
    // straddles two chunks intact: the lone CR waits in the buffer until its LF
    // arrives, and both are collapsed together.
    buffer = (buffer + decoder.decode(value, { stream: true })).replace(
      /\r\n/g,
      "\n",
    );

    // Events are separated by a blank line. Whatever follows the last one is a
    // partial event and has to wait for the next chunk.
    let boundary = buffer.indexOf("\n\n");
    while (boundary !== -1) {
      const text = deltaOf(buffer.slice(0, boundary));
      buffer = buffer.slice(boundary + 2);
      if (text) yield text;
      boundary = buffer.indexOf("\n\n");
    }
  }
}
