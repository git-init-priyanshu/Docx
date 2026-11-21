import { startObservation } from "@langfuse/tracing";
import { trace } from "@opentelemetry/api";

const BASE_URL = "https://openrouter.ai/api/v1";

// Node waits five minutes on a stalled connection. fetch's signal also covers
// reading the body, so this bounds a whole reply, streamed or not.
const REQUEST_TIMEOUT_MS = 60_000;

export class OpenRouterError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export type ChatRequest = {
  model: string;
  prompt: string;
  /** Ask for a JSON body instead of prose. The prompt must still describe the shape. */
  json?: boolean;
  temperature?: number;
  maxTokens?: number;
  /** Tried in order when the primary model is unavailable or rate limited. */
  fallbacks?: string[];
  /** False skips the hidden reasoning some models do by default before replying. */
  reasoning?: false;
  /** Generation name in Langfuse. Defaults to "chat". */
  name?: string;
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
    reasoning: request.reasoning === false ? { enabled: false } : undefined,
    usage: { include: true },
    stream,
    stream_options: stream ? { include_usage: true } : undefined,
  };
}

async function post(
  path: string,
  model: string,
  body: unknown,
): Promise<Response> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error("OPENROUTER_API_KEY is not set");

  const response = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      // Optional attribution headers. They place the app on OpenRouter's public
      // leaderboards and do not affect routing.
      "HTTP-Referer": process.env.APP_URL ?? "http://localhost:3000",
      "X-Title": "Docx",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new OpenRouterError(
      response.status,
      `OpenRouter ${response.status} for ${model}: ${detail.slice(0, 500)}`,
    );
  }
  return response;
}

type ReportedUsage = {
  prompt_tokens?: number;
  completion_tokens?: number;
  total_tokens?: number;
  cost?: number;
};

const toUsageDetails = (usage?: ReportedUsage) =>
  usage && {
    input: usage.prompt_tokens ?? 0,
    output: usage.completion_tokens ?? 0,
    total: usage.total_tokens ?? 0,
  };

const toCostDetails = (usage?: ReportedUsage) =>
  usage?.cost === undefined ? undefined : { total: usage.cost };

// Records one generation or embedding under the active span. Calls outside any
// span (background indexing) are not recorded, so they never become root traces.
async function traced<T>(
  observation: {
    name: string;
    model: string;
    input: unknown;
    asType: "generation" | "embedding";
  },
  run: () => Promise<{ output: unknown; usage?: ReportedUsage; result: T }>,
): Promise<T> {
  if (!trace.getActiveSpan()) return (await run()).result;

  const { name, asType, ...attributes } = observation;
  const record =
    asType === "embedding"
      ? startObservation(name, attributes, { asType })
      : startObservation(name, attributes, { asType });
  try {
    const { output, usage, result } = await run();
    record
      .update({
        output,
        usageDetails: toUsageDetails(usage),
        costDetails: toCostDetails(usage),
      })
      .end();
    return result;
  } catch (error) {
    record
      .update({
        level: "ERROR",
        statusMessage: error instanceof Error ? error.message : String(error),
      })
      .end();
    throw error;
  }
}

export function chat(request: ChatRequest): Promise<string> {
  return traced(
    {
      name: request.name ?? "chat",
      model: request.model,
      input: request.prompt,
      asType: "generation",
    },
    async () => {
      const response = await post(
        "/chat/completions",
        request.model,
        buildBody(request, false),
      );
      const body = await response.json();

      // A 200 can still carry a provider-level error in the body rather than in
      // the status, so the happy path has to check for one.
      if (body?.error) {
        throw new Error(`OpenRouter: ${body.error.message ?? "unknown error"}`);
      }
      const text: string = body?.choices?.[0]?.message?.content ?? "";
      return { output: text, usage: body?.usage, result: text };
    },
  );
}

export type EmbedRequest = {
  model: string;
  input: string[];
  /** Retrieval models embed a question and a passage differently. */
  inputType: "search_query" | "search_document";
  dimensions: number;
  /** Generation name in Langfuse. Defaults to "embed". */
  name?: string;
};

