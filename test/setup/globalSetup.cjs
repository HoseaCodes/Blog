// Jest globalSetup: boot ONE real MongoDB container for the whole integration
// run (Testcontainers). Its connection string is exposed via process.env
// (visible to the tests because test:integration runs with --runInBand, i.e.
// in this same process). The container handle is stashed on globalThis so
// globalTeardown can stop it.
//
// Pin the image to match production; bump deliberately, not accidentally.
const { MongoDBContainer } = require("@testcontainers/mongodb");
const { startArcadeService } = require("./arcadeService.cjs");
const { startTestIssuer } = require("./testIssuer.cjs");

const MONGO_IMAGE = "mongo:7.0";

module.exports = async function globalSetup() {
  const started = await new MongoDBContainer(MONGO_IMAGE).start();
  // MongoDBContainer runs a single-node replica set; directConnection avoids
  // the driver trying to discover other members.
  const uri = `${started.getConnectionString()}?directConnection=true`;

  process.env.MONGO_URL = uri;
  globalThis.__MONGO_CONTAINER__ = started;

  // eslint-disable-next-line no-console
  console.log(`\n[integration] MongoDB ready at ${uri}`);

  // A local RS256 issuer so the blog's real (JWKS-only) auth path can be
  // exercised: it points at these keys instead of production Storm-Gate, and the
  // auth helper mints tokens signed with the matching private key.
  const issuer = await startTestIssuer();
  process.env.STORM_GATE_ISSUER = issuer.issuer;
  process.env.STORM_GATE_JWKS_URI = issuer.jwksUri;
  process.env.TEST_JWT_PRIVATE_KEY = issuer.privateKeyPem;
  process.env.TEST_JWT_KID = issuer.kid;
  globalThis.__TEST_ISSUER__ = issuer;

  // eslint-disable-next-line no-console
  console.log(`[integration] RS256 issuer ready at ${issuer.issuer}`);

  // The points ledger now lives in arcade-api (Postgres). Stand up a real one so
  // the ledger tests exercise the actual service through the HTTP facade.
  const arcade = await startArcadeService();
  process.env.ARCADE_API_URL = arcade.url;
  process.env.ARCADE_SERVICE_TOKEN = arcade.serviceToken;
  process.env.ARCADE_DATABASE_URL = arcade.databaseUrl;
  globalThis.__ARCADE_SERVICE__ = arcade;

  // eslint-disable-next-line no-console
  console.log(`[integration] arcade-api ready at ${arcade.url}`);
};
