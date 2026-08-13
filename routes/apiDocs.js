// Swagger UI for the OpenAPI spec, served at /api-docs on the same origin as
// the API itself.
//
// Gating: open in development, HTTP Basic in production. It has to be Basic
// rather than the usual `auth` middleware because this is a page a browser
// navigates to — a plain navigation carries no `Authorization: Bearer` header,
// so utils/auth.js would 401 before the UI ever rendered. Basic is the only
// scheme browsers will negotiate on their own.
//
// The spec is read lazily on first request, not at import time: app.js is
// contractually side-effect-free on import (see its header comment) so tests
// can import it without a build/ folder — or, here, without the spec file.
import express from "express";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { load } from "js-yaml";
import swaggerUi from "swagger-ui-express";

const router = express.Router();

// Same `path.resolve()` root-of-project idiom as server.js:26 — deliberately
// NOT import.meta.url, which jest cannot parse: it transpiles this module to
// CJS, where import.meta is a syntax error, and every integration test that
// imports app.js dies on it. Resolves to the repo root locally and to /app in
// the container (Dockerfile WORKDIR). Override with OPENAPI_SPEC_PATH if the
// spec ever moves.
const SPEC_PATH =
  process.env.OPENAPI_SPEC_PATH || path.join(path.resolve(), "api", "openapi.yaml");

let cachedSpec;

const getSpec = () => {
  if (!cachedSpec) {
    cachedSpec = load(fs.readFileSync(SPEC_PATH, "utf8"));
  }
  return cachedSpec;
};

// Hash both sides first so timingSafeEqual gets equal-length buffers — it
// throws on a length mismatch, and the throw itself would leak credential
// length to an attacker probing the endpoint.
const safeEqual = (a, b) => {
  const ha = crypto.createHash("sha256").update(String(a)).digest();
  const hb = crypto.createHash("sha256").update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
};

const challenge = (res) =>
  res
    .set("WWW-Authenticate", 'Basic realm="API docs", charset="UTF-8"')
    .status(401)
    .send("Authentication required");

const docsAuth = (req, res, next) => {
  if (process.env.NODE_ENV !== "production") return next();

  const expectedUser = process.env.SWAGGER_DOCS_USER;
  const expectedPass = process.env.SWAGGER_DOCS_PASS;

  // Fail closed. Missing credentials in production must not degrade to an
  // open docs page; 404 so the endpoint's existence isn't advertised either.
  if (!expectedUser || !expectedPass) return res.status(404).end();

  const [scheme, encoded] = (req.headers.authorization || "").split(" ");
  if (scheme !== "Basic" || !encoded) return challenge(res);

  const decoded = Buffer.from(encoded, "base64").toString("utf8");
  const sep = decoded.indexOf(":");
  if (sep === -1) return challenge(res);

  // Split on the FIRST colon only — colons are legal inside a password.
  const user = decoded.slice(0, sep);
  const pass = decoded.slice(sep + 1);

  // Compare both before AND-ing so a wrong username and a wrong password cost
  // the same time.
  const userOk = safeEqual(user, expectedUser);
  const passOk = safeEqual(pass, expectedPass);
  if (userOk && passOk) return next();

  return challenge(res);
};

router.use(
  "/api-docs",
  docsAuth,
  swaggerUi.serve,
  (req, res, next) => {
    let spec;
    try {
      spec = getSpec();
    } catch (e) {
      console.error("[api-docs] failed to load OpenAPI spec:", e.message);
      return next(e);
    }
    return swaggerUi.setup(spec, { customSiteTitle: "Hoseacodes API docs" })(req, res, next);
  }
);

export default router;
