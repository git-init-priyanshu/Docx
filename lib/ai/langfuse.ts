import { LangfuseClient } from "@langfuse/client";
import { LangfuseSpanProcessor } from "@langfuse/otel";
import type { LangfuseObservation } from "@langfuse/tracing";
import { context, trace } from "@opentelemetry/api";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";

const publicKey = process.env.LANGFUSE_PUBLIC_KEY;
const secretKey = process.env.LANGFUSE_SECRET_KEY;
const baseUrl = process.env.LANGFUSE_BASE_URL ?? "https://cloud.langfuse.com";

export const langfuse =
  publicKey && secretKey
    ? new LangfuseClient({ publicKey, secretKey, baseUrl })
    : null;

// register() installs the global provider and the AsyncLocalStorage context
// manager. @langfuse/tracing falls back to the global provider, so
// setLangfuseTracerProvider is not needed.
const spanProcessor =
  publicKey && secretKey
    ? new LangfuseSpanProcessor({ publicKey, secretKey, baseUrl })
    : null;

if (spanProcessor) {
  new NodeTracerProvider({ spanProcessors: [spanProcessor] }).register();
}

export function withObservation<T>(
  observation: LangfuseObservation,
  fn: () => T,
): T {
  return context.with(
    trace.setSpan(context.active(), observation.otelSpan),
    fn,
  );
}

export async function flushLangfuse(): Promise<void> {
  await spanProcessor?.forceFlush();
  await langfuse?.flush();
}
