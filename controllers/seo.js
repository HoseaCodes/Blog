import Logger from '../utils/logger.js';

const logger = new Logger('seo');

// SEO analysis functions
// For production, consider integrating with services like:
// - Yoast SEO API
// - Google Search Console API
// - Ahrefs/SEMrush APIs

// Helper function to calculate readability score (Flesch Reading Ease)
function calculateReadability(text) {
  if (!text || typeof text !== 'string') return 0;
  
  // Clean text and count elements
  const cleanText = text.replace(/[^\w\s.!?]/g, ' ').trim();
  if (!cleanText) return 0;

  const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = cleanText.split(/\s+/).filter(w => w.length > 0);
  
  if (words.length === 0 || sentences.length === 0) return 0;

  // Count syllables more accurately
  const syllables = words.reduce((count, word) => {
    const syllableCount = word.toLowerCase()
      .replace(/[^aeiouy]/g, '')
      .replace(/([aeiouy])\1+/g, '$1')  // Remove consecutive vowels
      .length;
    return count + Math.max(1, syllableCount); // Every word has at least 1 syllable
  }, 0);

  // Flesch Reading Ease formula
  const avgWordsPerSentence = words.length / sentences.length;
  const avgSyllablesPerWord = syllables / words.length;
  
  const score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
  return Math.max(0, Math.min(100, score));
}

