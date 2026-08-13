# Frontend API modules

The client half of the API. Every resource family has a hook-shaped module in [`src/API/`](../src/API/) that wraps axios calls and owns its own state; they are composed into `GlobalState` and consumed with `useContext`.

Backend endpoints are documented in [API.md](API.md). This is how the SPA calls them.

- [The pattern](#the-pattern)
- [BlogAPI](#blogapi)
- [MediaAPI](#mediaapi)
- [AIAPI](#aiapi)
- [SEOAPI](#seoapi)
- [AnalyticsAPI](#analyticsapi)
- [CollaborationAPI](#collaborationapi)
- [Others](#others)
- [Conventions](#conventions)

---

## The pattern

Every module follows the shape established by `ArticlesAPI.jsx` and `UserAPI.jsx`: a function taking the auth token, holding `useState` for its data plus `loading` and `callback`, fetching in `useEffect`, and returning both state tuples and action functions.

```jsx
const { blogAPI } = useContext(GlobalState);

const [drafts, setDrafts] = blogAPI.drafts;      // state tuples
const [loading]           = blogAPI.loading;

await blogAPI.saveDraft(articleData);            // actions
```

What this preserves — and the reason new features were built into this shape rather than around it — is that state stays in React Context with the existing notification/dispatch system, authentication stays cookie-and-token based, and every module looks like every other one.

---

## BlogAPI

Drafts, publishing, scheduling, versions, batch operations.

```jsx
await blogAPI.saveDraft(articleData);
await blogAPI.publishArticle(articleId, publishData);
await blogAPI.scheduleArticle(articleId, { scheduledDateTime });
await blogAPI.getVersionHistory(articleId);
await blogAPI.restoreVersion(articleId, versionId);
await blogAPI.duplicateArticle(articleId);
await blogAPI.archiveArticle(articleId);
await blogAPI.batchPublish([id1, id2, id3]);
await blogAPI.batchDelete([id1, id2]);
```

State: `drafts`, `scheduled`, `versions`, `loading`.

> `scheduleArticle` records the intent; nothing publishes on the schedule. See [OPERATIONS.md](OPERATIONS.md#failure-modes).

## MediaAPI

Cloudinary-backed library management.

```jsx
const result = await mediaAPI.uploadFile(file, 'blog');
await mediaAPI.uploadMultipleFiles([file1, file2], 'blog');
await mediaAPI.deleteMedia(publicId);
await mediaAPI.updateMediaMetadata(publicId, metadata);
await mediaAPI.searchMedia(query);
await mediaAPI.createFolder(name);
const stats = await mediaAPI.getMediaStats();
```

State: `mediaLibrary`, `uploadProgress`.

## AIAPI

Thirteen OpenAI-backed operations. **Unmetered and unthrottled — each call costs money.**

```jsx
await aiAPI.generateContent(prompt, options);
await aiAPI.improveContent(content, type);        // 'grammar' | 'clarity' | 'engagement'
await aiAPI.generateTitles(content, count);
await aiAPI.generateOutline(topic, depth);
await aiAPI.expandContent(content, length);
await aiAPI.summarizeContent(content, length);
await aiAPI.translateContent(content, language);
await aiAPI.generateSocialPosts(content, platforms);
await aiAPI.checkGrammar(content);
await aiAPI.getStyleSuggestions(content, style);
await aiAPI.generateMetaTags(content);
await aiAPI.extractKeyPoints(content, count);
await aiAPI.generateCTA(context, goal);
```

## SEOAPI

```jsx
const analysis = await seoAPI.analyzeSEO(articleData);
await seoAPI.getKeywordSuggestions(topic, lang);
await seoAPI.analyzeKeywordDensity(content, keywords);
await seoAPI.checkReadability(content);
await seoAPI.generateMetaDescription(content, length);
await seoAPI.generateTitleSuggestions(content, keywords);
await seoAPI.checkDuplicateContent(content);
await seoAPI.analyzeCompetitors(keyword, competitors);
await seoAPI.generateStructuredData(articleData);
await seoAPI.analyzeLinkStructure(content);
await seoAPI.getTrendingTopics(category);
await seoAPI.optimizeImageSEO(url, alt, context);
```

## AnalyticsAPI

```jsx
await analyticsAPI.trackView(articleId, metadata);
await analyticsAPI.trackEngagement(articleId, 'scroll', { depth: 75 });
const stats = await analyticsAPI.getArticleStats(articleId);
const top   = await analyticsAPI.getTopArticles(10);
await analyticsAPI.getReaderDemographics(articleId);
await analyticsAPI.getTrafficSources(articleId);
await analyticsAPI.getEngagementMetrics(articleId);
await analyticsAPI.getConversionMetrics();
await analyticsAPI.getRealTimeStats();
const csv = await analyticsAPI.exportAnalytics('csv');
```

State: `performanceMetrics`, `timeRange`.

## CollaborationAPI

Reviews, collaborators, sharing, inline comments. Partly scaffolding — the API exists ahead of the UI.

```jsx
await collaborationAPI.requestReview(articleId, reviewerIds, message);
await collaborationAPI.submitReview(reviewId, feedback, approved);
await collaborationAPI.addCollaborator(articleId, userId, 'editor');
await collaborationAPI.removeCollaborator(articleId, userId);
await collaborationAPI.getCollaborators(articleId);
await collaborationAPI.shareArticle(articleId, shareData);
await collaborationAPI.getShareAnalytics(articleId);
await collaborationAPI.addInlineComment(articleId, commentData);
await collaborationAPI.resolveInlineComment(commentId);
await collaborationAPI.getActivityFeed(articleId);
```

## Others

`ArticlesAPI`, `CommentsAPI`, `ProductsAPI`, `ProjectsAPI`, `PointsAPI`, `StoreAPI`, `AIArtAPI` follow the same pattern. `GithubAPI`, `JokeAPI` and `KanyeWestAPI` are small third-party wrappers used for site flavour.

**`UserAPI` is the exception worth reading separately.** It holds auth state (`isLoggedIn`, `isAdmin`, `user`, `loading`, `error`) plus `login`/`register`/`logout`, and its `loading` flag starts `true` — components that branch on `isLoggedIn` before it resolves flash the logged-out view. Documented in [AUTHENTICATION.md](AUTHENTICATION.md#consuming-auth-in-components).

Authenticated axios instances come from the auth SDK rather than being constructed here — see [AUTHENTICATION.md](AUTHENTICATION.md#how-a-token-moves).

---

## Conventions

**Check the API exists before calling it.** Components receive these through context and should degrade rather than throw when one is absent — `9.2` in the [manual testing guide](MANUAL_TESTING.md#9-error-handling) tests exactly this.

**Response shapes are not uniform.** Handlers return `{ success, … }`, `{ status, … }` or `{ msg }` depending on age, so each module normalises for its own callers. Unifying that is on the [roadmap](ROADMAP.md#engineering-ranked).

**Nothing here is tested.** There are no tests over `src/API/`. Given these modules hold retry, error and state-transition logic, they are a reasonable place for the first real unit tests.
