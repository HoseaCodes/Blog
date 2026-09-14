// Test-side access to arcade-api's Postgres ledger.
//
// The points ledger no longer lives in Mongo, so the integration suite can no
// longer seed a balance with PointsAccounts.create or assert one by reading a
// Mongo collection. These helpers are the faithful equivalent against the
// Postgres that arcade-api serves: seedAccount mirrors the old create (an
// explicit balance with zero lifetime counters), and accountOf / txOf return the
// same shapes the assertions have always read.
//
// The connection string is the same database the arcade-api child process (see
// globalSetup) runs against; globalSetup exposes it as ARCADE_DATABASE_URL.
const { Pool } = require("pg");

let pool;

function getPool() {
  if (!pool) {
    const url = process.env.ARCADE_DATABASE_URL;
    if (!url) {
      throw new Error(
        "ARCADE_DATABASE_URL not set — globalSetup did not start the arcade Postgres"
      );
    }
    pool = new Pool({ connectionString: url, max: 4 });
    // A pg Pool with no 'error' listener rethrows idle-client errors as an
    // unhandled 'error' event, killing the process. Teardown closes the pool
    // (see integrationSetup.cjs) so this should stay quiet; it is here so a
    // teardown race degrades to a log line instead of a red run.
    pool.on("error", (err) => {
      // eslint-disable-next-line no-console
      console.warn(`[integration] arcade ledger pool error: ${err.message}`);
    });
  }
  return pool;
}

// bigint columns arrive from node-postgres as strings; the ledger's values are
// small enough to be exact as JS numbers, and the assertions compare numbers.
const n = (v) => Number(v);

/**
 * Seed an account the way the old test helper did: an explicit balance with
 * zero lifetime counters unless overridden. Used only in tests — production
 * never sets a balance directly, it earns or purchases into one.
 */
async function seedAccount(userId, balance = 0, extra = {}) {
  const {
    lifetimeEarned = 0,
    lifetimeSpent = 0,
    lifetimePurchased = 0,
    claimedOffline = false,
    claimedOfflineAmount = 0,
  } = extra;

  await getPool().query(
    `INSERT INTO accounts
       (user_id, balance, lifetime_earned, lifetime_spent,
        lifetime_purchased, claimed_offline, claimed_offline_amount)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (user_id) DO UPDATE
        SET balance = EXCLUDED.balance,
            lifetime_earned = EXCLUDED.lifetime_earned,
            lifetime_spent = EXCLUDED.lifetime_spent,
            lifetime_purchased = EXCLUDED.lifetime_purchased,
            claimed_offline = EXCLUDED.claimed_offline,
            claimed_offline_amount = EXCLUDED.claimed_offline_amount`,
    [userId, balance, lifetimeEarned, lifetimeSpent, lifetimePurchased, claimedOffline, claimedOfflineAmount]
  );
}

/** The account in the shape the old Mongo `accountOf` returned, or null. */
async function accountOf(userId) {
  const { rows } = await getPool().query(
    `SELECT balance, lifetime_earned, lifetime_spent, lifetime_purchased, claimed_offline
       FROM accounts WHERE user_id = $1`,
    [userId]
  );
  if (!rows[0]) return null;
  const r = rows[0];
  return {
    balance: n(r.balance),
    lifetimeEarned: n(r.lifetime_earned),
    lifetimeSpent: n(r.lifetime_spent),
    lifetimePurchased: n(r.lifetime_purchased),
    claimedOffline: r.claimed_offline,
  };
}

/** Receipts newest-first, shaped like the old Mongo `txOf`. */
async function txOf(userId) {
  const { rows } = await getPool().query(
    `SELECT type, amount, balance_after, meta
       FROM receipts WHERE user_id = $1
      ORDER BY created_at DESC, id DESC`,
    [userId]
  );
  return rows.map((r) => ({
    type: r.type,
    amount: n(r.amount),
    balanceAfter: n(r.balance_after),
    meta: r.meta,
  }));
}

/** Empty every ledger table — the Postgres equivalent of the Mongo wipe. */
async function truncateLedger() {
  await getPool().query(
    "TRUNCATE scores, game_sessions, receipts, holds, earn_windows, guest_earnings, accounts RESTART IDENTITY CASCADE"
  );
}

async function closePool() {
  if (pool) {
    await pool.end();
    pool = undefined;
  }
}

module.exports = { getPool, seedAccount, accountOf, txOf, truncateLedger, closePool };
