import mongoose from 'mongoose';

// Review system for collaborative editing
const reviewSchema = new mongoose.Schema({
    articleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Articles',
        required: true
    },
    requestedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    reviewers: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users'
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected', 'completed'],
            default: 'pending'
        },
        feedback: String,
        reviewedAt: Date
    }],
    message: String,
    status: {
        type: String,
        enum: ['pending', 'in_review', 'approved', 'rejected'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

reviewSchema.index({ articleId: 1, status: 1 });
reviewSchema.index({ 'reviewers.userId': 1 });

const Review = mongoose.model('Review', reviewSchema);

export default Review;