export async function analyzeSEO(req, res) {
  try {
    const { title, description, content, keywords = [] } = req.body;

    logger.info('SEO analyze request:', { 
      hasTitle: !!title, 
      hasDescription: !!description, 
      hasContent: !!content,
      contentLength: content?.length,
      keywordsCount: keywords.length 
    });

    const analysis = {
      score: 0,
      suggestions: [],
      breakdown: {
        title: 0,
        description: 0,
        content: 0,
        keywords: 0,
        readability: 0,
        structure: 0
      }
    };

    // 1. TITLE ANALYSIS (25 points max)
    if (!title) {
      analysis.suggestions.push({
        id: 'title-missing',
        type: 'error',
        message: 'Title is required for SEO',
        weight: 'high'
      });
    } else {
      const titleLength = title.length;
      
      if (titleLength < 30) {
        analysis.suggestions.push({
          id: 'title-short',
          type: 'warning',
          message: 'Title should be at least 30 characters long',
          current: titleLength,
          recommended: '30-60 characters'
        });
        analysis.breakdown.title = 10;
      } else if (titleLength > 60) {
        analysis.suggestions.push({
          id: 'title-long',
          type: 'warning', 
          message: 'Title should be less than 60 characters for better search display',
          current: titleLength,
          recommended: '30-60 characters'
        });
        analysis.breakdown.title = 15;
      } else {
        analysis.breakdown.title = 25;
        analysis.suggestions.push({
          id: 'title-good',
          type: 'success',
          message: 'Title length is optimal for SEO'
        });
      }
    }

    // 2. META DESCRIPTION ANALYSIS (20 points max)
    if (!description) {
      analysis.suggestions.push({
        id: 'description-missing',
        type: 'error',
        message: 'Meta description is important for click-through rates',
        weight: 'medium'
      });
    } else {
      const descLength = description.length;
      
      if (descLength < 120) {
        analysis.suggestions.push({
          id: 'description-short',
          type: 'warning',
          message: 'Meta description should be at least 120 characters',
          current: descLength,
          recommended: '120-160 characters'
        });
        analysis.breakdown.description = 10;
      } else if (descLength > 160) {
        analysis.suggestions.push({
          id: 'description-long',
          type: 'warning',
          message: 'Meta description should be less than 160 characters',
          current: descLength,
          recommended: '120-160 characters'
        });
        analysis.breakdown.description = 15;
      } else {
        analysis.breakdown.description = 20;
        analysis.suggestions.push({
          id: 'description-good',
          type: 'success',
          message: 'Meta description length is optimal'
        });
      }
    }

    // 3. CONTENT ANALYSIS (25 points max)
    if (!content || typeof content !== 'string') {
      analysis.suggestions.push({
        id: 'content-missing',
        type: 'error',
        message: 'Content is required for SEO analysis',
        weight: 'high'
      });
      logger.info('SEO analysis called with missing or invalid content');
    } else {
      const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
      
      if (wordCount < 300) {
        analysis.suggestions.push({
          id: 'content-short',
          type: 'warning',
          message: 'Content should be at least 300 words for better SEO',
          current: `${wordCount} words`,
          recommended: '300+ words'
        });
        analysis.breakdown.content = 5;
      } else if (wordCount < 500) {
        analysis.suggestions.push({
          id: 'content-ok',
          type: 'info',
          message: 'Consider expanding content for better SEO performance',
          current: `${wordCount} words`
        });
        analysis.breakdown.content = 15;
      } else if (wordCount >= 800) {
        analysis.breakdown.content = 25;
        analysis.suggestions.push({
          id: 'content-excellent',
          type: 'success', 
          message: 'Content length is excellent for SEO',
          current: `${wordCount} words`
        });
      } else {
        analysis.breakdown.content = 20;
        analysis.suggestions.push({
          id: 'content-good',
          type: 'success',
          message: 'Content length is good for SEO',
          current: `${wordCount} words`
        });
      }
    }

    // 4. READABILITY ANALYSIS (15 points max)
    let readabilityScore = 0;
    if (content) {
      readabilityScore = calculateReadability(content);
      analysis.readabilityScore = parseFloat(readabilityScore.toFixed(1));
      
      if (readabilityScore < 30) {
        analysis.suggestions.push({
          id: 'readability-difficult',
          type: 'warning',
          message: 'Content is very difficult to read. Consider simplifying sentences and vocabulary.',
          score: readabilityScore.toFixed(1)
        });
        analysis.breakdown.readability = 5;
      } else if (readabilityScore < 50) {
        analysis.suggestions.push({
          id: 'readability-hard',
          type: 'warning',
          message: 'Content is somewhat difficult to read. Try shorter sentences.',
          score: readabilityScore.toFixed(1)
        });
        analysis.breakdown.readability = 10;
      } else if (readabilityScore >= 60) {
        analysis.breakdown.readability = 15;
        analysis.suggestions.push({
          id: 'readability-good',
          type: 'success',
          message: 'Content readability is good',
          score: readabilityScore.toFixed(1)
        });
      } else {
        analysis.breakdown.readability = 12;
        analysis.suggestions.push({
          id: 'readability-ok',
          type: 'info',
          message: 'Content readability is acceptable',
          score: readabilityScore.toFixed(1)
        });
      }
    }

    // 5. KEYWORD ANALYSIS (10 points max)
    if (keywords.length === 0) {
      analysis.suggestions.push({
        id: 'keywords-missing',
        type: 'warning',
        message: 'Add target keywords for better optimization',
        weight: 'medium'
      });
    } else {
      analysis.breakdown.keywords = 5;
      
      // Check keyword presence in title and content
      if (title && content) {
        const titleLower = title.toLowerCase();
        const contentLower = content.toLowerCase();
        
        const keywordsInTitle = keywords.filter(kw => 
          titleLower.includes(kw.toLowerCase())
        ).length;
        
        const keywordsInContent = keywords.filter(kw => 
          contentLower.includes(kw.toLowerCase())
        ).length;
        
        if (keywordsInTitle > 0) {
          analysis.breakdown.keywords += 3;
          analysis.suggestions.push({
            id: 'keywords-in-title',
            type: 'success',
            message: `${keywordsInTitle} target keyword(s) found in title`
          });
        } else {
          analysis.suggestions.push({
            id: 'keywords-not-in-title',
            type: 'warning',
            message: 'Include target keywords in title for better SEO'
          });
        }
        
        if (keywordsInContent >= keywords.length * 0.8) {
          analysis.breakdown.keywords += 2;
          analysis.suggestions.push({
            id: 'keywords-in-content',
            type: 'success',
            message: 'Good keyword presence in content'
          });
        }
      }
    }

    // 6. STRUCTURE ANALYSIS (5 points max)
    if (content) {
      let structurePoints = 0;
      
      // Check for headings
      if (content.includes('##')) {
        structurePoints += 2;
        analysis.suggestions.push({
          id: 'structure-headings',
          type: 'success',
          message: 'Good use of headings for content structure'
        });
      } else {
        analysis.suggestions.push({
          id: 'structure-no-headings',
          type: 'warning',
          message: 'Add subheadings (## H2) to improve content structure'
        });
      }
      
      // Check for lists
      if (content.includes('- ') || content.includes('* ') || content.includes('1. ')) {
        structurePoints += 1;
        analysis.suggestions.push({
          id: 'structure-lists',
          type: 'success',
          message: 'Good use of lists for readability'
        });
      }
      
      // Check for links
      if (content.includes('[') && content.includes('](')) {
        structurePoints += 1;
        analysis.suggestions.push({
          id: 'structure-links',
          type: 'success',
          message: 'Content includes links'
        });
      }
      
      // Check for images
      if (content.includes('![')) {
        structurePoints += 1;
        analysis.suggestions.push({
          id: 'structure-images',
          type: 'success',
          message: 'Content includes images with alt text'
        });
      }
      
      analysis.breakdown.structure = structurePoints;
    }

    // Calculate total score
    analysis.score = Math.min(100, Object.values(analysis.breakdown).reduce((sum, points) => sum + points, 0));

    logger.info(`SEO analyzed with score: ${analysis.score}`, {
      breakdown: analysis.breakdown,
      totalSuggestions: analysis.suggestions.length
    });

    // Format suggestions for frontend
    const formattedSuggestions = analysis.suggestions.map(suggestion => ({
      id: suggestion.id,
      title: suggestion.message.split('.')[0], // First sentence as title
      description: suggestion.message,
      status: suggestion.type === 'success' ? 'pass' : 
              suggestion.type === 'warning' ? 'warning' : 'fail',
      current: suggestion.current,
      recommendation: suggestion.type === 'success' ? suggestion.message : 
                     `Fix: ${suggestion.message}`
    }));

    res.json({
      status: 'success',
      score: analysis.score,
      suggestions: formattedSuggestions,
      readabilityScore: analysis.readabilityScore || 0,
      breakdown: analysis.breakdown,
      analysis: {
        suggestions: formattedSuggestions
      }
    });

  } catch (err) {
    logger.error('SEO analysis error:', err);
    return res.status(500).json({ 
      msg: err.message,
      status: 'error'
    });
  }
}

