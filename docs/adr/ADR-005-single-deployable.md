# ADR-005 — One deployable serves the API and the SPA

**Status:** Accepted

---

## Context

The obvious modern arrangement for a React SPA plus an Express API is two deployments: static hosting or a CDN for the built frontend, a separate host for the API. It is what most tutorials describe and what most teams do.

The constraint here is different. One person writes this, deploys this, and gets paged by this. The API surface is broad (22 routers) but the traffic is a personal blog's.

Note that authentication *is* split out ([ADR-001](ADR-001-delegated-auth.md)). This decision is about everything else.

## Decision

One Node process on Fly.io serves both. `server.js` mounts `express.static(build/)` and a SPA catch-all after the API routers; the Dockerfile builds the SPA at image-build time and runs `node server.js`.

## Consequences

**Good**

- **One deploy.** Frontend and backend ship together, so a UI change and the endpoint it calls can never be out of step in production.
- **No CORS in production.** The SPA and the API share an origin, so the CORS allowlist only exists for local development. That removes an entire class of misconfiguration.
- **No CDN invalidation step**, no split cache, no "which origin is stale" debugging.
- **One place to look.** One log stream, one restart, one rollback.
- Server-rendered crawler routes (`/sitemap.xml`, `/blog/:slug`) sit naturally alongside the API, so social previews and sitemaps come from the same process that owns the data.

**Bad**

- **The SPA is not on a CDN.** Static assets are served by one machine in `sjc`, so a reader in Europe pays transatlantic latency for every asset.
- **Cold starts hit page loads, not just API calls.** With `min_machines_running = 0`, the first visit after idle waits for a boot.
- **Frontend and backend cannot scale independently**, and a frontend-only change still redeploys the API.
- **Image build is slower**, because every deploy runs the CRA build.
- **Static serving needs `build/` to exist**, which is exactly why it lives in `server.js` and not `app.js` ([ADR-003](ADR-003-app-server-split.md)).
- **One process, one blast radius.** A Node crash takes the site down, not just its API.

## What would change the answer

- Meaningful non-US traffic. A CDN in front of the static assets would be the first change, and it does not require splitting the deployment — just fronting it.
- More than one operator, or independent release cadences between frontend and backend.
- Traffic where API load and asset load want different scaling shapes.
- Note what would *not* change it: adding more API surface. Twenty-two routers in one process is not what makes a system hard to run; twenty-two deployments would be.
