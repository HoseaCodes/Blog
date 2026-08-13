# Documentation

Documentation for [HoseaCodes Blog & Portfolio](../README.md).

**System**

| | |
|---|---|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Module boundaries, request lifecycle, mount ordering, data layer, deployment topology, integrations |
| [AUTHENTICATION.md](AUTHENTICATION.md) | The Storm-Gate contract: HTTP surface, JWT claims, token flow, user status |
| [SECURITY.md](SECURITY.md) | Auth model, authorization matrix, secrets, CORS, sanitisation, and the gap list |
| [adr/](adr/) | Six architecture decision records |

**Building on it**

| | |
|---|---|
| [API.md](API.md) | Every route the app serves, with its auth requirement |
| [FRONTEND_API.md](FRONTEND_API.md) | The `src/API/` client modules and how components consume them |
| [FRONTEND.md](FRONTEND.md) | Typography, images, delivery, performance targets, Storybook |
| [BLOG_PAGE_LOGIC.md](BLOG_PAGE_LOGIC.md) | How the `/blog` hero and "The Latest" slots are chosen |
| [GAMES.md](GAMES.md) | Score-tracking contract, the `useGameScore` API, points sync |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Branches, conventional commits, PRs, releases |

**Running and verifying it**

| | |
|---|---|
| [OPERATIONS.md](OPERATIONS.md) | CI pipelines, releases and deploys, backups, restart, failure modes, troubleshooting |
| [TESTING.md](TESTING.md) | Both automated tiers, the Testcontainers harness, what is proven and what is not |
| [MANUAL_TESTING.md](MANUAL_TESTING.md) | Walkthrough for the enterprise blog features, which have no automated coverage |
| [METRICS.md](METRICS.md) | Performance, quality and delivery targets — and what is actually instrumented |
| [FEATURES.md](FEATURES.md) | Terminal, easter eggs, blog workflow, AI, Game Zone, points, newsletter |
| [ROADMAP.md](ROADMAP.md) | Ranked engineering work and product plans |

## Where to start

**New to the codebase** → [ARCHITECTURE.md](ARCHITECTURE.md), then [adr/](adr/) for why it looks like that.

**Running it locally** → the [README quick start](../README.md#local-development), then [OPERATIONS.md](OPERATIONS.md).

**Assessing whether to trust it** → [SECURITY.md](SECURITY.md#known-gaps) and [TESTING.md](TESTING.md#gaps-worth-closing). Both lead with what is missing.

**Debugging something** → [`CLAUDE.md`](../CLAUDE.md) first — it is the debugging protocol for this repo, and its central rule is to observe before hypothesising. Then [OPERATIONS.md](OPERATIONS.md#failure-modes).

**Looking for work to do** → [ROADMAP.md](ROADMAP.md#engineering-ranked). The first four items are correctness and safety issues, not features.

## Conventions

Each document states its limitations rather than omitting them. Where something is broken, it says so and links to the code — a document that only describes the parts that work is a document you cannot trust about the parts that do not.

These files supersede the old [wiki](https://github.com/HoseaCodes/Blog/wiki). It lived on a different repository, was not versioned with the code, and had drifted accordingly — PM2, SendGrid, `src/services/authService.js`, and a `swagger-server` on port 8080, none of which still exist. Everything durable from its twenty pages has been folded in here and checked against the code; where an endpoint name or file path had gone stale, the version in `docs/` is the corrected one.

Add new documentation here, in the pull request that makes it true. See [CONTRIBUTING.md](CONTRIBUTING.md#documentation).
