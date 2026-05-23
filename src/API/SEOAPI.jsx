import { useState } from 'react';
import axios from 'axios';

/**
 * SEOAPI - SEO analysis and optimization
 **/
function SEOAPI(token) {
    const [seoScore, setSeoScore] = useState(null);
    const [keywords, setKeywords] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);

    // Analyze SEO for article - FIXED to match backend expectations
    const analyzeSEO = async (title, content, description, keywords = []) => {
        setLoading(true);
        try {
            console.log('SEOAPI analyzeSEO called with:', {
                title: title?.substring(0, 50),
                contentLength: content?.length,
                description: description?.substring(0, 50),
                keywordsCount: keywords?.length
            });

            const requestData = {
                title: title || '',
                content: content || '',
                description: description || '',
                keywords: keywords || []
            };

            const res = await axios.post('/api/seo/analyze', requestData, {
                headers: { Authorization: token }
            });

            console.log('SEO API response:', res.data);

            setSeoScore(res.data.score);
            setSuggestions(res.data.suggestions);
            return {
                score: res.data.score,
                analysis: {
                    suggestions: res.data.suggestions
                },
                readabilityScore: res.data.readabilityScore
            };
        } catch (error) {
            console.error('SEO Analysis API Error:', error.response?.data || error.message);
            throw new Error(error.response?.data?.msg || 'SEO analysis failed');
        } finally {
            setLoading(false);
        }
    };

    // Get keyword suggestions - FIXED parameter name
    const getKeywordSuggestions = async (topic, language = 'en') => {
        try {
            console.log('Getting keyword suggestions for:', topic);

            const res = await axios.post('/api/seo/keywords', {
                topic,
                language
            }, {
                headers: { Authorization: token }
            });

            setKeywords(res.data.keywords);
            return {
                keywords: res.data.keywords || []
            };
        } catch (error) {
            console.error('Keyword suggestions failed:', error);
            return { keywords: [] };
        }
    };

    // Analyze keyword density
    const analyzeKeywordDensity = async (content, targetKeywords) => {
        try {
            const res = await axios.post('/api/seo/keyword-density', {
                content,
                targetKeywords
            }, {
                headers: { Authorization: token }
            });
            return res.data;
        } catch (error) {
            console.error('Keyword density analysis failed:', error);
            throw error;
        }
    };

    // Check readability score - FIXED to return expected format
    const checkReadability = async (content) => {
        try {
            const res = await axios.post('/api/seo/readability', {
                content
            }, {
                headers: { Authorization: token }
            });
            return {
                readability: parseFloat(res.data.score) || 0,
                level: res.data.level,
                recommendations: res.data.recommendations
            };
        } catch (error) {
            console.error('Readability check failed:', error);
            return { readability: 0 };
        }
    };

    // Generate meta description
    const generateMetaDescription = async (content, maxLength = 160) => {
        try {
            const res = await axios.post('/api/seo/meta-description', {
                content,
                maxLength
            }, {
                headers: { Authorization: token }
            });
            return res.data;
        } catch (error) {
            console.error('Meta description generation failed:', error);
            throw error;
        }
    };

    // Generate title suggestions
    const generateTitleSuggestions = async (content, keywords) => {
        try {
            const res = await axios.post('/api/seo/title-suggestions', {
                content,
                keywords
            }, {
                headers: { Authorization: token }
            });
            return res.data;
        } catch (error) {
            console.error('Title suggestions failed:', error);
            throw error;
        }
    };

    // Batch SEO Analysis - NEW: Single API call for better performance
    const batchSEOAnalysis = async (analysisData) => {
        setLoading(true);
        try {
            console.log('Performing batch SEO analysis');

            // Call main analysis
            const seoResult = await analyzeSEO(
                analysisData.title,
                analysisData.content, 
                analysisData.description,
                analysisData.keywords || []
            );

            // Get keywords only if content is substantial (>300 chars)
            let keywordResult = { keywords: [] };
            if (analysisData.content && analysisData.content.length > 300) {
                keywordResult = await getKeywordSuggestions(analysisData.title || 'content analysis');
            }

            // Get readability
            let readabilityResult = { readability: 0 };
            if (analysisData.content) {
                readabilityResult = await checkReadability(analysisData.content);
            }

            return {
                seoAnalysis: seoResult,
                keywords: keywordResult.keywords,
                readability: readabilityResult.readability
            };
        } catch (error) {
            console.error('Batch SEO analysis failed:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Other methods remain the same...
    const checkDuplicateContent = async (content) => {
        try {
            const res = await axios.post('/api/seo/duplicate-check', {
                content
            }, {
                headers: { Authorization: token }
            });
            return res.data;
        } catch (error) {
            console.error('Duplicate content check failed:', error);
            throw error;
        }
    };

    const analyzeCompetitors = async (keyword, competitors) => {
        try {
            const res = await axios.post('/api/seo/competitors', {
                keyword,
                competitors
            }, {
                headers: { Authorization: token }
            });
            return res.data;
        } catch (error) {
            console.error('Competitor analysis failed:', error);
            throw error;
        }
    };

    const generateStructuredData = async (articleData) => {
        try {
            const res = await axios.post('/api/seo/structured-data', articleData, {
                headers: { Authorization: token }
            });
            return res.data;
        } catch (error) {
            console.error('Structured data generation failed:', error);
            throw error;
        }
    };

    const analyzeLinkStructure = async (content) => {
        try {
            const res = await axios.post('/api/seo/link-analysis', {
                content
            }, {
                headers: { Authorization: token }
            });
            return res.data;
        } catch (error) {
            console.error('Link analysis failed:', error);
            throw error;
        }
    };

    const getTrendingTopics = async (category) => {
        try {
            const res = await axios.get('/api/seo/trending', {
                params: { category },
                headers: { Authorization: token }
            });
            return res.data;
        } catch (error) {
            console.error('Trending topics failed:', error);
            throw error;
        }
    };

    const optimizeImageSEO = async (imageUrl, altText, articleContext) => {
        try {
            const res = await axios.post('/api/seo/image-optimization', {
                imageUrl,
                altText,
                articleContext
            }, {
                headers: { Authorization: token }
            });
            return res.data;
        } catch (error) {
            console.error('Image SEO optimization failed:', error);
            throw error;
        }
    };

    return {
        seoScore: [seoScore, setSeoScore],
        keywords: [keywords, setKeywords],
        suggestions: [suggestions, setSuggestions],
        loading: [loading, setLoading],
        analyzeSEO,
        batchSEOAnalysis, 
        getKeywordSuggestions,
        analyzeKeywordDensity,
        checkReadability,
        generateMetaDescription,
        generateTitleSuggestions,
        checkDuplicateContent,
        analyzeCompetitors,
        generateStructuredData,
        analyzeLinkStructure,
        getTrendingTopics,
        optimizeImageSEO
    };
}

export default SEOAPI;