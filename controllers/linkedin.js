import axios from 'axios';
import crypto from 'crypto';
import mongoose from 'mongoose';
import Articles from '../models/article.js';
import Users from '../models/user.js';
import Logger from '../utils/logger.js';

const logger = new Logger('linkedin');

const CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const REDIRECT_URI = process.env.LINKEDIN_REDIRECT_URI;
const STATE_COOKIE = 'linkedin_oauth_state';
const STATE_TTL_MS = 10 * 60 * 1000;
const SCOPES = 'openid profile email w_member_social';

const AUTH_URL = 'https://www.linkedin.com/oauth/v2/authorization';
const TOKEN_URL = 'https://www.linkedin.com/oauth/v2/accessToken';
const USERINFO_URL = 'https://api.linkedin.com/v2/userinfo';

// Storm-Gate's user id (req.user.id) does NOT match local Users._id —
// see utils/auth.js:30-31. Local Users are upserted by email via syncBlogUser.
// All LinkedIn handlers must resolve the local _id from req.user.email before
// reading or writing the linkedin subdoc.
async function getLocalUserId(req) {
  if (!req.user?.email) return null;
  const local = await Users.findOne({ email: req.user.email }).select('_id');
  return local?._id || null;
}

function ensureConfigured(res) {
  const missing = [];
  if (!CLIENT_ID) missing.push('LINKEDIN_CLIENT_ID');
  if (!CLIENT_SECRET) missing.push('LINKEDIN_CLIENT_SECRET');
  if (!REDIRECT_URI) missing.push('LINKEDIN_REDIRECT_URI');
  if (missing.length) {
    res.status(500).json({
      msg: `LinkedIn integration not configured. Missing env: ${missing.join(', ')}`,
    });
    return false;
  }
  return true;
}

// Startup log so missing config is visible immediately, not just on first request.
console.log('[linkedin] env check:', {
  LINKEDIN_CLIENT_ID: CLIENT_ID ? `set (${CLIENT_ID.length} chars)` : 'MISSING',
  LINKEDIN_CLIENT_SECRET: CLIENT_SECRET ? `set (${CLIENT_SECRET.length} chars)` : 'MISSING',
  LINKEDIN_REDIRECT_URI: REDIRECT_URI || 'MISSING',
});

function buildReturnRedirect(returnTo, params) {
  // Whitelist: only allow same-origin paths to avoid open-redirect.
  const safe = typeof returnTo === 'string' && returnTo.startsWith('/') && !returnTo.startsWith('//')
    ? returnTo
    : '/admin/blogs';
  const sep = safe.includes('?') ? '&' : '?';
  const qs = new URLSearchParams(params).toString();
  return `${safe}${sep}${qs}`;
}

async function connect(req, res) {
  if (!ensureConfigured(res)) return;

  const localId = await getLocalUserId(req);
  if (!localId) {
    return res.status(500).json({ msg: 'Could not resolve local user record from email.' });
  }

  const state = crypto.randomBytes(32).toString('hex');
  const returnTo = req.query.returnTo || '/admin/blogs';

  // Set the state cookie via XHR response. Browser stores it (same-origin),
  // and it'll be sent on the eventual top-level redirect back from LinkedIn
  // (SameSite=Lax permits cookies on top-level GET navigation).
  // userId stored here is the LOCAL Users._id, not Storm-Gate's id, so the
  // /callback handler (which has no auth) can update the right document.
  res.cookie(
    STATE_COOKIE,
    JSON.stringify({ state, userId: localId.toString(), returnTo }),
    {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: STATE_TTL_MS,
    }
  );

  const url = new URL(AUTH_URL);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('client_id', CLIENT_ID);
  url.searchParams.set('redirect_uri', REDIRECT_URI);
  url.searchParams.set('state', state);
  url.searchParams.set('scope', SCOPES);

  // Return JSON instead of redirecting. The frontend XHRs here (so it can
  // attach the Authorization header), then navigates the browser to authUrl.
  // Browser navigation can't carry an auth header, which is why we don't
  // make this endpoint a redirect.
  res.json({ authUrl: url.toString() });
}

