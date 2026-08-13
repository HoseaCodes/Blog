import { Resend } from "resend";
import Logger from "./logger.js";

const logger = new Logger("email");

const SITE_URL = (process.env.SITE_URL || "https://hoseacodes.com").replace(/\/$/, "");
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM = process.env.RESEND_FROM || "newsletter@hoseacodes.com";

// Lazy-init so a missing key doesn't blow up at import time. If the key is
// absent we run in "no-op" mode: sends return {ok:false, skipped:true} and the
// caller treats that as a soft failure. Lets the rest of the subscriber flow
// (signup row creation, verify-token storage) work even before Resend DNS is
// finished.
let resend = null;
function getClient() {
  if (!RESEND_API_KEY) return null;
  if (!resend) resend = new Resend(RESEND_API_KEY);
  return resend;
}

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function send({ to, subject, html, text }) {
  const client = getClient();
  if (!client) {
    logger.info(
      `RESEND_API_KEY not set — skipping send to ${to} (subject: "${subject}")`
    );
    return { ok: false, skipped: true };
  }
  try {
    const { data, error } = await client.emails.send({
      from: RESEND_FROM,
      to,
      subject,
      html,
      text,
    });
    if (error) {
      logger.error(`Resend send failed: ${error.message || JSON.stringify(error)}`);
      return { ok: false, error: error.message || "send failed" };
    }
    return { ok: true, id: data?.id };
  } catch (err) {
    logger.error(`Resend send threw: ${err.message}`);
    return { ok: false, error: err.message };
  }
}

export async function sendVerifyEmail(email, verifyToken) {
  const verifyUrl = `${SITE_URL}/newsletter/verify/${verifyToken}`;
  const subject = "Confirm your subscription to Hosea Codes";
  const safeUrl = escapeHtml(verifyUrl);
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #1a1a1a; line-height: 1.6;">
      <h2 style="margin: 0 0 16px; font-size: 24px;">Welcome to Hosea Codes.</h2>
      <p>Thanks for signing up. Click the button below to confirm your email and you're in.</p>
      <p style="margin: 32px 0;">
        <a href="${safeUrl}" style="background: #206a5d; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600;">Confirm subscription</a>
      </p>
      <p style="color: #6b7479; font-size: 14px;">Or paste this link into your browser:<br><a href="${safeUrl}">${safeUrl}</a></p>
      <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 32px 0 24px;">
      <h3 style="margin: 0 0 12px; font-size: 16px;">What to expect</h3>
      <p style="color: #4a4a4a; font-size: 14px; margin: 0 0 8px;">
        <strong>One email per new post.</strong> No digests, no roundups, no weekly cadence —
        just an email when I publish something new. Could be twice in a week, could be nothing for a month.
      </p>
      <p style="color: #4a4a4a; font-size: 14px; margin: 0 0 8px;">
        <strong>Topics:</strong> software engineering, reliability, AI/ML systems, things I'm building.
      </p>
      <p style="color: #4a4a4a; font-size: 14px; margin: 0;">
        <strong>One-click unsubscribe</strong> at the bottom of every email. I don't share your address.
      </p>
      <p style="color: #6b7479; font-size: 12px; margin-top: 32px;">This confirmation link expires in 24 hours. If you didn't request this, ignore this email — nothing happens.</p>
    </div>
  `;
  const text = [
    "Welcome to Hosea Codes.",
    "",
    "Thanks for signing up. Confirm your email by visiting:",
    verifyUrl,
    "",
    "What to expect:",
    "- One email per new post. No digests, no weekly cadence — just an email when I publish.",
    "- Topics: software engineering, reliability, AI/ML systems, things I'm building.",
    "- One-click unsubscribe at the bottom of every email. I don't share your address.",
    "",
    "This confirmation link expires in 24 hours. If you didn't request this, ignore this email.",
  ].join("\n");
  return send({ to: email, subject, html, text });
}

export async function sendBroadcastEmail(email, article, unsubscribeToken) {
  const articleUrl = `${SITE_URL}/blog/${article.slug || article._id}`;
  const unsubUrl = `${SITE_URL}/newsletter/unsubscribe/${unsubscribeToken}`;
  const subject = article.title;
  const title = escapeHtml(article.title || "");
  const subtitle = escapeHtml(article.subtitle || article.description || "");
  const safeArticleUrl = escapeHtml(articleUrl);
  const safeUnsubUrl = escapeHtml(unsubUrl);
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #1a1a1a;">
      <p style="color: #6b7479; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 16px;">New from Hosea Codes</p>
      <h1 style="margin: 0 0 12px; font-size: 28px; line-height: 1.2;">${title}</h1>
      ${subtitle ? `<p style="color: #6b7479; font-size: 16px; margin: 0 0 24px;">${subtitle}</p>` : ""}
      <p style="margin: 32px 0;">
        <a href="${safeArticleUrl}" style="background: #206a5d; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600;">Read the post</a>
      </p>
      <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 40px 0 16px;">
      <p style="color: #6b7479; font-size: 12px;">
        You're receiving this because you subscribed at hoseacodes.com.
        <a href="${safeUnsubUrl}" style="color: #6b7479;">Unsubscribe</a>.
      </p>
    </div>
  `;
  const text = `${article.title}\n\n${article.subtitle || article.description || ""}\n\nRead: ${articleUrl}\n\n---\nUnsubscribe: ${unsubUrl}`;
  return send({ to: email, subject, html, text });
}
