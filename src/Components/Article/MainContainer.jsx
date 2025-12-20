import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import { AiFillStar, AiFillPlayCircle, AiFillPauseCircle, AiFillStop, AiOutlineMail } from 'react-icons/ai';
import { FaRegThumbsUp, FaRegComment } from 'react-icons/fa';
import { BsTwitter, BsFacebook, BsLinkedin, BsLink45Deg } from 'react-icons/bs';
import { RiShareCircleFill } from 'react-icons/ri';
import { TiSocialLinkedinCircular } from 'react-icons/ti';
import { MdBookmarkBorder } from 'react-icons/md';
import marked from 'marked';

// =============================================
// MEDIUM DESIGN TOKENS
// =============================================
const mediumTheme = {
  colors: {
    text: {
      primary: '#242424',
      secondary: '#6b6b6b',
      light: '#8b8b8b'
    },
    background: {
      white: '#ffffff',
      light: '#fafafa',
      border: '#e6e6e6',
      hover: '#f2f2f2'
    },
    accent: {
      green: '#1a8917',
      lightGreen: '#f0fff0',
      red: '#e74c3c'
    }
  },
  typography: {
    fontFamily: {
      serif: 'charter, Georgia, Cambria, "Times New Roman", Times, serif',
      sansSerif: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif'
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '21px',
      '2xl': '28px',
      '3xl': '34px',
      '4xl': '42px'
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.4,
      relaxed: 1.6,
      loose: 1.8
    }
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px'
  },
  breakpoints: {
    mobile: '768px',
    tablet: '1024px'
  }
};

// =============================================
// STYLED COMPONENTS
// =============================================
const StyledMainContainer = styled.div`
  max-width: 680px;
  margin: 0 auto;
  background: ${mediumTheme.colors.background.white};

  @media (max-width: ${mediumTheme.breakpoints.tablet}) {
    padding: ${mediumTheme.spacing['2xl']} 0;
  }

  @media (max-width: ${mediumTheme.breakpoints.mobile}) {
    padding: ${mediumTheme.spacing.lg} 0;
  }
`;

const PaddingContent = styled.div`
  padding: 0;
`;

const MemberAlert = styled(Alert)`
  background-color: ${mediumTheme.colors.background.light} !important;
  border: 1px solid ${mediumTheme.colors.background.border} !important;
  border-radius: 8px !important;
  margin-bottom: ${mediumTheme.spacing.xl};
  padding: ${mediumTheme.spacing.md} ${mediumTheme.spacing.lg} !important;
  
  p {
    margin: 0 !important;
    font-size: ${mediumTheme.typography.fontSize.sm};
    color: ${mediumTheme.colors.text.secondary};
    font-family: ${mediumTheme.typography.fontFamily.sansSerif};
  }
  
  a {
    color: ${mediumTheme.colors.accent.green};
    text-decoration: none;
    font-weight: ${mediumTheme.typography.fontWeight.medium};
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const AuthorSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${mediumTheme.spacing.md};
  margin-bottom: ${mediumTheme.spacing.xl};
`;

const CircleImage = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
`;

const AuthorInfo = styled.div`
  flex: 1;
`;

const NamePlate = styled.div`
  font-weight: ${mediumTheme.typography.fontWeight.medium};
  font-size: ${mediumTheme.typography.fontSize.base};
  color: ${mediumTheme.colors.text.primary};
  margin-bottom: 2px;
  font-family: ${mediumTheme.typography.fontFamily.sansSerif};
`;

const WrappedDate = styled.div`
  display: flex;
  align-items: center;
  gap: ${mediumTheme.spacing.xs};
  font-size: ${mediumTheme.typography.fontSize.sm};
  color: ${mediumTheme.colors.text.secondary};
  flex-wrap: wrap;
  font-family: ${mediumTheme.typography.fontFamily.sansSerif};
  
  span {
    color: ${mediumTheme.colors.text.light};
  }
`;

const AudioControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${mediumTheme.spacing.sm};
  margin-top: ${mediumTheme.spacing.sm};
`;

const AudioButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${mediumTheme.spacing.xs};
  font-size: ${mediumTheme.typography.fontSize.sm};
  color: ${props => props.green ? mediumTheme.colors.accent.green : 
                    props.red ? mediumTheme.colors.accent.red : 
                    mediumTheme.colors.text.secondary};
  padding: ${mediumTheme.spacing.xs} ${mediumTheme.spacing.sm};
  border-radius: 4px;
  transition: background-color 0.2s ease;
  font-family: ${mediumTheme.typography.fontFamily.sansSerif};

  &:hover {
    background-color: ${props => props.green ? mediumTheme.colors.accent.lightGreen : mediumTheme.colors.background.hover};
  }

  svg {
    font-size: 14px;
  }
`;

const ArticleDivider = styled.hr`
  border: none;
  height: 1px;
  background-color: ${mediumTheme.colors.background.border};
  margin: ${mediumTheme.spacing.xl} 0;
`;

const BlogTitle = styled.h1`
  font-family: ${mediumTheme.typography.fontFamily.serif};
  font-size: ${mediumTheme.typography.fontSize['4xl']};
  font-weight: ${mediumTheme.typography.fontWeight.bold};
  line-height: ${mediumTheme.typography.lineHeight.tight};
  color: ${mediumTheme.colors.text.primary};
  margin: ${mediumTheme.spacing.xl} 0 ${mediumTheme.spacing.lg};
  letter-spacing: -0.02em;

  @media (max-width: ${mediumTheme.breakpoints.mobile}) {
    font-size: ${mediumTheme.typography.fontSize['3xl']};
  }
`;

const BlogSubTitle = styled.h2`
  font-family: ${mediumTheme.typography.fontFamily.serif};
  font-size: ${mediumTheme.typography.fontSize.xl};
  font-weight: ${mediumTheme.typography.fontWeight.normal};
  line-height: ${mediumTheme.typography.lineHeight.relaxed};
  color: ${mediumTheme.colors.text.secondary};
  margin-bottom: ${mediumTheme.spacing.xl};
`;

const BlogDisplayImage = styled.img`
  width: 100%;
  height: auto;
  margin: ${mediumTheme.spacing.xl} 0 ${mediumTheme.spacing.sm};
  border-radius: 4px;
`;

const BlogPhotoCredit = styled.figcaption`
  font-size: ${mediumTheme.typography.fontSize.sm};
  color: ${mediumTheme.colors.text.secondary};
  text-align: center;
  font-style: italic;
  margin-bottom: ${mediumTheme.spacing.xl};
  font-family: ${mediumTheme.typography.fontFamily.sansSerif};
`;

const BlogCard = styled.div`
  margin: ${mediumTheme.spacing.xl} 0;
`;

const BlogPost = styled.article`
  margin: 0;
