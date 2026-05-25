import { createRequireAuth } from "@storm-gate/express";

// Lazy construction: route files import this module before server.js calls
// dotenv.config(), so ACCESS_TOKEN_SECRET isn't defined yet at top-level eval.
let middleware;

const auth = (req, res, next) => {
  if (!middleware) {
    middleware = createRequireAuth({ secret: process.env.ACCESS_TOKEN_SECRET });
  }
  return middleware(req, res, next);
};

export default auth;
