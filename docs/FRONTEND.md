# Frontend standards

Craft rules the SPA is built to. Structure and tooling live in [ARCHITECTURE.md](ARCHITECTURE.md#frontend); this is the "how it should look and behave" half.

- [Frontend standards](#frontend-standards)
  - [Typography](#typography)
    - [CDN](#cdn)
  - [Images](#images)
  - [Delivery](#delivery)
  - [Performance](#performance)
  - [Code standards](#code-standards)
  - [Component library](#component-library)

---

## Typography

**Fluid sizing.** `body` is set to `100%`, so text scales from the browser's own default rather than from a number we picked. A reader who has raised their default font size gets a larger site, which is the point.

- **No pixel font sizes.** Use `em` or `rem` so sizes compose from that base.
- `rem` for anything that should track the root; `em` when it should track its container.

### CDN

A distributed network of servers that caches content close to end users. 

- Improves load times
- Reduces bandwidth costs
- Increases availability
- Improves Security

![AWS CDN](https://i.imgur.com/DQeQ3q3.jpg)

## Images

- **`max-width: 100%`** on images, so they shrink and grow with the parent column instead of overflowing it.
- **At least 150 PPI, 300 preferred** for anything that might be printed or viewed on a high-density display.
- **Compress everything.** `imagemin` runs at boot via `utils/imageOp.js` (JPEG, PNG and WebP pipelines), and Cloudinary handles transformation and optimisation for uploaded media. For one-off assets, [compresspng.com](https://compresspng.com/) is fine.
- **Serve the right size, not a scaled-down large one.** An oversized image is downloaded in full and then shrunk by the browser — the reader pays for every byte they never see. Use `srcset` so the browser picks a candidate matched to its viewport and pixel density.

<details>
<summary>Finding an image's PPI on macOS</summary>

1. Open the image in Preview.
2. **Tools → Adjust Size**.
3. Uncheck **Resample Image**.
4. In inches, set the size to your intended print size.
5. Read the resolution — it should be at least 300 pixels/inch.
</details>

## Delivery

A CDN caches content close to the reader: faster loads, lower bandwidth cost, better availability, and a layer of protection in front of the origin.

**This site does not have one.** Static assets are served by the single Fly.io machine in `sjc`, because the SPA and the API ship as one deployable ([ADR-005](adr/ADR-005-single-deployable.md)). Putting a CDN in front of the origin is the first thing to do if non-US traffic ever matters, and it does not require splitting the deployment.

## Performance

Targets, all measurable with Lighthouse or Chrome DevTools:

| Metric | Target |
|---|---|
| First Contentful Paint | < 2s |
| Largest Contentful Paint | < 2.5s |
| Time to Interactive | < 5s |
| Total page load | < 3s |
| First Input Delay | < 100ms |
| Cumulative Layout Shift | < 0.1 |
| API response time | < 1s |

These are aspirations, not current measurements — **no baseline has been recorded**, and a target without a measurement is a wish. The first useful step is one Lighthouse run per key page, committed with a date, so the next run has something to compare against. `web-vitals` already reports the field versions of the first six.

Full metric set — backend, quality, delivery and engagement, each with whether it can be measured today: [METRICS.md](METRICS.md).

Measure before changing anything — see [OPERATIONS.md](OPERATIONS.md#performance-profiling) for the React Profiler workflow, `why-did-you-render`, and bundle analysis.

Runtime signals in production: `web-vitals` reports Core Web Vitals, `@sentry/react` with `@sentry/tracing` captures errors and traces, and `react-ga4` covers page analytics.

Loading states use `react-loading-skeleton` rather than spinners, and `react-intersection-observer` defers off-screen work.

## Code standards

[EditorConfig](https://editorconfig.org) (`.editorconfig`) standardises editor settings across machines, and [ESLint](https://eslint.org) (`.eslintrc.json`, `npm run lint`) catches suspicious JavaScript. Prettier config lives in `.prettierrc`.

ESLint runs in CI on `staging` but is **advisory** — `continue-on-error`, so lint findings never block a merge. See [OPERATIONS.md](OPERATIONS.md#dev-pipeline-jobs-staging).

## Component library

Storybook covers `src/stories`:

```bash
npm run storybook        # :6006
npm run build-storybook
```

Both scripts set `NODE_OPTIONS=--openssl-legacy-provider`, for the same reason `npm start` does: `react-scripts@4.0.3` predates Node 17's OpenSSL 3 default and its webpack build uses a hash algorithm that OpenSSL 3 refuses. The flag goes away with the React 18 / Vite migration on the [roadmap](ROADMAP.md#engineering-ranked), not before.
