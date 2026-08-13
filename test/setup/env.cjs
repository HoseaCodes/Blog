// Environment variables for the integration test run. Loaded via `setupFiles`
// so they're present before app modules (which capture `process.env.X` at
// import time) are evaluated. MONGO_URL is injected by globalSetup from the
// Testcontainers Mongo instance and is intentionally NOT set here.

// Auth: @storm-gate/express verifies HS256 JWTs with this secret. Tests mint
// tokens with the same value (see test/helpers/auth.cjs).
process.env.ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || "test-access-token-secret";

// Storm-Gate /me profile lookup target. Never hit for real in tests — it's
// intercepted with nock; nock.disableNetConnect() blocks it otherwise.
process.env.STORM_GATE_URL = process.env.STORM_GATE_URL || "http://localhost:8081";

// Keep outbound email in no-op mode: utils/email.js short-circuits to
// {ok:false, skipped:true} with NO network call when this is unset. This keeps
// the subscriber flow deterministic and prevents accidental real sends.
delete process.env.RESEND_API_KEY;

// CORS allowlist used by app.js.
process.env.CORS_ORIGINS =
  process.env.CORS_ORIGINS || "http://localhost:3000,http://localhost:3003";

// Legacy flag some middleware reads.
process.env.allow_origins = "valid,valid1,(.*?)localhost";

// Silence dev.to / medium / linkedin cross-post branches by leaving their keys
// unset (controllers guard on them).

// OpenAI: a placeholder, never a real key. The SDK constructor throws outright
// on an undefined apiKey, and app.js eagerly imports the ai / tts / aiArt
// routers, so without this the whole suite dies at import. Nothing reaches
// OpenAI regardless — integrationSetup.cjs calls nock.disableNetConnect().
process.env.OPENAI_API_KEY = process.env.OPENAI_API_KEY || "test-openai-key";
