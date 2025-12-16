import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import { 
  FiTrendingUp, FiSearch, FiTarget, FiEye, FiGlobe, FiLink,
  FiCheckCircle, FiAlertTriangle, FiX, FiRefreshCw, FiBarChart2,
  FiCopy, FiEdit3, FiImage, FiShare2, FiMonitor, FiClock,
  FiHash, FiPlus, FiZap, FiSettings
} from "react-icons/fi";

const SEOContainer = styled.div`
  padding: 1.5rem;
  background: rgba(15, 15, 35, 0.8);
  color: white;
  overflow-y: auto;
  height: 100%;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const ScoreCard = styled(motion.div)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  text-align: center;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
`;

const OverallScore = styled.div`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const ScoreLabel = styled.div`
  font-size: 1rem;
  opacity: 0.9;
  margin-bottom: 1rem;
`;

const ScoreBreakdown = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-top: 1rem;
`;

const MiniScore = styled.div`
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.75rem 0.5rem;
  backdrop-filter: blur(10px);
`;

const MiniScoreValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.score >= 80 ? '#10b981' : props.score >= 60 ? '#f59e0b' : '#ef4444'};
`;

const MiniScoreLabel = styled.div`
  font-size: 0.75rem;
  opacity: 0.8;
  margin-top: 0.25rem;
  text-transform: capitalize;
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #667eea;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

const ActionButton = styled(motion.button)`
  background: ${props => props.primary ? 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)' : 'rgba(102, 126, 234, 0.2)'};
  border: 1px solid ${props => props.primary ? 'transparent' : '#667eea'};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.primary ? 'linear-gradient(45deg, #5a67d8 0%, #6b46c1 100%)' : 'rgba(102, 126, 234, 0.3)'};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ControlsRow = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
`;

const AutoAnalyzeToggle = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
  user-select: none;
  
  input {
    margin: 0;
    accent-color: #667eea;
  }
`;

const AnalysisStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  opacity: 0.7;
  margin-left: auto;
`;

const KeywordsSection = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const KeywordsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: between;
  margin-bottom: 1rem;
`;

const KeywordsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
  min-height: 2rem;
`;

const KeywordTag = styled(motion.span)`
  background: rgba(102, 126, 234, 0.3);
  color: #667eea;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid rgba(102, 126, 234, 0.5);
  backdrop-filter: blur(10px);
`;

const RemoveKeywordBtn = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  opacity: 0.7;
  
  &:hover {
    opacity: 1;
    color: #ef4444;
  }
`;

const KeywordInput = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  
  input {
    flex: 1;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 6px;
    padding: 0.5rem;
    color: white;
    font-size: 0.875rem;
    
    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
    
    &:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
    }
  }
`;

const NoKeywords = styled.div`
  font-size: 0.75rem;
  opacity: 0.5;
  font-style: italic;
  text-align: center;
  padding: 1rem;
`;

const ChecklistItem = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  margin-bottom: 0.75rem;
  border-left: 4px solid ${props => {
    switch (props.status) {
      case 'pass': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'fail': return '#ef4444';
      default: return '#6b7280';
    }
  }};
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
`;

const StatusIcon = styled.div`
  margin-top: 0.125rem;
  color: ${props => {
    switch (props.status) {
      case 'pass': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'fail': return '#ef4444';
      default: return '#6b7280';
    }
  }};
  display: flex;
  align-items: center;
`;

const SuggestionCard = styled(motion.div)`
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 0.75rem;
  backdrop-filter: blur(20px);
  
  &:hover {
    background: rgba(102, 126, 234, 0.15);
  }
`;

const SuggestionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const SuggestionType = styled.div`
  font-weight: 600;
  font-size: 0.875rem;
  color: #667eea;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SuggestionPriority = styled.span`
  font-size: 0.625rem;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-weight: 600;
  text-transform: uppercase;
  background: ${props => {
    switch (props.level) {
      case 'high': return 'rgba(239, 68, 68, 0.2)';
      case 'medium': return 'rgba(245, 158, 11, 0.2)';
      default: return 'rgba(59, 130, 246, 0.2)';
    }
  }};
  color: ${props => {
    switch (props.level) {
      case 'high': return '#fca5a5';
      case 'medium': return '#fbbf24';
      default: return '#93c5fd';
    }
  }};
