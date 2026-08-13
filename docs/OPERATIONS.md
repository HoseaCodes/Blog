# Operations

Pipelines, releases, deploys, and the failure modes this repository has actually hit.

- [Branches and pipelines](#branches-and-pipelines)
- [Dev Pipeline jobs](#dev-pipeline-jobs-staging)
- [Releases and deploys](#releases-and-deploys)
- [Pipeline gotchas](#pipeline-gotchas)
- [Running the app](#running-the-app)
- [Docker](#docker)
- [Deploying](#deploying)
- [Restart and rollback](#restart-and-rollback)
- [Observability](#observability)
- [Failure modes](#failure-modes)
- [Troubleshooting](#troubleshooting)

---

## Branches and pipelines

Three long-lived branches. Only two of them run CI.

| Branch | Workflow | Trigger | Runs | Deploys |
|---|---|---|---|---|
| `staging` | `main.yaml` (Dev Pipeline) | push to `staging` | static-scan → dependency-scan → lint → integration-test → build | **No** — verify only |
| `prep` | *none* | — | nothing | — |
| `master` | `master.yaml` (Snyk Scan), `release-please.yml` | push to `master` | security → build; release-please in parallel | via release tag — see below |

**Staging verifies; it does not ship.** It runs the scans, the lint, the integration suite and a production build, then stops. It cuts no release and deploys nowhere. Releasing and deploying belong to `master`.

> **`prep` has no CI.** No workflow triggers on it and none reference it. Checks displayed on a PR that *targets* `prep` are the `staging` pipeline's runs against staging's head commit — they say nothing about the merge result. `prep`'s own copies of the workflow files are stale: they still trigger on `staging` and have no `integration-test` job.

---

## Dev Pipeline jobs (`staging`)

| Job | What it does |
|---|---|
| `static-scan` | Snyk SAST over source. Advisory — `continue-on-error` plus `\|\| true` |
| `dependency-scan` | Snyk dependency scan, direct and transitive. Also advisory |
| `lint` | `npm run lint` (ESLint over `src`). Also advisory |
| `integration-test` | `npm run test:integration` — drives the real Express app over HTTP (supertest) against a real MongoDB (Testcontainers). Outbound HTTP blocked by `nock`. **Requires Docker**, which `ubuntu-latest` provides |
| `build` | `npm ci --legacy-peer-deps` → `npm run build`. Proves the app compiles; the output is not published |

Jobs are gated: `build` needs all four to pass. A failure early in the chain means later jobs never execute — **a green early stage is not evidence that the later ones work.**

Note the asymmetry: the three scan/lint jobs are advisory and cannot fail the pipeline, while `integration-test` and `build` are real gates. Only the latter two actually block a merge.

---

## Releases and deploys

| Mechanism | Where | Tag format | Pushes version bump | Drives a deploy |
|---|---|---|---|---|
| conventional-changelog | `master` build job | `dev.v*` | No | No |
| release-please | `master` | `v*` | Yes, via release PR | Yes |
| `release-publish.yml` | on tag `v*.*.*` | — | — | Deploys to Fly.io |

There is **one** deploy path:

```
merge to master → release-please opens a release PR
               → merge the release PR → tag v1.2.3 pushed
               → release-publish.yml fires → flyctl deploy --remote-only
```

Nothing deploys from `staging`. Nothing deploys from a `dev.v*` tag.

release-please is configured with a **PAT** (`RELEASE_PLEASE_TOKEN`), not `GITHUB_TOKEN`, because events authored by `GITHUB_TOKEN` do not trigger other workflows — with the default token the tag lands and `release-publish.yml` never runs.

---

## Pipeline gotchas

Each of these cost real time. They are recorded with the mechanism, not just the remedy, because the remedy is only reusable if you know what it is guarding against.

**Never delete `package-lock.json` in CI.** `react-scripts@4.0.3` pins `@babel/core` to exactly `7.12.3` while floating `babel-preset-react-app` to `^10.0.0`, which resolves to `10.1.0` and requires `^7.16.0`. Resolving without the lockfile lets those land in an arrangement where the preset loads under 7.12.3 and the build dies with `Requires Babel "^7.16.0", but was loaded with "7.12.3"`. The committed lockfile pins a tree that builds; `npm ci` reproduces it.

**The integration suite needs no real API keys.** `test/setup/env.cjs` seeds placeholders (including `OPENAI_API_KEY`) before app modules load, and `nock.disableNetConnect()` blocks egress. Adding real third-party secrets to CI for tests adds leak surface and buys nothing.

**Do not construct third-party SDK clients at module scope.** `app.js` imports every router at boot, so a client built at import time makes the whole app unimportable without that credential — which takes down the integration suite before a single test runs. Build clients lazily inside handlers.

**CI cannot push to `staging`.** The branch is protected ("Changes must be made through a pull request"), so any workflow step that pushes a commit is rejected with `GH006: Protected branch update failed`. **Tags are not covered by that rule** — a rejected push can still leave a tag behind, pointing at a commit that never landed.

**conventional-changelog versions come from the last tag *reachable from the branch*, not from `package.json`.** Tag existence is global; reachability is per-branch. That gap broke releases on `staging`: its last reachable `dev.v*` tag was behind one that already existed globally, created by master's pipeline on a commit `staging` cannot reach. Every run recomputed the same next version and failed with `fatal: tag already exists`, forever. **Do not run two branches' release automation in one tag namespace.**

**`master`'s `dev.v*` tagging works, but feeds nothing.** Each tag is created on master's own HEAD, so it stays reachable and the sequence advances cleanly. `package.json` drifting behind those tags is harmless — the version is not read from the file. The steps are simply redundant: nothing consumes `dev.v*`, because `release-publish.yml` fires on `v*.*.*`, which those tags do not match. Removing them from `master.yaml` is optional cleanup, not a bug fix.

**`master.yaml` still uses `::set-output`**, which GitHub has deprecated. It works today; it will stop.

---

## Running the app

```bash
npm install --legacy-peer-deps   # the flag is required — React 17 vs React 18-era peers

node server.js                   # API on :3003 (or nodemon server.js)
npm start                        # SPA on :3000, proxying /api to :3003
```

Authenticated flows additionally need a reachable Storm-Gate at `STORM_GATE_URL` (default `http://localhost:8081`).

| Script | Purpose |
|---|---|
| `npm start` | CRA dev server |
| `npm run build` | Production SPA build into `build/` |
| `npm run lint` / `lint:fix` | ESLint over `src` |
| `npx jest` | Unit tests — **exits non-zero**, see [TESTING.md](TESTING.md) |
| `npm run test:integration` | Integration tests (needs Docker) |
| `npm run storybook` | Storybook on :6006 |
| `npm run analyze` | source-map-explorer over the built bundle |

---

## Docker

```bash
docker build -t hoseacodes-blog .

docker run --name hoseacodes-blog-c -p 8080:8080 \
  -e MONGODB_URL="your_mongodb_url" \
  -e ACCESS_TOKEN_SECRET="your_secret" \
  -e STORM_GATE_URL="https://your-storm-gate" \
  -d hoseacodes-blog

docker tag ${imageID} hoseacodes/hoseacodes-blog:latest
docker push hoseacodes/hoseacodes-blog:latest
```

The image is single-stage from the full `node:20` base, installs with `--legacy-peer-deps`, builds the SPA at image-build time, and runs `node server.js` **as root** on port 8080. It works and it is bigger and more privileged than it needs to be; a multi-stage build on `node:20-slim` with a non-root user is the obvious improvement.

---

## Deploying

Normal path — do not deploy by hand:

1. Merge work to `master` with conventional commits.
2. release-please opens (or updates) the release PR.
3. Merge the release PR. It bumps `package.json`, updates `CHANGELOG.md`, and pushes a `v*.*.*` tag.
4. `release-publish.yml` runs `flyctl deploy --remote-only`.

Manual deploy, for a break-glass situation:

```bash
fly deploy                    # from the repo root, uses fly.toml
fly status
fly logs
```

First-time or rotated secrets:

```bash
fly secrets set ACCESS_TOKEN_SECRET=...   # must equal Storm-Gate's signing key
fly secrets set MONGODB_URL=...
fly secrets set STORM_GATE_URL=...
fly secrets set CLOUD_API_KEY=... CLOUD_API_SECRET=... CLOUND_NAME=...
fly secrets set OPENAI_API_KEY=...
fly secrets set STABILITY_API_KEY=...
fly secrets set PAYPAL_CLIENT_ID=... PAYPAL_CLIENT_SECRET=... PAYPAL_ENV=live
fly secrets set RESEND_API_KEY=... RESEND_FROM="..."
fly secrets set LINKEDIN_CLIENT_ID=... LINKEDIN_CLIENT_SECRET=... LINKEDIN_REDIRECT_URI=...
```

Each `fly secrets set` restarts the app.

**Storm-Gate is deployed separately** (AWS API Gateway). Its `ACCESS_TOKEN_SECRET` and this app's must be identical, or every token is rejected.

---

## Restart and rollback

```bash
fly apps restart blog-portfolio-wandering-morning-3470
fly status
fly logs
fly releases                 # list deploys
fly deploy --image <prior>   # or re-run release-publish.yml on the previous v* tag
```

---

## Observability

Modest, and worth being blunt about:

- **`morgan("dev")`** logs request lines to stdout.
- **`winston`** (`utils/logger.js`) is used by controllers for application logging.
- **Fly.io** captures stdout — `fly logs`, or `fly logs -a <app>` from elsewhere.
- **Sentry** packages are installed (`@sentry/react`, `@sentry/tracing`) — browser-side only.
- **`react-ga4`** for page analytics; `/api/analytics/*` records article-level engagement in Mongo.

**There is no `/health` endpoint**, no metrics endpoint, and no liveness/readiness split. Fly.io has only its TCP check, so a process that is listening but cannot reach MongoDB still receives traffic. Adding `/health` with a Mongo ping, wired to an HTTP check in `fly.toml`, is the cheapest meaningful improvement available here.

---

## Backups

> **Currently disabled.** `cron/backupDB.js` is written and `initBackUpDBJob()` is commented out in `server.js`. Nothing is backing this database up on a schedule today beyond whatever MongoDB Atlas provides on the cluster tier in use.

The job, when enabled, shells out to `mongodump` to archive every collection into a `database-backup/` directory, then uploads the archive to S3 (`hc-mongodbback`). It keeps the last two days locally and is intended to run weekly at `00:00` on Sunday.

| Variable | Purpose |
|---|---|
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | S3 credentials |
| `BACKUP_BUCKET_NAME` | Target bucket |
| `BACKUP_NAME` | Dump directory name |
| `DBUSER` / `DBPASSWORD` / `DBHOST` / `DBPORT` / `DBNAME` | Connection parts for `mongodump` |

Two things to settle before re-enabling. It depends on the `mongodump` binary being present in the container — the current image does not install MongoDB database tools. And it inherits the same problem as scheduled publishing: with `min_machines_running = 0` there may be no process awake on Sunday at midnight. A scheduled job that must run belongs outside the web process.

`aws-sdk` v2 is a dependency solely for this job, and v2 is end-of-life.

Reference material for whoever picks this up: [MongoDB backup and restore tools](https://www.mongodb.com/docs/manual/tutorial/backup-and-restore-tools/) · [`mongodump`](https://www.mongodb.com/docs/database-tools/mongodump/) · [backup and restore basics](https://www.mongodb.com/resources/basics/backup-and-restore) · [scheduled backups with Node.js](https://levelup.gitconnected.com/how-to-set-up-scheduled-mongodb-backups-with-a-bit-of-node-js-b81abebfa20) · [automating to S3 with GitHub Actions](https://nimamovic9.medium.com/automate-mongodb-backup-and-restore-using-aws-s3-github-actions-and-node-js-e4b608b52ba)

Running the backup from a **GitHub Actions cron** rather than from the web process would solve the two problems above at once: the runner has the database tools available, and it does not depend on a Fly machine being awake.

---

## Performance profiling

For a React render problem, in development:

```bash
npm run build -- --profile
```

Then in Chrome DevTools: throttle to low-end mobile, open the Profiler, enable **"Record why each component rendered while profiling"**, and look at the orange-and-darker commits. Work out whether it is a state change, a prop change, or a context change driving the re-render before changing anything — the same observe-first rule as [`CLAUDE.md`](https://github.com/HoseaCodes/Blog-Portfolio/blob/master/CLAUDE.md).

`@welldone-software/why-did-you-render` is wired up in `src/wdyr.js` for the same purpose, and `npm run analyze` (source-map-explorer) covers bundle size.

---

## Failure modes

| Symptom | Likely cause | Where to look |
|---|---|---|
| Every request 401s | `ACCESS_TOKEN_SECRET` differs from Storm-Gate's | Compare `fly secrets list` digest against Storm-Gate's |
| Admin endpoints 403 for a real admin | `/me` lookup failing — wrong or unreachable `STORM_GATE_URL` | `fly logs` for `[auth] Storm-Gate /me lookup failed` |
| Role change not taking effect | 60s in-process `/me` cache | Wait, or restart the machine |
| Blog reads work, writes 500 | Mongo unreachable or Atlas IP allowlist | `fly logs` for `MongoDB Connection Error` |
| First request after idle is slow | `min_machines_running = 0`, cold start | Expected; raise to 1 to trade cost for latency |
| Newsletter signup succeeds, no email | `RESEND_API_KEY` unset — `utils/email.js` no-ops by design | Logs show the skip warning |
| Scheduled post never publishes | The cron comparison is broken; see below | `cron/scheduledPost.js` |
| Build fails with `Requires Babel "^7.16.0"` | Lockfile deleted or bypassed | Restore `package-lock.json`, install with `npm ci` |
| LinkedIn OAuth callback 401s | Router mount order changed | `app.js` — `linkedinRouter` must precede any `router.use(auth)` catch-all |
| Newsletter verify link 401s | Same class of bug | `app.js` — `subscriberRouter` mount position |

**Scheduled publishing is currently inert.** `cron/scheduledPost.js` compares `moment().format("YYYY-MM-DD")` (a string) to `article.scheduledDateTime` (a `Date`) with `===`, which is always false. Even once fixed, `min_machines_running = 0` means no process may be awake at `0 12 * * *` America/Chicago. A durable fix is both a working comparison and a scheduler that does not assume a warm machine — an external trigger hitting an endpoint, or a machine kept running.

---

## Troubleshooting

**Integration tests hang or fail to start.** They need a running Docker daemon — `docker info` should succeed. The first run pulls `mongo:7.0`. `--runInBand` is required: `globalSetup` publishes `MONGO_URL` via `process.env`, which only reaches the tests when they share the process.

**`npx jest` reports 12 failed suites.** Those files are empty. See [TESTING.md](TESTING.md).

**A dev-server request returns the SPA shell instead of API JSON.** CRA's proxy heuristic answers anything with `Accept: text/html` from the SPA. `src/setupProxy.js` force-proxies a fixed list; add the path there if you have added a non-`/api` backend route.

**Snyk shows findings but CI is green.** By design — those jobs are `continue-on-error` with `|| true`. Read the uploaded `snyk-static-report` / `snyk-dependency-report` artifacts (5-day retention).
