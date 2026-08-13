# ADR-001 — Delegate authentication to Storm-Gate

**Status:** Accepted

---

## Context

This application used to own its authentication end to end: registration, password hashing, token issuance, refresh, and reset. The `Users` collection still carries the shape of that era.

Two things made it untenable.

**Auth is the highest-consequence, least differentiated code in a blog.** A mistake in article rendering is embarrassing. A mistake in token verification is a breach. And none of it is blog-specific — the same logic, correct in the same way, belongs in every project.

**It was being maintained twice.** Two personal projects with two auth implementations means two places to patch a JWT library, two places to get password reset right, two places that drift. The second implementation is where the bug lives, because it gets less attention.

## Decision

Extract authentication into **Storm-Gate**, a separate service, and consume it as a library from both ends:

- `@storm-gate/express` — `createRequireAuth({ secret })`, server-side JWT verification
- `@storm-gate/client` — the browser SDK: login, register, refresh, reset, authed axios instances

This repository verifies tokens. It does not issue them, and it never sees a password.

The JWT carries `{ id }` only. Anything authorization-relevant — `role`, `status`, `email` — is fetched from Storm-Gate's `/me` at request time and merged onto `req.user`, cached 60 seconds per user id.

## Consequences

**Good**

- One auth implementation to keep correct, shared across projects and versioned as a package.
- No passwords in this codebase, in this database, or in this repository's blast radius. The mirrored local user row stores the literal string `"storm-gate-managed"` so nothing can authenticate against it.
- Claims are fetched, not baked in. A role change or account deletion takes effect within one cache TTL, not at token expiry — which recovers most of what stateless JWT normally gives up.
- The two services can scale, deploy and be hardened independently. Storm-Gate runs on AWS API Gateway; this runs on Fly.io.

**Bad**

- **A runtime dependency on another service, in the request path.** Mitigated by the 60s cache and by swallowing `/me` failures, which is only safe because the degradation is towards denial: `authAdmin` requires `role === 1`, and on a failed lookup `role` is `undefined`. An integration test pins this.
- **An extra HTTP hop** on the first request per user per minute.
- **A shared secret to keep synchronised.** `ACCESS_TOKEN_SECRET` must match on both sides. A mismatch rejects every token — total and obvious, which is the better failure, but still an operational coupling.
- **The cache is per-process and unbounded.** It grows with distinct user ids for the process lifetime and is not shared across machines.
- **Local users are mirrored by email**, because Storm-Gate ids will never match legacy blog `_id`s. An email change upstream creates a second local row rather than renaming the first.
- Two services to run locally for authenticated development.

## What would change the answer

- If Storm-Gate stopped being maintained, or its availability became worse than this app's, the dependency would cost more than the duplication it removed.
- If this were the only project needing auth, the shared-library argument disappears and the extra hop buys less.
- If the `/me` hop became a latency problem, the answer is not to re-implement auth — it is to put more claims in the token and accept staler authorization, or to cache across machines.