export function embed(request: EmbedRequest): Promise<number[][]> {
  return traced(
    {
      name: request.name ?? "embed",
      model: request.model,
      input: request.input,
      asType: "embedding",
    },
    async () => {
      const response = await post("/embeddings", request.model, {
        model: request.model,
        input: request.input,
        input_type: request.inputType,
        dimensions: request.dimensions,
        encoding_format: "float",
        usage: { include: true },
      });
      const body = await response.json();

      if (body?.error) {
        throw new Error(`OpenRouter: ${body.error.message ?? "unknown error"}`);
      }

      const items: { index: number; embedding: number[] }[] = body?.data ?? [];
      if (items.length !== request.input.length) {
        throw new Error(
          `OpenRouter embeddings: expected ${request.input.length}, received ${items.length}`,
        );
      }
      const vectors = items
        .sort((a, b) => a.index - b.index)
        .map((item) => item.embedding);
      return {
        output: { count: vectors.length, dimensions: request.dimensions },
        usage: body?.usage,
        result: vectors,
      };
    },
  );
}

// OpenRouter holds long-running connections open with `: OPENROUTER PROCESSING`
// comment lines. Those are not events, and parsing them as JSON would throw on
// every keepalive. The final data event carries `usage` with empty choices.
function parseEvent(event: string): { text?: string; usage?: ReportedUsage } {
  const parsed: { text?: string; usage?: ReportedUsage } = {};
  for (const line of event.split("\n")) {
    if (!line.startsWith("data:")) continue;

    const payload = line.slice(5).trim();
    if (!payload || payload === "[DONE]") continue;

    try {
      const chunk = JSON.parse(payload);
      const delta = chunk?.choices?.[0]?.delta?.content;
      if (typeof delta === "string" && delta) parsed.text = delta;
      if (chunk?.usage && typeof chunk.usage === "object") {
        parsed.usage = chunk.usage;
      }
    } catch {
      // A chunk that does not parse is not worth killing the stream over.
    }
  }
  return parsed;
}

export async function* streamChat(
  request: ChatRequest,
): AsyncGenerator<string> {
  const generation = trace.getActiveSpan()
    ? startObservation(
        request.name ?? "streamChat",
        {
          model: request.model,
          input: request.prompt,
          modelParameters: {
            ...(request.temperature !== undefined && {
              temperature: request.temperature,
            }),
            ...(request.maxTokens !== undefined && {
              maxTokens: request.maxTokens,
            }),
          },
        },
        { asType: "generation" },
      )
    : undefined;
  let output = "";
  let usage: ReportedUsage | undefined;
  let firstTokenSeen = false;
  let failure: unknown;

  try {
    const response = await post(
      "/chat/completions",
      request.model,
      buildBody(request, true),
    );
    if (!response.body) throw new Error("OpenRouter returned an empty stream");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      // Normalising the whole buffer rather than each chunk keeps a CRLF that
      // straddles two chunks intact: the lone CR waits in the buffer until its
      // LF arrives, and both are collapsed together.
      buffer = (buffer + decoder.decode(value, { stream: true })).replace(
        /\r\n/g,
        "\n",
      );

      // Events are separated by a blank line. Whatever follows the last one is
      // a partial event and has to wait for the next chunk.
      let boundary = buffer.indexOf("\n\n");
      while (boundary !== -1) {
        const event = parseEvent(buffer.slice(0, boundary));
        buffer = buffer.slice(boundary + 2);
        if (event.usage) usage = event.usage;
        if (event.text) {
          if (!firstTokenSeen) {
            firstTokenSeen = true;
            generation?.update({ completionStartTime: new Date() });
          }
          output += event.text;
          yield event.text;
        }
        boundary = buffer.indexOf("\n\n");
      }
    }
  } catch (error) {
    failure = error;
    throw error;
  } finally {
    generation
      ?.update({
        output,
        usageDetails: toUsageDetails(usage),
        costDetails: toCostDetails(usage),
        ...(failure !== undefined && {
          level: "ERROR" as const,
          statusMessage:
            failure instanceof Error ? failure.message : String(failure),
        }),
      })
      .end();
  }
}
