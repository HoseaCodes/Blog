# Blog page hero and "The Latest" logic

The `/blog` page renders an HBR-style landing layout: a most-liked hero, a three-column featured grid, and a right-rail "The Latest" list. The picks are derived from a single `GET /api/articles` fetch in a `useEffect` in [`src/Pages/Articles/Articles.jsx`](https://github.com/HoseaCodes/Blog-Portfolio/blob/master/src/Pages/Articles/Articles.jsx) — search for `fetchMostLikedArticle`, around line 1317.

This document records the rules so they do not have to be re-derived from the code.

> **If you change the picks, update this document *and* the comment block above that `useEffect`.** The selection rules are not obvious from reading the render, which is exactly why they get re-derived wrongly.

---

## Source data

- Endpoint: `GET /api/articles`, which returns **every** article, including drafts and archived ones.
- Filtered immediately to public-only: `!article.draft && !article.archived`.
- All hero slots are computed from that filtered list, called `allArticles` in the code.

## The five slots

| Slot | Selection rule |
|---|---|
| `mostLikedArticle` | Most likes across the whole filtered set |
| `main` | Most-liked article in the **most-populated category**, excluding `mostLikedArticle` to avoid a duplicate |
| `middle1` | Most-liked article in the 2nd-most-populated category |
| `middle2` | Most-liked article in the 3rd-most-populated category |
| `latest` (×3) | The three most recent by `createdAt`, excluding the four slots above |

### What "most-populated category" means

Category popularity is measured by **article count** — not by likes, not by recency. With 8 articles tagged `engineering` and 2 tagged `leadership`, `main` always comes from `engineering`, however well-liked the leadership posts are individually.

Each article's category is `article.categories?.[0]` — **only the first tag counts** for bucketing. Articles with no categories fall into `"general"`.

---

## Edge cases and consequences

**A recent post can vanish from "The Latest" by being promoted.** If your newest article is the most-liked in any top-3 category, it takes a hero slot and is excluded from the right rail. The rail can therefore look stale even though the `createdAt` sort is perfectly correct. This is the behaviour most likely to be reported as a bug.

**Hero picks are stable.** They move only when likes or category distribution move. A new post with 0 likes never displaces an incumbent.

**Small article sets collapse slots.** With articles in only one category, `middle1` and `middle2` are `undefined`. The render guards against null, but the columns look sparse.

**`main` can be undefined.** The code excludes `mostLikedArticle._id` from `main`'s candidates, so if the most-liked article is the *only* one in the most-populated category, there is nothing left to pick.

**`"general"` competes with real categories.** Untagged articles collect there, and on a young blog that bucket can become the most-populated one — biasing `main` toward untagged content.

---

## Common change knobs

| Ask | Change |
|---|---|
| "Hero by recency, not likes" | Replace the `(b.likes \|\| 0) - (a.likes \|\| 0)` sort with the same `createdAt` sort the right rail uses |
| "Hero by curation" | Add a `pinned: Boolean` field to the article schema and select pinned articles in pinned-order |
| "The Latest should include hero picks" | Drop the `usedIds` filter and let hero pieces appear in the rail too |
| "Hide the general bucket" | Filter `categoryCount` to drop the `"general"` key before sorting categories |
| "Bucket by all tags, not just the first" | Change `article.categories?.[0]` to iterate the full array — note this makes an article count toward several buckets |

---

## Related code

- **Hero derivation** — `fetchMostLikedArticle` `useEffect`, `Articles.jsx` ~1317, with `categoryCount` built at ~1330 and the slots assembled at ~1352–1373.
- **Render** — `MainCard` / `MiddleColumn` / `RightColumn` blocks in the same file, ~1530+.
- **Public-list filter** — the drafts/archived filter in `transformedArticles`, and the parallel filter on the hero fetch.
- **Schema** — [`models/article.js`](https://github.com/HoseaCodes/Blog-Portfolio/blob/master/models/article.js): `createdAt`, `likes`, `categories`, `draft`, `archived`.

Note that `likes` is a denormalised counter maintained with `$inc` (see [ARCHITECTURE.md](ARCHITECTURE.md#data-layer)), so hero selection depends on a value that is not transactionally consistent with the per-user like records.
