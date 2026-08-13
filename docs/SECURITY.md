# Security

What protects this application, what does not, and where the gaps are. Written to be useful to someone deciding whether to trust it — which means the gap list is the important half.

- [Authentication](#authentication)
- [Authorization](#authorization)
- [Authorization matrix](#authorization-matrix)
- [Secrets](#secrets)
- [CORS](#cors)
- [Content sanitisation](#content-sanitisation)
- [Abuse and cost controls](#abuse-and-cost-controls)
- [Known gaps](#known-gaps)
- [Reporting a vulnerability](#reporting-a-vulnerability)

---

## Authentication

**No authentication is implemented in this repository.** Tokens are issued by **Storm-Gate**, a separate service. This API only verifies them.

```js
stormGateAuth = createRequireAuth({ secret: process.env.ACCESS_TOKEN_SECRET });
```

- **Algorithm:** HS256, symmetric. Both services hold the same `ACCESS_TOKEN_SECRET`.
- **Claims:** the token carries `{ id }` and nothing else. Anything authorization-relevant — `role`, `status`, `email` — is fetched at request time, so a role change takes effect within one cache TTL rather than at token expiry.
- **Passwords:** never handled here. The mirrored local `Users` row stores the literal string `"storm-gate-managed"` in its password field, so nothing can authenticate against the local collection even if a legacy code path tried.
- **Browser side:** `src/lib/stormGate.js` configures the SDK with `rememberMeMaxAge` of 7 days and a 24h default, an `onUnauthenticated` handler that clears local session keys and redirects to `/login`, and a defensive clear of the `refreshtoken` cookie the SDK does not own.

### Profile enrichment, and why swallowing its failure is safe

After signature verification, `utils/auth.js` calls Storm-Gate's `/me` and merges the profile onto `req.user`, caching per user id for 60 seconds:

```js
try {
  const profile = await fetchStormGateMe(req.headers.authorization, req.user.id);
  if (profile) req.user = { ...req.user, ...profile };
} catch (e) {
  console.error("[auth] Storm-Gate /me lookup failed:", e.message);
}
```

The failure is deliberately non-fatal — an auth-service blip should not take down blog reads. That is only acceptable because the degradation is **towards denial**: `authAdmin` requires `role === 1`, and on a failed lookup `role` is `undefined`. A `/me` outage costs admins their admin, and costs an attacker nothing they did not already lack.

`test/integration/articles.test.js` pins this: with no `nock` interceptor registered, `nock.disableNetConnect()` makes the `/me` call fail, and article creation is asserted to still succeed.

### User mirroring

`syncBlogUser` upserts a local `Users` document on each authenticated request, matched **by email**, using `$setOnInsert` so an existing row is never overwritten. Email is the join key because Storm-Gate ids do not match legacy blog `_id`s. Two consequences worth knowing:

- An email change in Storm-Gate creates a *second* local user rather than renaming the first.
- Local `role` is only ever set at insert time; the authoritative role for a request is the one from `/me`.

---

## Authorization

Two mechanisms, and one of them is missing.

**Role gating** — `utils/authAdmin.js` requires `req.user.role === 1` (or `"admin"`), after `auth` has populated it. Returns 401 without a user, 403 with a non-admin one.

**Ownership gating** — largely absent. Content mutations check that the caller is *authenticated*, not that they are *entitled*. The starkest example:

```js
async function deleteArticle(req, res) {
  await Articles.findByIdAndDelete(req.params.id);   // no owner check, no role check
  res.json({ msg: "Deleted a article" });
}
```

`updateArticle` and the `/api/blog/*` workflow endpoints are the same shape. On a single-author site where registration is gated behind Storm-Gate approval the practical blast radius is small — but it is bounded by *who can get a token*, not by any check in this code, and that is the wrong thing to be relying on.

Where ownership *is* enforced, it is per-user state rather than resource access: likes and saves resolve the caller's local user id and record against that user's document, so one user cannot like on another's behalf.

---

## Authorization matrix

| Endpoint family | Anonymous | Authenticated | Admin |
|---|---|---|---|
| `GET /api/articles`, `GET /api/articles/:id` | ✅ read (`optionalAuth` adds `liked`/`saved` when a token is present) | ✅ | ✅ |
| `POST/PUT/PATCH/DELETE /api/articles/:id` | ❌ 401 | ⚠️ **any article** | ✅ |
| `/api/admin/articles*` | ❌ | ✅ (drafts + archived) | ✅ |
| `/api/blog/*` — drafts, publish, schedule, versions, batch | ❌ | ⚠️ **any article** | ✅ |
| `/api/media/*`, `/api/ai/*`, `/api/seo/*`, `/api/analytics/*`, `/api/collaboration/*` | ❌ | ✅ | ✅ |
| `/api/points/*` | ❌ | ✅ own account | ✅ |
| `GET /api/store/items` | ✅ | ✅ | ✅ |
| `/api/store/redeem`, `/api/store/my-redemptions` | ❌ | ✅ own | ✅ |
| `POST /api/subscribers`, `/verify/:token`, `/unsubscribe/:token` | ✅ | ✅ | ✅ |
| `GET /api/subscribers`, `POST /api/subscribers/broadcast/:articleId` | ❌ | ❌ 403 | ✅ |
| `/api/admin/linkedin/*` | ❌ | ❌ 403 | ✅ |
| `GET /api/admin/linkedin/callback` | ✅ **by design** — OAuth redirect cannot carry a JWT | ✅ | ✅ |
| `/api/payment*` | ❌ | ❌ 403 | ✅ |
| `GET /api/user/admin/all` | 🔴 **ALLOWED — no middleware** | 🔴 allowed | ✅ |
| `PATCH /api/user/:id/status` | ❌ | ❌ 403 | ✅ |
| `/sitemap.xml`, `/blog/:slug` (social preview) | ✅ | ✅ | ✅ |
| `/api-docs` | ✅ in development · **HTTP Basic** in production | | |

⚠️ marks the gap: authenticated is sufficient where entitled should be required. 🔴 marks an endpoint that is open to the public internet and should not be.

The public LinkedIn callback is a considered exception, not an oversight. It must also be mounted before any router with a `router.use(auth)` catch-all — see [ARCHITECTURE.md](ARCHITECTURE.md#mount-ordering--a-real-invariant).

---

## Secrets

- **Nothing is committed.** `.env` is gitignored; `.env example` carries key names with empty values.
- **`ACCESS_TOKEN_SECRET` must match Storm-Gate's signing key exactly.** A mismatch rejects every token — a total, obvious outage rather than a subtle one, which is the preferable failure.
- **There is no startup assertion on secrets.** The app boots happily without `ACCESS_TOKEN_SECRET`, and requests then fail at verification time. Storm-Gate's own convention (refuse to start without a signing key) is the better pattern and is not yet adopted here.
- **Production secrets live in `fly secrets`**, not in `fly.toml`. `fly.toml` sets only `NODE_ENV` and `PORT`.
- **CI secrets** are `SNYK_TOKEN`, `FLY_API_TOKEN`, and `RELEASE_PLEASE_TOKEN` (a PAT — `GITHUB_TOKEN`-authored tag pushes do not trigger downstream workflows).
- **Tests need no real credentials.** `test/setup/env.cjs` seeds placeholders before app modules evaluate, and `nock.disableNetConnect()` blocks egress. Do not add real third-party secrets to CI for tests; there is nothing for them to reach.

The one non-obvious rule: `OPENAI_API_KEY` must be *set to something* in tests because the OpenAI constructor throws on `undefined` and `app.js` eagerly imports the AI routers. A placeholder is correct; a real key is a leak with no upside.

---

## CORS

```js
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:3003')
  .split(',').map(s => s.trim()).filter(Boolean);
```

An explicit allowlist with `credentials: true`. A request with **no** `Origin` header is allowed — that is curl, server-to-server traffic and health checks, none of which are subject to the browser same-origin model that CORS exists to relax. Unknown origins are rejected with an error rather than silently omitting the header.

In production the SPA is served by the same process as the API, so cross-origin requests do not arise for normal use.

---

## Content sanitisation

Article markdown is rendered and sanitised **at write time**, in the model:

```js
articleSchema.pre('validate', function (next) {
  if (this.markdown) {
    this.sanitizedHtml = dompurify.sanitize(marked(this.markdown));
  }
  next();
});
```

Placing it in the schema hook rather than in a controller means no write path can skip it — including one added later by someone who has not read this file. `test/integration/articles.test.js` asserts on the stored `sanitizedHtml`, not on the API response, so a regression that returns sanitised output while persisting raw HTML still fails.

The cost is a backfill obligation: changing the sanitiser policy requires re-rendering stored documents. See [ADR-006](adr/ADR-006-write-time-sanitisation.md). `test/unit/dompurify.test.js` covers the sanitiser's behaviour directly across 42 cases, including the 2.x → 3.x upgrade surface.

---

## Abuse and cost controls

| Control | State |
|---|---|
| Rate limiting | **Configured but not applied.** `app.js` builds a 100-requests-per-hour limiter; `app.use(limiter)` is commented out |
| TTS quota | Enforced per user, with usage recorded (`ttsUsage`, `ttsRequest`) |
| AI art | Paid per generation via PayPal or points |
| AI writing endpoints | **No quota, no rate limit** — 13 endpoints that cost money per call, gated only by "has a token" |
| Newsletter signup | Idempotent (re-signup rotates the token, no duplicate row); no rate limit |
| Uploads | `express-fileupload` with temp files; no size cap configured here |

The unmetered AI endpoints are the sharpest cost exposure: one authenticated account can spend real money in a loop. Turning the existing limiter on, starting with `/api/ai/*` and `/api/tts/*`, is the single highest-value security change available.

---

## Known gaps

Ordered by how much they would matter if exploited.

1. **`GET /api/user/admin/all` dumps every user to anyone.** No middleware at all despite the `admin` path — **verified against production**, returning real email addresses and statuses to an unauthenticated request. The controller carries a `TEMP` comment stating the risk and saying "lock down before deploying publicly"; it shipped anyway. Access is gated only by the client-side `/admin/users` page, which is not a boundary.
2. **No ownership or role checks on content mutations.** Any authenticated user can update or delete any article, publish drafts, or run batch deletes.
3. **No rate limiting anywhere**, including on endpoints that spend money per request.
4. **No startup validation of `ACCESS_TOKEN_SECRET`** — a missing secret produces per-request failures instead of a loud refusal to boot.
5. **No `/health` endpoint**, so a process that is up but cannot reach Mongo keeps taking traffic.
6. **No audit log.** There is no immutable record of who published, edited or deleted what.
7. **No structured error contract.** Failures surface as `{ msg: err.message }` with a 500, which can echo driver-level detail to the client. No correlation ids.
8. **Token revocation is impossible before expiry** — inherent to stateless JWT. Partially mitigated by the per-request `/me` lookup: a deleted or demoted account loses privileges within the 60s cache TTL.
9. **The 60s `/me` cache is in-process and unbounded.** It grows with distinct user ids for the process lifetime and is not shared across machines.
10. **The Docker image runs as root** on the full `node:20` base, single-stage.
11. **Dependency scanning is advisory.** Snyk runs in CI with `continue-on-error: true` and `|| true`, so a finding never fails a build.
12. **`status` is never enforced.** Storm-Gate reports `PENDING`/`APPROVED`; nothing in this app checks it, so an unapproved-but-authenticated user is treated as a normal user.

Fixes are ranked in the README's [Future improvements](../README.md#future-improvements).

---

## Reporting a vulnerability

Open a private security advisory on the [repository](https://github.com/HoseaCodes/Blog-Portfolio/security/advisories) or contact the maintainer directly. Please do not open a public issue for anything exploitable.
