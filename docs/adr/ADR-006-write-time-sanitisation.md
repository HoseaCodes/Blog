# ADR-006 — Sanitise markdown at write time

**Status:** Accepted

---

## Context

Articles are authored in Markdown, which permits raw HTML. That HTML reaches other people's browsers. Something has to sanitise it, and the question is *where*.

Sanitising on read is the common answer: keep the source pristine, clean it on the way out. It has one structural problem — it has to be done on **every** read path, and read paths multiply. The article endpoint, the admin endpoint, the social preview route, the sitemap, a future RSS feed, an export. Each one is a place to forget, and forgetting is silent.

## Decision

Render and sanitise once, at write time, in the model:

```js
articleSchema.pre('validate', function (next) {
  if (this.markdown) {
    this.sanitizedHtml = dompurify.sanitize(marked(this.markdown));
  }
  next();
});
```

Both `markdown` (the author's source of truth) and `sanitizedHtml` (what readers get) are stored. DOMPurify runs server-side over a JSDOM window.

The hook lives on the **schema**, not in a controller, so it fires on every write that goes through a Mongoose *document* — including handlers written later by someone who has not read this file.

> **That guarantee is narrower than it looks, and the gap is currently a live bug.** `pre('validate')` is **document** middleware: it runs on `doc.save()`, and **not** on `findOneAndUpdate`, `updateOne`, or any other query-level write.
>
> `updateArticle` uses `Articles.findOneAndUpdate(...)`. So **editing an article's markdown does not re-render its HTML** — the stored `sanitizedHtml` keeps whatever it was when the document was first created, and since the read path serves `sanitizedHtml`, the edit is invisible to readers.
>
> Fix options, in preference order: load-modify-`save()` in the controller; add matching `pre('findOneAndUpdate')` middleware that recomputes `sanitizedHtml` from `$set.markdown`; or render in one service function every write path calls. Tracked in [ROADMAP.md](../ROADMAP.md#engineering-ranked).

## Consequences

**Good**

- **No read path can forget.** The invariant is enforced at the point where documents are created, and there is exactly one of those.
- Sanitising once per write rather than once per read is also the cheaper arrangement, given the read:write ratio of a blog.
- The original markdown survives, so re-rendering is always possible and editing is lossless.
- Testable at the layer that matters: `test/integration/articles.test.js` asserts on the **stored** `sanitizedHtml`, so a regression that sanitises the response while persisting raw HTML still fails. `test/unit/dompurify.test.js` covers the sanitiser's own behaviour across 42 cases, including the 2.x → 3.x upgrade surface.

**Bad**

- **Changing the sanitiser policy requires a backfill.** Tightening the allowlist does not retroactively protect existing documents; they have to be re-rendered. This is the real cost of the decision.
- **A DOMPurify upgrade is a content change**, not just a dependency bump — which is precisely why the unit suite covers the version-to-version behaviour so heavily.
- Stored data is duplicated: source and rendered output for every article.
- A write that bypasses the Mongoose **document** layer bypasses the hook — a raw driver call, a manual Atlas edit, **or any `findOneAndUpdate`**. The app does the last one on its main edit path, which is the bug described above.
- The integration suite only covers **create**, so the update path's failure to re-render was invisible. A test that edits an article and asserts the stored HTML changed would have caught it immediately.
- The hook runs on `validate`, so it fires on every save including ones that did not touch `markdown`. Cheap, but not free.

## What would change the answer

- If sanitiser policy started changing often, the backfill cost would begin to outweigh the forgot-a-read-path risk, and rendering on read behind a single shared helper would become competitive — *provided* that helper were genuinely the only read path.
- If articles gained a rich-text or block-based editor, the markdown-to-HTML step would move and this hook would be replaced rather than adjusted.
- If a second writer of article documents appeared that did not go through Mongoose, the invariant would need to move to the database or to a shared write API.
