// The Express application, with NO side effects at import time (no DB
// connection, no cron, no app.listen, no build-folder serving). This lets
// integration tests import `app` and drive it with supertest in-process.
// The runtime bootstrap (DB connect, cron, static/SPA serving, listen) lives
// in server.js.
import express from "express";
import logger from "morgan";
import fileUpload from "express-fileupload";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import articleRouter from "./routes/articles.js";
import categoryRouter from "./routes/category.js";
import uploadRouter from "./routes/upload.js";
import paymentRouter from "./routes/payment.js";
import productRouter from "./routes/product.js";
import userRouter from "./routes/user.js";
import blogRouter from "./routes/blog.js";
import mediaRouter from "./routes/media.js";
import collaborationRouter from "./routes/collaboration.js";
import analyticsRouter from "./routes/analytics.js";
import seoRouter from "./routes/seo.js";
import aiRouter from "./routes/ai.js";
import aiArtRouter from "./routes/aiArt.js";
import pointsRouter from "./routes/points.js";
import storeRouter from "./routes/store.js";
import ttsRouter from "./routes/tts.js";
import sitemapRouter from "./routes/sitemap.js";
import socialPreviewRouter from "./routes/socialPreview.js";
import linkedinRouter from "./routes/linkedin.js";
import subscriberRouter from "./routes/subscriber.js";

const app = express();
app.use(logger("dev"));
app.use(express.json());
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:3003')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow same-origin / non-browser callers (curl, server-to-server, health checks)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);
app.use(cookieParser());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

// eslint-disable-next-line no-unused-vars
const limiter = rateLimit({
  // windowMs: 15 * 60 * 1000, // 15 minutes
  // max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // Limit each IP to 100 requests per `window` (here, per 1 hour)
  message:
    "Too many accounts created from this IP, please try again after an hour",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiting middleware to all requests
// app.use(limiter);

// Put API routes here, before the "catch all" route
app.use('/api', articleRouter);
app.use('/api', categoryRouter);
app.use('/api', uploadRouter);
app.use('/api', paymentRouter);
app.use('/api', productRouter);
app.use('/api/user', userRouter);
// LinkedIn's /callback is intentionally un-gated (LinkedIn's browser redirect
// can't carry our JWT). Must mount before ANY router with a `router.use(auth)`
// catch-all — including storeRouter, which has it at routes/store.js:15.
app.use('/api', linkedinRouter);
// Same ordering rule as linkedinRouter above: the public signup/verify/
// unsubscribe routes must be mounted before any /api router with a
// `router.use(auth)` catch-all (store, media, blog, etc.), otherwise those
// catch-alls 401 first and the request never reaches this router.
app.use('/api/subscribers', subscriberRouter);
// Mount store BEFORE the routers below — they use a no-path
// `router.use(auth)` catch-all that would otherwise intercept the
// public /api/store/items handler (used by /shop/redeem).
app.use('/api', storeRouter);
// Enterprise blog routes
// Mount media router with specific prefix to avoid conflicts with auth middleware
app.use('/api', mediaRouter);
app.use('/api', blogRouter);
app.use('/api', collaborationRouter);
app.use('/api', analyticsRouter);
app.use('/api', seoRouter);
app.use('/api', aiRouter);
app.use('/api', aiArtRouter);
app.use('/api', pointsRouter);
app.use('/api', ttsRouter);

// Crawler-facing routes (must be at site root, not /api). These carry no
// dependency on the build/ folder, so they live with the API app. The SPA
// static + catch-all (which need build/) are registered in server.js.
app.use('/', sitemapRouter);
app.use('/', socialPreviewRouter);

export default app;
