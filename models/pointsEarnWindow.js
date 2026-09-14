import mongoose from 'mongoose';

// Per-user daily earn budget.
//
// `POST /api/points/earn` takes a client-supplied amount from a browser origin,
// and Storm-Gate hands out guest tokens to anyone unauthenticated — so without
// a ceiling the wallet is mintable at will. The per-call cap
// (POINTS_MAX_SINGLE_EARN) bounds one request; this bounds a day.
//
// One document per (userId, windowStart). `windowStart` is a 'YYYY-MM-DD' UTC
// day string rather than a Date so the unique index does exact-match dedupe
// without any time-of-day comparison.
//
// The unique index is load-bearing: the budget is consumed with an atomic
// findOneAndUpdate carrying a precondition on the remaining balance, and a
// racing over-cap write surfaces as a duplicate-key error rather than an
// overspend. See consumeDailyEarnBudget in services/points.js.
const pointsEarnWindowSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    // UTC calendar day, 'YYYY-MM-DD'.
    windowStart: {
      type: String,
      required: true,
    },
    earned: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

pointsEarnWindowSchema.index({ userId: 1, windowStart: 1 }, { unique: true });

// Old windows carry no value once the day passes; expire them a week out so the
// collection stays bounded without a cron job.
pointsEarnWindowSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7 * 24 * 60 * 60 });

const PointsEarnWindows = mongoose.model('PointsEarnWindows', pointsEarnWindowSchema);

export default PointsEarnWindows;