async function callback(req, res) {
  if (!ensureConfigured(res)) return;

  const { code, state, error, error_description } = req.query;

  let stateData = {};
  try {
    stateData = JSON.parse(req.cookies?.[STATE_COOKIE] || '{}');
  } catch (_) {
    stateData = {};
  }
  res.clearCookie(STATE_COOKIE);

  const returnTo = stateData.returnTo || '/admin/blogs';

  if (error) {
    logger.error(`LinkedIn OAuth denied: ${error} - ${error_description}`);
    return res.redirect(buildReturnRedirect(returnTo, { linkedin: 'error', reason: error }));
  }

  if (!stateData.state || stateData.state !== state) {
    logger.error('LinkedIn OAuth state mismatch — possible CSRF');
    return res.redirect(buildReturnRedirect(returnTo, { linkedin: 'error', reason: 'state' }));
  }
  if (!stateData.userId) {
    return res.redirect(buildReturnRedirect(returnTo, { linkedin: 'error', reason: 'session' }));
  }

  try {
    const tokenRes = await axios.post(
      TOKEN_URL,
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const {
      access_token,
      refresh_token,
      expires_in,
      refresh_token_expires_in,
    } = tokenRes.data;

    const userInfoRes = await axios.get(USERINFO_URL, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const { sub, name } = userInfoRes.data;

    const now = Date.now();
    await Users.findByIdAndUpdate(stateData.userId, {
      linkedin: {
        accessToken: access_token,
        refreshToken: refresh_token || null,
        expiresAt: expires_in ? new Date(now + expires_in * 1000) : null,
        refreshExpiresAt: refresh_token_expires_in
          ? new Date(now + refresh_token_expires_in * 1000)
          : null,
        urn: `urn:li:person:${sub}`,
        displayName: name || null,
        connectedAt: new Date(now),
      },
    });

    logger.info(`LinkedIn connected for user ${stateData.userId} (${name})`);
    return res.redirect(buildReturnRedirect(returnTo, { linkedin: 'connected' }));
  } catch (err) {
    const msg = err.response?.data?.error_description || err.message;
    logger.error(`LinkedIn OAuth callback failed: ${msg}`);
    return res.redirect(buildReturnRedirect(returnTo, { linkedin: 'error', reason: 'exchange' }));
  }
}

async function status(req, res) {
  try {
    const localId = await getLocalUserId(req);
    if (!localId) return res.json({ connected: false });
    const user = await Users.findById(localId).select('linkedin');
    const li = user?.linkedin;
    if (!li?.accessToken) {
      return res.json({ connected: false });
    }
    return res.json({
      connected: true,
      displayName: li.displayName || null,
      connectedAt: li.connectedAt || null,
      expiresAt: li.expiresAt || null,
      // Expose only whether refresh is still usable, not the token itself.
      refreshExpiresAt: li.refreshExpiresAt || null,
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

async function disconnect(req, res) {
  try {
    const localId = await getLocalUserId(req);
    if (!localId) return res.status(404).json({ msg: 'Local user not found.' });
    await Users.findByIdAndUpdate(localId, { $unset: { linkedin: 1 } });
    return res.json({ msg: 'LinkedIn disconnected.' });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

// Used by article controller. Returns { accessToken, urn } or throws.
export async function getValidLinkedInToken(userId) {
  const user = await Users.findById(userId).select('linkedin');
  const li = user?.linkedin;
  if (!li?.accessToken || !li?.urn) {
    throw new Error('LinkedIn not connected. Connect in the publishing workflow.');
  }

  const now = Date.now();
  const expiresAt = li.expiresAt ? new Date(li.expiresAt).getTime() : 0;

  // Token still valid (60s clock-skew buffer)
  if (expiresAt > now + 60_000) {
    return { accessToken: li.accessToken, urn: li.urn };
  }

  if (!li.refreshToken) {
    throw new Error('LinkedIn token expired and no refresh token. Reconnect required.');
  }
  if (li.refreshExpiresAt && new Date(li.refreshExpiresAt).getTime() < now) {
    throw new Error('LinkedIn refresh token expired. Reconnect required.');
  }
  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error('LinkedIn integration not configured on this server.');
  }

  const refreshRes = await axios.post(
    TOKEN_URL,
    new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: li.refreshToken,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );

  const {
    access_token,
    refresh_token,
    expires_in,
    refresh_token_expires_in,
  } = refreshRes.data;

  const update = {
    'linkedin.accessToken': access_token,
    'linkedin.expiresAt': new Date(Date.now() + (expires_in || 0) * 1000),
  };
  if (refresh_token) update['linkedin.refreshToken'] = refresh_token;
  if (refresh_token_expires_in) {
    update['linkedin.refreshExpiresAt'] = new Date(
      Date.now() + refresh_token_expires_in * 1000
    );
  }
  await Users.findByIdAndUpdate(userId, update);

  return { accessToken: access_token, urn: li.urn };
}

// Explicit "Post to LinkedIn now" — separate from the publish flow.
// Bypasses linkedinPostedAt idempotency (force=true) so the user can re-post
// (e.g. after fixing the intro). Article must already exist and be published.
async function postExistingArticle(req, res) {
  try {
    const { articleId } = req.params;
    const { intro } = req.body || {};

    const isObjectId =
      mongoose.Types.ObjectId.isValid(articleId) && /^[a-f0-9]{24}$/i.test(articleId);
    const article = isObjectId
      ? await Articles.findById(articleId)
      : await Articles.findOne({ slug: articleId });

    if (!article) return res.status(404).json({ msg: 'Article not found.' });
    if (article.draft || article.archived) {
      return res
        .status(400)
        .json({ msg: 'Article is not published. Publish first, then post to LinkedIn.' });
    }

    // Persist the custom intro (if provided) on the article so it survives
    // re-renders and is available for any future re-posts.
    if (typeof intro === 'string') {
      article.linkedinIntro = intro;
      await article.save();
    }

    const localId = await getLocalUserId(req);
    if (!localId) return res.status(404).json({ msg: 'Local user record not found.' });

    // Lazy import to avoid a circular module load.
    const { postArticleToLinkedIn } = await import('./article.js');
    const result = await postArticleToLinkedIn(article, localId, { force: true });

    if (result.posted) return res.json(result);
    return res.status(500).json({ msg: result.error || 'LinkedIn post failed.', ...result });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

export { connect, callback, status, disconnect, getLocalUserId, postExistingArticle };
