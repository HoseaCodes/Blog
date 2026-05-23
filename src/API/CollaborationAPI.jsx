import { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * CollaborationAPI - Collaboration features (reviews, sharing, co-authoring)
 * Extends existing CommentsAPI pattern
 */
function CollaborationAPI(token) {
    const [reviews, setReviews] = useState([]);
    const [shares, setShares] = useState([]);
    const [collaborators, setCollaborators] = useState([]);
    const [callback, setCallback] = useState(false);

    // Get pending reviews
    useEffect(() => {
        if (token) {
            const getReviews = async () => {
                try {
                    const res = await axios.get('/api/collaboration/reviews', {
                        headers: { Authorization: token }
                    });
                    setReviews(res.data.reviews);
                } catch (error) {
                    console.error('Error fetching reviews:', error);
                }
            };
            getReviews();
        }
    }, [token, callback]);

    // Request review
    const requestReview = async (articleId, reviewerIds, message) => {
        try {
            const res = await axios.post('/api/collaboration/review/request', {
                articleId,
                reviewerIds,
                message
            }, {
                headers: { Authorization: token }
            });
            setCallback(!callback);
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    // Submit review
    const submitReview = async (reviewId, feedback, approved) => {
        try {
            const res = await axios.put(`/api/collaboration/review/${reviewId}`, {
                feedback,
                approved
            }, {
                headers: { Authorization: token }
            });
            setCallback(!callback);
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    // Add collaborator
    const addCollaborator = async (articleId, userId, role = 'editor') => {
        try {
            const res = await axios.post('/api/collaboration/collaborator', {
                articleId,
                userId,
                role
            }, {
                headers: { Authorization: token }
            });
            setCallback(!callback);
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    // Remove collaborator
    const removeCollaborator = async (articleId, userId) => {
        try {
            const res = await axios.delete(`/api/collaboration/collaborator/${articleId}/${userId}`, {
                headers: { Authorization: token }
            });
            setCallback(!callback);
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    // Get collaborators for article
    const getCollaborators = async (articleId) => {
        try {
            const res = await axios.get(`/api/collaboration/collaborators/${articleId}`, {
                headers: { Authorization: token }
            });
            setCollaborators(res.data.collaborators);
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    // Share article
    const shareArticle = async (articleId, shareData) => {
        try {
            const res = await axios.post('/api/collaboration/share', {
                articleId,
                ...shareData
            }, {
                headers: { Authorization: token }
            });
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    // Get share analytics
    const getShareAnalytics = async (articleId) => {
        try {
            const res = await axios.get(`/api/collaboration/shares/${articleId}`, {
                headers: { Authorization: token }
            });
            setShares(res.data.shares);
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    // Add inline comment (for collaboration)
    const addInlineComment = async (articleId, commentData) => {
        try {
            const res = await axios.post(`/api/collaboration/inline-comment`, {
                articleId,
                ...commentData
            }, {
                headers: { Authorization: token }
            });
            setCallback(!callback);
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    // Resolve inline comment
    const resolveInlineComment = async (commentId) => {
        try {
            const res = await axios.put(`/api/collaboration/inline-comment/${commentId}/resolve`, {}, {
                headers: { Authorization: token }
            });
            setCallback(!callback);
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    // Get activity feed
    const getActivityFeed = async (articleId) => {
        try {
            const res = await axios.get(`/api/collaboration/activity/${articleId}`, {
                headers: { Authorization: token }
            });
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    return {
        reviews: [reviews, setReviews],
        shares: [shares, setShares],
        collaborators: [collaborators, setCollaborators],
        callback: [callback, setCallback],
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