`;

const SuggestionActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
`;

const RateLimitWarning = styled(motion.div)`
  background: rgba(245, 158, 11, 0.2);
  border: 1px solid #f59e0b;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  backdrop-filter: blur(20px);
`;

const SearchPreview = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  backdrop-filter: blur(20px);
`;

const PreviewTitle = styled.div`
  color: #4285f4;
  font-size: 1.125rem;
  margin-bottom: 0.25rem;
  text-decoration: underline;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    color: #5a9dfb;
  }
`;

const PreviewUrl = styled.div`
  color: #34a853;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`;

const PreviewDescription = styled.div`
  color: #e8eaed;
  font-size: 0.875rem;
  line-height: 1.4;
  opacity: 0.9;
`;

function SEOAnalyzer({ article, updateArticle, performanceScore, seoAPI }) {
  // State management
  const [seoChecklist, setSeoChecklist] = useState([]);
  const [keywordSuggestions, setKeywordSuggestions] = useState([]);
  const [metaSuggestions, setMetaSuggestions] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalyzed, setLastAnalyzed] = useState(null);
  const [autoAnalyze, setAutoAnalyze] = useState(false);
  const [rateLimitWarning, setRateLimitWarning] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [showKeywordInput, setShowKeywordInput] = useState(false);

  // Rate limiting and caching
  const lastApiCall = useRef(0);
  const analysisCache = useRef(new Map());
  const analysisTimer = useRef(null);
  const RATE_LIMIT_MS = 15000;
  const CACHE_DURATION_MS = 300000;
  const AUTO_ANALYZE_DELAY_MS = 45000;

  // Content fingerprint for caching
  const contentFingerprint = useMemo(() => {
    const title = (article.title || '').trim();
    const content = (article.content || '').trim();
    const description = (article.description || '').trim();
    const combined = `${title}|${content.length}|${description}`;
    return btoa(combined).substring(0, 20);
  }, [article.title, article.content, article.description]);

  // Calculate dynamic SEO breakdown scores
  const seoScores = useMemo(() => {
    // Keywords score (0-100)
    let keywordsScore = 0;
    const tags = article.metadata?.tags || [];
    const hasTitle = article.title && article.title.length >= 30;
    const hasDescription = article.description && article.description.length >= 100;
    
    if (tags.length >= 5) keywordsScore += 10;
    else if (tags.length >= 3) keywordsScore += 7;
    else if (tags.length >= 1) keywordsScore += 4;

    // Structure score (0-100)  
    let structureScore = 0;
    const content = article.content || '';
    const hasH2 = content.includes('## ');
    const hasH3 = content.includes('### ');
    const hasLists = content.includes('- ') || content.includes('* ');
    const hasCodeBlocks = content.includes('```');
    const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;
    
    if (hasH2) structureScore += 6;
    if (hasH3) structureScore += 4;
    if (hasLists) structureScore += 3;
    if (hasCodeBlocks) structureScore += 2;

    // Meta score (0-100)
    let metaScore = 0;
    const titleLength = article.title?.length || 0;
    const metaDesc = article.publishing?.seo?.metaDescription || '';
    const metaDescLength = metaDesc.length;
    const hasSlug = article.slug && article.slug.length > 0;
    const hasCategory = article.metadata?.category && article.metadata.category.length > 0;
    
    if (titleLength >= 50 && titleLength <= 60) metaScore += 25;
    else if (titleLength > 0) metaScore += 15;
    
    if (metaDescLength >= 150 && metaDescLength <= 160) metaScore += 30;
    else if (metaDescLength > 0) metaScore += 15;
    
    if (hasSlug) metaScore += 20;
    if (hasCategory) metaScore += 25;

    // Links score (0-100)
    let linksScore = 0;
    const hasLinks = content.includes('[') && content.includes('](');
    const hasImages = content.includes('![') || article.media?.featuredImage;
    const linkCount = (content.match(/\[.*?\]\(.*?\)/g) || []).length;
    const imageCount = (content.match(/!\[.*?\]\(.*?\)/g) || []).length;
    
    if (linkCount >= 3) linksScore += 2;
    else if (linkCount >= 1) linksScore += 1;
    
    if (imageCount >= 2) linksScore += 2;
    else if (imageCount >= 1) linksScore += 1;

    return {
      keywords: Math.min(100, keywordsScore),
      structure: Math.min(100, structureScore),
      meta: Math.min(100, metaScore),
      links: Math.min(100, linksScore)
    };
  }, [article]);

  // Generate suggestions based on actual low scores
  const generateSuggestions = useCallback(() => {
    const suggestions = [];
    const scores = seoScores;

    // Only suggest if scores are actually low
    if (scores.keywords < 7) {
      const tags = article.metadata?.tags || [];
      suggestions.push({
        id: 'keywords',
        type: 'Keywords',
        icon: FiHash,
        priority: 'medium',
        message: tags.length === 0 ? 
          'Add keywords/tags to your article' : 
          `Add more keywords (you have ${tags.length}, aim for 5+)`,
        action: 'add_keywords',
        currentCount: tags.length,
        targetCount: 5
      });
    }

    if (scores.structure < 10) {
      const content = article.content || '';
      const missing = [];
      if (!content.includes('## ')) missing.push('H2 headings (##)');
      if (!content.includes('### ')) missing.push('H3 subheadings (###)');
      if (!content.includes('- ') && !content.includes('* ')) missing.push('bullet lists');
      
      suggestions.push({
        id: 'structure',
        type: 'Structure',
        icon: FiBarChart2,
        priority: 'medium',
        message: `Add ${missing.slice(0, 2).join(' and ')} to improve content structure`,
        action: 'improve_structure',
        missing
      });
    }

    if (scores.meta < 50) {
      const titleLength = article.title?.length || 0;
      const descLength = article.publishing?.seo?.metaDescription?.length || 0;
      
      if (titleLength === 0 || titleLength < 30) {
        suggestions.push({
          id: 'title',
          type: 'Title',
          icon: FiEdit3,
          priority: 'high',
          message: titleLength === 0 ? 'Add a title to your article' : 'Title should be at least 30 characters',
          action: 'optimize_title',
          currentLength: titleLength,
          targetLength: '50-60'
        });
      }

      if (descLength === 0 || descLength < 120) {
        suggestions.push({
          id: 'description',
          type: 'Meta Description',
          icon: FiSearch,
          priority: 'high',
          message: descLength === 0 ? 'Add a meta description' : 'Meta description should be at least 120 characters',
          action: 'optimize_description',
          currentLength: descLength,
          targetLength: '150-160'
        });
      }
    }

    if (scores.links < 3) {
      const content = article.content || '';
      const linkCount = (content.match(/\[.*?\]\(.*?\)/g) || []).length;
      const imageCount = (content.match(/!\[.*?\]\(.*?\)/g) || []).length;
      
      const missing = [];
      if (linkCount === 0) missing.push('links');
      if (imageCount === 0) missing.push('images');
      
      if (missing.length > 0) {
        suggestions.push({
          id: 'links',
          type: 'Links & Media',
          icon: FiLink,
          priority: 'low',
          message: `Add ${missing.join(' and ')} to enhance your content`,
          action: 'add_links_media'
        });
      }
    }

    return suggestions;
  }, [seoScores, article]);

  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    setSuggestions(generateSuggestions());
  }, [generateSuggestions]);

  // Keywords management
  const addKeyword = useCallback(() => {
    if (!newKeyword.trim()) return;
    
    const currentTags = article.metadata?.tags || [];
    const updatedTags = [...currentTags, newKeyword.trim()];
    
    updateArticle({
      metadata: {
        ...article.metadata,
        tags: updatedTags
      }
    });
    
    setNewKeyword('');
    setShowKeywordInput(false);
  }, [newKeyword, article, updateArticle]);

  const removeKeyword = useCallback((index) => {
    const currentTags = article.metadata?.tags || [];
    const updatedTags = currentTags.filter((_, i) => i !== index);
    
    updateArticle({
      metadata: {
        ...article.metadata,
        tags: updatedTags
      }
    });
  }, [article, updateArticle]);

  // Apply suggestion handlers
  const applySuggestion = useCallback((suggestion) => {
    switch (suggestion.action) {
      case 'optimize_title':
        if (!article.title || article.title.length < 30) {
          const optimizedTitle = article.title ? 
            `${article.title} - Complete Guide` :
            `Complete Guide to ${article.metadata?.category || 'Your Topic'}`;
          updateArticle({ title: optimizedTitle });
        }
        break;

      case 'optimize_description':
        if (!article.publishing?.seo?.metaDescription) {
          const autoDescription = generateMetaDescription(article.content, article.title);
          updateArticle({
            publishing: {
              ...article.publishing,
              seo: {
                ...article.publishing?.seo,
                metaDescription: autoDescription
              }
            }
          });
        }
        break;

      case 'add_keywords':
        setShowKeywordInput(true);
        break;

      case 'improve_structure':
        if (article.content) {
          const structuredContent = addBasicStructure(article.content);
          updateArticle({ content: structuredContent });
        }
        break;

      case 'add_links_media':
        if (article.content) {
          const enhancedContent = `${article.content}\n\n## Additional Resources\n\n- [Related Resource](https://example.com)\n- [Learn More](https://example.org)\n\n![Example Image](https://via.placeholder.com/400x200)`;
          updateArticle({ content: enhancedContent });
        }
        break;
    }
  }, [article, updateArticle]);

  // Helper functions
  const generateMetaDescription = (content, title) => {
    if (!content) return '';
    const firstSentence = content.split(/[.!?]+/)[0];
    let description = firstSentence.substring(0, 140);
    if (description.length === 140) {
      description = description.substring(0, description.lastIndexOf(' ')) + '...';
    }
    return description;
  };

  const addBasicStructure = (content) => {
    if (!content) return content;
    
    const lines = content.split('\n');
    let structuredLines = [];
    let inCodeBlock = false;
    
    for (let line of lines) {
      if (line.trim().startsWith('```')) {
        inCodeBlock = !inCodeBlock;
      }
      
      if (!inCodeBlock && line.trim() && 
          !line.startsWith('#') && 
          !line.startsWith('- ') && 
          !line.startsWith('* ') &&
          line.length > 20 && 
          line.length < 60 &&
          !line.includes('const ') &&
          !line.includes('function ')) {
        
        if (!line.startsWith('##')) {
          line = '## ' + line;
        }
      }
      
      structuredLines.push(line);
    }
    
    return structuredLines.join('\n');
  };

  // Manual analysis
  const triggerManualAnalysis = useCallback(async () => {
    const now = Date.now();
    const timeSinceLastCall = now - lastApiCall.current;
    
    if (timeSinceLastCall < RATE_LIMIT_MS) {
      const waitTime = Math.ceil((RATE_LIMIT_MS - timeSinceLastCall) / 1000);
      setRateLimitWarning(`Please wait ${waitTime} more seconds before analyzing again.`);
      setTimeout(() => setRateLimitWarning(''), 3000);
      return;
    }

    setIsAnalyzing(true);
    lastApiCall.current = now;

    try {
      // Use your existing seoAPI pattern
      if (seoAPI && article.content?.length > 100) {
        const analysisResult = await seoAPI.analyzeSEO(
          article.title || '',
          article.content || '',
          article.description || '',
          article.metadata?.tags || []
        );
        
        console.log('SEO Analysis Result:', analysisResult);
        setLastAnalyzed(new Date());
      }
    } catch (error) {
      console.error('SEO analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [article, seoAPI]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pass': return <FiCheckCircle />;
      case 'warning': return <FiAlertTriangle />;
      case 'fail': return <FiX />;
      default: return <FiAlertTriangle />;
    }
  };

  const overallSEOScore = performanceScore?.seo || 0;

  return (
    <SEOContainer>
      {/* Overall SEO Score */}
      <ScoreCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <OverallScore>{overallSEOScore}/100</OverallScore>
        <ScoreLabel>Overall SEO Score</ScoreLabel>
        
        <ScoreBreakdown>
          {Object.entries(seoScores).map(([category, score]) => (
            <MiniScore key={category}>
              <MiniScoreValue score={score}>{score}</MiniScoreValue>
              <MiniScoreLabel>{category}</MiniScoreLabel>
            </MiniScore>
          ))}
        </ScoreBreakdown>
      </ScoreCard>

      {/* Analysis Controls */}
      <Section>
        <SectionHeader>
          <SectionTitle>
            <FiZap />
            SEO Analysis
          </SectionTitle>
        </SectionHeader>

        <ControlsRow>
          <AutoAnalyzeToggle>
            <input
              type="checkbox"
              checked={autoAnalyze}
              onChange={(e) => setAutoAnalyze(e.target.checked)}
            />
            Auto-analyze (45s delay)
          </AutoAnalyzeToggle>
          
          <ActionButton
            primary
            onClick={triggerManualAnalysis}
            disabled={isAnalyzing}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiRefreshCw className={isAnalyzing ? 'spin' : ''} />
            {isAnalyzing ? 'Analyzing...' : 'Analyze Now'}
          </ActionButton>

          {lastAnalyzed && (
            <AnalysisStatus>
              <FiClock />
              Last: {lastAnalyzed.toLocaleTimeString()}
            </AnalysisStatus>
          )}
        </ControlsRow>

        <AnimatePresence>
          {rateLimitWarning && (
            <RateLimitWarning
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <FiAlertTriangle />
              {rateLimitWarning}
            </RateLimitWarning>
          )}
        </AnimatePresence>
      </Section>

      {/* Keywords Management */}
      <Section>
        <SectionHeader>
          <SectionTitle>
            <FiHash />
            Keywords & Tags
          </SectionTitle>
          <ActionButton
            onClick={() => setShowKeywordInput(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiPlus />
            Add Keyword
          </ActionButton>
        </SectionHeader>

        <KeywordsSection>
          <KeywordsList>
            <AnimatePresence>
              {(article.metadata?.tags || []).map((tag, index) => (
                <KeywordTag
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                >
                  {tag}
                  <RemoveKeywordBtn onClick={() => removeKeyword(index)}>
                    <FiX size={12} />
                  </RemoveKeywordBtn>
                </KeywordTag>
              ))}
            </AnimatePresence>
            
            {(article.metadata?.tags || []).length === 0 && (
              <NoKeywords>No keywords added yet. Click "Add Keyword" to get started.</NoKeywords>
            )}
          </KeywordsList>

          <AnimatePresence>
            {showKeywordInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <KeywordInput>
                  <input
                    type="text"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                    placeholder="Enter keyword..."
                    autoFocus
                  />
                  <ActionButton
                    primary
                    onClick={addKeyword}
                    disabled={!newKeyword.trim()}
                  >
                    Add
                  </ActionButton>
                  <ActionButton
                    onClick={() => {
                      setShowKeywordInput(false);
                      setNewKeyword('');
                    }}
                  >
                    Cancel
                  </ActionButton>
                </KeywordInput>
              </motion.div>
            )}
          </AnimatePresence>
        </KeywordsSection>
      </Section>

      {/* Improvement Suggestions */}
      {suggestions.length > 0 && (
        <Section>
          <SectionHeader>
            <SectionTitle>
              <FiTarget />
              Improvement Suggestions
            </SectionTitle>
          </SectionHeader>

          <AnimatePresence>
            {suggestions.map((suggestion, index) => (
              <SuggestionCard
                key={suggestion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <SuggestionHeader>
                  <SuggestionType>
                    <suggestion.icon size={16} />
                    {suggestion.type}
                  </SuggestionType>
                  <SuggestionPriority level={suggestion.priority}>
                    {suggestion.priority} priority
                  </SuggestionPriority>
                </SuggestionHeader>
                
                <div style={{ fontSize: '0.875rem', marginBottom: '0.75rem', lineHeight: 1.4 }}>
                  {suggestion.message}
                </div>
                
                <SuggestionActions>
                  <ActionButton
                    primary
                    onClick={() => applySuggestion(suggestion)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiZap size={12} />
                    Apply
                  </ActionButton>
                </SuggestionActions>
              </SuggestionCard>
            ))}
          </AnimatePresence>
        </Section>
      )}

      {/* Search Preview */}
      <Section>
        <SectionHeader>
          <SectionTitle>
            <FiEye />
            Search Preview
          </SectionTitle>
        </SectionHeader>

        <SearchPreview>
          <PreviewTitle>
            {article.title || 'Your Article Title Will Appear Here'}
          </PreviewTitle>
          <PreviewUrl>
            https://yourblog.com/{article.slug || 'article-slug'}
          </PreviewUrl>
          <PreviewDescription>
            {article.publishing?.seo?.metaDescription || 
             article.description || 
             'Your meta description will appear here. Add one to see how your article will look in search results.'}
          </PreviewDescription>
        </SearchPreview>
      </Section>
    </SEOContainer>
  );
}

export default SEOAnalyzer;