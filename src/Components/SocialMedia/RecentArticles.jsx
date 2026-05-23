import React, { useState, useEffect } from 'react';
import './RecentArticles.css';

const RecentArticles = () => {
  // Mock data - replace with your actual blog API call
  const [articles] = useState([
    {
      id: 1,
      title: "Scaling Authentication Systems to Handle 2M+ Daily Requests",
      excerpt: "Deep dive into distributed authentication architecture, implementing OpenTelemetry observability, and managing high-scale user sessions across microservices.",
      readTime: "8 min read",
      date: "Dec 10, 2024",
      category: "Distributed Systems",
      link: "/blog/scaling-authentication-systems"
    },
    {
      id: 2,
      title: "Microservices Observability: OpenTelemetry Implementation Guide", 
      excerpt: "Complete walkthrough of implementing distributed tracing, metrics collection, and logging strategies for production microservices at enterprise scale.",
      readTime: "12 min read",
      date: "Dec 5, 2024", 
      category: "Observability",
      link: "/blog/microservices-observability"
    },
    {
      id: 3,
      title: "Infrastructure Modernization: Monolith to Microservices Migration",
      excerpt: "Strategic approach to breaking down legacy systems, handling data consistency, and ensuring zero-downtime deployments during architecture transitions.",
      readTime: "15 min read",
      date: "Nov 28, 2024",
      category: "Architecture",
      link: "/blog/monolith-to-microservices"
    }
  ]);

  return (
    <div className="recent-articles-section">
      <h2 className="articles-title">Latest Technical Writing</h2>
      <div className="articles-container">
        {articles.map((article, index) => (
          <article 
            key={article.id} 
            className="article-card"
            data-aos="fade-up"
            data-aos-delay={index * 150}
          >
            <div className="article-category">{article.category}</div>
            <h3 className="article-title">
              <a href={article.link}>{article.title}</a>
            </h3>
            <p className="article-excerpt">{article.excerpt}</p>
            <div className="article-meta">
              <span className="article-date">{article.date}</span>
              <span className="article-read-time">{article.readTime}</span>
            </div>
          </article>
        ))}
      </div>
      <div className="articles-cta">
        <a href="/blog" className="view-all-btn">
          View All Articles →
        </a>
      </div>
    </div>
  );
};

export default RecentArticles;