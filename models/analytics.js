import mongoose from 'mongoose';

// Analytics tracking for articles
const analyticsSchema = new mongoose.Schema({
    articleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Articles',
        required: true
    },
    eventType: {
        type: String,
        enum: ['view', 'like', 'comment', 'share', 'scroll', 'read_time', 'click'],
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    sessionId: String,
    metadata: {
        userAgent: String,
        referrer: String,
        location: Object,
        device: String,
        scrollDepth: Number,
        readTime: Number,
        clickTarget: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: false
});

analyticsSchema.index({ articleId: 1, eventType: 1, timestamp: -1 });
analyticsSchema.index({ timestamp: -1 });
analyticsSchema.index({ userId: 1 });

const Analytics = mongoose.model('Analytics', analyticsSchema);

export default Analytics;
