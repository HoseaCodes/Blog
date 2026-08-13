/**
 * Integration-test config: exercises the real Express API through HTTP
 * (supertest) against a real MongoDB (Testcontainers), mocking only outbound
 * third-party HTTP (nock). Kept separate from jest.config.cjs so the existing
 * (jsdom) suite is untouched.
 *
 * Run with: npm run test:integration  (uses --runInBand so the whole run
 * shares one Mongo container / process, which is how MONGO_URL from
 * globalSetup reaches the tests).
 */

/** @type {import('jest').Config} */
module.exports = {
  rootDir: ".",
  testEnvironment: "node",
  testMatch: ["<rootDir>/test/integration/**/*.test.js"],
  transform: {
    "^.+\\.[cm]?jsx?$": "babel-jest",
  },
  transformIgnorePatterns: ["/node_modules/(?!(@storm-gate)/)"],
  setupFiles: ["<rootDir>/test/setup/env.cjs"],
  globalSetup: "<rootDir>/test/setup/globalSetup.cjs",
  globalTeardown: "<rootDir>/test/setup/globalTeardown.cjs",
  setupFilesAfterEnv: ["<rootDir>/test/setup/integrationSetup.cjs"],
  clearMocks: true,
  verbose: true,
  testTimeout: 60000,
};
