// Runtime bootstrap. Loads env, then imports the side-effect-free Express
// `app` (routes/middleware), layers on the build-folder serving (favicon,
// static, SPA catch-all) that must NOT live in app.js (so tests can import
// `app` without a `build/` folder), connects the DB, starts scheduled jobs,
// and listens.
//
// MUST load dotenv first — ES module imports are depth-first and module-level
// `const X = process.env.Y` captures happen at import time, so env has to be
// populated before app.js (and the controllers/routes it pulls in) evaluate.
import "dotenv/config";
import dotenv from "dotenv";
import path from "path";
import favicon from "serve-favicon";
import express from "express";
import app from "./app.js";
import connectDB from "./config/db.js";
import { imageOp } from "./utils/imageOp.js";
import { initScheduledPostJob } from "./cron/scheduledPost.js";
// import { initBackUpDBJob } from "./cron/backupDB.js";
// import { dbAutoBackUp } from "./cron/backupDB.js";

dotenv.config();
imageOp();
connectDB();

const __dirname = path.resolve();

// Configure both serve-favicon & static middlewares to serve from the
// production 'build' folder. Registered after the API routers (mounted in
// app.js) and before the SPA catch-all below.
app.use(favicon(path.join(__dirname, "build", "favicon.ico")));
app.use(express.static(path.join(__dirname, "build")));

// Scheduled Jobs
initScheduledPostJob();
// initBackUpDBJob();

// The following "catch all" route (note the *) is necessary
// for a SPA's client-side routing to properly work
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Configure to use port 3001 instead of 3000 during
// development to avoid collision with React's dev server
// const port = process.env.PORT || 3001;
const port = process.env.PORT || 3003;
// const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';
const host = '0.0.0.0';

const startServer = async () => {
  app.listen(port, host, function () {
      console.log(`Express app running on ${host}:${port}`)
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
  });
};

startServer();
