import mongoose from 'mongoose';

// Collaboration and co-authoring
const collaboratorSchema = new mongoose.Schema({
    articleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Articles',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    role: {
        type: String,
        enum: ['owner', 'editor', 'reviewer', 'viewer'],
        default: 'editor'
    },
    permissions: {
        canEdit: { type: Boolean, default: true },
        canPublish: { type: Boolean, default: false },
        canDelete: { type: Boolean, default: false },
        canInvite: { type: Boolean, default: false }
    },
    invitedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'inactive'],
        default: 'active'
    },
    invitedAt: {
        type: Date,
        default: Date.now
    },
    lastAccessedAt: Date
}, {
    timestamps: true
});

collaboratorSchema.index({ articleId: 1, userId: 1 }, { unique: true });
collaboratorSchema.index({ userId: 1, status: 1 });

const Collaborator = mongoose.model('Collaborator', collaboratorSchema);

export default Collaborator;