`;

const BlogContent = styled.div`
  align-items: start;
  font-family: ${mediumTheme.typography.fontFamily.serif};
  font-size: ${mediumTheme.typography.fontSize.xl};
  line-height: ${mediumTheme.typography.lineHeight.loose};
  color: ${mediumTheme.colors.text.primary};
  margin-bottom: ${mediumTheme.spacing.xl};
  padding: ${mediumTheme.spacing['2xl']} ${mediumTheme.spacing.lg};

  p {
    margin-bottom: ${mediumTheme.spacing.xl};
    
    ${props => props.isFirst && `
      &:first-of-type::first-letter {
        font-size: 4em;
        line-height: 0.8;
        float: left;
        margin: 0.1em 0.1em 0 0;
        font-weight: 400;
        color: ${mediumTheme.colors.text.primary};
      }
    `}
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${mediumTheme.typography.fontFamily.serif};
    font-weight: ${mediumTheme.typography.fontWeight.semibold};
    margin: ${mediumTheme.spacing['2xl']} 0 ${mediumTheme.spacing.lg};
    line-height: ${mediumTheme.typography.lineHeight.tight};
    color: ${mediumTheme.colors.text.primary};
  }

  h2 {
    font-size: ${mediumTheme.typography.fontSize['2xl']};
  }

  h3 {
    font-size: ${mediumTheme.typography.fontSize.xl};
  }

  blockquote {
    border-left: 3px solid ${mediumTheme.colors.text.primary};
    padding-left: ${mediumTheme.spacing.lg};
    margin: ${mediumTheme.spacing.xl} 0;
    font-style: italic;
    color: ${mediumTheme.colors.text.secondary};
  }

  code {
    background-color: ${mediumTheme.colors.background.light};
    padding: 2px 4px;
    border-radius: 3px;
    font-family: 'Monaco', 'Consolas', monospace;
    font-size: 0.9em;
    color: ${mediumTheme.colors.text.primary};
  }

  pre {
    background-color: ${mediumTheme.colors.background.light};
    padding: ${mediumTheme.spacing.lg};
    border-radius: 4px;
    overflow-x: auto;
    margin: ${mediumTheme.spacing.xl} 0;
    border: 1px solid ${mediumTheme.colors.background.border};

    code {
      background: none;
      padding: 0;
    }
  }

  a {
    color: ${mediumTheme.colors.accent.green};
    text-decoration: underline;

    &:hover {
      text-decoration: none;
    }
  }

  ul, ol {
    margin: ${mediumTheme.spacing.xl} 0;
    padding-left: ${mediumTheme.spacing.xl};
  }

  li {
    margin-bottom: ${mediumTheme.spacing.sm};
  }

  img {
    max-width: 100%;
    height: auto;
    margin: ${mediumTheme.spacing.xl} 0;
    border-radius: 4px;
  }
`;

// Newsletter Section
const BlogNewsletter = styled.form`
  background-color: ${mediumTheme.colors.background.light};
  border-radius: 8px;
  padding: ${mediumTheme.spacing.xl};
  margin: ${mediumTheme.spacing['3xl']} 0;
  text-align: center;
  border: 1px solid ${mediumTheme.colors.background.border};

  h3 {
    font-size: ${mediumTheme.typography.fontSize.xl};
    font-weight: ${mediumTheme.typography.fontWeight.semibold};
    color: ${mediumTheme.colors.text.primary};
    margin-bottom: ${mediumTheme.spacing.sm};
    font-family: ${mediumTheme.typography.fontFamily.sansSerif};
  }

  @media (max-width: ${mediumTheme.breakpoints.mobile}) {
    display: none;
  }
`;

const NewsletterContent = styled.div`
  margin-bottom: ${mediumTheme.spacing.lg};
  
  p {
    font-size: ${mediumTheme.typography.fontSize.base};
    color: ${mediumTheme.colors.text.secondary};
    margin-bottom: ${mediumTheme.spacing.sm};
    font-family: ${mediumTheme.typography.fontFamily.sansSerif};
    
    &.author {
      font-size: ${mediumTheme.typography.fontSize.sm};
      color: ${mediumTheme.colors.text.light};
      font-style: italic;
    }
  }

  u {
    text-decoration: underline;
    color: ${mediumTheme.colors.accent.green};
  }
