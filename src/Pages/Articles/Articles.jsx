import React, { useState, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import { GlobalState } from "../../GlobalState";
import SkeletonBlog from '../../Components/Skeleton/skeletonBlog';
import "react-loading-skeleton/dist/skeleton.css";
import axios from "axios";
import { truncate, getBasicAuth } from "../../Utils/helperFunctions";
import { projectData } from '../Projects/ProjectsData';
import faqs from "../../Constants/faq.js";
import ThemeSwitcher from "./ThemeSwitcher";
import { 
  FiTrendingUp, FiUsers, FiTarget, FiGlobe, FiCpu, FiShield,
  FiBarChart2, FiCode, FiBookOpen, FiZap, FiLayers, FiStar,
  FiBriefcase, FiBox, FiSettings, FiDatabase, FiCloud,
  FiSearch, FiFilter, FiArrowRight, FiPlay, FiAward, FiMail,
  FiCalendar, FiClock, FiEye, FiHeart, FiShare2
} from "react-icons/fi";
import MinimalResumeCTA from "../../Components/CTA/CareerCompose/MinimalResumeCTA.jsx";
import ResumeCTA from "../../Components/CTA/CareerCompose/ResumeCTA.jsx";
import ResumeBannerCTA from "../../Components/CTA/CareerCompose/ResumeBannerCTA.jsx";
import StateFarm from "../../Components/Banner/StateFarm.jsx";
import CaseStudyBanner from "../../Components/Banner/CaseStudyBanner.jsx";

// Enterprise Container - matching EnterpriseCreateArticle aesthetic
const EnterpriseContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  color: #ffffff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  transition: all 0.3s ease;
`;

// Professional Header with backdrop blur
const ProfessionalHeader = styled(motion.header)`
  background: rgba(15, 15, 35, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(motion.a)`
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  
  &:hover {
    color: #667eea;
    background: rgba(102, 126, 234, 0.1);
    transform: translateY(-2px);
  }
`;

// Hero Section with sophisticated layout
const HeroSection = styled.section`
  padding: 6rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  min-height: 80vh;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
    padding: 4rem 2rem;
  }
`;

const HeroContent = styled.div`
  z-index: 2;
`;

const HeroTitle = styled(motion.h1)`
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  color: #ffffff;
  
  .highlight {
    background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.25rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 0.8);
  max-width: 500px;
`;

const CTASection = styled(motion.div)`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }
`;

const PrimaryButton = styled(motion.button)`
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const SecondaryButton = styled(motion.button)`
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1rem 2rem;
  border-radius: 12px;
  color: #ffffff;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: #667eea;
    transform: translateY(-2px);
  }
`;

const HeroVisual = styled(motion.div)`
  position: relative;
  height: 500px;
  background: linear-gradient(45deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
`;

const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 20px;
`;

// Enterprise Stats Section
const StatsSection = styled.section`
  padding: 4rem 2rem;
  background: rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
`;

const StatsContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
`;

const StatCard = styled(motion.div)`
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
    border-color: rgba(102, 126, 234, 0.3);
  }
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

// Content Sections
const ContentSection = styled.section`
  padding: 4rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const SectionTitle = styled(motion.h2)`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #ffffff;
  
  .accent {
    background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const SectionSubtitle = styled(motion.p)`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

// Enterprise Filtering System
const FilterSection = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
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

const FilterTab = styled(motion.button)`
  background: ${props => props.active 
    ? 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)'
    : 'transparent'
  };
  border: 1px solid ${props => props.active 
    ? 'transparent' 
    : 'rgba(255, 255, 255, 0.2)'
  };
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: ${props => props.active 
      ? 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)'
      : 'rgba(255, 255, 255, 0.1)'
    };
    border-color: #667eea;
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }
`;

const SubFilters = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const SubFilterChip = styled(motion.button)`
  background: ${props => props.active 
    ? 'rgba(102, 126, 234, 0.3)'
    : 'transparent'
  };
  border: 1px solid ${props => props.active 
    ? '#667eea' 
    : 'rgba(255, 255, 255, 0.2)'
  };
  color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    border-color: #667eea;
    transform: scale(1.05);
    background: rgba(102, 126, 234, 0.2);
  }
`;

// Pagination Styles
const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  margin-top: 3rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  grid-column: 1 / -1;
`;

const PageButton = styled(motion.button)`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: ${props => props.active ? '#667eea' : 'rgba(255, 255, 255, 0.08)'};
  color: ${props => props.active ? '#ffffff' : 'rgba(255, 255, 255, 0.8)'};
  border: 1px solid ${props => props.active ? '#667eea' : 'rgba(255, 255, 255, 0.2)'};
  font-weight: ${props => props.active ? '600' : '500'};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    background: ${props => props.active ? '#764ba2' : 'rgba(102, 126, 234, 0.2)'};
    border-color: #667eea;
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PaginationInfo = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  margin: 0 1rem;
`;

// Article Grid Layout
const ArticleGrid = styled.div`
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

const FeaturedArticle = styled(motion.article)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
    border-color: rgba(102, 126, 234, 0.3);
  }
`;

const ArticleImage = styled.div`
  height: 250px;
  background: ${props => props.bgImage 
    ? `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${props.bgImage})`
    : 'linear-gradient(45deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2))'
  };
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(45deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }
`;

const ArticleContent = styled.div`
  padding: 1.5rem;
`;

const ArticleCategory = styled.div`
  color: #667eea;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ArticleTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  line-height: 1.4;
  margin-bottom: 0.75rem;
  color: #ffffff;
  transition: color 0.3s ease;

  &:hover {
    color: #667eea;
  }
`;

const ArticleExcerpt = styled.p`
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 1rem;
  font-size: 0.95rem;
`;

const ArticleMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
  margin-bottom: 1rem;
`;

const ArticleTags = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
`;

const ArticleTag = styled.span`
  background: rgba(102, 126, 234, 0.2);
  color: #667eea;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid rgba(102, 126, 234, 0.3);
`;

const ReadMoreButton = styled(motion.button)`
  background: transparent;
  border: 1px solid #667eea;
  color: #667eea;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: #667eea;
    color: white;
    transform: translateX(4px);
  }
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const SidebarCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
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

const SidebarTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #ffffff;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -8px;
    width: 30px;
    height: 2px;
    background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
  }
`;

const NewsletterForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const NewsletterInput = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.75rem;
  color: white;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
  }
`;

const SubscribeButton = styled(motion.button)`
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
`;

const TopicList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const TopicItem = styled(motion.div)`
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #ffffff;
  font-size: 0.9rem;
  
  &:hover {
    background: rgba(102, 126, 234, 0.1);
    border-color: #667eea;
    transform: translateX(4px);
  }
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
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;

  &:hover {
    border-color: #667eea;
    transform: translateY(-2px);
  }
