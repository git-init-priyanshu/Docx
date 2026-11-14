const USER_AGENT =
  process.env.WIKIPEDIA_USER_AGENT?.trim() ||
  "rag-eval-corpus/0.1 (educational retrieval benchmark)";
const MIN_INTERVAL_MS = 1000;
const MAX_ATTEMPTS = 8;

let lastRequestStartedAt = 0;

export async function fetchWikipedia(url: string): Promise<Response> {
  for (let attempt = 1; ; attempt++) {
    const wait = lastRequestStartedAt + MIN_INTERVAL_MS - Date.now();
    if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
    lastRequestStartedAt = Date.now();

    let response: Response | undefined;
    let networkError: unknown;
    try {
      response = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
    } catch (error) {
      networkError = error;
    }
    if (response?.ok) return response;

    const retryable =
      !response || response.status === 429 || response.status >= 500;
    if (!retryable || attempt >= MAX_ATTEMPTS) {
      if (!response) throw networkError;
      throw new Error(`${response.status} ${response.statusText} for ${url}`);
    }

    const retryAfterSeconds = Number(response?.headers.get("Retry-After"));
    const delayMs =
      retryAfterSeconds > 0
        ? retryAfterSeconds * 1000
        : 2000 * 2 ** (attempt - 1);
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
}
