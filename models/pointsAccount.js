import mongoose from 'mongoose';

// Per-user points balance. Keyed by JWT userId (string), NOT a Mongo ObjectId
// reference — same pattern as ArtPurchases, since auth-issued userIds may not
// resolve to a document in this database (Storm-Gate is a separate cluster).
//
// `balance` is the source of truth for spend authorization. All mutations
// MUST go through atomic $inc to avoid lost updates under concurrent writes.
const pointsAccountSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
    lifetimeEarned: {
      type: Number,
      default: 0,
    },
    lifetimeSpent: {
      type: Number,
      default: 0,
    },
    lifetimePurchased: {
      type: Number,
      default: 0,
    },
    // One-shot flag: prevents repeat-claiming of localStorage offline points.
    claimedOffline: {
      type: Boolean,
      default: false,
    },
    claimedOfflineAmount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const PointsAccounts = mongoose.model('PointsAccounts', pointsAccountSchema);

export default PointsAccounts;
