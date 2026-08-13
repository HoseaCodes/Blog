// Jest globalTeardown: stop the MongoDB container started in globalSetup.
module.exports = async function globalTeardown() {
  const container = globalThis.__MONGO_CONTAINER__;
  if (container) {
    await container.stop();
    // eslint-disable-next-line no-console
    console.log("[integration] MongoDB container stopped");
  }
};
