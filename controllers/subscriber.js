import crypto from "crypto";
import Subscribers from "../models/subscriber.js";
import Articles from "../models/article.js";
import Logger from "../utils/logger.js";
import { sendVerifyEmail, sendBroadcastEmail } from "../utils/email.js";

const logger = new Logger("subscribers");

const VERIFY_TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24h
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function newToken() {
  return crypto.randomBytes(24).toString("hex");
}

// POST /api/subscribers — public. Idempotent: re-signups with the same email
// just regenerate a fresh verify token and resend the email. We always return
// the same generic success message regardless of whether the email existed,
// to avoid leaking subscriber-list membership.
export async function signup(req, res) {
  try {
    const email = String(req.body?.email || "").toLowerCase().trim();
    const source = String(req.body?.source || "article-inline").slice(0, 64);

    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ msg: "Please enter a valid email address." });
    }

    const verifyToken = newToken();
    const verifyTokenExpiresAt = new Date(Date.now() + VERIFY_TOKEN_TTL_MS);

    const existing = await Subscribers.findOne({ email });
    if (existing) {
      if (existing.verified) {
        // Already on the list. Don't re-send the verify email; just respond
        // success so we don't reveal membership.
        return res.json({ status: "success", msg: "Check your inbox to confirm." });
      }
      existing.verifyToken = verifyToken;
      existing.verifyTokenExpiresAt = verifyTokenExpiresAt;
      existing.source = source;
      if (!existing.unsubscribeToken) existing.unsubscribeToken = newToken();
      await existing.save();
    } else {
      await Subscribers.create({
        email,
        verifyToken,
        verifyTokenExpiresAt,
        unsubscribeToken: newToken(),
        source,
      });
    }

    // Fire and forget — slow/failing email shouldn't block the response.
    sendVerifyEmail(email, verifyToken).catch((err) =>
      logger.error(`sendVerifyEmail failed for ${email}: ${err.message}`)
    );

    return res.json({ status: "success", msg: "Check your inbox to confirm." });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

// GET /api/subscribers/verify/:token — public. Flips verified=true if the
// token is valid and unexpired. Designed to be hit by the frontend landing
// page (not by the email client directly), so it returns JSON.
export async function verify(req, res) {
  try {
    const { token } = req.params;
    const sub = await Subscribers.findOne({ verifyToken: token });

    if (!sub) {
      return res.status(404).json({ msg: "Invalid or expired verification link." });
    }
    if (sub.verified) {
      return res.json({ status: "success", msg: "Already confirmed." });
    }
    if (!sub.verifyTokenExpiresAt || sub.verifyTokenExpiresAt < new Date()) {
      return res.status(410).json({ msg: "This link has expired. Sign up again." });
    }

    sub.verified = true;
    sub.verifiedAt = new Date();
    sub.verifyToken = undefined;
    sub.verifyTokenExpiresAt = undefined;
    if (!sub.unsubscribeToken) sub.unsubscribeToken = newToken();
    await sub.save();

    return res.json({ status: "success", msg: "Subscription confirmed." });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

// GET /api/subscribers/unsubscribe/:token — public. One-click, no auth, no
// confirmation step (per CAN-SPAM list-unsubscribe expectations). Soft-deletes
// by clearing verified and stamping unsubscribedAt; we keep the row so future
// signups with the same email can detect prior opt-out.
export async function unsubscribe(req, res) {
  try {
    const { token } = req.params;
    const sub = await Subscribers.findOne({ unsubscribeToken: token });

    if (!sub) {
      return res.status(404).json({ msg: "Invalid unsubscribe link." });
    }

    sub.verified = false;
    sub.unsubscribedAt = new Date();
    await sub.save();

    return res.json({ status: "success", msg: "You've been unsubscribed." });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

// POST /api/subscribers/broadcast/:articleId — admin only. Sends the article
// to every verified subscriber. Used either as a manual re-send button or as
// the implementation called by the article-publish auto-hook.
export async function broadcast(req, res) {
  try {
    const { articleId } = req.params;
    const article = await Articles.findById(articleId);
    if (!article) return res.status(404).json({ msg: "Article not found." });
    if (article.draft || article.archived) {
      return res.status(400).json({ msg: "Cannot broadcast a draft or archived article." });
    }

    const result = await broadcastArticle(article);
    return res.json({ status: "success", ...result });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

// Reusable: also called from the article controller's publish hook.
// Returns { sent, failed } counts. Never throws.
export async function broadcastArticle(article) {
  const subscribers = await Subscribers.find({ verified: true });
  let sent = 0;
  let failed = 0;

  // Sequential to avoid hammering Resend's rate limit on the free tier
  // (2 req/sec). For lists in the thousands, batch via Resend's /emails/batch
  // endpoint instead.
  for (const sub of subscribers) {
    const result = await sendBroadcastEmail(sub.email, article, sub.unsubscribeToken);
    if (result.ok) sent += 1;
    else failed += 1;
  }

  await Articles.findByIdAndUpdate(article._id, { newsletterSentAt: new Date() });
  logger.info(`Broadcast article ${article._id}: sent=${sent} failed=${failed}`);
  return { sent, failed, total: subscribers.length };
}

// GET /api/subscribers — admin only. Returns the list for the admin UI.
// Excludes tokens to keep them out of logs and the wire.
export async function list(req, res) {
  try {
    const subs = await Subscribers.find()
      .select("-verifyToken -unsubscribeToken")
      .sort({ createdAt: -1 });
    return res.json({ status: "success", subscribers: subs, count: subs.length });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}
