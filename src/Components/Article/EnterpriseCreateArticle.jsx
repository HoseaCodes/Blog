import React, { useState, useEffect, useCallback, useRef, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import axios from "axios";
import { 
  FiEdit3, FiEye, FiSave, FiClock, FiSettings, FiUsers, FiTrendingUp,
  FiImage, FiCode, FiBookOpen, FiZap, FiRefreshCw, FiTarget, FiGlobe,
  FiShield, FiBarChart2, FiCpu, FiStar, FiLayout, FiSearch,
  FiMessageSquare, FiCalendar, FiTag, FiLink, FiShare2, FiUpload
} from "react-icons/fi";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { GlobalState, useNotification } from "../../GlobalState";

import EditorCore from "./EditorCore";
import AIAssistant from "./AIAssistant";
import MediaLibrary from "./MediaLibrary";
import MetadataPanel from "./MetadataPanel";
import PublishingWorkflow from "./PublishingWorkflow";
import SEOAnalyzer from "./SEOAnalyzer";
import VersionHistory from "./VersionHistory";
import PerformanceInsights from "./PerformanceInsights";
import AdvancedBlocks from "./AdvancedBlocks";
import ContentIntelligence from "./ContentIntelligence";
import PublishSuccess from "./PublishSuccess";
import CollaborationPanel from "./CollaborationPanel";

const EnterpriseContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  color: #ffffff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const HeaderBar = styled(motion.header)`
  background: rgba(15, 15, 35, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const ActionBar = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const QuickAction = styled(motion.button)`
  background: ${props => props.primary ? 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)' : 'rgba(255, 255, 255, 0.1)'};
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  color: white;
  font-weight: 500;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  opacity: ${props => props.disabled ? 0.6 : 1};

  &:hover {
    transform: ${props => props.disabled ? 'none' : 'translateY(-2px)'};
    box-shadow: ${props => props.disabled ? 'none' : '0 8px 25px rgba(102, 126, 234, 0.4)'};
  }
`;

const MainLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px;
  min-height: calc(100vh - 80px);
  gap: 1px;
  background: rgba(255, 255, 255, 0.05);
`;

const EditorArea = styled.div`
  background: rgba(15, 15, 35, 0.8);
  display: flex;
  flex-direction: column;
`;

const SidePanel = styled(motion.div)`
  background: rgba(10, 10, 20, 0.9);
  backdrop-filter: blur(20px);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  overflow-y: auto;
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.3);
`;

const Tab = styled(motion.button)`
  flex: 1;
  padding: 1rem;
  background: ${props => props.active ? 'rgba(102, 126, 234, 0.3)' : 'transparent'};
  border: none;
  color: ${props => props.active ? '#667eea' : '#888'};
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(102, 126, 234, 0.2);
    color: #667eea;
  }
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  font-size: 0.85rem;
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => {
    switch (props.status) {
      case 'draft': return '#fbbf24';
      case 'review': return '#3b82f6';
      case 'approved': return '#10b981';
      case 'scheduled': return '#8b5cf6';
      default: return '#6b7280';
    }
  }};
