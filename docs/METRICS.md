# Metrics and KPIs

Targets for performance, quality and delivery — with an honest column for whether this project can currently measure each one.

> **These are targets, not measurements.** No baseline has ever been recorded for any metric below. A target without a measurement is a wish, and the first real work here is capturing one number per metric with a date attached, so the next reading has something to compare against.
>
> The targets themselves are industry defaults. Adjust them to what this project actually needs — a single-author blog does not need the same deployment frequency as a team product.

- [Frontend performance](#frontend-performance)
- [Frontend quality](#frontend-quality)
- [Backend performance](#backend-performance)
- [Backend quality](#backend-quality)
- [Delivery and reliability](#delivery-and-reliability)
- [User engagement](#user-engagement)
- [What is actually instrumented](#what-is-actually-instrumented)
- [Getting to a baseline](#getting-to-a-baseline)

---

## Frontend performance

| Metric | Target | Measured with | Available here |
|---|---|---|---|
| Page load time | < 3s | Lighthouse, WebPageTest | ✅ Lighthouse |
| Time to Interactive (TTI) | < 5s | Lighthouse, Chrome DevTools | ✅ |
| First Contentful Paint (FCP) | < 2s | Lighthouse, DevTools | ⚠️ lab only — see below |
| Largest Contentful Paint (LCP) | < 2.5s | Lighthouse, DevTools | ⚠️ lab only |
| First Input Delay (FID) | < 100ms | Lighthouse, DevTools | ⚠️ lab only |
| Cumulative Layout Shift (CLS) | < 0.1 | Lighthouse, DevTools | ⚠️ lab only |

> **`web-vitals` is installed but reports nothing.** `src/index.js:60` calls `reportWebVitals()` with **no argument**, and `src/reportWebVitals.js` guards on `if (onPerfEntry && onPerfEntry instanceof Function)` — so the import never runs and no metric is ever collected. This is the untouched Create React App default.
>
> Passing a handler turns on field measurement from real traffic, which is the version that matters — lab and field numbers routinely disagree:
>
> ```js
> reportWebVitals(metric => ReactGA.event({ category: 'Web Vitals', action: metric.name, value: Math.round(metric.value) }));
> ```
>
> Note the file uses the **v2 API** (`getCLS`/`getFID`/`getFCP`/`getLCP`/`getTTFB`). FID has since been replaced by **INP** as a Core Web Vital, which needs `web-vitals` v3+ and the `onINP` handler.

Two structural facts will show up in any measurement, before any code is optimised: static assets are served from a single Fly.io machine in `sjc` with [no CDN](FRONTEND.md#delivery), and `min_machines_running = 0` means the first request after idle pays a cold start.

## Frontend quality

| Metric | Target | Measured with | Available here |
|---|---|---|---|
| Build success rate | ≥ 95% | CI logs | ✅ GitHub Actions |
| Test coverage | ≥ 80% | Jest | ⚠️ Jest present, **coverage not collected** |
| Bug resolution time | < 24h for critical | GitHub Issues | ✅ |

Coverage is the honest problem: `collectCoverage` is off, there is no threshold, and [12 of 14 unit suites are empty](TESTING.md#the-state-of-the-unit-tier). An 80% target against that baseline is not a stretch goal, it is a different project. Fill or delete the empty suites first, then measure, then set a target you can defend.

The original version of this list named **Enzyme**, which is not installed and does not support React 17+ in any maintained form. Use React Testing Library — already present as `@testing-library/jest-dom` and `@testing-library/user-event`.

---

## Backend performance

| Metric | Target | Measured with | Available here |
|---|---|---|---|
| API response time | < 200ms | APM | ❌ **no APM** — `morgan` logs per-request duration to stdout |
| Error rate | < 1% | Sentry, APM | ⚠️ Sentry is **browser-only** here; server errors go to `winston`/stdout |
| Request rate (throughput) | Load-dependent | APM | ❌ not collected |
| Database query performance | < 100ms typical | APM, Mongo profiler | ❌ not collected |

This is the weakest measurement surface in the project. `morgan("dev")` prints a duration on every request, so response time is technically *in the logs* and nothing aggregates it. There is no APM, no metrics endpoint, and [no `/health` endpoint](OPERATIONS.md#observability) — so there is not even a liveness signal to graph.

New Relic and Datadog were named in the original list. Neither is installed, and both are heavier than this project warrants. Cheaper paths to the same numbers: extend Sentry to the server side for error rate and traces, or expose a Prometheus endpoint and scrape it.

## Backend quality

| Metric | Target | Measured with | Available here |
|---|---|---|---|
| Test coverage | ≥ 80% | Jest + Istanbul | ⚠️ not collected |
| Build success rate | ≥ 95% | CI logs | ✅ |
| Code quality / maintainability | Index > 80 | ESLint, SonarQube | ⚠️ ESLint only, and it is **advisory** in CI |

The original list named **Mocha, Chai and Istanbul**. This project uses **Jest**, which bundles its own assertions and uses Istanbul internally for coverage — so the tooling is already there and simply switched off.

ESLint runs on `staging` but with `continue-on-error`, so findings never block a merge. A quality metric that cannot fail a build measures intent, not code.

---

## Delivery and reliability

| Metric | Target | Measured with | Available here |
|---|---|---|---|
| Deployment frequency | ≥ 1/week | CI logs, releases | ✅ GitHub releases |
| Mean time to recovery (MTTR) | < 1h | Incident tooling | ❌ no on-call, no incident record |
| Bug/issue resolution time | < 1 day for critical | GitHub Issues | ✅ |
| End-to-end test success rate | ≥ 90% | Cypress/Playwright | ❌ **no E2E suite exists** |
| Commits per day / deploys per week | Team-dependent | GitHub Insights | ✅ |

Deployment frequency is directly readable — every production deploy corresponds to a `v*.*.*` tag, and there is exactly [one deploy path](OPERATIONS.md#releases-and-deploys) that creates them.

MTTR has no meaning yet: with no health check, no alerting and no on-call rotation, recovery starts whenever someone happens to notice. PagerDuty and Opsgenie were named originally; for a single-operator site an uptime check that emails on failure would deliver most of the value at none of the cost.

## User engagement

| Metric | Target | Measured with | Available here |
|---|---|---|---|
| Bounce rate | Goal-dependent | Google Analytics | ✅ `react-ga4` |
| Session duration | Goal-dependent | Google Analytics | ✅ |
| Pages per session | Goal-dependent | Google Analytics | ✅ |
| Article views | — | In-app analytics | ⚠️ see below |
| Engagement events | — | In-app analytics | ✅ `/api/analytics/engagement` |

There are two analytics systems: `react-ga4` in the browser, and the in-app [`/api/analytics/*`](API.md#analytics) endpoints writing to MongoDB. They will not agree.

> **The in-app view and engagement writes are public and unthrottled.** `POST /api/analytics/view` and `/engagement` sit before `router.use(auth)`, so anonymous reads *are* counted — but so is anything else that can send a POST. There is no rate limit, no bot filtering and no deduplication, so treat these as indicative rather than as figures to report. Google Analytics is the better-defended source for traffic; the in-app data is more useful for per-article engagement shape than for absolute counts.

---

## What is actually instrumented

Everything above, reduced to what exists today:

| Signal | Tool | Where |
|---|---|---|
| Core Web Vitals (field) | `web-vitals` | `src/reportWebVitals.js` — **installed but inert**, no handler passed |
| Browser errors and traces | `@sentry/react`, `@sentry/tracing` | `src/index.js` — browser only, and **production only** |
| Page analytics | `react-ga4` | Google Analytics |
| Article engagement | In-app | `/api/analytics/*` → MongoDB |
| Request lines and durations | `morgan` | stdout → `fly logs` |
| Application logs | `winston` | `utils/logger.js` |
| Build and deploy history | GitHub Actions, releases | — |
| Render performance | React Profiler, `why-did-you-render` | Development only |
| Bundle size | `source-map-explorer` | `npm run analyze` |

**Missing:** server-side error tracking, APM, a health endpoint, uptime monitoring, coverage collection, any E2E suite, and alerting of any kind.

---

## Getting to a baseline

In value order — the first three are cheap and unlock most of the rest:

1. **Pass a handler to `reportWebVitals()`** — a one-line change that turns four already-installed field metrics from nothing into real user data.
2. **Add `/health` with a Mongo ping**, wired to a Fly.io HTTP check. Without it there is no uptime signal, so MTTR and error rate are unmeasurable in principle.
3. **Extend Sentry to the server.** The package is already a dependency; initialising it in `server.js` gives error rate and traces without adding a vendor.
4. **Record one Lighthouse run per key page**, committed with a date. This is the baseline that makes every frontend target meaningful.
5. **Turn coverage collection on** — measure and publish the number without gating on it. See why a build-failing threshold is a bad idea in [TESTING.md](TESTING.md#coverage).
6. **Add uptime monitoring** with email or push on failure.
7. **Aggregate `morgan` durations**, or expose Prometheus metrics, to get real p50/p95 response times rather than lines in a log.
