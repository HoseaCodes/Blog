# ADR-003 — `app.js` builds, `server.js` boots

**Status:** Accepted

---

## Context

The Express application originally lived in one file that also connected to MongoDB, registered cron jobs, served the `build/` folder, and called `app.listen()`. Importing it did all of that as a side effect.

That made real HTTP testing impossible. To exercise a route you needed a database, a built SPA on disk, a scheduler, and a free port — so the tests that existed mocked the layers directly, which meant they tested the mocks and not the wiring. The bugs that actually happen in this codebase are *wiring* bugs: middleware order, mount order, a router that 401s a public path.

## Decision

Split the two concerns:

**`app.js` constructs the Express app and has no side effects at import time.** No `connectDB()`, no `app.listen()`, no cron, no `express.static(build/)`. It builds middleware, mounts routers, and exports the app.

**`server.js` is the runtime bootstrap.** In order: load `dotenv`, import `app`, layer on favicon/static/SPA catch-all, run `imageOp()`, `connectDB()`, start cron, listen.

`dotenv` must load first. ES module imports are depth-first and controllers capture `process.env.X` at module scope, so the environment has to be populated before `app.js` and its import tree evaluate.

The crawler routes (`/sitemap.xml`, `/blog/:slug`) live in `app.js` despite being root-level, because they need nothing from `build/`. Only the static and SPA-catch-all serving depends on it, and that is what `server.js` adds.

## Consequences

**Good**

- Integration tests import the real app and drive it with supertest — real middleware, real auth chain, real routers, real models. No database needed at import, no `build/` folder, no listening socket.
- The tests that result catch the class of bug that actually occurs here: mount ordering, auth-catch-all shadowing, middleware sequence.
- Production bootstrap is readable in one file, in order.

**Bad**

- **It creates a rule that is easy to break silently: no third-party SDK clients at module scope.** `app.js` imports every router at boot, so a client constructed at import time makes the whole app unimportable without that credential — and takes the integration suite down before a single test runs. This has already happened once with OpenAI, which is why `test/setup/env.cjs` seeds a placeholder key: the OpenAI constructor throws on `undefined`. Build clients lazily inside handlers.
- Two files to keep straight, and a reviewer has to know which one a given concern belongs in.
- The `dotenv`-first ordering in `server.js` is load-bearing and looks like a stylistic import order. It is commented, because otherwise someone's import sorter will break it.

## What would change the answer

- If module-scope environment capture were eliminated everywhere (read `process.env` inside handlers instead), the `dotenv`-first constraint would relax — though the split would still be worth keeping.
- If the app ever stopped serving the SPA ([ADR-005](ADR-005-single-deployable.md)), `server.js` would shrink to bootstrap-only, and the split would become even cleaner rather than unnecessary.
