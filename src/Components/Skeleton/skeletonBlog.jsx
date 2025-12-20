import React from 'react';
import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';
import 'react-loading-skeleton/dist/skeleton.css';

// =============================================
// SKELETON THEME TOKENS
// =============================================
const skeletonTheme = {
  colors: {
    light: {
      base: '#e0e0e0',
      highlight: '#f5f5f5',
      border: 'rgba(0, 0, 0, 0.1)'
    },
    dark: {
      base: '#1e1e1e',
      highlight: '#2a2a2a',
      border: 'rgba(255, 215, 0, 0.3)',
      accent: 'rgba(255, 215, 0, 0.15)'
    }
  },
  animation: {
    duration: '1.5s'
  },
  borderRadius: '8px'
};

// =============================================
// BASE SKELETON COMPONENTS
// =============================================
const ThemedSkeleton = styled(Skeleton)`
  background-color: ${props => props.theme?.isDark ? skeletonTheme.colors.dark.base : skeletonTheme.colors.light.base} !important;
  border-radius: ${skeletonTheme.borderRadius} !important;
  transition: background-color 0.3s ease;

  ${props => props.theme?.isDark && `
    background: linear-gradient(90deg, 
      ${skeletonTheme.colors.dark.base} 25%, 
      ${skeletonTheme.colors.dark.highlight} 50%, 
      ${skeletonTheme.colors.dark.base} 75%) !important;
    background-size: 200% 100% !important;
    animation: skeleton-loading ${skeletonTheme.animation.duration} ease infinite;
  `}

  @keyframes skeleton-loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

const SkeletonContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.enterprise 
    ? 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)'
    : props.theme?.background || '#fff'
  };
  color: ${props => props.theme?.text || '#333'};
  transition: background-color 0.3s ease, color 0.3s ease;
`;

// =============================================
// ENTERPRISE HEADER SKELETON
// =============================================
const HeaderSkeleton = styled.header`
  background: rgba(15, 15, 35, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid ${props => props.theme?.isDark ? skeletonTheme.colors.dark.border : skeletonTheme.colors.light.border};
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

const HeaderContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

// =============================================
// ENTERPRISE HERO SKELETON
// =============================================
const HeroSkeleton = styled.section`
  padding: 6rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 80vh;
`;

const HeroGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }
`;

const HeroContent = styled.div`
  z-index: 2;
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }
`;

const HeroVisual = styled.div`
  position: relative;
  
  .skeleton-hero-image {
    border-radius: 20px;
  }
`;

// =============================================
// HBR SECTION SKELETON
// =============================================
const HBRSectionSkeleton = styled.section`
  padding: 3rem 2rem;
  background: rgba(0, 0, 0, 0.05);
  border-top: 1px solid ${props => props.theme?.isDark ? skeletonTheme.colors.dark.border : skeletonTheme.colors.light.border};
`;

const HBRGrid = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1.5fr 1fr;
  gap: 3rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const MainFeature = styled.div`
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const MiddleColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

const MiddleArticle = styled.div`
  display: flex;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const MiddleContent = styled.div`
  flex: 1;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const LatestHeader = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${props => props.theme?.isDark ? skeletonTheme.colors.dark.border : skeletonTheme.colors.light.border};
`;

const LatestArticles = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const LatestArticle = styled.div`
  padding: 1.5rem 0;
  border-bottom: 1px solid ${props => props.theme?.isDark ? skeletonTheme.colors.dark.border : skeletonTheme.colors.light.border};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.8;
  }

  &:last-of-type {
    border-bottom: none;
  }
`;

const NewsletterCard = styled.div`
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 16px;
  padding: 2rem 1.5rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: linear-gradient(45deg, transparent, rgba(102, 126, 234, 0.05));
    z-index: 1;
  }
`;

// =============================================
// MULTIMEDIA SECTION SKELETON
// =============================================
const MultimediaSectionSkeleton = styled.section`
  display: flex;
  min-height: 100vh;
  background: #ffffff;
`;

const MultimediaSidebar = styled.div`
  width: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 0;
  border-right: 1px solid #e5e5e5;
`;

const SidebarContent = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
`;

const VerticalText = styled.div`
  writing-mode: vertical-rl;
  text-orientation: mixed;
  letter-spacing: 0.05em;
  transform: rotate(180deg);
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MultimediaContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 48px;

  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

