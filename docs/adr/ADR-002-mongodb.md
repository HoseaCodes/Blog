# ADR-002 — MongoDB with Mongoose

**Status:** Accepted

---

## Context

The primary entity is an article, and articles here are genuinely irregular: optional subtitle, arrays of categories and tags, an images object, SEO fields, per-platform cross-post state (`linkedin`, `linkedinContent`, `linkedinIntro`, `linkedinPostedAt`, `linkedinPostUrn`), embedded comments, denormalised counters, and both `markdown` and its rendered `sanitizedHtml`. Fields have been added roughly every time a feature landed.

The workload is one author writing occasionally, and readers reading — overwhelmingly reads, on documents that are fetched whole by slug.

## Decision

MongoDB, accessed through Mongoose 8. MongoDB Atlas in production, `mongo:7.0` locally and in tests.

Mongoose specifically, rather than the raw driver, because schemas give the validation and the lifecycle hooks that the database itself will not provide — most importantly the `pre('validate')` hook that sanitises markdown ([ADR-006](ADR-006-write-time-sanitisation.md)).

## Consequences

**Good**

- Adding a field is a schema edit, not a migration. Over five years of features that has mattered more than any other property.
- A read is one document fetch. Article, embedded comments and metadata arrive together, with no joins for the hot path.
- Unique indexes on `article_id` and `slug` give real uniqueness enforcement — the one invariant the database does hold, and the integration suite tests it.
- Mongoose hooks let invariants live on the model, where no controller can route around them.
- Testcontainers makes a real MongoDB cheap in tests ([ADR-004](ADR-004-testcontainers.md)).

**Bad**

- **No foreign keys.** Referential integrity between articles, users, points and comments is application-enforced — and in several places not enforced at all. Deleting a user leaves their articles pointing at a `postedBy` that resolves to nothing, and nothing prevents it.
- **No `ON DELETE RESTRICT` equivalent.** A relational schema would refuse destructive deletes at the storage layer; here that guarantee has to be written, and remembered, in every handler.
- **Denormalised counters are not transactional.** `likes` is maintained with `$inc` on the article while the dedup list lives on the user — two writes, not atomic. Acceptable at this contention level, and documented as such in the source, but it *is* a lost-update window.
- **No schema enforcement at the database.** `strictQuery` is off. A field written by a code path that predates the current schema is simply there.
- **No cross-document transactions in use**, even though the deployment (Atlas, replica set) would support them.

## What would change the answer

- Multiple authors with real ownership rules, or a payments/points ledger that must balance, would push towards PostgreSQL — the invariants would become relational, and application-enforced integrity would stop being adequate.
- If the points economy grows into something people spend real money into, its ledger specifically wants transactional guarantees and would justify a separate relational store even if articles stayed in Mongo.
- If article shape stabilised for a year, the flexibility argument would be worth much less than the integrity argument.
