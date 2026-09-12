/**
 * Characterization tests for the points ledger.
 *
 * These pin CURRENT behaviour, not desired behaviour. The ledger
 * (`pointsAccount` + `pointsTransaction`) has three independent writers —
 * controllers/points.js, controllers/store.js, controllers/aiArt.js — each of
 * which reimplements the same atomic debit. Before that logic is consolidated
 * behind a single module (or moved to another service), these tests record
 * exactly what the three do today, INCLUDING where they disagree.
 *
 * If a refactor changes any assertion here, that is a behaviour change and
 * needs a deliberate decision — not a test edit.
 */
const mongoose = require("mongoose");
const { api } = require("../helpers/api.cjs");
const { bearerToken, mockStormGateMe } = require("../helpers/auth.cjs");
const { uniq } = require("../helpers/factories.cjs");

const PointsAccounts = require("../../models/pointsAccount.js").default;
const PointsTransactions = require("../../models/pointsTransaction.js").default;
const Products = require("../../models/product.js").default;
const ArtPurchases = require("../../models/artPurchase.js").default;

// A signed-in user with a seeded balance.
async function userWithBalance(balance, extra = {}) {
  const userId = new mongoose.Types.ObjectId().toString();
  await PointsAccounts.create({ userId, balance, ...extra });
  mockStormGateMe();
  return { userId, auth: bearerToken({ id: userId }) };
}

async function seedProduct(overrides = {}) {
  const stamp = uniq();
  return Products.create({
    product_id: `prod-${stamp}`,
    title: `Product ${stamp}`,
    description: "integration-test product",
    content: "integration-test content",
    images: { url: "https://example.com/p.png" },
    category: "test",
    ...overrides,
  });
}

const accountOf = (userId) => PointsAccounts.findOne({ userId }).lean();
const txOf = (userId) => PointsTransactions.find({ userId }).lean();

afterEach(() => {
  jest.restoreAllMocks();
});

describe("points.js — earn and spend", () => {
  it("earn credits balance and lifetimeEarned, and logs an `earn` row", async () => {
    const { userId, auth } = await userWithBalance(100);

    const res = await api()
      .post("/api/points/earn")
      .set("Authorization", auth)
      .send({ amount: 40, gameId: "pacman", gameName: "Pacman" });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ status: "success", credited: 40, balance: 140 });

    const acct = await accountOf(userId);
    expect(acct.balance).toBe(140);
    expect(acct.lifetimeEarned).toBe(40);
    expect(acct.lifetimeSpent).toBe(0);

    const [tx] = await txOf(userId);
    expect(tx).toMatchObject({ type: "earn", amount: 40, balanceAfter: 140 });
    expect(tx.meta).toMatchObject({ gameId: "pacman", gameName: "Pacman" });
  });

  it("spend debits balance and lifetimeSpent, and logs a `spend` row", async () => {
    const { userId, auth } = await userWithBalance(100);

    const res = await api()
      .post("/api/points/spend")
      .set("Authorization", auth)
      .send({ amount: 30, reason: "unit-test" });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ status: "success", spent: 30, balance: 70 });

    const acct = await accountOf(userId);
    expect(acct.balance).toBe(70);
    expect(acct.lifetimeSpent).toBe(30);

    const [tx] = await txOf(userId);
    expect(tx).toMatchObject({ type: "spend", amount: 30, balanceAfter: 70 });
  });

  it("refuses to overdraw and leaves the ledger untouched", async () => {
    const { userId, auth } = await userWithBalance(10);

    const res = await api()
      .post("/api/points/spend")
      .set("Authorization", auth)
      .send({ amount: 50, reason: "too-much" });

    expect(res.status).toBe(402);
    expect(res.body).toMatchObject({ msg: "Insufficient points", balance: 10, required: 50 });

    const acct = await accountOf(userId);
    expect(acct.balance).toBe(10);
    expect(acct.lifetimeSpent).toBe(0);
    expect(await txOf(userId)).toHaveLength(0);
  });

  it.each([
    ["zero", 0],
    ["negative", -5],
    ["non-numeric", "abc"],
  ])("rejects a %s spend amount with 400", async (_label, amount) => {
    const { userId, auth } = await userWithBalance(100);

    const res = await api()
      .post("/api/points/spend")
      .set("Authorization", auth)
      .send({ amount, reason: "bad-input" });

    expect(res.status).toBe(400);
    expect((await accountOf(userId)).balance).toBe(100);
  });

  it("requires a reason on spend", async () => {
    const { userId, auth } = await userWithBalance(100);
    const res = await api()
      .post("/api/points/spend")
      .set("Authorization", auth)
      .send({ amount: 10 });

    expect(res.status).toBe(400);
    expect((await accountOf(userId)).balance).toBe(100);
  });

  it("caps a single earn to POINTS_MAX_SINGLE_EARN", async () => {
    const { userId, auth } = await userWithBalance(0);
    const cap = Number(process.env.POINTS_MAX_SINGLE_EARN || 10000);

    const res = await api()
      .post("/api/points/earn")
      .set("Authorization", auth)
      .send({ amount: cap + 1, gameId: "cheat" });

    expect(res.status).toBe(400);
    expect((await accountOf(userId)).balance).toBe(0);
  });
});

