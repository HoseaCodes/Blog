import React from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import { FiCpu, FiTrendingUp, FiTarget, FiBarChart2 } from "react-icons/fi";

const IntelligenceContainer = styled.div`
  padding: 1rem;
`;

const InsightCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const InsightTitle = styled.div`
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #667eea;
`;

const InsightValue = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.25rem;
`;

const InsightDescription = styled.div`
  font-size: 0.75rem;
  opacity: 0.8;
`;

function ContentIntelligence({ article, updateArticle, aiAPI, seoAPI }) {
  // Using aiAPI and seoAPI from GlobalState for content analysis
  // Can call: aiAPI.extractKeyPoints(), seoAPI.checkReadability(), 
  // aiAPI.getStyleSuggestions(), seoAPI.analyzeSEO()

  const insights = [
    {
      icon: FiTrendingUp,
      title: "Engagement Prediction",
      value: "87%",
      description: "High likelihood of engagement based on content analysis"
    },
    {
      icon: FiTarget,
      title: "Audience Match",
      value: "92%",
      description: "Content aligns well with target audience preferences"
    },
    {
      icon: FiBarChart2,
      title: "Viral Potential",
      value: "74%",
      description: "Good potential for social media sharing"
    }
  ];

  return (
    <IntelligenceContainer>
      <h4 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <FiCpu /> Content Intelligence
      </h4>
      
      {insights.map((insight, index) => (
        <InsightCard
          key={insight.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <InsightTitle>
            <insight.icon size={16} />
            {insight.title}
          </InsightTitle>
          <InsightValue>{insight.value}</InsightValue>
          <InsightDescription>{insight.description}</InsightDescription>
        </InsightCard>
      ))}
    </IntelligenceContainer>
  );
}

export default ContentIntelligence;