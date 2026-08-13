// Auth helpers. The app authenticates with @storm-gate/express, which verifies
// an HS256 JWT (payload `{ id }`) signed with ACCESS_TOKEN_SECRET, then enriches
// req.user by calling Storm-Gate's /me over HTTP. Tests mint matching tokens and
// nock that /me call so no real Storm-Gate is required.
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const nock = require("nock");

// Mint an `Authorization: Bearer <jwt>` value the app will accept.
function bearerToken({ id, ...claims } = {}) {
  const payload = {
    id: id || new mongoose.Types.ObjectId().toString(),
    ...claims,
  };
  const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    algorithm: "HS256",
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