export async function getKeywordSuggestions(req, res) {
  try {
    const { topic } = req.body;
    
    if (!topic) {
      return res.status(400).json({
        status: 'error',
        msg: 'Topic is required for keyword suggestions'
      });
    }
    
    logger.info(`Generating keyword suggestions for: ${topic}`);
    
    // Generate keyword suggestions based on the topic
    const baseKeywords = [
      topic,
      `${topic} guide`,
      `how to ${topic}`,
      `best ${topic}`,
      `${topic} tips`,
      `${topic} tutorial`,
      `${topic} examples`,
      `${topic} 2024`,
      `learn ${topic}`,
      `${topic} for beginners`
    ];

    const suggestions = baseKeywords.map((keyword, index) => ({
      term: keyword,
      volume: Math.floor(Math.random() * 10000) + 100, // Mock volume data
      difficulty: ['Low', 'Medium', 'High'][index % 3],
      cpc: (Math.random() * 5).toFixed(2),
      relevance: Math.floor(Math.random() * 30) + 70 // 70-100%
    }));

    res.json({
      status: 'success',
      keywords: suggestions.slice(0, 5) // Return top 5 suggestions
    });

  } catch (err) {
    logger.error('Keyword suggestions error:', err);
    return res.status(500).json({ 
      msg: err.message,
      status: 'error'
    });
  }
}

export async function analyzeKeywordDensity(req, res) {
  try {
    const { content, targetKeywords } = req.body;
    
    if (!content || !targetKeywords) {
      return res.status(400).json({
        status: 'error',
        msg: 'Content and target keywords are required'
      });
    }
    
    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
    const contentLower = content.toLowerCase();
    
    const density = targetKeywords.map(keyword => {
      const regex = new RegExp(keyword.toLowerCase(), 'gi');
      const matches = contentLower.match(regex) || [];
      const count = matches.length;
      const densityPercent = wordCount > 0 ? ((count / wordCount) * 100).toFixed(2) : 0;
      
      return {
        keyword,
        count,
        density: `${densityPercent}%`,
        optimal: densityPercent >= 0.5 && densityPercent <= 2.5
      };
    });

    res.json({
      status: 'success',
      density
    });
    
  } catch (err) {
    logger.error('Keyword density analysis error:', err);
    return res.status(500).json({ 
      msg: err.message,
      status: 'error'
    });
  }
}

