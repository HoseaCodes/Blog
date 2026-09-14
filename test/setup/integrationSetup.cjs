// Per-suite integration harness (setupFilesAfterEnv):
//  - connect Mongoose to the Testcontainers Mongo (real DB per the guide),
//  - wipe collections BETWEEN tests so every test owns its own data,
//  - block all real outbound HTTP (only localhost, for supertest, is allowed)
//    so tests can never hit a real third party; suites nock what they need.
const mongoose = require("mongoose");
const nock = require("nock");
const { closePool } = require("../helpers/arcadeLedger.cjs");

beforeAll(async () => {
  if (!process.env.MONGO_URL) {
    throw new Error(
      "MONGO_URL not set — globalSetup did not start the Mongo container"
    );
  }
  mongoose.set("strictQuery", false);
  await mongoose.connect(process.env.MONGO_URL);

  // Any outbound HTTP that isn't explicitly nocked should fail loudly rather
  // than silently reach the internet. localhost stays open for supertest's
  // in-process server.
  nock.disableNetConnect();
  nock.enableNetConnect("127.0.0.1");
});

afterEach(async () => {
  // Data isolation: clear every collection after each test.
  const { collections } = mongoose.connection;
  await Promise.all(
    Object.values(collections).map((c) => c.deleteMany({}))
  );
  // Assert no test leaves stray interceptors; then reset.
  nock.cleanAll();
});

afterAll(async () => {
  nock.enableNetConnect();
  nock.restore();
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  // Release the arcade ledger pool here, not in globalTeardown: the pool is
  // created inside the test module registry, so globalTeardown would only see a
  // fresh (empty) copy of the helper. Leaving it open means globalTeardown
  // stops Postgres underneath live connections, and pg raises 57P01 on an idle
  // client — which crashes the run with exit 1 *after* every test has passed.
  await closePool();
});
