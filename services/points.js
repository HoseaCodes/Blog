/**
 * The points ledger. This module is the ONLY place that reads or writes
 * `pointsAccount` and `pointsTransaction` — controllers go through it.
 *
 * Before this existed, three controllers (points, store, aiArt) each
 * reimplemented the same atomic debit, the same compensating refund, and the
 * same receipt row. The rule that a balance can never go negative lived in
 * three copy-pasted query predicates. It now lives here, once.
 *
 * Two invariants this module exists to protect:
 *
 *   1. Every balance mutation is a single atomic `$inc`, never read-then-write.
 *      A debit carries `{ balance: { $gte: amount } }` as a precondition, so a
 *      losing racer gets `null` back instead of overdrawing.
 *
 *   2. A failed receipt write never reverses a completed balance movement.
 *      `balance` is the source of truth for spend authorization; the receipt is
 *      an audit artifact. Rolling back money because the audit log failed would
 *      leave two movements and no record of either.
 *
 * See test/integration/points-ledger.test.js for the behaviour these guarantee.
 */
import PointsAccounts from '../models/pointsAccount.js';
import PointsTransactions from '../models/pointsTransaction.js';
import PointsEarnWindows from '../models/pointsEarnWindow.js';
import Logger from '../utils/logger.js';

const logger = new Logger('points-ledger');

export const DEFAULT_MAX_DAILY_EARN = 10000;

function dailyEarnCap() {
  const configured = Number(process.env.POINTS_MAX_DAILY_EARN);
  return Number.isFinite(configured) && configured >= 0
    ? configured
    : DEFAULT_MAX_DAILY_EARN;
}

/** UTC calendar day, 'YYYY-MM-DD'. */
function currentWindow(now = new Date()) {
  return now.toISOString().slice(0, 10);
}

// ---------------------------------------------------------------- reads

export async function getOrCreateAccount(userId) {
  const existing = await PointsAccounts.findOne({ userId });
  if (existing) return existing;
  return PointsAccounts.create({ userId });
}

export async function getAccount(userId) {
  return PointsAccounts.findOne({ userId });
}

/**
 * Look up a single receipt. Used for idempotency checks — e.g. "have we already
 * credited this PayPal order?" — so callers never query the collection directly.
 */
export async function findReceipt(userId, criteria = {}) {
  return PointsTransactions.findOne({ userId, ...criteria });
}

export async function listTransactions(userId, { limit = 50 } = {}) {
  return PointsTransactions.find({ userId })
    .sort({ createdAt: -1 })
    .limit(Math.min(Number(limit) || 50, 200))
    .lean();
}

// ------------------------------------------------------------- receipts

/**
 * Append a receipt. Deliberately never throws: a lost receipt must not reverse
 * a balance change that already happened. Failures are logged for alerting.
 */
export async function recordReceipt(userId, type, amount, balanceAfter, meta = {}) {
  try {
    await PointsTransactions.create({ userId, type, amount, balanceAfter, meta });
    return true;
  } catch (err) {
    logger.error('Failed to write points receipt', {
      userId,
      type,
      amount,
      balanceAfter,
      err: err.message,
    });
    return false;
  }
}

// ----------------------------------------------------------- primitives

/**
 * Atomic debit. Returns the updated account, or `null` when the balance cannot
 * cover `amount` — including when a concurrent debit got there first.
 */
async function debit(userId, amount) {
  return PointsAccounts.findOneAndUpdate(
    { userId, balance: { $gte: amount } },
    { $inc: { balance: -amount, lifetimeSpent: amount } },
    { new: true }
  );
}

/** Undo a debit: restore the balance and unwind the lifetime counter. */
async function undoDebit(userId, amount) {
  return PointsAccounts.findOneAndUpdate(
    { userId },
    { $inc: { balance: amount, lifetimeSpent: -amount } },
    { new: true }
  );
}

// --------------------------------------------------------------- spend

/**
 * Spend points, optionally performing dependent work that must succeed for the
 * charge to stand.
 *
 * `afterDebit(balance)` runs after the balance has moved but before the receipt
 * is written — this is where a caller creates the thing being bought. Whatever
 * object it resolves to is merged into the receipt's `meta`, which is how the
 * store and AI-art flows get `purchaseId` onto the receipt. If it throws, the
 * debit is rolled back and `{ ok: false, reason: 'rolled-back' }` is returned.
 *
 * @returns {Promise<
 *   | { ok: true,  balance: number, meta: object }
 *   | { ok: false, reason: 'insufficient', balance: number, required: number }
 *   | { ok: false, reason: 'rolled-back',  error: Error }
 * >}
 */