export async function checkReadability(req, res) {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({
        status: 'error',
        msg: 'Content is required for readability analysis'
      });
    }
    
    const score = calculateReadability(content);
    
    let level = 'Very Difficult';
    if (score >= 90) level = 'Very Easy';
    else if (score >= 80) level = 'Easy';
    else if (score >= 70) level = 'Fairly Easy';
    else if (score >= 60) level = 'Standard';
    else if (score >= 50) level = 'Fairly Difficult';
    else if (score >= 30) level = 'Difficult';

    const recommendations = score < 50 
      ? [
          'Use shorter sentences (aim for 15-20 words)',
          'Use simpler, more common words',
          'Break up long paragraphs',
          'Add more transitional phrases'
        ]
      : [
          'Readability is good',
          'Content is accessible to most readers'
        ];

    res.json({
      status: 'success',
      score: parseFloat(score.toFixed(1)),
      level,
      recommendations
    });
    
  } catch (err) {
    logger.error('Readability check error:', err);
    return res.status(500).json({ 
      msg: err.message,
      status: 'error'
    });
  }
}

export async function generateMetaDescription(req, res) {
  try {
    const { content, maxLength = 160 } = req.body;
    
    if (!content) {
      return res.status(400).json({
        status: 'error',
        msg: 'Content is required for meta description generation'
      });
    }
    
    // Extract first meaningful paragraph
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const firstSentence = sentences[0]?.trim() || content.substring(0, 100);
    
    let description = firstSentence;
    if (description.length > maxLength - 3) {
      description = description.substring(0, maxLength - 3) + '...';
    }

    res.json({
      status: 'success',
      description
    });
  } catch (err) {
    logger.error('Meta description generation error:', err);
    return res.status(500).json({ 
      msg: err.message,
      status: 'error'
    });
  }
}

export async function generateTitleSuggestions(req, res) {
  try {
    const { content, keywords = [] } = req.body;
    
    const mainKeyword = keywords[0] || 'topic';
    
    const suggestions = [
      `How to Master ${mainKeyword}: Complete Guide`,
      `The Ultimate ${mainKeyword} Guide for 2024`,
      `${mainKeyword}: Everything You Need to Know`,
      `Top 10 ${mainKeyword} Tips for Success`,
      `${mainKeyword} Best Practices and Examples`,
      `Learn ${mainKeyword}: Step-by-Step Tutorial`,
      `${mainKeyword} for Beginners: Start Here`,
      `Advanced ${mainKeyword} Techniques and Strategies`
    ];

    res.json({
      status: 'success',
      titles: suggestions.slice(0, 5)
    });
    
  } catch (err) {
    logger.error('Title suggestions error:', err);
    return res.status(500).json({ 
      msg: err.message,
      status: 'error'
    });
  }
}

export async function checkDuplicateContent(req, res) {
  try {
    res.json({
      status: 'success',
      duplicate: false,
      msg: 'Duplicate content checking requires external API integration'
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

export async function analyzeCompetitors(req, res) {
  try {
    res.json({
      status: 'success',
      msg: 'Competitor analysis requires SEO API integration'
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

export async function generateStructuredData(req, res) {
  try {
    const { title, description, author, datePublished, image } = req.body;
    
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": title,
      "description": description,
      "author": {
        "@type": "Person",
        "name": author
      },
      "datePublished": datePublished,
      "image": image
    };

    res.json({
      status: 'success',
      structuredData
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

export async function analyzeLinkStructure(req, res) {
  try {
    const { content } = req.body;
    
    const internalLinks = (content.match(/href="\/[^"]*"/g) || []).length;
    const externalLinks = (content.match(/href="https?:\/\/[^"]*"/g) || []).length;

    res.json({
      status: 'success',
      links: {
        internal: internalLinks,
        external: externalLinks,
        recommendations: [
          internalLinks < 3 ? 'Add more internal links' : 'Internal linking is good',
          externalLinks < 2 ? 'Consider adding authoritative external links' : 'External linking is good'
        ]
      }
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

export async function getTrendingTopics(req, res) {
  try {
    res.json({
      status: 'success',
      topics: [],
      msg: 'Trending topics requires API integration'
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

export async function optimizeImageSEO(req, res) {
  try {
    const { imageUrl, altText, articleContext } = req.body;
    
    const recommendations = [];
    
    if (!altText || altText.length < 10) {
      recommendations.push('Alt text should be descriptive (at least 10 characters)');
    }
    
    if (!imageUrl.includes('.webp') && !imageUrl.includes('cloudinary')) {
      recommendations.push('Consider using WebP format for better performance');
    }

    res.json({
      status: 'success',
      recommendations
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}