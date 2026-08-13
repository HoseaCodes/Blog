# ADR-004 — Testcontainers over an in-memory MongoDB

**Status:** Accepted

---

## Context

Once `app.js` became importable without side effects ([ADR-003](ADR-003-app-server-split.md)), integration tests needed a database. Three options:

1. **Mock the Mongoose models.** Fastest, and tests the mocks.
2. **`mongodb-memory-server`** or `@shelf/jest-mongodb` (already a devDependency from an earlier attempt). Fast, no Docker.
3. **A real MongoDB in a container**, via Testcontainers.

## Decision

Testcontainers, with the image pinned to **`mongo:7.0`** to match production.

One container for the whole run, started in `globalSetup`, its URI published through `process.env.MONGO_URL`. `--runInBand` is required so the tests share that process and therefore see the variable. Every collection is wiped after each test; the database is dropped and the container stopped at the end.

## Consequences

**Good**

- The assertions that matter are about **MongoDB**, not about an approximation of it: unique-index rejection on `article_id`, `pre('validate')` hooks firing on real driver writes, real query and update semantics.
- The duplicate-article test is only meaningful because a real unique index rejects the second insert. Against a substitute, a pass would be evidence about the substitute.
- Pinning the image means the test database and the production database are the same major version, and bumping it is a deliberate, reviewable act.
- Per-test collection wiping means no test can depend on another's data, and test order cannot matter.
- The whole suite finishes in about five seconds after the image is cached.

**Bad**

- **A hard Docker dependency.** No daemon, no tests — locally or in CI. `ubuntu-latest` provides one, so CI is fine; a contributor without Docker is blocked.
- **~10 seconds of container start**, paid once per run.
- **`--runInBand` is mandatory**, so integration tests cannot parallelise. At this suite size it does not matter; at ten times the size it would.
- The single-node replica set needs `?directConnection=true`, or the driver goes looking for members that do not exist. Non-obvious, and commented in `globalSetup.cjs` for that reason.
- `@shelf/jest-mongodb` remains in `devDependencies` from the earlier approach — dead weight that should be removed.

## What would change the answer

- If the suite grew large enough that serial execution became the bottleneck, the fix is a container per worker, not an in-memory substitute.
- If a test genuinely needed no database behaviour — pure function, pure transformation — it belongs in the unit tier and should not pay for a container at all.
- Reaching for an in-memory Mongo would only make sense if Docker became unavailable in CI, and it would mean accepting that the index and hook assertions no longer prove what they claim.
