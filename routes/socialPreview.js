import express from 'express';
import mongoose from 'mongoose';
import Articles from '../models/article.js';

const router = express.Router();

const SITE_URL = (process.env.SITE_URL || 'https://hoseacodes.com').replace(/\/$/, '');
const DEFAULT_OG_IMAGE = `${SITE_URL}/logo.png`;

const CRAWLER_UA_RE =
  /linkedinbot|facebookexternalhit|facebot|twitterbot|slackbot|whatsapp|telegrambot|discordbot|pinterest|redditbot|embedly|bingbot|googlebot|applebot|skypeuripreview|vkshare|w3c_validator|line-poker|nuzzel|outbrain|quora link preview|showyoubot|tumblr|yandex/i;

const escapeHtml = (str = '') =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const stripMarkdown = (md = '') =>
  md
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[`*_>#~-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const buildDescription = (article) => {
  if (article.description) return article.description.slice(0, 160);
  if (article.subtitle) return article.subtitle.slice(0, 160);
  return stripMarkdown(article.markdown || '').slice(0, 160);
};

router.get('/blog/:slug', async (req, res, next) => {
  const ua = req.get('User-Agent') || '';
  if (!CRAWLER_UA_RE.test(ua)) return next();

  try {
    const { slug } = req.params;
    const conditions = [{ slug }];
    if (mongoose.isValidObjectId(slug)) conditions.push({ _id: slug });
    const article = await Articles.findOne({
      $or: conditions,
      draft: { $ne: true },
      archived: { $ne: true },
    }).lean();
    if (!article) return next();

    const description = buildDescription(article);
    const image =
      article.images?.secure_url || article.images?.url || DEFAULT_OG_IMAGE;
    const canonicalSlug = article.slug || article._id.toString();
    const url = `${SITE_URL}/blog/${canonicalSlug}`;
    const pageTitle = `${article.title} | Hosea Codes`;
    const publishedTime = article.createdAt
      ? new Date(article.createdAt).toISOString()
      : null;
    const modifiedTime = article.updatedAt
      ? new Date(article.updatedAt).toISOString()
      : publishedTime;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(pageTitle)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <link rel="canonical" href="${escapeHtml(url)}" />

  <meta property="og:type" content="article" />
  <meta property="og:title" content="${escapeHtml(article.title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:url" content="${escapeHtml(url)}" />
  <meta property="og:image" content="${escapeHtml(image)}" />
  <meta property="og:site_name" content="Hosea Codes" />
  ${publishedTime ? `<meta property="article:published_time" content="${escapeHtml(publishedTime)}" />` : ''}
  ${modifiedTime ? `<meta property="article:modified_time" content="${escapeHtml(modifiedTime)}" />` : ''}

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(article.title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${escapeHtml(image)}" />
</head>
<body>
  <h1>${escapeHtml(article.title)}</h1>
  <p>${escapeHtml(description)}</p>
  <p><a href="${escapeHtml(url)}">Read the full article on Hosea Codes</a></p>
</body>
</html>`;

    res.set('Content-Type', 'text/html; charset=utf-8');
    res.set('Cache-Control', 'public, max-age=600');
    res.send(html);
  } catch (err) {
    console.error('[socialPreview] error rendering preview:', err);
    return next();
  }
});

export default router;
