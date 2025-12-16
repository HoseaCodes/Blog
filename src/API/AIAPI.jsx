import { useState } from 'react';
import axios from 'axios';

/**
 * AIAPI - AI-powered content assistance using OpenAI
 * Centralizes AI functionality from existing AIAssistant component
 */
function AIAPI(token) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Generate content with AI
    const generateContent = async (prompt, options = {}) => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.post('/api/ai/generate', {
                prompt,
                ...options
            }, {
                headers: { Authorization: token }
            });
            return res.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Improve existing content
    const improveContent = async (content, improvementType) => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.post('/api/ai/improve', {
                content,
                improvementType // 'grammar', 'clarity', 'engagement', 'professional', etc.
            }, {
                headers: { Authorization: token }
            });
            return res.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Generate title suggestions
    const generateTitles = async (content, count = 5) => {
        try {
            const res = await axios.post('/api/ai/titles', {
                content,
                count
            }, {
                headers: { Authorization: token }
            });
            return res.data;
        } catch (err) {
            throw err;
        }
    };

    // Generate outline
    const generateOutline = async (topic, depth = 'detailed') => {
        try {
            const res = await axios.post('/api/ai/outline', {
                topic,
                depth
            }, {
                headers: { Authorization: token }
            });
            return res.data;
        } catch (err) {
            throw err;
        }
    };

    // Expand content
    const expandContent = async (content, targetLength) => {
        setLoading(true);
        try {
            const res = await axios.post('/api/ai/expand', {
                content,
                targetLength
            }, {
                headers: { Authorization: token }
            });
            return res.data;
        } catch (err) {
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Summarize content
    const summarizeContent = async (content, length = 'medium') => {
        try {
            const res = await axios.post('/api/ai/summarize', {
                content,
                length // 'short', 'medium', 'long'
            }, {
                headers: { Authorization: token }
            });
            return res.data;
        } catch (err) {
            throw err;
        }
    };

    // Translate content
    const translateContent = async (content, targetLanguage) => {
        setLoading(true);
        try {
            const res = await axios.post('/api/ai/translate', {
                content,
                targetLanguage
            }, {
                headers: { Authorization: token }
            });
            return res.data;
        } catch (err) {
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Generate social media posts
    const generateSocialPosts = async (content, platforms = ['twitter', 'linkedin', 'facebook']) => {
        try {
            const res = await axios.post('/api/ai/social-posts', {
                content,
                platforms
            }, {
                headers: { Authorization: token }
            });
            return res.data;
        } catch (err) {
            throw err;
        }
    };

    // Check grammar and spelling
    const checkGrammar = async (content) => {
        try {
            const res = await axios.post('/api/ai/grammar', {
                content
            }, {
                headers: { Authorization: token }
            });
            return res.data;
        } catch (err) {
            throw err;
        }
    };

    // Get writing style suggestions
    const getStyleSuggestions = async (content, targetStyle) => {
        try {
            const res = await axios.post('/api/ai/style', {
                content,
                targetStyle // 'professional', 'casual', 'technical', 'creative', etc.
            }, {
                headers: { Authorization: token }
            });
            return res.data;
        } catch (err) {
            throw err;
        }
    };

    // Generate meta tags
    const generateMetaTags = async (content) => {
        try {
            const res = await axios.post('/api/ai/meta-tags', {
                content
            }, {
                headers: { Authorization: token }
            });
            return res.data;
        } catch (err) {
            throw err;
        }
    };

    // Extract key points
    const extractKeyPoints = async (content, count = 5) => {
        try {
            const res = await axios.post('/api/ai/key-points', {
                content,
                count
            }, {
                headers: { Authorization: token }
            });
            return res.data;
        } catch (err) {
            throw err;
        }
    };

    // Generate call-to-action
    const generateCTA = async (articleContext, goal) => {
        try {
            const res = await axios.post('/api/ai/cta', {
                articleContext,
                goal
            }, {
                headers: { Authorization: token }
            });
            return res.data;
        } catch (err) {
            throw err;
        }
    };

    return {
        loading: [loading, setLoading],
        error: [error, setError],
        generateContent,
        improveContent,
        generateTitles,
        generateOutline,
        expandContent,
        summarizeContent,
        translateContent,
        generateSocialPosts,
        checkGrammar,
        getStyleSuggestions,
        generateMetaTags,
        extractKeyPoints,
        generateCTA
    };
}

export default AIAPI;
