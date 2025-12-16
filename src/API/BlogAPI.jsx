import { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * BlogAPI - Enhanced blog operations following existing ArticlesAPI pattern
 * Extends basic article functionality with enterprise features
 */
function BlogAPI(token) {
    const [drafts, setDrafts] = useState([]);
    const [scheduled, setScheduled] = useState([]);
    const [versions, setVersions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [callback, setCallback] = useState(false);

    // Get all drafts
    useEffect(() => {
        if (token) {
            const getDrafts = async () => {
                setLoading(true);
                try {
                    const res = await axios.get('/api/blog/drafts', {
                        headers: { Authorization: token }
                    });
                    setDrafts(res.data.drafts);
                } catch (error) {
                    console.error('Error fetching drafts:', error);
                } finally {
                    setLoading(false);
                }
            };
            getDrafts();
        }
    }, [token, callback]);

    // Get scheduled posts
    useEffect(() => {
        if (token) {
            const getScheduled = async () => {
                try {
                    const res = await axios.get('/api/blog/scheduled', {
                        headers: { Authorization: token }
                    });
                    setScheduled(res.data.scheduled);
                } catch (error) {
                    console.error('Error fetching scheduled:', error);
                }
            };
            getScheduled();
        }
    }, [token, callback]);

    // Create or update draft
    const saveDraft = async (articleData) => {
        try {
            const res = await axios.post('/api/blog/draft', articleData, {
                headers: { Authorization: token }
            });
            setCallback(!callback);
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    // Publish article
    const publishArticle = async (articleId, publishData) => {
        try {
            const res = await axios.put(`/api/blog/publish/${articleId}`, publishData, {
                headers: { Authorization: token }
            });
            setCallback(!callback);
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    // Schedule article
    const scheduleArticle = async (articleId, scheduleData) => {
        try {
            const res = await axios.put(`/api/blog/schedule/${articleId}`, scheduleData, {
                headers: { Authorization: token }
            });
            setCallback(!callback);
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    // Get version history
    const getVersionHistory = async (articleId) => {
        try {
            const res = await axios.get(`/api/blog/versions/${articleId}`, {
                headers: { Authorization: token }
            });
            setVersions(res.data.versions);
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    // Restore version
    const restoreVersion = async (articleId, versionId) => {
        try {
            const res = await axios.put(`/api/blog/restore/${articleId}/${versionId}`, {}, {
                headers: { Authorization: token }
            });
            setCallback(!callback);
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    // Duplicate article
    const duplicateArticle = async (articleId) => {
        try {
            const res = await axios.post(`/api/blog/duplicate/${articleId}`, {}, {
                headers: { Authorization: token }
            });
            setCallback(!callback);
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    // Archive article
    const archiveArticle = async (articleId) => {
        try {
            const res = await axios.put(`/api/blog/archive/${articleId}`, {}, {
                headers: { Authorization: token }
            });
            setCallback(!callback);
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    // Batch operations
    const batchPublish = async (articleIds) => {
        try {
            const res = await axios.post('/api/blog/batch/publish', { articleIds }, {
                headers: { Authorization: token }
            });
            setCallback(!callback);
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    const batchDelete = async (articleIds) => {
        try {
            const res = await axios.post('/api/blog/batch/delete', { articleIds }, {
                headers: { Authorization: token }
            });
            setCallback(!callback);
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    return {
        drafts: [drafts, setDrafts],
        scheduled: [scheduled, setScheduled],
        versions: [versions, setVersions],
        loading: [loading, setLoading],
        callback: [callback, setCallback],
        saveDraft,
        publishArticle,
        scheduleArticle,
        getVersionHistory,
        restoreVersion,
        duplicateArticle,
        archiveArticle,
        batchPublish,
        batchDelete
    };
}

export default BlogAPI;
