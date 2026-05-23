import React from "react";
import "./achievements.css";

const TechnicalAchievements = () => {
  const achievements = [
    {
      title: "High-Scale Authentication",
      metric: "2M+ Daily Requests",
      description: "Architected and implemented distributed authentication systems handling millions of concurrent users with 99.99% uptime",
      icon: "🔐"
    },
    {
      title: "System Performance", 
      metric: "40% Latency Reduction",
      description: "Optimized microservices architecture and implemented OpenTelemetry observability, significantly improving system response times",
      icon: "⚡"
    },
    {
      title: "Infrastructure Modernization",
      metric: "Enterprise Scale",
      description: "Led migration from monolithic to microservices architecture, enabling better scalability and development velocity",
      icon: "🏗️"
    }
  ];

  return (
    <div className="achievements-section">
      <h2 className="achievements-title">Technical Impact</h2>
      <div className="achievements-grid">
        {achievements.map((achievement, index) => (
          <div key={index} className="achievement-card" data-aos="fade-up" data-aos-delay={index * 200}>
            <div className="achievement-icon">{achievement.icon}</div>
            <div className="achievement-metric">{achievement.metric}</div>
            <h3 className="achievement-title">{achievement.title}</h3>
            <p className="achievement-description">{achievement.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechnicalAchievements;