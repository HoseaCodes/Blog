// Jest globalSetup: boot ONE real MongoDB container for the whole integration
// run (Testcontainers). Its connection string is exposed via process.env
// (visible to the tests because test:integration runs with --runInBand, i.e.
// in this same process). The container handle is stashed on globalThis so
// globalTeardown can stop it.
//
// Pin the image to match production; bump deliberately, not accidentally.
const { MongoDBContainer } = require("@testcontainers/mongodb");

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
};
