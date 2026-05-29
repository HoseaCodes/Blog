import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import {
  FiTag, FiUsers, FiGlobe, FiTrendingUp, FiClock, FiTarget,
  FiBookOpen, FiBarChart2, FiUser, FiCalendar, FiLink,
  FiPlus, FiX, FiEdit3, FiLayers, FiStar, FiImage, FiUpload
} from "react-icons/fi";

const MetadataContainer = styled.div`
  padding: 1.5rem;
  background: rgba(15, 15, 35, 0.8);
  color: white;
  overflow-y: auto;
  height: 100%;
`;

const Section = styled.div`
  margin-bottom: 2rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #5bb39e;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: rgba(255, 255, 255, 0.9);
`;

const Input = styled.input`
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.75rem;
  color: white;
  font-size: 0.875rem;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  &:focus {
    outline: none;
    border-color: #5bb39e;
    background: rgba(102, 126, 234, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.75rem;
  color: white;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: #5bb39e;
    background: rgba(102, 126, 234, 0.1);
  }
  
  option {
    background: #14191e;
    color: white;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.75rem;
  color: white;
  font-size: 0.875rem;
  resize: vertical;
  min-height: 80px;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  &:focus {
    outline: none;
    border-color: #5bb39e;
    background: rgba(102, 126, 234, 0.1);
  }
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const Tag = styled(motion.span)`
  background: rgba(102, 126, 234, 0.2);
  border: 1px solid #5bb39e;
  color: #5bb39e;
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const TagInput = styled.input`
  background: transparent;
  border: none;
  color: white;
  padding: 0.5rem 0;
  font-size: 0.875rem;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  &:focus {
    outline: none;
  }
`;

const AddButton = styled(motion.button)`
  background: rgba(102, 126, 234, 0.2);
  border: 1px solid #5bb39e;
  border-radius: 6px;
  color: white;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  margin-top: 0.5rem;
  
  &:hover {
    background: rgba(102, 126, 234, 0.3);
  }
`;

const RadioGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const RadioOption = styled(motion.label)`
  background: ${props => props.checked ? 'rgba(102, 126, 234, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
  border: 1px solid ${props => props.checked ? '#5bb39e' : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 8px;
  padding: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  text-align: center;
  justify-content: center;
  
  &:hover {
    border-color: #5bb39e;
    background: rgba(102, 126, 234, 0.2);
  }
`;

const MetricCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const MetricGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const MetricValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #5bb39e;
`;

const MetricLabel = styled.div`
  font-size: 0.75rem;
  opacity: 0.8;
  margin-top: 0.25rem;
