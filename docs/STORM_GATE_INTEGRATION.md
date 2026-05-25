# Storm-Gate Integration Guide

This document describes exactly how the `blog-portfolio` app integrates with **Storm-Gate** today, so the Storm-Gate team can extract that integration surface into a reusable **npm package**.

The goal: any consumer app should be able to `npm install @storm-gate/client` (or similar) and get the same auth flow this portfolio has, without hand-rolling axios instances, cookie handling, and JWT verification middleware.

---

## 1. Architecture at a glance

```
┌─────────────────────┐        ┌──────────────────────┐
│  React frontend     │  ───►  │  Storm-Gate          │   ← auth service
│  (CRA, port 3000)   │  JWT   │  (port 8081 / Lambda)│      issues + verifies JWT
└─────────────────────┘        └──────────────────────┘
          │
          │ same JWT in cookie
          ▼
┌─────────────────────┐
│  Portfolio Express  │   ← data service (articles, cart, points, etc.)
│  (port 3003)        │      verifies JWT with the SAME shared secret
└─────────────────────┘
```

Two important properties:

- **The portfolio backend never calls Storm-Gate.** It just validates the JWT locally using a shared `ACCESS_TOKEN_SECRET`. Storm-Gate is purely the issuer.
- **The frontend talks to both servers** with the same `Authorization` header, populated from a single `accesstoken` cookie.

---

## 2. The Storm-Gate HTTP contract (what the npm package must wrap)

All endpoints are hit from [src/services/authService.js](../src/services/authService.js). Base URL:

```js
process.env.REACT_APP_API_BASE_URL
  || (NODE_ENV === 'production'
        ? 'https://3ynqb3302m.execute-api.us-east-1.amazonaws.com'
        : 'http://localhost:8081');
```

| Method | Path                          | Body                                                                   | Success response                                          |
|--------|-------------------------------|------------------------------------------------------------------------|-----------------------------------------------------------|
| POST   | `/register`                   | `{ name, email, password, username?, role?, application?, status? }`   | `{ accesstoken?, requiresApproval?, user?, msg? }`        |
| POST   | `/login`                      | `{ email, password, rememberMe? }`                                     | `{ accesstoken, user?, limitedAccess?, msg? }`            |
| GET    | `/me`                         | — (requires `Authorization` header)                                    | `{ user: { id, name, email, role, … } }`                  |
| POST   | `/logout`                     | —                                                                      | `{ msg }`                                                  |
| GET    | `/refresh_token`              | —                                                                      | `{ accesstoken }`                                          |
| POST   | `/check-status`               | `{ email }`                                                            | `{ status, msg? }`                                         |
| POST   | `/forgot-password`            | `{ email }`                                                            | `{ msg }`                                                  |
| POST   | `/verify-reset-token`         | `{ token }`                                                            | `{ valid, msg? }`                                          |
| POST   | `/reset-password/:token`      | `{ password }`                                                         | `{ msg }`                                                  |

Errors always come back as `{ msg: "..." }` with a `4xx`/`5xx` status. The frontend treats `401` specially (see §5).

---

## 3. The shared-secret JWT contract

This is the single most important piece of the integration. Storm-Gate signs; the consumer app verifies.