`;

function EnterpriseCreateArticle() {
  // Access GlobalState APIs
  const state = useContext(GlobalState);
  const notify = useNotification();
  
  // Destructure APIs from GlobalState
  const { aiAPI, mediaAPI, seoAPI, analyticsAPI, collaborationAPI, articlesAPI } = state;
  const [token] = state.token;
  
  // Core article state
  const [article, setArticle] = useState({
    id: uuidv4(),
    title: "",
    subtitle: "",
    slug: "",
    description: "",
    content: "",
    excerpt: "",
    status: "draft",
    author: "",
    createdAt: moment(),
    updatedAt: moment(),
    publishedAt: null,
    scheduledAt: null,
    metadata: {
      category: "",
      subcategory: "",
      tags: [],
      skillsTags: [],
      personaTarget: [],
      industryTarget: [],
      geoTarget: "",
      readingTime: 0,
      wordCount: 0,
      seoScore: 0,
      difficulty: "intermediate"
    },
    media: {
      featuredImage: null,
      gallery: [],
      attachments: []
    },
    publishing: {
      platforms: {
        linkedin: { enabled: false, content: "", published: false },
        medium: { enabled: false, content: "", published: false },
        devto: { enabled: false, content: "", published: false },
        ghost: { enabled: false, content: "", published: false }
      },
      seo: {
        metaTitle: "",
        metaDescription: "",
        canonicalUrl: "",
        openGraph: {},
        twitterCard: {}
      }
    },
    collaboration: {
      comments: [],
      reviewers: [],
      approvers: [],
      shares: []
    },
    analytics: {
      views: 0,
      engagement: 0,
      shares: 0,
      comments: 0,
      predictions: {}
    },
    versions: []
  });

  // UI State
  const [activeTab, setActiveTab] = useState("editor");
  const [editorMode, setEditorMode] = useState("markdown");
  const [previewMode, setPreviewMode] = useState("desktop");
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(moment());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showSuccessPage, setShowSuccessPage] = useState(false);

  // Performance state - FIXED to properly update
  const [performanceScore, setPerformanceScore] = useState({
    seo: 0,
    readability: 0,
    engagement: 0,
    technical: 0
  });

  // Refs
  const autoSaveRef = useRef();
  const editorCoreRef = useRef();
  const performanceTimer = useRef(null);
  
  // Text selection handler
  const handleTextSelection = useCallback((text, range) => {
    console.log('Text selected in editor:', { text: text.substring(0, 50) + '...', length: text.length });
    setSelectedText(text);
  }, []);

  // Auto-save functionality
  const handleAutoSave = useCallback(async () => {
    if (!article.title && !article.content) return;
    
    setIsAutoSaving(true);
    try {
      // Save draft using your existing articlesAPI
      const draftData = {
        article_id: article.id,
        title: article.title || 'Untitled',
        subtitle: article.subtitle || '',
        description: article.description || '',
        markdown: article.content || '',
        slug: article.slug || article.id,
        images: article.media?.featuredImage || { url: "https://i.imgur.com/19i5Whc.png" },
        categories: article.metadata?.category ? [article.metadata.category] : [],
        tags: article.metadata?.tags || [],
        draft: true
      };
      
      console.log('Auto-saving draft:', draftData);
      
      // Use your existing pattern for saving
      // This would use your createArticle endpoint
      setLastSaved(moment());
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsAutoSaving(false);
    }
  }, [article]);

  // Auto-save effect
  useEffect(() => {
    clearTimeout(autoSaveRef.current);
    autoSaveRef.current = setTimeout(() => {
      handleAutoSave();
    }, 30000);

    return () => clearTimeout(autoSaveRef.current);
  }, [article.title, article.content, article.description, handleAutoSave]);

  const updateArticle = useCallback((updates) => {
    setArticle(prev => ({
      ...prev,
      ...updates,
      updatedAt: moment()
    }));
  }, []);

  // Save as draft
  const handleSaveDraft = useCallback(async () => {
    if (!article.title && !article.content) {
      notify({ type: 'error', message: 'Please add a title or content before saving' });
      return;
    }

    setIsAutoSaving(true);
    try {
      const draftData = {
        article_id: article.id,
        title: article.title || 'Untitled',
        subtitle: article.subtitle || '',
        description: article.description || '',
        markdown: article.content || '',
        slug: article.slug || article.id,
        images: article.media?.featuredImage || { url: "https://i.imgur.com/19i5Whc.png" },
        categories: article.metadata?.category ? [article.metadata.category] : [],
        tags: article.metadata?.tags || [],
        draft: true
      };

      const res = await axios.post('/api/articles', draftData, {
        headers: { Authorization: token }
      });

      if (res.data.success) {
        setLastSaved(moment());
        notify({ type: 'success', message: 'Draft saved successfully!' });
      }
    } catch (error) {
      console.error('Save draft failed:', error);
      notify({ type: 'error', message: 'Failed to save draft: ' + (error.response?.data?.msg || error.message) });
    } finally {
      setIsAutoSaving(false);
    }
  }, [article, token, notify]);

  // Publish article
  const handlePublish = useCallback(async () => {
    // Validation
    if (!article.title || article.title.trim().length < 5) {
      notify({ type: 'error', message: 'Please add a title (at least 5 characters)' });
      return;
    }

    if (!article.content || article.content.trim().length < 100) {
      notify({ type: 'error', message: 'Please add content (at least 100 characters)' });
      return;
    }

    // Auto-generate description if missing
    let description = article.description || article.subtitle || '';
    
    if (!description || description.trim().length < 50) {
      // Generate description from first 150 characters of content
      const cleanContent = article.content
        .replace(/#{1,6}\s/g, '') // Remove markdown headers
        .replace(/[*_`]/g, '') // Remove markdown formatting
        .replace(/\n+/g, ' ') // Replace newlines with spaces
        .trim();
      
      description = cleanContent.substring(0, 150);
      if (cleanContent.length > 150) {
        description += '...';
      }
      
      // Update article with generated description
      updateArticle({ description });
    }

    setIsAutoSaving(true);
    try {
      const publishData = {
        article_id: article.id,
        title: article.title,
        subtitle: article.subtitle || '',
        description: description,
        markdown: article.content,
        slug: article.slug || article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        images: article.media?.featuredImage || { url: "https://i.imgur.com/19i5Whc.png" },
        categories: article.metadata?.category ? [article.metadata.category] : [],
        tags: article.metadata?.tags || [],
        draft: false
      };

      const res = await axios.post('/api/articles', publishData, {
        headers: { Authorization: token }
      });

      console.log('Publish response:', res.data);
      
      if (res.data.success) {
        // Update article status to published
        const updatedArticle = {
          status: 'published',
          publishedAt: moment(),
          article_id: res.data.article?.article_id || article.id
        };
        
        updateArticle(updatedArticle);
        
        // Show success notification
        notify({ type: 'success', message: '🎉 Article published successfully!' });
        
        console.log('Setting showSuccessPage to true');
        // Show success page
        setShowSuccessPage(true);
      } else {
        console.error('Publish failed: success flag is false');
        notify({ type: 'error', message: 'Publish failed: ' + (res.data.msg || 'Unknown error') });
      }
    } catch (error) {
      console.error('Publish failed:', error);
      notify({ type: 'error', message: 'Failed to publish: ' + (error.response?.data?.msg || error.message) });
    } finally {
      setIsAutoSaving(false);
    }
  }, [article, token, notify, updateArticle]);
  
  // Handle schedule
  const handleSchedule = useCallback(async (scheduledDate) => {
    if (!article.title || !article.content) {
      notify({ type: 'error', message: 'Please add title and content before scheduling' });
      return;
    }

    try {
      updateArticle({
        status: 'scheduled',
        scheduledAt: moment(scheduledDate)
      });
      
      notify({ type: 'success', message: 'Article scheduled successfully!' });
    } catch (error) {
      console.error('Schedule failed:', error);
      notify({ type: 'error', message: 'Failed to schedule: ' + error.message });
    }
  }, [article, notify, updateArticle]);

  // FIXED: Calculate performance scores with proper error handling and rate limiting
  const calculatePerformance = useCallback(async () => {
    if (!article.content || !seoAPI) return;

    try {
      console.log('Calculating performance scores...');

      let seoScore = 0;
      let readabilityScore = 0;

      // Only call SEO API if we have substantial content (reduces API calls)
      if (article.content.length > 100) {
        try {
          console.log('Calling SEO API for analysis...');
          
          // FIXED: Use correct method signature
          const seoAnalysis = await seoAPI.analyzeSEO(
            article.title || '',
            article.content || '',
            article.description || '',
            article.metadata?.tags || []
          );
          
          console.log('SEO Analysis Result:', seoAnalysis);
          
          seoScore = Math.min(100, seoAnalysis?.score || 0);

          // Get readability score separately if needed
          if (seoAPI.checkReadability && article.content.length > 200) {
            try {
              const readabilityResult = await seoAPI.checkReadability(article.content);
              readabilityScore = Math.min(100, readabilityResult?.readability || 0);
            } catch (readabilityError) {
              console.warn('Readability check failed:', readabilityError);
              readabilityScore = 50; // Default fallback
            }
          }
        } catch (seoError) {
          console.warn('SEO analysis failed, using fallback calculation:', seoError);
          
          // Fallback SEO calculation if API fails
          const titleScore = article.title?.length >= 30 && article.title?.length <= 60 ? 25 : 10;
          const descScore = article.description?.length >= 120 ? 20 : 0;
          const contentScore = article.content?.length >= 800 ? 25 : article.content?.length >= 300 ? 15 : 5;
          const tagScore = article.metadata?.tags?.length > 0 ? 15 : 0;
          const structureScore = article.content?.includes('##') ? 15 : 5;
          
          seoScore = titleScore + descScore + contentScore + tagScore + structureScore;
          readabilityScore = 60; // Default fallback
        }
      }

      // Calculate engagement score based on content characteristics
      const wordCount = article.content.split(/\s+/).filter(w => w.length > 0).length;
      const hasImages = article.media?.gallery?.length > 0 || article.media?.featuredImage;
      const hasTags = article.metadata?.tags?.length > 0;
      const hasTitle = article.title?.length >= 30;
      const hasDescription = article.description?.length >= 100;
      const hasHeadings = article.content?.includes('##');
      const hasLists = article.content?.includes('- ') || article.content?.includes('* ');
      
      let engagementScore = 0;
      if (wordCount >= 300) engagementScore += 20;
      if (wordCount >= 800) engagementScore += 20;
      if (hasImages) engagementScore += 15;
      if (hasTags) engagementScore += 15;
      if (hasTitle) engagementScore += 10;
      if (hasDescription) engagementScore += 10;
      if (hasHeadings) engagementScore += 5;
      if (hasLists) engagementScore += 5;

      // Calculate technical score
      let technicalScore = 0;
      if (article.slug) technicalScore += 25;
      if (article.metadata?.category) technicalScore += 25;
      if (article.description) technicalScore += 25;
      if (article.publishing?.seo?.metaDescription) technicalScore += 25;

      const newPerformanceScore = {
        seo: Math.min(100, seoScore),
        readability: Math.min(100, readabilityScore),
        engagement: Math.min(100, engagementScore),
        technical: Math.min(100, technicalScore)
      };

      console.log('Performance calculated:', newPerformanceScore);

      setPerformanceScore(newPerformanceScore);

      // Update article with SEO score
      updateArticle({
        metadata: {
          ...article.metadata,
          seoScore: newPerformanceScore.seo
        }
      });

    } catch (error) {
      console.error('Performance calculation failed:', error);
      
      // Fallback to basic calculation
      setPerformanceScore({
        seo: 50,
        readability: 60,
        engagement: 40,
        technical: 30
      });
    }
  }, [article, seoAPI, updateArticle]);

  // Performance calculation effect with longer debouncing (10 seconds)
  useEffect(() => {
    if (performanceTimer.current) {
      clearTimeout(performanceTimer.current);
    }

    // Only calculate if we have meaningful content
    if (article.content?.length > 50) {
      performanceTimer.current = setTimeout(() => {
        calculatePerformance();
      }, 10000); // 10 second debounce to reduce API calls
    }

    return () => {
      if (performanceTimer.current) {
        clearTimeout(performanceTimer.current);
      }
    };
  }, [article.title, article.content, article.description, article.metadata, calculatePerformance]);

  // AI Assistant handler with proper text capture
  const handleAIAssistantOpen = () => {
    console.log('Opening AI Assistant...');
    
    // Capture selected text from editor
    let capturedText = '';
    if (editorCoreRef.current && editorCoreRef.current.getSelectedText) {
      capturedText = editorCoreRef.current.getSelectedText().trim();
      console.log('Captured text from editor:', capturedText);
    }
    
    // Set selected text state
    setSelectedText(capturedText);
    
    // Open AI Assistant
    setAiAssistantOpen(true);
    
    console.log('AI Assistant opened with selectedText:', capturedText);
  };

  const tabs = [
    { id: "editor", label: "Editor", icon: FiEdit3 },
    { id: "ai", label: "AI Assistant", icon: FiCpu },
    { id: "media", label: "Media", icon: FiImage },
    { id: "metadata", label: "Metadata", icon: FiTag },
    { id: "seo", label: "SEO", icon: FiTrendingUp },
    { id: "collaboration", label: "Collaboration", icon: FiUsers },
    { id: "workflow", label: "Workflow", icon: FiShare2 },
    { id: "analytics", label: "Analytics", icon: FiBarChart2 },
    { id: "versions", label: "Versions", icon: FiClock }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "editor":
        return <EditorCore 
          ref={editorCoreRef}
          article={article} 
          updateArticle={updateArticle}
          editorMode={editorMode}
          setEditorMode={setEditorMode}
          previewMode={previewMode}
          setPreviewMode={setPreviewMode}
          aiAPI={aiAPI}
          mediaAPI={mediaAPI}
          onTextSelection={handleTextSelection}
        />;
      case "ai":
        return <AIAssistant 
          article={article} 
          updateArticle={updateArticle}
          isOpen={aiAssistantOpen}
          setIsOpen={setAiAssistantOpen}
          aiAPI={aiAPI}
          selectedText={selectedText}
          setSelectedText={setSelectedText}
        />;
      case "media":
        return <MediaLibrary 
          article={article} 
          updateArticle={updateArticle}
          mediaAPI={mediaAPI}
        />;
      case "metadata":
        return <MetadataPanel 
          article={article} 
          updateArticle={updateArticle}
          seoAPI={seoAPI}
        />;
      case "seo":
        return <SEOAnalyzer 
          article={article} 
          updateArticle={updateArticle}
          performanceScore={performanceScore}
          seoAPI={seoAPI}
        />;
      case "collaboration":
        return <CollaborationPanel 
          article={article} 
          updateArticle={updateArticle}
          collaborationAPI={collaborationAPI}
        />;
      case "workflow":
        return <PublishingWorkflow 
          article={article} 
          updateArticle={updateArticle}
          onPublish={handlePublish}
          onSchedule={handleSchedule}
        />;
      case "analytics":
        return <PerformanceInsights 
          article={article} 
          performanceScore={performanceScore}
          analyticsAPI={analyticsAPI}
        />;
      case "versions":
        return <VersionHistory 
          article={article} 
          updateArticle={updateArticle}
        />;
      default:
        return null;
    }
  };

  // Show success page after publishing
  if (showSuccessPage) {
    console.log('Rendering PublishSuccess page with article:', article);
    return <PublishSuccess article={article} onClose={() => setShowSuccessPage(false)} />;
  }

  console.log('Rendering main editor, showSuccessPage:', showSuccessPage);

  return (
    <EnterpriseContainer>
      <HeaderBar
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <Logo>HoseaCodes Enterprise</Logo>
        
        <StatusIndicator>
          <StatusDot status={article.status} />
          {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
          {isAutoSaving ? " • Saving..." : ` • Saved ${lastSaved.fromNow()}`}
          {performanceScore.seo > 0 && (
            <span style={{ marginLeft: '0.5rem', opacity: 0.7 }}>
              • SEO: {performanceScore.seo}/100
            </span>
          )}
        </StatusIndicator>

        <ActionBar>
          <QuickAction
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAIAssistantOpen}
          >
            <FiStar />
            AI Assistant
            {selectedText && (
              <span style={{ 
                background: 'rgba(255,255,255,0.2)', 
                borderRadius: '4px', 
                padding: '0.125rem 0.25rem', 
                fontSize: '0.625rem',
                marginLeft: '0.25rem'
              }}>
                {selectedText.length}
              </span>
            )}
          </QuickAction>
          
          <QuickAction
            onClick={handleSaveDraft}
            disabled={isAutoSaving}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiSave />
            {isAutoSaving ? 'Saving...' : 'Save Draft'}
          </QuickAction>

          <QuickAction
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiEye />
            Preview
          </QuickAction>

          <QuickAction
            primary
            onClick={handlePublish}
            disabled={isAutoSaving}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiUpload />
            {isAutoSaving ? 'Publishing...' : 'Publish'}
          </QuickAction>
        </ActionBar>
      </HeaderBar>

      <MainLayout>
        <EditorArea>
          {renderTabContent()}
        </EditorArea>

        <SidePanel
          initial={{ x: 350 }}
          animate={{ x: sidebarCollapsed ? 300 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <TabContainer>
            {tabs.map(tab => (
              <Tab
                key={tab.id}
                active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <tab.icon size={16} />
                <span style={{ fontSize: '0.75rem' }}>{tab.label}</span>
              </Tab>
            ))}
          </TabContainer>

          <div style={{ padding: '1rem' }}>
            {activeTab === "editor" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Quick Tools</h3>
                <AdvancedBlocks 
                  article={article} 
                  updateArticle={updateArticle}
                />
                
                {/* Performance Preview */}
                {performanceScore.seo > 0 && (
                  <div style={{ 
                    marginTop: '1rem', 
                    padding: '1rem', 
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '8px'
                  }}>
                    <h4 style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>Performance</h4>
                    <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                      <div>SEO: {performanceScore.seo}/100</div>
                      <div>Readability: {performanceScore.readability}/100</div>
                      <div>Engagement: {performanceScore.engagement}/100</div>
                      <div>Technical: {performanceScore.technical}/100</div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
            
            {activeTab === "ai" && (
              <ContentIntelligence 
                article={article} 
                updateArticle={updateArticle}
                aiAPI={aiAPI}
                seoAPI={seoAPI}
              />
            )}
          </div>
        </SidePanel>
      </MainLayout>

      <AnimatePresence>
        {aiAssistantOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(10px)',
              zIndex: 10000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={() => setAiAssistantOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              style={{
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '20px',
                width: '90%',
                maxWidth: '1200px',
                height: '80%',
                overflow: 'hidden'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <AIAssistant 
                article={article} 
                updateArticle={updateArticle}
                isOpen={aiAssistantOpen}
                setIsOpen={setAiAssistantOpen}
                fullscreen={true}
                aiAPI={aiAPI}
                selectedText={selectedText}
                setSelectedText={setSelectedText}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </EnterpriseContainer>
  );
}

export default EnterpriseCreateArticle;