`;

const AchievementInfo = styled.div`
  flex: 1;
`;

const AchievementTitle = styled.div`
  font-weight: 600;
  font-size: 0.9rem;
  color: #ffffff;
  margin-bottom: 0.25rem;
`;

const AchievementDesc = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
`;

// HBR-Style Featured Section
const HBRSection = styled.section`
  padding: 3rem 2rem;
  background: rgba(0, 0, 0, 0.05);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const HBRContainer = styled.div`
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

// Left Column - Main Featured Article
const MainFeature = styled(motion.article)`
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const MainFeatureImage = styled.div`
  width: 100%;
  height: 300px;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 1.5rem;
  background: #e8b4b8;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const MainFeatureCategory = styled.div`
  color: #1e90ff;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
`;

const MainFeatureTitle = styled.h2`
  font-size: 2.2rem;
  font-weight: 400;
  line-height: 1.2;
  color: #6b7280;
  margin-bottom: 1rem;
  font-family: Georgia, serif;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const MainFeatureExcerpt = styled.p`
  color: #6b7280;
  line-height: 1.5;
  margin-bottom: 1rem;
  font-size: 1rem;
`;

const MainFeatureAuthor = styled.div`
  color: #9ca3af;
  font-size: 0.9rem;
`;

// Middle Column
const MiddleColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

const MiddleArticle = styled(motion.article)`
  display: flex;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    opacity: 0.8;
  }
`;

const MiddleArticleImage = styled.div`
  width: 120px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const MiddleArticleContent = styled.div`
  flex: 1;
`;

const MiddleArticleCategory = styled.div`
  color: #1e90ff;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const MiddleArticleTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 400;
  line-height: 1.3;
  color: #6b7280;
  margin-bottom: 0.5rem;
  font-family: Georgia, serif;
`;

const MiddleArticleExcerpt = styled.p`
  color: #9ca3af;
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 0.5rem;
`;

const MiddleArticleAuthor = styled.div`
  color: #9ca3af;
  font-size: 0.8rem;
`;

// Right Column - The Latest
const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const LatestHeader = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: #374151;
  margin-bottom: 2rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const LatestArticle = styled(motion.article)`
  padding: 1.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    opacity: 0.8;
  }
  
  &:last-of-type {
    border-bottom: none;
  }
`;

const LatestTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 400;
  line-height: 1.3;
  color: #6b7280;
  margin-bottom: 0.5rem;
  font-family: Georgia, serif;
`;

const LatestAuthor = styled.div`
  color: #9ca3af;
  font-size: 0.85rem;
`;

// Newsletter Card in Grid
const NewsletterCard = styled(motion.div)`
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 16px;
  padding: 2rem 1.5rem;
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
  
  @media (max-width: 768px) {
    grid-column: 1 / -1;
  }
`;

const NewsletterText = styled.p`
  color: #9db8e2ff;
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 1rem;
  
  strong {
    font-weight: 700;
  }
`;


const NewsletterButton = styled(motion.button)`
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
`;

// const NewsletterIcon = styled.div`
//   position: absolute;
//   top: 1rem;
//   right: 1rem;
//   color: rgba(102, 126, 234, 0.6);
//   z-index: 2;
// `;


// 3. FOOTER CONTENT GRID SECTION
const FooterContentSection = styled.section`
  background: #ffffff;
  padding: 4rem 2rem;
  border-top: 1px solid #e5e7eb;
`;

const FooterContentContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
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

const FooterColumnTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
`;

const FooterSubheader = styled.h4`
  font-size: 0.9rem;
  color: #6b7280;
  margin: 1.5rem 0 0.5rem 0;
  font-weight: 500;
`;

// Popular Articles List
const PopularArticlesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const PopularArticle = styled.div`
  padding-bottom: 1rem;
  border-bottom: 1px solid #f3f4f6;
  
  &:last-child {
    border-bottom: none;
  }
`;

const PopularTitle = styled.h4`
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.4;
  color: #4b5563;
  margin: 0;
  cursor: pointer;
  font-family: Georgia, serif;
  
  &:hover {
    color: #1f2937;
  }
`;

// Newsletter Items
const NewsletterList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const NewsletterItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
`;

const NewsletterIcon = styled.div`
  width: 40px;
  height: 40px;
  background: ${props => props.color || '#1f2937'};
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.8rem;
  flex-shrink: 0;
`;

const NewsletterContent = styled.div`
  flex: 1;
`;

const NewsletterTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
`;

const NewsletterDescription = styled.p`
  font-size: 0.9rem;
  color: #6b7280;
  line-height: 1.4;
  margin: 0 0 0.75rem 0;
`;

const NewsletterSignup = styled(motion.button)`
  background: transparent;
  border: 1px solid #d1d5db;
  padding: 0.4rem 1rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: #4b5563;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  
  &:hover {
    border-color: #6b7280;
    background: #f9fafb;
  }
`;

// Exclusive Content
const ExclusiveList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ExclusiveItem = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-start;
`;

const ExclusiveThumbnail = styled.div`
  width: 60px;
  height: 60px;
  background: ${props => props.bgColor || '#e5e7eb'};
  border-radius: 8px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
`;

const ExclusiveContent = styled.div`
  flex: 1;
`;

const ExclusiveCategory = styled.div`
  font-size: 0.8rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
  font-weight: 500;
`;

const ExclusiveTitle = styled.h4`
  font-size: 0.95rem;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.3;
  margin: 0;
  cursor: pointer;
  
  &:hover {
    color: #4b5563;
  }
`;

// Podcast Items  
const PodcastList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const PodcastItem = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-start;
`;

const PodcastIcon = styled.div`
  width: 40px;
  height: 40px;
  background: ${props => props.color || '#667eea'};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.9rem;
  flex-shrink: 0;
`;

const PodcastContent = styled.div`
  flex: 1;
`;

const PodcastCategory = styled.div`
  font-size: 0.8rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
  font-weight: 500;
`;

const PodcastTitle = styled.h4`
  font-size: 0.95rem;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.3;
  margin: 0;
  cursor: pointer;
  
  &:hover {
    color: #4b5563;
  }
`;

const MoreLink = styled.a`
  font-size: 0.9rem;
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

// 1. MIT NEWS-STYLE FOOTER SECTION
const MITFooterSection = styled.footer`
  background: #f8fafc;
  padding: 4rem 2rem;
  border-top: 1px solid #e2e8f0;
`;

const MITFooterContainer = styled.div`
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

const MITFooterLeft = styled.div`
  display: flex;
  flex-direction: column;
`;

const MITLogo = styled.h1`
  font-size: 3.5rem;
  font-weight: 900;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.02em;
