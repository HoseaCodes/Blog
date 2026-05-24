import mongoose from 'mongoose';

// Append-only audit log of every points mutation. Never updated, never
// deleted. Each row is the receipt for a balance change; balanceAfter
// lets you reconstruct state at any point in time without replaying.
const pointsTransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['earn', 'spend', 'purchase', 'sync', 'adjust'],
      required: true,
      index: true,
    },
    // Always positive. The sign is implied by `type`.
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    balanceAfter: {
      type: Number,
      required: true,
    },
    // Free-form context: { gameId, gameName, productId, packId, paypalOrderId, ... }
    meta: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

pointsTransactionSchema.index({ userId: 1, createdAt: -1 });

const PointsTransactions = mongoose.model('PointsTransactions', pointsTransactionSchema);

export default PointsTransactions;
