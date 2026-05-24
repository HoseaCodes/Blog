import express from 'express';
import Articles from '../models/article.js';

const router = express.Router();

const SITE_URL = (process.env.SITE_URL || 'https://hoseacodes.com').replace(/\/$/, '');

const STATIC_URLS = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/blog', changefreq: 'daily', priority: '0.9' },
  { path: '/about', changefreq: 'monthly', priority: '0.7' },
  { path: '/contact', changefreq: 'monthly', priority: '0.5' },
  { path: '/project', changefreq: 'monthly', priority: '0.7' },
];

const escapeXml = (str = '') =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

router.get('/sitemap.xml', async (req, res) => {
  try {
    const articles = await Articles.find(
      { draft: { $ne: true }, archived: { $ne: true } },
      { slug: 1, _id: 1, updatedAt: 1, createdAt: 1 }
    ).lean();

    const today = new Date().toISOString().split('T')[0];

    const staticEntries = STATIC_URLS.map(
      ({ path, changefreq, priority }) =>
        `  <url>\n    <loc>${escapeXml(SITE_URL + path)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`
    );

    const articleEntries = articles.map((article) => {
      const slug = article.slug || article._id.toString();
      const lastmod = (article.updatedAt || article.createdAt || new Date())
        .toISOString()
        .split('T')[0];
      return `  <url>\n    <loc>${escapeXml(`${SITE_URL}/blog/${slug}`)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`;
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...staticEntries, ...articleEntries].join('\n')}\n</urlset>\n`;

    res.set('Content-Type', 'application/xml; charset=utf-8');
    res.set('Cache-Control', 'public, max-age=3600');
    res.send(xml);
  } catch (err) {
    res.status(500).send(`<!-- sitemap generation failed: ${escapeXml(err.message)} -->`);
  }
});

export default router;