`;

const MITTagline = styled.div`
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 2rem;
`;

const MITDescription = styled.p`
  color: #475569;
  line-height: 1.6;
  margin-bottom: 2rem;
  
  a {
    color: #1e293b;
    text-decoration: underline;
  }
`;

const ExpertiseHeader = styled.h3`
  color: #1e293b;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
`;

const ExpertiseList = styled.ol`
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ExpertiseItem = styled.li`
  display: flex;
  align-items: flex-start;
  color: #475569;
  line-height: 1.5;
  
  &::before {
    content: "${props => props.number}.";
    color: #ef4444;
    font-weight: 600;
    margin-right: 0.75rem;
    min-width: 20px;
  }
  
  a {
    color: #1e293b;
    text-decoration: underline;
    
    &:hover {
      color: #0f172a;
    }
  }
`;

const MITFooterLinks = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const FooterLinkGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FooterLink = styled.a`
  color: #1e293b;
  text-decoration: underline;
  font-size: 0.9rem;
  cursor: pointer;
  
  &:hover {
    color: #0f172a;
  }
`;

const MITFooterRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Subscription2Button = styled(motion.button)`
  background: transparent;
  border: 2px solid #1e293b;
  color: #1e293b;
  padding: 1rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: 0;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  
  &:hover {
    background: #1e293b;
    color: white;
    transform: translateY(-1px);
  }
`;

const FeaturedMultimediaSection = styled.section`
  background: #ffffff;
  padding: 4rem 2rem;
  border-top: 1px solid #e5e7eb;
  position: relative;
`;

const MultimediaSection = styled.section`
  display: flex;
  min-height: 100vh;
  background: white;
`;

const VerticalSidebar = styled.div`
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

const VerticalText = styled.span`
  writing-mode: vertical-rl;
  text-orientation: mixed;
  letter-spacing: 0.05em;
  color: #1f2937;
  font-size: 40px;
  font-weight: 400;
  line-height: 1;
  font-family: 'Inter', Arial, sans-serif;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 48px 48px 0 48px;
`;

const CardsRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 32px;
`;

const VideoCard = styled.div`
  display: flex;
  flex-direction: column;
  border: 3px solid black;
  background: white;
  width: 430px;
  min-width: 430px;
  height: 520px;
`;

const VideoImageContainer = styled.div`
  position: relative;
`;

const VideoImage = styled.img`
  width: 100%;
  height: 240px;
  object-fit: cover;
`;

const PlayButtonOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PlayButton = styled.div`
  width: 70px;
  height: 70px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: white;
    transform: scale(1.05);
  }

  &::after {
    content: '';
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 12px 0 12px 20px;
    border-color: transparent transparent transparent black;
    margin-left: 4px;
  }
`;

const VideoTextContent = styled.div`
  flex: 1;
  padding: 24px;
`;

const VideoDescription = styled.p`
  color: black;
  font-size: 20px;
  line-height: 1.4;
  font-weight: 400;
  margin: 0;
  font-family: 'Inter', Arial, sans-serif;
`;

const BottomRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 48px;
  margin-bottom: 0;
