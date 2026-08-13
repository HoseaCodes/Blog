# API reference

Every route the running application serves, with its authentication requirement.

**Swagger UI is served at `/api-docs`** from `api/openapi.yaml` (`routes/apiDocs.js`) — open in development, HTTP Basic in production via `SWAGGER_DOCS_USER` / `SWAGGER_DOCS_PASS`, and a 404 if either is unset in production so an unconfigured deploy cannot expose an open docs page. The spec is loaded lazily on first request, keeping `app.js` importable without it.

That spec currently describes **2 of roughly 150 endpoints** — the two article routes it was generated with. Until it catches up, this file is the reference.

- [Conventions](#conventions)
- [Articles and comments](#articles-and-comments)
- [Blog workflow](#blog-workflow)
- [Media](#media)
- [AI writing assistance](#ai-writing-assistance)
- [SEO](#seo)
- [Analytics](#analytics)
- [Collaboration](#collaboration)
- [Points and store](#points-and-store)
- [AI art](#ai-art)
- [Text to speech](#text-to-speech)
- [Newsletter](#newsletter)
- [LinkedIn cross-posting](#linkedin-cross-posting)
- [Users](#users)
- [Catalogue: products, categories, projects, payments](#catalogue-products-categories-projects-payments)
- [Uploads](#uploads)
- [Crawler routes](#crawler-routes)
- [Not mounted](#not-mounted)

---

## Conventions

**Base URL** — `http://localhost:3003` locally, the Fly.io host in production. Everything below is under `/api` unless noted.

**Authentication** — `Authorization: Bearer <jwt>`, where the JWT is issued by Storm-Gate. Three levels appear in the tables:

| Mark | Meaning |
|---|---|
| — | Public |
| 🔑 | Any valid token |
| 👑 | Token **and** `role === 1` |
| 🔓 | `optionalAuth` — public, but a token enriches the response |

🔑 means *authenticated*, not *entitled*. Most content mutations perform no ownership check; see [SECURITY.md](SECURITY.md#authorization).

**Response shape is not uniform.** Different controllers return `{ success, article }`, `{ status, article }`, or `{ msg }`. Errors are generally `{ msg }` with 400/401/403/404/500. There is no RFC 7807 envelope and no correlation id. Clients special-case per endpoint today; unifying this is on the [roadmap](ROADMAP.md).

**Caching** — routes marked *cached* pass through `node-cache` middleware; mutations clear the corresponding cookie.

---

## Articles and comments

`routes/articles.js` — the core content surface.

| Method | Path | Auth | Notes |
|---|---|---|---|
| `GET` | `/api/articles` | — | Published articles. Cached |
| `POST` | `/api/articles` | 🔑 | Requires `article_id`, `title`, `images`. Duplicate `article_id` → 400 |
| `GET` | `/api/articles/:id` | 🔓 | Looked up **by slug**. A token adds per-viewer `liked` / `saved` |
| `PUT` | `/api/articles/:id` | 🔑 | ⚠️ no ownership check |
| `PATCH` | `/api/articles/:id` | 🔑 | Conditional update |
| `DELETE` | `/api/articles/:id` | 🔑 | ⚠️ no ownership check |
| `POST` | `/api/articles/:id/like` | 🔑 | Toggles. Anonymous → 401 so the UI can redirect to `/login` |
| `POST` | `/api/articles/:id/save` | 🔑 | Toggles a bookmark |
| `GET` | `/api/articles/saved` | 🔑 | The caller's bookmarks. Registered **before** `/articles/:id` so `saved` is not captured as an id |
| `GET` | `/api/articles/:id/comments` | — | |
| `POST` | `/api/articles/:id/comments` | — | ⚠️ unauthenticated comment creation |
| `PUT` | `/api/articles/:id/comments` | — | |
| `DELETE` | `/api/articles/:id/comments/:id` | 🔑 | |
| `GET` | `/api/admin/articles` | 🔑 | Includes drafts and archived. Registered before `/articles/:id` |
| `GET` | `/api/admin/articles/:id` | 🔑 | Same |

Route registration order in this file is load-bearing: literal paths (`/articles/saved`, `/admin/articles`) must precede the `:id` pattern, or they are swallowed as ids.

---

## Blog workflow

`routes/blog.js` — `router.use(auth)` gates the whole router, so everything is 🔑. **Ownership scoping is inconsistent**, and the pattern is worth internalising before you touch this file.

| Method | Path | Owner-scoped | Purpose |
|---|---|---|---|
| `GET` | `/api/blog/drafts` | ✅ `postedBy: req.user.id` | List drafts |
| `POST` | `/api/blog/draft` | ✅ | Create or auto-save a draft |
| `GET` | `/api/blog/scheduled` | ✅ | List scheduled posts |
| `POST` | `/api/blog/duplicate/:id` | ✅ | Duplicate |
| `POST` | `/api/blog/batch/publish` | ✅ | Batch publish |
| `POST` | `/api/blog/batch/delete` | ✅ | Batch delete |
| `PUT` | `/api/blog/publish/:id` | ⚠️ **no** | Publish |
| `PUT` | `/api/blog/schedule/:id` | ⚠️ **no** | Schedule — records intent; **the cron that acts on it does not fire**, see [OPERATIONS.md](OPERATIONS.md#failure-modes) |
| `PUT` | `/api/blog/archive/:id` | ⚠️ **no** | Archive |
| `GET` | `/api/blog/versions/:id` | ⚠️ **no** | Version history — readable for any article |
| `PUT` | `/api/blog/restore/:articleId/:versionId` | ⚠️ **no** | Restore a version |

**The list and batch operations are scoped; the single-article mutations are not.** The batch endpoints filter with `{ _id: { $in: articleIds }, postedBy: req.user.id }`, so a batch delete can only touch your own articles — while `PUT /api/blog/publish/:id` on someone else's article succeeds. Whoever wrote this scoped the operations that *felt* dangerous and missed the ones that take a single id.

None of these endpoints are covered by tests.

---

## Media

`routes/media.js` — **`/library` and `/search` are public**; `router.use(auth)` gates everything after them. Backed by Cloudinary. File *upload* lives under [Uploads](#uploads).

| Method | Path | Auth | Purpose |
|---|---|---|---|
| `GET` | `/api/media/library` | — **public** | Browse the library |
| `GET` | `/api/media/search` | — **public** | Search by query |
| `DELETE` | `/api/media` | 🔑 | Delete by public id |
| `PUT` | `/api/media/metadata` | 🔑 | Update metadata |
| `POST` | `/api/media/folder` | 🔑 | Create a folder |
| `GET` | `/api/media/stats` | 🔑 | Library statistics |

---

## AI writing assistance

`routes/ai.js` — 🔑 throughout, all `POST`, all backed by OpenAI. **No rate limit and no quota**: each call costs money and is gated only by having a token.

| Path | Purpose |
|---|---|
| `/api/ai/generate` | Generate content from a prompt |
| `/api/ai/improve` | Grammar, clarity, engagement |
| `/api/ai/titles` | Title suggestions |
| `/api/ai/outline` | Outline from a topic |
| `/api/ai/expand` | Expand content |
| `/api/ai/summarize` | Summarise |
| `/api/ai/translate` | Translate |
| `/api/ai/social-posts` | Per-platform social copy |
| `/api/ai/grammar` | Grammar check |
| `/api/ai/style` | Style suggestions |
| `/api/ai/meta-tags` | Meta tag generation |
| `/api/ai/key-points` | Key point extraction |
| `/api/ai/cta` | Call-to-action generation |

---

## SEO

`routes/seo.js` — 🔑 throughout. `POST` unless noted.

| Path | Purpose |
|---|---|
| `/api/seo/analyze` | Overall SEO score for an article |
| `/api/seo/keywords` | Keyword suggestions |
| `/api/seo/keyword-density` | Density analysis |
| `/api/seo/readability` | Flesch Reading Ease |
| `/api/seo/meta-description` | Generate a meta description |
| `/api/seo/title-suggestions` | Title options for target keywords |
| `/api/seo/duplicate-check` | Duplicate content check |
| `/api/seo/competitors` | Competitor analysis |
| `/api/seo/structured-data` | Schema.org JSON-LD |
| `/api/seo/link-analysis` | Internal/external link structure |
| `GET /api/seo/trending` | Trending topics by category |
| `/api/seo/image-optimization` | Alt text and image SEO |

---

## Analytics

`routes/analytics.js` — **two public write endpoints, then `router.use(auth)` gates the rest.**

| Method | Path | Auth | Purpose |
|---|---|---|---|
| `POST` | `/api/analytics/view` | — **public** | Record a view |
| `POST` | `/api/analytics/engagement` | — **public** | Record an engagement event |
| `GET` | `/api/analytics/article/:id` | 🔑 | Per-article statistics |
| `GET` | `/api/analytics/performance` | 🔑 | Performance dashboard |
| `GET` | `/api/analytics/top-articles` | 🔑 | Top articles |
| `GET` | `/api/analytics/demographics/:id` | 🔑 | Reader demographics |
| `GET` | `/api/analytics/traffic-sources/:id` | 🔑 | Traffic sources |
| `GET` | `/api/analytics/engagement/:id` | 🔑 | Engagement metrics |
| `GET` | `/api/analytics/conversions` | 🔑 | Conversion metrics |
| `GET` | `/api/analytics/realtime` | 🔑 | Real-time statistics |
| `GET` | `/api/analytics/export` | 🔑 | Export |

The split is deliberate: **writes are public so anonymous readers can be counted**, reads require a token so the numbers are not publicly exposed.

The cost of that choice is that both write endpoints are unauthenticated and unthrottled — anyone can inflate a view or engagement count with a loop. Treat these figures as indicative, not trustworthy, and note that the [rate limiter is not applied](SECURITY.md#abuse-and-cost-controls).

---

## Collaboration

`routes/collaboration.js` — 🔑 throughout. Partly scaffolding; inline comments and the activity feed are placeholders.

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/collaboration/reviews` | List reviews |
| `POST` | `/api/collaboration/review/request` | Request a review |
| `PUT` | `/api/collaboration/review/:id` | Submit a review |
| `POST` | `/api/collaboration/collaborator` | Add a collaborator |
| `DELETE` | `/api/collaboration/collaborator/:articleId/:userId` | Remove |
| `GET` | `/api/collaboration/collaborators/:articleId` | List |
| `POST` | `/api/collaboration/share` | Share an article |
| `GET` | `/api/collaboration/shares/:articleId` | Share analytics |
| `POST` | `/api/collaboration/inline-comment` | Add an inline comment |
| `PUT` | `/api/collaboration/inline-comment/:id/resolve` | Resolve |
| `GET` | `/api/collaboration/activity/:articleId` | Activity feed |

---

## Points and store

`routes/points.js` and `routes/store.js`. Both apply `router.use(auth)`, so **`storeRouter` must stay mounted before the other gated routers** or the public catalogue 401s — see [ARCHITECTURE.md](ARCHITECTURE.md#mount-ordering--a-real-invariant).

| Method | Path | Auth | Purpose |
|---|---|---|---|
| `GET` | `/api/points/packs` | 🔑 | Purchasable point packs |
| `GET` | `/api/points/balance` | 🔑 | Caller's balance |
| `GET` | `/api/points/transactions` | 🔑 | Caller's ledger |
| `POST` | `/api/points/sync` | 🔑 | Sync points earned offline (game sessions) |
| `POST` | `/api/points/spend` | 🔑 | Spend |
| `POST` | `/api/points/earn` | 🔑 | Credit earned points |
| `POST` | `/api/points/packs/orders` | 🔑 | Create a PayPal order |
| `POST` | `/api/points/packs/orders/capture` | 🔑 | Capture it |
| `GET` | `/api/store/items` | — | Public catalogue, used by `/shop/redeem` |
| `POST` | `/api/store/redeem` | 🔑 | Redeem an item for points |
| `GET` | `/api/store/my-redemptions` | 🔑 | Caller's redemptions |
| `GET` | `/api/store/download/:productId` | 🔑 | Download a redeemed item |

---

## AI art

`routes/aiArt.js` — 🔑 throughout. Stability AI for generation, PayPal or points for purchase.

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/ai-art/paypal-config` | Client-side PayPal config |
| `POST` | `/api/ai-art/preview` | Generate a watermarked preview |
| `POST` | `/api/ai-art/orders` | Create an order |
| `POST` | `/api/ai-art/orders/capture` | Capture it |
| `POST` | `/api/ai-art/purchase-with-points` | Buy with points instead |
| `GET` | `/api/ai-art/my-purchases` | Caller's purchases |
| `GET` | `/api/ai-art/download/:productId` | Download a purchased asset |

---

## Text to speech

`routes/tts.js` — OpenAI-backed, with a per-user quota (the only metered AI surface).

| Method | Path | Auth | Purpose |
|---|---|---|---|
| `POST` | `/api/tts/synthesize` | 🔑 | Synthesise audio; records usage |
| `GET` | `/api/tts/quota` | 🔑 | Remaining quota |
| `GET` | `/api/tts/admin/costs` | 👑 | Cost reporting |

---

## Newsletter

`routes/subscriber.js`, mounted at `/api/subscribers`. Must stay mounted **before** any router with a `router.use(auth)` catch-all, or the public links in emails 401.

| Method | Path | Auth | Purpose |
|---|---|---|---|
| `POST` | `/api/subscribers` | — | Signup. Idempotent — re-signup rotates the verify token, no duplicate row |
| `GET` | `/api/subscribers/verify/:token` | — | Confirm. Unknown token → 404 |
| `GET` | `/api/subscribers/unsubscribe/:token` | — | Opt out |
| `GET` | `/api/subscribers` | 👑 | List subscribers |
| `POST` | `/api/subscribers/broadcast/:articleId` | 👑 | Send an article to the list |

Delivery is via Resend. Without `RESEND_API_KEY` the row is still recorded and the send is a logged no-op. This is the best-tested surface in the repository — 9 integration tests.

---

## LinkedIn cross-posting

`routes/linkedin.js` — mounted early in `app.js` **because the callback must be reachable without a token**.

| Method | Path | Auth | Purpose |
|---|---|---|---|
| `GET` | `/api/admin/linkedin/connect` | 👑 | Start OAuth |
| `GET` | `/api/admin/linkedin/callback` | — | OAuth redirect target — un-gated **by design**; LinkedIn's browser redirect cannot carry a JWT |
| `GET` | `/api/admin/linkedin/status` | 👑 | Connection status |
| `DELETE` | `/api/admin/linkedin/disconnect` | 👑 | Disconnect |
| `POST` | `/api/admin/linkedin/post/:articleId` | 👑 | Cross-post an article |

`linkedinPostedAt` and `linkedinPostUrn` are stamped on the article, so a small edit and republish does not post twice.

---

## Users

`routes/user.js`, mounted at `/api/user`. Registration and login proper live in **Storm-Gate**; what remains here is legacy and profile state.

| Method | Path | Auth | Purpose |
|---|---|---|---|
| `POST` | `/api/user/register` | — | Legacy local registration — superseded by Storm-Gate |
| `PATCH` | `/api/user/addcart` | 🔑 | Add to cart |
| `GET` | `/api/user/history` | 🔑 | Order history. Cached |
| `GET` | `/api/user/admin/all` | — | ⚠️ **no middleware applied** despite the `admin` path |
| `PATCH` | `/api/user/:id/status` | 👑 | Approve or reject a pending user |
| `PUT` | `/api/user/:id` | `loginRequired` | Update profile |
| `DELETE` | `/api/user/:id` | `loginRequired` | Delete profile |

Two things to know. `GET /api/user/admin/all` has no auth middleware at all. And `loginRequired` is weak by construction — it passes when `req.user` **or** `req.params.id` is present, and `:id` is always present on these routes, so it is effectively a no-op. Both are listed in [SECURITY.md](SECURITY.md#known-gaps).

---

## Catalogue: products, categories, projects, payments

| Method | Path | Auth | |
|---|---|---|---|
| `GET` | `/api/products` | — | Cached |
| `POST` | `/api/products` | 👑 | |
| `PUT` `DELETE` | `/api/products/:id` | 👑 | |
| `GET` | `/api/category` | — | |
| `POST` | `/api/category` | 👑 | |
| `GET` | `/api/category/:id` | — | |
| `PUT` `DELETE` | `/api/category/:id` | 👑 | |
| `GET` | `/api/projects` | — | Portfolio entries |
| `POST` | `/api/projects` | 🔑 | |
| `GET` | `/api/projects/:id` | — | |
| `PUT` `DELETE` | `/api/projects/:id` | 🔑 | |
| `POST` | `/api/payment` | 🔑 | Record a payment |
| `GET` | `/api/payment/:id` | 👑 | Cached |

---

## Uploads

`routes/upload.js` — Cloudinary-backed, via `express-fileupload` temp files.

| Method | Path | Auth | |
|---|---|---|---|
| `POST` | `/api/allImages` | — | List uploads. Cached |
| `POST` | `/api/upload` | 🔑 | Upload an image |
| `POST` | `/api/destory` | 🔑 | Delete an image *(spelling preserved — it is the live path)* |

---

## Documentation

| Method | Path | Auth | |
|---|---|---|---|
| `GET` | `/api-docs` | — in development; **HTTP Basic** in production | Swagger UI. 404s in production when `SWAGGER_DOCS_USER`/`SWAGGER_DOCS_PASS` are unset |

Basic auth rather than the usual bearer token because this is a page a browser navigates to, and a plain navigation carries no `Authorization: Bearer` header — `utils/auth.js` would 401 before the UI rendered. Basic is the only scheme browsers negotiate on their own. Credentials are compared with `timingSafeEqual` over SHA-256 digests of both sides, so a length mismatch neither throws nor leaks credential length.

Mounted in `app.js` rather than `server.js` so it registers before the SPA catch-all, which would otherwise answer `/api-docs` with `index.html`.

---

## Crawler routes

Mounted at the site root, not under `/api`, and deliberately living in `app.js` rather than `server.js` because they need nothing from `build/`.

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/sitemap.xml` | Generated sitemap |
| `GET` | `/blog/:slug` | Server-rendered Open Graph / Twitter card preview for crawlers |

In development these are force-proxied by `src/setupProxy.js`, because CRA would otherwise answer them with the SPA shell.

---

## Not mounted

`routes/player.js` defines `/new`, `/:id`, `/:id/badges` and `/:id/assign_badge` for the game-player profile, but `app.js` never mounts it. The code is present and unreachable — dead until the Game Zone work in [ROADMAP.md](ROADMAP.md) lands.
