import mongoose from 'mongoose';

// Lightweight purchase record for AI-art digital goods. Keyed by JWT userId
// only — does NOT cross-reference portfolio.users, so it works for Storm-Gate
// authenticated users whose user document lives in a different database.
const artPurchaseSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products',
        required: true,
        index: true,
    },
    amountPaid: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        default: 'USD',
    },
    paymentProvider: {
        type: String,
        enum: ['paypal', 'stripe', 'points'],
        default: 'paypal',
    },
    paymentId: {
        type: String,
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending',
        index: true,
    },
    downloadsRemaining: {
        type: Number,
        default: 5,
    },
    downloadExpiresAt: {
        type: Date,
    },
}, {
    timestamps: true,
});

artPurchaseSchema.index({ userId: 1, productId: 1 }, { unique: true });

const ArtPurchases = mongoose.model('ArtPurchases', artPurchaseSchema);

export default ArtPurchases;
