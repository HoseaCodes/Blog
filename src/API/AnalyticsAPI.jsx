import { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * AnalyticsAPI - Performance tracking and analytics
 * Follows existing API pattern for consistency
 */
function AnalyticsAPI(token) {
    const [articleStats, setArticleStats] = useState({});
    const [performanceMetrics, setPerformanceMetrics] = useState({});
    const [timeRange, setTimeRange] = useState('7d'); // 7d, 30d, 90d, 1y
    const [callback, setCallback] = useState(false);

    // Get article statistics
    const getArticleStats = async (articleId) => {
        try {
            const res = await axios.get(`/api/analytics/article/${articleId}`, {
                params: { range: timeRange },
                headers: { Authorization: token }
            });
            setArticleStats(res.data);
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    // Get overall performance metrics
    useEffect(() => {
        if (token) {
            const getMetrics = async () => {
                try {
                    const res = await axios.get('/api/analytics/performance', {
                        params: { range: timeRange },
                        headers: { Authorization: token }
                    });
                    setPerformanceMetrics(res.data);
                } catch (error) {
                    console.error('Error fetching metrics:', error);
                }
            };
            getMetrics();
        }
    }, [token, timeRange, callback]);

    // Track article view
    const trackView = async (articleId, metadata = {}) => {
        try {
            const res = await axios.post('/api/analytics/view', {
                articleId,
                metadata,
                timestamp: new Date()
            });
            return res.data;
        } catch (error) {
            console.error('Error tracking view:', error);
        }
    };

    // Track engagement event
    const trackEngagement = async (articleId, eventType, data = {}) => {
        try {
            const res = await axios.post('/api/analytics/engagement', {
                articleId,
                eventType, // 'scroll', 'read_time', 'share', 'comment', etc.
                data,
                timestamp: new Date()
            });
            return res.data;
        } catch (error) {
            console.error('Error tracking engagement:', error);
        }
    };

    // Get top performing articles
    const getTopArticles = async (limit = 10) => {
        try {
            const res = await axios.get('/api/analytics/top-articles', {
                params: { range: timeRange, limit },
                headers: { Authorization: token }
            });
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    // Get reader demographics
    const getReaderDemographics = async (articleId) => {
        try {
            const res = await axios.get(`/api/analytics/demographics/${articleId || 'all'}`, {
                params: { range: timeRange },
                headers: { Authorization: token }
            });
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    // Get traffic sources
    const getTrafficSources = async (articleId) => {
        try {
            const res = await axios.get(`/api/analytics/traffic-sources/${articleId || 'all'}`, {
                params: { range: timeRange },
                headers: { Authorization: token }
            });
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    // Get engagement metrics
    const getEngagementMetrics = async (articleId) => {
        try {
            const res = await axios.get(`/api/analytics/engagement/${articleId}`, {
                params: { range: timeRange },
                headers: { Authorization: token }
            });
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    // Get conversion metrics (if applicable)
    const getConversionMetrics = async () => {
        try {
            const res = await axios.get('/api/analytics/conversions', {
                params: { range: timeRange },
                headers: { Authorization: token }
            });
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    // Get real-time stats
    const getRealTimeStats = async () => {
        try {
            const res = await axios.get('/api/analytics/realtime', {
                headers: { Authorization: token }
            });
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    // Export analytics data
    const exportAnalytics = async (format = 'csv') => {
        try {
            const res = await axios.get('/api/analytics/export', {
                params: { range: timeRange, format },
                headers: { Authorization: token },
                responseType: 'blob'
            });
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    return {
        articleStats: [articleStats, setArticleStats],
        performanceMetrics: [performanceMetrics, setPerformanceMetrics],
        timeRange: [timeRange, setTimeRange],
        callback: [callback, setCallback],
        getArticleStats,
        trackView,
        trackEngagement,
        getTopArticles,
        getReaderDemographics,
        getTrafficSources,
        getEngagementMetrics,
        getConversionMetrics,
        getRealTimeStats,
        exportAnalytics
    };
}

export default AnalyticsAPI;