/**
 * The invariant that makes the ledger safe lives in the query predicate:
 *
 *   { userId, balance: { $gte: cost } }
 *
 * Mongo will not match the document if the balance moved underneath us, so a
 * losing racer gets `null` back rather than a negative balance. A refactor that
 * turns this into read-then-check-then-write reintroduces double-spend, and
 * this is the test that catches it.
 */
describe("atomicity — concurrent spends cannot overdraw", () => {
  it("allows exactly floor(balance / cost) of 10 simultaneous spends", async () => {
    const { userId, auth } = await userWithBalance(100);

    const results = await Promise.all(
      Array.from({ length: 10 }, () =>
        api()
          .post("/api/points/spend")
          .set("Authorization", auth)
          .send({ amount: 30, reason: "race" })
      )
    );

    const ok = results.filter((r) => r.status === 200);
    const refused = results.filter((r) => r.status === 402);

    expect(ok).toHaveLength(3); // 3 x 30 = 90, the 4th cannot be covered
    expect(refused).toHaveLength(7);

    const acct = await accountOf(userId);
    expect(acct.balance).toBe(10);
    expect(acct.balance).toBeGreaterThanOrEqual(0);
    expect(acct.lifetimeSpent).toBe(90);

    const spends = (await txOf(userId)).filter((t) => t.type === "spend");
    expect(spends).toHaveLength(3);
    // Every receipt records a distinct, non-negative post-debit balance.
    expect(spends.map((t) => t.balanceAfter).sort((a, b) => a - b)).toEqual([10, 40, 70]);
  });
});

describe("store.js — redeem", () => {
  it("debits, creates the purchase, and tags the receipt `store-redeem`", async () => {
    const { userId, auth } = await userWithBalance(500);
    const product = await seedProduct({ priceType: "points", pointsPrice: 120, type: "redeem" });

    const res = await api()
      .post("/api/store/redeem")
      .set("Authorization", auth)
      .send({ productId: product._id.toString() });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ status: "success", balance: 380 });

    const acct = await accountOf(userId);
    expect(acct.balance).toBe(380);
    expect(acct.lifetimeSpent).toBe(120);

    const [tx] = await txOf(userId);
    expect(tx).toMatchObject({ type: "spend", amount: 120, balanceAfter: 380 });
    expect(tx.meta.reason).toBe("store-redeem");

    const purchase = await ArtPurchases.findOne({ userId, productId: product._id }).lean();
    expect(purchase).toMatchObject({ paymentProvider: "points", paymentStatus: "completed", amountPaid: 0 });
  });

  it("refuses an unaffordable redeem without touching the ledger", async () => {
    const { userId, auth } = await userWithBalance(50);
    const product = await seedProduct({ priceType: "points", pointsPrice: 120, type: "redeem" });

    const res = await api()
      .post("/api/store/redeem")
      .set("Authorization", auth)
      .send({ productId: product._id.toString() });

    expect(res.status).toBe(402);
    expect(res.body).toMatchObject({ balance: 50, required: 120 });
    expect((await accountOf(userId)).balance).toBe(50);
    expect(await txOf(userId)).toHaveLength(0);
  });

  it("refuses a second redeem of the same item with 409 and no debit", async () => {
    const { userId, auth } = await userWithBalance(500);
    const product = await seedProduct({ priceType: "points", pointsPrice: 120, type: "redeem" });
    const body = { productId: product._id.toString() };

    await api().post("/api/store/redeem").set("Authorization", auth).send(body);
    const second = await api().post("/api/store/redeem").set("Authorization", auth).send(body);

    expect(second.status).toBe(409);
    expect((await accountOf(userId)).balance).toBe(380); // charged exactly once
    expect((await txOf(userId)).filter((t) => t.type === "spend")).toHaveLength(1);
  });

  it("rejects a product that is not points-priced", async () => {
    const { userId, auth } = await userWithBalance(500);
    const product = await seedProduct({ priceType: "dollars", price: 9.99 });

    const res = await api()
      .post("/api/store/redeem")
      .set("Authorization", auth)
      .send({ productId: product._id.toString() });

    expect(res.status).toBe(400);
    expect((await accountOf(userId)).balance).toBe(500);
  });
});

