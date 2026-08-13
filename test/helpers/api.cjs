// Bind supertest to the real Express app (imported as a side-effect-free
// module from app.js). babel-jest transpiles the ESM default export, hence
// `.default`.
const request = require("supertest");
const app = require("../../app.js").default;

module.exports = {
  app,
  api: () => request(app),
};
