import React from 'react';
import Skeleton from 'react-loading-skeleton';
import './skeleton.css';

// Add a custom wrapper component that respects the current theme
const ThemedSkeleton = (props) => {
  const { className, ...rest } = props;
  const combinedClassName = className ? `themed-skeleton ${className}` : 'themed-skeleton';
  
  return <Skeleton className={combinedClassName} {...rest} />;
};

const SkeletonBlog = ({ type }) => {
  const TrendyArticleSkeleton = () => {
    return (
      <div className="skeleton-trendy-article">
        <div className="skeleton-trendy-overlay"></div>
        <div className="skeleton-trendy-content">
          <div className="skeleton-trendy-meta">
            <ThemedSkeleton width={100} height={20} />
            <ThemedSkeleton width={120} height={20} />
          </div>
          <ThemedSkeleton height={60} className="skeleton-trendy-title" />
          <ThemedSkeleton count={3} height={30} className="skeleton-trendy-desc" />
          <div className="skeleton-trendy-footer">
            <ThemedSkeleton width={100} height={20} />
            <ThemedSkeleton width={120} height={20} />
          </div>
        </div>
      </div>
    );
  };

  const TrendingSkeleton = () => {
    return (
      <div className="skeleton-trending-card">
        <ThemedSkeleton height={250} className="skeleton-trending-image" />
        <div className="skeleton-trending-meta">
          <ThemedSkeleton width={80} height={16} />
          <ThemedSkeleton width={100} height={16} />
        </div>
        <ThemedSkeleton height={40} className="skeleton-trending-title" />
        <ThemedSkeleton count={2} height={24} className="skeleton-trending-desc" />
        <div className="skeleton-trending-footer">
          <ThemedSkeleton width={80} height={16} />
          <ThemedSkeleton width={100} height={16} />
        </div>
      </div>
    );
  };

  const CaseStudySkeleton = () => {
    return (
      <div className="skeleton-case-study">
        <ThemedSkeleton height={200} width={350} className="skeleton-case-image" />
        <div className="skeleton-case-content">
          <ThemedSkeleton height={35} className="skeleton-case-title" />
          <ThemedSkeleton count={2} height={20} className="skeleton-case-desc" />
        </div>
      </div>
    );
  };

  const BlogCardSkeleton = () => {
    return (
      <div className="skeleton-blog-card">
        <ThemedSkeleton height={400} className="skeleton-blog-image" />
        <div className="skeleton-blog-overlay">
          <ThemedSkeleton height={50} className="skeleton-blog-title" />
          <ThemedSkeleton count={2} height={30} className="skeleton-blog-desc" />
          <ThemedSkeleton width={150} height={25} className="skeleton-blog-meta" />
        </div>
      </div>
    );
  };

  const BlogListItemSkeleton = () => {
    return (
      <div className="skeleton-blog-list-item">
        <ThemedSkeleton height={150} width={150} className="skeleton-blog-image-small" />
        <div className="skeleton-blog-info">
          <ThemedSkeleton height={30} className="skeleton-blog-info-title" />
          <ThemedSkeleton height={20} width={150} className="skeleton-blog-info-category" />
          <ThemedSkeleton height={20} width={120} className="skeleton-blog-info-date" />
        </div>
      </div>
    );
  };

  const PopularPostSkeleton = () => {
    return (
      <div className="skeleton-popular-post">
        <ThemedSkeleton height={150} width={150} className="skeleton-popular-image" />
        <div className="skeleton-popular-info">
          <ThemedSkeleton height={30} className="skeleton-popular-title" />
          <ThemedSkeleton height={20} width={150} className="skeleton-popular-category" />
        </div>
      </div>
    );
  };

  const FAQItemSkeleton = () => {
    return (
      <div className="skeleton-faq-item">
        <div className="skeleton-faq-question">
          <ThemedSkeleton height={40} width={40} className="skeleton-faq-number" />
          <ThemedSkeleton height={40} className="skeleton-faq-question-text" />
          <ThemedSkeleton height={30} width={30} circle={true} className="skeleton-faq-toggle" />
        </div>
      </div>
    );
  };

  // Render different skeletons based on type
  switch (type) {
    case 'trendy':
      return <TrendyArticleSkeleton />;
    case 'trending':
      return <TrendingSkeleton />;
    case 'case-study':
      return <CaseStudySkeleton />;
    case 'blog-card':
      return <BlogCardSkeleton />;
    case 'blog-list-item':
      return <BlogListItemSkeleton />;
    case 'popular-post':
      return <PopularPostSkeleton />;
    case 'faq':
      return <FAQItemSkeleton />;
    default:
      // Default renders a full page skeleton with multiple sections
      return (
        <div className="skeleton-container">
          {/* Hero Section Skeleton */}
          <div className="skeleton-hero">
            <div className="skeleton-hero-content">
              <div className="skeleton-hero-text">
                <ThemedSkeleton height={80} count={3} className="skeleton-hero-title" />
                <ThemedSkeleton height={30} count={2} className="skeleton-hero-paragraph" />
                <ThemedSkeleton height={50} className="skeleton-hero-subscribe" />
              </div>
              <ThemedSkeleton height={400} width={300} className="skeleton-hero-image" />
            </div>
          </div>
          
          {/* Trendy Section Skeleton */}
          <div className="skeleton-section">
            <ThemedSkeleton height={40} width={200} className="skeleton-section-title" />
            <ThemedSkeleton height={2} className="skeleton-divider" />
            <div className="skeleton-trendy-grid">
              <ThemedSkeleton height={200} className="skeleton-trendy-side-image" />
              <TrendyArticleSkeleton />
              <TrendyArticleSkeleton />
              <ThemedSkeleton height={200} className="skeleton-trendy-side-image" />
            </div>
          </div>
          
          {/* Trending Section Skeleton */}
          <div className="skeleton-section">
            <ThemedSkeleton height={40} width={200} className="skeleton-section-title" />
            <ThemedSkeleton height={2} className="skeleton-divider" />
            <div className="skeleton-trending-grid">
              <TrendingSkeleton />
              <TrendingSkeleton />
              <TrendingSkeleton />
            </div>
          </div>
          
          {/* Case Studies Skeleton */}
          <div className="skeleton-section">
            <ThemedSkeleton height={30} width={150} className="skeleton-subsection-title" />
            <ThemedSkeleton height={2} className="skeleton-divider" />
            <div className="skeleton-case-studies-grid">
              <CaseStudySkeleton />
              <CaseStudySkeleton />
            </div>
          </div>
          
          {/* Blog Section Skeleton */}
          <div className="skeleton-section skeleton-blog-section">
            <ThemedSkeleton height={40} width={100} className="skeleton-section-title" />
            <div className="skeleton-blog-tags">
              {Array(5).fill().map((_, index) => (
                <ThemedSkeleton key={index} height={40} width={100} className="skeleton-tag" />
              ))}
            </div>
            <div className="skeleton-blog-grid">
              <BlogCardSkeleton />
              <div className="skeleton-blog-list">
                <BlogListItemSkeleton />
                <BlogListItemSkeleton />
                <BlogListItemSkeleton />
              </div>
              <div className="skeleton-popular-posts">
                <ThemedSkeleton height={40} width={150} className="skeleton-popular-title" />
                <div className="skeleton-popular-list">
                  <PopularPostSkeleton />
                  <PopularPostSkeleton />
                  <PopularPostSkeleton />
                </div>
              </div>
            </div>
          </div>
          
          {/* FAQ Section Skeleton */}
          <div className="skeleton-section skeleton-faq-section">
            <div className="skeleton-faq-header">
              <ThemedSkeleton height={50} width={200} />
              <ThemedSkeleton height={50} width={250} />
            </div>
            <div className="skeleton-faq-content">
              <div className="skeleton-faq-list">
                {Array(5).fill().map((_, index) => (
                  <FAQItemSkeleton key={index} />
                ))}
              </div>
              <ThemedSkeleton height={400} className="skeleton-faq-image" />
            </div>
          </div>
        </div>
      );
  }
};

export default SkeletonBlog;