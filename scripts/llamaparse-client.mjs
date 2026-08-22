const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export class LlamaParseError extends Error {
  constructor(message, { status, body, cause } = {}) {
    super(message, { cause });
    this.name = "LlamaParseError";
    this.status = status;
    this.body = body;
  }
}

export class LlamaParseClient {
  constructor({ baseUrl = process.env.LLAMAPARSE_BASE_URL || "https://api.cloud.llamaindex.ai", apiKey = process.env.LLAMA_CLOUD_API_KEY, timeoutMs = 60_000, maxRetries = 5, fetchImpl = fetch } = {}) {
    if (!apiKey) throw new LlamaParseError("LLAMA_CLOUD_API_KEY is required");
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.apiKey = apiKey;
    this.timeoutMs = timeoutMs;
    this.maxRetries = maxRetries;
    this.fetchImpl = fetchImpl;
  }

  async request(path, { method = "GET", body, headers = {} } = {}) {
    let attempt = 0;
    while (true) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);
      try {
        const response = await this.fetchImpl(`${this.baseUrl}${path}`, {
          method,
          headers: { authorization: `Bearer ${this.apiKey}`, accept: "application/json", ...headers },
          body,
          signal: controller.signal,
        });
        const text = await response.text();
        let parsed; try { parsed = text ? JSON.parse(text) : undefined; } catch { parsed = text; }
        if (response.ok) return parsed;
        const retryable = response.status === 408 || response.status === 409 || response.status === 429 || response.status >= 500;
        if (!retryable || attempt >= this.maxRetries) throw new LlamaParseError(`LlamaParse request failed: HTTP ${response.status}`, { status: response.status, body: parsed });
      } catch (error) {
        const retryable = error instanceof TypeError || error?.name === "AbortError" || error instanceof LlamaParseError && [408, 409, 429].includes(error.status) || error instanceof LlamaParseError && error.status >= 500;
        if (!retryable || attempt >= this.maxRetries) throw error instanceof LlamaParseError ? error : new LlamaParseError("LlamaParse request could not be completed", { cause: error });
      } finally { clearTimeout(timer); }
      await sleep(Math.min(30_000, 250 * 2 ** attempt));
      attempt += 1;
    }
  }

  health(path = process.env.LLAMAPARSE_HEALTH_PATH || "/health") { return this.request(path); }
  async parseFile(fileId, { tier = "agentic", version = "latest" } = {}) {
    return this.request("/api/v1/parsing", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ file_id: fileId, tier, version }) });
  }
}