`;

const NewsletterForm = styled.div`
  display: flex;
  gap: ${mediumTheme.spacing.sm};
  max-width: 400px;
  margin: 0 auto ${mediumTheme.spacing.lg};

  @media (max-width: ${mediumTheme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const NewsletterInput = styled.input`
  flex: 1;
  padding: ${mediumTheme.spacing.sm} ${mediumTheme.spacing.md};
  border: 1px solid ${mediumTheme.colors.background.border};
  border-radius: 4px;
  font-size: ${mediumTheme.typography.fontSize.base};
  font-family: ${mediumTheme.typography.fontFamily.sansSerif};

  &:focus {
    outline: none;
    border-color: ${mediumTheme.colors.accent.green};
    box-shadow: 0 0 0 3px ${mediumTheme.colors.accent.lightGreen};
  }

  &::placeholder {
    color: ${mediumTheme.colors.text.light};
  }
`;

const NewsletterButton = styled.button`
  background-color: ${mediumTheme.colors.accent.green};
  color: white;
  border: none;
  padding: ${mediumTheme.spacing.sm} ${mediumTheme.spacing.lg};
  border-radius: 4px;
  font-size: ${mediumTheme.typography.fontSize.base};
  font-weight: ${mediumTheme.typography.fontWeight.medium};
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  gap: ${mediumTheme.spacing.xs};
  font-family: ${mediumTheme.typography.fontFamily.sansSerif};

  &:hover {
    background-color: #0f6b14;
  }

  svg {
    font-size: 18px;
  }
`;

const NewsletterDisclaimer = styled.p`
  font-size: ${mediumTheme.typography.fontSize.xs};
  color: ${mediumTheme.colors.text.light};
  text-align: center;
  line-height: ${mediumTheme.typography.lineHeight.normal};
  margin: 0;
  font-family: ${mediumTheme.typography.fontFamily.sansSerif};
`;

// Related Posts Section
const RelatedPostsSection = styled.div`
  background-color: ${mediumTheme.colors.background.light};
  padding: ${mediumTheme.spacing.xl} 0;
  margin-top: ${mediumTheme.spacing['3xl']};
  border-radius: 8px;
`;

const RelatedPostCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: ${mediumTheme.spacing.lg};
  margin-bottom: ${mediumTheme.spacing.lg};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const RelatedPostHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${mediumTheme.spacing.md};
  margin-bottom: ${mediumTheme.spacing.lg};
`;

const RelatedPostContent = styled.div`
  display: flex;
  gap: ${mediumTheme.spacing.lg};
  margin-bottom: ${mediumTheme.spacing.md};

  @media (max-width: ${mediumTheme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const RelatedPostText = styled.div`
  flex: 1;
  
  h4 {
    font-size: ${mediumTheme.typography.fontSize.lg};
    font-weight: ${mediumTheme.typography.fontWeight.semibold};
    line-height: ${mediumTheme.typography.lineHeight.normal};
    margin-bottom: ${mediumTheme.spacing.sm};
    color: ${mediumTheme.colors.text.primary};
    font-family: ${mediumTheme.typography.fontFamily.sansSerif};
  }

  a {
    color: ${mediumTheme.colors.text.primary};
    text-decoration: none;
    
    &:hover {
      color: ${mediumTheme.colors.accent.green};
    }
  }

  p {
    color: ${mediumTheme.colors.text.secondary};
    font-size: ${mediumTheme.typography.fontSize.base};
    line-height: ${mediumTheme.typography.lineHeight.relaxed};
    margin: 0;
    font-family: ${mediumTheme.typography.fontFamily.sansSerif};
  }
`;

const RelatedPostImage = styled.img`
  width: 200px;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
  flex-shrink: 0;

  @media (max-width: ${mediumTheme.breakpoints.mobile}) {
    width: 100%;
    height: 200px;
  }
`;

const RelatedPostMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: ${mediumTheme.spacing.sm};
  border-top: 1px solid ${mediumTheme.colors.background.border};
`;

const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  font-size: ${mediumTheme.typography.fontSize.sm};
  padding: ${mediumTheme.spacing.xs} ${mediumTheme.spacing.sm};
  border-radius: 12px;
  background-color: ${mediumTheme.colors.background.border};
  color: ${mediumTheme.colors.text.secondary};
  margin-right: ${mediumTheme.spacing.sm};
  font-family: ${mediumTheme.typography.fontFamily.sansSerif};
`;

const ReadMoreButton = styled.button`
  background: none;
  border: 1px solid ${mediumTheme.colors.background.border};
  color: ${mediumTheme.colors.text.secondary};
  padding: ${mediumTheme.spacing.sm} ${mediumTheme.spacing.lg};
  border-radius: 20px;
  font-size: ${mediumTheme.typography.fontSize.sm};
  cursor: pointer;
  transition: all 0.2s ease;
  margin: ${mediumTheme.spacing.xl} auto 0;
  display: block;
  font-family: ${mediumTheme.typography.fontFamily.sansSerif};

  &:hover:not(:disabled) {
    background-color: ${mediumTheme.colors.accent.green};
    border-color: ${mediumTheme.colors.accent.green};
    color: white;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Sticky Footer
const StickyFooter = styled.div`
  position: sticky;
  bottom: 0;
  background: ${mediumTheme.colors.background.white};
  border-top: 1px solid ${mediumTheme.colors.background.border};
  padding: ${mediumTheme.spacing.md} 0;
  margin-top: ${mediumTheme.spacing.xl};
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
`;

const StickyContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const EngagementActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${mediumTheme.spacing.lg};
`;

const EngagementButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${mediumTheme.spacing.xs};
  color: ${mediumTheme.colors.text.secondary};
  font-size: ${mediumTheme.typography.fontSize.sm};
  padding: ${mediumTheme.spacing.xs} ${mediumTheme.spacing.sm};
  border-radius: 4px;
  transition: all 0.2s ease;
  font-family: ${mediumTheme.typography.fontFamily.sansSerif};

  &:hover {
    color: ${mediumTheme.colors.text.primary};
    background-color: ${mediumTheme.colors.background.hover};
  }

  svg {
    font-size: 16px;
  }
`;

const SocialShare = styled.div`
  display: flex;
  align-items: center;
  gap: ${mediumTheme.spacing.sm};
`;

const ShareButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: ${mediumTheme.spacing.xs};
  border-radius: 4px;
  color: ${mediumTheme.colors.accent.green};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${mediumTheme.colors.accent.lightGreen};
  }

  svg {
    font-size: 18px;
  }
`;

// Admin Controls
const AdminControls = styled.div`
  margin-top: ${mediumTheme.spacing.xl};
  padding: ${mediumTheme.spacing.lg};
  border: 1px solid ${mediumTheme.colors.background.border};
  border-radius: 8px;
  background-color: ${mediumTheme.colors.background.light};
  display: flex;
  gap: ${mediumTheme.spacing.md};
  align-items: center;

  input[type="checkbox"] {
    transform: scale(1.2);
  }

  label {
    font-size: ${mediumTheme.typography.fontSize.sm};
    color: ${mediumTheme.colors.text.secondary};
    margin-left: ${mediumTheme.spacing.sm};
  }

  button {
    background-color: ${mediumTheme.colors.accent.red};
    color: white;
    border: none;
    padding: ${mediumTheme.spacing.xs} ${mediumTheme.spacing.md};
    border-radius: 4px;
    font-size: ${mediumTheme.typography.fontSize.sm};
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #c0392b;
    }
  }
`;

// =============================================
// MAIN COMPONENT
// =============================================
const MainContainer = ({ 
  detailArticle, 
  user, 
  articles, 
  timeFormater, 
  readTime, 
  viewComment, 
  setViewComment,
  isAdmin,
  isLoggedIn,
  deleteArticle,
  handleCheck
}) => {
  const { _id, likes, title, subtitle, description, images, markdown, comments } = detailArticle;
  
  // Audio states
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioPaused, setAudioPaused] = useState(false);
  const [utterance, setUtterance] = useState(null);
  const [postLikes, setPostLikes] = useState(likes || 0);
  
  // Related posts states
  const [idx, setIdx] = useState(4);
  const [moreArticles, setMoreArticles] = useState(true);
  const [recentPosts, setRecentPosts] = useState([]);

  const avatar = user.avatar || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0k6I8WItSjK0JTttL3FwACOA6yugI29xvLw&usqp=CAU";

  // Audio functions
  useEffect(() => {
    if (markdown) {
      const synth = window.speechSynthesis;
      const u = new SpeechSynthesisUtterance(markdown);
      const voices = synth.getVoices();
      if (voices[15]) u.voice = voices[15];
      u.rate = 0.95;
      setUtterance(u);
    }
  }, [markdown]);

  const handlePlay = () => {
    const synth = window.speechSynthesis;
    if (utterance) {
      if (audioPaused) {
        synth.resume();
      } else {
        synth.speak(utterance);
      }
      setAudioPlaying(true);
      setAudioPaused(false);
    }
  };

  const handlePause = () => {
    const synth = window.speechSynthesis;
    synth.pause();
    setAudioPaused(true);
  };

  const handleStop = () => {
    const synth = window.speechSynthesis;
    synth.cancel();
    setAudioPlaying(false);
    setAudioPaused(false);
  };

  // Related posts
  useEffect(() => {
    const shuffleArray = (arr) => arr.sort(() => 0.5 - Math.random());
    const filtered = shuffleArray([...articles])
      .filter((article) => article._id !== _id)
      .slice(0, idx);
    setRecentPosts(filtered);
  }, [articles, idx, _id]);

  const handleReadMore = () => {
    const newIdx = idx + 2;
    setIdx(newIdx);
    if (articles.length <= newIdx) {
      setMoreArticles(false);
    }
  };

  // Share functions
  const handleShare = async (platform) => {
    const url = window.location.href;
    const articleTitle = title;
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${articleTitle}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
        break;
      case 'copy':
        await navigator.clipboard.writeText(url);
        break;
    }
  };

  return (
    <StyledMainContainer>
      <PaddingContent>
        <section>
          {user.name && (
            <MemberAlert variant="light">
              <p>
                You have <strong>1</strong> free member-only story left this month.{' '}
                <a href="/register">Sign up for Medium and get an extra one.</a>
              </p>
            </MemberAlert>
          )}

          <AuthorSection>
            <CircleImage src={avatar} alt="author" />
            <AuthorInfo>
              <NamePlate>Author: {user.name || "Will Smith"}</NamePlate>
              <WrappedDate>
                <span>{timeFormater}</span>
                <span>·</span>
                <span>
                  {readTime > 60
                    ? `${Math.floor(readTime / 60)} Hours${
                        readTime % 60 ? ` ${readTime % 60} min` : ''
                      } read`
                    : `${readTime} min read`}
                  <AiFillStar style={{ marginLeft: '4px' }} />
                </span>
              </WrappedDate>
              <AudioControls>
                {!audioPlaying ? (
                  <AudioButton green onClick={handlePlay}>
                    <AiFillPlayCircle />
                    Listen
                  </AudioButton>
                ) : audioPaused ? (
                  <AudioButton green onClick={handlePlay}>
                    <AiFillPlayCircle />
                    Resume
                  </AudioButton>
                ) : (
                  <AudioButton green onClick={handlePause}>
                    <AiFillPauseCircle />
                    Pause
                  </AudioButton>
                )}
                {audioPlaying && (
                  <AudioButton red onClick={handleStop}>
                    <AiFillStop />
                    Stop
                  </AudioButton>
                )}
              </AudioControls>
            </AuthorInfo>
          </AuthorSection>

          <ArticleDivider />

          <BlogTitle>{title}</BlogTitle>
          {subtitle && <BlogSubTitle>{subtitle}</BlogSubTitle>}
          
          {images?.url && (
            <>
              <BlogDisplayImage src={images.url} alt={title} />
              <BlogPhotoCredit>
                Photo Credit by <u>{user.name || "Anonymous"}</u>
              </BlogPhotoCredit>
            </>
          )}

          <BlogCard>
            <BlogPost>
              <BlogContent isFirst>
                {description}
              </BlogContent>
              
              <BlogContent 
                dangerouslySetInnerHTML={{ __html: marked(markdown || '') }}
              />

              <StickyFooter>
                <StickyContent>
                  <EngagementActions>
                    <EngagementButton onClick={() => setPostLikes(prev => prev + 1)}>
                      <FaRegThumbsUp />
                      {postLikes}
                    </EngagementButton>
                    <EngagementButton onClick={() => setViewComment(true)}>
                      <FaRegComment />
                      {comments?.length || 0}
                    </EngagementButton>
                  </EngagementActions>
                  
                  <SocialShare>
                    <ShareButton onClick={() => handleShare('facebook')}>
                      <BsFacebook />
                    </ShareButton>
                    <ShareButton onClick={() => handleShare('twitter')}>
                      <BsTwitter />
                    </ShareButton>
                    <ShareButton onClick={() => handleShare('linkedin')}>
                      <TiSocialLinkedinCircular />
                    </ShareButton>
                    <ShareButton onClick={() => handleShare('copy')}>
                      <RiShareCircleFill />
                    </ShareButton>
                  </SocialShare>
                </StickyContent>
              </StickyFooter>

              <BlogNewsletter
                action="https://getform.io/f/7efda21f-ca67-48f6-8a1e-723776d4ae3b"
                method="POST"
              >
                <div>
                  <h3>Sign up for Software Engineering News</h3>
                  <NewsletterContent>
                    <p className="author">By Dominique Hosea</p>
                    <p>
                      Latest news from Software Engineering on our Hackathons and some of our
                      best articles! <u>Take a look.</u>
                    </p>
                  </NewsletterContent>
                  <NewsletterForm>
                    <NewsletterInput
                      name="email_address"
                      placeholder="Your email"
                      type="email"
                    />
                    <input
                      style={{ display: "none" }}
                      name="from"
                      value="Newsletter"
                      type="text"
                    />
                    <NewsletterButton type="submit">
                      <AiOutlineMail />
                      Get this newsletter
                    </NewsletterButton>
                  </NewsletterForm>
                  <NewsletterDisclaimer>
                    By signing up, you will create a Medium account if you don't already
                    have one. Review our Privacy Policy for more information about our
                    privacy practices.
                  </NewsletterDisclaimer>
                </div>
              </BlogNewsletter>
            </BlogPost>

            {isAdmin && isLoggedIn && (
              <AdminControls>
                <input
                  type="checkbox"
                  checked={true}
                  onChange={() => handleCheck(_id)}
                />
                <label>Mark as checked</label>
                <button onClick={() => deleteArticle(_id, images?.public_id)}>
                  Delete Article
                </button>
              </AdminControls>
            )}
          </BlogCard>
        </section>

        {/* Related Posts */}
        <RelatedPostsSection>
          {recentPosts.map((article) => (
            <RelatedPostCard key={article._id}>
              <RelatedPostHeader>
                <CircleImage
                  src={avatar}
                  alt="author"
                />
                <div>
                  <NamePlate>{user.name || "Will Smith"}</NamePlate>
                  <span style={{color: mediumTheme.colors.text.secondary, fontSize: mediumTheme.typography.fontSize.sm}}>
                    {timeFormater}
                  </span>
                </div>
              </RelatedPostHeader>
              
              <RelatedPostContent>
                <RelatedPostText>
                  <Link to={`/blog/${article._id}`}>
                    <h4>{article.title}</h4>
                  </Link>
                  <p>{article.description}</p>
                </RelatedPostText>
                <RelatedPostImage
                  src={article.images?.url || "https://tateeda.com/wp-content/uploads/2020/05/2.png"}
                  alt="post"
                />
              </RelatedPostContent>
              
              <RelatedPostMeta>
                <div>
                  <Tag>Software</Tag>
                  <span style={{color: mediumTheme.colors.text.secondary, fontSize: mediumTheme.typography.fontSize.sm}}>
                    {readTime} min read
                  </span>
                </div>
                <MdBookmarkBorder style={{ fontSize: "24px", color: mediumTheme.colors.text.secondary }} />
              </RelatedPostMeta>
            </RelatedPostCard>
          ))}
          
          <ReadMoreButton
            onClick={handleReadMore}
            disabled={!moreArticles}
          >
            {moreArticles ? 'Read more' : 'No more articles'}
          </ReadMoreButton>
        </RelatedPostsSection>
      </PaddingContent>
    </StyledMainContainer>
  );
};

export default MainContainer;