import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import { 
  FiBarChart2, FiTrendingUp, FiEye, FiHeart, FiShare2,
  FiMessageSquare, FiClock, FiTarget, FiUsers, FiGlobe,
  FiCalendar, FiFilter, FiDownload, FiRefreshCw
} from "react-icons/fi";
import moment from "moment";

const InsightsContainer = styled.div`
  padding: 1.5rem;
  background: rgba(15, 15, 35, 0.8);
  color: white;
  overflow-y: auto;
  height: 100%;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const MetricCard = styled(motion.div)`
  background: linear-gradient(135deg, ${props => props.gradient});
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    pointer-events: none;
  }
`;

const MetricValue = styled.div`
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
`;

const MetricLabel = styled.div`
  font-size: 0.875rem;
  opacity: 0.9;
  margin-bottom: 0.25rem;
`;

const MetricChange = styled.div`
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  opacity: 0.8;
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
`;

const ActionButton = styled(motion.button)`
  background: rgba(102, 126, 234, 0.2);
  border: 1px solid #667eea;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: rgba(102, 126, 234, 0.3);
  }
`;

const ChartContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const ChartPlaceholder = styled.div`
  text-align: center;
  opacity: 0.6;
`;

const PredictionCard = styled.div`
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
`;

const PredictionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const PredictionTitle = styled.div`
  font-weight: 600;
  color: #667eea;
`;

const Confidence = styled.div`
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const PredictionContent = styled.div`
  font-size: 0.875rem;
  line-height: 1.5;
`;

const EngagementBreakdown = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const EngagementItem = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
`;

const EngagementValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 0.25rem;
`;

const EngagementLabel = styled.div`
  font-size: 0.75rem;
  opacity: 0.8;
`;

const TimeFilter = styled.select`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: white;
  padding: 0.5rem;
  font-size: 0.75rem;
  margin-left: 0.5rem;
  
  option {
    background: #1a1a2e;
    color: white;
  }
`;

const TopPerformers = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1rem;
`;

const PerformerItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
`;

const PerformerTitle = styled.div`
  font-weight: 600;
  font-size: 0.875rem;
`;

const PerformerMetric = styled.div`
  color: #667eea;
  font-weight: 600;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 3rem;
  opacity: 0.6;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  opacity: 0.6;
  
  svg {
    margin-bottom: 1rem;
  }
`;

