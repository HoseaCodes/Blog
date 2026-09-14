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
const {
  seedAccount,
  accountOf,
  txOf,
  truncateLedger,
} = require("../helpers/arcadeLedger.cjs");

const Products = require("../../models/product.js").default;
const ArtPurchases = require("../../models/artPurchase.js").default;

// A signed-in user with a seeded balance.
//
// The balance lives in arcade-api's Postgres now, not Mongo, so this seeds there
// — but the shape of what it does is unchanged: an account at `balance` with
// zero lifetime counters, which is what the assertions below were written
// against. The Mongo userId (an ObjectId string) is still what the JWT carries
// and what arcade-api keys the account on.
async function userWithBalance(balance, extra = {}) {
  const userId = new mongoose.Types.ObjectId().toString();
  await seedAccount(userId, balance, extra);
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

// accountOf / txOf now read the arcade Postgres (see helpers/arcadeLedger.cjs),
// returning the same shapes the assertions have always used.

afterEach(async () => {
  jest.restoreAllMocks();
  // The Mongo wipe in integrationSetup does not touch the arcade ledger; clear
  // it here so each test owns its own balances and receipts.
  await truncateLedger();
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
 * Receipt and atomicity semantics.
 *
 * These cases pinned a Mongo-era wart: the debit and its receipt were two
 * separate writes, so a lost receipt left the balance moved with no audit row.
 * The characterization suite recorded that as "a lost receipt does not reverse
 * the debit."
 *
 * The move to arcade-api's Postgres removes the wart by design: the debit and
 * the receipt commit in one transaction, so the "balance moved, receipt lost"
 * state is unreachable — a failed receipt insert rolls the debit back with it.
 * That behaviour change is a stated goal of the migration, and the destructive
 * proof of it (kill the receipt insert mid-transaction, assert the balance did
 * not move) is asserted directly against Postgres in arcade-api's Go suite
 * (internal/ledger), which is the only place that failure can be injected now
 * that the write lives inside the service.
 *
 * What the blog can still observe through the facade is the positive guarantee
 * that makes a spend safe: it produces exactly one receipt whose balanceAfter
 * equals the resulting balance. The two tests below assert that, replacing the
 * two that pinned the old non-atomic behaviour. The third — a genuinely failed
 * dependent write rolling the debit back — is unchanged, and still passes: under
 * the hold protocol a throwing afterDebit releases the hold.
 */
describe("receipt and atomicity semantics", () => {
  it("a spend and its receipt always agree — one receipt, matching balanceAfter", async () => {
    const { userId, auth } = await userWithBalance(100);

    const res = await api()
      .post("/api/points/spend")
      .set("Authorization", auth)
      .send({ amount: 30, reason: "atomic" });

    expect(res.status).toBe(200);
    expect(res.body.balance).toBe(70);

    const acct = await accountOf(userId);
    const txs = await txOf(userId);

    // Exactly one receipt, and its post-debit balance is the account balance:
    // they moved together, not as two writes that could diverge or be lost
    // independently.
    expect(txs).toHaveLength(1);
    expect(txs[0]).toMatchObject({ type: "spend", amount: 30, balanceAfter: 70 });
    expect(txs[0].balanceAfter).toBe(acct.balance);
  });

  it("a store redeem leaves the charge, the item, and the receipt in agreement", async () => {
    const { userId, auth } = await userWithBalance(500);
    const product = await seedProduct({ priceType: "points", pointsPrice: 120, type: "redeem" });

    const res = await api()
      .post("/api/store/redeem")
      .set("Authorization", auth)
      .send({ productId: product._id.toString() });

    expect(res.status).toBe(200);

    // The item exists...
    const purchase = await ArtPurchases.findOne({ userId, productId: product._id }).lean();
    expect(purchase.paymentStatus).toBe("completed");

    // ...backed by exactly one spend receipt at the charged amount. The hold is
    // committed with its receipt in a single step, so "item without charge" and
    // "charge without receipt" are both unreachable on the happy path.
    const spends = (await txOf(userId)).filter((t) => t.type === "spend");
    expect(spends).toHaveLength(1);
    expect(spends[0]).toMatchObject({ amount: 120, balanceAfter: 380 });
    expect((await accountOf(userId)).balance).toBe(380);
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

/**
 * Daily earn budget.
 *
 * `POST /api/points/earn` takes a client-supplied amount from a browser origin,
 * and Storm-Gate issues guest tokens to anyone unauthenticated — so before this
 * cap existed the wallet was mintable without limit. The per-call cap bounds one
 * request; these bound a day.
 *
 * 429 is deliberate, not 400: the arcade client
 * (Asperia Games/web/public/arcade/play/_lib/points.js) already maps 429 to
 * `daily-cap` and stops retrying, so this needed no client change to ship.
 */
describe("daily earn cap", () => {
  const CAP = 100;
  let previousDaily;
  let previousSingle;

  beforeEach(() => {
    // These set the *controller's* view of the caps for this block. The daily
    // cap is actually enforced in arcade-api (booted at CAP=100 for the run);
    // the single-call cap is enforced in the Express controller, and arcade-api
    // requires single <= daily, so it is pinned to CAP here too — matching
    // production, where both are equal.
    previousDaily = process.env.POINTS_MAX_DAILY_EARN;
    previousSingle = process.env.POINTS_MAX_SINGLE_EARN;
    process.env.POINTS_MAX_DAILY_EARN = String(CAP);
    process.env.POINTS_MAX_SINGLE_EARN = String(CAP);
  });

  afterEach(() => {
    if (previousDaily === undefined) delete process.env.POINTS_MAX_DAILY_EARN;
    else process.env.POINTS_MAX_DAILY_EARN = previousDaily;
    if (previousSingle === undefined) delete process.env.POINTS_MAX_SINGLE_EARN;
    else process.env.POINTS_MAX_SINGLE_EARN = previousSingle;
  });

  const earn = (auth, amount) =>
    api().post("/api/points/earn").set("Authorization", auth).send({ amount, gameId: "pac-man" });

  it("credits under the cap and reports what is left", async () => {
    const { userId, auth } = await userWithBalance(0);

    const res = await earn(auth, 40);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ status: "success", credited: 40, balance: 40, remaining: 60 });
    expect((await accountOf(userId)).balance).toBe(40);
  });

  it("returns 429 once the day's budget is exhausted", async () => {
    const { userId, auth } = await userWithBalance(0);

    await earn(auth, 60);
    await earn(auth, 40); // exactly at the cap
    const over = await earn(auth, 1);

    expect(over.status).toBe(429);
    expect(over.body).toMatchObject({ cap: CAP, earnedToday: CAP });
    expect(over.body.msg).toMatch(/daily earn limit/i);

    // Nothing was credited for the refused call.
    expect((await accountOf(userId)).balance).toBe(100);
    expect((await txOf(userId)).filter((t) => t.type === "earn")).toHaveLength(2);
  });

  it("refuses a single earn larger than the whole daily budget", async () => {
    const { userId, auth } = await userWithBalance(0);

    const res = await earn(auth, CAP + 1);

    // Refused with 400, not 429. arcade-api requires the single-call cap to be
    // <= the daily cap, so an earn exceeding the day necessarily exceeds the
    // per-call ceiling and is rejected as a bad request by the controller before
    // the ledger is touched. In production, where single == daily == 10000, this
    // is exactly what happens to an earn over the limit. (The previous 429 was
    // an artifact of the old in-process config, which allowed single >> daily.)
    expect(res.status).toBe(400);
    expect((await accountOf(userId)).balance).toBe(0);
    expect(await txOf(userId)).toHaveLength(0);
  });

  it("budgets per user — one player exhausting the cap does not block another", async () => {
    const a = await userWithBalance(0);
    await earn(a.auth, CAP);
    expect((await earn(a.auth, 1)).status).toBe(429);

    const b = await userWithBalance(0);
    const res = await earn(b.auth, 50);

    expect(res.status).toBe(200);
    expect((await accountOf(b.userId)).balance).toBe(50);
  });

  /**
   * The precondition `earned: { $lte: cap - amount }` is what keeps this honest.
   * A read-then-write cap would let concurrent requests all observe the same
   * under-limit total and collectively blow past it.
   */
  it("cannot be raced past the cap by concurrent earns", async () => {
    const { userId, auth } = await userWithBalance(0);

    const results = await Promise.all(
      Array.from({ length: 10 }, () => earn(auth, 30))
    );

    const ok = results.filter((r) => r.status === 200);
    const capped = results.filter((r) => r.status === 429);

    expect(ok).toHaveLength(3); // 3 x 30 = 90; a 4th would exceed 100
    expect(capped).toHaveLength(7);

    const acct = await accountOf(userId);
    expect(acct.balance).toBe(90);
    expect(acct.balance).toBeLessThanOrEqual(CAP);
    expect((await txOf(userId)).filter((t) => t.type === "earn")).toHaveLength(3);
  });

  it("does not cap spending — only earning", async () => {
    const { userId, auth } = await userWithBalance(500);

    const res = await api()
      .post("/api/points/spend")
      .set("Authorization", auth)
      .send({ amount: 400, reason: "not-an-earn" });

    expect(res.status).toBe(200);
    expect((await accountOf(userId)).balance).toBe(100);
  });
});