- **Secret env var:** `ACCESS_TOKEN_SECRET` (and a separate `REFRESH_TOKEN_SECRET` for refresh tokens).
- **Algorithm:** HS256 (symmetric — both sides must hold the same secret).
- **Required claims:** at minimum `id`, `email`, `role`. The portfolio middleware in [utils/auth.js:26](../utils/auth.js#L26) assigns the entire decoded payload to `req.user`, so anything Storm-Gate puts in the token is available downstream.

Consumer-side verification looks like this ([utils/auth.js:13](../utils/auth.js#L13)):

```js
jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
  if (err instanceof jwt.TokenExpiredError) return res.status(400).json({ msg: "Token Expired Error", err });
  if (err) return res.status(400).json({ msg: "Invalid Authentication - invalid token" });
  req.user = user;
  next();
});
```

> **Recommendation for the npm package:** ship a thin Express middleware (`stormGate.requireAuth()`) so consumers don't have to copy/paste this. Optionally support an asymmetric (RS256) mode where Storm-Gate publishes a JWKS endpoint and consumers verify with a public key — that removes the shared-secret distribution problem entirely.

---

## 4. How the token moves between the three pieces

### Step 1 — Frontend logs in

[src/services/authService.js:134](../src/services/authService.js#L134)

```js
const response = await api.post('/login', { email, password, rememberMe });
if (response.data.accesstoken) {
  const maxAge = rememberMe ? 7 * 24 * 60 * 60 : 24 * 60 * 60;
  document.cookie = `accesstoken=${response.data.accesstoken}; path=/; max-age=${maxAge}`;
}
```

The JWT is written into a **client-readable cookie** named `accesstoken`. It is _not_ HttpOnly today, because the frontend's axios interceptor reads it directly out of `document.cookie`.

### Step 2 — Frontend attaches the token to every request

A single interceptor is shared by **two** axios instances — one for Storm-Gate, one for the portfolio's own Express server ([src/services/authService.js:29-46](../src/services/authService.js#L29-L46)):

```js
const attachCookieToken = (config) => {
  let token = document.cookie.split('; ')
    .find(r => r.startsWith('accesstoken='))?.split('=')[1];
  if (token?.startsWith('JWT ')) token = token.substring(4);  // tolerate "JWT " prefix
  if (token) config.headers.Authorization = token;
  return config;
};

api.interceptors.request.use(attachCookieToken);       // Storm-Gate
apiLocal.interceptors.request.use(attachCookieToken);  // portfolio Express
```

Two important conventions:

1. The header is **raw `Authorization: <jwt>`** — no `Bearer ` prefix.
2. The interceptor **strips a leading `JWT ` prefix** if Storm-Gate ever returns one. The npm package should pick one format and stick to it.

### Step 3 — Portfolio Express verifies the same token

The portfolio Express server applies [utils/auth.js](../utils/auth.js) as middleware on protected routes (e.g. article creation, cart, points). It reads `req.header("Authorization")`, verifies it against `ACCESS_TOKEN_SECRET`, and puts the decoded user on `req.user`.

### Step 4 — Logout

[src/services/authService.js:200](../src/services/authService.js#L200) calls `POST /logout`, clears the `accesstoken` and `refreshtoken` cookies, wipes a few `localStorage` flags (`firstLogin`, `isLoggedIn`, `isAdmin`), and redirects to `/login`.

---

## 5. Edge cases the package needs to handle

These are real behaviors we currently bake into authService — they should live in the SDK, not be reinvented per consumer.

- **401 selective redirect** ([src/services/authService.js:74-99](../src/services/authService.js#L74-L99)). On a 401, we clear creds, but we only force a redirect to `/login` if the user is on an auth-required route. Public pages like `/blog/:slug` stay put and just render the unauthenticated view. The package should expose this as a configurable predicate.
- **`requiresApproval` flow on register**. Storm-Gate can return `{ requiresApproval: true }` instead of a token. The frontend then shows a pending message and routes to `/login` after a delay ([src/Pages/Auth/register.jsx](../src/Pages/Auth/register.jsx)).
- **`limitedAccess` flow on login**. Login can succeed with a token *and* `limitedAccess: true` (account approved but reduced permissions). Consumer apps need to inspect this flag.
- **Token expiry**. The verification middleware returns `{ msg: "Token Expired Error" }` with **status 400, not 401**. That's worth normalizing in the package — most clients expect 401 for expired tokens, and the frontend's 401-handling logic above does _not_ currently fire on token expiry as a result.
- **Cookie max-age depends on `rememberMe`**: 7 days vs 1 day. The package should accept this as an option, not hardcode it.

---

## 6. The shape of an npm package that would replace this

Given the above, a minimal package surface that would let the portfolio (and any future consumer) drop in Storm-Gate cleanly:

### Client (browser) package — `@storm-gate/client`

```js
import { createStormGateClient } from '@storm-gate/client';

const auth = createStormGateClient({
  baseURL: process.env.REACT_APP_STORM_GATE_URL,
  cookieName: 'accesstoken',
  rememberMeMaxAge: 7 * 24 * 60 * 60,
  defaultMaxAge:    1 * 24 * 60 * 60,
  isAuthRequiredRoute: (pathname) => pathname.startsWith('/admin'),
});

await auth.login({ email, password, rememberMe: true });
await auth.getMe();
await auth.logout();

// For talking to your own backend with the same cookie token:
const apiLocal = auth.createAuthedAxios({ baseURL: 'http://localhost:3003' });
```

This collapses ~200 lines of [src/services/authService.js](../src/services/authService.js) into one `createStormGateClient` call.

### Server (Node) package — `@storm-gate/express`

```js
import express from 'express';
import { requireAuth } from '@storm-gate/express';

const app = express();
const auth = requireAuth({ secret: process.env.ACCESS_TOKEN_SECRET });

app.post('/api/articles', auth, articlesController.create);   // req.user populated
app.get('/api/me/cart',   auth, cartController.list);
```

This collapses [utils/auth.js](../utils/auth.js) into one import. Adding role helpers (`requireRole('admin')`) on top would also let us delete the client-side role-gating workaround called out at [controllers/user.js:171](../controllers/user.js#L171).

### Optional: shared types — `@storm-gate/types`

A `User`, `LoginResponse`, `RegisterResponse` type package so consumer apps get type-safety for the response shapes in §2.

---

## 7. Concrete checklist for the Storm-Gate team

Before publishing the package, lock down these contract questions — each one is currently ambiguous in our integration:

- [ ] **Header format.** Pick one: raw JWT, or `Bearer <jwt>`. Document it. (We currently tolerate a `JWT ` prefix in the client — please standardize.)
- [ ] **Status code for expired tokens.** Should be `401`, not `400`. The current `400` breaks our automatic-redirect logic.
- [ ] **JWT claims contract.** Document the exact claim names (`id`, `role`, `email`, `iat`, `exp`, …) and the type of `role` (number vs string — our DB uses `Number`, but Storm-Gate's `/me` is sometimes consulted for an `isAdmin` boolean).
- [ ] **Refresh-token strategy.** Today `/refresh_token` is GET with no body — what cookie/header does it read? Document the rotation policy.
- [ ] **Symmetric vs asymmetric signing.** Strongly consider RS256 + JWKS so consumer apps never have to hold the signing secret.
- [ ] **Logout semantics.** Is `/logout` a real revocation, or just a cookie-clear? Document so consumers know whether old tokens remain valid until `exp`.
- [ ] **CORS / cookie domain.** When Storm-Gate is on a different origin than the consumer, the cookie strategy in §4 step 1 breaks. The package should support either `withCredentials` HttpOnly cookies (set by Storm-Gate) or a token-in-memory mode.
- [ ] **Multi-tenant `application` field.** `/register` accepts an `application` string ("blog", etc.). Document the allowed values and what behavior they change.

---

## 8. Reference: file map in this repo

| Concern                            | File                                                       |
|------------------------------------|------------------------------------------------------------|
| All HTTP calls to Storm-Gate       | [src/services/authService.js](../src/services/authService.js) |
| Cookie + Authorization interceptor | [src/services/authService.js:29-46](../src/services/authService.js#L29-L46) |
| Login UI                           | [src/Pages/Auth/login.jsx](../src/Pages/Auth/login.jsx)    |
| Register UI                        | [src/Pages/Auth/register.jsx](../src/Pages/Auth/register.jsx) |
| React context wiring auth state    | [src/API/UserAPI.jsx](../src/API/UserAPI.jsx)              |
| JWT verification middleware        | [utils/auth.js](../utils/auth.js)                          |
| Local User model (NOT Storm-Gate)  | [models/user.js](../models/user.js)                        |
| Shared-secret env vars             | `.env` → `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`     |

Anything in this map is a candidate for replacement once the npm package exists.
