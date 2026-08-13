import auth from "./auth.js";

// Soft auth: runs the full auth middleware (Storm-Gate verify + /me enrich +
// blog-user sync) only if an Authorization header is present. Anonymous
// requests pass straight through with req.user undefined.
//
// Use this on public endpoints where the response shape changes for
// authenticated viewers (e.g. articles include per-viewer `liked`/`saved`
// flags) but the endpoint itself must remain accessible without a token.
const optionalAuth = (req, res, next) => {
  const header = req.headers?.authorization || req.header?.("Authorization");
  if (!header) return next();
  return auth(req, res, next);
};

export default optionalAuth;