function PerformanceInsights({ article, performanceScore, analyticsAPI }) {
  const [timeFilter, setTimeFilter] = useState('30d');
  const [realMetrics, setRealMetrics] = useState(null);
  const [topArticles, setTopArticles] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Fetch real analytics data when component mounts
  useEffect(() => {
    if (analyticsAPI && article?.id) {
      fetchAnalytics();
    }
  }, [article?.id, timeFilter, analyticsAPI]);
  
  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Fetch article stats
      const stats = await analyticsAPI.getArticleStats(article.id, timeFilter);
      setRealMetrics(stats.stats);
      
      // Fetch top performing articles
      const topResponse = await analyticsAPI.getTopArticles(timeFilter);
      setTopArticles(topResponse.articles || []);
      
      // Fetch AI predictions if available
      if (analyticsAPI.getPredictions) {
        const predictionsResponse = await analyticsAPI.getPredictions(article.id);
        setPredictions(predictionsResponse.predictions || []);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      setRealMetrics(null);
      setTopArticles([]);
      setPredictions([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Build metrics array from real data only
  const metrics = realMetrics ? [
    {
      value: realMetrics.views?.toLocaleString() || '0',
      label: 'Total Views',
      change: realMetrics.viewsChange || '0%',
      trend: parseFloat(realMetrics.viewsChange) >= 0 ? 'up' : 'down',
      gradient: '#667eea, #764ba2'
    },
    {
      value: realMetrics.engagement?.toLocaleString() || '0',
      label: 'Engagements',
      change: realMetrics.engagementChange || '0%',
      trend: parseFloat(realMetrics.engagementChange) >= 0 ? 'up' : 'down',
      gradient: '#10b981, #059669'
    },
    {
      value: realMetrics.shares?.toLocaleString() || '0',
      label: 'Shares',
      change: realMetrics.sharesChange || '0%',
      trend: parseFloat(realMetrics.sharesChange) >= 0 ? 'up' : 'down',
      gradient: '#f59e0b, #d97706'
    },
    {
      value: `${realMetrics.avgReadTime || 0}min`,
      label: 'Avg Read Time',
      change: realMetrics.readTimeChange || '0%',
      trend: parseFloat(realMetrics.readTimeChange) >= 0 ? 'up' : 'down',
      gradient: '#8b5cf6, #7c3aed'
    }
  ] : null;

  const engagementBreakdown = realMetrics ? {
    likes: realMetrics.likes || 0,
    comments: realMetrics.comments || 0,
    shares: realMetrics.shares || 0,
    bookmarks: realMetrics.bookmarks || 0
  } : null;
  
  const realTimeStats = realMetrics ? {
    activeReaders: realMetrics.activeReaders || 0,
    recentViews: realMetrics.recentViews || 0,
    recentShares: realMetrics.recentShares || 0
  } : null;
  
  if (loading) {
    return (
      <InsightsContainer>
        <LoadingState>
          <FiRefreshCw size={48} style={{ marginBottom: '1rem', animation: 'spin 1s linear infinite' }} />
          <div style={{ fontSize: '1rem', fontWeight: 600 }}>Loading Analytics...</div>
          <div style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Fetching real-time performance data
          </div>
        </LoadingState>
      </InsightsContainer>
    );
  }
  
  if (!analyticsAPI || !article?.id) {
    return (
      <InsightsContainer>
        <EmptyState>
          <FiBarChart2 size={48} style={{ opacity: 0.5 }} />
          <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            No Analytics Available
          </div>
          <div style={{ fontSize: '0.875rem' }}>
            Analytics data will be available after the article is published
          </div>
        </EmptyState>
      </InsightsContainer>
    );
  }
  
  if (!realMetrics) {
    return (
      <InsightsContainer>
        <EmptyState>
          <FiBarChart2 size={48} style={{ opacity: 0.5 }} />
          <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            No Data Yet
          </div>
          <div style={{ fontSize: '0.875rem' }}>
            Analytics data will appear once your article starts receiving traffic
          </div>
        </EmptyState>
      </InsightsContainer>
    );
  }

  return (
    <InsightsContainer>
      {/* Performance Metrics */}
      <Section>
        <SectionHeader>
          <SectionTitle>
            <FiBarChart2 />
            Performance Overview
          </SectionTitle>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <TimeFilter 
              value={timeFilter} 
              onChange={(e) => setTimeFilter(e.target.value)}
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </TimeFilter>
            <ActionButton
              style={{ marginLeft: '0.5rem' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchAnalytics}
              disabled={loading}
            >
              <FiRefreshCw size={12} />
              Refresh
            </ActionButton>
          </div>
        </SectionHeader>

        <MetricsGrid>
          {metrics.map((metric, index) => (
            <MetricCard
              key={index}
              gradient={metric.gradient}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <MetricValue>{metric.value}</MetricValue>
              <MetricLabel>{metric.label}</MetricLabel>
              <MetricChange>
                {metric.trend === 'up' ? <FiTrendingUp size={12} /> : null}
                {metric.change}
              </MetricChange>
            </MetricCard>
          ))}
        </MetricsGrid>
      </Section>

      {/* Engagement Breakdown */}
      {engagementBreakdown && (
        <Section>
          <SectionHeader>
            <SectionTitle>
              <FiHeart />
              Engagement Breakdown
            </SectionTitle>
          </SectionHeader>

          <EngagementBreakdown>
            <EngagementItem>
              <EngagementValue>{engagementBreakdown.likes.toLocaleString()}</EngagementValue>
              <EngagementLabel>Likes</EngagementLabel>
            </EngagementItem>
            <EngagementItem>
              <EngagementValue>{engagementBreakdown.comments.toLocaleString()}</EngagementValue>
              <EngagementLabel>Comments</EngagementLabel>
            </EngagementItem>
            <EngagementItem>
              <EngagementValue>{engagementBreakdown.shares.toLocaleString()}</EngagementValue>
              <EngagementLabel>Shares</EngagementLabel>
            </EngagementItem>
            <EngagementItem>
              <EngagementValue>{engagementBreakdown.bookmarks.toLocaleString()}</EngagementValue>
              <EngagementLabel>Bookmarks</EngagementLabel>
            </EngagementItem>
          </EngagementBreakdown>
        </Section>
      )}

      {/* Traffic Chart - Only show with real data */}
      {realMetrics?.trafficTrends && (
        <Section>
          <SectionHeader>
            <SectionTitle>
              <FiTrendingUp />
              Traffic Trends
            </SectionTitle>
            <ActionButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                // Export functionality would go here
                console.log('Exporting analytics data...');
              }}
            >
              <FiDownload size={12} />
              Export
            </ActionButton>
          </SectionHeader>

          <ChartContainer>
            {/* Real chart implementation would go here */}
            <ChartPlaceholder>
              <FiBarChart2 size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <div style={{ fontSize: '0.875rem' }}>
                Chart visualization coming soon
              </div>
            </ChartPlaceholder>
          </ChartContainer>
        </Section>
      )}

      {/* AI Predictions - Only show if available */}
      {predictions && predictions.length > 0 && (
        <Section>
          <SectionHeader>
            <SectionTitle>
              <FiTarget />
              Performance Predictions
            </SectionTitle>
          </SectionHeader>

          {predictions.map((prediction, index) => (
            <PredictionCard key={index}>
              <PredictionHeader>
                <PredictionTitle>
                  {prediction.icon && <prediction.icon style={{ marginRight: '0.5rem' }} />}
                  {prediction.title}
                </PredictionTitle>
                <Confidence>{prediction.confidence}</Confidence>
              </PredictionHeader>
              <PredictionContent>{prediction.content}</PredictionContent>
            </PredictionCard>
          ))}
        </Section>
      )}

      {/* Top Performers - Only show if available */}
      {topArticles && topArticles.length > 0 && (
        <Section>
          <SectionHeader>
            <SectionTitle>
              <FiEye />
              Top Performing Articles
            </SectionTitle>
          </SectionHeader>

          <TopPerformers>
            {topArticles.map((performer, index) => (
              <PerformerItem key={index}>
                <PerformerTitle>{performer.title}</PerformerTitle>
                <PerformerMetric>{performer.views?.toLocaleString() || '0'} views</PerformerMetric>
              </PerformerItem>
            ))}
          </TopPerformers>
        </Section>
      )}

      {/* Real-time Stats - Only show with real data */}
      {realTimeStats && (
        <Section>
          <SectionHeader>
            <SectionTitle>
              <FiGlobe />
              Real-time Activity
            </SectionTitle>
          </SectionHeader>

          <div style={{ 
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            padding: '1rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#10b981' }}>
                {realTimeStats.activeReaders}
              </div>
              <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                Active Readers
              </div>
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#667eea' }}>
                {realTimeStats.recentViews}
              </div>
              <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                Views (Last Hour)
              </div>
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f59e0b' }}>
                {realTimeStats.recentShares}
              </div>
              <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                Social Shares
              </div>
            </div>
          </div>
        </Section>
      )}
    </InsightsContainer>
  );
}

export default PerformanceInsights;