const VideoGrid = styled.div`
  display: flex;
  flex-direction: row;
  gap: 32px;
  margin-bottom: 48px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 2rem;
  }
`;

const VideoCard = styled.div`
  display: flex;
  flex-direction: column;
  border: 3px solid #000000;
  background: white;
  width: 430px;
  min-width: 430px;
  height: 520px;

  @media (max-width: 768px) {
    width: 100%;
    min-width: auto;
  }
`;

const VideoContainer = styled.div`
  position: relative;
  height: 240px;
`;

const PlayButton = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const VideoTextContent = styled.div`
  flex: 1;
  padding: 24px;
`;

const MultimediaBottom = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 48px;
  margin-bottom: 0;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
    align-items: flex-start;
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  margin-right: 32px;

  @media (max-width: 768px) {
    align-self: flex-end;
    margin-right: 0;
  }
`;

// =============================================
// FILTER SECTION SKELETON
// =============================================
const FilterSectionSkeleton = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid ${props => props.theme?.isDark ? skeletonTheme.colors.dark.border : skeletonTheme.colors.light.border};
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 3rem;
  backdrop-filter: blur(10px);
`;

const FilterTabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const SubFilters = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
`;

// =============================================
// ARTICLE GRID SKELETON
// =============================================
const ArticleGridSkeleton = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 4rem;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const MainArticles = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const FeaturedArticle = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid ${props => props.theme?.isDark ? skeletonTheme.colors.dark.border : skeletonTheme.colors.light.border};
  border-radius: 16px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
    border-color: rgba(102, 126, 234, 0.3);
  }
`;

const ArticleContent = styled.div`
  padding: 1.5rem;
`;

const ArticleTags = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
`;

const ArticleMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const SidebarCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid ${props => props.theme?.isDark ? skeletonTheme.colors.dark.border : skeletonTheme.colors.light.border};
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    border-color: rgba(102, 126, 234, 0.3);
  }
`;

const TopicList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const AchievementList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const AchievementItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid ${props => props.theme?.isDark ? skeletonTheme.colors.dark.border : skeletonTheme.colors.light.border};
  transition: all 0.3s ease;

  &:hover {
    border-color: #667eea;
    transform: translateY(-2px);
  }
`;

const AchievementInfo = styled.div`
  flex: 1;
`;

// =============================================
// SUBSCRIPTION BANNER SKELETON
// =============================================
const SubscriptionBannerSkeleton = styled.section`
  background: linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%);
  padding: 4rem 2rem;
  position: relative;
  overflow: hidden;
`;

const SubscriptionContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 300px 1fr 1fr;
  align-items: center;
  gap: 3rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 2rem;
  }
`;

const Illustration3D = styled.div`
  position: relative;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: '';
    position: absolute;
    width: 60px;
    height: 120px;
    background: linear-gradient(45deg, #667eea, #764ba2);
    border-radius: 30px;
    transform: rotate(15deg);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
  }

  &::after {
    content: '';
    position: absolute;
    width: 40px;
    height: 80px;
    background: linear-gradient(45deg, #f093fb, #f5576c);
    border-radius: 20px;
    transform: rotate(-25deg) translateX(40px);
    box-shadow: 0 8px 20px rgba(240, 147, 251, 0.3);
  }
`;

const SubscriptionContent = styled.div`
  text-align: left;

  @media (max-width: 1024px) {
    text-align: center;
  }
`;

// =============================================
// FOOTER SKELETONS
// =============================================
const FooterContentSkeleton = styled.section`
  background: #ffffff;
  padding: 4rem 2rem;
  border-top: 1px solid #e5e7eb;
`;

const FooterGrid = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 3rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const FooterItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MITFooterSkeleton = styled.footer`
  background: #f8fafc;
  padding: 4rem 2rem;
  border-top: 1px solid #e2e8f0;
`;

const MITContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 4rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const MITLeft = styled.div`
  display: flex;
  flex-direction: column;
`;

const ExpertiseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 2rem;
`;

const MITRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

// =============================================
// MAIN SKELETON COMPONENT
// =============================================
const SkeletonBlog = ({ type, theme }) => {
  // Enterprise Header Component
  const EnterpriseHeaderSkeleton = () => (
    <HeaderSkeleton theme={theme}>
      <HeaderContent>
        <ThemedSkeleton width={150} height={32} theme={theme} />
        <NavLinks>
          {Array(5).fill().map((_, index) => (
            <ThemedSkeleton key={index} width={80} height={20} theme={theme} />
          ))}
        </NavLinks>
      </HeaderContent>
    </HeaderSkeleton>
  );

  // Enterprise Hero Component
  const EnterpriseHeroSkeleton = () => (
    <HeroSkeleton>
      <HeroGrid>
        <HeroContent>
          <ThemedSkeleton height={80} style={{ marginBottom: '1.5rem' }} theme={theme} />
          <ThemedSkeleton height={60} style={{ marginBottom: '2rem', maxWidth: '500px' }} theme={theme} />
          <ThemedSkeleton count={3} height={25} style={{ marginBottom: '2rem' }} theme={theme} />
          <HeroButtons>
            <ThemedSkeleton width={180} height={48} style={{ borderRadius: '12px' }} theme={theme} />
            <ThemedSkeleton width={160} height={48} style={{ borderRadius: '12px' }} theme={theme} />
          </HeroButtons>
        </HeroContent>
        <HeroVisual>
          <ThemedSkeleton height={500} className="skeleton-hero-image" theme={theme} />
        </HeroVisual>
      </HeroGrid>
    </HeroSkeleton>
  );

  // HBR Section Component
  const HBRSectionSkeletonComponent = () => (
    <HBRSectionSkeleton theme={theme}>
      <HBRGrid>
        {/* Main Feature */}
        <MainFeature>
          <ThemedSkeleton height={300} style={{ width: '100%', borderRadius: '16px', marginBottom: '1.5rem' }} theme={theme} />
          <ThemedSkeleton width={120} height={16} style={{ marginBottom: '0.75rem' }} theme={theme} />
          <ThemedSkeleton height={60} style={{ marginBottom: '1rem' }} theme={theme} />
          <ThemedSkeleton count={2} height={24} style={{ marginBottom: '1rem' }} theme={theme} />
          <ThemedSkeleton width={100} height={16} theme={theme} />
        </MainFeature>

        {/* Middle Column */}
        <MiddleColumn>
          {Array(2).fill().map((_, index) => (
            <MiddleArticle key={index}>
              <ThemedSkeleton height={100} width={120} style={{ borderRadius: '8px', flexShrink: 0 }} theme={theme} />
              <MiddleContent>
                <ThemedSkeleton width={80} height={14} style={{ marginBottom: '0.5rem' }} theme={theme} />
                <ThemedSkeleton height={32} style={{ marginBottom: '0.5rem' }} theme={theme} />
                <ThemedSkeleton count={2} height={18} style={{ marginBottom: '0.5rem' }} theme={theme} />
                <ThemedSkeleton width={80} height={14} theme={theme} />
              </MiddleContent>
            </MiddleArticle>
          ))}
        </MiddleColumn>

        {/* Right Column */}
        <RightColumn>
          <LatestHeader theme={theme}>
            <ThemedSkeleton width={100} height={24} theme={theme} />
          </LatestHeader>
          <LatestArticles>
            {Array(3).fill().map((_, index) => (
              <LatestArticle key={index} theme={theme}>
                <ThemedSkeleton height={28} style={{ marginBottom: '0.5rem' }} theme={theme} />
                <ThemedSkeleton width={120} height={14} theme={theme} />
              </LatestArticle>
            ))}
          </LatestArticles>
          <NewsletterCard>
            <ThemedSkeleton count={2} height={18} style={{ marginBottom: '1rem' }} theme={theme} />
            <ThemedSkeleton width={100} height={36} style={{ borderRadius: '8px' }} theme={theme} />
          </NewsletterCard>
        </RightColumn>
      </HBRGrid>
    </HBRSectionSkeleton>
  );

  // Multimedia Section Component
  const MultimediaSkeletonComponent = () => (
    <MultimediaSectionSkeleton>
      <MultimediaSidebar>
        <SidebarContent>
          <VerticalText>
            <ThemedSkeleton width={20} height={200} theme={theme} />
          </VerticalText>
        </SidebarContent>
      </MultimediaSidebar>
      <MultimediaContent>
        <VideoGrid>
          {Array(3).fill().map((_, index) => (
            <VideoCard key={index}>
              <VideoContainer>
                <ThemedSkeleton height={240} style={{ width: '100%' }} theme={theme} />
                <PlayButton>
                  <ThemedSkeleton width={70} height={70} circle theme={theme} />
                </PlayButton>
              </VideoContainer>
              <VideoTextContent>
                <ThemedSkeleton count={4} height={20} style={{ marginBottom: '0.5rem' }} theme={theme} />
              </VideoTextContent>
            </VideoCard>
          ))}
        </VideoGrid>
        <MultimediaBottom>
          <ThemedSkeleton width={300} height={20} theme={theme} />
          <NavigationButtons>
            <ThemedSkeleton width={56} height={56} style={{ borderRadius: '4px' }} theme={theme} />
            <ThemedSkeleton width={56} height={56} style={{ borderRadius: '4px' }} theme={theme} />
          </NavigationButtons>
        </MultimediaBottom>
      </MultimediaContent>
    </MultimediaSectionSkeleton>
  );

  // Filter Section Component
  const FilterSkeletonComponent = () => (
    <FilterSectionSkeleton theme={theme}>
      <FilterTabs>
        {Array(6).fill().map((_, index) => (
          <ThemedSkeleton key={index} width={120} height={40} style={{ borderRadius: '50px' }} theme={theme} />
        ))}
      </FilterTabs>
      <SubFilters>
        {Array(5).fill().map((_, index) => (
          <ThemedSkeleton key={index} width={80} height={30} style={{ borderRadius: '25px' }} theme={theme} />
        ))}
      </SubFilters>
    </FilterSectionSkeleton>
  );

  // Article Grid Component
  const ArticleGridSkeletonComponent = () => (
    <ArticleGridSkeleton theme={theme}>
      <MainArticles>
        {Array(3).fill().map((_, index) => (
          <FeaturedArticle key={index} theme={theme}>
            <ThemedSkeleton height={250} style={{ width: '100%', borderRadius: '0', marginBottom: '0' }} theme={theme} />
            <ArticleContent>
              <ThemedSkeleton width={100} height={16} style={{ marginBottom: '0.75rem' }} theme={theme} />
              <ThemedSkeleton height={32} style={{ marginBottom: '0.75rem' }} theme={theme} />
              <ThemedSkeleton count={2} height={20} style={{ marginBottom: '1rem' }} theme={theme} />
              <ArticleTags>
                {Array(3).fill().map((_, i) => (
                  <ThemedSkeleton key={i} width={60} height={20} style={{ borderRadius: '12px' }} theme={theme} />
                ))}
              </ArticleTags>
              <ArticleMeta>
                <ThemedSkeleton width={80} height={16} theme={theme} />
                <ThemedSkeleton width={100} height={16} theme={theme} />
              </ArticleMeta>
              <ThemedSkeleton width={120} height={32} style={{ borderRadius: '6px' }} theme={theme} />
            </ArticleContent>
          </FeaturedArticle>
        ))}
      </MainArticles>
      <Sidebar>
        {/* Newsletter Card */}
        <SidebarCard theme={theme}>
          <ThemedSkeleton height={24} style={{ marginBottom: '1rem', position: 'relative' }} theme={theme} />
          <ThemedSkeleton count={2} height={18} style={{ marginBottom: '1.5rem' }} theme={theme} />
          <ThemedSkeleton height={40} style={{ marginBottom: '1rem', borderRadius: '8px' }} theme={theme} />
          <ThemedSkeleton width={100} height={36} style={{ borderRadius: '8px' }} theme={theme} />
        </SidebarCard>
        
        {/* Topics Card */}
        <SidebarCard theme={theme}>
          <ThemedSkeleton height={24} style={{ marginBottom: '1rem' }} theme={theme} />
          <TopicList>
            {Array(5).fill().map((_, index) => (
              <ThemedSkeleton key={index} height={20} style={{ borderRadius: '8px' }} theme={theme} />
            ))}
          </TopicList>
        </SidebarCard>
        
        {/* Achievements Card */}
        <SidebarCard theme={theme}>
          <ThemedSkeleton height={24} style={{ marginBottom: '1rem' }} theme={theme} />
          <AchievementList>
            {Array(3).fill().map((_, index) => (
              <AchievementItem key={index} theme={theme}>
                <ThemedSkeleton width={20} height={20} style={{ borderRadius: '4px' }} theme={theme} />
                <AchievementInfo>
                  <ThemedSkeleton height={18} style={{ marginBottom: '0.25rem' }} theme={theme} />
                  <ThemedSkeleton height={14} theme={theme} />
                </AchievementInfo>
              </AchievementItem>
            ))}
          </AchievementList>
        </SidebarCard>
      </Sidebar>
    </ArticleGridSkeleton>
  );

  // Subscription Banner Component
  const SubscriptionBannerSkeletonComponent = () => (
    <SubscriptionBannerSkeleton>
      <SubscriptionContainer>
        <ThemedSkeleton width={200} height={120} style={{ borderRadius: '20px' }} theme={theme} />
        <Illustration3D />
        <SubscriptionContent>
          <ThemedSkeleton height={60} style={{ marginBottom: '1.5rem' }} theme={theme} />
          <ThemedSkeleton width={150} height={48} style={{ borderRadius: '8px' }} theme={theme} />
        </SubscriptionContent>
      </SubscriptionContainer>
    </SubscriptionBannerSkeleton>
  );

  // Footer Content Component
  const FooterContentSkeletonComponent = () => (
    <FooterContentSkeleton>
      <FooterGrid>
        {Array(4).fill().map((_, index) => (
          <FooterColumn key={index}>
            <ThemedSkeleton height={24} style={{ marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid #e5e7eb' }} theme={theme} />
            <FooterItems>
              {Array(4).fill().map((_, i) => (
                <ThemedSkeleton key={i} height={18} theme={theme} />
              ))}
            </FooterItems>
          </FooterColumn>
        ))}
      </FooterGrid>
    </FooterContentSkeleton>
  );

  // MIT Footer Component
  const MITFooterSkeletonComponent = () => (
    <MITFooterSkeleton>
      <MITContent>
        <MITLeft>
          <ThemedSkeleton height={60} style={{ marginBottom: '0.5rem' }} theme={theme} />
          <ThemedSkeleton width={400} height={16} style={{ marginBottom: '2rem' }} theme={theme} />
          <ThemedSkeleton count={2} height={18} style={{ marginBottom: '2rem' }} theme={theme} />
          <ThemedSkeleton height={24} style={{ marginBottom: '1.5rem' }} theme={theme} />
          <ExpertiseList>
            {Array(6).fill().map((_, index) => (
              <ThemedSkeleton key={index} height={18} theme={theme} />
            ))}
          </ExpertiseList>
        </MITLeft>
        <MITRight>
          {Array(5).fill().map((_, index) => (
            <ThemedSkeleton key={index} height={48} style={{ borderRadius: '0' }} theme={theme} />
          ))}
        </MITRight>
      </MITContent>
    </MITFooterSkeleton>
  );

  // Component Selection Logic
  switch (type) {
    case 'enterprise-header':
      return <EnterpriseHeaderSkeleton />;
    case 'enterprise-hero':
      return <EnterpriseHeroSkeleton />;
    case 'hbr-section':
      return <HBRSectionSkeletonComponent />;
    case 'multimedia-section':
      return <MultimediaSkeletonComponent />;
    case 'filter-section':
      return <FilterSkeletonComponent />;
    case 'article-grid':
      return <ArticleGridSkeletonComponent />;
    case 'subscription-banner':
      return <SubscriptionBannerSkeletonComponent />;
    case 'footer-content':
      return <FooterContentSkeletonComponent />;
    case 'mit-footer':
      return <MITFooterSkeletonComponent />;
    case 'enterprise-blog':
      return (
        <SkeletonContainer enterprise theme={theme}>
          <EnterpriseHeaderSkeleton />
          <EnterpriseHeroSkeleton />
          <HBRSectionSkeletonComponent />
          <div style={{ padding: '4rem 2rem' }}>
            <ThemedSkeleton height={40} width={300} style={{ marginBottom: '1rem' }} theme={theme} />
            <ThemedSkeleton count={2} height={20} style={{ marginBottom: '2rem' }} theme={theme} />
            <FilterSkeletonComponent />
            <ArticleGridSkeletonComponent />
          </div>
          <SubscriptionBannerSkeletonComponent />
          <MultimediaSkeletonComponent />
          <FooterContentSkeletonComponent />
          <MITFooterSkeletonComponent />
        </SkeletonContainer>
      );
    default:
      return (
        <SkeletonContainer theme={theme}>
          <div style={{ padding: '4rem 2rem' }}>
            <ThemedSkeleton height={80} count={3} style={{ marginBottom: '2rem' }} theme={theme} />
            <ThemedSkeleton height={30} count={2} style={{ marginBottom: '2rem' }} theme={theme} />
            <ThemedSkeleton height={50} theme={theme} />
          </div>
        </SkeletonContainer>
      );
  }
};

export default SkeletonBlog;