`;

const YouTubeLink = styled.a`
  font-size: 20px;
  font-weight: 500;
  text-decoration: underline;
  color: black;
  font-family: 'Inter', Arial, sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    color: #dc2626;
  }

  &::after {
    content: ' →';
    margin-left: 4px;
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  margin-right: 32px;
`;

const NavButton = styled(motion.button)`
  width: 56px;
  height: 56px;
  border: 2px solid #ef4444;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.active ? '#ef4444' : 'white'};
  color: ${props => props.active ? 'white' : '#ef4444'};

  &:hover {
    background: ${props => props.active ? '#dc2626' : '#fef2f2'};
  }
`;

const ChevronIcon = styled.span`
  font-size: 24px;
  font-weight: bold;
  ${props => props.direction === 'left' ? 'transform: scaleX(1);' : ''}
`;

function EnterpriseTechGuide() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeSubFilter, setActiveSubFilter] = useState('all');
  const [isMobileView, setIsMobileView] = useState(false);
  const [email, setEmail] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [mostLikedArticle, setMostLikedArticle] = useState(null);
  const [hbrArticles, setHbrArticles] = useState({
    main: null,
    middle1: null,
    middle2: null,
    latest: []
  });

  // State from Articles component
  const state = useContext(GlobalState);
  const [isLoggedIn] = state?.userAPI?.isLoggedIn || [false];
  const [isAdmin] = state?.userAPI?.isAdmin || [false];
  const [articles] = state?.articlesAPI?.articles || [[]];
  const [callback, setCallback] = state?.articlesAPI?.callback || [false, () => {}];
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(2);

  // Fetch most-liked article on component mount
  useEffect(() => {
    const fetchMostLikedArticle = async () => {
      try {
        setLoading(true);
        const username = "admin";
        const password = "password";
        const auth = getBasicAuth(username, password);
        
        const response = await axios.get('/api/articles', {
          headers: {
            Authorization: auth,
          }
        });
        
        if (response.data.articles && response.data.articles.length > 0) {
          const allArticles = response.data.articles;
          
          // Set most liked article
          const sorted = [...allArticles].sort((a, b) => (b.likes || 0) - (a.likes || 0));
          setMostLikedArticle(sorted[0]);
          
          // Get articles by category count
          const categoryCount = {};
          const categoryArticles = {};
          
          allArticles.forEach(article => {
            const cat = article.categories?.[0] || 'general';
            categoryCount[cat] = (categoryCount[cat] || 0) + 1;
            if (!categoryArticles[cat]) {
              categoryArticles[cat] = [];
            }
            categoryArticles[cat].push(article);
          });
          
          // Sort categories by count (descending)
          const sortedCategories = Object.entries(categoryCount)
            .sort((a, b) => b[1] - a[1])
            .map(([category]) => category);
          
          const mostUsedCategory = sortedCategories[0];
          const secondMostUsedCategory = sortedCategories[1];
          const thirdMostUsedCategory = sortedCategories[2];
          
          // Get articles from most used category, sorted by likes (excluding mostLikedArticle)
          const mainCategoryArticles = (categoryArticles[mostUsedCategory] || [])
            .filter(a => a._id !== sorted[0]?._id)
            .sort((a, b) => (b.likes || 0) - (a.likes || 0));
          const main = mainCategoryArticles[0];
          
          // Get top article from 2nd most used category
          const middle1 = (categoryArticles[secondMostUsedCategory] || [])
            .sort((a, b) => (b.likes || 0) - (a.likes || 0))[0];
          
          // Get top article from 3rd most used category
          const middle2 = (categoryArticles[thirdMostUsedCategory] || [])
            .sort((a, b) => (b.likes || 0) - (a.likes || 0))[0];
          
          // Get latest articles excluding mostLikedArticle, main, middle1, middle2
          const usedIds = new Set([sorted[0]?._id, main?._id, middle1?._id, middle2?._id].filter(Boolean));
          const latestArticles = allArticles
            .filter(a => !usedIds.has(a._id))
            .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
            .slice(0, 3);
          
          setHbrArticles({
            main,
            middle1,
            middle2,
            latest: latestArticles
          });
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
        setLoading(false);
      }
    };
    fetchMostLikedArticle();
  }, []);

  console.log('Most Liked Article:', {mostLikedArticle});
  // Enterprise Categories with professional focus
  const enterpriseCategories = {
    'all': { 
      label: 'All Insights', 
      icon: FiGlobe,
      subFilters: ['all', 'featured', 'trending', 'recent']
    },
    'engineering': { 
      label: 'Software Engineering', 
      icon: FiCode,
      subFilters: ['all', 'architecture', 'distributed-systems', 'performance', 'security', 'devops']
    },
    'leadership': { 
      label: 'Tech Leadership', 
      icon: FiUsers,
      subFilters: ['all', 'management', 'team-building', 'strategy', 'mentoring', 'growth']
    },
    'enterprise': { 
      label: 'Enterprise Solutions', 
      icon: FiBox,
      subFilters: ['all', 'scalability', 'cloud', 'microservices', 'automation', 'integration']
    },
    'innovation': { 
      label: 'Innovation & AI', 
      icon: FiCpu,
      subFilters: ['all', 'machine-learning', 'artificial-intelligence', 'emerging-tech', 'research']
    },
    'career': { 
      label: 'Career Growth', 
      icon: FiBriefcase,
      subFilters: ['all', 'skills', 'interviews', 'networking', 'personal-brand', 'transitions']
    }
  };

  const subFilterLabels = {
    // General
    'all': 'All',
    'featured': 'Featured',
    'trending': 'Trending',
    'recent': 'Recent',
    // Engineering
    'architecture': 'Architecture',
    'distributed-systems': 'Distributed Systems',
    'performance': 'Performance',
    'security': 'Security',
    'devops': 'DevOps',
    // Leadership
    'management': 'Engineering Management',
    'team-building': 'Team Building',
    'strategy': 'Technical Strategy',
    'mentoring': 'Mentoring',
    'growth': 'Growth',
    // Enterprise
    'scalability': 'Scalability',
    'cloud': 'Cloud Architecture',
    'microservices': 'Microservices',
    'automation': 'Automation',
    'integration': 'System Integration',
    // Innovation
    'machine-learning': 'Machine Learning',
    'artificial-intelligence': 'AI',
    'emerging-tech': 'Emerging Tech',
    'research': 'Research',
    // Career
    'skills': 'Technical Skills',
    'interviews': 'Interview Prep',
    'networking': 'Professional Network',
    'personal-brand': 'Personal Branding',
    'transitions': 'Career Transitions'
  };

  // Transform database articles to match UI structure
  const transformedArticles = (articles || []).map(article => {
    // Map database category to UI category
    const categoryMap = {
      'distributed-systems': 'engineering',
      'identity-auth': 'engineering',
      'leadership': 'leadership',
      'enterprise-architecture': 'enterprise',
      'devops': 'enterprise',
      'ai-ml': 'innovation',
      'career-growth': 'career'
    };
    
    const dbCategory = article.categories?.[0] || 'general';
    const uiCategory = categoryMap[dbCategory] || 'engineering';
    
    return {
      id: article._id,
      _id: article._id,
      title: article.title || 'Untitled Article',
      excerpt: article.description || article.markdown?.substring(0, 150) || '',
      category: uiCategory,
      subCategory: dbCategory,
      image: article.images?.url || "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
      readTime: article.readTime || "5 min read",
      publishDate: article.createdAt ? new Date(article.createdAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }) : 'Unknown Date',
      tags: article.categories || [],
      likes: article.likes || 0,
      views: article.views || 0,
      author: article.postedBy?.name || 'Dominique Hosea'
    };
  });

  // Filter articles based on active filters
  const filteredArticles = transformedArticles.filter(article => {
    if (activeFilter === 'all') return true;
    if (article.category !== activeFilter) return false;
    if (activeSubFilter === 'all') return true;
    return article.subCategory === activeSubFilter;
  });
  
  // Create set of featured article IDs to exclude from main grid
  const featuredArticleIds = new Set([
    mostLikedArticle?._id,
    hbrArticles.main?._id,
    hbrArticles.middle1?._id,
    hbrArticles.middle2?._id,
    ...(hbrArticles.latest?.map(a => a._id) || [])
  ].filter(Boolean));
  
  // Remove featured articles from the grid
  const deduplicatedArticles = filteredArticles.filter(
    article => !featuredArticleIds.has(article._id)
  );
  
  // Sort by likes (most popular first)
  const sortedArticles = [...deduplicatedArticles].sort((a, b) => (b.likes || 0) - (a.likes || 0));

  // Pagination logic
  const totalPages = Math.ceil(sortedArticles.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentArticles = sortedArticles.slice(indexOfFirstPost, indexOfLastPost);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, activeSubFilter]);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to articles section
    const articlesSection = document.getElementById('articles-section');
    if (articlesSection) {
      articlesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Generate page numbers array
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  // Get expertise categories from articles (minimum 3 articles per category)
  const getExpertiseCategories = () => {
    try {
      const categoryCount = {};
      const categoryNames = {
        'engineering': 'Software Engineering & Architecture',
        'leadership': 'Engineering Leadership & Team Building',
        'enterprise': 'Enterprise Solutions & Architecture',
        'innovation': 'Innovation & AI/ML Engineering',
        'career': 'Career Growth & Development'
      };
      
      // Count articles per category
      articles.forEach(article => {
        const cat = article.categories?.[0] || 'general';
        categoryCount[cat] = (categoryCount[cat] || 0) + 1;
      });
      
      // Get categories with at least 3 articles, sorted by count
      const dynamicCategories = Object.entries(categoryCount)
        .filter(([_, count]) => count >= 3)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([category], index) => ({
          number: String(index + 1).padStart(2, '0'),
          name: categoryNames[category] || category.charAt(0).toUpperCase() + category.slice(1)
        }));
      
      // If we have 6 categories, use them. Otherwise, use hardcoded list
      if (dynamicCategories.length === 6) {
        return dynamicCategories;
      }
      
      // Hardcoded fallback list
      return [
        { number: '01', name: 'Distributed Systems & Scalability' },
        { number: '02', name: 'Identity & Authentication Platforms' },
        { number: '03', name: 'Engineering Leadership & Team Building' },
        { number: '04', name: 'Enterprise Architecture & Design Patterns' },
        { number: '05', name: 'DevOps & Site Reliability Engineering' },
        { number: '06', name: 'AI/ML Engineering & Production Systems' }
      ];
    } catch (error) {
      // Return hardcoded list on error
      return [
        { number: '01', name: 'Distributed Systems & Scalability' },
        { number: '02', name: 'Identity & Authentication Platforms' },
        { number: '03', name: 'Engineering Leadership & Team Building' },
        { number: '04', name: 'Enterprise Architecture & Design Patterns' },
        { number: '05', name: 'DevOps & Site Reliability Engineering' },
        { number: '06', name: 'AI/ML Engineering & Production Systems' }
      ];
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log(`Professional newsletter subscription: ${email}`);
    setEmail("");
          // action="https://getform.io/f/7efda21f-ca67-48f6-8a1e-723776d4ae3b"
    window.open("https://www.linkedin.com/article/newsletter/new/", "_blank");  
    // You could integrate with your actual newsletter service here
  };

  // Handle responsive design
  useEffect(() => {
    const onresize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };
    
    window.addEventListener("resize", onresize);
    onresize();

    return () => window.removeEventListener("resize", onresize);
  }, []);

  const professionalTopics = [
    'Distributed Systems Architecture',
    'Engineering Leadership Excellence',
    'Enterprise AI Implementation',
    'Cloud Migration Strategies',
    'Team Scaling Best Practices'
  ];

  // Video carousel data
  const featuredVideos = [
    {
      id: 1,
      title: 'State Farm Engineering Center',
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=430&h=240&fit=crop',
      alt: 'State Farm Engineering Center',
      description: 'The State Farm Engineering Center is the new hub for enterprise software development. Fully operational since 2023, the center provides a centralized facility for distributed systems development, with top-quality collaboration spaces, advanced monitoring labs, and cutting-edge infrastructure for scalable engineering.'
    },
    {
      id: 2,
      title: 'Engineering Excellence Collaborative',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=430&h=240&fit=crop',
      alt: 'Engineering Excellence Collaborative',
      description: 'The Engineering Excellence Collaborative (EEC) is a cross-team initiative with a mission of elevating engineering practices and connecting senior engineers across distributed systems, authentication platforms, and DevOps with colleagues throughout State Farm\'s technology organization.'
    },
    {
      id: 3,
      title: 'Senior Engineer Research',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=430&h=240&fit=crop',
      alt: 'Senior Engineer Research',
      description: 'Senior Engineer Dominique Hosea leads groundbreaking research in enterprise identity systems, driving innovation in authentication technologies. His work focuses on scaling authentication to handle millions of daily requests, developing next-generation security protocols, and advancing distributed system architectures for Fortune 500 enterprise environments.'
    }
  ];

  // Carousel navigation handlers
  const handlePrevVideo = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + featuredVideos.length) % featuredVideos.length);
  };

  const handleNextVideo = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % featuredVideos.length);
  };

  // Get visible videos (3 at a time, wrapping around)
  const getVisibleVideos = () => {
    const videos = [];
    for (let i = 0; i < 3; i++) {
      videos.push(featuredVideos[(activeIndex + i) % featuredVideos.length]);
    }
    return videos;
  };

  // Show skeleton loading state while data is loading
  if (loading) {
    return (
      <EnterpriseContainer>
        <SkeletonBlog type="enterprise-blog" theme={{ isDark: true }} />
      </EnterpriseContainer>
    );
  }

  return (
    <EnterpriseContainer>
      <ThemeSwitcher />
      
      {/* Professional Header */}
      {/* <ProfessionalHeader
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <HeaderContent>
          <Logo>HoseaCodes</Logo>
          <NavLinks>
            <NavLink 
              href="#insights"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Insights
            </NavLink>
            <NavLink 
              href="#case-studies"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Case Studies
            </NavLink>
            <NavLink 
              href="#engineering"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Engineering
            </NavLink>
            <NavLink 
              href="#leadership"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Leadership
            </NavLink>
            <NavLink 
              href="#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact
            </NavLink>
          </NavLinks>
        </HeaderContent>
      </ProfessionalHeader> */}

      {/* Hero Section */}
      <HeroSection>
        <HeroContent>
          {mostLikedArticle ? (
            <>
              <HeroTitle
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <span className="highlight">🔥 Most Popular</span><br />
                Enterprise <span className="highlight">Technology</span><br />
                <br />
                {mostLikedArticle.title}
              </HeroTitle>
              
              <HeroSubtitle
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {mostLikedArticle.description || mostLikedArticle.excerpt}
              </HeroSubtitle>
               <CTASection
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <PrimaryButton
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.href = `/blog/${mostLikedArticle._id}`}
                >
                  <FiBookOpen size={18} />
                  Read This Article
                </PrimaryButton>
                
                <SecondaryButton
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.href = '/project'}
                >
                  <FiPlay size={18} />
                  Watch Case Studies
                </SecondaryButton>
              </CTASection>
            </>
          ) : (
            <>
              <HeroTitle
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                Enterprise <span className="highlight">Technology</span><br />
                Insights & Leadership
              </HeroTitle>
              
              <HeroSubtitle
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Deep technical insights, engineering leadership strategies, and enterprise solutions 
                from a senior software engineer building scalable systems at Fortune 500 scale.
              </HeroSubtitle>
              <CTASection
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <PrimaryButton
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiBookOpen size={18} />
                  Read Latest Insights
                </PrimaryButton>
                
                <SecondaryButton
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiPlay size={18} />
                  Watch Case Studies
                </SecondaryButton>
              </CTASection>
            </>
          )}
        </HeroContent>

        <HeroVisual
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <HeroImage 
            src={mostLikedArticle?.images?.url || mostLikedArticle?.image || "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=500&fit=crop"}
            alt={mostLikedArticle?.title || "Enterprise Technology Leadership"}
          />
        </HeroVisual>
      </HeroSection>

      <CaseStudyBanner
        // logo="https://placehold.co/200x50/FFFFFF/000000?text=DatabricksLogo"
        logo="/HC.png"
        title="Engineering excellence in action "
        highlightText="HoseaCodes"
        // image="https://placehold.co/300x200/FFFFFF/000000?text=VirginAtlanticPlane"
        image="/plane.png"
        buttonText="Follow the journey"
        onButtonClick={() => window.open('https://www.linkedin.com/in/dominique-hosea/', '_blank')}
      />

      {/* HBR-Style Featured Section */}
      <HBRSection>
        <HBRContainer>
          {/* Left Column - Main Featured Article */}
          <MainFeature
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            onClick={() => hbrArticles.main?._id && (window.location.href = `/blog/${hbrArticles.main._id}`)}
            style={{ cursor: 'pointer' }}
          >
            <MainFeatureImage>
              <img 
                src={hbrArticles.main?.images?.url || "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=500&fit=crop"}
                alt={hbrArticles.main?.title || "Enterprise Systems Architecture"}
              />
            </MainFeatureImage>
            <MainFeatureCategory>{hbrArticles.main?.categories?.[0] || "Distributed Systems"}</MainFeatureCategory>
            <MainFeatureTitle>
              {hbrArticles.main?.title || "Case Study: How We Scaled Authentication to Handle 36M Daily Requests"}
            </MainFeatureTitle>
            <MainFeatureExcerpt>
              {hbrArticles.main?.description || hbrArticles.main?.markdown?.substring(0, 150) || "A deep dive into the architectural decisions and engineering challenges of building enterprise-grade identity systems."}
            </MainFeatureExcerpt>
            <MainFeatureAuthor>{hbrArticles.main?.postedBy?.name || "Dominique Hosea"}</MainFeatureAuthor>
          </MainFeature>

          {/* Middle Column - Articles with Images */}
          <MiddleColumn>
            {hbrArticles.middle1 && (
              <MiddleArticle
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                onClick={() => hbrArticles.middle1?._id && (window.location.href = `/blog/${hbrArticles.middle1._id}`)}
              >
                <MiddleArticleImage>
                  <img 
                    src={hbrArticles.middle1?.images?.url || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&h=200&fit=crop"}
                    alt={hbrArticles.middle1?.title || "Article"}
                  />
                </MiddleArticleImage>
                <MiddleArticleContent>
                  <MiddleArticleCategory>{hbrArticles.middle1?.categories?.[0] || "Engineering"}</MiddleArticleCategory>
                  <MiddleArticleTitle>
                    {hbrArticles.middle1?.title || "Article Title"}
                  </MiddleArticleTitle>
                  <MiddleArticleExcerpt>
                    {(hbrArticles.middle1?.description || hbrArticles.middle1?.markdown?.substring(0, 100) || "Article excerpt").substring(0, 80)}...
                  </MiddleArticleExcerpt>
                  <MiddleArticleAuthor>{hbrArticles.middle1?.postedBy?.name || "Author"}</MiddleArticleAuthor>
                </MiddleArticleContent>
              </MiddleArticle>
            )}

            {hbrArticles.middle2 && (
              <MiddleArticle
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                onClick={() => hbrArticles.middle2?._id && (window.location.href = `/blog/${hbrArticles.middle2._id}`)}
              >
                <MiddleArticleImage>
                  <img 
                    src={hbrArticles.middle2?.images?.url || "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=300&h=200&fit=crop"}
                    alt={hbrArticles.middle2?.title || "Article"}
                  />
                </MiddleArticleImage>
                <MiddleArticleContent>
                  <MiddleArticleCategory>{hbrArticles.middle2?.categories?.[0] || "Innovation"}</MiddleArticleCategory>
                  <MiddleArticleTitle>
                    {hbrArticles.middle2?.title || "Article Title"}
                  </MiddleArticleTitle>
                  <MiddleArticleExcerpt>
                    {hbrArticles.middle2?.description || hbrArticles.middle2?.markdown?.substring(0, 100) || "Article excerpt"}
                  </MiddleArticleExcerpt>
                  <MiddleArticleAuthor>{hbrArticles.middle2?.postedBy?.name || "Author"}</MiddleArticleAuthor>
                </MiddleArticleContent>
              </MiddleArticle>
            )}
          </MiddleColumn>

          {/* Right Column - The Latest */}
          <RightColumn>
            <LatestHeader>The Latest</LatestHeader>
            
            {hbrArticles.latest.map((article, index) => (
              <LatestArticle
                key={article._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + (index * 0.1) }}
                onClick={() => article._id && (window.location.href = `/blog/${article._id}`)}
              >
                <LatestTitle>
                  {article.title}
                </LatestTitle>
                <LatestAuthor>{article.postedBy?.name || "Dominique Hosea"}</LatestAuthor>
              </LatestArticle>
            ))}

            {/* Newsletter Signup */}
            <NewsletterCard
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <NewsletterText>
                Sign up for <strong>HoseaCodes Executive</strong> - for insights you need 
                to steer your engineering career now. Only available to HoseaCodes Executive 
                subscribers.
              </NewsletterText>
              <NewsletterButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubscribe}
              >
                Sign Up <FiArrowRight size={14} />
              </NewsletterButton>
              <NewsletterIcon>
                📧
              </NewsletterIcon>
            </NewsletterCard>
          </RightColumn>
        </HBRContainer>
      </HBRSection>

      {/* MIT News-Style Footer */}
      <MITFooterSection>
        <MITFooterContainer>
          <MITFooterLeft>
            <MITLogo>HoseaCodes Insights</MITLogo>
            <MITTagline>ON ENTERPRISE SYSTEMS AND ENGINEERING EXCELLENCE</MITTagline>
            
            <MITDescription>
              This platform is managed by Dominique Hosea, Senior Software Engineer at State Farm, 
              part of the Enterprise Engineering Excellence Initiative.
            </MITDescription>
            
            <ExpertiseHeader>Engineering Insights by Domain:</ExpertiseHeader>
            <ExpertiseList>
              {getExpertiseCategories().map((category) => (
                <ExpertiseItem key={category.number} number={category.number}>
                  <a href="#">{category.name}</a>
                </ExpertiseItem>
              ))}
            </ExpertiseList>
            
            {/* <MITFooterLinks>
              <FooterLinkGroup>
                <FooterLink href="#">About Engineering Insights</FooterLink>
                <FooterLink href="#">Press Inquiries</FooterLink>
              </FooterLinkGroup>
              <FooterLinkGroup>
                <FooterLink href="#">Engineering Case Studies</FooterLink>
                <FooterLink href="#">Technical Guidelines</FooterLink>
              </FooterLinkGroup>
              <FooterLinkGroup>
                <FooterLink href="#">Terms of Use</FooterLink>
                <FooterLink href="#">RSS Feeds</FooterLink>
              </FooterLinkGroup>
            </MITFooterLinks> */}
          </MITFooterLeft>
          
          <MITFooterRight>
            <Subscription2Button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.open('https://www.linkedin.com/article/newsletter/new/', '_blank')}
            >
              Subscribe to Engineering Daily/Weekly
            </Subscription2Button>
            
            {/* <Subscription2Button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Subscribe to technical insights
            </Subscription2Button>
            
            <Subscription2Button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Submit engineering case study
            </Subscription2Button>
            
            <Subscription2Button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Guidelines for technical contributors
            </Subscription2Button>
            
            <Subscription2Button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Guidelines on engineering AI
            </Subscription2Button> */}
          </MITFooterRight>
        </MITFooterContainer>
      </MITFooterSection>

      {/* Content Section */}
      <ContentSection>
        <SectionHeader>
          <SectionTitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Latest <span className="accent">Insights</span>
          </SectionTitle>
          
          <SectionSubtitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            In-depth technical articles, leadership perspectives, and enterprise solutions 
            from the front lines of software engineering at scale.
          </SectionSubtitle>
        </SectionHeader>

        {/* Enterprise Filter System */}
        <FilterSection>
          <FilterTabs>
            {Object.entries(enterpriseCategories).map(([key, category]) => {
              const IconComponent = category.icon;
              return (
                <FilterTab
                  key={key}
                  active={activeFilter === key}
                  onClick={() => {
                    setActiveFilter(key);
                    setActiveSubFilter('all');
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconComponent size={16} />
                  {category.label}
                </FilterTab>
              );
            })}
          </FilterTabs>
          
          {activeFilter !== 'all' && (
            <SubFilters>
              {enterpriseCategories[activeFilter].subFilters.map(filter => (
                <SubFilterChip
                  key={filter}
                  active={activeSubFilter === filter}
                  onClick={() => setActiveSubFilter(filter)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {subFilterLabels[filter]}
                </SubFilterChip>
              ))}
            </SubFilters>
          )}
        </FilterSection>

        {/* Article Grid */}
        <ArticleGrid id="articles-section">
          <MainArticles>
            {currentArticles.map((article, index) => (
              <FeaturedArticle
                key={article.id || article._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => article._id && (window.location.href = `/blog/${article._id}`)}
                style={{ cursor: 'pointer' }}
              >
                <ArticleImage bgImage={article.image} />
                
                <ArticleContent>
                  <ArticleCategory>
                    {React.createElement(enterpriseCategories[article.category].icon, { size: 14 })}
                    {enterpriseCategories[article.category].label}
                  </ArticleCategory>
                  
                  <ArticleTitle>{article.title}</ArticleTitle>
                  <ArticleExcerpt>
                    {article.excerpt && article.excerpt.length > 150 
                      ? article.excerpt.substring(0, 150) + '...' 
                      : article.excerpt}
                  </ArticleExcerpt>
                  
                  <ArticleTags>
                    {Array.isArray(article.tags) && article.tags.slice(0, 3).map(tag => (
                      <ArticleTag key={tag}>{typeof tag === 'string' ? tag : tag}</ArticleTag>
                    ))}
                  </ArticleTags>
                  
                  <ArticleMeta>
                    <span><FiClock size={12} /> {article.readTime}</span>
                    <span>•</span>
                    <span><FiCalendar size={12} /> {article.publishDate}</span>
                  </ArticleMeta>
                  
                  <ReadMoreButton
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Read Article <FiArrowRight size={14} />
                  </ReadMoreButton>
                </ArticleContent>
              </FeaturedArticle>
            ))}
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <PaginationContainer>
                <PageButton
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  whileHover={currentPage !== 1 ? { scale: 1.05 } : {}}
                  whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
                >
                  ←
                </PageButton>

                {getPageNumbers().map(pageNum => (
                  <PageButton
                    key={pageNum}
                    active={currentPage === pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {pageNum}
                  </PageButton>
                ))}

                <PageButton
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  whileHover={currentPage !== totalPages ? { scale: 1.05 } : {}}
                  whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
                >
                  →
                </PageButton>

                <PaginationInfo>
                  Page {currentPage} of {totalPages}
                </PaginationInfo>
              </PaginationContainer>
            )}
          </MainArticles>


          <Sidebar>
            <SidebarCard
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <SidebarTitle>Professional Newsletter</SidebarTitle>
              <p style={{ 
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: '1.5rem',
                lineHeight: '1.6'
              }}>
                Get weekly insights on enterprise software engineering, leadership strategies, and technology trends.
              </p>
              
              <NewsletterForm
                // action="https://getform.io/f/7efda21f-ca67-48f6-8a1e-723776d4ae3b"
                // method="POST"
                onSubmit={handleSubscribe}>
                <NewsletterInput
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <SubscribeButton
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiMail size={16} />
                  Subscribe
                </SubscribeButton>
              </NewsletterForm>
            </SidebarCard>

            <SidebarCard
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <SidebarTitle>Featured Topics</SidebarTitle>
              <TopicList>
                {professionalTopics.map((topic, index) => (
                  <TopicItem
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {topic}
                  </TopicItem>
                ))}
              </TopicList>
            </SidebarCard>

            <SidebarCard
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <SidebarTitle>Engineering Achievements</SidebarTitle>
              <AchievementList>
                <AchievementItem>
                  <FiAward 
                    size={20} 
                    color="#667eea" 
                  />
                  <AchievementInfo>
                    <AchievementTitle>State Farm Innovation Award</AchievementTitle>
                    <AchievementDesc>Distributed Systems Excellence</AchievementDesc>
                  </AchievementInfo>
                </AchievementItem>
                
                <AchievementItem>
                  <FiTarget 
                    size={20} 
                    color="#667eea" 
                  />
                  <AchievementInfo>
                    <AchievementTitle>Senior Engineer Track</AchievementTitle>
                    <AchievementDesc>Identity & Authentication Platform</AchievementDesc>
                  </AchievementInfo>
                </AchievementItem>

                <AchievementItem>
                  <FiBarChart2 
                    size={20} 
                    color="#667eea" 
                  />
                  <AchievementInfo>
                    <AchievementTitle>Performance Optimization</AchievementTitle>
                    <AchievementDesc>36M+ Daily Requests Processed</AchievementDesc>
                  </AchievementInfo>
                </AchievementItem>
              </AchievementList>
            </SidebarCard>
          </Sidebar>
        </ArticleGrid>
      </ContentSection>

      <MinimalResumeCTA />
      {/* <ResumeCTA /> */}
      {/* <ResumeBannerCTA /> */}

      {/* Section 2: Featured Multimedia */}
      {/* <FeaturedMultimediaSection>
        <MultimediaSection>
          <VerticalSidebar>
            <SidebarContent>
              <VerticalText>Featured Multimedia</VerticalText>
            </SidebarContent>
          </VerticalSidebar>
          
          <MainContent>
            <CardsRow>
              {getVisibleVideos().map((video, index) => (
                <VideoCard
                  key={video.id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <VideoImageContainer>
                    <VideoImage 
                      src={video.image}
                      alt={video.alt}
                    />
                    <PlayButtonOverlay>
                      <PlayButton />
                    </PlayButtonOverlay>
                  </VideoImageContainer>
                  <VideoTextContent>
                    <VideoDescription>
                      {video.description}
                    </VideoDescription>
                  </VideoTextContent>
                </VideoCard>
              ))}
            </CardsRow>

            <BottomRow>
              <YouTubeLink href="https://www.youtube.com/watch?v=uc3mRVjZM_I&t=5s" target="_blank" rel="noopener noreferrer">
                View more videos on HoseaCodes' YouTube channel
              </YouTubeLink>
              
              <NavigationButtons>
                <NavButton
                  onClick={handlePrevVideo}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ChevronIcon description="left">‹</ChevronIcon>
                </NavButton>
                <NavButton 
                  onClick={handleNextVideo}
                  active={true}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ChevronIcon>›</ChevronIcon>
                </NavButton>
              </NavigationButtons>
            </BottomRow>
          </MainContent>
        </MultimediaSection>

      </FeaturedMultimediaSection> */}

      {/* Section 3: Footer Content Grid */}
      {/* <FooterContentSection>
        <FooterContentContainer> */}
          {/* Popular Column */}
          {/* <FooterColumn>
            <FooterColumnTitle>Popular</FooterColumnTitle>
            <PopularArticlesList>
              <PopularArticle>
                <PopularTitle>
                  Your New Role Requires Strategic Thinking...But You're Stuck in the Weeds
                </PopularTitle>
              </PopularArticle>
              <PopularArticle>
                <PopularTitle>
                  Research: Why Some Engineering Teams Weather Technical Debt Better Than Others
                </PopularTitle>
              </PopularArticle>
              <PopularArticle>
                <PopularTitle>
                  Now Is the Time for Engineering Courage
                </PopularTitle>
              </PopularArticle>
              <PopularArticle>
                <PopularTitle>
                  When You Have to Execute a Strategy You Disagree With
                </PopularTitle>
              </PopularArticle>
            </PopularArticlesList>
          </FooterColumn> */}

          {/* Newsletters Column */}
          {/* <FooterColumn>
            <FooterColumnTitle>Newsletters</FooterColumnTitle>
            <MoreLink href="#">More Newsletters →</MoreLink>
            
            <NewsletterList>
              <NewsletterItem>
                <NewsletterIcon color="#1f2937">📋</NewsletterIcon>
                <NewsletterContent>
                  <NewsletterTitle>HoseaCodes Executive Agenda</NewsletterTitle>
                  <NewsletterDescription>
                    Sign up for the Engineering Executive Agenda for insights you need to steer your team now.
                  </NewsletterDescription>
                  <NewsletterSignup
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Sign Up <FiArrowRight size={12} />
                  </NewsletterSignup>
                </NewsletterContent>
              </NewsletterItem>

              <NewsletterItem>
                <NewsletterIcon color="#ef4444">🔥</NewsletterIcon>
                <NewsletterContent>
                  <NewsletterTitle>Weekly Engineering Hotlist</NewsletterTitle>
                  <NewsletterDescription>
                    A roundup of Engineering Excellence's most popular ideas and advice.
                  </NewsletterDescription>
                  <NewsletterSignup
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Sign Up <FiArrowRight size={12} />
                  </NewsletterSignup>
                </NewsletterContent>
              </NewsletterItem>

              <NewsletterItem>
                <NewsletterIcon color="#f59e0b">💡</NewsletterIcon>
                <NewsletterContent>
                  <NewsletterTitle>Engineering Tip of the Day</NewsletterTitle>
                  <NewsletterDescription>
                    Quick, practical engineering advice to help you do your job better.
                  </NewsletterDescription>
                  <NewsletterSignup
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Sign Up <FiArrowRight size={12} />
                  </NewsletterSignup>
                </NewsletterContent>
              </NewsletterItem>
            </NewsletterList>
          </FooterColumn> */}

          {/* Exclusive Content Column */}
          {/* <FooterColumn>
            <FooterColumnTitle>HoseaCodes Subscriber Exclusives</FooterColumnTitle>
            <FooterSubheader>Access for subscribers only.</FooterSubheader>
            
            <ExclusiveList>
              <ExclusiveItem>
                <ExclusiveThumbnail bgColor="#0ea5e9">🎯</ExclusiveThumbnail>
                <ExclusiveContent>
                  <ExclusiveCategory>Case Selections</ExclusiveCategory>
                  <ExclusiveTitle>
                    Distributed Systems and Enterprise Architecture
                  </ExclusiveTitle>
                </ExclusiveContent>
              </ExclusiveItem>

              <ExclusiveItem>
                <ExclusiveThumbnail bgColor="#10b981">📊</ExclusiveThumbnail>
                <ExclusiveContent>
                  <ExclusiveCategory>Data & Visuals</ExclusiveCategory>
                  <ExclusiveTitle>
                    Are You a Senior Engineering Leader?
                  </ExclusiveTitle>
                </ExclusiveContent>
              </ExclusiveItem>

              <ExclusiveItem>
                <ExclusiveThumbnail bgColor="#8b5cf6">📝</ExclusiveThumbnail>
                <ExclusiveContent>
                  <ExclusiveCategory>Engineering Essential Articles</ExclusiveCategory>
                  <ExclusiveTitle>
                    Building Your Engineering Team's Vision
                  </ExclusiveTitle>
                </ExclusiveContent>
              </ExclusiveItem>
            </ExclusiveList>
          </FooterColumn> */}

          {/* Podcasts Column */}
          {/* <FooterColumn>
            <FooterColumnTitle>Podcasts</FooterColumnTitle>
            <MoreLink href="#">More Podcasts →</MoreLink>
            
            <PodcastList>
              <PodcastItem>
                <PodcastIcon color="#667eea">🎧</PodcastIcon>
                <PodcastContent>
                  <PodcastCategory>Engineering Communication</PodcastCategory>
                  <PodcastTitle>
                    What Senior Engineers Say About Your Company Culture
                  </PodcastTitle>
                </PodcastContent>
              </PodcastItem>

              <PodcastItem>
                <PodcastIcon color="#f59e0b">⭐</PodcastIcon>
                <PodcastContent>
                  <PodcastCategory>Leadership</PodcastCategory>
                  <PodcastTitle>
                    Why Great Leaders Focus on the Engineering Details
                  </PodcastTitle>
                </PodcastContent>
              </PodcastItem>

              <PodcastItem>
                <PodcastIcon color="#ef4444">🚀</PodcastIcon>
                <PodcastContent>
                  <PodcastCategory>Sustainable Engineering Practices</PodcastCategory>
                  <PodcastTitle>
                    Future of Engineering: How Teams Can Scale Technical Excellence
                  </PodcastTitle>
                </PodcastContent>
              </PodcastItem>
            </PodcastList>
          </FooterColumn> */}
        {/* </FooterContentContainer>
      </FooterContentSection> */}
      <StateFarm />

    </EnterpriseContainer>
  );
}

export default EnterpriseTechGuide;
