/**
 * The points ledger facade.
 *
 * The balance no longer lives in Mongo. It lives in Postgres behind the Go
 * `arcade-api` service, which is the system of record for every player's points.
 * This module keeps the exact interface its callers already use — the three
 * controllers (points, store, aiArt) still import it as `* as ledger` and call
 * the same functions with the same arguments and return shapes — but each call
 * is now an authenticated request to arcade-api's `/internal` surface rather than
 * a Mongo write.
 *
 * Why the storage moved: a debit and its receipt could not commit atomically in
 * Mongo, and "a balance may never go negative" was a query predicate copied into
 * three controllers. In Postgres both are guarantees the database enforces. The
 * point of keeping this facade is that none of that leaked into the callers.
 *
 * The seam this module bridges:
 *
 *   - Increases in balance (earn, offline sync, purchased packs) are single
 *     server-to-server calls.
 *   - A spend that must also write Mongo (a store or AI-art purchase) cannot
 *     share a transaction with Postgres, so it runs as a *hold*: debit up front,
 *     let the caller do its Mongo write, then commit — or, if that write throws,
 *     release. A caller that dies mid-flight strands nothing, because the hold
 *     expires and arcade-api's sweeper returns the points. That is strictly safer
 *     than the old spend-then-refund, whose refund could itself be the thing that
 *     failed.
 *
 * Auth: `/internal` is service-authenticated. This module holds the shared
 * service token; a player JWT is never sent here. arcade-api takes an explicit
 * userId on these routes because the blog is acting on a player's behalf, not as
 * that player.
 *
 * See test/integration/points-ledger.test.js — the same characterization suite,
 * now exercising this facade end to end against a real arcade-api.
 */
import Logger from '../utils/logger.js';

const logger = new Logger('points-ledger');

// Kept for callers that reference it; the authoritative cap now lives in
// arcade-api's POINTS_MAX_DAILY_EARN and is echoed back on a 429.
export const DEFAULT_MAX_DAILY_EARN = 10000;

// Read at call time, not import time: the integration harness sets these in
// globalSetup, and capturing them in a module-level const would freeze whatever
// value existed when this module was first required.
function config() {
  return {
    base: (process.env.ARCADE_API_URL || '').replace(/\/$/, ''),
    token: process.env.ARCADE_SERVICE_TOKEN || '',
  };
}

/**
 * One POST to arcade-api's /internal surface. Returns the parsed body alongside
 * the status so callers can branch on the documented codes (402 insufficient,
 * 409 already-claimed, 429 daily-cap) rather than on thrown errors.
 */
