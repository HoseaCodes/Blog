import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import { 
  FiCpu, FiEdit3, FiRefreshCw, FiZap, FiTarget, FiTrendingUp,
  FiBook, FiSearch, FiCheckCircle, FiAlertTriangle, FiMic,
  FiCopy, FiDownload, FiSettings, FiStar, FiEye, FiGlobe,
  FiBarChart2, FiUsers, FiClock, FiTag, FiLink2, FiImage, FiX
} from "react-icons/fi";

const AIContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
`;

const AIHeader = styled.div`
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

const AITitle = styled.h2`
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 700;
`;

const AISubtitle = styled.p`
  margin: 0;
  opacity: 0.8;
  font-size: 0.9rem;
`;

const AIContent = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 300px 1fr;
  overflow: hidden;
`;

const AISidebar = styled.div`
  background: rgba(0, 0, 0, 0.1);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1rem;
  overflow-y: auto;
`;

const AIMain = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ToolCategory = styled.div`
  margin-bottom: 1.5rem;
`;

const CategoryTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 0.75rem 0;
  opacity: 0.7;
`;

const ToolButton = styled(motion.button)`
  width: 100%;
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  border: 1px solid ${props => props.active ? 'rgba(255, 255, 255, 0.4)' : 'transparent'};
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 0.5rem;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateX(4px);
  }
`;

const WorkspaceHeader = styled.div`
  padding: 1rem 1.5rem;
  background: rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const WorkspaceContent = styled.div`
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
`;

const PromptInput = styled.textarea`
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: white;
  padding: 1rem;
  font-size: 0.9rem;
  line-height: 1.5;
  resize: none;
  height: 120px;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.4);
  }
`;

const ActionButton = styled(motion.button)`
  background: ${props => props.primary ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ResultCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
`;

const ResultHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const ResultContent = styled.div`
  font-size: 0.9rem;
  line-height: 1.6;
  white-space: pre-wrap;
`;

const QuickActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ScoreCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 0.5rem;
`;

const ScoreValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.score >= 80 ? '#10b981' : props.score >= 60 ? '#f59e0b' : '#ef4444'};
`;

const ScoreLabel = styled.div`
  font-size: 0.75rem;
  opacity: 0.8;
  margin-top: 0.25rem;
`;

const SuggestionChip = styled(motion.div)`
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 0.5rem 1rem;
  margin: 0.25rem 0.25rem 0.25rem 0;
  display: inline-block;
  font-size: 0.75rem;
  cursor: pointer;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const SelectedTextBanner = styled(motion.div)`
  background: rgba(102, 126, 234, 0.3);
  border: 2px solid rgba(102, 126, 234, 0.6);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
`;

const SelectedTextHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
`;

const SelectedTextInfo = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  opacity: 0.9;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ClearButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: white;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  white-space: nowrap;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const SelectedTextContent = styled.div`
  font-size: 0.875rem;
  opacity: 0.9;
  max-height: 80px;
  overflow-y: auto;
  line-height: 1.4;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  padding: 0.75rem;
  margin-bottom: 0.75rem;
  border-left: 3px solid rgba(102, 126, 234, 0.8);
`;

const QuickActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const QuickActionButton = styled(motion.button)`
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.25));
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: white;
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(45deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.35));
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const TipMessage = styled.div`
  font-size: 0.875rem;
  opacity: 0.8;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 8px;
  border-left: 3px solid rgba(102, 126, 234, 0.6);
`;

