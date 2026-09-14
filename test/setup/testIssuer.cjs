// A local RS256 token issuer for the integration run.
//
// Production Storm-Gate signs RS256 and publishes a JWKS; the blog's auth
// verifies against it with no shared secret (commit af18915). To exercise that
// real code path in tests, this stands up a tiny issuer: an RSA keypair, an
// HTTP endpoint serving the public half as a JWKS, and the private half exposed
// (via env) so the auth helper can mint tokens the blog will accept.
//
// globalSetup points STORM_GATE_ISSUER / STORM_GATE_JWKS_URI at this server, so
// createRequireAuth fetches these keys instead of production's.
const http = require("http");
const crypto = require("crypto");

const KID = "integration-test-key";

async function startTestIssuer() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
  });

  const jwk = publicKey.export({ format: "jwk" });
  const jwks = {
    keys: [{ ...jwk, kid: KID, alg: "RS256", use: "sig" }],
  };
  const privateKeyPem = privateKey.export({ type: "pkcs8", format: "pem" });

  const server = http.createServer((req, res) => {
    if (req.method === "GET" && req.url === "/.well-known/jwks.json") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(jwks));
      return;
    }
    res.writeHead(404);
    res.end();
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  const issuer = `http://127.0.0.1:${port}`;

  return {
    issuer,
    jwksUri: `${issuer}/.well-known/jwks.json`,
    kid: KID,
    privateKeyPem: String(privateKeyPem),
    async stop() {
      await new Promise((resolve) => server.close(resolve));
    },
  };
}

module.exports = { startTestIssuer, KID };
