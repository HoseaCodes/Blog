import mongoose from 'mongoose';

// Per-user daily TTS quota counter. Keyed by JWT userId (string) — same
// pattern as PointsAccounts/ArtPurchases, since Storm-Gate-issued userIds
// don't resolve to a Users document in this database.
const ttsUsageSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    date: { type: String, required: true }, // YYYY-MM-DD UTC
    count: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

const TtsUsage = mongoose.model('TtsUsage', ttsUsageSchema);
export default TtsUsage;
