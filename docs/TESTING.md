# Testing

What is tested, how the harness works, and — at least as important — what is not tested.

- [The two tiers](#the-two-tiers)
- [Running them](#running-them)
- [The state of the unit tier](#the-state-of-the-unit-tier)
- [The integration harness](#the-integration-harness)
- [Why Testcontainers and not an in-memory Mongo](#why-testcontainers-and-not-an-in-memory-mongo)
- [What the integration suite proves](#what-the-integration-suite-proves)
- [Writing a new integration test](#writing-a-new-integration-test)
- [Coverage](#coverage)
- [Gaps worth closing](#gaps-worth-closing)

---

## The two tiers

| Tier | Config | Environment | Location | Suites | Tests | Docker |
|---|---|---|---|---|---|---|
| Unit | `jest.config.cjs` | jsdom | `test/unit/**` | 2 of 14 populated | 58 | No |
| Integration | `jest.integration.config.cjs` | node | `test/integration/**` | 2 | 17 | **Yes** |

They are separate configs on purpose: the integration tier needs a node environment, a global container lifecycle, and `--runInBand`, none of which the existing jsdom suite wants.

---

## Running them

```bash
npx jest                    # unit — ~5s, no Docker
npm run test:integration    # integration — ~5s after the mongo:7.0 pull
```

Integration runs must be serial. `globalSetup` starts one MongoDB container and publishes its URI via `process.env.MONGO_URL`, which only reaches the tests because `--runInBand` keeps everything in one process. Dropping that flag breaks the run with `MONGO_URL not set`.

---

## The state of the unit tier

`npx jest` **exits non-zero**, and the reason is worth stating plainly rather than hiding behind a passing badge: 12 of the 14 unit files are empty, and Jest fails a suite that contains no tests.

| File | Lines | Tests |
|---|---|---|
| `test/unit/dompurify.test.js` | 574 | 42 |
| `test/unit/controllers/upload.test.js` | 351 | 13 |
| `test/unit/controllers/media.test.js` | 332 | 13 |
| `test/unit/utils/imageOp.test.js` | 189 | *(fails to parse — ESM transform)* |
| `controllers/{comment,payment,product,user}.test.js` | 0 | 0 |
| `utils/{auth,authAdmin,cache,logger,loginRequired}.test.js` | 0 | 0 |

The 58 tests that do exist are real: `dompurify.test.js` covers sanitiser behaviour across the 2.x → 3.x upgrade surface (XSS vectors, config options, hooks, shadow DOM, processing instructions), and the upload and media controller suites cover Cloudinary interaction.

`imageOp.test.js` has content but fails to parse under the unit config's transform — a config problem, not a test problem, and a smaller fix than it looks.

Either fill those 12 files or delete them. An empty test file is worse than no file: it fails the run for a reason unrelated to the code, which teaches everyone to ignore the run.

---

## The integration harness

Four pieces, in the order Jest loads them:

**`test/setup/env.cjs`** (`setupFiles`) — seeds environment variables *before* app modules evaluate, because controllers capture `process.env.X` at module scope:

- `ACCESS_TOKEN_SECRET` — tests mint tokens with the same value
- `STORM_GATE_URL` — the `/me` target, always intercepted, never real
- `OPENAI_API_KEY` — a placeholder, required because the OpenAI constructor throws on `undefined` and `app.js` eagerly imports the AI routers
- `CORS_ORIGINS`
- **deletes** `RESEND_API_KEY`, keeping email in its no-op branch so no send can escape

**`test/setup/globalSetup.cjs`** — starts one `mongo:7.0` Testcontainer for the whole run and publishes `MONGO_URL` with `?directConnection=true` (the container runs a single-node replica set; direct connection stops the driver from hunting for other members). The image tag is pinned deliberately, to match production.

**`test/setup/integrationSetup.cjs`** (`setupFilesAfterEach`) — per-suite harness:

```js
beforeAll  → mongoose.connect(MONGO_URL)
           → nock.disableNetConnect(); nock.enableNetConnect("127.0.0.1")
afterEach  → deleteMany({}) on every collection; nock.cleanAll()
afterAll   → dropDatabase(); disconnect(); restore nock
```

Wiping every collection between tests means no test can depend on another's data, and test order cannot matter.

**`test/setup/globalTeardown.cjs`** — stops the container.

### Helpers

`test/helpers/auth.cjs`:

- `bearerToken({ id, ...claims })` — mints an HS256 JWT the app will accept, defaulting to a fresh ObjectId
- `mockStormGateMe({ role, email, status })` — intercepts the `/me` lookup with `.persist()`, so it survives the 60s cache and multiple requests within a test

`test/helpers/api.cjs` wraps supertest around the imported app; `test/helpers/factories.cjs` builds valid payloads (`buildArticle`, …) with overridable fields.

**Nothing can reach the internet.** `nock.disableNetConnect()` allows only `127.0.0.1`, for supertest's in-process server. A test that forgets to mock an outbound call fails loudly instead of quietly hitting a real API.

---

## Why Testcontainers and not an in-memory Mongo

Because several assertions are about **MongoDB**, not about a JavaScript approximation of it:

- unique index enforcement on `article_id` and `slug` (the duplicate-rejection test)
- `pre('validate')` hooks running on real driver writes
- real query and update semantics on the paths under test

Against an in-memory substitute, a pass is evidence about the substitute. The cost is a hard Docker dependency and about ten seconds of container start, once per run. Full reasoning: [ADR-004](adr/ADR-004-testcontainers.md).

---

## What the integration suite proves

**Articles** (`test/integration/articles.test.js`, 8 tests)

- Creating an article returns it **and persists it** — asserted by re-reading the document, so a 200 with no write fails
- The slug is derived and stored
- `sanitizedHtml` is produced by the model hook — asserted on the **stored** document, so a regression that sanitises the response but persists raw HTML still fails
- An unauthenticated create returns 401 **and writes nothing** — the negative assertion is paired
- A duplicate `article_id` is rejected with 400, with the seed create's success asserted first so a failed precondition reports itself instead of surfacing as a confusing assertion further down
- A payload with no image is rejected with 400
- **Creation still succeeds when the Storm-Gate `/me` lookup fails** — graceful degradation, pinned
- Read by slug returns the article; an unknown id returns 404
- Delete removes it from the database

**Subscribers** (`test/integration/subscribers.test.js`, 9 tests)

- Public signup creates an unverified subscriber with a verify token
- An invalid email is rejected with 400 **and writes nothing**
- Re-signup with the same email **rotates the token instead of creating a second row** — idempotent
- Verify confirms the subscription; an unknown token 404s
- Unsubscribe opts the subscriber out
- The admin list returns 200 for `role=1`, **403 for `role=0`, 401 with no token** — authorization driven by the real `/me` response shape, not by a stubbed middleware

That last group is the pattern worth repeating: authorization is exercised end-to-end through the actual middleware chain, with only the outbound HTTP mocked.

---

## Writing a new integration test

```js
const { api } = require("../helpers/api.cjs");
const { bearerToken, mockStormGateMe } = require("../helpers/auth.cjs");
const Articles = require("../../models/article.js").default;

test("does the thing, and the database agrees", async () => {
  mockStormGateMe({ role: 1 });                    // admin profile for this test

  const res = await api()
    .post("/api/articles")
    .set("Authorization", bearerToken())
    .send({ /* … */ });

  expect(res.status).toBe(200);
  expect(await Articles.findOne({ /* … */ })).not.toBeNull();   // assert the side effect
});
```

Three conventions that make these tests worth having:

1. **Assert the database, not only the response.** A handler that returns 200 and writes nothing must fail.
2. **Pair every negative with an absence assertion.** "401" plus "and nothing was written".
3. **Mock only outbound third-party HTTP.** Never mock `auth`, the models, or the app itself — those are the things under test.

---

## Coverage

**Not measured, and no gate.** `jest.config.cjs` has `collectCoverage: false` and no threshold; the stale artefacts under `test/coverage/` are not produced by any current run and should not be read as current.

That is a deliberate absence rather than an oversight. With 12 empty suites, a coverage number would mostly describe what is untested and invite the cheapest possible fix — tests written to move the number. The suite counts in this document are more honest than a percentage would be. When the unit tier is real, a merged coverage report becomes worth adding; a build-failing threshold still would not be.

---

## Gaps worth closing

Ranked by what they would catch:

1. **A negative authorization test on article mutation** — "user B cannot delete user A's article" is the test that would have caught the missing ownership check described in [SECURITY.md](SECURITY.md#authorization). Today it would fail, which is exactly why it is worth writing.
2. **The 12 empty unit files** — fill or delete.
3. **`imageOp.test.js`'s transform config** — 189 lines of written tests that never execute.
4. **The blog workflow endpoints** (`/api/blog/*`) — publish, schedule, version restore and batch operations are entirely untested, and they are the mutations with the widest effect.
5. **The points and store flow** — a currency with no tests around earn/spend arithmetic.
6. **The scheduled-publish cron** — a test on the date comparison would have caught the string-vs-`Date` bug immediately.
7. **Mount-order regression** — a test asserting the LinkedIn callback and newsletter verify routes stay reachable without a token would pin an invariant that is currently held only by comments in `app.js`.