describe("aiArt.js — purchase-with-points", () => {
  it("debits and tags the receipt `ai-art-purchase`", async () => {
    const { priceInPoints } = require("../../controllers/aiArt.js");
    const { userId, auth } = await userWithBalance(5000);
    const product = await seedProduct({ type: "ai-art", price: 2, priceType: "dollars" });
    const cost = priceInPoints(2);

    const res = await api()
      .post("/api/ai-art/purchase-with-points")
      .set("Authorization", auth)
      .send({ productId: product._id.toString() });

    expect(res.status).toBe(200);
    expect(res.body.balance).toBe(5000 - cost);

    const [tx] = await txOf(userId);
    expect(tx).toMatchObject({ type: "spend", amount: cost, balanceAfter: 5000 - cost });
    expect(tx.meta.reason).toBe("ai-art-purchase");
  });
});

/**
 * Receipt and rollback semantics.
 *
 * These three cases USED to disagree between the writers. On 2026-09-12 they
 * were converged on points.js's answer when the ledger was extracted into
 * services/points.js: a failed receipt write never reverses a balance movement
 * that already happened. `balance` is the source of truth for spend
 * authorization; the receipt is an audit artifact. Rolling money back because
 * the audit log failed would leave two movements and no record of either.
 *
 * A genuine failure of the dependent work (creating the purchase) still rolls
 * the debit back — that part was always correct and is unchanged.
 */
describe("receipt and rollback semantics", () => {
  it("points.js treats a failed transaction-log write as NON-fatal: the debit stands", async () => {
    const { userId, auth } = await userWithBalance(100);
    jest.spyOn(PointsTransactions, "create").mockRejectedValue(new Error("tx log down"));

    const res = await api()
      .post("/api/points/spend")
      .set("Authorization", auth)
      .send({ amount: 30, reason: "log-fails" });

    expect(res.status).toBe(200);
    // Money moved, receipt lost — logTx swallows the error by design.
    expect((await accountOf(userId)).balance).toBe(70);
  });

  it("store.js now matches points.js: a lost receipt does not reverse the redeem", async () => {
    const { userId, auth } = await userWithBalance(500);
    const product = await seedProduct({ priceType: "points", pointsPrice: 120, type: "redeem" });
    jest.spyOn(PointsTransactions, "create").mockRejectedValue(new Error("tx log down"));

    const res = await api()
      .post("/api/store/redeem")
      .set("Authorization", auth)
      .send({ productId: product._id.toString() });

    // Before 2026-09-12 this returned 500 and refunded the points while LEAVING
    // the purchase row completed — the user kept the item for free. Converging
    // on the non-fatal receipt rule removed that hole: the charge and the item
    // now always agree, and only the receipt is lost.
    expect(res.status).toBe(200);

    const acct = await accountOf(userId);
    expect(acct.balance).toBe(380); // charged
    expect(acct.lifetimeSpent).toBe(120);

    const purchase = await ArtPurchases.findOne({ userId, productId: product._id }).lean();
    expect(purchase.paymentStatus).toBe("completed"); // and owns it

    expect(await txOf(userId)).toHaveLength(0); // receipt is the only casualty
  });

  it("a genuinely failed purchase still rolls the debit back, leaving no audit trail", async () => {
    const { userId, auth } = await userWithBalance(500);
    const product = await seedProduct({ priceType: "points", pointsPrice: 120, type: "redeem" });
    jest.spyOn(ArtPurchases, "findOneAndUpdate").mockRejectedValue(new Error("purchase write failed"));

    const res = await api()
      .post("/api/store/redeem")
      .set("Authorization", auth)
      .send({ productId: product._id.toString() });

    expect(res.status).toBe(500);
    expect((await accountOf(userId)).balance).toBe(500);

    // The balance is correct, but nothing records that it moved and came back.
    expect(await txOf(userId)).toHaveLength(0);
  });
});
