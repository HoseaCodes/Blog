// Jest globalTeardown: stop the containers and the arcade-api process started
// in globalSetup.
module.exports = async function globalTeardown() {
  const arcade = globalThis.__ARCADE_SERVICE__;
  if (arcade) {
    await arcade.stop();
    // eslint-disable-next-line no-console
    console.log("[integration] arcade-api + Postgres stopped");
  }

  const container = globalThis.__MONGO_CONTAINER__;
  if (container) {
    await container.stop();
    // eslint-disable-next-line no-console
    console.log("[integration] MongoDB container stopped");
  }

  const issuer = globalThis.__TEST_ISSUER__;
  if (issuer) {
    await issuer.stop();
  }
};