`;

function MetadataPanel({ article, updateArticle, seoAPI, mediaAPI }) {
  const featuredImageInputRef = useRef();
  const [featuredImageUploading, setFeaturedImageUploading] = useState(false);

  const handleFeaturedImageUpload = async (file) => {
    if (!file || !updateArticle) return;
    setFeaturedImageUploading(true);
    try {
      let url, cloudinaryId, originalName;
      if (mediaAPI) {
        const res = await mediaAPI.uploadFile(file, "blog-articles");
        url = res.media?.url || res.result?.secure_url;
        cloudinaryId = res.media?.cloudinaryId || res.result?.public_id;
        originalName = res.media?.originalName || file.name;
      } else {
        url = URL.createObjectURL(file);
        originalName = file.name;
      }
      updateArticle({
        media: {
          ...(article?.media || {}),
          featuredImage: { url, cloudinaryId, originalName }
        }
      });
    } catch (err) {
      console.error("Featured image upload failed:", err);
    } finally {
      setFeaturedImageUploading(false);
    }
  };

  const clearFeaturedImage = () => {
    if (!updateArticle) return;
    updateArticle({
      media: { ...(article?.media || {}), featuredImage: null }
    });
  };

  const [newTag, setNewTag] = useState('');
  const [newSkillTag, setNewSkillTag] = useState('');
  const [suggestedKeywords, setSuggestedKeywords] = useState([]);
  const [loadingKeywords, setLoadingKeywords] = useState(false);

  // Keep latest seoAPI in a ref so the keyword effect doesn't re-fire just
  // because the parent re-rendered with a fresh seoAPI object reference.
  const seoAPIRef = useRef(seoAPI);
  useEffect(() => {
    seoAPIRef.current = seoAPI;
  }, [seoAPI]);

  useEffect(() => {
    const topic = article.title || article.metadata?.category;
    if (!topic || topic.length < 3) return;

    let cancelled = false;
    setLoadingKeywords(true);

    (async () => {
      try {
        const api = seoAPIRef.current;
        if (typeof api?.getKeywordSuggestions !== 'function') return;
        const result = await api.getKeywordSuggestions(topic);
        if (cancelled) return;
        const normalized = (result?.keywords || [])
          .map((k) => (typeof k === 'string' ? k : k?.term))
          .filter(Boolean);
        setSuggestedKeywords(normalized);
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to fetch keyword suggestions:', err);
          setSuggestedKeywords([]);
        }
      } finally {
        if (!cancelled) setLoadingKeywords(false);
      }
    })();

    return () => { cancelled = true; };
  }, [article.title, article.metadata?.category]);

  const applySuggestedKeyword = (keyword) => {
    if (!keyword || !updateArticle) return;
    
    // Ensure keyword is a string
    const keywordText = typeof keyword === 'string' ? keyword : keyword?.term || '';
    if (!keywordText.trim()) return;
    
    const currentTags = article?.metadata?.tags || [];
    if (!currentTags.includes(keywordText)) {
      updateArticle({
        metadata: {
          ...(article?.metadata || {}),
          tags: [...currentTags, keywordText]
        }
      });
      
      // Remove the applied keyword from suggestions
      setSuggestedKeywords(prev => prev.filter(k => 
        (typeof k === 'string' ? k : k?.term) !== keywordText
      ));
    }
  };

  const categories = [
    'Programming', 'AI/ML', 'Web Development', 'Mobile', 'DevOps',
    'Data Science', 'Cybersecurity', 'Product Management', 'Design',
    'Career', 'Technology Trends', 'Tutorials', 'Opinion', 'News'
  ];

  const subcategories = {
    'Programming': ['JavaScript', 'Python', 'Java', 'C++', 'Rust', 'Go'],
    'AI/ML': ['Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'LLMs'],
    'Web Development': ['Frontend', 'Backend', 'Full Stack', 'Frameworks', 'APIs'],
    'Mobile': ['iOS', 'Android', 'React Native', 'Flutter', 'Hybrid Apps'],
    'DevOps': ['CI/CD', 'Cloud', 'Infrastructure', 'Monitoring', 'Security']
  };

  const personaTargets = [
    'Beginner', 'Intermediate', 'Advanced', 'Senior Engineer', 'Tech Lead',
    'CTO', 'Product Manager', 'Designer', 'Startup Founder', 'Student'
  ];

  const industryTargets = [
    'Fintech', 'Healthcare', 'E-commerce', 'Gaming', 'Education',
    'Enterprise', 'Startup', 'Government', 'Non-profit', 'Consulting'
  ];

  const difficultyLevels = [
    { value: 'beginner', label: 'Beginner', description: 'No prior knowledge needed' },
    { value: 'intermediate', label: 'Intermediate', description: 'Some experience required' },
    { value: 'advanced', label: 'Advanced', description: 'Expert level content' },
    { value: 'expert', label: 'Expert', description: 'Cutting-edge concepts' }
  ];

  const addTag = (tagType, value) => {
    if (!value || !value.trim() || !updateArticle) return;
    
    const currentTags = article?.metadata?.[tagType] || [];
    if (!currentTags.includes(value.trim())) {
      updateArticle({
        metadata: {
          ...(article?.metadata || {}),
          [tagType]: [...currentTags, value.trim()]
        }
      });
    }
    if (tagType === 'tags') setNewTag('');
    if (tagType === 'skillsTags') setNewSkillTag('');
  };

  const removeTag = (tagType, tagToRemove) => {
    if (!updateArticle) return;
    
    const currentTags = article?.metadata?.[tagType] || [];
    updateArticle({
      metadata: {
        ...(article?.metadata || {}),
        [tagType]: currentTags.filter(tag => tag !== tagToRemove)
      }
    });
  };

  const handleMetadataChange = (field, value) => {
    if (!updateArticle) return;
    
    updateArticle({
      metadata: {
        ...(article?.metadata || {}),
        [field]: value
      }
    });
  };

  const handlePersonaToggle = (persona) => {
    if (!persona) return;
    
    const current = article?.metadata?.personaTarget || [];
    const updated = current.includes(persona)
      ? current.filter(p => p !== persona)
      : [...current, persona];
    
    handleMetadataChange('personaTarget', updated);
  };

  const handleIndustryToggle = (industry) => {
    if (!industry) return;
    
    const current = article?.metadata?.industryTarget || [];
    const updated = current.includes(industry)
      ? current.filter(i => i !== industry)
      : [...current, industry];
    
    handleMetadataChange('industryTarget', updated);
  };

  // Add safety check for article prop
  if (!article) {
    return (
      <MetadataContainer>
        <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.7 }}>
          Loading article metadata...
        </div>
      </MetadataContainer>
    );
  }

  const featuredImageUrl = article?.media?.featuredImage?.url || article?.media?.featuredImage?.secure_url;

  return (
    <MetadataContainer>
      {/* Featured Image */}
      <Section>
        <SectionTitle>
          <FiImage />
          Featured Image
        </SectionTitle>
        <FormGroup>
          {featuredImageUrl ? (
            <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
              <img
                src={featuredImageUrl}
                alt="Featured"
                style={{
                  width: '100%',
                  maxHeight: '200px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              />
              <button
                type="button"
                onClick={clearFeaturedImage}
                style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.5rem',
                  background: 'rgba(0,0,0,0.7)',
                  border: 'none',
                  borderRadius: '4px',
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  cursor: 'pointer'
                }}
              >
                <FiX size={14} />
              </button>
            </div>
          ) : (
            <div
              onClick={() => featuredImageInputRef.current?.click()}
              style={{
                border: '2px dashed rgba(255,255,255,0.3)',
                borderRadius: '8px',
                padding: '1.5rem',
                textAlign: 'center',
                cursor: 'pointer',
                background: 'rgba(255,255,255,0.05)',
                marginBottom: '0.75rem'
              }}
            >
              <FiUpload size={24} style={{ opacity: 0.6, marginBottom: '0.5rem' }} />
              <div style={{ fontSize: '0.875rem' }}>
                {featuredImageUploading ? 'Uploading…' : 'Click to upload featured image'}
              </div>
            </div>
          )}
          <input
            ref={featuredImageInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => handleFeaturedImageUpload(e.target.files?.[0])}
          />
          {featuredImageUrl && (
            <button
              type="button"
              onClick={() => featuredImageInputRef.current?.click()}
              disabled={featuredImageUploading}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                padding: '0.5rem',
                color: 'white',
                cursor: featuredImageUploading ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem'
              }}
            >
              {featuredImageUploading ? 'Uploading…' : 'Replace image'}
            </button>
          )}
        </FormGroup>
      </Section>

      {/* Content Metrics */}
      <Section>
        <SectionTitle>
          <FiBarChart2 />
          Content Metrics
        </SectionTitle>
        <MetricGrid>
          <MetricCard>
            <MetricValue>{article?.metadata?.wordCount || 0}</MetricValue>
            <MetricLabel>Words</MetricLabel>
          </MetricCard>
          <MetricCard>
            <MetricValue>{article?.metadata?.readingTime || 0}</MetricValue>
            <MetricLabel>Min Read</MetricLabel>
          </MetricCard>
        </MetricGrid>
      </Section>

      {/* Classification */}
      <Section>
        <SectionTitle>
          <FiLayers />
          Classification
        </SectionTitle>
        
        <FormGroup>
          <Label>Category</Label>
          <Select
            value={article?.metadata?.category || ''}
            onChange={(e) => handleMetadataChange('category', e.target.value)}
          >
            <option value="">Select category...</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Subcategory</Label>
          <Select
            value={article?.metadata?.subcategory || ''}
            onChange={(e) => handleMetadataChange('subcategory', e.target.value)}
            disabled={!article?.metadata?.category}
          >
            <option value="">Select subcategory...</option>
            {(subcategories[article?.metadata?.category] || []).map(subcat => (
              <option key={subcat} value={subcat}>{subcat}</option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Difficulty Level</Label>
          <RadioGroup>
            {difficultyLevels.map(level => (
              <RadioOption
                key={level.value}
                checked={article?.metadata?.difficulty === level.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <input
                  type="radio"
                  name="difficulty"
                  value={level.value}
                  checked={article?.metadata?.difficulty === level.value}
                  onChange={(e) => handleMetadataChange('difficulty', e.target.value)}
                  style={{ display: 'none' }}
                />
                <div>
                  <div style={{ fontWeight: 600 }}>{level.label}</div>
                  <div style={{ fontSize: '0.625rem', opacity: 0.7 }}>
                    {level.description}
                  </div>
                </div>
              </RadioOption>
            ))}
          </RadioGroup>
        </FormGroup>
      </Section>

      {/* Tags */}
      <Section>
        <SectionTitle>
          <FiTag />
          Tags & Keywords
        </SectionTitle>
        
        {/* AI-Suggested Keywords */}
        {suggestedKeywords.length > 0 && (
          <FormGroup>
            <Label>
              AI Suggested Keywords {loadingKeywords && '(Loading...)'}
              <span style={{ fontSize: '0.625rem', opacity: 0.7, marginLeft: '0.5rem' }}>
                Based on: "{article.title || article.metadata?.category || 'No title'}"
              </span>
            </Label>
            <TagContainer>
              {suggestedKeywords.slice(0, 10).map((keyword, index) => {
                // Ensure keyword is a string
                const keywordText = typeof keyword === 'string' ? keyword : keyword?.term || '';
                if (!keywordText) return null;
                
                return (
                  <Tag
                    key={`${keywordText}-${index}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ 
                      background: 'rgba(34, 197, 94, 0.2)',
                      border: '1px solid rgba(34, 197, 94, 0.4)',
                      color: '#22c55e',
                      cursor: 'pointer'
                    }}
                    onClick={() => applySuggestedKeyword(keywordText)}
                    whileHover={{ scale: 1.05, background: 'rgba(34, 197, 94, 0.3)' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {keywordText}
                    <FiPlus size={12} style={{ marginLeft: '4px' }} />
                  </Tag>
                );
              })}
            </TagContainer>
          </FormGroup>
        )}
        
        <FormGroup>
          <Label>Content Tags</Label>
          <TagContainer>
            {(article?.metadata?.tags || []).map(tag => (
              <Tag
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                {tag}
                <motion.button
                  onClick={() => removeTag('tags', tag)}
                  whileHover={{ scale: 1.2 }}
                  style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
                >
                  <FiX size={12} />
                </motion.button>
              </Tag>
            ))}
          </TagContainer>
          <TagInput
            placeholder="Add tags..."
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag('tags', newTag);
              }
            }}
          />
          <AddButton
            onClick={() => addTag('tags', newTag)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiPlus size={12} />
            Add Tag
          </AddButton>
        </FormGroup>

        <FormGroup>
          <Label>Skills/Tech Tags</Label>
          <TagContainer>
            {(article?.metadata?.skillsTags || []).map(tag => (
              <Tag
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                {tag}
                <motion.button
                  onClick={() => removeTag('skillsTags', tag)}
                  whileHover={{ scale: 1.2 }}
                  style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
                >
                  <FiX size={12} />
                </motion.button>
              </Tag>
            ))}
          </TagContainer>
          <TagInput
            placeholder="Add tech skills..."
            value={newSkillTag}
            onChange={(e) => setNewSkillTag(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag('skillsTags', newSkillTag);
              }
            }}
          />
          <AddButton
            onClick={() => addTag('skillsTags', newSkillTag)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiPlus size={12} />
            Add Skill
          </AddButton>
        </FormGroup>
      </Section>

      {/* Audience Targeting */}
      <Section>
        <SectionTitle>
          <FiTarget />
          Audience Targeting
        </SectionTitle>
        
        <FormGroup>
          <Label>Target Personas</Label>
          <TagContainer>
            {personaTargets.map(persona => (
              <Tag
                key={persona}
                onClick={() => handlePersonaToggle(persona)}
                style={{
                  cursor: 'pointer',
                  background: (article?.metadata?.personaTarget || []).includes(persona) 
                    ? 'rgba(102, 126, 234, 0.4)' 
                    : 'rgba(255, 255, 255, 0.1)',
                  borderColor: (article?.metadata?.personaTarget || []).includes(persona) 
                    ? '#5bb39e' 
                    : 'rgba(255, 255, 255, 0.2)'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {persona}
              </Tag>
            ))}
          </TagContainer>
        </FormGroup>

        <FormGroup>
          <Label>Industry Focus</Label>
          <TagContainer>
            {industryTargets.map(industry => (
              <Tag
                key={industry}
                onClick={() => handleIndustryToggle(industry)}
                style={{
                  cursor: 'pointer',
                  background: (article?.metadata?.industryTarget || []).includes(industry) 
                    ? 'rgba(102, 126, 234, 0.4)' 
                    : 'rgba(255, 255, 255, 0.1)',
                  borderColor: (article?.metadata?.industryTarget || []).includes(industry) 
                    ? '#5bb39e' 
                    : 'rgba(255, 255, 255, 0.2)'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {industry}
              </Tag>
            ))}
          </TagContainer>
        </FormGroup>

        <FormGroup>
          <Label>Geographic Target</Label>
          <Select
            value={article?.metadata?.geoTarget || ''}
            onChange={(e) => handleMetadataChange('geoTarget', e.target.value)}
          >
            <option value="">Global</option>
            <option value="us">United States</option>
            <option value="eu">Europe</option>
            <option value="asia">Asia Pacific</option>
            <option value="americas">Americas</option>
          </Select>
        </FormGroup>
      </Section>

      {/* Related Content */}
      <Section>
        <SectionTitle>
          <FiLink />
          Related Content
        </SectionTitle>
        
        <FormGroup>
          <Label>Series</Label>
          <Input
            placeholder="Part of a series..."
            value={article?.metadata?.series || ''}
            onChange={(e) => handleMetadataChange('series', e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label>Prerequisites</Label>
          <Textarea
            placeholder="What should readers know before reading this?"
            value={article?.metadata?.prerequisites || ''}
            onChange={(e) => handleMetadataChange('prerequisites', e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label>Learning Outcomes</Label>
          <Textarea
            placeholder="What will readers learn from this article?"
            value={article?.metadata?.learningOutcomes || ''}
            onChange={(e) => handleMetadataChange('learningOutcomes', e.target.value)}
          />
        </FormGroup>
      </Section>
    </MetadataContainer>
  );
}

export default MetadataPanel;