function AIAssistant({ 
  article, 
  updateArticle, 
  isOpen, 
  setIsOpen, 
  fullscreen = false, 
  aiAPI, 
  selectedText = '', 
  setSelectedText 
}) {
  const [activeCategory, setActiveCategory] = useState('brainstorm');
  const [activeTool, setActiveTool] = useState('topics');
  const [prompt, setPrompt] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Debug logging
  useEffect(() => {
    console.log('AIAssistant - selectedText updated:', {
      selectedText,
      length: selectedText?.length,
      hasText: !!selectedText,
      type: typeof selectedText
    });
  }, [selectedText]);
  
  const aiTools = {
    brainstorm: {
      title: 'Brainstorming & Ideation',
      tools: [
        { id: 'topics', label: 'Topic Generator', icon: FiCpu },
        { id: 'titles', label: 'Title Ideas', icon: FiEdit3 },
        { id: 'hooks', label: 'Opening Hooks', icon: FiZap },
        { id: 'outlines', label: 'Article Outlines', icon: FiBook },
        { id: 'angles', label: 'Unique Angles', icon: FiTarget }
      ]
    },
    editing: {
      title: 'AI Editing Tools',
      tools: [
        { id: 'rewrite', label: 'Rewrite Text', icon: FiRefreshCw },
        { id: 'tone', label: 'Tone Changer', icon: FiUsers },
        { id: 'grammar', label: 'Grammar Fix', icon: FiCheckCircle },
        { id: 'expand', label: 'Expand Content', icon: FiTrendingUp },
        { id: 'simplify', label: 'Simplify Text', icon: FiEdit3 }
      ]
    },
    quality: {
      title: 'Quality Assurance',
      tools: [
        { id: 'clarity', label: 'Clarity Score', icon: FiEye },
        { id: 'readability', label: 'Readability Check', icon: FiBook },
        { id: 'redundancy', label: 'Remove Redundancy', icon: FiAlertTriangle },
        { id: 'engagement', label: 'Engagement Score', icon: FiBarChart2 },
        { id: 'inclusive', label: 'Inclusive Language', icon: FiUsers }
      ]
    },
    seo: {
      title: 'SEO Assistant',
      tools: [
        { id: 'keywords', label: 'Keyword Research', icon: FiSearch },
        { id: 'meta', label: 'Meta Description', icon: FiTag },
        { id: 'headlines', label: 'SEO Headlines', icon: FiTrendingUp },
        { id: 'internal-links', label: 'Internal Links', icon: FiLink2 },
        { id: 'alt-text', label: 'Alt Text Generator', icon: FiImage }
      ]
    },
    research: {
      title: 'Research Assistant',
      tools: [
        { id: 'citations', label: 'Generate Citations', icon: FiBook },
        { id: 'facts', label: 'Fact Check', icon: FiCheckCircle },
        { id: 'sources', label: 'Find Sources', icon: FiSearch },
        { id: 'statistics', label: 'Add Statistics', icon: FiBarChart2 },
        { id: 'examples', label: 'Find Examples', icon: FiTarget }
      ]
    }
  };

  const generateContent = async (toolId, customPrompt = null) => {
    if (!aiAPI) {
      console.error('aiAPI not provided to AIAssistant');
      return;
    }
    
    setIsLoading(true);
    
    try {
      let result;
      const content = selectedText || article.content || '';
      
      console.log('Generating content for:', { toolId, hasSelectedText: !!selectedText, contentLength: content.length });
      
      // Map toolId to aiAPI methods
      switch(toolId) {
        case 'topics':
        case 'hooks':
        case 'angles':
          const contentResult = await aiAPI.generateContent(
            customPrompt || `Generate 10 ${toolId} for: ${article.title || 'technology and software engineering'}. Return as a numbered list.`,
            { contentType: toolId }
          );
          const items = contentResult.content
            .split('\n')
            .filter(line => line.trim())
            .map(line => line.replace(/^\d+\.\s*["']?/, '').replace(/["']?\s*$/, '').trim())
            .filter(item => item.length > 0);
          result = { items, content: contentResult.content };
          break;
          
        case 'titles':
          result = await aiAPI.generateTitles(article.content || article.title || 'technology article');
          break;
          
        case 'outlines':
          result = await aiAPI.generateOutline(article.title || 'Article outline', article.description || '');
          break;
          
        case 'rewrite':
        case 'tone':
          result = await aiAPI.improveContent(content.substring(0, 500));
          break;
          
        case 'grammar':
          result = await aiAPI.checkGrammar(content.substring(0, 1000));
          break;
          
        case 'expand':
          result = await aiAPI.expandContent(content.substring(0, 500));
          break;
          
        case 'simplify':
          result = await aiAPI.summarizeContent(content);
          break;
          
        case 'keywords':
          result = { keywords: ['SEO', 'keywords', 'coming', 'soon'] };
          break;
          
        case 'meta':
          result = await aiAPI.generateMetaTags(article.title || '', article.content || '');
          break;
          
        default:
          result = await aiAPI.generateContent(
            customPrompt || prompt || `Help with: ${toolId}`,
            { contentType: toolId }
          );
      }
      
      // Format result for display
      let formattedResult;
      if (result.items && Array.isArray(result.items)) {
        formattedResult = result.items;
      } else if (result.titles && Array.isArray(result.titles)) {
        formattedResult = result.titles;
      } else if (typeof result === 'string') {
        formattedResult = result;
      } else if (result.content) {
        formattedResult = result.content;
      } else {
        formattedResult = JSON.stringify(result, null, 2);
      }
      
      setResults(prev => [{
        id: Date.now(),
        tool: toolId,
        prompt: customPrompt || toolId,
        content: formattedResult,
        timestamp: new Date(),
        wasSelectedText: !!selectedText
      }, ...prev]);

    } catch (error) {
      console.error('AI Generation Error:', error);
      setResults(prev => [{
        id: Date.now(),
        tool: toolId,
        prompt: customPrompt || toolId,
        content: `Error: ${error.message || 'Failed to generate content'}`,
        timestamp: new Date(),
        error: true
      }, ...prev]);
    }
    
    setIsLoading(false);
  };

  const applyResult = (content) => {
    if (activeTool === 'titles' || activeTool === 'hooks') {
      updateArticle({ title: content });
    } else if (activeTool === 'meta') {
      updateArticle({
        publishing: {
          ...article.publishing,
          seo: {
            ...article.publishing?.seo,
            metaDescription: content
          }
        }
      });
    } else {
      // For other tools, append or replace content
      const newContent = selectedText ? 
        article.content.replace(selectedText, content) : 
        (article.content || '') + '\n\n' + content;
      
      updateArticle({ content: newContent });
      
      // Clear selection after applying
      if (selectedText && setSelectedText) {
        setSelectedText('');
      }
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleQuickAction = async (actionType) => {
    if (!selectedText) {
      console.warn('No selected text for quick action');
      return;
    }

    console.log('Quick action triggered:', { actionType, selectedText: selectedText.substring(0, 50) + '...' });
    
    setActiveCategory('editing');
    setActiveTool(actionType);
    
    await generateContent(actionType, `${actionType} this text: "${selectedText}"`);
  };

  const qualityScores = {
    clarity: 85,
    readability: 92,
    engagement: 78,
    seo: 73,
    originality: 88
  };

  return (
    <AIContainer>
      <AIHeader>
        <AITitle>AI Writing Assistant</AITitle>
        <AISubtitle>
          Powered by GPT • {results.length} suggestions generated
        </AISubtitle>
      </AIHeader>

      <AIContent>
        <AISidebar>
          {Object.entries(aiTools).map(([categoryKey, category]) => (
            <ToolCategory key={categoryKey}>
              <CategoryTitle>{category.title}</CategoryTitle>
              {category.tools.map(tool => (
                <ToolButton
                  key={tool.id}
                  active={activeTool === tool.id}
                  onClick={() => {
                    setActiveCategory(categoryKey);
                    setActiveTool(tool.id);
                  }}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <tool.icon size={16} />
                  {tool.label}
                </ToolButton>
              ))}
            </ToolCategory>
          ))}

          <ToolCategory>
            <CategoryTitle>Quality Scores</CategoryTitle>
            {Object.entries(qualityScores).map(([metric, score]) => (
              <ScoreCard key={metric}>
                <ScoreValue score={score}>{score}/100</ScoreValue>
                <ScoreLabel>{metric.charAt(0).toUpperCase() + metric.slice(1)}</ScoreLabel>
              </ScoreCard>
            ))}
          </ToolCategory>
        </AISidebar>

        <AIMain>
          <WorkspaceHeader>
            <h3 style={{ margin: 0 }}>
              {aiTools[activeCategory]?.tools.find(t => t.id === activeTool)?.label}
            </h3>
            <ActionButton
              primary
              onClick={() => generateContent(activeTool)}
              disabled={isLoading}
            >
              {isLoading ? <FiRefreshCw className="spin" /> : <FiStar />}
              {isLoading ? 'Generating...' : 'Generate'}
            </ActionButton>
          </WorkspaceHeader>

          <WorkspaceContent>
            {/* Selected Text Banner - This is the key section */}
            {selectedText && selectedText.trim().length > 0 && (
              <SelectedTextBanner
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <SelectedTextHeader>
                  <SelectedTextInfo>
                    <FiEdit3 size={14} />
                    Selected Text ({selectedText.length} characters)
                  </SelectedTextInfo>
                  <ClearButton onClick={() => setSelectedText && setSelectedText('')}>
                    <FiX size={12} />
                    Clear
                  </ClearButton>
                </SelectedTextHeader>
                
                <SelectedTextContent>
                  "{selectedText}"
                </SelectedTextContent>
                
                <QuickActionButtons>
                  <QuickActionButton
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleQuickAction('rewrite')}
                    disabled={isLoading}
                  >
                    <FiRefreshCw size={12} />
                    Improve
                  </QuickActionButton>
                  
                  <QuickActionButton
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleQuickAction('grammar')}
                    disabled={isLoading}
                  >
                    <FiCheckCircle size={12} />
                    Fix Grammar
                  </QuickActionButton>
                  
                  <QuickActionButton
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleQuickAction('simplify')}
                    disabled={isLoading}
                  >
                    <FiEdit3 size={12} />
                    Simplify
                  </QuickActionButton>
                  
                  <QuickActionButton
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleQuickAction('expand')}
                    disabled={isLoading}
                  >
                    <FiTrendingUp size={12} />
                    Expand
                  </QuickActionButton>
                </QuickActionButtons>
              </SelectedTextBanner>
            )}
            
            {/* Tip message when text is selected */}
            {selectedText && selectedText.trim().length > 0 && (
              <TipMessage>
                💡 <strong>Tip:</strong> Use the quick action buttons above, or select a tool from the sidebar and click "Generate" to work with your selected text.
              </TipMessage>
            )}
            
            {/* Debug info - remove in production */}
            {process.env.NODE_ENV === 'development' && (
              <div style={{ 
                fontSize: '0.75rem', 
                opacity: 0.6, 
                background: 'rgba(0,0,0,0.2)',
                padding: '0.5rem',
                borderRadius: '4px',
                marginBottom: '1rem'
              }}>
                Debug: selectedText = "{selectedText}" (length: {selectedText?.length || 0})
              </div>
            )}
            
            <PromptInput
              placeholder="Enter custom prompt or use the default AI suggestion..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />

            <div style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>
              <h4 style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>Quick Suggestions:</h4>
              {activeTool === 'topics' && [
                'Generate topics for beginners',
                'Advanced technical topics',
                'Industry trend topics',
                'Tutorial-style topics'
              ].map(suggestion => (
                <SuggestionChip
                  key={suggestion}
                  onClick={() => setPrompt(suggestion)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {suggestion}
                </SuggestionChip>
              ))}
            </div>

            <AnimatePresence>
              {results.map((result) => (
                <ResultCard
                  key={result.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  layout
                >
                  <ResultHeader>
                    <div>
                      <strong>
                        {aiTools[activeCategory]?.tools.find(t => t.id === result.tool)?.label}
                        {result.wasSelectedText && <span style={{ opacity: 0.7 }}> (from selection)</span>}
                      </strong>
                      <div style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '0.25rem' }}>
                        {result.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                    <QuickActions>
                      <ActionButton onClick={() => copyToClipboard(
                        Array.isArray(result.content) ? result.content.join('\n') : result.content
                      )}>
                        <FiCopy size={14} />
                        Copy
                      </ActionButton>
                      <ActionButton 
                        primary
                        onClick={() => applyResult(
                          Array.isArray(result.content) ? result.content[0] : result.content
                        )}
                      >
                        <FiCheckCircle size={14} />
                        Apply
                      </ActionButton>
                    </QuickActions>
                  </ResultHeader>
                  <ResultContent>
                    {Array.isArray(result.content) ? (
                      <ol style={{ margin: 0, paddingLeft: '1.5rem' }}>
                        {result.content.map((item, idx) => (
                          <li key={idx} style={{ marginBottom: '0.5rem', cursor: 'pointer' }}
                              onClick={() => applyResult(item)}
                              title="Click to use this">
                            {item}
                          </li>
                        ))}
                      </ol>
                    ) : (
                      result.content
                    )}
                  </ResultContent>
                </ResultCard>
              ))}
            </AnimatePresence>

            {results.length === 0 && !isLoading && (
              <div style={{ textAlign: 'center', padding: '3rem', opacity: 0.6 }}>
                <FiCpu size={48} style={{ marginBottom: '1rem' }} />
                <p>Select a tool and click Generate to get AI-powered suggestions</p>
                {selectedText && (
                  <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                    Or use the quick action buttons above to work with your selected text
                  </p>
                )}
              </div>
            )}
          </WorkspaceContent>
        </AIMain>
      </AIContent>
    </AIContainer>
  );
}

export default AIAssistant;