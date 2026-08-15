import test from "node:test";
import assert from "node:assert/strict";
import { LlamaParseClient, LlamaParseError } from "../scripts/llamaparse-client.mjs";

test("requires an API key", () => assert.throws(() => new LlamaParseClient({ apiKey: "" }), /LLAMA_CLOUD_API_KEY/));

test("returns JSON and sends bearer authentication", async () => {
  let request;
  const client = new LlamaParseClient({ apiKey: "test-key", fetchImpl: async (url, init) => { request = { url, init }; return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "content-type": "application/json" } }); } });
  assert.deepEqual(await client.health(), { ok: true });
  assert.equal(request.init.headers.authorization, "Bearer test-key");
});

test("retries a rate-limit response and eventually succeeds", async () => {
  let calls = 0;
  const client = new LlamaParseClient({ apiKey: "test-key", maxRetries: 1, fetchImpl: async () => ++calls === 1 ? new Response("busy", { status: 429 }) : new Response("{}", { status: 200 }) });
  await client.health();
  assert.equal(calls, 2);
});

test("surfaces non-retryable HTTP errors", async () => {
  const client = new LlamaParseClient({ apiKey: "test-key", maxRetries: 0, fetchImpl: async () => new Response(JSON.stringify({ error: "forbidden" }), { status: 403 }) });
  await assert.rejects(client.health(), (error) => error instanceof LlamaParseError && error.status === 403);
});
