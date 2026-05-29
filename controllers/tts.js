import OpenAI from 'openai';
import TtsUsage from '../models/ttsUsage.js';
import TtsRequest from '../models/ttsRequest.js';
import Logger from '../utils/logger.js';

const logger = new Logger('tts');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const DAILY_LIMIT = 1;

// Storm-Gate JWTs only carry { id }, so admin bypass is env-driven.
// Comma-separated list of Storm-Gate user ids that skip the daily limit.
const ADMIN_USER_IDS = (process.env.ADMIN_USER_IDS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const CHUNK_SIZE = 3500;      // < 4096 OpenAI per-request hard limit, with headroom
const MAX_TOTAL_CHARS = 30000; // safety guard: ~30s/min × ~10 min audio ceiling
const VOICE = 'onyx';
const MODEL = 'tts-1-hd';

// OpenAI list prices in USD per 1K characters. Override via env when pricing changes.
const PRICE_PER_1K = {
  'tts-1': Number(process.env.TTS_PRICE_TTS1_PER_1K ?? 0.015),
  'tts-1-hd': Number(process.env.TTS_PRICE_TTS1HD_PER_1K ?? 0.030),
};
const costFor = (model, chars) => (PRICE_PER_1K[model] || 0) * (chars / 1000);

const todayKey = () => new Date().toISOString().slice(0, 10); // YYYY-MM-DD UTC

const stripMarkdown = (md = '') =>
  md
    .replace(/```[\s\S]*?```/g, ' ')          // fenced code blocks
    .replace(/`[^`]*`/g, ' ')                  // inline code
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')     // images
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')   // links → keep text
    .replace(/^#{1,6}\s+/gm, '')               // headings
    .replace(/[*_~>#]+/g, ' ')                 // markdown punctuation
    .replace(/\s+/g, ' ')
    .trim();

// Split into <= CHUNK_SIZE chunks on sentence boundaries to keep prosody natural.
function chunkText(text) {
  const chunks = [];
  const sentences = text.match(/[^.!?]+[.!?]+\s*|[^.!?]+$/g) || [text];
  let buf = '';
  for (const s of sentences) {
    if ((buf + s).length > CHUNK_SIZE) {
      if (buf) chunks.push(buf);
      if (s.length > CHUNK_SIZE) {
        // single sentence too long — hard split
        for (let i = 0; i < s.length; i += CHUNK_SIZE) {
          chunks.push(s.slice(i, i + CHUNK_SIZE));
        }
        buf = '';
      } else {
        buf = s;
      }
    } else {
      buf += s;
    }
  }
  if (buf) chunks.push(buf);
  return chunks;
}

async function synthesizeSpeech(req, res) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ msg: 'TTS not configured.' });
    }

    const { text } = req.body || {};
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ msg: 'Missing text.' });
    }

    const cleaned = stripMarkdown(text).slice(0, MAX_TOTAL_CHARS);
    if (!cleaned) {
      return res.status(400).json({ msg: 'No readable content.' });
    }

    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ msg: 'Missing user id.' });

    const isAdmin = ADMIN_USER_IDS.includes(userId);
    if (!isAdmin) {
      const today = todayKey();
      const usage = await TtsUsage.findOne({ userId });
      const usedToday = usage && usage.date === today ? usage.count : 0;
      if (usedToday >= DAILY_LIMIT) {
        return res.status(429).json({
          msg: 'Daily listen limit reached. Try again tomorrow.',
          remaining: 0,
        });
      }
      await TtsUsage.findOneAndUpdate(
        { userId },
        { userId, date: today, count: usedToday + 1 },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    const chunks = chunkText(cleaned);
    logger.info(`TTS request: ${cleaned.length} chars in ${chunks.length} chunk(s)`);

    const buffers = await Promise.all(
      chunks.map(async (chunk) => {
        const speech = await openai.audio.speech.create({
          model: MODEL,
          voice: VOICE,
          input: chunk,
          response_format: 'mp3',
        });
        return Buffer.from(await speech.arrayBuffer());
      })
    );

    const audio = Buffer.concat(buffers);

    TtsRequest.create({ userId, chars: cleaned.length, model: MODEL })
      .catch((e) => logger.error(`TtsRequest log failed: ${e.message}`));

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audio.length,
      'Cache-Control': 'private, max-age=3600',
    });
    return res.send(audio);
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message || 'TTS failed.' });
  }
}

async function getTTSQuota(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ msg: 'Missing user id.' });

    const isAdmin = ADMIN_USER_IDS.includes(userId);
    const today = todayKey();
    const usage = await TtsUsage.findOne({ userId });
    const usedToday = usage && usage.date === today ? usage.count : 0;

    return res.json({
      isAdmin,
      limit: isAdmin ? null : DAILY_LIMIT,
      used: usedToday,
      remaining: isAdmin ? null : Math.max(0, DAILY_LIMIT - usedToday),
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

// Rolling time windows for the admin cost dashboard.
const WINDOWS = {
  today: 1,
  '7d': 7,
  '30d': 30,
  '90d': 90,
  '365d': 365,
};

async function aggregateWindow(days) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const rows = await TtsRequest.aggregate([
    { $match: { createdAt: { $gte: since } } },
    {
      $group: {
        _id: '$model',
        chars: { $sum: '$chars' },
        requests: { $sum: 1 },
      },
    },
  ]);

  const byModel = {};
  let chars = 0;
  let requests = 0;
  let cost = 0;
  for (const r of rows) {
    const c = costFor(r._id, r.chars);
    byModel[r._id] = { chars: r.chars, requests: r.requests, cost: c };
    chars += r.chars;
    requests += r.requests;
    cost += c;
  }
  return { chars, requests, cost: Number(cost.toFixed(4)), byModel };
}

async function getTTSCosts(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId || !ADMIN_USER_IDS.includes(userId)) {
      return res.status(403).json({ msg: 'Admin only.' });
    }

    const periods = {};
    for (const [key, days] of Object.entries(WINDOWS)) {
      periods[key] = await aggregateWindow(days);
    }

    return res.json({
      currency: 'USD',
      pricePer1K: PRICE_PER_1K,
      periods,
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

export { synthesizeSpeech, getTTSQuota, getTTSCosts };
