// Test-data factories. Each call returns a fresh, unique, valid payload so
// tests never share mutable state or collide on unique indexes. Pass overrides
// to exercise specific cases.
const mongoose = require("mongoose");

let seq = 0;
const uniq = () => `${Date.now()}-${(seq += 1)}`;

function buildArticle(overrides = {}) {
  const stamp = uniq();
  return {
    article_id: `art-${stamp}`,
    title: `Test Article ${stamp}`, // unique → unique slug
    subtitle: "An integration-test subtitle",
    markdown: "# Heading\n\nBody paragraph.",
    description: "An integration-test description.",
    categories: ["Engineering"],
    postedBy: new mongoose.Types.ObjectId().toString(),
    images: { url: "https://example.com/cover.png" },
    ...overrides,
  };
}

function buildSubscriber(overrides = {}) {
  return {
    email: `sub-${uniq()}@example.com`,
    source: "integration-test",
    ...overrides,
  };
}

module.exports = { buildArticle, buildSubscriber, uniq };
