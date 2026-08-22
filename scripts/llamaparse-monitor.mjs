import { LlamaParseClient, LlamaParseError } from "./llamaparse-client.mjs";

const args = new Map(process.argv.slice(2).map((v, i, a) => v.startsWith("--") ? [v, a[i + 1] && !a[i + 1].startsWith("--") ? a[i + 1] : true] : []));
const once = args.has("--once");
const intervalMs = Number(args.get("--interval") || process.env.LLAMAPARSE_MONITOR_INTERVAL_MS || 30000);
const baseUrl = String(args.get("--url") || process.env.LLAMAPARSE_BASE_URL || "https://api.cloud.llamaindex.ai");
const output = process.env.LLAMAPARSE_MONITOR_OUTPUT;

function emit(event) {
  const line = JSON.stringify({ timestamp: new Date().toISOString(), service: "llamaparse", ...event });
  console.log(line);
  if (output) require("node:fs").appendFileSync(output, line + "\n");
}

async function probe() {
  const started = Date.now();
  try {
    const client = new LlamaParseClient({ baseUrl, timeoutMs: Number(process.env.LLAMAPARSE_MONITOR_TIMEOUT_MS || 10000), maxRetries: 0 });
    await client.health();
    emit({ status: "healthy", latency_ms: Date.now() - started, base_url: baseUrl });
    return true;
  } catch (error) {
    emit({ status: "unhealthy", latency_ms: Date.now() - started, base_url: baseUrl, error: error instanceof LlamaParseError ? { message: error.message, status: error.status } : { message: error.message, name: error.name } });
    return false;
  }
}

const run = async () => { const ok = await probe(); if (once) process.exitCode = ok ? 0 : 1; };
await run();
if (!once) setInterval(run, intervalMs);
