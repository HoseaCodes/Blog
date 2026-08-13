import dotenv from 'dotenv';
import PointsAccounts from '../models/pointsAccount.js';
import PointsTransactions from '../models/pointsTransaction.js';
import Logger from '../utils/logger.js';
import {
  createOrder as paypalCreateOrder,
  captureOrder as paypalCaptureOrder,
} from '../utils/paypalClient.js';

dotenv.config();
const logger = new Logger('points');

// --- Point packs (matches Phase 1 design: $5 → 500 base, bonus for bigger packs)
export const POINT_PACKS = [
  { id: 'pack-500',  label: 'Starter',  usd: 5,  points: 500,  bonus: 0 },
  { id: 'pack-1100', label: 'Pro',      usd: 10, points: 1100, bonus: 100 },
  { id: 'pack-3000', label: 'Elite',    usd: 25, points: 3000, bonus: 500 },
];

function findPack(packId) {
  return POINT_PACKS.find((p) => p.id === packId) || null;
}

async function getOrCreateAccount(userId) {
  let account = await PointsAccounts.findOne({ userId });
  if (!account) {
    account = await PointsAccounts.create({ userId });
  }
  return account;
}

async function logTx(userId, type, amount, balanceAfter, meta = {}) {
  try {
    await PointsTransactions.create({ userId, type, amount, balanceAfter, meta });
  } catch (err) {
    // Logging failures must not break the user-visible mutation.
    logger.error('Failed to write transaction log', { userId, type, amount, err: err.message });
  }
}

export async function getBalance(req, res) {
  try {
    const account = await getOrCreateAccount(req.user.id);
    res.json({
      status: 'success',
      balance: account.balance,
      lifetimeEarned: account.lifetimeEarned,
      lifetimeSpent: account.lifetimeSpent,
      lifetimePurchased: account.lifetimePurchased,
      claimedOffline: account.claimedOffline,
    });
  } catch (err) {
    logger.error('getBalance failed', { message: err.message });
    res.status(500).json({ msg: err.message });
  }
}

// Idempotent claim of localStorage offline earnings. Once claimed, the
// account flag prevents re-claiming on subsequent logins.
export async function syncOfflinePoints(req, res) {
  try {
    const { amount } = req.body || {};
    const safe = Math.floor(Number(amount));
    if (!Number.isFinite(safe) || safe <= 0) {
      return res.status(400).json({ msg: 'amount must be a positive integer' });
    }
    // Cap how much can be claimed at once to prevent a malicious client
    // from minting absurd balances via a forged localStorage payload.
    const MAX_OFFLINE_CLAIM = Number(process.env.POINTS_MAX_OFFLINE_CLAIM || 50000);
    if (safe > MAX_OFFLINE_CLAIM) {
      return res.status(400).json({ msg: `Offline claim exceeds limit of ${MAX_OFFLINE_CLAIM}` });
    }

    const account = await getOrCreateAccount(req.user.id);
    if (account.claimedOffline) {
      return res.status(409).json({
        msg: 'Offline points already claimed for this account',
        balance: account.balance,
      });
    }

    const updated = await PointsAccounts.findOneAndUpdate(
      { userId: req.user.id, claimedOffline: false },
      {
        $inc: { balance: safe, lifetimeEarned: safe },
        $set: { claimedOffline: true, claimedOfflineAmount: safe },
      },
      { new: true }
    );

    if (!updated) {
      // Lost the race — another request claimed first.
      const fresh = await getOrCreateAccount(req.user.id);
      return res.status(409).json({ msg: 'Offline points already claimed', balance: fresh.balance });
    }

    await logTx(req.user.id, 'sync', safe, updated.balance, { source: 'localStorage' });

    res.json({ status: 'success', credited: safe, balance: updated.balance });
  } catch (err) {
    logger.error('syncOfflinePoints failed', { message: err.message });
    res.status(500).json({ msg: err.message });
  }
}

// Server-authoritative spend. Use $inc with a balance precondition so two
// concurrent spends can't both succeed against a balance that only covers one.
export async function spendPoints(req, res) {
  try {
    const { amount, reason, meta = {} } = req.body || {};
    const safe = Math.floor(Number(amount));
    if (!Number.isFinite(safe) || safe <= 0) {
      return res.status(400).json({ msg: 'amount must be a positive integer' });
    }
    if (!reason || typeof reason !== 'string') {
      return res.status(400).json({ msg: 'reason required' });
    }

    await getOrCreateAccount(req.user.id);

    const updated = await PointsAccounts.findOneAndUpdate(
      { userId: req.user.id, balance: { $gte: safe } },
      { $inc: { balance: -safe, lifetimeSpent: safe } },
      { new: true }
    );

    if (!updated) {
      const current = await PointsAccounts.findOne({ userId: req.user.id });
      return res.status(402).json({
        msg: 'Insufficient points',
        balance: current?.balance || 0,
        required: safe,
      });
    }

    await logTx(req.user.id, 'spend', safe, updated.balance, { reason, ...meta });

    res.json({ status: 'success', spent: safe, balance: updated.balance });
  } catch (err) {
    logger.error('spendPoints failed', { message: err.message });
    res.status(500).json({ msg: err.message });
  }
}