export async function spend(userId, amount, { type = 'spend', meta = {}, afterDebit } = {}) {
  await getOrCreateAccount(userId);

  const debited = await debit(userId, amount);
  if (!debited) {
    const current = await getAccount(userId);
    return {
      ok: false,
      reason: 'insufficient',
      balance: current?.balance || 0,
      required: amount,
    };
  }

  let extraMeta = {};
  if (afterDebit) {
    try {
      extraMeta = (await afterDebit(debited.balance)) || {};
    } catch (err) {
      await undoDebit(userId, amount);
      logger.error('Rolled back a points spend', { userId, amount, err: err.message });
      return { ok: false, reason: 'rolled-back', error: err };
    }
  }

  const receiptMeta = { ...meta, ...extraMeta };
  await recordReceipt(userId, type, amount, debited.balance, receiptMeta);

  return { ok: true, balance: debited.balance, meta: receiptMeta };
}

// -------------------------------------------------------------- credit

/**
 * Atomically consume today's earn budget.
 *
 * The precondition `earned: { $lte: cap - amount }` is what makes this safe
 * under concurrency — same shape as the debit's `balance: { $gte: amount }`.
 * When a window document already exists but is too full, the filter misses, the
 * upsert attempts an insert, and the unique index rejects it with E11000. That
 * duplicate-key error IS the over-cap signal, not a failure to handle.
 *
 * @returns {Promise<{ok: true, earnedToday: number, remaining: number}
 *                 | {ok: false, reason: 'daily-cap', cap: number, earnedToday: number}>}
 */
export async function consumeDailyEarnBudget(userId, amount, now = new Date()) {
  const cap = dailyEarnCap();
  const windowStart = currentWindow(now);

  // A single request larger than the whole day's budget can never fit.
  if (amount > cap) {
    const existing = await PointsEarnWindows.findOne({ userId, windowStart });
    return { ok: false, reason: 'daily-cap', cap, earnedToday: existing?.earned || 0 };
  }

  try {
    const updated = await PointsEarnWindows.findOneAndUpdate(
      { userId, windowStart, earned: { $lte: cap - amount } },
      { $inc: { earned: amount }, $setOnInsert: { userId, windowStart } },
      { upsert: true, new: true }
    );
    return { ok: true, earnedToday: updated.earned, remaining: cap - updated.earned };
  } catch (err) {
    if (err?.code === 11000) {
      const existing = await PointsEarnWindows.findOne({ userId, windowStart });
      return { ok: false, reason: 'daily-cap', cap, earnedToday: existing?.earned || 0 };
    }
    throw err;
  }
}

/** Release budget consumed by an earn that did not end up crediting. */
async function refundDailyEarnBudget(userId, amount, now = new Date()) {
  try {
    await PointsEarnWindows.updateOne(
      { userId, windowStart: currentWindow(now) },
      { $inc: { earned: -amount } }
    );
  } catch (err) {
    // Budget accounting must never mask the real failure it is unwinding.
    logger.error('Failed to release earn budget', { userId, amount, err: err.message });
  }
}

/**
 * Credit points earned in play, bounded by the daily budget.
 *
 * @returns {Promise<{ok: true, balance: number, remaining: number}
 *                 | {ok: false, reason: 'daily-cap', cap: number, earnedToday: number}>}
 */
export async function earn(userId, amount, meta = {}) {
  const budget = await consumeDailyEarnBudget(userId, amount);
  if (!budget.ok) return budget;

  try {
    await getOrCreateAccount(userId);
    const updated = await PointsAccounts.findOneAndUpdate(
      { userId },
      { $inc: { balance: amount, lifetimeEarned: amount } },
      { new: true }
    );
    await recordReceipt(userId, 'earn', amount, updated.balance, meta);
    return { ok: true, balance: updated.balance, remaining: budget.remaining };
  } catch (err) {
    // The budget was spent but nothing was credited — give it back, or a failed
    // earn would silently eat the player's allowance for the day.
    await refundDailyEarnBudget(userId, amount);
    throw err;
  }
}

/** Credit a purchased points pack. Tracks `lifetimePurchased` separately. */
export async function purchase(userId, amount, meta = {}) {
  await getOrCreateAccount(userId);
  const updated = await PointsAccounts.findOneAndUpdate(
    { userId },
    {
      $inc: {
        balance: amount,
        lifetimeEarned: amount,
        lifetimePurchased: amount,
      },
    },
    { new: true }
  );
  await recordReceipt(userId, 'purchase', amount, updated.balance, meta);
  return { balance: updated.balance };
}

/**
 * One-shot claim of offline (localStorage) earnings. The `claimedOffline: false`
 * precondition makes this idempotent under concurrent claims — the loser gets
 * `{ ok: false }` rather than a second credit.
 */
export async function claimOffline(userId, amount, meta = {}) {
  await getOrCreateAccount(userId);
  const updated = await PointsAccounts.findOneAndUpdate(
    { userId, claimedOffline: false },
    {
      $inc: { balance: amount, lifetimeEarned: amount },
      $set: { claimedOffline: true, claimedOfflineAmount: amount },
    },
    { new: true }
  );

  if (!updated) {
    const fresh = await getOrCreateAccount(userId);
    return { ok: false, reason: 'already-claimed', balance: fresh.balance };
  }

  await recordReceipt(userId, 'sync', amount, updated.balance, meta);
  return { ok: true, balance: updated.balance };
}
