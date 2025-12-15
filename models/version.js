import mongoose from 'mongoose';

// Version history for articles
const versionSchema = new mongoose.Schema({
    articleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Articles',
        required: true
    },
    versionNumber: {
        type: Number,
        required: true
    },
    title: String,
    subtitle: String,
    content: String,
    markdown: String,
    sanitizedHtml: String,
    images: Object,
    tags: [String],
    categories: [String],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    changeDescription: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

versionSchema.index({ articleId: 1, versionNumber: -1 });

const Version = mongoose.model('Version', versionSchema);

export default Version;