// Trusted server-side earning. Called from the game framework (later) or
// admin tools. Frontend cannot call this directly with arbitrary amounts —
// gameplay credits go through the spend-side path's mirror (Phase 3 may
// add server-side verified earn for anti-cheat).
export async function creditEarnedPoints(req, res) {
  try {
    const { amount, gameId, gameName } = req.body || {};
    const safe = Math.floor(Number(amount));
    if (!Number.isFinite(safe) || safe <= 0) {
      return res.status(400).json({ msg: 'amount must be a positive integer' });
    }
    // Soft per-call cap to make casual abuse expensive without limiting
    // legitimate play (a single Pacman board is ~244 pellets).
    const MAX_SINGLE_EARN = Number(process.env.POINTS_MAX_SINGLE_EARN || 10000);
    if (safe > MAX_SINGLE_EARN) {
      return res.status(400).json({ msg: `Single-game earn exceeds limit of ${MAX_SINGLE_EARN}` });
    }

    await getOrCreateAccount(req.user.id);

    const updated = await PointsAccounts.findOneAndUpdate(
      { userId: req.user.id },
      { $inc: { balance: safe, lifetimeEarned: safe } },
      { new: true }
    );

    await logTx(req.user.id, 'earn', safe, updated.balance, { gameId, gameName });

    res.json({ status: 'success', credited: safe, balance: updated.balance });
  } catch (err) {
    logger.error('creditEarnedPoints failed', { message: err.message });
    res.status(500).json({ msg: err.message });
  }
}

export async function getPackOptions(req, res) {
  res.json({ status: 'success', packs: POINT_PACKS });
}

// Create a PayPal order for a points pack. The order is bound to userId +
// packId so capture can credit the right amount even if the client lies.
export async function createPointPackOrder(req, res) {
  try {
    const { packId } = req.body || {};
    const pack = findPack(packId);
    if (!pack) return res.status(400).json({ msg: 'Unknown pack' });

    const order = await paypalCreateOrder({
      amount: pack.usd,
      currency: 'USD',
      referenceId: `points:${req.user.id}:${pack.id}`,
      description: `Points pack: ${pack.label} (${pack.points} pts)`,
    });

    // Log the intent so we can correlate during capture. balanceAfter is the
    // current balance; nothing has moved yet.
    const account = await getOrCreateAccount(req.user.id);
    await logTx(req.user.id, 'purchase', pack.points, account.balance, {
      stage: 'order-created',
      packId: pack.id,
      paypalOrderId: order.id,
      usd: pack.usd,
    });

    res.json({ status: 'success', orderId: order.id, pack });
  } catch (err) {
    logger.error('createPointPackOrder failed', {
      message: err.message,
      response: err.response?.data,
    });
    res.status(500).json({ msg: err.response?.data?.message || err.message });
  }
}

export async function capturePointPackOrder(req, res) {
  try {
    const { orderId, packId } = req.body || {};
    const pack = findPack(packId);
    if (!pack) return res.status(400).json({ msg: 'Unknown pack' });
    if (!orderId) return res.status(400).json({ msg: 'orderId required' });

    // Idempotency: if we already captured this PayPal order, return cached result.
    const already = await PointsTransactions.findOne({
      userId: req.user.id,
      type: 'purchase',
      'meta.paypalOrderId': orderId,
      'meta.stage': 'captured',
    });
    if (already) {
      const account = await PointsAccounts.findOne({ userId: req.user.id });
      return res.json({
        status: 'success',
        alreadyCaptured: true,
        credited: already.amount,
        balance: account?.balance || 0,
      });
    }

    const capture = await paypalCaptureOrder(orderId);
    if (capture.status !== 'COMPLETED') {
      return res.status(402).json({ msg: `PayPal capture status: ${capture.status}` });
    }

    await getOrCreateAccount(req.user.id);
    const updated = await PointsAccounts.findOneAndUpdate(
      { userId: req.user.id },
      { $inc: { balance: pack.points, lifetimeEarned: pack.points, lifetimePurchased: pack.points } },
      { new: true }
    );

    await logTx(req.user.id, 'purchase', pack.points, updated.balance, {
      stage: 'captured',
      packId: pack.id,
      paypalOrderId: orderId,
      usd: pack.usd,
    });

    res.json({ status: 'success', credited: pack.points, balance: updated.balance });
  } catch (err) {
    logger.error('capturePointPackOrder failed', {
      message: err.message,
      response: err.response?.data,
    });
    res.status(500).json({ msg: err.response?.data?.message || err.message });
  }
}

export async function getMyTransactions(req, res) {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const items = await PointsTransactions.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    res.json({ status: 'success', items, count: items.length });
  } catch (err) {
    logger.error('getMyTransactions failed', { message: err.message });
    res.status(500).json({ msg: err.message });
  }
}
