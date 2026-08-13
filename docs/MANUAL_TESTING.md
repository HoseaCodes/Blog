# Manual testing guide

A walkthrough of the enterprise blog features — the editor, AI assistance, media, SEO, publishing, analytics and versions. These paths have **no automated coverage** ([TESTING.md](TESTING.md#gaps-worth-closing)), so this guide is the only thing standing between a change and a regression in them.

> **Endpoint names here were corrected against the live routes.** An earlier version of this guide named endpoints that do not exist (`/api/blog/drafts` for saving, `/api/ai/generate-titles`, `/api/media/upload`, `/api/analytics/stats/:id`). If an expected call does not appear in the Network tab, check [API.md](API.md) before assuming the feature is broken.

- [Prerequisites](#prerequisites)
- [0. Authentication](#0-authentication)
- [1. Editor and auto-save](#1-editor-and-auto-save)
- [2. AI assistant](#2-ai-assistant)
- [3. Media library](#3-media-library)
- [4. SEO analyser](#4-seo-analyser)
- [5. Metadata and keywords](#5-metadata-and-keywords)
- [6. Publishing workflow](#6-publishing-workflow)
- [7. Analytics](#7-analytics)
- [8. Version history](#8-version-history)
- [9. Error handling](#9-error-handling)
- [10. End to end](#10-end-to-end)
- [Cross-cutting checks](#cross-cutting-checks)
- [Debugging checklist](#debugging-checklist)
- [Feature status](#feature-status)

---

## Prerequisites

Environment — note the exact variable names, several of which are easy to get wrong:

```bash
MONGODB_URL=...
ACCESS_TOKEN_SECRET=...     # NOT "JWT_SECRET" — must match Storm-Gate
STORM_GATE_URL=...          # wrong value ⇒ every admin check silently denies
CLOUND_NAME=...             # spelling is load-bearing
CLOUD_API_KEY=...
CLOUD_API_SECRET=...
OPENAI_API_KEY=...
```

```bash
node server.js    # API on :3003
npm start         # SPA on :3000
```

Log in as an admin. If admin-only UI is missing, check the logs for `[auth] Storm-Gate /me lookup failed` — a failed `/me` leaves `role` undefined and every admin check denies.

---

## 0. Authentication

Needs a running Storm-Gate. Contract details in [AUTHENTICATION.md](AUTHENTICATION.md).

**Registration**

- [ ] Register with valid data → auto-login, redirect
- [ ] Register where approval is required → `{ status: "PENDING" }`, pending message shown, routed to `/login`
- [ ] Register with a duplicate email → clear error, no partial account
- [ ] The blog-side mirror runs — a `Users` row appears locally. *Its failure must not block registration*, so also confirm a mirror error only logs a warning

**Login**

- [ ] Correct credentials → signed in, `isAdmin` correct for the account
- [ ] Wrong password → error message, no session
- [ ] A `PENDING` account → **200 with `status`, not an error** → routed to `/pending?email=…`
- [ ] A `DENIED` account → routed to `/denied`
- [ ] `rememberMe` checked → session survives a browser restart (7 days vs 24 hours)

**Password reset**

- [ ] Request a reset at `/forgot-password` → email sent
- [ ] Follow the link → token verified automatically on load
- [ ] Set a new password → can sign in with it, and **not** with the old one
- [ ] An expired or tampered token → clear error, no reset

**Status and session**

- [ ] `/check-status` returns the right status for an email
- [ ] Logout clears the session and redirects to `/login`
- [ ] Reload while signed in → session restored, **no flash of the logged-out view** (this is the `loading`-starts-`true` trap)
- [ ] Token expiry mid-session → 401 handled, no infinite redirect loop

**Route protection** — the [`PrivateRoute`](AUTHENTICATION.md#protecting-a-route) decision order:

- [ ] Signed out, visit `/admin` → redirect to `/login`
- [ ] Signed in as non-admin, visit an admin route → redirect to `/`
- [ ] Signed in as admin → route renders
- [ ] With a cookie present but `getMe()` still in flight → **spinner**, not a redirect. Throttle the network to see this
- [ ] Admin sets a signed-in user to `DENIED` → that user hits `/denied` on their next navigation, without needing to log out
- [ ] On a public page (`/blog/:slug`), a 401 does **not** redirect — the page renders its logged-out view

**Degradation**

- [ ] Stop Storm-Gate, then load an article — it still renders. `/me` failures are swallowed by design
- [ ] With Storm-Gate down, admin-only UI disappears rather than erroring. Failing closed is correct here

> Nothing in this section is covered by automated tests. The API-side half — 401 without a token, 403 for a non-admin, 200 for an admin — *is* covered, in `test/integration/subscribers.test.js`.

---

## 1. Editor and auto-save

**1.1 — Open the editor.** Navigate to article creation.

- Header bar with status indicator showing "Draft"
- Buttons: AI Assistant, Preview, Publish
- Sidebar tabs: Editor, AI Assistant, Media, Metadata, SEO, Workflow, Analytics, Versions

**1.2 — Auto-save.** Type a title and 100+ words, then stop for ~3 seconds.

- Status shows "Saving…", then "Saved X seconds ago"
- `POST /api/blog/draft` in the Network tab *(singular — `/api/blog/drafts` is the GET list)*
- `POST /api/analytics/engagement` tracks the auto-save event
- The document exists in Mongo with `draft: true`

Then type continuously for 30 seconds: saves must not block typing, and must not queue up one per keystroke.

---

## 2. AI assistant

Every endpoint here **costs money per call and is not rate-limited** ([SECURITY.md](SECURITY.md#abuse-and-cost-controls)). Do not leave a loop running.

**2.1 — Open it.** Four categories: Brainstorming, Editing, Quality, SEO.

**2.2 — Titles.** Brainstorming → Title Ideas.
Loading indicator → several suggestions → clicking one applies it. Calls `POST /api/ai/titles`.

**2.3 — Improve selected text.**

1. Select text in the editor.
2. **While it is still selected**, click AI Assistant in the header.
3. The selection appears in a banner with a character count and quick actions: Improve, Fix Grammar, Simplify.
4. Click one, wait, then **Apply** to replace the original.

Calls `POST /api/ai/improve`. Also check **Clear** drops the selection, and that no OpenAI error appears in the console.

**2.4 — Meta description.** SEO Assistant → Meta Description, with a title and content present. Expect 150–160 characters, content-derived, appliable to metadata. Calls `POST /api/ai/meta-tags`.

---

## 3. Media library

**3.1 — Open.** Grid/list toggle, search, upload button, drag-drop zone. Backed by `GET /api/media/library`.

**3.2 — Upload.** Drag a JPG/PNG/GIF in.

- Uploads to Cloudinary, URL returned and rendered
- Appears in the grid, with its Cloudinary id stored
- Calls `POST /api/upload` *(the media router has no upload route — uploads go to the upload router)*
- Verify it landed in the Cloudinary dashboard

**3.3 — Insert.** Click an image → Insert. An image markdown tag (`!` + `[alt]` + `(url)`) lands in the content and renders in preview.

**3.4 — Rejects.** A >10MB file and a `.exe` should both fail with a message, not a crash.

---

## 4. SEO analyser

With a title and 200+ words, open the SEO tab.

**4.1 — Analysis.** A 0–100 score plus per-check pass/warning/fail on title length, meta description, heading structure, keyword density and internal links, each with a recommendation. Calls `POST /api/seo/analyze`.

**4.2 — Keywords.** 10–20 content-derived suggestions, clickable into metadata. Calls `POST /api/seo/keywords`.

**4.3 — Readability.** A Flesch Reading Ease score with an interpretation, and improvement suggestions when low. Calls `POST /api/seo/readability`.

---

## 5. Metadata and keywords

**5.1 — Suggestions.** With 100+ words, the Metadata tab shows "AI Suggested Keywords" — 10 clickable keywords, with a loading state while fetching.

**5.2 — Apply.** Clicking one adds it to Content Tags. Clicking the same one again must **not** duplicate it.

**5.3 — Manual tags.** Type a tag, press Enter. Each tag gets a remove button, and tags survive the next auto-save.

---

## 6. Publishing workflow

**6.1 — Publish.** With title, content and metadata complete, click Publish.

- The draft saves first (`POST /api/blog/draft`), then `PUT /api/blog/publish/:id` *(PUT, not POST)*
- Success notification; `published: true` in Mongo
- `POST /api/analytics/engagement` records the publish

**6.2 — Schedule.** Workflow tab → pick a future date/time → Schedule. Calls `PUT /api/blog/schedule/:id` *(PUT, not POST)*. Status becomes "scheduled" and `scheduledDateTime` is stored.

> ⚠️ **Verify the intent is recorded, and stop there.** The cron that would publish scheduled posts **cannot fire** — see [OPERATIONS.md](OPERATIONS.md#failure-modes). Do not treat "the article published itself overnight" as an expected result; today it will not.

**6.3 — Platform selection.** Toggle platform checkboxes. LinkedIn is real ([API.md](API.md#linkedin-cross-posting)); Medium and dev.to are inactive unless keys are set.

---

## 7. Analytics

**7.1 — View.** Analytics tab shows Views, Engagements, Shares, Avg Read Time, with a 7d/30d/90d filter. Calls `GET /api/analytics/article/:id` *(not `/analytics/stats/:id`)*. A brand-new article falls back to mock data — do not read that as real traffic.

**7.2 — Events.** Trigger a save and a publish, then check the collection:

```js
db.analytics.find({ articleId: "…" }).sort({ timestamp: -1 })
```

Each event should carry a timestamp and metadata. Note that view tracking sits behind auth, so anonymous reads are not counted.

---

## 8. Version history

**8.1 — List.** Versions tab, after several saves: a list with timestamps. Calls `GET /api/blog/versions/:id`.

**8.2 — Restore.** Click a previous version → Restore. Content reverts and a notification appears; restoring a newer version undoes it. Calls `PUT /api/blog/restore/:articleId/:versionId` *(PUT, not POST)*.

---

## 9. Error handling

**9.1 — Backend down.** Stop `node server.js`, then try to save and to use AI. Expect error messages and local fallback — not a blank screen or an unhandled rejection.

**9.2 — Missing API props.** No "Cannot read property of undefined" in the console; components should check an API exists before calling it.

---

## 10. End to end

The full path, in one sitting:

1. Create an article, write a title and content
2. Wait for auto-save
3. Improve a paragraph with AI
4. Upload and insert an image
5. Review SEO suggestions
6. Add suggested keywords from Metadata
7. Publish
8. **Confirm it renders on the public site** at its slug
9. Re-open it via Edit, change something, save, and confirm version history grew

Then check the [blog landing page](BLOG_PAGE_LOGIC.md): a newly published article may *not* appear in "The Latest" if it was promoted into a hero slot. That is correct behaviour, and it looks like a bug.

---

## Cross-cutting checks

**Browsers** — Chrome, Firefox, Safari, Edge, current versions.

**Mobile** — device emulation or a real handset: sidebar collapses, touch targets are large enough, text stays readable.

**Auth** — visit the editor logged out (should redirect to `/login`), and call an API endpoint with no token (should be 401). Note that any *authenticated* user can currently edit or delete any article ([SECURITY.md](SECURITY.md#authorization)) — that is a known gap, not something this guide verifies away.

**Performance** — clear cache, reload, and watch first render, time to interactive, and API response times. See [FRONTEND.md](FRONTEND.md#performance) for targets.

---

## Debugging checklist

**Backend logs** — routers registered, `Connected to MongoDB`, no 404s on API paths, no 500s.

**Browser console** — GlobalState exposes `blogAPI`, `mediaAPI`, `aiAPI`, `seoAPI`, `analyticsAPI`; a token is present; no undefined-property errors.

**Network tab** — 200s, expected payloads, `Authorization` header present.

**Mongo**

```js
db.articles.find({ draft: true })
db.articles.find({ published: true })
db.analytics.find().sort({ timestamp: -1 }).limit(10)
```

**curl** — note port **3003**, and that there is no `/api/blog/health` endpoint to check (there is no health endpoint at all):

```bash
curl -X POST http://localhost:3003/api/blog/draft \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"title":"Test","markdown":"Content"}'

curl -X POST http://localhost:3003/api/ai/titles \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"content":"Test article about React hooks"}'

curl -X POST http://localhost:3003/api/seo/analyze \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"title":"Test","content":"Article content","description":"Test desc"}'
```

---

## Feature status

**Working** — auto-save against the real backend, AI generation, Cloudinary uploads, SEO analysis, keyword suggestions, publishing, analytics tracking, version history.

**Partial** — collaboration (API exists, UI incomplete), multi-platform publishing (LinkedIn only), analytics dashboards (tracking works, presentation is thin).

**Not implemented** — review/approval logic, inline commenting, live co-authoring.

**Broken** — scheduled publishing does not fire.

---

## Reporting an issue

Include reproduction steps, expected vs actual, console errors, failed network calls, browser and version, and the article id. Then read [`CLAUDE.md`](../CLAUDE.md) — this repository's debugging protocol asks for observation before a fix, and console output plus a DOM snapshot at the failure point is exactly what it wants first.
