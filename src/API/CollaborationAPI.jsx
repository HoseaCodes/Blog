import axios from 'axios';

// Plain factory — must NOT be a React hook. It is invoked inside GlobalState's
// render body, so any useState/useEffect here would attach to DataProvider and
// cause provider-wide re-renders on every axios response (see git history).
function CollaborationAPI(token) {
    const authHeaders = { headers: { Authorization: token } };

    const getReviews = async () => {
        const res = await axios.get('/api/collaboration/reviews', authHeaders);
        return res.data;
    };

    const requestReview = async (articleId, reviewerIds, message) => {
        const res = await axios.post('/api/collaboration/review/request', {
            articleId,
            reviewerIds,
            message
        }, authHeaders);
        return res.data;
    };

    const submitReview = async (reviewId, feedback, approved) => {
        const res = await axios.put(`/api/collaboration/review/${reviewId}`, {
            feedback,
            approved
        }, authHeaders);
        return res.data;
    };

    const addCollaborator = async (articleId, userId, role = 'editor') => {
        const res = await axios.post('/api/collaboration/collaborator', {
            articleId,
            userId,
            role
        }, authHeaders);
        return res.data;
    };

    const removeCollaborator = async (articleId, userId) => {
        const res = await axios.delete(
            `/api/collaboration/collaborator/${articleId}/${userId}`,
            authHeaders
        );
        return res.data;
    };

    const getCollaborators = async (articleId) => {
        const res = await axios.get(
            `/api/collaboration/collaborators/${articleId}`,
            authHeaders
        );
        return res.data;
    };

    const shareArticle = async (articleId, shareData) => {
        const res = await axios.post('/api/collaboration/share', {
            articleId,
            ...shareData
        }, authHeaders);
        return res.data;
    };

    const getShareAnalytics = async (articleId) => {
        const res = await axios.get(
            `/api/collaboration/shares/${articleId}`,
            authHeaders
        );
        return res.data;
    };

    const addInlineComment = async (articleId, commentData) => {
        const res = await axios.post('/api/collaboration/inline-comment', {
            articleId,
            ...commentData
        }, authHeaders);
        return res.data;
    };

    const resolveInlineComment = async (commentId) => {
        const res = await axios.put(
            `/api/collaboration/inline-comment/${commentId}/resolve`,
            {},
            authHeaders
        );
        return res.data;
    };

    const getActivityFeed = async (articleId) => {
        const res = await axios.get(
            `/api/collaboration/activity/${articleId}`,
            authHeaders
        );
        return res.data;
    };

    return {
        getReviews,
        requestReview,
        submitReview,
        addCollaborator,
        removeCollaborator,
        getCollaborators,
        shareArticle,
        getShareAnalytics,
        addInlineComment,
        resolveInlineComment,
        getActivityFeed
    };
}

export default CollaborationAPI;
