import axios from "axios";
import { createRequireAuth } from "@storm-gate/express";
import Users from "../models/user.js";

// Storm-Gate is the source of truth for user profile (email, role, status).
// The JWT only carries { id }, so after token verification we fetch the full
// user from Storm-Gate's /me and merge it onto req.user. Downstream controllers
// (and authAdmin.js) read req.user.role instead of doing per-request Mongo
// lookups against the legacy blog Users collection.
const STORM_GATE_URL = process.env.STORM_GATE_URL || "http://localhost:8081";
const ME_CACHE_TTL_MS = 60 * 1000;

let stormGateAuth;
const meCache = new Map(); // id -> { user, expires }

async function fetchStormGateMe(authHeader, id) {
  const cached = meCache.get(id);
  if (cached && cached.expires > Date.now()) return cached.user;

  const res = await axios.get(`${STORM_GATE_URL}/me`, {
    headers: { Authorization: authHeader },
    timeout: 4000,
  });
  const user = res.data?.user || null;
  meCache.set(id, { user, expires: Date.now() + ME_CACHE_TTL_MS });
  return user;
}

// Mirror Storm-Gate users into the blog DB so this app's collections
// (articles, points, etc.) have a Users row to reference. Matches by email
// because the Storm-Gate id won't match any legacy blog _id.
async function syncBlogUser(tok) {
  if (!tok?.email) return;

  await Users.findOneAndUpdate(
    { email: tok.email },
    {
      $setOnInsert: {
        email: tok.email,
        name: tok.name || tok.email,
        password: "storm-gate-managed",
        status: tok.status || "APPROVED",
        role: tok.role ?? 0,
      },
    },
    { upsert: true, setDefaultsOnInsert: true }
  );
}

const auth = (req, res, next) => {
  if (!stormGateAuth) {
    stormGateAuth = createRequireAuth({ secret: process.env.ACCESS_TOKEN_SECRET });
  }
  stormGateAuth(req, res, async (err) => {
    if (err) return next(err);

    // Enrich req.user with Storm-Gate's profile (role/email/status). Failures
    // here don't block the request — the user is still authenticated; admin
    // checks will just fail safely because req.user.role stays undefined.
    try {
      const profile = await fetchStormGateMe(req.headers.authorization, req.user.id);
      if (profile) req.user = { ...req.user, ...profile };
    } catch (e) {
      console.error("[auth] Storm-Gate /me lookup failed:", e.message);
    }

    syncBlogUser(req.user)
      .catch((e) => console.error("[syncBlogUser]", e.message))
      .finally(() => next());
  });
};

export default auth;
