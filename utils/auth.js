import { createRequireAuth } from "@storm-gate/express";
import Users from "../models/user.js";

// Lazy construction: route files import this module before server.js calls
// dotenv.config(), so ACCESS_TOKEN_SECRET isn't defined yet at top-level eval.
let stormGateAuth;

// Mirror Storm-Gate users into the blog DB so this app's collections
// (articles, points, etc.) have a Users row to reference. Matches by email
// to bridge legacy blog users that predate Storm-Gate. Storm-Gate only issues
// tokens to APPROVED users, so any token reaching here corresponds to an
// approved account — newly synced rows get status: 'APPROVED'.
async function syncBlogUser(req) {
  const tok = req.user;
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
  stormGateAuth(req, res, (err) => {
    if (err) return next(err);
    syncBlogUser(req)
      .catch((e) => console.error("[syncBlogUser]", e.message))
      .finally(() => next());
  });
};

export default auth;