async function call(path, body) {
  const { base, token } = config();
  if (!base || !token) {
    // Fail loud and early: a missing config here would otherwise surface as a
    // confusing auth error on the first real spend.
    throw new Error('ARCADE_API_URL and ARCADE_SERVICE_TOKEN must be set');
  }

  let res;
  try {
    res = await fetch(`${base}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
  } catch (err) {
    logger.error('arcade-api request failed', { path, err: err.message });
    throw err;
  }

  let data = {};
  try {
    data = await res.json();
  } catch {
    // A body-less response (or non-JSON) still carries a usable status.
    data = {};
  }
  return { status: res.status, data };
}

// ---------------------------------------------------------------- reads

/**
 * Fetch the account, creating it at zero if absent — arcade-api creates on read,
 * the same getOrCreate the Mongo version performed. Returns the account shape the
 * controllers read: { balance, lifetimeEarned, lifetimeSpent, lifetimePurchased,
 * claimedOffline }.
 */
export async function getOrCreateAccount(userId) {
  const { status, data } = await call('/internal/balance', { userId });
  if (status !== 200) {
    throw new Error(data.msg || `balance lookup failed (${status})`);
  }
  return data;
}

// arcade-api's balance endpoint creates on read, so "get" and "get-or-create"
// are the same call. Callers that used getAccount only read `.balance`.
export const getAccount = getOrCreateAccount;

export async function listTransactions(userId, { limit = 50 } = {}) {
  const capped = Math.min(Number(limit) || 50, 200);
  const { status, data } = await call('/internal/transactions', { userId, limit: capped });
  if (status !== 200) {
    throw new Error(data.msg || `transactions lookup failed (${status})`);
  }
  return data.items;
}

// -------------------------------------------------------------- credit

/**
 * Credit points earned in play, bounded by the daily budget.
 *
 * @returns {Promise<{ok: true, balance: number, remaining: number}
 *                 | {ok: false, reason: 'daily-cap', cap: number, earnedToday: number}>}
 */
export async function earn(userId, amount, meta = {}) {
  const { status, data } = await call('/internal/earn', { userId, amount, meta });
  if (status === 429) {
    return { ok: false, reason: 'daily-cap', cap: data.cap, earnedToday: data.earnedToday };
  }
  if (status !== 200) {
    throw new Error(data.msg || `earn failed (${status})`);
  }
  return { ok: true, balance: data.balance, remaining: data.remaining };
}

/**
 * Credit a purchased points pack after a confirmed payment.
 *
 * `idempotencyKey` (e.g. `paypal:<orderId>`) makes a retried capture safe: a
 * repeat returns success with `applied: false` and the balance unchanged, rather
 * than crediting twice. This closes the read-then-write race the Mongo version
 * had, where two concurrent captures could both miss and both credit.
 *
 * @returns {Promise<{ balance: number, applied: boolean }>}
 */
export async function purchase(userId, amount, meta = {}, idempotencyKey) {
  const { status, data } = await call('/internal/credit', { userId, amount, idempotencyKey, meta });
  if (status !== 200) {
    throw new Error(data.msg || `purchase credit failed (${status})`);
  }
  return { balance: data.balance, applied: data.applied };
}

/**
 * One-shot claim of offline (localStorage) earnings. Idempotent by the account's
 * claimed_offline flag: a second attempt returns { ok: false, reason:
 * 'already-claimed' } rather than crediting again.
 */
export async function claimOffline(userId, amount, meta = {}) {
  const { status, data } = await call('/internal/sync', { userId, amount, meta });
  if (status === 409) {
    return { ok: false, reason: 'already-claimed', balance: data.balance };
  }
  if (status !== 200) {
    throw new Error(data.msg || `offline claim failed (${status})`);
  }
  return { ok: true, balance: data.balance };
}

// --------------------------------------------------------------- spend

/**
 * Spend points, optionally performing dependent work that must succeed for the
 * charge to stand.
 *
 * With no `afterDebit`, this is a single direct debit. With one, it runs as a
 * two-phase hold so the caller's own write (a Mongo purchase row) and the debit
 * are reconciled safely across the service boundary:
 *
 *   1. hold — arcade-api debits immediately and records a hold with a TTL.
 *   2. afterDebit(balance) — the caller creates the thing being bought. Whatever
 *      it resolves to is merged into the receipt's meta (this is how a purchaseId
 *      reaches the receipt). If it throws, the hold is released and the balance
 *      restored.
 *   3. commit — the receipt is written and the spend stands.
 *
 * If this process dies between 1 and 3, the hold expires and arcade-api's sweeper
 * returns the points. No compensating call from a possibly-dead process required.
 *
 * @returns {Promise<
 *   | { ok: true,  balance: number, meta: object }
 *   | { ok: false, reason: 'insufficient', balance: number, required: number }
 *   | { ok: false, reason: 'rolled-back',  error: Error }
 * >}
 */
export async function spend(userId, amount, { type = 'spend', meta = {}, afterDebit } = {}) {
  if (!afterDebit) {
    const { status, data } = await call('/internal/spend', {
      userId,
      amount,
      reason: meta.reason,
      meta,
    });
    if (status === 402) {
      return { ok: false, reason: 'insufficient', balance: data.balance, required: amount };
    }
    if (status !== 200) {
      throw new Error(data.msg || `spend failed (${status})`);
    }
    return { ok: true, balance: data.balance, meta };
  }

  const held = await call('/internal/holds', { userId, amount, meta });
  if (held.status === 402) {
    return { ok: false, reason: 'insufficient', balance: held.data.balance, required: amount };
  }
  if (held.status !== 200) {
    throw new Error(held.data.msg || `hold failed (${held.status})`);
  }
  const holdId = held.data.holdId;

  let extraMeta = {};
  if (afterDebit) {
    try {
      extraMeta = (await afterDebit(held.data.balance)) || {};
    } catch (err) {
      // The caller's own work failed — give the points straight back.
      const released = await call(`/internal/holds/${holdId}/release`, {}).catch((e) => {
        // Even if the release call fails, the hold's TTL guarantees recovery.
        logger.error('hold release failed; TTL will reclaim it', { holdId, err: e.message });
        return null;
      });
      void released;
      logger.error('Rolled back a points spend', { userId, amount, err: err.message });
      return { ok: false, reason: 'rolled-back', error: err };
    }
  }

  const committed = await call(`/internal/holds/${holdId}/commit`, { meta: extraMeta });
  if (committed.status !== 200) {
    // The dependent write succeeded but the commit did not. Do not report a
    // spend that has no receipt: surface it as rolled back. The hold's TTL means
    // the points are not lost — the sweeper returns them.
    logger.error('hold commit failed after dependent write', {
      holdId,
      status: committed.status,
      msg: committed.data.msg,
    });
    return {
      ok: false,
      reason: 'rolled-back',
      error: new Error(committed.data.msg || `hold commit failed (${committed.status})`),
    };
  }

  return { ok: true, balance: committed.data.balance, meta: { ...meta, ...extraMeta } };
}
