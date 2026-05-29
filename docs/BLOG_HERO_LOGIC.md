# Blog Page Hero & "The Latest" Logic

## Overview

The `/blog` page (`src/Pages/Articles/Articles.jsx`) renders an HBR-style
landing layout with a most-liked hero, a three-column featured grid, and a
right-rail "The Latest" list. The picks for these slots are derived from a
single `GET /api/articles` fetch in a `useEffect` near
`Articles.jsx:1311` (search for `fetchMostLikedArticle`).

This document records the rules so they don't have to be re-derived from
code. If you change the picks, update both this doc and the comment block
above the `useEffect`.

## Source data

- Endpoint: `GET /api/articles` (returns every article, including drafts
  and archived).
- Filtered immediately to public-only: `!article.draft && !article.archived`.
- All hero slots are computed from this filtered list, called `allArticles`
  in the code.

## The five slots

| Slot              | Selection rule                                                                                       |
| ----------------- | ---------------------------------------------------------------------------------------------------- |
| `mostLikedArticle` | Article with the most `likes` across the whole filtered set.                                         |
| `main`             | Most-liked article in the **most-populated category**, excluding `mostLikedArticle` to avoid dupes.  |
| `middle1`          | Most-liked article in the **2nd-most-populated category**.                                           |
| `middle2`          | Most-liked article in the **3rd-most-populated category**.                                           |
| `latest` (×3)      | The three most recent articles by `createdAt`, excluding the four slots above.                       |

### What "most-populated category" means

Category popularity is measured by **count of articles**, not by likes or
recency. If you have 8 articles tagged `engineering` and 2 tagged
`leadership`, `main` is always sourced from `engineering` — regardless of
whether the `leadership` posts have more likes individually.

Each article's category is `article.categories?.[0]` — only the **first**
tag counts for bucketing. Articles with no categories are bucketed under
`"general"`.

## Edge cases and consequences

1. **A recent post can disappear from "The Latest" by being picked as a hero.**
   If your newest article is the most-liked in any of the top-3
   categories, it occupies a hero slot and is excluded from the right
   rail. The right rail can therefore look stale even though `createdAt`
   sorting is correct.

2. **Hero picks are stable.** They shift only when likes or category
   distribution shifts. New posts with 0 likes don't displace hero
   incumbents.

3. **Small article sets collapse slots.** With articles in only one
   category, `middle1` and `middle2` are `undefined`. The render guards
   against null but the columns look sparse.

4. **`mostLikedArticle` and `main` can be the same article in practice.**
   The code excludes `mostLikedArticle._id` from `main`'s candidates, but
   if the most-liked article is the only one in the most-populated
   category, `main` is `undefined`.

5. **`"general"` competes with real categories.** Untagged articles
   collect under `"general"`, which can become the most-populated bucket
   on a young blog and bias `main` toward untagged content.

## Common change knobs

If a stakeholder asks for a different feel, the typical edits are:

- **"Hero by recency, not likes"** — replace the `(b.likes || 0) - (a.likes || 0)`
  sort with the same `createdAt` sort the right rail uses.
- **"Hero by curation"** — add a `pinned: Boolean` field on the article
  schema and select pinned articles for the hero slots in pinned-order.
- **"The Latest should include hero"** — drop the `usedIds` filter; let
  hero pieces appear in the right rail too.
- **"Hide the 'general' bucket"** — filter `categoryCount` to drop the
  `"general"` key before sorting categories.

## Related code

- Hero derivation: `src/Pages/Articles/Articles.jsx`
  `fetchMostLikedArticle` useEffect (~line 1311).
- Render of hero cards: same file, MainCard / MiddleColumn / RightColumn
  blocks (~line 1600+).
- Public-list filter for drafts/archived: `(articles || []).filter(...)`
  in `transformedArticles` (~line 1378) and the parallel filter on the
  hero fetch.
- Schema: `models/article.js` (`createdAt`, `likes`, `categories`,
  `draft`, `archived`).
