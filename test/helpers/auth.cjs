// Auth helpers. The app authenticates with @storm-gate/express, which now
// verifies RS256 JWTs against a JWKS (no shared secret), then enriches req.user
// by calling Storm-Gate's /me over HTTP. globalSetup runs a local RS256 issuer
// and exposes its private key; tests mint matching RS256 tokens and nock that
// /me call, so no real Storm-Gate is required.
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const nock = require("nock");

// Mint an `Authorization: Bearer <jwt>` value the app will accept. Signed with
// the local issuer's private key (RS256) and stamped with its kid and issuer, so
// the JWKS verification path the blog uses in production is what runs here.
function bearerToken({ id, ...claims } = {}) {
  const privateKey = process.env.TEST_JWT_PRIVATE_KEY;
  const kid = process.env.TEST_JWT_KID;
  const issuer = process.env.STORM_GATE_ISSUER;
  if (!privateKey || !kid || !issuer) {
    throw new Error(
      "RS256 test issuer not initialised — globalSetup must set TEST_JWT_PRIVATE_KEY / TEST_JWT_KID / STORM_GATE_ISSUER"
    );
  }

  const payload = {
    id: id || new mongoose.Types.ObjectId().toString(),
    ...claims,
  };
  const token = jwt.sign(payload, privateKey, {
    algorithm: "RS256",
    keyid: kid,
    issuer,
    expiresIn: "1h",
  });
  return `Bearer ${token}`;
}

// Intercept the Storm-Gate /me profile lookup that runs inside `auth`.
// `.persist()` so it survives the per-id result caching + multiple requests;
// integrationSetup's afterEach nock.cleanAll() removes it.
function mockStormGateMe({
  role = 0,
  email = "user@example.com",
  status = "APPROVED",
} = {}) {
  return nock(process.env.STORM_GATE_URL)
    .persist()
    .get("/me")
    .reply(200, { user: { role, email, status } });
}

module.exports = { bearerToken, mockStormGateMe };
