import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import { 
  FiCheckCircle, FiEye, FiShare2, FiEdit3, FiBarChart2, 
  FiCopy, FiTwitter, FiLinkedin, FiMail,
  FiTrendingUp, FiUsers, FiClock, FiArrowRight, FiExternalLink
} from "react-icons/fi";
import { FaFacebook } from "react-icons/fa";
import moment from "moment";

const SuccessContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const SuccessCard = styled(motion.div)`
  max-width: 800px;
  width: 100%;
  background: rgba(15, 15, 35, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 24px;
  padding: 3rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
`;

const IconWrapper = styled(motion.div)`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981, #059669);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  box-shadow: 0 0 40px rgba(16, 185, 129, 0.4);
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin: 0 0 1rem 0;
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Description = styled.p`
  text-align: center;
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 2rem 0;
  line-height: 1.6;
`;

const ArticleInfo = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const ArticleTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: #fff;
`;

const ArticleUrl = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(0, 0, 0, 0.3);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  font-size: 0.875rem;
  word-break: break-all;
  color: #667eea;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.25rem;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ActionButton = styled(motion.button)`
  background: ${props => props.primary 
    ? 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)' 
    : 'rgba(255, 255, 255, 0.1)'};
  border: 1px solid ${props => props.primary ? 'transparent' : 'rgba(255, 255, 255, 0.2)'};
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  }
`;

const ShareSection = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.9);
`;

const ShareButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const ShareButton = styled(motion.button)`
  background: ${props => props.color || 'rgba(255, 255, 255, 0.1)'};
  border: none;
  color: white;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const AnalyticsTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(16, 185, 129, 0.2);
  border: 1px solid rgba(16, 185, 129, 0.4);
  color: #10b981;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  margin-top: 1rem;
`;

function PublishSuccess({ article, onClose }) {
  const [copied, setCopied] = useState(false);
  
  const articleUrl = `${window.location.origin}/article/${article.article_id || article.id}`;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(articleUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToTwitter = () => {
    const text = `Check out my new article: ${article.title}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(articleUrl)}`, '_blank');
  };

  const shareToLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`, '_blank');
  };

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`, '_blank');
  };

  const shareViaEmail = () => {
    const subject = `Check out: ${article.title}`;
    const body = `I just published a new article!\n\n${article.title}\n\n${articleUrl}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  return (
    <SuccessContainer>
      <SuccessCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <IconWrapper
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <FiCheckCircle size={40} />
        </IconWrapper>

        <Title>Article Published Successfully! 🎉</Title>
        
        <Description>
          Your article is now live and ready to be discovered by readers around the world.
        </Description>

        <ArticleInfo>
          <ArticleTitle>{article.title}</ArticleTitle>
          <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>
            Published {moment(article.publishedAt || new Date()).fromNow()}
          </div>
          
          <ArticleUrl>
            <FiExternalLink size={16} />
            {articleUrl}
          </ArticleUrl>
          
          <AnalyticsTag>
            <FiBarChart2 size={16} />
            Analytics tracking is active
          </AnalyticsTag>
        </ArticleInfo>

        <StatsGrid>
          <StatCard>
            <StatValue>{article.metadata?.wordCount || 0}</StatValue>
            <StatLabel>Words</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{article.metadata?.readingTime || 0}</StatValue>
            <StatLabel>Min Read</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{article.metadata?.tags?.length || 0}</StatValue>
            <StatLabel>Tags</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>0</StatValue>
            <StatLabel>Views</StatLabel>
          </StatCard>
        </StatsGrid>

        <ActionGrid>
          <ActionButton
            primary
            onClick={() => window.open(articleUrl, '_blank')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiEye />
            View Article
          </ActionButton>
          
          <ActionButton
            onClick={copyToClipboard}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiCopy />
            {copied ? 'Copied!' : 'Copy Link'}
          </ActionButton>
          
          <ActionButton
            onClick={() => window.location.href = `/analytics/article/${article.article_id || article.id}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiTrendingUp />
            View Analytics
          </ActionButton>
          
          <ActionButton
            onClick={() => window.location.href = '/create'}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiEdit3 />
            Create Another
          </ActionButton>
        </ActionGrid>

        <ShareSection>
          <SectionTitle>
            <FiShare2 />
            Share Your Article
          </SectionTitle>
          
          <ShareButtons>
            <ShareButton 
              color="#1DA1F2"
              onClick={shareToTwitter}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiTwitter size={20} />
            </ShareButton>
            
            <ShareButton 
              color="#0077B5"
              onClick={shareToLinkedIn}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiLinkedin size={20} />
            </ShareButton>
            
            <ShareButton 
              color="#1877F2"
              onClick={shareToFacebook}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaFacebook size={20} />
            </ShareButton>
            
            <ShareButton 
              color="#EA4335"
              onClick={shareViaEmail}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiMail size={20} />
            </ShareButton>
          </ShareButtons>
        </ShareSection>
      </SuccessCard>
    </SuccessContainer>
  );
}

export default PublishSuccess;
